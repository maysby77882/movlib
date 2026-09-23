import { getAllMedia, searchLocalMedia, getMediaItem, saveMediaItemsBatch, saveMediaItem } from "../db/index.js";
import { buildStoryProfile } from "./featureExtractor.js";
import { rankCandidates, scoreRecommendation } from "./recommender.js";
import { performUnifiedSearch } from "./unifiedSearch.js";
import { getMovieDetails, getTVDetails, searchMovies, searchTV, discoverMovies, discoverTV } from "./tmdb.js";
import { searchBooks, getBookDetails } from "./books.js";
import { getWikipediaDetails, searchWikipedia } from "./wikipedia.js";

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

// Filter out noise keywords to focus on strong story anchors
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
 * Returns distinct candidate works matching query across movies, TV, and books
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
 * STEP 2-6: Deep Plot & Story DNA Recommendation Engine
 * Takes an EXACT identified work, constructs its full Story DNA & Plot Representation,
 * and dynamically retrieves and ranks candidates based on deep story and plot similarity.
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

  // Hydrate full detailed metadata (genres, keywords, director, synopsis, recommendations)
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
  } catch (e) {
    console.warn("Could not hydrate full details:", e.message);
  }

  // 2. Build Multi-Dimensional Story DNA Profile
  const sourceProfile = buildStoryProfile(sourceItem);
  const enrichedSource = {
    ...sourceItem,
    synopsis: sourceProfile?.cleanedSynopsis || sourceItem.synopsis,
    premise: sourceProfile?.premise || "",
    centralConflict: sourceProfile?.centralConflict || "",
    protagonistGoal: sourceProfile?.protagonistGoal || "",
    narrativeType: sourceProfile?.narrativeType || "",
    characterRoles: sourceProfile?.characterRoles || [],
    plotRepresentation: sourceProfile?.plotRepresentation || "",
    storyDNA: sourceProfile?.storyDNA || "",
    tags: sourceProfile?.allTags || sourceItem.tags || [],
    thematic_features: sourceProfile ? {
      themes: sourceProfile.themes,
      concepts: sourceProfile.concepts,
      settings: sourceProfile.settings,
      moods: sourceProfile.moods,
      tropes: sourceProfile.tropes
    } : (sourceItem.thematic_features || {}),
    narrative_profile: sourceProfile?.storyDNA || sourceItem.narrative_profile || ""
  };

  saveMediaItem(enrichedSource);

  // 3. Dynamic Candidate Retrieval: Formulate Plot-Driven Targeted Queries
  const sourceKeywords = filterSignificantKeywords(Array.isArray(enrichedSource.keywords) ? enrichedSource.keywords : []);
  const sourceGenres = Array.isArray(enrichedSource.genres) ? enrichedSource.genres : [];
  const sourceThemes = enrichedSource.thematic_features?.themes || [];
  const sourceConcepts = enrichedSource.thematic_features?.concepts || [];

  const primaryGenre = sourceGenres[0] || "";
  const primaryGenreLower = primaryGenre.toLowerCase();

  // Find most descriptive plot anchors
  const topAnchor1 = sourceKeywords.find(k => [
    "bachelor party", "hangover", "las vegas", "atomic bomb", "manhattan project", "nuclear", "physicist",
    "space", "time dilation", "wormhole", "fraternity", "college", "friendship", "detective", "vigilante",
    "joker", "gotham", "heist", "superhero", "dystopia", "alien", "robot", "war", "survival"
  ].some(core => k.toLowerCase().includes(core))) || sourceKeywords[0] || "";

  const topAnchor2 = sourceKeywords.find(k => k !== topAnchor1 && filterSignificantKeywords([k]).length > 0) || "";

  const newCandidateList = [...directRecommendations];
  const fetchPromises = [];

  // Plot-driven search phrases
  const plotSearchPhrases = [];
  if (topAnchor1 && topAnchor2) {
    plotSearchPhrases.push(`${topAnchor1} ${topAnchor2}`);
  }
  if (topAnchor1) {
    plotSearchPhrases.push(`${topAnchor1} ${primaryGenre}`.trim());
    plotSearchPhrases.push(topAnchor1);
  }
  if (sourceConcepts.length > 0) {
    plotSearchPhrases.push(sourceConcepts[0]);
  }
  if (sourceThemes.length > 0) {
    plotSearchPhrases.push(sourceThemes[0]);
  }

  // A. Search TMDB Discover & Search
  if (tmdbApiKey || tmdbAccessToken) {
    // TV Discover by Genre (Excludes talk shows / reality)
    const tvGenreId = TMDB_TV_GENRE_MAP[primaryGenreLower];
    if (tvGenreId) {
      fetchPromises.push(
        discoverTV({ withGenres: String(tvGenreId) }, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken })
          .then(items => items.forEach(it => {
            if (primaryGenre) it.genres = [primaryGenre];
            newCandidateList.push(it);
          }))
          .catch(() => {})
      );
    }

    // Movie Discover by Genre (if source was TV or Book)
    const movieGenreId = TMDB_MOVIE_GENRE_MAP[primaryGenreLower];
    if (movieGenreId && enrichedSource.media_type !== "movie") {
      fetchPromises.push(
        discoverMovies({ withGenres: String(movieGenreId) }, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken })
          .then(items => items.forEach(it => {
            if (primaryGenre) it.genres = [primaryGenre];
            newCandidateList.push(it);
          }))
          .catch(() => {})
      );
    }

    // Targeted TV Search with plot anchor
    for (const phrase of plotSearchPhrases.slice(0, 2)) {
      if (phrase) {
        fetchPromises.push(
          searchTV(phrase, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken })
            .then(items => items.forEach(it => {
              if (primaryGenre) it.genres = [primaryGenre];
              newCandidateList.push(it);
            }))
            .catch(() => {})
        );
      }
    }

    // Targeted Movie Search (if source is not movie or additional movie pool desired)
    if (enrichedSource.media_type !== "movie" || newCandidateList.length < 5) {
      for (const phrase of plotSearchPhrases.slice(0, 2)) {
        if (phrase) {
          fetchPromises.push(
            searchMovies(phrase, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken })
              .then(items => items.forEach(it => {
                if (primaryGenre) it.genres = [primaryGenre];
                newCandidateList.push(it);
              }))
              .catch(() => {})
          );
        }
      }
    }
  }

  // B. Literature Retrieval: Search Open Library with plot anchors and themes
  for (const phrase of plotSearchPhrases.slice(0, 3)) {
    if (phrase) {
      fetchPromises.push(
        searchBooks(phrase, { googleBooksApiKey })
          .then(items => items.forEach(it => {
            if (primaryGenre && (!it.genres || it.genres.length === 0)) {
              it.genres = [primaryGenre];
            }
            newCandidateList.push(it);
          }))
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

  // 4. Content-Only Semantic & Hybrid Ranking with Hard Plot Quality Filter
  const topMovies = rankCandidates(enrichedSource, candidatePool, {
    filterType: "movie",
    limit: limitPerCategory,
    minScore: 0.05
  });

  const topTV = rankCandidates(enrichedSource, candidatePool, {
    filterType: "tv",
    limit: limitPerCategory,
    minScore: 0.05
  });

  const topBooks = rankCandidates(enrichedSource, candidatePool, {
    filterType: "book",
    limit: limitPerCategory,
    minScore: 0.05
  });

  // 5. Format response with grounded narrative connections
  const formatList = (scoredEntries) => scoredEntries.map(entry => {
    const item = entry.item;
    const matchPct = Math.min(99, Math.max(52, Math.round(entry.similarityScore * 100)));
    const shared = entry.sharedThemes || [];
    const whyBullets = entry.whyBullets || [];
    
    let whySummary = "Connected by shared narrative premise, plot progression, and core story themes.";
    if (whyBullets.length > 0) {
      whySummary = whyBullets.join(" · ");
    } else if (shared.length > 0) {
      whySummary = `Explores shared themes and concepts of ${shared.slice(0, 3).join(", ")}.`;
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

  return {
    source: {
      id: enrichedSource.id,
      title: enrichedSource.title,
      type: enrichedSource.type || (enrichedSource.media_type === "tv" ? "TV Show" : enrichedSource.media_type === "book" ? "Book" : "Movie"),
      source: enrichedSource.source || (enrichedSource.id?.startsWith("wiki_") ? "wikipedia" : enrichedSource.media_type === "book" ? "openlibrary" : "tmdb"),
      year: enrichedSource.release_year || enrichedSource.year || "N/A",
      creator: enrichedSource.creator || enrichedSource.author || enrichedSource.director || "",
      synopsis: enrichedSource.synopsis || "No synopsis available.",
      premise: enrichedSource.premise || "",
      centralConflict: enrichedSource.centralConflict || "",
      narrativeType: enrichedSource.narrativeType || "",
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
