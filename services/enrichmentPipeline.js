import { buildNarrativeProfile } from "./featureExtractor.js";
import { saveMediaItem, getAllMedia } from "../db/index.js";

/**
 * Enrich a single media item with cleaned text and multidimensional narrative features
 */
export function enrichMediaItem(item) {
  if (!item) return null;

  const profile = buildNarrativeProfile(item);
  if (!profile) return item;

  const enriched = {
    ...item,
    synopsis: profile.cleanedSynopsis || item.synopsis,
    tags: profile.allTags,
    narrative_profile: profile.narrativeProfileText,
    thematic_features: {
      themes: profile.themes,
      moods: profile.moods,
      tropes: profile.tropes
    }
  };

  return enriched;
}

/**
 * Batch enrich all items in the database
 */
export function enrichAllDatabaseItems() {
  const { items } = getAllMedia({ limit: 10000 });
  const enrichedList = [];

  for (const item of items) {
    const enriched = enrichMediaItem(item);
    if (enriched) {
      saveMediaItem(enriched);
      enrichedList.push(enriched);
    }
  }

  console.log(`✓ Enriched ${enrichedList.length} media items with multidimensional narrative features.`);
  return {
    total_enriched: enrichedList.length,
    sample: enrichedList.slice(0, 3)
  };
}
