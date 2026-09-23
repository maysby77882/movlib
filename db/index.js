import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.join(__dirname, "movlib_store.json");

// In-Memory state synced to disk for fast zero-config setup
let database = {
  media_items: {},
  media_connections: {}
};

function loadDbFromDisk() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
      database = JSON.parse(content || '{"media_items":{}, "media_connections":{}}');
    }
  } catch (err) {
    console.error("Database load error:", err.message);
  }
}

// Auto-load on module evaluation
loadDbFromDisk();

/**
 * Initialize Database
 */
export async function initDb() {
  loadDbFromDisk();
  console.log(`✓ Database initialized (${Object.keys(database.media_items).length} items in catalog)`);
}

function saveDbToDisk() {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(database, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write database to disk:", err.message);
  }
}

import { buildNarrativeProfile } from "../services/featureExtractor.js";

/**
 * Save or update a media item (Movie, TV Show, or Book)
 */
export function saveMediaItem(item) {
  if (!item || !item.id) return null;

  const rawType = (item.media_type || item.type || "movie").toLowerCase();
  const normalizedType = rawType.includes("tv") 
    ? "tv" 
    : rawType.includes("book") 
      ? "book" 
      : "movie";

  const existing = database.media_items[item.id] || {};
  
  // Extract and clean narrative features automatically
  const profile = buildNarrativeProfile(item);
  const cleanedSynopsis = profile?.cleanedSynopsis || item.synopsis || item.description || "No synopsis available.";
  const tags = profile?.allTags?.length > 0 ? profile.allTags : (Array.isArray(item.tags) ? item.tags : []);

  const record = {
    id: item.id,
    external_id: item.externalId || item.external_id || item.id,
    media_type: normalizedType,
    title: item.title,
    release_year: item.year || item.release_year || "N/A",
    creator: item.creator || item.author || item.director || "",
    synopsis: cleanedSynopsis,
    poster_url: item.posterUrl || item.poster_url || null,
    backdrop_url: item.backdropUrl || item.backdrop_url || null,
    genres: Array.isArray(item.genres) ? item.genres : [],
    keywords: Array.isArray(item.keywords) ? item.keywords : [],
    tags,
    isDirectRecommendation: Boolean(item.isDirectRecommendation || existing.isDirectRecommendation),
    thematic_features: profile ? {
      themes: profile.themes,
      concepts: profile.concepts,
      settings: profile.settings,
      moods: profile.moods,
      tropes: profile.tropes
    } : (existing.thematic_features || {}),
    narrative_profile: profile?.narrativeProfileText || existing.narrative_profile || "",
    embedding: item.embedding || existing.embedding || null,
    raw_metadata: item.raw_metadata || {},
    created_at: existing.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  database.media_items[item.id] = record;
  saveDbToDisk();
  return record;
}

/**
 * Batch save media items
 */
export function saveMediaItemsBatch(items = []) {
  const saved = [];
  for (const item of items) {
    const res = saveMediaItem(item);
    if (res) saved.push(res);
  }
  return saved;
}

/**
 * Get media item by ID
 */
export function getMediaItem(id) {
  return database.media_items[id] || null;
}

/**
 * Search local database by title query and media type
 */
export function searchLocalMedia(query, mediaType = null) {
  if (!query) return [];
  const q = query.trim().toLowerCase();

  return Object.values(database.media_items).filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(q) ||
      (item.creator && item.creator.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));

    if (mediaType) {
      const targetType = mediaType.toLowerCase().includes("tv") ? "tv" : mediaType.toLowerCase().includes("book") ? "book" : "movie";
      return matchesQuery && item.media_type === targetType;
    }

    return matchesQuery;
  });
}

/**
 * Get all stored items with pagination
 */
export function getAllMedia(options = {}) {
  const { type, limit = 50, offset = 0 } = options;
  let items = Object.values(database.media_items);

  if (type) {
    const normalizedType = type.toLowerCase().includes("tv") ? "tv" : type.toLowerCase().includes("book") ? "book" : "movie";
    items = items.filter(item => item.media_type === normalizedType);
  }

  return {
    total: items.length,
    items: items.slice(offset, offset + limit)
  };
}

/**
 * Get Catalog Statistics
 */
export function getStats() {
  const items = Object.values(database.media_items);
  const movies = items.filter(i => i.media_type === "movie").length;
  const tv = items.filter(i => i.media_type === "tv").length;
  const books = items.filter(i => i.media_type === "book").length;

  return {
    total_items: items.length,
    movies,
    tv_shows: tv,
    books,
    connections: Object.keys(database.media_connections).length
  };
}

/**
 * Save Cross-Media Thematic Connection
 */
export function saveConnection(sourceId, targetId, similarityScore = 0.0, connectionReason = "") {
  const key = `${sourceId}__${targetId}`;
  const connection = {
    id: key,
    source_id: sourceId,
    target_id: targetId,
    similarity_score: similarityScore,
    connection_reason: connectionReason,
    created_at: new Date().toISOString()
  };

  database.media_connections[key] = connection;
  saveDbToDisk();
  return connection;
}

/**
 * Get connections for a given source title
 */
export function getConnections(sourceId) {
  const connections = Object.values(database.media_connections).filter(c => c.source_id === sourceId);
  return connections.map(conn => ({
    ...conn,
    target_item: database.media_items[conn.target_id] || null
  }));
}
