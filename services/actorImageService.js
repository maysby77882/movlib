/**
 * ActorImageService
 * 
 * Centralized Actor Image Resolution Service with Strict Priority:
 * 1. IMDb (Primary) — legitimate integration only, photo -> exact IMDb actor page
 * 2. Pinterest (Secondary) — photo -> exact Pinterest Pin page
 * 3. Movlib fallback (Final) — fallback SVG avatar, no fake external navigation
 * 
 * TMDB is NOT used for actor images.
 * Wikipedia resolution is kept completely independent.
 */

import dotenv from "dotenv";
dotenv.config();

import { IMDbActorImageProvider, resolveImdbId } from "./imdbActorImageProvider.js";

export const ACTOR_IMAGE_PROVIDER_PRIORITY = ["imdb", "pinterest", "fallback"];
export const ACTOR_IMAGE_VERSION = "v2";
export const PINTEREST_MIN_CONFIDENCE = 0.75;

// In-memory cache for resolved actor images (Key: actor-image:{imdbId}:v2 or actor-image:{normName}:v2)
const actorImageCache = new Map();

// In-flight request deduplication map
const pendingRequests = new Map();

/**
 * Clean & normalize text for strict name matching
 */
export function normalizeText(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validate that an image provider result meets all strict requirements:
 * - imageUrl exists and is reachable
 * - source is correctly identified ("imdb" or "pinterest")
 * - sourceUrl is legitimate and not a generic homepage or search URL
 */
export function isValidImageResult(result) {
  if (!result || typeof result !== "object") return false;

  const img = result.imageUrl || result.url;
  if (!img || typeof img !== "string" || !img.startsWith("http")) return false;

  const src = result.source;
  if (src !== "imdb" && src !== "pinterest") return false;

  const sourceUrl = result.sourceUrl || result.sourcePage;
  if (!sourceUrl || typeof sourceUrl !== "string") return false;

  // Never accept generic homepages or search URLs
  if (
    sourceUrl === "https://www.pinterest.com/" ||
    sourceUrl === "https://www.pinterest.com" ||
    sourceUrl === "https://www.imdb.com/" ||
    sourceUrl === "https://www.imdb.com"
  ) {
    return false;
  }

  if (sourceUrl.includes("/search/")) {
    return false;
  }

  // Source-specific page validation
  if (src === "pinterest" && !sourceUrl.includes("/pin/")) {
    return false;
  }

  if (src === "imdb" && !sourceUrl.includes("/name/nm")) {
    return false;
  }

  return true;
}

/**
 * Create standard Movlib fallback actor image
 */
export function createFallbackActorImage(actor = {}) {
  const personId = String(actor.id || actor.personId || actor.name || "unknown").trim();
  return {
    personId,
    name: actor.name || actor.actorName || "Cast Member",
    imageUrl: null,
    url: null,
    thumbnailUrl: null,
    fullImageUrl: null,
    sourceUrl: null,
    sourcePage: null,
    source: "fallback",
    attribution: "Movlib",
    confidence: 0.0,
    imdbId: actor.imdbId || null
  };
}

/**
 * Strict actor name verification to prevent similar-name mixups (e.g. Tom Hollander vs Tom Holland)
 */
function verifyActorNameMatch(candidateText, requestedActorName) {
  if (!candidateText || !requestedActorName) return { match: false, score: 0 };

  const normCandidate = normalizeText(candidateText);
  const normTarget = normalizeText(requestedActorName);

  if (!normTarget) return { match: false, score: 0 };

  const escapedTarget = normTarget.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const exactBoundaryRegex = new RegExp(`(?:^|\\s)${escapedTarget}(?:\\s|$)`, "i");

  if (exactBoundaryRegex.test(normCandidate)) {
    return { match: true, score: 1.0 };
  }

  const targetTokens = normTarget.split(" ").filter(t => t.length > 1);
  const candidateTokens = new Set(normCandidate.split(" ").filter(t => t.length > 1));

  let matchedTokens = 0;
  for (const token of targetTokens) {
    if (candidateTokens.has(token)) {
      matchedTokens++;
    }
  }

  const tokenRatio = targetTokens.length > 0 ? matchedTokens / targetTokens.length : 0;
  if (tokenRatio === 1.0) {
    return { match: true, score: 0.9 };
  }

  return { match: false, score: tokenRatio * 0.5 };
}

/**
 * Multi-query sequential generator for Pinterest actor portrait searches
 */
export function buildPinterestActorQueries(actor, work = {}) {
  const name = (actor.actorName || actor.name || "").trim();
  const workTitle = (work.title || actor.workTitle || "").trim();

  if (!name) return [];

  const queries = [
    `${name} actor portrait`,
    `${name} portrait`,
    `${name} actor headshot`,
    `${name} professional portrait`
  ];

  if (workTitle) {
    queries.push(`${name} ${workTitle}`);
  }

  return queries;
}

const REJECT_PATTERNS = [
  /movie\s+poster/i,
  /film\s+poster/i,
  /teaser\s+poster/i,
  /dvd\s+cover/i,
  /bluray\s+cover/i,
  /fan\s+edit/i,
  /meme/i,
  /quote\s+card/i,
  /aesthetic\s+wallpaper/i,
  /collage/i,
  /drawing/i,
  /sketch/i,
  /vector\s+art/i,
  /cast\s+interview/i
];

function evaluateCandidate(candidate, actor, work = {}) {
  const actorName = actor.actorName || actor.name || "";
  const title = candidate.title || candidate.description || "";
  const url = candidate.url || candidate.imageUrl || "";

  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return { valid: false, reason: "Invalid or missing image URL", score: 0 };
  }

  // Must have a valid Pinterest Pin URL — not a search or homepage URL
  if (!candidate.sourceUrl || !candidate.sourceUrl.includes("/pin/")) {
    return { valid: false, reason: "Missing exact Pinterest Pin source page", score: 0 };
  }

  for (const pat of REJECT_PATTERNS) {
    if (pat.test(title)) {
      return { valid: false, reason: `Matches reject pattern: ${pat}`, score: 0 };
    }
  }

  const nameMatch = verifyActorNameMatch(title, actorName);
  if (!nameMatch.match && nameMatch.score < 0.8) {
    if (!title || title.length < 5) {
      nameMatch.score = 0.75;
    } else {
      return { valid: false, reason: `Actor name mismatch (Target: "${actorName}", Title: "${title}")`, score: nameMatch.score };
    }
  }

  const nameScore = nameMatch.score * 0.40;

  let titleScore = 0.18;
  const normTitle = normalizeText(title);
  if (/portrait|headshot|photoshoot|editorial|premiere|actor|actress/i.test(normTitle)) {
    titleScore = 0.20;
  }

  let portraitScore = 0.20;
  const width = candidate.width || 0;
  const height = candidate.height || 0;

  if (width > 0 && height > 0) {
    const ratio = height / width;
    if (ratio >= 1.2 && ratio <= 2.0) {
      portraitScore = 0.25;
    } else if (ratio >= 0.9 && ratio < 1.2) {
      portraitScore = 0.20;
    } else if (ratio < 0.8) {
      portraitScore = 0.10;
    }
  }

  let workScore = 0.03;
  const titleToMatch = work.title || actor.workTitle;
  if (titleToMatch && normTitle.includes(normalizeText(titleToMatch))) {
    workScore = 0.05;
  }

  let resolutionScore = 0.08;
  if (width >= 400 || height >= 500) {
    resolutionScore = 0.10;
  } else if (width > 0 && width < 120) {
    return { valid: false, reason: `Low resolution thumbnail (${width}x${height})`, score: 0 };
  }

  const totalConfidence = parseFloat((nameScore + titleScore + portraitScore + workScore + resolutionScore).toFixed(3));

  if (totalConfidence < PINTEREST_MIN_CONFIDENCE) {
    return { valid: false, reason: `Confidence ${totalConfidence} below threshold ${PINTEREST_MIN_CONFIDENCE}`, score: totalConfidence };
  }

  return {
    valid: true,
    reason: "Valid high-confidence actor portrait",
    score: totalConfidence
  };
}

/**
 * Fetch candidates from Pinterest, extracting exact pin URLs
 */
async function searchPinterestForActor(query) {
  const cleanQuery = query.trim();
  const encoded = encodeURIComponent(cleanQuery);
  const candidates = [];

  try {
    const url = `https://www.pinterest.com/search/pins/?q=${encoded}&rs=typed`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, {
      signal: controller.signal
    }).catch(() => null);

    clearTimeout(timeout);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.contents) {
        const html = data.contents;
        // Match pin URLs with corresponding images
        const pinMatches = [...html.matchAll(/\/pin\/(\d+)\//g)];
        const imgMatches = [...html.matchAll(/https:\/\/i\.pinimg\.com\/(?:736x|564x|originals)\/[a-f0-9/]+\.(?:jpg|jpeg|png|webp)/gi)];

        if (pinMatches.length > 0 && imgMatches.length > 0) {
          const limit = Math.min(pinMatches.length, imgMatches.length, 8);
          for (let i = 0; i < limit; i++) {
            const pinId = pinMatches[i][1];
            candidates.push({
              url: imgMatches[i][0],
              sourceUrl: `https://www.pinterest.com/pin/${pinId}/`,
              title: cleanQuery,
              width: 600,
              height: 900
            });
          }
        }
      }
    }
  } catch (e) {
    // Silent failover
  }

  return candidates;
}

/**
 * Pinterest Actor Image Provider (Secondary)
 * Accepts { actorName, workTitle } or (actor, work)
 */
export const PinterestActorImageProvider = {
  name: "pinterest",

  async findActorImage(params = {}, work = {}) {
    const actorName = params.actorName || params.name || "";
    const workTitle = params.workTitle || work.title || "";
    if (!actorName) return null;

    const actor = { name: actorName, actorName };
    const workObj = { title: workTitle };
    const queries = buildPinterestActorQueries(actor, workObj);

    for (const query of queries) {
      const candidates = await searchPinterestForActor(query);
      if (candidates && candidates.length > 0) {
        for (const candidate of candidates) {
          const evalResult = evaluateCandidate(candidate, actor, workObj);
          if (evalResult.valid && candidate.sourceUrl && candidate.sourceUrl.includes("/pin/")) {
            return {
              imageUrl: candidate.url,
              sourceUrl: candidate.sourceUrl,
              source: "pinterest",
              attribution: "Pinterest",
              confidence: evalResult.score
            };
          }
        }
      }
    }

    return null;
  }
};

// In-memory cache for resolved actor Wikipedia URLs
const actorWikipediaCache = new Map();

/**
 * Resolve canonical Wikipedia URL for an actor independently from image provider
 */
export async function resolveActorWikipedia(actor) {
  if (!actor || !actor.name) return null;
  const personId = String(actor.id || actor.personId || actor.name).trim();
  const cacheKey = `actor-wikipedia:${personId}:v1`;

  if (actorWikipediaCache.has(cacheKey)) {
    return actorWikipediaCache.get(cacheKey);
  }

  const name = actor.name.trim();

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(name)}&limit=6&namespace=0&format=json`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      headers: { "User-Agent": "movlib/1.0 (https://movlib.org; discovery@movlib.org)" },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length >= 4) {
        const titles = data[1] || [];
        const descriptions = data[2] || [];
        const urls = data[3] || [];
        const normTarget = normalizeText(name);

        let bestUrl = null;
        let bestScore = 0;

        for (let i = 0; i < titles.length; i++) {
          const title = titles[i] || "";
          const desc = descriptions[i] || "";
          const pageUrl = urls[i] || "";
          const normTitle = normalizeText(title);

          if (title.includes("(disambiguation)") || desc.includes("may refer to")) {
            continue;
          }

          if (normTitle === normTarget) {
            bestUrl = pageUrl;
            bestScore = 1.0;
            break;
          }

          if (normTitle.startsWith(normTarget) && (title.includes("(actor)") || title.includes("(actress)") || title.includes("(comedian)"))) {
            bestUrl = pageUrl;
            bestScore = 0.95;
            break;
          }

          if (normTitle.startsWith(normTarget) && bestScore < 0.8) {
            bestUrl = pageUrl;
            bestScore = 0.8;
          }
        }

        if (bestUrl) {
          actorWikipediaCache.set(cacheKey, bestUrl);
          return bestUrl;
        }
      }
    }
  } catch (err) {
    // Fallback on error
  }

  const fallbackUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}`;
  actorWikipediaCache.set(cacheKey, fallbackUrl);
  return fallbackUrl;
}

/**
 * Resolve actor image following the strict priority:
 * 1. IMDb
 * 2. Pinterest
 * 3. Movlib fallback
 */
export async function resolveActorImage(actor, work = {}, tmdbConfig = {}) {
  if (!actor || (!actor.name && !actor.actorName)) {
    return createFallbackActorImage(actor);
  }

  const actorName = actor.name || actor.actorName || "";
  const personId = String(actor.id || actor.personId || actorName).trim();

  // Resolve IMDb ID for caching and identity
  const imdbId = actor.imdbId || await resolveImdbId(actor, tmdbConfig);
  const cacheKey = imdbId
    ? `actor-image:${imdbId}:${ACTOR_IMAGE_VERSION}`
    : `actor-image:${normalizeText(actorName || personId)}:${ACTOR_IMAGE_VERSION}`;

  // 1. Check in-memory cache
  if (actorImageCache.has(cacheKey)) {
    const cached = actorImageCache.get(cacheKey);
    return { ...cached, cached: true };
  }

  // Deduplicate in-flight requests
  if (pendingRequests.has(cacheKey)) {
    return await pendingRequests.get(cacheKey);
  }

  const resolvePromise = (async () => {
    const actorPayload = {
      ...actor,
      actorName,
      name: actorName,
      imdbId,
      workTitle: work.title || actor.workTitle || "",
      tmdbConfig
    };

    // 1. PRIMARY: IMDb
    try {
      const imdbResult = await IMDbActorImageProvider.findActorImage(actorPayload, work, tmdbConfig);
      if (isValidImageResult(imdbResult)) {
        const entry = {
          personId,
          name: actorName,
          imageUrl: imdbResult.imageUrl,
          url: imdbResult.imageUrl,
          thumbnailUrl: imdbResult.imageUrl,
          fullImageUrl: imdbResult.imageUrl,
          source: "imdb",
          sourceUrl: imdbResult.sourceUrl,
          attribution: "IMDb",
          confidence: imdbResult.confidence || 0.95,
          imdbId,
          version: ACTOR_IMAGE_VERSION
        };
        actorImageCache.set(cacheKey, entry);
        return entry;
      }
    } catch (imdbErr) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[ActorImage] IMDb provider error for ${actorName}:`, imdbErr.message);
      }
    }

    // 2. SECONDARY: Pinterest
    try {
      const pinterestResult = await PinterestActorImageProvider.findActorImage(actorPayload, work);
      if (isValidImageResult(pinterestResult)) {
        const fullImg = pinterestResult.imageUrl.replace(/\/564x\//, "/originals/").replace(/\/736x\//, "/originals/");
        const entry = {
          personId,
          name: actorName,
          imageUrl: pinterestResult.imageUrl,
          url: pinterestResult.imageUrl,
          thumbnailUrl: pinterestResult.imageUrl,
          fullImageUrl: fullImg,
          source: "pinterest",
          sourceUrl: pinterestResult.sourceUrl,
          attribution: "Pinterest",
          confidence: pinterestResult.confidence || 0.85,
          imdbId,
          version: ACTOR_IMAGE_VERSION
        };
        actorImageCache.set(cacheKey, entry);
        return entry;
      }
    } catch (pinErr) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[ActorImage] Pinterest provider error for ${actorName}:`, pinErr.message);
      }
    }

    // 3. FINAL: Movlib Fallback
    const fallback = createFallbackActorImage({ ...actor, imdbId });
    actorImageCache.set(cacheKey, fallback);
    return fallback;
  })();

  pendingRequests.set(cacheKey, resolvePromise);

  try {
    return await resolvePromise;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

/**
 * Centralized ActorImageService instance
 */
export const ActorImageService = {
  resolve: resolveActorImage,
  isValidImageResult,
  createFallbackActorImage
};

/**
 * Batch resolve cast members (bounded to limit)
 */
export async function resolveCastImages(castMembers = [], work = {}, limit = 8, tmdbConfig = {}) {
  if (!Array.isArray(castMembers)) return [];

  const targets = castMembers.slice(0, limit);
  return await Promise.all(
    targets.map(async (actor) => {
      const [imageInfo, wikiUrl] = await Promise.all([
        resolveActorImage(actor, work, tmdbConfig),
        resolveActorWikipedia(actor)
      ]);

      const imgUrl = imageInfo.imageUrl || imageInfo.url || null;
      const fullImgUrl = imageInfo.fullImageUrl || imgUrl || null;
      const resolvedWiki = wikiUrl || actor.wikiUrl || `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(actor.name)}`;
      const sourceUrl = imageInfo.sourceUrl || null;
      const imdbId = imageInfo.imdbId || actor.imdbId || null;

      return {
        ...actor,
        id: actor.id,
        name: actor.name,
        character: actor.character || "",
        order: actor.order ?? 0,
        imdbId,
        image: {
          url: imgUrl,
          thumbnailUrl: imgUrl,
          fullImageUrl: fullImgUrl,
          sourceUrl: sourceUrl,
          source: imageInfo.source || "fallback",
          attribution: imageInfo.attribution || "Movlib",
          confidence: imageInfo.confidence ?? 0.0
        },
        wikipedia: {
          url: resolvedWiki,
          title: actor.name
        },
        // Flat properties for backward compatibility
        photoUrl: imgUrl,
        profileUrl: imgUrl,
        thumbnailUrl: imgUrl,
        fullImageUrl: fullImgUrl,
        imageSource: imageInfo.source || "fallback",
        imageSourceUrl: sourceUrl,
        sourceUrl: sourceUrl,
        wikiUrl: resolvedWiki,
        wikipediaUrl: resolvedWiki
      };
    })
  );
}
