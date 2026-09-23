/**
 * TMDb (The Movie Database) API Client
 * Real-time discovery for Cinema (Movies) and Television (TV Series)
 */

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
  const rawId = String(id).replace("tmdb_movie_", "");

  try {
    const data = await tmdbFetch(`/movie/${rawId}?append_to_response=keywords,credits,recommendations,similar&language=en-US`, cfg);
    if (!data) return null;

    const director = data.credits?.crew?.find(c => c.job === "Director")?.name || "";
    const cast = (data.credits?.cast || []).slice(0, 5).map(c => c.name);
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
      synopsis: data.overview || "No synopsis available.",
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
  const rawId = String(id).replace("tmdb_tv_", "");

  try {
    const data = await tmdbFetch(`/tv/${rawId}?append_to_response=keywords,credits,recommendations,similar&language=en-US`, cfg);
    if (!data) return null;

    const creator = data.created_by?.map(c => c.name).join(", ") || "";
    const cast = (data.credits?.cast || []).slice(0, 5).map(c => c.name);
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
      synopsis: data.overview || "No synopsis available.",
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
