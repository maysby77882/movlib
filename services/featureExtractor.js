/**
 * movlib Narrative Intelligence & Deep Story DNA Engine
 * Decomposes works across 4 core levels:
 * LEVEL 1 — Metadata (Genres, Creators, Year, Medium)
 * LEVEL 2 — Themes (Friendship, Ambition, Responsibility, Power, Survival, Morality)
 * LEVEL 3 — Narrative & Story Structure (Premise, Central Conflict, Character Roles, Setting, Tone)
 * LEVEL 4 — PLOT Representation (Actual events, stakes, protagonist goals, problem progression)
 *
 * IMPORTANT: Title tokens are excluded from content embeddings to eliminate title-string bias.
 */

// 1. Core Themes Taxonomy
export const THEMES_TAXONOMY = {
  // Comedy & Lighthearted
  "Wild Misadventure & Hangover Chaos": ["bachelor party", "hangover", "missing friend", "missing groom", "blackout", "wild night", "morning after", "vegas", "gambling debt", "wedding deadline", "chaotic scramble"],
  "Slacker Life & Youthful Rebellion": ["fraternity", "sorority", "slacker", "glory days", "recapture youth", "wild party", "college life", "campus", "binge", "prank", "shenanigans", "rebellion against adulthood", "refusing to grow up"],
  "Male Friendship & Bromance": ["male friendship", "buddy", "friends for life", "trio of friends", "camaraderie", "best friends", "bros", "hangout", "unbreakable bond", "groomsmen"],
  "Midlife Crisis & Nostalgia": ["midlife crisis", "nostalgia", "recapturing glory days", "aging out", "regret", "second chance at youth", "suburban boredom", "settling down"],
  "Satire & Absurdist Farce": ["satire", "parody", "farce", "absurdist", "lampoon", "mockery", "spoof", "screwball", "irony", "dark comedy"],
  "Workplace Comedy & Slacking": ["workplace comedy", "office antics", "cubicle", "bad boss", "slacking off", "corporate drone", "dead-end job"],
  "Romantic Comedy & Modern Dating": ["romantic comedy", "rom-com", "fake dating", "enemies to lovers", "love triangle", "modern dating", "courtship", "misunderstandings in love"],

  // Sci-Fi, Speculative & Cosmic
  "Scientific Discovery & Moral Fallout": ["atomic bomb", "manhattan project", "nuclear physics", "theoretical physicist", "weapons of mass destruction", "arms race", "moral responsibility", "unintended consequences", "scientific ethics", "security hearing", "red scare"],
  "Scientific Rigor & Exploration": ["scientific discovery", "hard science", "astrophysics", "botany", "problem solving", "human ingenuity", "scientific method", "physics", "space exploration", "relativity"],
  "Existentialism & Identity": ["existentialism", "human condition", "identity", "what it means to be human", "purpose", "consciousness", "solipsism", "meaning of life"],
  "Time Loops & Relativity": ["time dilation", "relativity", "time travel", "causal loop", "time loop", "bootstrap paradox", "recursive time", "alternate timelines"],
  "Artificial Intelligence & Sentience": ["artificial intelligence", "synthetic consciousness", "android", "replicant", "turing test", "ai sentience", "cyborg", "machine autonomy"],
  "Rebellion & Anti-Totalitarianism": ["rebellion", "insurrection", "anti-totalitarian", "state surveillance", "dystopian regime", "thought police", "freedom fighter", "resistance"],
  "Determinism vs Free Will": ["determinism", "free will", "fate", "prophesied", "inevitable cycle", "predestination", "choice vs destiny"],
  "Cosmic Unknown & Planetary Survival": ["first contact", "extraterrestrial intelligence", "cosmic signal", "alien artifact", "linguistic translation", "non-human mind", "deep space", "uninhabitable earth", "planetary blight", "last-chance mission"],

  // Drama, Family & Power
  "Parental Bond & Transcendent Love": ["parental bond", "father daughter", "mother son", "grief", "loss", "sacrifice for family", "love transcends time", "mourning", "familial duty"],
  "Power, Dynasties & Political Intrigue": ["political intrigue", "feudal", "great houses", "emperor", "succession", "dynastic", "propaganda", "oppression", "coup", "hierarchy", "messianic prophecy", "imperial court"],
  "Coming of Age & Loss of Innocence": ["coming of age", "loss of innocence", "adolescence", "growing up", "youth identity", "first love", "high school transition"],
  "Ambition & Fall from Grace": ["ambition", "downfall", "hubris", "tragic flaw", "rise and fall", "greed", "relentless drive"],

  // Crime, Thriller & Action
  "Morality, Crime & Corruption": ["morality", "moral ambiguity", "corruption", "justice", "vigilante", "crime", "redemption", "conspiracy", "ethical dilemma", "underworld", "gotham", "mob boss"],
  "Chaos vs Order & Psychological Warfare": ["agent of chaos", "psychological duel", "anarchy", "nihilism", "social experiment", "interrogation", "moral test", "paranoia"],
  "Heist, Caper & Con Artistry": ["heist", "caper", "bank robbery", "con artist", "master plan", "scheming", "score", "thieves", "undercover con"],
  "Vengeance & Retribution": ["vengeance", "revenge", "retribution", "payback", "blood debt", "vendetta"]
};

// 2. Story Concepts Taxonomy
export const CONCEPTS_TAXONOMY = {
  "Vegas Bachelor Party Mystery": ["bachelor party", "las vegas", "missing groom", "memory loss", "hotel suite wreckage", "tiger", "wedding in hours", "piecing together clues", "unhinged night"],
  "Fraternity & College Shenanigans": ["fraternity", "sorority", "college campus", "pledge", "hazing", "dean", "wild party", "streaking", "beer pong", "slacker anthem"],
  "Manhattan Project & Nuclear Dawn": ["manhattan project", "atomic bomb", "los alamos", "j. robert oppenheimer", "trinity test", "radiation", "fission", "chain reaction", "post-war scrutiny"],
  "Time Dilation & Gravitational Singularity": ["time dilation", "relativity", "gravitational singularity", "black hole", "wormhole", "event horizon", "gargantua", "astrophysics"],
  "Desert Ecology & Messianic Crusade": ["desert ecology", "extreme environment", "nomadic tribes", "spice melange", "sandworm", "resource scarcity", "water conservation", " fremen", "muad'dib"],
  "Vigilante Justice & Dark Nemesis": ["vigilante", "batman", "joker", "harvey dent", "two-face", "gotham city", "corruption", "masked protector"],
  "Artificial Intelligence & Sentience": ["artificial intelligence", "synthetic consciousness", "android", "replicant", "turing test", "ai sentience", "cyborg", "machine autonomy"],
  "Dystopian Panopticon": ["surveillance state", "panopticon", "doublethink", "memory alteration", "censorship", "bureaucratic nightmare", "monitored constantly"],
  "First Contact & Cosmic Unknown": ["first contact", "extraterrestrial intelligence", "cosmic signal", "alien artifact", "linguistic translation", "non-human mind"]
};

// 3. Setting & World Taxonomy
export const SETTING_TAXONOMY = {
  "Las Vegas & Casino Strip": ["las vegas", "casino", "caesars palace", "nevada desert", "strip", "hotel suite", "chapel"],
  "College Campus & Fraternity House": ["college", "university", "campus", "fraternity house", "dormitory", "alma mater", "academic quad", "sorority row"],
  "Top-Secret Military / Research Lab": ["los alamos", "laboratory", "military base", "bunker", "classified facility", "desert test site"],
  "Deep Space & Alien Exoplanets": ["deep space", "spacecraft", "interstellar", "exoplanet", "orbit", "alien world", "barren planet", "space station"],
  "Desert World & Harsh Dunes": ["desert world", "harsh dunes", "arid wasteland", "sand sea", "inhospitable landscape", "arrakis"],
  "Urban Noir & Gritty Metropolis": ["gothic city", "noir metropolis", "urban crime", "rain-drenched streets", "neon alleys", "underworld", "corrupt city", "city streets", "gotham"],
  "Suburban Neighborhood & Domestic Life": ["suburb", "suburban", "cul-de-sac", "residential neighborhood", "middle class home", "suburbia"],
  "Workplace / Corporate Office": ["office building", "cubicle farm", "corporate headquarters", "boardroom", "workplace"]
};

// 4. Tone & Atmosphere Taxonomy
export const TONE_TAXONOMY = {
  "Raunchy, Unhinged & High-Energy Comedy": ["raunchy", "wild comedy", "slapstick", "hilarious", "irreverent", "unhinged", "crass", "rowdy", "party vibes", "laugh out loud", "chaos"],
  "Tense, Serious & Morally Weighty": ["tense", "serious", "heavy", "sobering", "grappling with guilt", "moral weight", "political dread", "high-stakes"],
  "Cerebral, Epic & Mind-Bending": ["cerebral", "mind-bending", "intellectual", "puzzle-box", "philosophical", "complex narrative", "non-linear", "epic scope", "transcendent"],
  "Dark, Gritty & Atmospheric Noir": ["dark", "gritty", "hardboiled", "cynical", "uncompromising", "raw", "grim", "visceral", "brooding"],
  "Lighthearted & Feel-Good": ["lighthearted", "feel-good", "whimsical", "warm", "heartwarming", "fun", "breezy", "uplifting"],
  "Bleak & Melancholic": ["bleak", "somber", "gloomy", "melancholic", "tragic", "mournful", "haunting", "despairing"]
};

// 5. Character Archetypes & Dynamics
export const CHARACTER_TAXONOMY = {
  "Chaotic Groomsmen / Party Trio": ["wolfpack", "groomsmen", "groom", "best man", "wild friend", "bumbling buddy", "bachelor crew"],
  "Slacker Crew / Rebellious Adults": ["slacker", "misfit", "fraternity brothers", "party animal", "rebellious adult", "goofball"],
  "Brilliant but Conflicted Scientist": ["physicist", "inventor", "project director", "tormented genius", "visionary", "scientist grappling with morality"],
  "Flawed Vigilante / Dark Protector": ["vigilante", "tormented hero", "reluctant savior", "morally grey protagonist", "troubled past", "crusader"],
  "Anarchic Nemesis / Agent of Chaos": ["philosophical nemesis", "agent of chaos", "fanatical antagonist", "mastermind", "shadow self"],
  "Solitary Astronaut / Reluctant Explorer": ["lone survivor", "isolated pilot", "botanist", "astronaut father", "sole operative"],
  "The Chosen Reluctant Messiah": ["prophesied leader", "messianic figure", "outsider chosen", "reluctant emperor", "cult of personality"]
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
      const regex = new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "i");
      if (regex.test(lower)) {
        matches.add(categoryName);
        break;
      }
    }
  }
  return Array.from(matches);
}

/**
 * Infer Central Premise & Conflict from synopsis and metadata
 */
export function inferStoryPremiseAndConflict(synopsis, genres = [], keywords = []) {
  const text = `${synopsis} ${(genres || []).join(" ")} ${(keywords || []).join(" ")}`.toLowerCase();

  let premise = "";
  let centralConflict = "";
  let protagonistGoal = "";
  let narrativeType = "Narrative Story";

  if (text.includes("bachelor party") || (text.includes("hangover") && text.includes("vegas")) || (text.includes("groom") && text.includes("missing"))) {
    premise = "Groomsmen wake up in Las Vegas after a wild night with complete amnesia, a trashed suite, and a missing groom.";
    centralConflict = "Retracing chaotic clues across Las Vegas to locate the missing groom before the impending wedding ceremony.";
    protagonistGoal = "Find the groom and piece together what happened during their blackout night.";
    narrativeType = "Chaotic Mystery Comedy / Bachelor Party Misadventure";
  } else if (text.includes("oppenheimer") || text.includes("atomic bomb") || text.includes("manhattan project") || (text.includes("physicist") && text.includes("weapon"))) {
    premise = "A brilliant theoretical physicist leads a top-secret wartime laboratory to engineer the world's first nuclear weapon.";
    centralConflict = "Scientific breakthrough versus the devastating moral, human, and political fallout of creating atomic weaponry.";
    protagonistGoal = "Successfully develop the atomic weapon to end the war, while grappling with existential dread and government scrutiny.";
    narrativeType = "Biographical Historical Drama / Scientific Trial";
  } else if (text.includes("fraternity") || (text.includes("college") && text.includes("friends") && text.includes("glory days"))) {
    premise = "Adult friends dissatisfied with mundane adulthood establish an off-campus fraternity to recapture their youth.";
    centralConflict = "Preserving their wild fraternity sanctuary against an antagonistic college dean and adult responsibilities.";
    protagonistGoal = "Recapture youthful freedom and maintain their bond amidst increasing institutional pressure.";
    narrativeType = "Slacker Buddy Comedy / Campus Romp";
  } else if (text.includes("spacecraft") || text.includes("interstellar") || text.includes("wormhole") || (text.includes("uninhabitable") && text.includes("planet"))) {
    premise = "An ex-pilot and scientific team embark on a perilous voyage through a wormhole to find a habitable exoplanet for humanity.";
    centralConflict = "Surviving extreme relativistic time dilation and deep-space perils while trying to return home to loved ones.";
    protagonistGoal = "Discover a viable new world to save humanity from planetary extinction while fulfilling a parental promise.";
    narrativeType = "Epic Hard Sci-Fi / Space Odyssey";
  } else if (text.includes("arrakis") || text.includes("spice") || text.includes("atreides") || (text.includes("desert") && text.includes("dynasty"))) {
    premise = "A gifted noble youth travels to a perilous desert world producing the universe's most precious resource, becoming embroiled in a galactic conspiracy.";
    centralConflict = "Navigating treacherous feudal politics, imperial betrayal, and severe desert ecology to fulfill a messianic destiny.";
    protagonistGoal = "Survive the annihilation of his house and unite the native desert tribes against oppressors.";
    narrativeType = "Epic Feudal Sci-Fi / Messianic Saga";
  } else if (text.includes("batman") || text.includes("joker") || (text.includes("vigilante") && text.includes("gotham"))) {
    premise = "A masked vigilante and incorruptible allies battle an anarchic criminal mastermind who tests the moral limits of society.";
    centralConflict = "Maintaining justice and personal morality against an agent of chaos seeking to prove everyone is corruptible.";
    protagonistGoal = "Protect the city and prevent a descent into total anarchy without violating core ethical principles.";
    narrativeType = "Psychological Crime Noir / Superhero Thriller";
  } else {
    // General synthesis from synopsis
    const firstSentence = synopsis.split(".")[0] || synopsis;
    premise = cleanText(firstSentence);
    centralConflict = synopsis.length > 80 ? cleanText(synopsis.substring(0, 160)) : premise;
    protagonistGoal = "Overcome core obstacles driving the narrative journey.";
    narrativeType = genres.length > 0 ? `${genres.join(" / ")} Drama` : "Story Narrative";
  }

  return { premise, centralConflict, protagonistGoal, narrativeType };
}

/**
 * Build Full Structured Story DNA & Plot Profile
 */
export function buildStoryProfile(item) {
  if (!item) return null;

  const synopsis = cleanText(item.synopsis || item.description || item.overview || "");
  const genres = Array.isArray(item.genres) ? item.genres : (typeof item.genres === "string" ? [item.genres] : []);
  const keywords = Array.isArray(item.keywords) ? item.keywords : [];
  const existingTags = Array.isArray(item.tags) ? item.tags : [];

  const contentText = `${synopsis} ${genres.join(" ")} ${keywords.join(" ")} ${existingTags.join(" ")}`;

  const themes = matchTaxonomy(contentText, THEMES_TAXONOMY);
  const concepts = matchTaxonomy(contentText, CONCEPTS_TAXONOMY);
  const settings = matchTaxonomy(contentText, SETTING_TAXONOMY);
  const tones = matchTaxonomy(contentText, TONE_TAXONOMY);
  const characters = matchTaxonomy(contentText, CHARACTER_TAXONOMY);

  const { premise, centralConflict, protagonistGoal, narrativeType } = inferStoryPremiseAndConflict(synopsis, genres, keywords);

  // Pure Plot Representation (Focused purely on actual story events, problem, and stakes)
  const plotRepresentation = [
    `Premise: ${premise}`,
    `Central Conflict: ${centralConflict}`,
    `Protagonist Goal: ${protagonistGoal}`,
    `Narrative Type: ${narrativeType}`,
    `Story Synopsis: ${synopsis}`
  ].filter(Boolean).join("\n");

  // Multi-dimensional Story DNA text
  const storyDNA = [
    `Medium: ${item.type || item.media_type || "Story"}`,
    `Narrative Type: ${narrativeType}`,
    `Premise: ${premise}`,
    `Central Conflict: ${centralConflict}`,
    themes.length > 0 ? `Themes: ${themes.join("; ")}` : "",
    concepts.length > 0 ? `Concepts: ${concepts.join("; ")}` : "",
    tones.length > 0 ? `Tone & Atmosphere: ${tones.join("; ")}` : "",
    settings.length > 0 ? `Setting: ${settings.join("; ")}` : "",
    characters.length > 0 ? `Character Dynamics: ${characters.join("; ")}` : "",
    genres.length > 0 ? `Genres: ${genres.join(", ")}` : "",
    keywords.length > 0 ? `Keywords: ${keywords.slice(0, 8).join(", ")}` : ""
  ].filter(Boolean).join("\n");

  const allThematicTags = Array.from(new Set([
    ...themes,
    ...concepts,
    ...tones,
    ...settings,
    ...genres.slice(0, 3)
  ]));

  return {
    id: item.id,
    title: item.title,
    premise,
    centralConflict,
    protagonistGoal,
    narrativeType,
    cleanedSynopsis: synopsis,
    themes,
    concepts,
    settings,
    moods: tones,
    tones,
    tropes: characters,
    characterRoles: characters,
    genres,
    keywords,
    allTags: allThematicTags,
    allThematicTags,
    plotRepresentation,
    storyDNA,
    narrativeProfileText: storyDNA
  };
}

/**
 * Backward compatibility helper for buildNarrativeProfile
 */
export function buildNarrativeProfile(item) {
  return buildStoryProfile(item);
}
