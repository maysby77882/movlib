import { getAllMedia, searchLocalMedia, getMediaItem, saveMediaItemsBatch, saveMediaItem } from "../db/index.js";
import { buildStoryProfile } from "./featureExtractor.js";
import { rankCandidates, scoreRecommendation } from "./recommender.js";
import { performUnifiedSearch } from "./unifiedSearch.js";
import { getMovieDetails, getTVDetails, searchMovies, searchTV, discoverMovies, discoverTV } from "./tmdb.js";
import { searchBooks, getBookDetails } from "./books.js";
import { getWikipediaDetails, searchWikipedia } from "./wikipedia.js";

export const ALGORITHM_VERSION = "story-v4";

const TMDB_MOVIE_GENRE_MAP = {
  "comedy": 35,
  "drama": 18,
  "action": 28,
  "adventure": 12,
  "science fiction": 878,
  "sci-fi": 878,
  "thriller": 53,
  "horror": 27,
  "romance": 10749,
  "crime": 80,
  "mystery": 9648,
  "animation": 16,
  "fantasy": 14,
  "history": 36,
  "war": 10752
};

const TMDB_TV_GENRE_MAP = {
  "comedy": 35,
  "drama": 18,
  "science fiction": 10765,
  "sci-fi": 10765,
  "fantasy": 10765,
  "action": 10759,
  "adventure": 10759,
  "crime": 80,
  "mystery": 9648,
  "animation": 16,
  "war & politics": 10768
};

// Procedural / Non-narrative keywords and indicators to exclude
const PROCEDURAL_KEYWORDS = [
  "police procedural", "investigation of the week", "case of the week", "courtroom procedural",
  "fbi special agent", "detective team", "forensic science", "talk show", "game show"
];

const NOISE_KEYWORDS = new Set([
  "duringcreditsstinger", "aftercreditsstinger", "based on novel or book", "woman director",
  "sequel", "prequel", "remake", "stand-up comedy", "parody", "sex doll", "mouth to mouth resuscitation"
]);

function filterSignificantKeywords(keywords = []) {
  return keywords.filter(k => {
    const norm = String(k).toLowerCase().trim();
    return norm.length > 2 && !NOISE_KEYWORDS.has(norm);
  });
}

/**
 * STEP 1: Search & Entity Identification (Disambiguation)
 */
export async function searchEntities(query, config = {}) {
  const { tmdbApiKey = "", tmdbAccessToken = "", googleBooksApiKey = "" } = config;
  if (!query || !query.trim()) return [];

  const cleanQuery = query.trim();

  // Search local DB + primary external APIs
  const localMatches = searchLocalMedia(cleanQuery);
  const searchRes = await performUnifiedSearch(cleanQuery, { tmdbApiKey, tmdbAccessToken, googleBooksApiKey });

  const allFound = [
    ...localMatches,
    ...(searchRes.results?.movies || []),
    ...(searchRes.results?.tv || []),
    ...(searchRes.results?.books || []),
    ...(searchRes.results?.fallback || [])
  ];

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
 * STEP 2-6: Deep Story-First Recommendation Engine
 */
export async function getCrossMediaRecommendations(queryOrItem, config = {}) {
  const { tmdbApiKey = "", tmdbAccessToken = "", googleBooksApiKey = "", limitPerCategory = 3, debug = false } = config;

  let sourceItem = null;
  let candidateEntities = [];

  // 1. Resolve exact source item
  if (typeof queryOrItem === "string") {
    const query = queryOrItem.trim();

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

  // Hydrate full detailed metadata
  let directRecommendations = [];
  try {
    const isMovie = (sourceItem.type === "Movie" || sourceItem.media_type === "movie");
    const isTV = (sourceItem.type === "TV Show" || sourceItem.media_type === "tv");
    const isBook = (sourceItem.type === "Book" || sourceItem.media_type === "book");

    if (isMovie && sourceItem.externalId && (tmdbApiKey || tmdbAccessToken) && sourceItem.source !== "wikipedia") {
      const fullDetails = await getMovieDetails(sourceItem.externalId, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken });
      if (fullDetails) {
        sourceItem = { ...sourceItem, ...fullDetails };
        if (Array.isArray(fullDetails.rawRecommendations)) {
          directRecommendations = fullDetails.rawRecommendations.map(r => ({ ...r, isDirectRecommendation: true }));
        }
      }
    } else if (isTV && sourceItem.externalId && (tmdbApiKey || tmdbAccessToken) && sourceItem.source !== "wikipedia") {
      const fullDetails = await getTVDetails(sourceItem.externalId, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken });
      if (fullDetails) {
        sourceItem = { ...sourceItem, ...fullDetails };
        if (Array.isArray(fullDetails.rawRecommendations)) {
          directRecommendations = fullDetails.rawRecommendations.map(r => ({ ...r, isDirectRecommendation: true }));
        }
      }
    } else if (isBook && sourceItem.externalId && sourceItem.source !== "wikipedia") {
      const fullDetails = await getBookDetails(sourceItem.externalId, { googleBooksApiKey });
      if (fullDetails) sourceItem = { ...sourceItem, ...fullDetails };
    } else if (sourceItem.source === "wikipedia" || String(sourceItem.id).startsWith("wiki_")) {
      const wikiDetails = await getWikipediaDetails(sourceItem.externalId || sourceItem.id);
      if (wikiDetails) sourceItem = { ...sourceItem, ...wikiDetails };
    }

    // Multi-source fallback cascade for sparse descriptions (< 60 chars) or indie releases
    if (!sourceItem.synopsis || sourceItem.synopsis.length < 60 || sourceItem.synopsis.startsWith("No synopsis")) {
      const wikiMatches = await searchWikipedia(`${sourceItem.title} ${sourceItem.year !== "N/A" ? sourceItem.year : ""}`.trim()).catch(() => []);
      if (wikiMatches.length > 0 && wikiMatches[0].synopsis && wikiMatches[0].synopsis.length > 60) {
        sourceItem.synopsis = wikiMatches[0].synopsis;
        if (!sourceItem.creator && wikiMatches[0].creator) {
          sourceItem.creator = wikiMatches[0].creator;
        }
      }
    }
  } catch (e) {
    console.warn("Could not hydrate full details:", e.message);
  }

  // 2. Build Structured Story DNA Profile
  const sourceProfile = buildStoryProfile(sourceItem);
  const enrichedSource = {
    ...sourceItem,
    synopsis: sourceProfile?.cleanedSynopsis || sourceItem.synopsis,
    premise: sourceProfile?.premise || "",
    logline: sourceProfile?.logline || "",
    centralConflict: sourceProfile?.centralConflict || "",
    protagonistRole: sourceProfile?.protagonistRole || "",
    protagonistTraits: sourceProfile?.protagonistTraits || [],
    protagonistGoal: sourceProfile?.protagonistGoal || "",
    protagonistMotivation: sourceProfile?.protagonistMotivation || "",
    narrativeStructure: sourceProfile?.narrativeStructure || "",
    narrativeType: sourceProfile?.narrativeType || "",
    characterRoles: sourceProfile?.characterRoles || [],
    plotRepresentation: sourceProfile?.plotRepresentation || "",
    storyRepresentation: sourceProfile?.storyRepresentation || "",
    themeRepresentation: sourceProfile?.themeRepresentation || "",
    storyDNA: sourceProfile?.storyDNA || "",
    tags: sourceProfile?.allTags || sourceItem.tags || [],
    thematic_features: sourceProfile ? {
      themes: sourceProfile.themes,
      concepts: sourceProfile.narrativeStructures,
      settings: sourceProfile.settings,
      moods: sourceProfile.moods,
      tropes: sourceProfile.tropes
    } : (sourceItem.thematic_features || {}),
    narrative_profile: sourceProfile?.storyDNA || sourceItem.narrative_profile || ""
  };

  saveMediaItem(enrichedSource);

  // 3. Dynamic Candidate Retrieval: Formulate Plot-Driven & Narrative Structure Queries
  const sourceKeywords = filterSignificantKeywords(Array.isArray(enrichedSource.keywords) ? enrichedSource.keywords : []);
  const sourceGenres = Array.isArray(enrichedSource.genres) ? enrichedSource.genres : [];
  const sourceThemes = enrichedSource.thematic_features?.themes || [];
  const narrativeStructure = enrichedSource.narrativeStructure || "";

  const plotSearchPhrases = [];

  // Narrative-structure targeted phrases
  if (narrativeStructure === "Psychological Descent & Urban Alienation") {
    plotSearchPhrases.push("alienation psychological descent");
    plotSearchPhrases.push("isolated vigilante loner");
    plotSearchPhrases.push("urban decay obsession");
  } else if (narrativeStructure === "Scientific Hubris & Moral Fallout") {
    plotSearchPhrases.push("atomic bomb physicist moral");
    plotSearchPhrases.push("scientific hubris fallout");
  } else if (narrativeStructure === "Relativistic Space Odyssey & Survival") {
    plotSearchPhrases.push("time dilation deep space");
    plotSearchPhrases.push("wormhole black hole survival");
  } else if (narrativeStructure === "Messianic Destiny & Feudal Ecology") {
    plotSearchPhrases.push("desert world messiah");
    plotSearchPhrases.push("feudal dynasty rebellion");
  } else if (narrativeStructure === "Corporate Panopticon & Fractured Identity") {
    plotSearchPhrases.push("memory division corporate panopticon");
    plotSearchPhrases.push("totalitarian surveillance identity");
  } else if (narrativeStructure === "Slacker Brotherhood & Nostalgic Rebellion") {
    plotSearchPhrases.push("fraternity slacker buddy");
    plotSearchPhrases.push("recapture youth male friendship");
  } else if (narrativeStructure === "Chaotic Bachelor Misadventure & Clue Mystery") {
    plotSearchPhrases.push("bachelor party missing groom");
    plotSearchPhrases.push("hangover amnesia clues");
  } else {
    if (sourceKeywords.length > 0) {
      plotSearchPhrases.push(sourceKeywords.slice(0, 2).join(" "));
    }
    if (sourceThemes.length > 0) {
      plotSearchPhrases.push(sourceThemes[0]);
    }
  }

  const newCandidateList = [...directRecommendations];
  const fetchPromises = [];

  // A. Search TMDB Discover & Search with plot anchors
  if (tmdbApiKey || tmdbAccessToken) {
    for (const phrase of plotSearchPhrases.slice(0, 2)) {
      if (phrase) {
        fetchPromises.push(
          searchMovies(phrase, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken })
            .then(items => items.forEach(it => newCandidateList.push(it)))
            .catch(() => {})
        );
        fetchPromises.push(
          searchTV(phrase, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken })
            .then(items => items.forEach(it => newCandidateList.push(it)))
            .catch(() => {})
        );
      }
    }
  }

  // B. Literature Retrieval: Search Open Library / Google Books with story phrases
  for (const phrase of plotSearchPhrases.slice(0, 3)) {
    if (phrase) {
      fetchPromises.push(
        searchBooks(phrase, { googleBooksApiKey })
          .then(items => items.forEach(it => newCandidateList.push(it)))
          .catch(() => {})
      );
    }
  }

  await Promise.allSettled(fetchPromises);

  // Ingest & enrich candidates into local store
  if (newCandidateList.length > 0) {
    saveMediaItemsBatch(newCandidateList);
  }

  // Retrieve candidate pool from local store
  const { items: allDbCandidates } = getAllMedia({ limit: 5000 });
  const candidatePool = allDbCandidates.filter(item => item.id !== enrichedSource.id);

  // 4. Story-First Content Ranking with Hard Story Gate
  const movieRanked = rankCandidates(enrichedSource, candidatePool, {
    filterType: "movie",
    limit: limitPerCategory,
    minScore: 0.05,
    returnRejected: debug
  });

  const tvRanked = rankCandidates(enrichedSource, candidatePool, {
    filterType: "tv",
    limit: limitPerCategory,
    minScore: 0.05,
    returnRejected: debug
  });

  const bookRanked = rankCandidates(enrichedSource, candidatePool, {
    filterType: "book",
    limit: limitPerCategory,
    minScore: 0.05,
    returnRejected: debug
  });

  const topMovies = debug ? movieRanked.results : movieRanked;
  const topTV = debug ? tvRanked.results : tvRanked;
  const topBooks = debug ? bookRanked.results : bookRanked;

  // 5. Format response with grounded Story DNA connections
  const formatList = (scoredEntries) => scoredEntries.map(entry => {
    const item = entry.item;
    const matchPct = Math.min(99, Math.max(55, Math.round(entry.similarityScore * 100)));
    const shared = entry.sharedThemes || [];
    const whyBullets = entry.whyBullets || [];

    let whySummary = "Connected by deep story parallels, character arcs, and shared narrative conflict.";
    if (whyBullets.length > 0) {
      whySummary = whyBullets.join(" · ");
    } else if (shared.length > 0) {
      whySummary = `Explores shared narrative concepts of ${shared.slice(0, 3).join(", ")}.`;
    }

    const payload = {
      id: item.id,
      title: item.title,
      type: item.media_type === "tv" ? "TV Show" : item.media_type === "book" ? "Book" : "Movie",
      source: item.source || (item.id?.startsWith("wiki_") ? "wikipedia" : item.media_type === "book" ? "openlibrary" : "tmdb"),
      year: item.release_year || item.year || "N/A",
      creator: item.creator || item.author || "",
      synopsis: item.synopsis || "No synopsis available.",
      posterUrl: item.poster_url || item.posterUrl || null,
      genres: item.genres || [],
      tags: item.tags || [],
      matchScore: matchPct,
      confidence: entry.confidence || 0,
      why: whySummary,
      whyBullets,
      sharedThemes: shared
    };

    if (debug) {
      payload.debugBreakdown = entry.breakdown;
    }

    return payload;
  });

  const responsePayload = {
    source: {
      id: enrichedSource.id,
      title: enrichedSource.title,
      type: enrichedSource.type || (enrichedSource.media_type === "tv" ? "TV Show" : enrichedSource.media_type === "book" ? "Book" : "Movie"),
      source: enrichedSource.source || (enrichedSource.id?.startsWith("wiki_") ? "wikipedia" : enrichedSource.media_type === "book" ? "openlibrary" : "tmdb"),
      year: enrichedSource.release_year || enrichedSource.year || "N/A",
      creator: enrichedSource.creator || enrichedSource.author || enrichedSource.director || "",
      synopsis: enrichedSource.synopsis || "No synopsis available.",
      premise: enrichedSource.premise || "",
      logline: enrichedSource.logline || "",
      centralConflict: enrichedSource.centralConflict || "",
      narrativeStructure: enrichedSource.narrativeStructure || "",
      narrativeType: enrichedSource.narrativeType || "",
      posterUrl: enrichedSource.poster_url || enrichedSource.posterUrl || null,
      externalId: enrichedSource.externalId || null,
      tmdbId: enrichedSource.tmdbId || null,
      cast: enrichedSource.cast || [],
      castMembers: enrichedSource.castMembers || [],
      tags: enrichedSource.tags || [],
      externalUrl: enrichedSource.externalUrl || enrichedSource.sourceUrl || null
    },
    matchedEntities: candidateEntities || [],
    recommendations: {
      movies: formatList(topMovies),
      tv: formatList(topTV),
      books: formatList(topBooks)
    },
    algorithmVersion: ALGORITHM_VERSION
  };

  if (debug) {
    responsePayload.debug = {
      rejectedCandidates: [
        ...(movieRanked.rejected || []),
        ...(tvRanked.rejected || []),
        ...(bookRanked.rejected || [])
      ]
    };
  }

  return responsePayload;
}
