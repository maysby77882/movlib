import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { searchMovies, searchTV, getMovieDetails, getTVDetails } from "./services/tmdb.js";
import { searchBooks, getBookDetails } from "./services/books.js";
import { searchWikipedia, getWikipediaDetails } from "./services/wikipedia.js";
import { performUnifiedSearch } from "./services/unifiedSearch.js";
import { initDb, saveMediaItem, saveMediaItemsBatch, getAllMedia, getStats, getMediaItem } from "./db/index.js";
import { initialSeedData } from "./db/seed.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_READ_ACCESS_TOKEN || "";
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY || "";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize Database & seed baseline if missing
await initDb();
const stats = getStats();
if (stats.total_items === 0 || stats.movies === 0) {
  console.log("Catalog requires core media baseline. Seeding initial cross-media items...");
  saveMediaItemsBatch(initialSeedData);
}

// Health check & status
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    name: "movlib API & DB Server",
    version: "1.0.0",
    database: getStats(),
    providers: {
      tmdb: Boolean(TMDB_API_KEY || TMDB_ACCESS_TOKEN) ? "active (primary movies/tv)" : "unconfigured",
      openLibrary: "active (primary books)",
      googleBooks: Boolean(GOOGLE_BOOKS_API_KEY) ? "active (enrichment)" : "public_fallback",
      wikipedia: "active (official API fallback)"
    }
  });
});

import { buildNarrativeProfile } from "./services/featureExtractor.js";
import { enrichAllDatabaseItems } from "./services/enrichmentPipeline.js";

/**
 * Database Catalog Stats Endpoint
 * Usage: GET /api/db/stats
 */
app.get("/api/db/stats", (req, res) => {
  res.json(getStats());
});

/**
 * Database Browse Endpoint
 * Usage: GET /api/db/items?type=movie&limit=20&offset=0
 */
app.get("/api/db/items", (req, res) => {
  const { type, limit, offset } = req.query;
  const result = getAllMedia({
    type,
    limit: limit ? parseInt(limit, 10) : 50,
    offset: offset ? parseInt(offset, 10) : 0
  });
  res.json(result);
});

/**
 * Feature Extraction Test Endpoint
 * Usage: POST /api/features/extract
 * Body: { title, synopsis, genres, tags }
 */
app.post("/api/features/extract", (req, res) => {
  const profile = buildNarrativeProfile(req.body);
  res.json(profile);
});

/**
 * Batch Enrichment Endpoint
 * Usage: POST /api/features/enrich-all
 */
app.post("/api/features/enrich-all", (req, res) => {
  const summary = enrichAllDatabaseItems();
  res.json(summary);
});

import { rankCandidates, scoreRecommendation } from "./services/recommender.js";

/**
 * Recommendation Endpoint by Stored Media ID
 * Usage: GET /api/recommend/:id?limit=10&type=all
 */
app.get("/api/recommend/:id", (req, res) => {
  const { id } = req.params;
  const { type, limit } = req.query;

  const source = getMediaItem(id);
  if (!source) {
    return res.status(404).json({ error: `Media item with ID '${id}' not found.` });
  }

  const { items: allCandidates } = getAllMedia({ limit: 1000 });
  const recommendations = rankCandidates(source, allCandidates, {
    filterType: type || null,
    limit: limit ? parseInt(limit, 10) : 10
  });

  res.json({
    source: {
      id: source.id,
      title: source.title,
      type: source.media_type,
      tags: source.tags
    },
    recommendations
  });
});

import { getCrossMediaRecommendations, searchEntities } from "./services/crossMediaEngine.js";
import { queryCache } from "./services/cache.js";

/**
 * Entity Search & Disambiguation Endpoint
 * Identifies exact works (e.g. Dune 2021 Movie vs Dune 1984 Movie vs Dune Novel)
 * Usage: GET /api/entities/search?q=dune
 */
app.get("/api/entities/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) return res.json({ entities: [] });

    const entities = await searchEntities(q, {
      tmdbApiKey: TMDB_API_KEY,
      tmdbAccessToken: TMDB_ACCESS_TOKEN,
      googleBooksApiKey: GOOGLE_BOOKS_API_KEY
    });

    res.json({ query: q, count: entities.length, entities });
  } catch (error) {
    console.error("Entities Search Error:", error);
    res.status(500).json({ error: "Failed to search entities." });
  }
});

/**
 * Unified Cross-Media Recommendation Endpoint across Movies, TV, and Books
 * Usage: GET /api/cross-media/recommend?q=interstellar&debug=true
 * Or: GET /api/recommendations?source=tmdb&type=movie&id=18785
 */
async function handleRecommendationRequest(req, res) {
  try {
    const { q, limit, debug, source: reqSource, type: reqType, id: reqId } = req.query;

    let targetQuery = q;
    if (!targetQuery && reqId) {
      if (reqSource === "tmdb" && reqType === "tv") {
        targetQuery = `tmdb_tv_${reqId}`;
      } else if (reqSource === "tmdb" || reqType === "movie") {
        targetQuery = `tmdb_movie_${reqId}`;
      } else if (reqSource === "wikipedia" || reqType === "wikipedia") {
        targetQuery = `wiki_${reqId}`;
      } else if (reqSource === "openlibrary" || reqType === "book") {
        targetQuery = `ol_${reqId}`;
      } else {
        targetQuery = String(reqId);
      }
    }

    if (!targetQuery || !targetQuery.trim()) {
      return res.status(400).json({ error: "Query parameter 'q' or ('source', 'type', 'id') is required." });
    }

    const isDebug = debug === "true" || debug === "1";
    const cacheKey = `cross_media_${targetQuery.trim().toLowerCase()}_${limit || 3}_${isDebug}`;
    const cachedResponse = queryCache.get(cacheKey);
    if (cachedResponse) {
      return res.json({ ...cachedResponse, cached: true });
    }

    const data = await getCrossMediaRecommendations(targetQuery, {
      tmdbApiKey: TMDB_API_KEY,
      tmdbAccessToken: TMDB_ACCESS_TOKEN,
      googleBooksApiKey: GOOGLE_BOOKS_API_KEY,
      limitPerCategory: limit ? parseInt(limit, 10) : 3,
      debug: isDebug
    });

    if (!data.source) {
      return res.status(404).json({ error: `Could not find source item for '${targetQuery}'.` });
    }

    // Cache successful response for 30 minutes
    queryCache.set(cacheKey, data, 1000 * 60 * 30);

    res.json(data);
  } catch (error) {
    console.error("Cross-Media Engine Error:", error);
    res.status(500).json({ error: "Failed to generate recommendations." });
  }
}

app.get("/api/cross-media/recommend", handleRecommendationRequest);
app.get("/api/recommendations", handleRecommendationRequest);

/**
 * Recommendation Endpoint by Query / Arbitrary Item
 * Usage: POST /api/recommend
 * Body: { source: { title, synopsis, genres, tags } }
 */
app.post("/api/recommend", (req, res) => {
  const { source, type, limit } = req.body;
  if (!source) {
    return res.status(400).json({ error: "Source payload is required." });
  }

  const { items: allCandidates } = getAllMedia({ limit: 1000 });
  const recommendations = rankCandidates(source, allCandidates, {
    filterType: type || null,
    limit: limit ? parseInt(limit, 10) : 10
  });

  res.json({ source, recommendations });
});

/**
 * Seed Database Endpoint
 * Usage: POST /api/db/seed
 */
app.post("/api/db/seed", (req, res) => {
  const saved = saveMediaItemsBatch(initialSeedData);
  res.json({ message: `Seeded ${saved.length} items successfully`, stats: getStats() });
});

/**
 * Unified search endpoint across Movies, TV, and Books
 * Usage: GET /api/search?q=the%20proposal
 */
app.get("/api/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ error: "Query parameter 'q' is required." });
    }

    const data = await performUnifiedSearch(q, {
      tmdbApiKey: TMDB_API_KEY,
      tmdbAccessToken: TMDB_ACCESS_TOKEN,
      googleBooksApiKey: GOOGLE_BOOKS_API_KEY
    });

    // Cache ingested items to DB
    const allFound = [
      ...(data.results?.movies || []),
      ...(data.results?.tv || []),
      ...(data.results?.books || [])
    ];
    if (allFound.length > 0) {
      saveMediaItemsBatch(allFound);
    }

    res.json(data);
  } catch (error) {
    console.error("Unified Search Error:", error);
    res.status(500).json({ error: "Failed to perform search" });
  }
});

/**
 * Movies Search Endpoint
 */
app.get("/api/movies", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query 'q' is required." });
    const results = await searchMovies(q, TMDB_API_KEY);
    saveMediaItemsBatch(results);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * TV Shows Search Endpoint
 */
app.get("/api/tv", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query 'q' is required." });
    const results = await searchTV(q, TMDB_API_KEY);
    saveMediaItemsBatch(results);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Books Search Endpoint
 */
app.get("/api/books", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query 'q' is required." });
    const results = await searchBooks(q, GOOGLE_BOOKS_API_KEY);
    saveMediaItemsBatch(results);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Wikipedia Search Endpoint (Fallback reference)
 */
app.get("/api/wikipedia", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query 'q' is required." });
    const results = await searchWikipedia(q);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Detailed Metadata Endpoint
 * Usage: GET /api/details?type=movie&id=157336
 */
app.get("/api/details", async (req, res) => {
  try {
    const { type, id } = req.query;
    if (!type || !id) {
      return res.status(400).json({ error: "Both 'type' (movie|tv|book|wikipedia) and 'id' are required." });
    }

    // Check DB first
    const cached = getMediaItem(id);
    if (cached && cached.synopsis && cached.synopsis !== "No synopsis available.") {
      return res.json(cached);
    }

    let details = null;
    const normType = String(type).toLowerCase();
    const strId = String(id);

    if (normType === "wikipedia" || normType === "reference" || strId.startsWith("wiki_")) {
      details = await getWikipediaDetails(id);
    } else if (normType === "movie") {
      details = await getMovieDetails(id, TMDB_API_KEY);
    } else if (normType === "tv" || normType === "tv show") {
      details = await getTVDetails(id, TMDB_API_KEY);
    } else if (normType === "book") {
      details = await getBookDetails(id, GOOGLE_BOOKS_API_KEY);
    }

    if (!details) {
      // Fallback check to Wikipedia details if external ID was not found
      details = await getWikipediaDetails(id);
    }

    if (!details) {
      return res.status(404).json({ error: `Details not found for ${type} with id ${id}` });
    }

    // Cache detailed item
    saveMediaItem(details);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fallback to index.html for root navigation
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start listening when executed directly
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    const currentStats = getStats();
    console.log(`\n✦ movlib Server running at http://localhost:${PORT}`);
    console.log(`- Database: Active (${currentStats.total_items} items in catalog)`);
    console.log(`- TMDb API Key: ${TMDB_API_KEY ? "Configured ✓" : "Missing (Set in .env)"}`);
    console.log(`- Google Books API Key: ${GOOGLE_BOOKS_API_KEY ? "Configured ✓" : "Public Tier Active"}\n`);
  });
}

export default app;


