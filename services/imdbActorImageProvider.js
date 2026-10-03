/**
 * IMDb Actor Image Provider
 * 
 * Provides actor profile photographs and metadata with IMDb as the PRIMARY source.
 * Resolves IMDb Person/Name IDs (nm...) via TMDb's person external_ids API.
 * 
 * Provider priority in Movlib:
 * 1. IMDb (Primary)
 * 2. Pinterest (Secondary)
 * 3. Movlib fallback
 */

import dotenv from "dotenv";
dotenv.config();

// In-memory cache for resolved IMDb IDs (tmdbPersonId -> nmXXXXXXX)
const imdbIdCache = new Map();

// In-memory cache for resolved IMDb images (Key: actor-image:imdb:{imdbId}:v2)
const imdbImageCache = new Map();

export const IMDB_IMAGE_VERSION = "v2";

/**
 * Resolve IMDb Name ID (nm...) for an actor using TMDb person external_ids API
 * @param {Object} actor - Actor object with id/personId/tmdbId
 * @param {Object} tmdbConfig - { apiKey, accessToken }
 * @returns {string|null} IMDb Name ID (e.g. "nm1046097") or null
 */
export async function resolveImdbId(actor, tmdbConfig = {}) {
  if (!actor) return null;

  // 1. If already provided on the actor object
  if (actor.imdbId && String(actor.imdbId).startsWith("nm")) {
    return actor.imdbId;
  }

  // 2. Lookup via TMDb person external_ids
  const tmdbPersonId = actor.id || actor.personId || actor.tmdbId;
  if (!tmdbPersonId || isNaN(Number(tmdbPersonId))) return null;

  const cacheKey = `imdb-id:${tmdbPersonId}`;
  if (imdbIdCache.has(cacheKey)) {
    return imdbIdCache.get(cacheKey);
  }

  const { apiKey, accessToken } = tmdbConfig;
  if (!apiKey && !accessToken) return null;

  try {
    const headers = { "Accept": "application/json", "Content-Type": "application/json" };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const querySep = "?";
    const authQuery = (!accessToken && apiKey) ? `${querySep}api_key=${apiKey}` : "";
    const url = `https://api.tmdb.org/3/person/${tmdbPersonId}/external_ids${authQuery}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const imdbId = data.imdb_id || null;
      if (imdbId && String(imdbId).startsWith("nm")) {
        imdbIdCache.set(cacheKey, imdbId);
        if (process.env.NODE_ENV !== "production") {
          console.log(`[IMDb] Resolved IMDb ID for ${actor.name || tmdbPersonId}: ${imdbId}`);
        }
        return imdbId;
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[IMDb] External IDs lookup failed for person ${tmdbPersonId}:`, err.message);
    }
  }

  imdbIdCache.set(cacheKey, null);
  return null;
}

/**
 * IMDb Actor Image Provider
 * 
 * Supports:
 *   IMDbActorImageProvider.findActorImage({ imdbId, actorName, workTitle })
 * Also accepts polymorphic parameter object or actor instance.
 */
export const IMDbActorImageProvider = {
  name: "imdb",

  /**
   * Find actor image from IMDb
   * @param {Object} params - { imdbId, actorName, workTitle, ... } or actor object
   * @param {Object} [work] - Optional work object if called as (actor, work, config)
   * @param {Object} [tmdbConfig] - Optional config for external_ids lookup
   * @returns {Object|null} { imageUrl, sourceUrl, source: "imdb", confidence: 0.95 }
   */
  async findActorImage(params = {}, work = {}, tmdbConfig = {}) {
    if (!params) return null;

    const actorName = params.actorName || params.name || "";
    let imdbId = params.imdbId || null;
    const workTitle = params.workTitle || work.title || "";
    const config = params.tmdbConfig || tmdbConfig;

    if (!imdbId && (params.id || params.personId)) {
      imdbId = await resolveImdbId(params, config);
    }

    if (!imdbId || !String(imdbId).startsWith("nm")) {
      return null;
    }

    const cacheKey = `actor-image:imdb:${imdbId}:${IMDB_IMAGE_VERSION}`;
    if (imdbImageCache.has(cacheKey)) {
      const cached = imdbImageCache.get(cacheKey);
      if (cached && cached.imageUrl) {
        return { ...cached, cached: true };
      }
      return null;
    }

    const sourceUrl = `https://www.imdb.com/name/${imdbId}/`;

    // ─── Legitimate IMDb Image Lookup ──────────────────────────────────────────
    // IMDb does not have a free public image hosting API.
    // If an authorized integration or custom dataset is present,
    // imageUrl would be extracted here.
    // Otherwise, we do not fabricate, scrape or guess IMDb image URLs.
    // ──────────────────────────────────────────────────────────────────────────

    const result = {
      imageUrl: null,
      sourceUrl,
      source: "imdb",
      confidence: 0.95,
      imdbId
    };

    imdbImageCache.set(cacheKey, result);

    // Return result only if legitimate imageUrl exists
    if (result.imageUrl) {
      return result;
    }

    return null;
  }
};
