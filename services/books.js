/**
 * Books API Client — Open Library (Primary) + Google Books (Enrichment / Fallback)
 * Real-time discovery for Literature (Books)
 */

const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
const OPEN_LIBRARY_WORKS_BASE = "https://openlibrary.org/works";
const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

/**
 * Search Literature across Open Library (Primary) & Google Books (Enrichment)
 */
export async function searchBooks(query, config = {}) {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim();
  const { googleBooksApiKey = "" } = typeof config === "string" ? { googleBooksApiKey: config } : config;

  // 1. Search Open Library (Primary Work-Level Catalog)
  const olBooks = await searchOpenLibrary(cleanQuery);
  if (olBooks.length > 0) {
    return olBooks;
  }

  // 2. Fallback to Google Books if Open Library returns no matches
  return await searchGoogleBooks(cleanQuery, googleBooksApiKey);
}

/**
 * Open Library Search API with Work-level deduplication
 */
export async function searchOpenLibrary(query) {
  try {
    const url = `${OPEN_LIBRARY_SEARCH_URL}?q=${encodeURIComponent(query)}&limit=15`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "movlib/1.0 (https://movlib.discovery; discovery@movlib.internal)"
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`Open Library Search returned HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    const docs = data.docs || [];

    // Deduplicate by Open Library Work Key (/works/OL...W)
    const seenWorks = new Set();
    const books = [];

    for (const doc of docs) {
      const workKey = doc.key || "";
      const cleanWorkId = workKey.replace("/works/", "");

      if (!workKey || seenWorks.has(cleanWorkId)) continue;
      seenWorks.add(cleanWorkId);

      let posterUrl = null;
      if (doc.cover_i) {
        posterUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
      } else if (doc.cover_edition_key) {
        posterUrl = `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg`;
      } else if (doc.isbn && doc.isbn.length > 0) {
        posterUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
      }

      const authors = (doc.author_name || []).slice(0, 2).join(", ");
      const firstSentence = Array.isArray(doc.first_sentence) 
        ? doc.first_sentence.join(" ") 
        : (doc.first_sentence || doc.subtitle || "");

      const subjects = (doc.subject || []).slice(0, 5);

      books.push({
        id: `ol_${cleanWorkId}`,
        externalId: cleanWorkId,
        source: "openlibrary",
        title: doc.title || "Untitled Work",
        type: "Book",
        media_type: "book",
        year: doc.first_publish_year ? String(doc.first_publish_year) : "N/A",
        creator: authors || "Unknown Author",
        author: authors || "Unknown Author",
        synopsis: firstSentence || "A literary work exploring character dynamics and human themes.",
        posterUrl,
        genres: subjects.slice(0, 3),
        tags: subjects,
        editionCount: doc.edition_count || 1,
        externalUrl: `https://openlibrary.org${workKey}`
      });

      if (books.length >= 10) break;
    }

    return books;
  } catch (error) {
    // Gracefully handle timeout or network error
    return [];
  }
}

/**
 * Retrieve Full Book Details (Open Library work details with Google Books fallback)
 */
export async function getBookDetails(id, config = {}) {
  const { googleBooksApiKey = "" } = typeof config === "string" ? { googleBooksApiKey: config } : config;
  const rawId = String(id).replace("ol_", "").replace("gbook_", "");

  // If it's an Open Library Work ID
  if (String(id).startsWith("ol_") || rawId.startsWith("OL")) {
    const olDetails = await getOpenLibraryWorkDetails(rawId);
    if (olDetails) return olDetails;
  }

  // If it's a Google Books ID or Open Library details was sparse
  if (String(id).startsWith("gbook_") || googleBooksApiKey) {
    const gbookDetails = await getGoogleBookDetails(rawId, googleBooksApiKey);
    if (gbookDetails) return gbookDetails;
  }

  return null;
}

/**
 * Open Library Work Details Fetcher
 */
async function getOpenLibraryWorkDetails(workId) {
  try {
    const cleanId = workId.replace("/works/", "");
    const url = `${OPEN_LIBRARY_WORKS_BASE}/${cleanId}.json`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "movlib/1.0 (https://movlib.discovery; discovery@movlib.internal)"
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();

    let description = "A literary work exploring character dynamics and human themes.";
    if (typeof data.description === "string") {
      description = data.description;
    } else if (data.description && typeof data.description.value === "string") {
      description = data.description.value;
    }

    description = cleanDescription(description);

    const covers = data.covers || [];
    const coverId = covers.length > 0 ? covers[0] : null;
    const posterUrl = coverId && coverId > 0 ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;
    const subjects = (data.subjects || []).slice(0, 6);

    return {
      id: `ol_${cleanId}`,
      externalId: cleanId,
      source: "openlibrary",
      title: data.title || "Untitled Book",
      type: "Book",
      media_type: "book",
      year: data.created?.value ? data.created.value.split("-")[0] : "N/A",
      creator: "",
      synopsis: description,
      posterUrl,
      genres: subjects.slice(0, 3),
      tags: subjects,
      externalUrl: `https://openlibrary.org/works/${cleanId}`
    };
  } catch (error) {
    return null;
  }
}

/**
 * Google Books Search API
 */
async function searchGoogleBooks(query, apiKey = "") {
  try {
    let url = `${GOOGLE_BOOKS_BASE_URL}?q=${encodeURIComponent(query)}&maxResults=10&printType=books`;
    if (apiKey) url += `&key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items || data.items.length === 0) return [];

    return data.items.map(item => normalizeGoogleBook(item));
  } catch (error) {
    return [];
  }
}

/**
 * Google Books Volume Details Fetcher
 */
async function getGoogleBookDetails(id, apiKey = "") {
  try {
    let url = `${GOOGLE_BOOKS_BASE_URL}/${id}`;
    if (apiKey) url += `&key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const item = await res.json();
    return normalizeGoogleBookDetails(item);
  } catch (error) {
    return null;
  }
}

function normalizeGoogleBook(item) {
  const info = item.volumeInfo || {};
  const imageLinks = info.imageLinks || {};
  let posterUrl = imageLinks.thumbnail || imageLinks.smallThumbnail || null;
  if (posterUrl && posterUrl.startsWith("http://")) {
    posterUrl = posterUrl.replace("http://", "https://");
  }

  const authors = (info.authors || []).join(", ");
  const year = info.publishedDate ? info.publishedDate.split("-")[0] : "N/A";
  const categories = info.categories || [];

  return {
    id: `gbook_${item.id}`,
    externalId: item.id,
    source: "googlebooks",
    title: info.title || "Untitled",
    type: "Book",
    media_type: "book",
    year,
    creator: authors,
    author: authors,
    synopsis: cleanDescription(info.description),
    posterUrl,
    genres: categories,
    tags: categories.slice(0, 5),
    externalUrl: info.infoLink || `https://books.google.com/books?id=${item.id}`
  };
}

function normalizeGoogleBookDetails(item) {
  const info = item.volumeInfo || {};
  const imageLinks = info.imageLinks || {};
  let posterUrl = imageLinks.large || imageLinks.medium || imageLinks.thumbnail || null;
  if (posterUrl && posterUrl.startsWith("http://")) {
    posterUrl = posterUrl.replace("http://", "https://");
  }

  const authors = (info.authors || []).join(", ");
  const year = info.publishedDate ? info.publishedDate.split("-")[0] : "N/A";
  const categories = info.categories || [];

  return {
    id: `gbook_${item.id}`,
    externalId: item.id,
    source: "googlebooks",
    title: info.title || "Untitled",
    type: "Book",
    media_type: "book",
    year,
    creator: authors,
    author: authors,
    synopsis: cleanDescription(info.description),
    posterUrl,
    genres: categories,
    tags: categories.slice(0, 6),
    publisher: info.publisher || "",
    externalUrl: info.infoLink || `https://books.google.com/books?id=${item.id}`
  };
}

function cleanDescription(desc) {
  if (!desc) return "A literary work exploring character dynamics and human themes.";
  return desc
    .replace(/<[^>]*>?/gm, "")
    .replace(/\[\d+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
