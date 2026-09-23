/**
 * Wikipedia API Client
 * Official Wikimedia/Wikipedia Action API integration for fallback media and information discovery.
 * Strictly used as a secondary fallback when primary sources (TMDB for Movies/TV, Open Library for Books)
 * do not produce useful results.
 */

import { queryCache } from "./cache.js";

const WIKIPEDIA_API_BASE = "https://en.wikipedia.org/w/api.php";
const WIKIPEDIA_USER_AGENT = "movlib/1.0 (https://movlib.org; discovery@movlib.org)";

/**
 * Identify entity type and year from Wikipedia article title and introductory extract.
 * Avoids guessing or fabricating types; defaults to "unknown" if inconclusive.
 */
export function identifyWikipediaEntity(title = "", extract = "") {
  const combined = `${title} ${extract}`;
  const firstParagraph = (extract.split("\n")[0] || extract).toLowerCase();
  const lowerTitle = title.toLowerCase();

  // Extract year from title e.g. "The Proposal (2009 film)" or extract
  let year = "N/A";
  const titleYearMatch = title.match(/\b(18\d\d|19\d\d|20\d\d)\b/);
  if (titleYearMatch) {
    year = titleYearMatch[1];
  } else {
    const extractYearMatch = firstParagraph.match(/\b(18\d\d|19\d\d|20\d\d)\b/);
    if (extractYearMatch) {
      year = extractYearMatch[1];
    }
  }

  // Detect disambiguation pages
  const isDisambiguation = 
    lowerTitle.includes("(disambiguation)") ||
    firstParagraph.includes("may refer to:") ||
    firstParagraph.includes("most commonly refers to:") ||
    firstParagraph.includes("refers to:");

  if (isDisambiguation) {
    return {
      type: "unknown",
      media_type: "reference",
      year: "N/A",
      creator: "",
      isDisambiguation: true
    };
  }

  // Creator / Director / Author extraction
  let creator = "";
  const directorMatch = extract.match(/directed by ([A-Z][a-zA-Z\s\.\-]+?)(?:,|\.|and|with|\n|\()/);
  const authorMatch = extract.match(/(?:written by|novel by|book by|by author|by) ([A-Z][a-zA-Z\s\.\-]+?)(?:,|\.|and|with|\n|\()/);
  const createdByMatch = extract.match(/created by ([A-Z][a-zA-Z\s\.\-]+?)(?:,|\.|and|with|\n|\()/);

  if (directorMatch && directorMatch[1]) {
    creator = directorMatch[1].trim();
  } else if (createdByMatch && createdByMatch[1]) {
    creator = createdByMatch[1].trim();
  } else if (authorMatch && authorMatch[1]) {
    creator = authorMatch[1].trim();
  }

  // 1. TV Show indicators
  const tvRegex = /\b(television series|tv series|television show|tv show|sitcom|miniseries|drama series|anime series|animated series|soap opera)\b/i;
  if (tvRegex.test(lowerTitle) || tvRegex.test(firstParagraph)) {
    return {
      type: "TV Show",
      media_type: "tv",
      year,
      creator,
      isDisambiguation: false
    };
  }

  // 2. Movie / Film indicators
  const movieRegex = /\b(film|movie|feature film|documentary film|animated film|cinema film)\b/i;
  if (movieRegex.test(lowerTitle) || movieRegex.test(firstParagraph)) {
    return {
      type: "Movie",
      media_type: "movie",
      year,
      creator,
      isDisambiguation: false
    };
  }

  // 3. Book / Literature indicators
  const bookRegex = /\b(novel|novella|book|memoir|biography|comic book|graphic novel|manga|poetry collection)\b/i;
  if (bookRegex.test(lowerTitle) || bookRegex.test(firstParagraph)) {
    return {
      type: "Book",
      media_type: "book",
      year,
      creator,
      isDisambiguation: false
    };
  }

  // 4. Inconclusive / General Knowledge topic
  return {
    type: "unknown",
    media_type: "reference",
    year,
    creator,
    isDisambiguation: false
  };
}

/**
 * Search Wikipedia for a given query and return normalized results
 */
export async function searchWikipedia(query, options = {}) {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim();
  const cacheKey = `wiki_search_${cleanQuery.toLowerCase()}`;

  const cached = queryCache.get(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: cleanQuery,
      gsrlimit: "8",
      prop: "pageimages|extracts|info",
      inprop: "url",
      exintro: "1",
      explaintext: "1",
      exchars: "500",
      piprop: "thumbnail",
      pithumbsize: "500",
      format: "json",
      origin: "*"
    });

    const url = `${WIKIPEDIA_API_BASE}?${params.toString()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": WIKIPEDIA_USER_AGENT,
        "Accept": "application/json"
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`Wikipedia search API returned HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});

    if (pages.length === 0) {
      queryCache.set(cacheKey, [], 1000 * 60 * 15);
      return [];
    }

    const normalizedResults = [];

    for (const page of pages) {
      const title = page.title || "";
      const extract = page.extract || "";
      const entity = identifyWikipediaEntity(title, extract);

      // Skip pure disambiguation pages from primary results
      if (entity.isDisambiguation) continue;

      const cleanTitle = title.replace(/\s*\([^)]*\)\s*$/, "").trim();
      const pageUrl = page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s/g, "_"))}`;
      const posterUrl = page.thumbnail?.source || null;

      normalizedResults.push({
        id: `wiki_${page.pageid}`,
        externalId: String(page.pageid),
        source: "wikipedia",
        type: entity.type,
        media_type: entity.media_type,
        title: cleanTitle || title,
        rawTitle: title,
        year: entity.year,
        creator: entity.creator,
        synopsis: extract || "Information retrieved from Wikipedia reference.",
        posterUrl,
        posterPath: posterUrl,
        externalUrl: pageUrl,
        sourceUrl: pageUrl,
        tags: [
          entity.type !== "unknown" ? entity.type : "Wikipedia Reference",
          entity.year !== "N/A" ? entity.year : null
        ].filter(Boolean)
      });
    }

    // Sort to prioritize media items (Movie, TV Show, Book) matching query closely
    normalizedResults.sort((a, b) => {
      const aIsMedia = a.type !== "unknown" ? 1 : 0;
      const bIsMedia = b.type !== "unknown" ? 1 : 0;
      if (aIsMedia !== bIsMedia) return bIsMedia - aIsMedia;

      const qLower = cleanQuery.toLowerCase();
      const aExact = a.title.toLowerCase() === qLower ? 2 : a.title.toLowerCase().startsWith(qLower) ? 1 : 0;
      const bExact = b.title.toLowerCase() === qLower ? 2 : b.title.toLowerCase().startsWith(qLower) ? 1 : 0;
      return bExact - aExact;
    });

    queryCache.set(cacheKey, normalizedResults, 1000 * 60 * 30);
    return normalizedResults;
  } catch (error) {
    console.error("Wikipedia search error:", error.message);
    return [];
  }
}

/**
 * Retrieve detailed Wikipedia page summary by page ID or title
 */
export async function getWikipediaDetails(pageIdOrTitle) {
  if (!pageIdOrTitle) return null;
  const rawId = String(pageIdOrTitle).replace("wiki_", "");
  const cacheKey = `wiki_details_${rawId}`;

  const cached = queryCache.get(cacheKey);
  if (cached) return cached;

  try {
    const isNumericId = /^\d+$/.test(rawId);
    const params = new URLSearchParams({
      action: "query",
      prop: "pageimages|extracts|info",
      inprop: "url",
      exintro: "1",
      explaintext: "1",
      exchars: "800",
      piprop: "thumbnail",
      pithumbsize: "500",
      format: "json",
      origin: "*"
    });

    if (isNumericId) {
      params.set("pageids", rawId);
    } else {
      params.set("titles", rawId);
    }

    const url = `${WIKIPEDIA_API_BASE}?${params.toString()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": WIKIPEDIA_USER_AGENT,
        "Accept": "application/json"
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    if (pages.length === 0 || pages[0].missing !== undefined) return null;

    const page = pages[0];
    const title = page.title || "";
    const extract = page.extract || "";
    const entity = identifyWikipediaEntity(title, extract);
    const cleanTitle = title.replace(/\s*\([^)]*\)\s*$/, "").trim();
    const pageUrl = page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s/g, "_"))}`;
    const posterUrl = page.thumbnail?.source || null;

    const result = {
      id: `wiki_${page.pageid}`,
      externalId: String(page.pageid),
      source: "wikipedia",
      type: entity.type,
      media_type: entity.media_type,
      title: cleanTitle || title,
      rawTitle: title,
      year: entity.year,
      creator: entity.creator,
      synopsis: extract || "Information retrieved from Wikipedia reference.",
      posterUrl,
      posterPath: posterUrl,
      externalUrl: pageUrl,
      sourceUrl: pageUrl,
      tags: [
        entity.type !== "unknown" ? entity.type : "Wikipedia Reference",
        entity.year !== "N/A" ? entity.year : null
      ].filter(Boolean)
    };

    queryCache.set(cacheKey, result, 1000 * 60 * 60);
    return result;
  } catch (error) {
    console.error("Wikipedia get details error:", error.message);
    return null;
  }
}
