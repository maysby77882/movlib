import { getAllMedia, searchLocalMedia, getMediaItem, saveMediaItemsBatch, saveMediaItem } from "../db/index.js";
import { buildNarrativeProfile } from "./featureExtractor.js";
import { rankCandidates, scoreRecommendation } from "./recommender.js";
import { performUnifiedSearch } from "./unifiedSearch.js";
import { getMovieDetails, getTVDetails } from "./tmdb.js";
import { getBookDetails } from "./books.js";
import { getWikipediaDetails } from "./wikipedia.js";

/**
 * STEP 1: Search & Entity Identification (Disambiguation)
 * Returns distinct candidate works matching query across movies, TV, and books
 * (e.g. 'Dune' -> Dune 2021 Movie, Dune 1984 Movie, Dune Novel)
 * Follows primary source priority with Wikipedia fallback.
 */
export async function searchEntities(query, config = {}) {
  const { tmdbApiKey = "", tmdbAccessToken = "", googleBooksApiKey = "" } = config;
  if (!query || !query.trim()) return [];

  const cleanQuery = query.trim();

  // Search across local DB + primary external APIs (with Wikipedia fallback)
  const localMatches = searchLocalMedia(cleanQuery);
  const searchRes = await performUnifiedSearch(cleanQuery, { tmdbApiKey, tmdbAccessToken, googleBooksApiKey });

  const allFound = [
    ...localMatches,
    ...(searchRes.results?.movies || []),
    ...(searchRes.results?.tv || []),
    ...(searchRes.results?.books || []),
    ...(searchRes.results?.fallback || [])
  ];

  // De-duplicate by ID / Title-Type-Year, prioritizing verified TMDB/OpenLibrary sources
  const seen = new Set();
  const entities = [];

  for (const item of allFound) {
    const normTitle = (item.title || "").toLowerCase().trim();
    const normType = (item.type || item.media_type || "reference").toLowerCase();
    const key = `${item.id || item.externalId || normTitle}__${normType}`;

    if (!seen.has(key)) {
      seen.add(key);

      const source = item.source || (item.id?.startsWith("wiki_") ? "wikipedia" : normType === "book" ? "openlibrary" : "tmdb");

      entities.push({
        id: item.id,
        externalId: item.externalId || item.external_id || item.id,
        source,
        title: item.title,
        type: item.type || (item.media_type === "tv" ? "TV Show" : item.media_type === "book" ? "Book" : item.media_type === "movie" ? "Movie" : "unknown"),
        media_type: normType,
        year: item.year || item.release_year || "N/A",
        creator: item.creator || item.author || "",
        synopsis: item.synopsis || "No description available.",
        posterUrl: item.posterUrl || item.poster_url || null,
        externalUrl: item.externalUrl || null,
        sourceUrl: item.sourceUrl || item.externalUrl || null
      });
    }
  }

  return entities.slice(0, 15);
}

/**
 * STEP 2-6: Content-Driven Cross-Media Recommendation Engine
 * Takes an EXACT identified work, builds its multi-dimensional content representation,
 * and retrieves thematic parallels across Movies, TV Shows, and Books.
 */
export async function getCrossMediaRecommendations(queryOrItem, config = {}) {
  const { tmdbApiKey = "", tmdbAccessToken = "", googleBooksApiKey = "", limitPerCategory = 3 } = config;

  let sourceItem = null;
  let candidateEntities = [];

  // 1. Resolve exact source item
  if (typeof queryOrItem === "string") {
    const query = queryOrItem.trim();

    // Check if query is an exact ID in local database
    const directDbItem = getMediaItem(query);
    if (directDbItem) {
      sourceItem = directDbItem;
      candidateEntities = await searchEntities(sourceItem.title, { tmdbApiKey, tmdbAccessToken, googleBooksApiKey });
    } else if (query.startsWith("tmdb_movie_")) {
      const extId = query.replace("tmdb_movie_", "");
      const details = await getMovieDetails(extId, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken });
      if (details) {
        sourceItem = { id: query, externalId: extId, source: "tmdb", ...details };
        candidateEntities = await searchEntities(sourceItem.title, { tmdbApiKey, tmdbAccessToken, googleBooksApiKey });
      }
    } else if (query.startsWith("tmdb_tv_")) {
      const extId = query.replace("tmdb_tv_", "");
      const details = await getTVDetails(extId, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken });
      if (details) {
        sourceItem = { id: query, externalId: extId, source: "tmdb", ...details };
        candidateEntities = await searchEntities(sourceItem.title, { tmdbApiKey, tmdbAccessToken, googleBooksApiKey });
      }
    } else if (query.startsWith("wiki_")) {
      const extId = query.replace("wiki_", "");
      const details = await getWikipediaDetails(extId);
      if (details) {
        sourceItem = { id: query, externalId: extId, source: "wikipedia", ...details };
        candidateEntities = await searchEntities(sourceItem.title, { tmdbApiKey, tmdbAccessToken, googleBooksApiKey });
      }
    } else if (query.startsWith("ol_")) {
      const extId = query.replace("ol_", "");
      const details = await getBookDetails(extId, { googleBooksApiKey });
      if (details) {
        sourceItem = { id: query, externalId: extId, source: "openlibrary", ...details };
        candidateEntities = await searchEntities(sourceItem.title, { tmdbApiKey, tmdbAccessToken, googleBooksApiKey });
      }
    } else {
      // Find candidate entities across live APIs (TMDB -> Wikipedia) and pick best match
      candidateEntities = await searchEntities(query, { tmdbApiKey, tmdbAccessToken, googleBooksApiKey });
      if (candidateEntities.length > 0) {
        sourceItem = candidateEntities[0];
      }
    }
  } else if (queryOrItem && typeof queryOrItem === "object") {
    sourceItem = queryOrItem;
    candidateEntities = await searchEntities(sourceItem.title, { tmdbApiKey, tmdbAccessToken, googleBooksApiKey });
  }

  if (!sourceItem) {
    return {
      source: null,
      matchedEntities: [],
      recommendations: { movies: [], tv: [], books: [] }
    };
  }

  // Hydrate full detailed metadata if needed
  if (!sourceItem.thematic_features || !sourceItem.synopsis || sourceItem.synopsis.length < 50) {
    try {
      if ((sourceItem.type === "Movie" || sourceItem.media_type === "movie") && sourceItem.externalId && (tmdbApiKey || tmdbAccessToken) && sourceItem.source !== "wikipedia") {
        const fullDetails = await getMovieDetails(sourceItem.externalId, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken });
        if (fullDetails) sourceItem = { ...sourceItem, ...fullDetails };
      } else if ((sourceItem.type === "TV Show" || sourceItem.media_type === "tv") && sourceItem.externalId && (tmdbApiKey || tmdbAccessToken) && sourceItem.source !== "wikipedia") {
        const fullDetails = await getTVDetails(sourceItem.externalId, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken });
        if (fullDetails) sourceItem = { ...sourceItem, ...fullDetails };
      } else if ((sourceItem.type === "Book" || sourceItem.media_type === "book") && sourceItem.externalId && sourceItem.source !== "wikipedia") {
        const fullDetails = await getBookDetails(sourceItem.externalId, { googleBooksApiKey });
        if (fullDetails) sourceItem = { ...sourceItem, ...fullDetails };
      } else if (sourceItem.source === "wikipedia" || String(sourceItem.id).startsWith("wiki_")) {
        const wikiDetails = await getWikipediaDetails(sourceItem.externalId || sourceItem.id);
        if (wikiDetails) sourceItem = { ...sourceItem, ...wikiDetails };
      }
    } catch (e) {
      // Continue with available data
    }
  }

  // 2. Build multi-dimensional narrative content representation (Themes, Concepts, Setting, Mood, Conflict)
  const sourceProfile = buildNarrativeProfile(sourceItem);
  const enrichedSource = {
    ...sourceItem,
    synopsis: sourceProfile?.cleanedSynopsis || sourceItem.synopsis,
    tags: sourceProfile?.allTags || sourceItem.tags || [],
    thematic_features: sourceProfile ? {
      themes: sourceProfile.themes,
      concepts: sourceProfile.concepts,
      settings: sourceProfile.settings,
      moods: sourceProfile.moods,
      tropes: sourceProfile.tropes
    } : (sourceItem.thematic_features || {}),
    narrative_profile: sourceProfile?.narrativeProfileText || sourceItem.narrative_profile || ""
  };

  saveMediaItem(enrichedSource);

  // 3. Candidate Retrieval: Gather candidates from database & themed API queries
  const { items: allDbCandidates } = getAllMedia({ limit: 5000 });
  
  // Exclude source item and direct title matches in same medium to guarantee conceptual recommendations
  const sourceRootTitle = (enrichedSource.title || "").toLowerCase().replace(/[:\-\d]/g, "").trim();
  let candidatePool = allDbCandidates.filter(item => {
    if (item.id === enrichedSource.id) return false;
    const candRoot = (item.title || "").toLowerCase().replace(/[:\-\d]/g, "").trim();
    if (candRoot === sourceRootTitle && item.media_type === (enrichedSource.type || enrichedSource.media_type).toLowerCase()) {
      return false;
    }
    return true;
  });

  // Expand candidate pool across all 3 media types using extracted core themes/concepts
  const topTheme = enrichedSource.thematic_features?.themes?.[0] || "";
  const topConcept = enrichedSource.thematic_features?.concepts?.[0] || "";
  const queryTheme = (topConcept || topTheme || "").split(" ")[0];

  if (queryTheme) {
    try {
      const themeSearch = await performUnifiedSearch(queryTheme, { tmdbApiKey, tmdbAccessToken, googleBooksApiKey });
      const newItems = [
        ...(themeSearch.results?.movies || []),
        ...(themeSearch.results?.tv || []),
        ...(themeSearch.results?.books || [])
      ];
      if (newItems.length > 0) {
        saveMediaItemsBatch(newItems);
        const refreshed = getAllMedia({ limit: 5000 });
        candidatePool = refreshed.items.filter(item => item.id !== enrichedSource.id);
      }
    } catch (e) {
      // Continue with existing candidates
    }
  }

  // 4. Content-Only Semantic & Hybrid Ranking (Title weight = 0.00 to eliminate word matching bias)
  const topMovies = rankCandidates(enrichedSource, candidatePool, {
    filterType: "movie",
    limit: limitPerCategory,
    minScore: 0.0
  });

  const topTV = rankCandidates(enrichedSource, candidatePool, {
    filterType: "tv",
    limit: limitPerCategory,
    minScore: 0.0
  });

  const topBooks = rankCandidates(enrichedSource, candidatePool, {
    filterType: "book",
    limit: limitPerCategory,
    minScore: 0.0
  });

  // 5. Format response with explainable narrative connections
  const formatList = (scoredEntries) => scoredEntries.map(entry => {
    const item = entry.item;
    const matchPct = Math.round(entry.similarityScore * 100);
    const shared = entry.sharedThemes || [];
    const whyBullets = entry.whyBullets || [];
    
    let whySummary = "Connected by shared narrative concepts, story atmosphere, and thematic resonance.";
    if (whyBullets.length > 0) {
      whySummary = whyBullets.join(" · ");
    } else if (shared.length > 0) {
      whySummary = `Explores shared themes and concepts of ${shared.slice(0, 3).join(", ")}.`;
    }

    return {
      id: item.id,
      title: item.title,
      type: item.media_type === "tv" ? "TV Show" : item.media_type === "book" ? "Book" : "Movie",
      source: item.source || (item.id?.startsWith("wiki_") ? "wikipedia" : item.media_type === "book" ? "openlibrary" : "tmdb"),
      year: item.release_year || item.year || "N/A",
      creator: item.creator || "",
      synopsis: item.synopsis || "No synopsis available.",
      posterUrl: item.poster_url || item.posterUrl || null,
      genres: item.genres || [],
      tags: item.tags || [],
      matchScore: matchPct,
      why: whySummary,
      whyBullets,
      sharedThemes: shared
    };
  });

  return {
    source: {
      id: enrichedSource.id,
      title: enrichedSource.title,
      type: enrichedSource.type || (enrichedSource.media_type === "tv" ? "TV Show" : enrichedSource.media_type === "book" ? "Book" : "Movie"),
      source: enrichedSource.source || (enrichedSource.id?.startsWith("wiki_") ? "wikipedia" : enrichedSource.media_type === "book" ? "openlibrary" : "tmdb"),
      year: enrichedSource.release_year || enrichedSource.year || "N/A",
      creator: enrichedSource.creator || "",
      synopsis: enrichedSource.synopsis || "No synopsis available.",
      posterUrl: enrichedSource.poster_url || enrichedSource.posterUrl || null,
      tags: enrichedSource.tags || [],
      externalUrl: enrichedSource.externalUrl || enrichedSource.sourceUrl || null
    },
    matchedEntities: candidateEntities || [],
    recommendations: {
      movies: formatList(topMovies),
      tv: formatList(topTV),
      books: formatList(topBooks)
    }
  };
}
