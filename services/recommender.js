/**
 * movlib Recommendation Algorithm & Vector Similarity Engine
 * Hybrid Multi-Factor Scoring (Semantic Cosine + Thematic Jaccard + Mood Matching)
 */

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
  "you've", "your", "yours", "yourself", "yourselves"
]);

/**
 * Tokenize and normalize text into meaningful term frequency map
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

  const setA = new Set(arrA.map(s => s.toLowerCase().trim()));
  const setB = new Set(arrB.map(s => s.toLowerCase().trim()));

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0.0 : intersection / union;
}

// Default engineering weights (configurable / tunable via options.weights)
export const DEFAULT_WEIGHTS = {
  semantic: 0.65,       // Semantic text similarity (Plot + Synopsis + Narrative Profile)
  theme: 0.15,          // Core Theme similarity (Morality, Existentialism, Rebellion, etc.)
  genre: 0.10,          // Genre similarity (Sci-Fi, Drama, Mystery, Thriller, etc.)
  conceptKeyword: 0.05, // Concepts & Keywords similarity (Time Dilation, Panopticon, AI, etc.)
  metadataTone: 0.05,   // Setting, Tone/Atmosphere, Character Archetypes
  title: 0.00           // Title similarity is strictly 0% to prevent title-word contamination
};

/**
 * Compute Hybrid Recommendation Score between a source item and a candidate item
 * STRICT CONTENT-ONLY SIMILARITY:
 * Evaluates Story Plot, Themes, Genres, Concepts, Keywords, Characters, Setting, and Tone.
 * Title strings have 0% influence on similarity ranking.
 */
export function scoreRecommendation(source, candidate, customWeights = {}) {
  if (!source || !candidate || source.id === candidate.id) return { score: 0, breakdown: {}, whyBullets: [] };

  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  // 1. Semantic Vector Similarity (Plot + Synopsis + Narrative profile - NO Title text)
  const sourceText = `${source.synopsis || ""} ${source.narrative_profile || ""} ${(source.tags || []).join(" ")}`;
  const candidateText = `${candidate.synopsis || ""} ${candidate.narrative_profile || ""} ${(candidate.tags || []).join(" ")}`;
  
  const tfA = tokenize(sourceText);
  const tfB = tokenize(candidateText);
  const semanticScore = computeCosineSimilarity(tfA, tfB);

  // 2. Thematic Overlap Score
  const sourceThemes = source.thematic_features?.themes || source.tags || [];
  const candidateThemes = candidate.thematic_features?.themes || candidate.tags || [];
  const themeScore = calculateJaccard(sourceThemes, candidateThemes);

  // 3. Genre Overlap Score
  const sourceGenres = Array.isArray(source.genres) ? source.genres : (typeof source.genres === "string" ? JSON.parse(source.genres || "[]") : []);
  const candidateGenres = Array.isArray(candidate.genres) ? candidate.genres : (typeof candidate.genres === "string" ? JSON.parse(candidate.genres || "[]") : []);
  const genreScore = calculateJaccard(sourceGenres, candidateGenres);

  // 4. Concepts & Keywords Overlap Score
  const sourceConcepts = source.thematic_features?.concepts || [];
  const candidateConcepts = candidate.thematic_features?.concepts || [];
  const conceptScore = calculateJaccard(sourceConcepts, candidateConcepts);

  // 5. Tone, Setting & Character Dynamics Overlap Score
  const sourceMoods = source.thematic_features?.moods || source.thematic_features?.tones || [];
  const candidateMoods = candidate.thematic_features?.moods || candidate.thematic_features?.tones || [];
  const sourceSettings = source.thematic_features?.settings || [];
  const candidateSettings = candidate.thematic_features?.settings || [];
  const sourceTropes = source.thematic_features?.tropes || source.thematic_features?.characters || [];
  const candidateTropes = candidate.thematic_features?.tropes || candidate.thematic_features?.characters || [];

  const moodScore = calculateJaccard(sourceMoods, candidateMoods);
  const settingScore = calculateJaccard(sourceSettings, candidateSettings);
  const tropeScore = calculateJaccard(sourceTropes, candidateTropes);
  const metadataToneScore = (moodScore * 0.4) + (settingScore * 0.3) + (tropeScore * 0.3);

  // Hybrid Ranking Formula:
  const finalScore = (
    (semanticScore * weights.semantic) +
    (themeScore * weights.theme) +
    (genreScore * weights.genre) +
    (conceptScore * weights.conceptKeyword) +
    (metadataToneScore * weights.metadataTone)
  );

  // Collect overlapping features for explainability ("Why Recommended")
  const matchingThemes = sourceThemes.filter(t => candidateThemes.some(ct => ct.toLowerCase() === t.toLowerCase()));
  const matchingConcepts = sourceConcepts.filter(c => candidateConcepts.some(cc => cc.toLowerCase() === c.toLowerCase()));
  const matchingMoods = sourceMoods.filter(m => candidateMoods.some(cm => cm.toLowerCase() === m.toLowerCase()));
  const matchingSettings = sourceSettings.filter(s => candidateSettings.some(cs => cs.toLowerCase() === s.toLowerCase()));
  const matchingGenres = sourceGenres.filter(g => candidateGenres.some(cg => cg.toLowerCase() === g.toLowerCase()));

  // Generate structured "Why Recommended" bullets grounded strictly in feature overlap
  const whyBullets = [];
  if (matchingConcepts.length > 0) {
    whyBullets.push(`Core Concept: ${matchingConcepts.join(", ")}`);
  }
  if (matchingThemes.length > 0) {
    whyBullets.push(`Thematic Resonance: ${matchingThemes.join(", ")}`);
  }
  if (matchingMoods.length > 0) {
    whyBullets.push(`Atmosphere & Tone: ${matchingMoods.join(", ")}`);
  }
  if (matchingSettings.length > 0) {
    whyBullets.push(`Setting & World: ${matchingSettings.join(", ")}`);
  }
  if (matchingGenres.length > 0 && whyBullets.length < 3) {
    whyBullets.push(`Shared Genre: ${matchingGenres.join(", ")}`);
  }

  const sharedThemes = Array.from(new Set([
    ...matchingThemes,
    ...matchingConcepts,
    ...matchingMoods,
    ...matchingSettings
  ]));

  return {
    score: Math.min(1.0, Math.max(0.0, finalScore)),
    sharedThemes,
    whyBullets,
    breakdown: {
      semanticScore,
      themeScore,
      genreScore,
      conceptScore,
      metadataToneScore
    }
  };
}

/**
 * Rank candidates for a given source item with diversity & category filtering
 */
export function rankCandidates(source, candidates = [], options = {}) {
  const { filterType = null, minScore = 0.02, limit = 10, weights = DEFAULT_WEIGHTS } = options;

  // Filter out identical item
  let list = candidates.filter(c => c.id !== source.id);

  if (filterType) {
    const normType = filterType.toLowerCase().includes("tv") ? "tv" : filterType.toLowerCase().includes("book") ? "book" : "movie";
    list = list.filter(c => c.media_type === normType);
  }

  const scoredList = list.map(candidate => {
    const { score, sharedThemes, whyBullets, breakdown } = scoreRecommendation(source, candidate, weights);
    return {
      item: candidate,
      similarityScore: score,
      sharedThemes,
      whyBullets,
      breakdown
    };
  });

  // Sort descending by content similarity score
  scoredList.sort((a, b) => b.similarityScore - a.similarityScore);

  // Apply candidate diversity: prevent returning multiple near-identical items with identical primary concept
  const diversified = [];
  const seenConcepts = new Map();

  for (const entry of scoredList) {
    if (entry.similarityScore < minScore) continue;
    const topShared = entry.sharedThemes[0] || "general";
    const count = seenConcepts.get(topShared) || 0;

    // Allow at most 2 items with the exact same primary theme/concept tag in the top recommendations
    if (count < 2 || diversified.length < Math.min(3, limit)) {
      seenConcepts.set(topShared, count + 1);
      diversified.push(entry);
    }

    if (diversified.length >= limit) break;
  }

  return diversified;
}

