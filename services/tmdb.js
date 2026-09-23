/**
 * TMDb (The Movie Database) API Client
 * Real-time discovery for Cinema (Movies) and Television (TV Series)
 */

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

/**
 * Helper to build auth headers/params for TMDB
 */
function getAuthOptions(config = {}) {
  const { apiKey = "", accessToken = "" } = config;
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
    return { headers, queryParam: "" };
  }

  if (apiKey) {
    return { headers, queryParam: `api_key=${apiKey}` };
  }

  return { headers, queryParam: "" };
}

/**
 * TMDb Multi-Search: Searches Movies & TV Shows in a single optimized request
 */
export async function searchMulti(query, config = {}) {
  if (!query || !query.trim()) return { movies: [], tv: [] };
  const { apiKey = "", accessToken = "" } = config;
  if (!apiKey && !accessToken) return { movies: [], tv: [] };

  try {
    const { headers, queryParam } = getAuthOptions(config);
    const paramStr = queryParam ? `&${queryParam}` : "";
    const url = `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query.trim())}&include_adult=false&language=en-US&page=1${paramStr}`;

    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`TMDb Multi-Search HTTP Error: ${res.status} ${res.statusText}`);
      return { movies: [], tv: [] };
    }

    const data = await res.json();
    const results = data.results || [];

    const movies = results
      .filter(item => item.media_type === "movie" && !item.adult)
      .slice(0, 10)
      .map(normalizeMovie);

    const tv = results
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
  const { apiKey = "", accessToken = "" } = typeof config === "string" ? { apiKey: config } : config;
  if (!apiKey && !accessToken) return [];

  try {
    const { headers, queryParam } = getAuthOptions({ apiKey, accessToken });
    const paramStr = queryParam ? `&${queryParam}` : "";
    const url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query.trim())}&include_adult=false&language=en-US&page=1${paramStr}`;

    const res = await fetch(url, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).slice(0, 10).map(normalizeMovie);
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
  const { apiKey = "", accessToken = "" } = typeof config === "string" ? { apiKey: config } : config;
  if (!apiKey && !accessToken) return [];

  try {
    const { headers, queryParam } = getAuthOptions({ apiKey, accessToken });
    const paramStr = queryParam ? `&${queryParam}` : "";
    const url = `${TMDB_BASE_URL}/search/tv?query=${encodeURIComponent(query.trim())}&include_adult=false&language=en-US&page=1${paramStr}`;

    const res = await fetch(url, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).slice(0, 10).map(normalizeTV);
  } catch (error) {
    console.error("TMDb TV Search Error:", error.message);
    return [];
  }
}

/**
 * Get Movie Details + Keywords + Credits
 */
export async function getMovieDetails(id, config = {}) {
  const { apiKey = "", accessToken = "" } = typeof config === "string" ? { apiKey: config } : config;
  if (!apiKey && !accessToken) return null;

  try {
    const rawId = String(id).replace("tmdb_movie_", "");
    const { headers, queryParam } = getAuthOptions({ apiKey, accessToken });
    const paramStr = queryParam ? `&${queryParam}` : "";
    const url = `${TMDB_BASE_URL}/movie/${rawId}?append_to_response=keywords,credits&language=en-US${paramStr}`;

    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const data = await res.json();

    const director = data.credits?.crew?.find(c => c.job === "Director")?.name || "";
    const cast = (data.credits?.cast || []).slice(0, 5).map(c => c.name);
    const keywords = (data.keywords?.keywords || []).map(k => k.name);
    const genres = (data.genres || []).map(g => g.name);

    return {
      id: `tmdb_movie_${data.id}`,
      externalId: String(data.id),
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
      tags: [...genres, ...keywords].slice(0, 6),
      voteAverage: data.vote_average || null,
      externalUrl: `https://www.themoviedb.org/movie/${data.id}`
    };
  } catch (error) {
    console.error("TMDb Movie Details Error:", error.message);
    return null;
  }
}

/**
 * Get TV Details + Keywords + Credits
 */
export async function getTVDetails(id, config = {}) {
  const { apiKey = "", accessToken = "" } = typeof config === "string" ? { apiKey: config } : config;
  if (!apiKey && !accessToken) return null;

  try {
    const rawId = String(id).replace("tmdb_tv_", "");
    const { headers, queryParam } = getAuthOptions({ apiKey, accessToken });
    const paramStr = queryParam ? `&${queryParam}` : "";
    const url = `${TMDB_BASE_URL}/tv/${rawId}?append_to_response=keywords,credits&language=en-US${paramStr}`;

    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const data = await res.json();

    const creator = data.created_by?.map(c => c.name).join(", ") || "";
    const cast = (data.credits?.cast || []).slice(0, 5).map(c => c.name);
    const keywords = (data.keywords?.results || []).map(k => k.name);
    const genres = (data.genres || []).map(g => g.name);

    return {
      id: `tmdb_tv_${data.id}`,
      externalId: String(data.id),
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
      tags: [...genres, ...keywords].slice(0, 6),
      voteAverage: data.vote_average || null,
      externalUrl: `https://www.themoviedb.org/tv/${data.id}`
    };
  } catch (error) {
    console.error("TMDb TV Details Error:", error.message);
    return null;
  }
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
    externalUrl: `https://www.themoviedb.org/tv/${item.id}`
  };
}
