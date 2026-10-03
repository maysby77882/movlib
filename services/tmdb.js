/**
 * TMDb (The Movie Database) API Client
 * Real-time discovery for Cinema (Movies) and Television (TV Series)
 */

import { resolveCastImages } from "./actorImageService.js";

const TMDB_PRIMARY_BASE = "https://api.tmdb.org/3";
const TMDB_FALLBACK_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

/**
 * Resilient TMDB Fetch helper with primary/fallback hostnames and timeout
 */
async function tmdbFetch(endpointPath, config = {}, options = {}) {
  const { apiKey = "", accessToken = "" } = config;
  if (!apiKey && !accessToken) return null;

  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const querySep = endpointPath.includes("?") ? "&" : "?";
  const authQuery = (!accessToken && apiKey) ? `${querySep}api_key=${apiKey}` : "";
  const fullRelative = `${endpointPath}${authQuery}`;

  const hosts = [TMDB_PRIMARY_BASE, TMDB_FALLBACK_BASE];

  for (const base of hosts) {
    try {
      const url = `${base}${fullRelative}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        headers,
        signal: controller.signal,
        ...options
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
      if (res.status === 404) {
        return null;
      }
    } catch (err) {
      // Try next host
    }
  }

  return null;
}

/**
 * TMDb Multi-Search: Searches Movies & TV Shows in a single optimized request
 */
export async function searchMulti(query, config = {}) {
  if (!query || !query.trim()) return { movies: [], tv: [] };
  const clean = encodeURIComponent(query.trim());

  try {
    const data = await tmdbFetch(`/search/multi?query=${clean}&include_adult=false&language=en-US&page=1`, config);
    if (!data || !data.results) return { movies: [], tv: [] };

    const movies = data.results
      .filter(item => item.media_type === "movie" && !item.adult)
      .slice(0, 10)
      .map(normalizeMovie);

    const tv = data.results
      .filter(item => item.media_type === "tv" && !item.adult)
      .slice(0, 10)
      .map(normalizeTV);

    return { movies, tv };
  } catch (error) {
    console.error("TMDb Multi-Search Error:", error.message);
    return { movies: [], tv: [] };
  }
}

/**
 * Search Movies on TMDb
 */
export async function searchMovies(query, config = {}) {
  if (!query || !query.trim()) return [];
  const cfg = typeof config === "string" ? { apiKey: config } : config;
  const clean = encodeURIComponent(query.trim());

  try {
    const data = await tmdbFetch(`/search/movie?query=${clean}&include_adult=false&language=en-US&page=1`, cfg);
    return (data?.results || []).slice(0, 10).map(normalizeMovie);
  } catch (error) {
    console.error("TMDb Movie Search Error:", error.message);
    return [];
  }
}

/**
 * Search TV Shows on TMDb
 */
export async function searchTV(query, config = {}) {
  if (!query || !query.trim()) return [];
  const cfg = typeof config === "string" ? { apiKey: config } : config;
  const clean = encodeURIComponent(query.trim());

  try {
    const data = await tmdbFetch(`/search/tv?query=${clean}&include_adult=false&language=en-US&page=1`, cfg);
    return (data?.results || []).slice(0, 10).map(normalizeTV);
  } catch (error) {
    console.error("TMDb TV Search Error:", error.message);
    return [];
  }
}

/**
 * Get Movie Details + Keywords + Credits + TMDb Recommendations
 */
export async function getMovieDetails(id, config = {}) {
  const cfg = typeof config === "string" ? { apiKey: config } : config;
  let rawId = String(id || "").replace(/^(tmdb_movie_|movie_)/, "").trim();

  if (!rawId) return null;

  if (isNaN(Number(rawId))) {
    try {
      const searchRes = await searchMovies(rawId.replace(/_/g, " "), cfg);
      if (searchRes && searchRes.length > 0) {
        rawId = String(searchRes[0].id).replace(/^(tmdb_movie_|movie_)/, "").trim();
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  try {
    const data = await tmdbFetch(`/movie/${rawId}?append_to_response=keywords,credits,recommendations,similar&language=en-US`, cfg);
    if (!data) return null;

    const director = data.credits?.crew?.find(c => c.job === "Director")?.name || "";
    const rawCast = (data.credits?.cast || []).slice(0, 8);
    const cast = rawCast.map(c => c.name);
    const baseMembers = rawCast.map(c => ({
      id: c.id,
      name: c.name,
      character: c.character || "",
      profilePath: c.profile_path || null,
      profileUrl: null,
      wikiUrl: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(c.name)}`
    }));

    const castMembers = await resolveCastImages(baseMembers, { title: data.title }, 8, cfg);
    const keywords = (data.keywords?.keywords || []).map(k => k.name);
    const genres = (data.genres || []).map(g => g.name);

    const tmdbRecs = [
      ...(data.recommendations?.results || []),
      ...(data.similar?.results || [])
    ].map(normalizeMovie);

    return {
      id: `tmdb_movie_${data.id}`,
      externalId: String(data.id),
      tmdbId: data.id,
      source: "tmdb",
      title: data.title,
      type: "Movie",
      media_type: "movie",
      year: data.release_date ? data.release_date.split("-")[0] : "N/A",
      creator: director,
      director,
      cast,
      castMembers,
      tagline: data.tagline || "",
      synopsis: data.overview || data.tagline || "No synopsis available.",
      posterUrl: data.poster_path ? `${TMDB_IMAGE_BASE}${data.poster_path}` : null,
      backdropUrl: data.backdrop_path ? `${TMDB_BACKDROP_BASE}${data.backdrop_path}` : null,
      genres,
      keywords,
      tags: [...genres, ...keywords].slice(0, 8),
      voteAverage: data.vote_average || null,
      externalUrl: `https://www.themoviedb.org/movie/${data.id}`,
      rawRecommendations: tmdbRecs
    };
  } catch (error) {
    console.error("TMDb Movie Details Error:", error.message);
    return null;
  }
}

/**
 * Get TV Details + Keywords + Credits + TMDb Recommendations
 */
export async function getTVDetails(id, config = {}) {
  const cfg = typeof config === "string" ? { apiKey: config } : config;
  let rawId = String(id || "").replace(/^(tmdb_tv_|tv_)/, "").trim();

  if (!rawId) return null;

  if (isNaN(Number(rawId))) {
    try {
      const searchRes = await searchTV(rawId.replace(/_/g, " "), cfg);
      if (searchRes && searchRes.length > 0) {
        rawId = String(searchRes[0].id).replace(/^(tmdb_tv_|tv_)/, "").trim();
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  try {
    const data = await tmdbFetch(`/tv/${rawId}?append_to_response=keywords,credits,recommendations,similar&language=en-US`, cfg);
    if (!data) return null;

    const creator = data.created_by?.map(c => c.name).join(", ") || "";
    const rawCast = (data.credits?.cast || []).slice(0, 8);
    const cast = rawCast.map(c => c.name);
    const baseMembers = rawCast.map(c => ({
      id: c.id,
      name: c.name,
      character: c.character || "",
      profilePath: c.profile_path || null,
      profileUrl: null,
      wikiUrl: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(c.name)}`
    }));

    const castMembers = await resolveCastImages(baseMembers, { title: data.name }, 8, cfg);
    const keywords = (data.keywords?.results || []).map(k => k.name);
    const genres = (data.genres || []).map(g => g.name);

    const tmdbRecs = [
      ...(data.recommendations?.results || []),
      ...(data.similar?.results || [])
    ].map(normalizeTV);

    return {
      id: `tmdb_tv_${data.id}`,
      externalId: String(data.id),
      tmdbId: data.id,
      source: "tmdb",
      title: data.name,
      type: "TV Show",
      media_type: "tv",
      year: data.first_air_date ? data.first_air_date.split("-")[0] : "N/A",
      creator,
      cast,
      castMembers,
      tagline: data.tagline || "",
      synopsis: data.overview || data.tagline || "No synopsis available.",
      posterUrl: data.poster_path ? `${TMDB_IMAGE_BASE}${data.poster_path}` : null,
      backdropUrl: data.backdrop_path ? `${TMDB_BACKDROP_BASE}${data.backdrop_path}` : null,
      genres,
      keywords,
      tags: [...genres, ...keywords].slice(0, 8),
      voteAverage: data.vote_average || null,
      externalUrl: `https://www.themoviedb.org/tv/${data.id}`,
      rawRecommendations: tmdbRecs
    };
  } catch (error) {
    console.error("TMDb TV Details Error:", error.message);
    return null;
  }
}

/**
 * Discover Movies with specific genre/keyword parameters
 */
export async function discoverMovies(params = {}, config = {}) {
  const queryParts = ["include_adult=false", "language=en-US", "sort_by=popularity.desc", "page=1"];
  if (params.withGenres) queryParts.push(`with_genres=${encodeURIComponent(params.withGenres)}`);
  if (params.withKeywords) queryParts.push(`with_keywords=${encodeURIComponent(params.withKeywords)}`);

  const path = `/discover/movie?${queryParts.join("&")}`;
  const data = await tmdbFetch(path, config);
  return (data?.results || []).slice(0, 15).map(normalizeMovie);
}

/**
 * Discover TV Shows with specific genre/keyword parameters
 */
export async function discoverTV(params = {}, config = {}) {
  const queryParts = ["include_adult=false", "language=en-US", "sort_by=popularity.desc", "page=1"];
  if (params.withGenres) queryParts.push(`with_genres=${encodeURIComponent(params.withGenres)}`);
  if (params.withKeywords) queryParts.push(`with_keywords=${encodeURIComponent(params.withKeywords)}`);

  const path = `/discover/tv?${queryParts.join("&")}`;
  const data = await tmdbFetch(path, config);
  return (data?.results || []).slice(0, 15).map(normalizeTV);
}

function normalizeMovie(item) {
  return {
    id: `tmdb_movie_${item.id}`,
    externalId: String(item.id),
    source: "tmdb",
    title: item.title,
    type: "Movie",
    media_type: "movie",
    year: item.release_date ? item.release_date.split("-")[0] : "N/A",
    creator: "",
    synopsis: item.overview || "No synopsis available.",
    posterUrl: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null,
    rating: item.vote_average || 0,
    genres: [],
    externalUrl: `https://www.themoviedb.org/movie/${item.id}`
  };
}

function normalizeTV(item) {
  return {
    id: `tmdb_tv_${item.id}`,
    externalId: String(item.id),
    source: "tmdb",
    title: item.name,
    type: "TV Show",
    media_type: "tv",
    year: item.first_air_date ? item.first_air_date.split("-")[0] : "N/A",
    creator: "",
    synopsis: item.overview || "No synopsis available.",
    posterUrl: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null,
    rating: item.vote_average || 0,
    genres: [],
    externalUrl: `https://www.themoviedb.org/tv/${item.id}`
  };
}

/**
 * Get Principal Cast / Credits for a Movie or TV Show
 * Usage: getCredits('movie', 122906, config)
 */
export async function getCredits(type, id, config = {}, limit = 8) {
  const cfg = typeof config === "string" 
    ? (config.startsWith("eyJ") ? { accessToken: config } : { apiKey: config }) 
    : config;
  const normType = String(type).toLowerCase() === "tv" || String(type).toLowerCase() === "tv show" ? "tv" : "movie";
  let rawId = String(id || "").replace(/^(tmdb_movie_|tmdb_tv_|movie_|tv_|seed_movie_|seed_tv_)/, "").trim();

  if (!rawId) {
    return { cast: [] };
  }

  // If rawId is not a numeric TMDb ID, resolve it via TMDb search
  if (isNaN(Number(rawId))) {
    try {
      const candidates = [
        rawId,
        rawId.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").replace(/-/g, " "),
        rawId.replace(/([a-z])(\d+)/g, "$1 $2"),
        // Common concatenated title word splitters
        rawId.replace(/tropicthunder/i, "Tropic Thunder")
             .replace(/abouttime/i, "About Time")
             .replace(/bladerunner2049/i, "Blade Runner 2049")
             .replace(/bladerunner/i, "Blade Runner")
             .replace(/themartian/i, "The Martian")
             .replace(/threebody/i, "Three Body Problem")
      ];

      let foundId = null;
      for (const queryStr of [...new Set(candidates)]) {
        if (!queryStr) continue;
        const searchResults = normType === "tv" ? await searchTV(queryStr, cfg) : await searchMovies(queryStr, cfg);
        if (searchResults && searchResults.length > 0) {
          foundId = String(searchResults[0].id).replace(/^(tmdb_movie_|tmdb_tv_|movie_|tv_)/, "").trim();
          break;
        }
      }

      if (foundId) {
        rawId = foundId;
      } else {
        return { cast: [] };
      }
    } catch (searchErr) {
      return { cast: [] };
    }
  }

  try {
    const data = await tmdbFetch(`/${normType}/${rawId}/credits?language=en-US`, cfg);
    if (!data || !data.cast) {
      return { cast: [] };
    }

    const seenIds = new Set();
    const cast = [];

    // Sort by TMDB cast order
    const sorted = [...data.cast].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    for (const c of sorted) {
      if (!c.id || !c.name || seenIds.has(c.id)) continue;
      seenIds.add(c.id);

      cast.push({
        id: c.id,
        name: c.name.trim(),
        character: (c.character || "").trim(),
        profilePath: c.profile_path || null,
        profileUrl: null,
        wikiUrl: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(c.name.trim())}`,
        order: c.order ?? cast.length
      });

      if (cast.length >= limit) break;
    }

    const enrichedCast = await resolveCastImages(cast, { title: data.title || data.name || "" }, limit, cfg);
    return { cast: enrichedCast };
  } catch (err) {
    console.error(`TMDb Credits error for ${normType}/${rawId}:`, err.message);
    return { cast: [] };
  }
}

