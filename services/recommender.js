/**
 * movlib Deep Plot & Multi-Vector Hybrid Recommendation Engine
 *
 * Implements 4-Level Recommendation Intelligence:
 * LEVEL 1: Metadata (Genre, Keywords, Context)
 * LEVEL 2: Themes & Concepts (Friendship, Ambition, Responsibility, Survival, Power)
 * LEVEL 3: Story Structure & Narrative DNA (Premise, Central Conflict, Character Roles, Setting, Tone)
 * LEVEL 4: Plot Similarity (What actually happens in the story, events, problem progression, stakes)
 *
 * Configurable Weights:
 * PLOT_WEIGHT = 0.40
 * SEMANTIC_WEIGHT = 0.25
 * THEME_WEIGHT = 0.15
 * GENRE_WEIGHT = 0.08
 * TONE_WEIGHT = 0.05
 * KEYWORD_WEIGHT = 0.04
 * METADATA_WEIGHT = 0.03
 */

import { buildStoryProfile } from "./featureExtractor.js";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as",
  "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "can't",
  "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
  "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he",
  "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
  "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's",
  "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
  "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll",
  "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs",
  "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've",
  "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll",
  "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while",
  "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're",
  "you've", "your", "yours", "yourself", "yourselves", "film", "movie", "book", "story", "novel", "series", "show",
  "also", "based", "first", "one", "two", "three", "new", "life", "time", "world", "narrative", "author", "published"
]);

// Non-narrative media keywords and genres to exclude from story recommendations
const NON_NARRATIVE_INDICATORS = new Set([
  "talk show", "late night", "game show", "reality-tv", "variety", "news",
  "stand-up comedy", "interview", "podcast", "panel show", "celebrity interview",
  "games secrets", "game secrets", "cheat codes", "walkthrough guide", "solutions manual",
  "thesaurus", "dictionary", "workbook", "textbook edition", "exam prep"
]);

/**
 * Tokenize and normalize text into meaningful term frequency map with sub-linear scaling
 */
export function tokenize(text) {
  if (!text) return {};
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  const tf = {};
  for (const w of words) {
    tf[w] = (tf[w] || 0) + 1;
  }

  // Include 2-word n-grams for narrative phrases (e.g. "bachelor party", "atomic bomb", "time dilation")
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    tf[bigram] = (tf[bigram] || 0) + 1.5;
  }

  return tf;
}

/**
 * Compute Cosine Similarity between two term-frequency vector maps
 */
export function computeCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB) return 0.0;

  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;

  for (const [key, val] of Object.entries(vecA)) {
    normA += val * val;
    if (vecB[key]) {
      dotProduct += val * vecB[key];
    }
  }

  for (const val of Object.values(vecB)) {
    normB += val * val;
  }

  if (normA === 0 || normB === 0) return 0.0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculate Jaccard Set Similarity
 */
export function calculateJaccard(arrA = [], arrB = []) {
  if (!arrA.length || !arrB.length) return 0.0;

  const setA = new Set(arrA.map(s => String(s).toLowerCase().trim()));
  const setB = new Set(arrB.map(s => String(s).toLowerCase().trim()));

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0.0 : intersection / union;
}

// Configurable Hybrid Weights (Total = 1.00)
export const DEFAULT_WEIGHTS = {
  plot: 0.40,           // LEVEL 4: Actual plot events, central conflict, premise, goals
  semantic: 0.25,       // LEVEL 3: Deep story meaning & narrative DNA
  theme: 0.15,          // LEVEL 2: Core Themes & High-Level Concepts
  genre: 0.08,          // LEVEL 1: Genre alignment (supporting signal only)
  tone: 0.05,           // LEVEL 3: Tone & Atmosphere
  keyword: 0.04,        // LEVEL 1: Story Keywords
  metadata: 0.03,       // LEVEL 1 & 3: Setting, Character Roles, Era
  title: 0.00           // Title similarity is strictly 0% to prevent title-word contamination
};

/**
 * Check if an item is non-narrative (talk show, variety show, news, manual)
 */
function isNonNarrativeItem(item) {
  const genres = Array.isArray(item.genres) ? item.genres : [];
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const title = (item.title || "").toLowerCase();
  const synopsis = (item.synopsis || "").toLowerCase();

  const allStrings = [...genres, ...tags, title, synopsis].join(" ").toLowerCase();

  for (const indicator of NON_NARRATIVE_INDICATORS) {
    if (allStrings.includes(indicator)) {
      return true;
    }
  }

  if (title.startsWith("late night with") || title.startsWith("the late show") || title.startsWith("watch what happens live") || title.startsWith("the daily show")) {
    return true;
  }

  return false;
}

/**
 * Compute Deep Multi-Vector Recommendation Score between Source and Candidate
 */
export function scoreRecommendation(source, candidate, customWeights = {}) {
  if (!source || !candidate || source.id === candidate.id) {
    return { score: 0, confidence: 0, breakdown: {}, whyBullets: [], sharedThemes: [], isRejected: true };
  }

  // Reject non-narrative items (e.g. talk shows / manuals)
  if (isNonNarrativeItem(candidate)) {
    return { score: 0, confidence: 0, breakdown: {}, whyBullets: [], sharedThemes: [], isRejected: true, rejectReason: "Non-narrative media" };
  }

  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  // Ensure structured profiles
  const sourceProfile = source.premise ? source : buildStoryProfile(source);
  const candidateProfile = candidate.premise ? candidate : buildStoryProfile(candidate);

  // 1. PLOT SIMILARITY (40% Weight) — Premise + Central Conflict + Protagonist Goal + Plot Events
  const sourcePlotText = sourceProfile?.plotRepresentation || `${source.synopsis || ""} ${source.description || ""}`;
  const candidatePlotText = candidateProfile?.plotRepresentation || `${candidate.synopsis || ""} ${candidate.description || ""}`;
  const plotVecA = tokenize(sourcePlotText);
  const plotVecB = tokenize(candidatePlotText);
  const plotSimilarity = computeCosineSimilarity(plotVecA, plotVecB);

  // 2. SEMANTIC / STORY DNA SIMILARITY (25% Weight) — Full Story DNA
  const sourceDNA = sourceProfile?.storyDNA || `${source.narrative_profile || ""} ${source.synopsis || ""}`;
  const candidateDNA = candidateProfile?.storyDNA || `${candidate.narrative_profile || ""} ${candidate.synopsis || ""}`;
  const semanticVecA = tokenize(sourceDNA);
  const semanticVecB = tokenize(candidateDNA);
  const semanticSimilarity = computeCosineSimilarity(semanticVecA, semanticVecB);

  // 3. THEMATIC OVERLAP (15% Weight)
  const sourceThemes = sourceProfile?.themes || source.thematic_features?.themes || [];
  const candidateThemes = candidateProfile?.themes || candidate.thematic_features?.themes || [];
  const themeSimilarity = calculateJaccard(sourceThemes, candidateThemes);

  // 4. GENRE SIMILARITY (8% Weight — Modest supporting signal)
  const parseArr = val => Array.isArray(val) ? val : (typeof val === "string" ? (val.startsWith("[") ? JSON.parse(val) : val.split(",")) : []);
  const sourceGenres = parseArr(source.genres);
  const candidateGenres = parseArr(candidate.genres);
  const genreSimilarity = calculateJaccard(sourceGenres, candidateGenres);

  // 5. TONE & ATMOSPHERE SIMILARITY (5% Weight)
  const sourceTones = sourceProfile?.tones || sourceProfile?.moods || source.thematic_features?.moods || [];
  const candidateTones = candidateProfile?.tones || candidateProfile?.moods || candidate.thematic_features?.moods || [];
  const toneSimilarity = calculateJaccard(sourceTones, candidateTones);

  // 6. CONCEPTS & KEYWORDS SIMILARITY (4% Weight)
  const sourceConcepts = sourceProfile?.concepts || source.thematic_features?.concepts || [];
  const candidateConcepts = candidateProfile?.concepts || candidate.thematic_features?.concepts || [];
  const sourceKeywords = parseArr(source.keywords || []);
  const candidateKeywords = parseArr(candidate.keywords || []);
  const keywordSimilarity = calculateJaccard([...sourceConcepts, ...sourceKeywords], [...candidateConcepts, ...candidateKeywords]);

  // 7. METADATA & CONTEXT (3% Weight — Setting, Character Roles)
  const sourceSettings = sourceProfile?.settings || source.thematic_features?.settings || [];
  const candidateSettings = candidateProfile?.settings || candidate.thematic_features?.settings || [];
  const sourceRoles = sourceProfile?.characterRoles || source.thematic_features?.tropes || [];
  const candidateRoles = candidateProfile?.characterRoles || candidate.thematic_features?.tropes || [];
  const settingSimilarity = calculateJaccard(sourceSettings, candidateSettings);
  const roleSimilarity = calculateJaccard(sourceRoles, candidateRoles);
  const metadataSimilarity = (settingSimilarity * 0.6) + (roleSimilarity * 0.4);

  // HARD RELEVANCE GATE:
  // Reject candidates that only match genre without meaningful plot or thematic connection
  const isBook = candidate.media_type === "book" || candidate.type === "Book";
  const hasStrongPlotConnection = plotSimilarity >= (isBook ? 0.15 : 0.12);
  const hasStrongThematicConnection = themeSimilarity >= (isBook ? 0.30 : 0.25);
  const hasStrongSemanticOverlap = semanticSimilarity >= (isBook ? 0.25 : 0.18);
  const isDirectCurated = Boolean(candidate.isDirectRecommendation);

  if (!hasStrongPlotConnection && !hasStrongThematicConnection && !hasStrongSemanticOverlap && !isDirectCurated) {
    return {
      score: 0,
      confidence: 0,
      breakdown: { plotSimilarity, semanticSimilarity, themeSimilarity, genreSimilarity },
      whyBullets: [],
      sharedThemes: [],
      isRejected: true,
      rejectReason: "Failed plot & story relevance threshold"
    };
  }

  // Hybrid Score Computation
  let finalScore = (
    (plotSimilarity * weights.plot) +
    (semanticSimilarity * weights.semantic) +
    (themeSimilarity * weights.theme) +
    (genreSimilarity * weights.genre) +
    (toneSimilarity * weights.tone) +
    (keywordSimilarity * weights.keyword) +
    (metadataSimilarity * weights.metadata)
  );

  // Direct TMDB recommendation boost (curated by filmmakers & community)
  if (candidate.isDirectRecommendation) {
    finalScore = Math.min(1.0, finalScore + 0.15);
  }

  // Find genuine overlapping evidence for grounded explainability
  const matchingThemes = sourceThemes.filter(t => candidateThemes.some(ct => ct.toLowerCase() === t.toLowerCase()));
  const matchingConcepts = sourceConcepts.filter(c => candidateConcepts.some(cc => cc.toLowerCase() === c.toLowerCase()));
  const matchingSettings = sourceSettings.filter(s => candidateSettings.some(cs => cs.toLowerCase() === s.toLowerCase()));
  const matchingTones = sourceTones.filter(t => candidateTones.some(ct => ct.toLowerCase() === t.toLowerCase()));
  const matchingRoles = sourceRoles.filter(r => candidateRoles.some(cr => cr.toLowerCase() === r.toLowerCase()));
  const matchingGenres = sourceGenres.filter(g => candidateGenres.some(cg => cg.toLowerCase() === g.toLowerCase()));

  // Generate evidence-based "Why it connects"
  const whyBullets = [];

  // 1. Plot & Core Conflict Evidence
  if (plotSimilarity >= 0.15 || matchingConcepts.length > 0) {
    if (matchingConcepts.length > 0) {
      whyBullets.push(`Story Premise: Explores ${matchingConcepts.join(", ")}.`);
    } else if (sourceProfile?.centralConflict && candidateProfile?.centralConflict) {
      whyBullets.push(`Narrative Parallels: Shares the core dynamic of overcoming high-stakes conflicts and chaotic obstacles.`);
    }
  }

  // 2. Thematic Overlap Evidence
  if (matchingThemes.length > 0) {
    whyBullets.push(`Thematic Resonance: ${matchingThemes.join(", ")}.`);
  }

  // 3. Setting / World Overlap
  if (matchingSettings.length > 0) {
    whyBullets.push(`Setting & Environment: Set in ${matchingSettings.join(", ")}.`);
  }

  // 4. Tone / Atmosphere
  if (matchingTones.length > 0) {
    whyBullets.push(`Tone & Atmosphere: ${matchingTones.join(", ")}.`);
  }

  // 5. Character Archetypes
  if (matchingRoles.length > 0 && whyBullets.length < 3) {
    whyBullets.push(`Character Dynamics: Features ${matchingRoles.join(", ")}.`);
  }

  // 6. Shared Genre (Only as supporting evidence if whyBullets has room)
  if (matchingGenres.length > 0 && whyBullets.length < 2) {
    whyBullets.push(`Shared Genre: ${matchingGenres.join(", ")}.`);
  }

  const sharedThemes = Array.from(new Set([
    ...matchingThemes,
    ...matchingConcepts,
    ...matchingSettings,
    ...matchingTones
  ]));

  const confidence = Math.min(1.0, (plotSimilarity * 0.5) + (themeSimilarity * 0.3) + (semanticSimilarity * 0.2));

  return {
    score: Math.min(1.0, Math.max(0.0, finalScore)),
    confidence,
    sharedThemes,
    whyBullets,
    isRejected: false,
    breakdown: {
      plotSimilarity: Math.round(plotSimilarity * 100) / 100,
      semanticSimilarity: Math.round(semanticSimilarity * 100) / 100,
      themeSimilarity: Math.round(themeSimilarity * 100) / 100,
      genreSimilarity: Math.round(genreSimilarity * 100) / 100,
      toneSimilarity: Math.round(toneSimilarity * 100) / 100,
      keywordSimilarity: Math.round(keywordSimilarity * 100) / 100,
      metadataSimilarity: Math.round(metadataSimilarity * 100) / 100
    }
  };
}

/**
 * Rank candidates for a given source item with strict plot quality gating & diversity
 */
export function rankCandidates(source, candidates = [], options = {}) {
  const { filterType = null, minScore = 0.05, limit = 10, weights = DEFAULT_WEIGHTS } = options;

  const sourceCleanTitle = (source.title || "").toLowerCase().replace(/[:\-\d]/g, "").trim();

  // Filter out identical source item and exact title duplicates in same medium
  let list = candidates.filter(c => {
    if (c.id === source.id) return false;
    const candCleanTitle = (c.title || "").toLowerCase().replace(/[:\-\d]/g, "").trim();
    if (candCleanTitle === sourceCleanTitle && (c.media_type || c.type) === (source.media_type || source.type)) {
      return false;
    }
    return true;
  });

  if (filterType) {
    const normType = filterType.toLowerCase().includes("tv") ? "tv" : filterType.toLowerCase().includes("book") ? "book" : "movie";
    list = list.filter(c => c.media_type === normType);
  }

  const scoredList = [];

  for (const candidate of list) {
    const res = scoreRecommendation(source, candidate, weights);
    if (!res.isRejected && res.score >= minScore) {
      scoredList.push({
        item: candidate,
        similarityScore: res.score,
        confidence: res.confidence,
        sharedThemes: res.sharedThemes,
        whyBullets: res.whyBullets,
        breakdown: res.breakdown
      });
    }
  }

  // Sort descending by content similarity score
  scoredList.sort((a, b) => b.similarityScore - a.similarityScore);

  // Apply candidate diversity
  const diversified = [];
  const seenConcepts = new Map();

  for (const entry of scoredList) {
    const topShared = entry.sharedThemes[0] || "general";
    const count = seenConcepts.get(topShared) || 0;

    if (count < 2 || diversified.length < Math.min(2, limit)) {
      seenConcepts.set(topShared, count + 1);
      diversified.push(entry);
    }

    if (diversified.length >= limit) break;
  }

  return diversified;
}
