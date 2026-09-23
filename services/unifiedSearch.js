import { searchMulti, searchMovies, searchTV } from "./tmdb.js";
import { searchBooks } from "./books.js";
import { searchWikipedia } from "./wikipedia.js";

/**
 * Execute search following strict source priority:
 * 
 * Cinema & TV:
 *   1. PRIMARY: TMDb (/search/multi or movies + tv)
 *   2. SECONDARY FALLBACK: Wikipedia (only if TMDb returns 0 useful results or encounters error)
 * 
 * Literature (Books):
 *   1. PRIMARY: Open Library (with Google Books enrichment/fallback)
 *   2. SECONDARY FALLBACK: Wikipedia (only if Open Library returns 0 useful results)
 * 
 * Returns normalized Movlib payload with source attribution.
 */
export async function performUnifiedSearch(query, config = {}) {
  const { tmdbApiKey = "", tmdbAccessToken = "", googleBooksApiKey = "" } = config;

  if (!query || !query.trim()) {
    return {
      query: "",
      sourcePriority: { moviesTv: "tmdb", books: "openlibrary" },
      counts: { movies: 0, tv: 0, books: 0, fallback: 0, total: 0 },
      results: { movies: [], tv: [], books: [], fallback: [] }
    };
  }

  const cleanQuery = query.trim();

  // 1. PRIMARY: Concurrently query TMDb (Movies & TV) and Open Library (Books)
  const tmdbPromise = (tmdbApiKey || tmdbAccessToken) 
    ? searchMulti(cleanQuery, { apiKey: tmdbApiKey, accessToken: tmdbAccessToken })
        .catch(err => {
          console.warn("TMDb search failed, will fallback to Wikipedia:", err.message);
          return { movies: [], tv: [] };
        })
    : Promise.resolve({ movies: [], tv: [] });

  const booksPromise = searchBooks(cleanQuery, { googleBooksApiKey })
    .catch(err => {
      console.warn("Books search failed, will fallback to Wikipedia:", err.message);
      return [];
    });

  const [tmdbRes, booksRes] = await Promise.all([tmdbPromise, booksPromise]);

  let movies = tmdbRes.movies || [];
  let tv = tmdbRes.tv || [];
  let books = booksRes || [];
  let fallback = [];

  const hasUsefulTmdbResults = movies.length > 0 || tv.length > 0;
  const hasUsefulBookResults = books.length > 0;

  let moviesTvSource = "tmdb";
  let booksSource = "openlibrary";

  // 2. SECONDARY: Call Wikipedia ONLY if TMDb or Open Library produced 0 useful results
  if (!hasUsefulTmdbResults || !hasUsefulBookResults) {
    const wikiResults = await searchWikipedia(cleanQuery).catch(err => {
      console.warn("Wikipedia fallback search error:", err.message);
      return [];
    });

    if (wikiResults.length > 0) {
      // If TMDb had 0 useful results, use Wikipedia for movies and TV fallback
      if (!hasUsefulTmdbResults) {
        moviesTvSource = "wikipedia";
        const wikiMovies = wikiResults.filter(item => item.type === "Movie");
        const wikiTV = wikiResults.filter(item => item.type === "TV Show");

        if (wikiMovies.length > 0 || wikiTV.length > 0) {
          movies = wikiMovies;
          tv = wikiTV;
        }

        // Store reference / general fallback items that are not pure movies/tv
        fallback = wikiResults.filter(item => item.type !== "Movie" && item.type !== "TV Show" && item.type !== "Book");
      }

      // If Open Library had 0 useful results, use Wikipedia for book fallback
      if (!hasUsefulBookResults) {
        const wikiBooks = wikiResults.filter(item => item.type === "Book");
        if (wikiBooks.length > 0) {
          booksSource = "wikipedia";
          books = wikiBooks;
        }
      }

      // If both had 0 results and no specific media classification, provide general Wikipedia results in fallback
      if (movies.length === 0 && tv.length === 0 && books.length === 0) {
        fallback = wikiResults;
      }
    }
  }

  // 3. Deduplication check: Ensure TMDB records always take precedence over Wikipedia duplicates
  if (hasUsefulTmdbResults && fallback.length > 0) {
    const knownTitles = new Set([
      ...movies.map(m => m.title.toLowerCase()),
      ...tv.map(t => t.title.toLowerCase())
    ]);
    fallback = fallback.filter(f => !knownTitles.has(f.title.toLowerCase()));
  }

  return {
    query: cleanQuery,
    sourcePriority: {
      moviesTv: moviesTvSource,
      books: booksSource
    },
    counts: {
      movies: movies.length,
      tv: tv.length,
      books: books.length,
      fallback: fallback.length,
      total: movies.length + tv.length + books.length + fallback.length
    },
    results: {
      movies,
      tv,
      books,
      fallback
    }
  };
}
