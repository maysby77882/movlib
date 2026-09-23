/**
 * movlib Narrative Intelligence & Feature Extraction Engine
 * Decomposes works into 6 deep story dimensions:
 * 1. Plot & Central Conflict
 * 2. Themes (Morality, Existentialism, Loss, Rebellion...)
 * 3. Concepts (Time Loops, AI Consciousness, Dystopia...)
 * 4. Character Dynamics & Archetypes (Flawed vigilante, Solitary castaway...)
 * 5. Setting & World (Gothic metropolis, Deep space, Desert ecology...)
 * 6. Tone & Atmosphere (Cerebral, Bleak, Gritty, Mind-bending...)
 *
 * IMPORTANT: Title tokens are excluded from content embeddings to eliminate title-string bias.
 */

// 1. Curated Core Themes Taxonomy
export const THEMES_TAXONOMY = {
  "Morality & Corruption": ["morality", "moral ambiguity", "corruption", "justice", "vigilante", "crime", "redemption", "conspiracy", "ethical dilemma", "greed", "decay"],
  "Existentialism & Identity": ["existentialism", "human condition", "identity", "what it means to be human", "purpose", "consciousness", "solipsism", "meaning of life"],
  "Power & Political Intrigue": ["political intrigue", "feudal", "great houses", "emperor", "succession", "rebellion", "dynastic", "propaganda", "oppression", "coup", "hierarchy"],
  "Sacrifice & Parental Grief": ["parental bond", "father daughter", "grief", "loss", "sacrifice for family", "love transcends time", "mourning", "familial duty"],
  "Rebellion & Anti-Totalitarianism": ["rebellion", "insurrection", "anti-totalitarian", "state surveillance", "dystopian regime", "thought police", "freedom fighter", "resistance"],
  "Isolation & Solitude": ["isolation", "solitary", "stranded", "alienation", "loneliness", "alone in the universe", "desolation", "survival alone"],
  "Determinism vs Free Will": ["determinism", "free will", "fate", "prophesied", "inevitable cycle", "predestination", "choice vs destiny", "bootstrap paradox"],
  "Scientific Rigor & Exploration": ["scientific discovery", "hard science", "astrophysics", "botany", "problem solving", "human ingenuity", "scientific method", "physics"]
};

// 2. High-Level Story Concepts Taxonomy
export const CONCEPTS_TAXONOMY = {
  "Time Dilation & Relativity": ["time dilation", "relativity", "gravitational singularity", "black hole", "wormhole", "event horizon", "astrophysics"],
  "Causal Loops & Time Travel": ["time travel", "causal loop", "time loop", "bootstrap paradox", "recursive time", "alternate timelines", "temporal anomaly", "ouroboros"],
  "Artificial Intelligence & Sentience": ["artificial intelligence", "synthetic consciousness", "android", "replicant", "turing test", "ai sentience", "cyborg", "machine autonomy"],
  "Dystopian Panopticon": ["surveillance state", "panopticon", "doublethink", "memory alteration", "censorship", "bureaucratic nightmare", "monitored constantly"],
  "First Contact & Cosmic Unknown": ["first contact", "extraterrestrial intelligence", "cosmic signal", "alien artifact", "linguistic translation", "non-human mind"],
  "Simulations & Altered Reality": ["constructed reality", "simulation", "matrix", "erased memory", "split consciousness", "false reality", "severance"],
  "Extinction-Level Crisis": ["extinction threat", "cosmic crisis", "uninhabitable earth", "planetary blight", "civilization collapse", "last-chance mission"],
  "Desert Ecology & Nomadic Culture": ["desert ecology", "extreme environment", "nomadic tribes", "spice", "sandworm", "resource scarcity", "water conservation"]
};

// 3. Setting & World Taxonomy
export const SETTING_TAXONOMY = {
  "Deep Space & Exoplanets": ["deep space", "spacecraft", "interstellar", "exoplanet", "orbit", "alien world", "barren planet", "space station"],
  "Gothic / Urban Noir": ["gothic city", "noir metropolis", "urban crime", "rain-drenched streets", "neon alleys", "underworld", "corrupt city"],
  "Dystopian Megacity": ["futuristic city", "megacity", "corporate towers", "sterile office", "subterranean complex", "totalitarian state"],
  "Isolated Rural / Small Town": ["small town", "gloomy forest", "mysterious cave", "isolated village", "rural community", "nuclear plant vicinity"],
  "Desert Wasteland": ["desert world", "harsh dunes", "arid wasteland", "sand sea", "inhospitable landscape"]
};

// 4. Tone & Atmosphere Taxonomy
export const TONE_TAXONOMY = {
  "Cerebral & Mind-Bending": ["cerebral", "mind-bending", "intellectual", "puzzle-box", "philosophical", "complex narrative", "non-linear"],
  "Dark & Gritty": ["dark", "gritty", "hardboiled", "cynical", "uncompromising", "raw", "grim", "visceral"],
  "Bleak & Melancholic": ["bleak", "somber", "gloomy", "melancholic", "tragic", "mournful", "haunting", "despairing"],
  "Awe & Wonder": ["awe", "wonder", "majestic", "cosmic scale", "breathtaking", "epic scope", "transcendent", "sublime"],
  "Tense & Claustrophobic": ["tense", "claustrophobic", "suspenseful", "paranoia", "dread", "suffocating", "high-stakes"],
  "Eerie & Uncanny": ["eerie", "uncanny", "mysterious", "chilling", "surreal", "enigmatic", "hypnotic"]
};

// 5. Character Archetypes & Dynamics
export const CHARACTER_TAXONOMY = {
  "Flawed Vigilante / Reluctant Hero": ["vigilante", "tormented hero", "reluctant savior", "morally grey protagonist", "troubled past"],
  "Obsessive Nemesis / Ideological Foe": ["philosophical nemesis", "agent of chaos", "fanatical antagonist", "mastermind", "shadow self"],
  "Solitary Specialist / Castaway": ["lone survivor", "isolated scientist", "botanist", "pilot", "sole operative", "engineer alone"],
  "The Chosen Reluctant Messiah": ["prophesied leader", "messianic figure", "outsider chosen", "reluctant emperor", "cult of personality"],
  "The Awoken Worker / Split Persona": ["severed mind", "dual identity", "corporate worker awakening", "memory-wiped agent"]
};

/**
 * Clean synopsis text (removes boilerplate, HTML, editorial notes)
 */
export function cleanText(rawText) {
  if (!rawText || typeof rawText !== "string") return "";

  return rawText
    .replace(/<[^>]*>?/gm, " ")
    .replace(/(now a major (motion picture|film|tv series|netflix series))/gi, "")
    .replace(/(from the (new york times|internationally) best-?selling author[^.]*\.)/gi, "")
    .replace(/(winner of the (hugo|nebula|pulitzer|oscar|academy award)[^.]*\.)/gi, "")
    .replace(/(praise for [^.]*\.)/gi, "")
    .replace(/(includes exclusive (bonus material|interview)[^.]*\.)/gi, "")
    .replace(/(\b(isbn|issn|hardcover|paperback)\b[:\s\d-]+)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Match a taxonomy dictionary against content text
 */
function matchTaxonomy(text, taxonomy) {
  const matches = new Set();
  const lower = (text || "").toLowerCase();

  for (const [categoryName, keywords] of Object.entries(taxonomy)) {
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "i");
      if (regex.test(lower)) {
        matches.add(categoryName);
        break;
      }
    }
  }
  return Array.from(matches);
}

/**
 * Extract multi-dimensional content features from synopsis, genres, and metadata
 * (Strictly excludes the work's title to avoid title-string contamination)
 */
export function extractContentDimensions(item) {
  const synopsis = cleanText(item.synopsis || item.description || item.overview || "");
  const genres = Array.isArray(item.genres) ? item.genres.join(" ") : "";
  const existingTags = Array.isArray(item.tags) ? item.tags.join(" ") : "";

  // Content text ONLY (No title)
  const contentText = `${synopsis} ${genres} ${existingTags}`;

  const themes = matchTaxonomy(contentText, THEMES_TAXONOMY);
  const concepts = matchTaxonomy(contentText, CONCEPTS_TAXONOMY);
  const settings = matchTaxonomy(contentText, SETTING_TAXONOMY);
  const tones = matchTaxonomy(contentText, TONE_TAXONOMY);
  const characters = matchTaxonomy(contentText, CHARACTER_TAXONOMY);

  return {
    cleanedSynopsis: synopsis,
    themes: themes.length > 0 ? themes : ["Narrative Drama"],
    concepts,
    settings,
    tones: tones.length > 0 ? tones : ["Dramatic"],
    characters,
    allThematicTags: Array.from(new Set([...themes, ...concepts, ...tones, ...settings]))
  };
}

/**
 * Build pure semantic content representation for embedding & similarity
 * (Contains NO title text to guarantee recommendations are 100% about what the story is about)
 */
export function buildNarrativeProfile(item) {
  if (!item) return null;

  const dims = extractContentDimensions(item);

  // Pure content representation without title tokens
  const narrativeProfileText = [
    `Medium: ${item.type || item.media_type || "Story"}`,
    dims.themes.length > 0 ? `Themes: ${dims.themes.join("; ")}` : "",
    dims.concepts.length > 0 ? `Concepts: ${dims.concepts.join("; ")}` : "",
    dims.tones.length > 0 ? `Tone & Atmosphere: ${dims.tones.join("; ")}` : "",
    dims.settings.length > 0 ? `Setting: ${dims.settings.join("; ")}` : "",
    dims.characters.length > 0 ? `Character Dynamics: ${dims.characters.join("; ")}` : "",
    `Story Essence: ${dims.cleanedSynopsis}`
  ].filter(Boolean).join("\n");

  return {
    cleanedSynopsis: dims.cleanedSynopsis,
    themes: dims.themes,
    concepts: dims.concepts,
    settings: dims.settings,
    moods: dims.tones,
    tropes: dims.characters,
    allTags: dims.allThematicTags,
    narrativeProfileText
  };
}

