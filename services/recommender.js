/**
 * movlib Deep Story-First & Plot-Driven Recommendation Engine
 *
 * Implements Multi-Layered Story Scoring Hierarchy:
 * LEVEL 1 — Plot Similarity (35%): What actually happens in the story, events, problem progression, stakes
 * LEVEL 2 — Narrative Structure & Story Pattern (15%): Descent, quest, survival, hubris, recursive loops
 * LEVEL 3 — Premise & Central Conflict (12%): Core logline hook and overarching problem
 * LEVEL 4 — Character Psychology & Motivation (10%): Protagonist role, traits, internal conflict
 * LEVEL 5 — Deep Themes & Philosophy (10%): Alienation, morality, existentialism, power
 * LEVEL 6 — Semantic Story DNA (8%): Full narrative profile vector representation
 * LEVEL 7 — Tone & Atmosphere (4%): Mood, pacing, visceral/cerebral feel
 * LEVEL 8 — Genre Alignment (3%): High-level category (supporting signal only)
 * LEVEL 9 — Story Keywords (2%): Key plot tokens
 * LEVEL 10 — Metadata / Context (1%): Setting and world
 *
 * Title similarity is strictly 0% to prevent title-word contamination.
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

// Procedural / Non-narrative patterns to filter out from serious narrative recommendations
const PROCEDURAL_PATTERNS = [
  "law & order", "special victims unit", "csi:", "ncis", "criminal minds", "chicago p.d.",
  "blue bloods", "fbi: most wanted", "hawaii five-0", "bones", "castle", "cold case",
  "without a trace", "the mentalist", "major crimes", "alien crimes", "batman: mystery of the batwoman"
];

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

  // Include 2-word n-grams for narrative phrases
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

/**
 * Independent Representation Generators (STAGE 3)
 */
export function getPlotVector(itemOrProfile) {
  const profile = itemOrProfile.premise ? itemOrProfile : buildStoryProfile(itemOrProfile);
  const text = profile?.plotRepresentation || `${profile?.synopsis || ""} ${profile?.centralConflict || ""}`;
  return tokenize(text);
}

export function getStoryVector(itemOrProfile) {
  const profile = itemOrProfile.premise ? itemOrProfile : buildStoryProfile(itemOrProfile);
  const text = profile?.storyRepresentation || `${profile?.narrativeStructure || ""} ${profile?.protagonistRole || ""}`;
  return tokenize(text);
}

export function getThemeVector(itemOrProfile) {
  const profile = itemOrProfile.premise ? itemOrProfile : buildStoryProfile(itemOrProfile);
  const text = profile?.themeRepresentation || (profile?.themes || []).join(" ");
  return tokenize(text);
}

export function computePlotSimilarity(source, candidate) {
  return computeCosineSimilarity(getPlotVector(source), getPlotVector(candidate));
}

export function computeStorySimilarity(source, candidate) {
  return computeCosineSimilarity(getStoryVector(source), getStoryVector(candidate));
}

export function computeThemeSimilarity(source, candidate) {
  const sourceProfile = source.premise ? source : buildStoryProfile(source);
  const candidateProfile = candidate.premise ? candidate : buildStoryProfile(candidate);
  const sThemes = sourceProfile?.themes || [];
  const cThemes = candidateProfile?.themes || [];
  return calculateJaccard(sThemes, cThemes);
}

// Centralized 72%+ Story-First Scoring Weights (STAGE 5)
export const RECOMMENDATION_WEIGHTS = {
  plot: 0.35,                    // LEVEL 1: Actual plot events, causal chain, stakes, progression (35%)
  structure: 0.15,               // LEVEL 2: Narrative structure & story pattern (15%)
  premise: 0.12,                 // LEVEL 3: Core Premise & Central Conflict (12%)
  character: 0.10,               // LEVEL 4: Protagonist role, traits, motivation, internal conflict (10%)
  theme: 0.10,                   // LEVEL 5: Core Themes & Philosophical Resonance (10%)
  semantic: 0.08,                // LEVEL 6: Semantic Story DNA Vector (8%)
  tone: 0.04,                    // LEVEL 7: Tone & Atmosphere (4%)
  genre: 0.03,                   // LEVEL 8: Genre Alignment (3%)
  keyword: 0.02,                 // LEVEL 9: Story Keywords (2%)
  metadata: 0.01,                // LEVEL 10: Setting & World Context (1%)
  title: 0.00                    // Title similarity is strictly 0%
};

export const DEFAULT_WEIGHTS = RECOMMENDATION_WEIGHTS;

export const STORY_GATE_THRESHOLDS = {
  minPlotThreshold: 0.10,
  secondaryPlotThreshold: 0.06,
  minStoryThreshold: 0.15,
  minPremiseThreshold: 0.12,
  minCharacterThreshold: 0.15,
  minThemeThreshold: 0.25,
  minCombinedResonance: 0.08
};

/**
 * Check if candidate is a procedural TV show or unrelated serial
 */
function isUnrelatedProcedural(candidateTitle, candidateSynopsis, sourceProfile) {
  const cTitle = (candidateTitle || "").toLowerCase();
  const cSyn = (candidateSynopsis || "").toLowerCase();

  const isProcedural = PROCEDURAL_PATTERNS.some(p => cTitle.includes(p) || cSyn.includes(p));
  if (isProcedural) {
    const sourceStructure = (sourceProfile?.narrativeStructure || "").toLowerCase();
    if (!sourceStructure.includes("procedural") && !sourceStructure.includes("case of the week")) {
      return true;
    }
  }
  return false;
}

/**
 * Check if an item is non-narrative
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

  if (
    title.startsWith("late night with") ||
    title.startsWith("the late show") ||
    title.startsWith("watch what happens live") ||
    title.startsWith("the daily show")
  ) {
    return true;
  }

  return false;
}

/**
 * Score recommendation candidate against source item using multi-vector story similarity
 */
export function scoreRecommendation(source, candidate, customWeights = {}) {
  if (!source || !candidate || source.id === candidate.id) {
    return { score: 0, confidence: 0, breakdown: {}, whyBullets: [], sharedThemes: [], isRejected: true, rejectReason: "Self match" };
  }

  // Reject non-narrative items
  if (isNonNarrativeItem(candidate)) {
    return { score: 0, confidence: 0, breakdown: {}, whyBullets: [], sharedThemes: [], isRejected: true, rejectReason: "Non-narrative media" };
  }

  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  // Ensure structured profiles
  const sourceProfile = source.premise ? source : buildStoryProfile(source);
  const candidateProfile = candidate.premise ? candidate : buildStoryProfile(candidate);

  // Reject procedural crime shows if source is a psychological character study
  if (isUnrelatedProcedural(candidate.title, candidate.synopsis, sourceProfile)) {
    return {
      score: 0,
      confidence: 0,
      breakdown: { rejectReason: "Procedural case-of-the-week mismatch" },
      whyBullets: [],
      sharedThemes: [],
      isRejected: true,
      rejectReason: "Procedural formula mismatch with psychological narrative"
    };
  }

  // 1. PLOT SIMILARITY (35% Weight) — Events, Stakes, Actions, Causal Chain
  const plotVecA = getPlotVector(sourceProfile);
  const plotVecB = getPlotVector(candidateProfile);
  const plotSimilarity = computeCosineSimilarity(plotVecA, plotVecB);

  // 2. NARRATIVE STRUCTURE SIMILARITY (15% Weight)
  const sourceStructures = sourceProfile?.narrativeStructures || [sourceProfile?.narrativeStructure || ""];
  const candidateStructures = candidateProfile?.narrativeStructures || [candidateProfile?.narrativeStructure || ""];
  const structureSimilarity = calculateJaccard(sourceStructures, candidateStructures);

  // 3. PREMISE & CENTRAL CONFLICT SIMILARITY (12% Weight)
  const sourcePremiseConflict = `${sourceProfile?.premise || ""} ${sourceProfile?.centralConflict || ""}`;
  const candidatePremiseConflict = `${candidateProfile?.premise || ""} ${candidateProfile?.centralConflict || ""}`;
  const premiseVecA = tokenize(sourcePremiseConflict);
  const premiseVecB = tokenize(candidatePremiseConflict);
  const premiseSimilarity = computeCosineSimilarity(premiseVecA, premiseVecB);

  // 4. CHARACTER & MOTIVATION SIMILARITY (10% Weight)
  const sourceCharText = `${sourceProfile?.protagonistRole || ""} ${(sourceProfile?.protagonistTraits || []).join(" ")} ${sourceProfile?.protagonistMotivation || ""} ${sourceProfile?.protagonistInternalConflict || ""}`;
  const candidateCharText = `${candidateProfile?.protagonistRole || ""} ${(candidateProfile?.protagonistTraits || []).join(" ")} ${candidateProfile?.protagonistMotivation || ""} ${candidateProfile?.protagonistInternalConflict || ""}`;
  const charVecA = tokenize(sourceCharText);
  const charVecB = tokenize(candidateCharText);
  const characterSimilarity = computeCosineSimilarity(charVecA, charVecB);

  // 5. THEMATIC OVERLAP (10% Weight)
  const sourceThemes = sourceProfile?.themes || source.thematic_features?.themes || [];
  const candidateThemes = candidateProfile?.themes || candidate.thematic_features?.themes || [];
  const themeSimilarity = calculateJaccard(sourceThemes, candidateThemes);

  // 6. SEMANTIC STORY DNA (8% Weight)
  const sourceDNA = sourceProfile?.storyDNA || `${source.narrative_profile || ""} ${source.synopsis || ""}`;
  const candidateDNA = candidateProfile?.storyDNA || `${candidate.narrative_profile || ""} ${candidate.synopsis || ""}`;
  const semanticVecA = tokenize(sourceDNA);
  const semanticVecB = tokenize(candidateDNA);
  const semanticSimilarity = computeCosineSimilarity(semanticVecA, semanticVecB);

  // 7. TONE & ATMOSPHERE (4% Weight)
  const sourceTones = sourceProfile?.tones || sourceProfile?.moods || source.thematic_features?.moods || [];
  const candidateTones = candidateProfile?.tones || candidateProfile?.moods || candidate.thematic_features?.moods || [];
  const toneSimilarity = calculateJaccard(sourceTones, candidateTones);

  // 8. GENRE SIMILARITY (3% Weight — Minor supporting signal)
  const parseArr = val => Array.isArray(val) ? val : (typeof val === "string" ? (val.startsWith("[") ? JSON.parse(val) : val.split(",")) : []);
  const sourceGenres = parseArr(source.genres);
  const candidateGenres = parseArr(candidate.genres);
  const genreSimilarity = calculateJaccard(sourceGenres, candidateGenres);

  // 9. KEYWORDS SIMILARITY (2% Weight)
  const sourceKeywords = parseArr(source.keywords || []);
  const candidateKeywords = parseArr(candidate.keywords || []);
  const keywordSimilarity = calculateJaccard(sourceKeywords, candidateKeywords);

  // 10. METADATA & SETTING (1% Weight)
  const sourceSettings = sourceProfile?.settings || source.thematic_features?.settings || [];
  const candidateSettings = candidateProfile?.settings || candidate.thematic_features?.settings || [];
  const metadataSimilarity = calculateJaccard(sourceSettings, candidateSettings);

  // HARD STORY RELEVANCE GATE (STAGE 5):
  // Must satisfy plot similarity or joint story/premise similarity; genre/keywords/theme alone cannot pass.
  const isBook = candidate.media_type === "book" || candidate.type === "Book";
  const minPlot = isBook ? STORY_GATE_THRESHOLDS.minPlotThreshold * 0.9 : STORY_GATE_THRESHOLDS.minPlotThreshold;
  
  const hasStrongPlot = plotSimilarity >= minPlot;
  const hasPlotAndStructure = (plotSimilarity >= STORY_GATE_THRESHOLDS.secondaryPlotThreshold) && 
    (structureSimilarity >= STORY_GATE_THRESHOLDS.minStoryThreshold || premiseSimilarity >= STORY_GATE_THRESHOLDS.minPremiseThreshold);
  const hasCharacterAndPlot = (characterSimilarity >= STORY_GATE_THRESHOLDS.minCharacterThreshold) && 
    (plotSimilarity >= STORY_GATE_THRESHOLDS.secondaryPlotThreshold);
  const isDirectCurated = Boolean(candidate.isDirectRecommendation);

  const passedGate = hasStrongPlot || hasPlotAndStructure || hasCharacterAndPlot || isDirectCurated;

  if (!passedGate) {
    return {
      score: 0,
      confidence: 0,
      breakdown: {
        plotSimilarity: Math.round(plotSimilarity * 100) / 100,
        structureSimilarity: Math.round(structureSimilarity * 100) / 100,
        premiseSimilarity: Math.round(premiseSimilarity * 100) / 100,
        characterSimilarity: Math.round(characterSimilarity * 100) / 100,
        themeSimilarity: Math.round(themeSimilarity * 100) / 100,
        genreSimilarity: Math.round(genreSimilarity * 100) / 100,
        gatePassed: false
      },
      whyBullets: [],
      sharedThemes: [],
      isRejected: true,
      rejectReason: "Failed deep plot & story relevance gate"
    };
  }

  // Final Hybrid Story-First Score
  let finalScore = (
    (plotSimilarity * weights.plot) +
    (structureSimilarity * weights.structure) +
    (premiseSimilarity * weights.premise) +
    (characterSimilarity * weights.character) +
    (themeSimilarity * weights.theme) +
    (semanticSimilarity * weights.semantic) +
    (toneSimilarity * weights.tone) +
    (genreSimilarity * weights.genre) +
    (keywordSimilarity * weights.keyword) +
    (metadataSimilarity * weights.metadata)
  );

  if (candidate.isDirectRecommendation) {
    finalScore = Math.min(1.0, finalScore + 0.12);
  }

  // Grounded explainability (STAGE 7)
  const matchingThemes = sourceThemes.filter(t => candidateThemes.some(ct => ct.toLowerCase() === t.toLowerCase()));
  const matchingStructures = sourceStructures.filter(s => candidateStructures.some(cs => cs.toLowerCase() === s.toLowerCase()));
  const matchingSettings = sourceSettings.filter(s => candidateSettings.some(cs => cs.toLowerCase() === s.toLowerCase()));
  const matchingTones = sourceTones.filter(t => candidateTones.some(ct => ct.toLowerCase() === t.toLowerCase()));

  const whyBullets = [];

  // 1. Plot Connection
  if (plotSimilarity >= 0.12 || premiseSimilarity >= 0.12) {
    if (sourceProfile?.centralConflict && candidateProfile?.centralConflict && structureSimilarity > 0) {
      whyBullets.push(`Plot Connection: Both stories follow escalating stakes and intense conflict against hostile environments.`);
    } else {
      whyBullets.push(`Plot Connection: Shares the core narrative problem and causal trajectory.`);
    }
  }

  // 2. Character Connection
  if (characterSimilarity >= 0.12 || (sourceProfile?.protagonistRole && candidateProfile?.protagonistRole)) {
    whyBullets.push(`Character Connection: Centers on an outsider whose psychological drive and internal conflict become the primary engine of the narrative.`);
  }

  // 3. Story Structure
  if (matchingStructures.length > 0) {
    whyBullets.push(`Story Structure: Explores ${matchingStructures.join(", ")}.`);
  } else if (structureSimilarity > 0) {
    whyBullets.push(`Story Structure: Follows a matching narrative arc and escalating crisis.`);
  }

  // 4. Thematic Resonance
  if (matchingThemes.length > 0 && whyBullets.length < 3) {
    whyBullets.push(`Thematic Resonance: ${matchingThemes.slice(0, 2).join(", ")}.`);
  }

  // 5. Tone & Atmosphere
  if (matchingTones.length > 0 && whyBullets.length < 3) {
    whyBullets.push(`Tone & Atmosphere: ${matchingTones.slice(0, 2).join(", ")}.`);
  }

  // 6. Setting & Environment
  if (matchingSettings.length > 0 && whyBullets.length < 3) {
    whyBullets.push(`Setting & Environment: Set in ${matchingSettings.join(", ")}.`);
  }

  const sharedThemes = Array.from(new Set([
    ...matchingThemes,
    ...matchingStructures,
    ...matchingTones
  ]));

  const confidence = Math.min(1.0, (plotSimilarity * 0.4) + (structureSimilarity * 0.3) + (themeSimilarity * 0.3));

  return {
    score: Math.min(1.0, Math.max(0.0, finalScore)),
    confidence,
    sharedThemes,
    whyBullets,
    isRejected: false,
    breakdown: {
      plotSimilarity: Math.round(plotSimilarity * 100) / 100,
      structureSimilarity: Math.round(structureSimilarity * 100) / 100,
      premiseSimilarity: Math.round(premiseSimilarity * 100) / 100,
      characterSimilarity: Math.round(characterSimilarity * 100) / 100,
      themeSimilarity: Math.round(themeSimilarity * 100) / 100,
      semanticSimilarity: Math.round(semanticSimilarity * 100) / 100,
      toneSimilarity: Math.round(toneSimilarity * 100) / 100,
      genreSimilarity: Math.round(genreSimilarity * 100) / 100,
      keywordSimilarity: Math.round(keywordSimilarity * 100) / 100,
      metadataSimilarity: Math.round(metadataSimilarity * 100) / 100,
      gatePassed: true
    }
  };
}

/**
 * Rank candidates for a given source item with strict story gating and diversity
 */
export function rankCandidates(source, candidates = [], options = {}) {
  const { filterType = null, minScore = 0.05, limit = 3, weights = DEFAULT_WEIGHTS, returnRejected = false } = options;

  const sourceCleanTitle = (source.title || "").toLowerCase().replace(/[:\-\d]/g, "").trim();

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
  const rejectedList = [];

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
    } else if (res.isRejected) {
      rejectedList.push({
        title: candidate.title,
        id: candidate.id,
        rejectReason: res.rejectReason,
        breakdown: res.breakdown
      });
    }
  }

  scoredList.sort((a, b) => b.similarityScore - a.similarityScore);

  const diversified = [];
  const seenTitles = new Set();

  for (const entry of scoredList) {
    const normTitle = entry.item.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!seenTitles.has(normTitle)) {
      seenTitles.add(normTitle);
      diversified.push(entry);
    }
    if (diversified.length >= limit) break;
  }

  if (returnRejected) {
    return { results: diversified, rejected: rejectedList };
  }

  return diversified;
}
