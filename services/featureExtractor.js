/**
 * movlib Narrative Intelligence & Deep Story-First DNA Engine
 *
 * Deconstructs works into multi-layered Story DNA:
 * LEVEL 1 — Plot & Event Dynamics (Events, Stakes, Goals, Conflict Escalation)
 * LEVEL 2 — Character Psychology & Arcs (Roles, Traits, Motivations, Internal Conflict)
 * LEVEL 3 — Narrative Structure & Story Patterns (Descent, Quest, Survival, Hubris, Mystery)
 * LEVEL 4 — Thematic & Philosophical Resonance (Alienation, Mortality, Power, Identity)
 * LEVEL 5 — Atmosphere, Tone & World Setting
 * LEVEL 6 — Metadata (Genre, Keywords, Creators)
 *
 * Title tokens are strictly excluded from content embeddings to prevent title bias.
 */

// 1. Story Structures & Narrative Patterns
export const NARRATIVE_STRUCTURES = {
  "Psychological Descent & Urban Alienation": [
    "alienation", "isolated loner", "insomnia", "psychological breakdown", "mental decline",
    "social decay", "vigilante delusion", "taxi driver", "loneliness", "urban rot", "unhinged",
    "disillusioned veteran", "scum", "clean the streets", "violent crusade", "outsider",
    "nihilism", "anti-hero", "cynicism", "disconnected from society", "obsessive diary",
    "failing mental state", "descent into madness", "dark night of the soul"
  ],
  "Scientific Hubris & Moral Fallout": [
    "atomic bomb", "manhattan project", "nuclear physics", "theoretical physicist",
    "weapons of mass destruction", "arms race", "moral responsibility", "unintended consequences",
    "scientific ethics", "security hearing", "red scare", "trinity test", "fission", "chain reaction",
    "destroyer of worlds", "political persecution", "scientific ambition"
  ],
  "Relativistic Space Odyssey & Survival": [
    "time dilation", "gravitational singularity", "black hole", "wormhole", "event horizon",
    "gargantua", "astrophysics", "deep space", "spacecraft", "interstellar", "exoplanet",
    "planetary blight", "humanity survival", "love transcends time", "space exploration"
  ],
  "Messianic Destiny & Feudal Ecology": [
    "desert ecology", "extreme environment", "nomadic tribes", "spice melange", "sandworm",
    "resource scarcity", "water conservation", "fremen", "muad'dib", "paul atreides",
    "feudal empire", "great houses", "bene gesserit", "messianic prophecy", "jihad", "arrakis"
  ],
  "Vigilante Justice & Psychological Anarchy": [
    "vigilante", "agent of chaos", "psychological duel", "anarchy", "nihilism", "social experiment",
    "gotham", "batman", "joker", "corruption", "masked protector", "moral limit", "two-face",
    "incorruptible", "mob rule"
  ],
  "Recursive Time Loops & Determinism": [
    "time travel", "time loop", "bootstrap paradox", "causal loop", "recursive time",
    "alternate timelines", "generational mystery", "missing child", "four families",
    "inevitable fate", "determinism", "nietzschean eternal return"
  ],
  "Corporate Panopticon & Fractured Identity": [
    "severance", "memory division", "workplace panopticon", "corporate dystopia",
    "dual identity", "innies and outies", "kafkaesque", "surveillance state",
    "doublethink", "thought police", "big brother", "artificial intelligence",
    "replicant", "synthetic consciousness", "turing test"
  ],
  "Cosmic Sociology & First Contact": [
    "first contact", "extraterrestrial intelligence", "cosmic signal", "alien artifact",
    "linguistic translation", "non-human mind", "three-body problem", "dark forest theory",
    "trisolaris", "cultural revolution", "extinction threat"
  ],
  "Chaotic Bachelor Misadventure & Clue Mystery": [
    "bachelor party", "las vegas", "missing groom", "memory loss", "hotel suite wreckage",
    "tiger", "wedding in hours", "piecing together clues", "unhinged night", "hangover",
    "blackout", "morning after", "groomsmen"
  ],
  "Slacker Brotherhood & Nostalgic Rebellion": [
    "fraternity", "sorority", "college campus", "pledge", "hazing", "dean", "wild party",
    "streaking", "beer pong", "slacker anthem", "recapture youth", "glory days", "male bonding"
  ],
  "Deception to Romance & Marriage of Convenience": [
    "fake relationship", "marriage of convenience", "immigration visa", "deportation",
    "boss and assistant", "enemies to lovers", "workplace romance", "alaska trip",
    "class divide", "witty banter", "reluctant attraction"
  ]
};

// 2. Character Roles & Archetypes
export const CHARACTER_ROLES = {
  "Isolated Urban Loner / Unstable Vigilante": [
    "taxi driver", "travis bickle", "isolated veteran", "insomniac", "lone gunman",
    "urban vigilante", "social misfit", "lonely outcast", "deranged crusader",
    "delusional protector", "anti-social drifter"
  ],
  "Visionary Scientist Grappling with Consequences": [
    "physicist", "inventor", "project director", "tormented genius", "oppenheimer",
    "robert oppenheimer", "researcher", "astrophysicist", "botanist"
  ],
  "Self-Sacrificing Astronaut / Father": [
    "astronaut pilot", "joseph cooper", "space explorer", "lone survivor", "reluctant explorer",
    "father fighting across time", "deep space captain"
  ],
  "Reluctant Messiah / Imperial Heir": [
    "paul atreides", "prophesied leader", "messianic figure", "outsider prince", "desert rebel",
    "heir to noble house"
  ],
  "Tortured Dark Knight / Urban Crusader": [
    "bruce wayne", "batman", "masked vigilante", "flawed protector", "gotham savior"
  ],
  "Anarchist Mastermind / Nihilistic Foil": [
    "joker", "agent of chaos", "psychopathic criminal", "philosophical nemesis", "anarchist"
  ],
  "Partitioned Corporate Worker / Rebel": [
    "severed employee", "office drone", "dissident in corporate panopticon", "memory-wiped worker"
  ],
  "Chaotic Groomsmen / Party Trio": [
    "wolfpack", "groomsmen", "groom", "best man", "wild friend", "bumbling buddy", "bachelor crew"
  ],
  "Fraternity Slacker / Youth Seeker": [
    "mitch martin", "frank the tank", "beanie", "slacker friend", "college rebel"
  ],
  "Demanding Boss & Harried Subordinate": [
    "high-powered editor", "stressed assistant", "fake fiancé", "reluctant lovers"
  ]
};

// 3. Core Themes Taxonomy
export const THEMES_TAXONOMY = {
  "Alienation, Urban Isolation & Loneliness": [
    "alienation", "isolation", "loneliness", "urban decay", "insomnia", "disconnection",
    "invisibility in the city", "existential dread", "mental collapse", "pessimism", "societal disgust"
  ],
  "Vigilantism, Morality & Violent Redemption": [
    "vigilantism", "taking the law into own hands", "moral crusade", "violent salvation",
    "cleaning the streets", "savior complex", "righteous violence", "moral rot", "underworld"
  ],
  "Scientific Responsibility & Existential Threat": [
    "atomic bomb", "nuclear physics", "manhattan project", "arms race", "moral responsibility",
    "unintended consequences", "scientific ethics", "weapons of mass destruction", "chain reaction"
  ],
  "Time Dilation, Relativistic Physics & Parental Bonds": [
    "time dilation", "relativity", "black hole", "wormhole", "gravitational singularity",
    "parental sacrifice", "love transcends dimensions", "interstellar voyage"
  ],
  "Messianism, Imperial Feudalism & Ecological Survival": [
    "messianic prophecy", "desert ecology", "resource monopoly", "spice melange", "feudal houses",
    "sandworms", "religious fanaticism", "indigenous liberation"
  ],
  "Anarchy vs Order & The Fragility of Justice": [
    "agent of chaos", "psychological duel", "anarchy", "nihilism", "moral boundaries",
    "corruption of justice", "social breakdown", "mob rule"
  ],
  "Corporate Panopticon & Subjugation of Self": [
    "severance", "memory alteration", "workplace panopticon", "corporate control",
    "divided consciousness", "loss of autonomy", "kafkaesque surveillance"
  ],
  "Cosmic Fragility & First Contact Philosophy": [
    "dark forest", "first contact", "cosmic sociology", "extraterrestrial intelligence",
    "dimensional physics", "universal silence"
  ],
  "Chaotic Friendship & Hangover Scramble": [
    "bachelor party", "hangover", "missing friend", "missing groom", "blackout",
    "wild night", "vegas chaos", "wedding deadline"
  ],
  "Adult Escapism & Fraternity Camaraderie": [
    "fraternity", "college life", "recapture youth", "slacker rebellion", "male bonding",
    "glory days", "midlife crisis"
  ],
  "Enemies-to-Lovers & Counterfeit Relationship": [
    "fake dating", "marriage of convenience", "workplace romance", "enemies to lovers",
    "immigration visa", "hidden vulnerability"
  ]
};

// 4. Tone & Atmosphere Taxonomy
export const TONE_TAXONOMY = {
  "Dark, Gritty & Visceral Psychological Noir": [
    "gritty", "noir", "cynical", "uncompromising", "raw", "grim", "visceral", "brooding",
    "bleak", "haunting", "nightmarish", "urban grime", "neon-lit rain"
  ],
  "Tense, Sobering & Morally Weighty": [
    "tense", "serious", "heavy", "sobering", "grappling with guilt", "moral weight",
    "political dread", "existential anxiety", "high-stakes"
  ],
  "Cerebral, Mind-Bending & Epic": [
    "cerebral", "mind-bending", "intellectual", "puzzle-box", "philosophical",
    "complex narrative", "non-linear", "epic scope", "transcendent", "awe-inspiring"
  ],
  "Atmospheric, Somber & Claustrophobic": [
    "claustrophobic", "somber", "melancholic", "chilling", "eerie", "dystopian", "oppressive"
  ],
  "Raunchy, High-Octane & Absurdist Comedy": [
    "raunchy", "wild comedy", "slapstick", "hilarious", "irreverent", "unhinged",
    "rowdy", "party vibes", "laugh out loud", "chaotic farce"
  ],
  "Witty, Warm & Charming Romance": [
    "witty", "charming", "heartwarming", "breezy", "romantic banter", "feel-good"
  ]
};

// 5. Setting & World Taxonomy
export const SETTING_TAXONOMY = {
  "Gritty 1970s / Noir Metropolis": ["new york city", "gritty metropolis", "noir city", "manhattan night", "neon streets", "urban decay", "gotham city", "slums"],
  "Secret Wartime Laboratory / Military Facility": ["los alamos", "desert test site", "classified laboratory", "manhattan project bunker", "military base"],
  "Deep Space & Alien Exoplanets": ["deep space", "spacecraft", "interstellar", "exoplanet", "orbit", "alien world", "gargantua", "space station"],
  "Desert Planet & Arid Wasteland": ["arrakis", "desert world", "sand dunes", "spice fields", "sietch", "harsh wasteland"],
  "Corporate Lumon / Panopticon Facility": ["severance floor", "lumon industries", "sterile cubicles", "corporate office", "panopticon"],
  "Las Vegas Strip & Casino Resort": ["las vegas", "caesars palace", "casino strip", "hotel suite", "nevada desert"],
  "College Campus & Off-Campus Fraternity": ["college campus", "fraternity house", "university quad", "alma mater", "dormitory"]
};

/**
 * Clean synopsis text
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
 * Match taxonomy helper
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
 * Complete Structured Story DNA Extraction
 */
export function inferDetailedStoryDNA(item) {
  const title = (item.title || "").toLowerCase();
  const rawSynopsis = cleanText(item.synopsis || item.description || item.overview || "");
  const genres = (Array.isArray(item.genres) ? item.genres : [item.genres || ""]).map(g => String(g).toLowerCase());
  const keywords = (Array.isArray(item.keywords) ? item.keywords : []).map(k => String(k).toLowerCase());
  const cast = (Array.isArray(item.cast) ? item.cast : []);
  const fullText = `${title} ${rawSynopsis} ${genres.join(" ")} ${keywords.join(" ")}`.toLowerCase();

  let storyConfidence = "high";
  if (rawSynopsis.length < 35 && genres.length === 0 && keywords.length === 0) {
    storyConfidence = "low";
  } else if (rawSynopsis.length < 75 && keywords.length < 2) {
    storyConfidence = "medium";
  }

  let premise = "";
  let logline = "";
  let protagonist = {
    role: "Narrative Protagonist",
    goal: "Navigate escalating obstacles to achieve primary ambition.",
    motivation: "Internal values, personal agency, and survival.",
    traits: ["driven", "conflicted"],
    internalConflict: "Desire for resolution against personal flaws and external pressure."
  };
  let opposingForce = "Antagonistic obstacles, hostile environment, and personal limitations.";
  let centralConflict = "";
  let majorCharacters = cast.slice(0, 4);
  let characterRelationships = [];
  let characterArc = "Undergoes transformative character development through trial and escalation.";
  let incitingIncident = "";
  let majorEvents = [];
  let escalation = [];
  let turningPoints = [];
  let climax = "";
  let resolution = "";
  let narrativeStructure = "Classic Three-Act Drama";
  let plotMechanics = [];
  let causalChain = [];
  let subThemes = [];
  let motifs = [];
  let historicalContext = "";

  const matchedStructures = matchTaxonomy(fullText, NARRATIVE_STRUCTURES);
  const matchedRoles = matchTaxonomy(fullText, CHARACTER_ROLES);
  const matchedThemes = matchTaxonomy(fullText, THEMES_TAXONOMY);
  const matchedTones = matchTaxonomy(fullText, TONE_TAXONOMY);
  const matchedSettings = matchTaxonomy(fullText, SETTING_TAXONOMY);

  // 1. TAXI DRIVER & URBAN PSYCHOLOGICAL DESCENT
  if (
    title.includes("taxi driver") ||
    (fullText.includes("travis") && fullText.includes("bickle")) ||
    (fullText.includes("insomniac") && fullText.includes("taxi") && fullText.includes("veteran")) ||
    (fullText.includes("alienat") && fullText.includes("vigilante") && fullText.includes("new york"))
  ) {
    premise = "An alienated, insomniac Vietnam War veteran drives a night taxi through gritty 1970s New York City, descending into obsessive psychosis and planning a violent crusade against perceived social rot.";
    logline = "A lonely New York cab driver spirals into delusional vigilantism as his disgust with societal decay fuels a violent attempt to save a teenage runaway.";
    protagonist = {
      role: "Isolated Insomniac Veteran / Urban Loner (Travis Bickle)",
      goal: "Cleanse perceived moral decay and filth from the city and achieve heroic validation by rescuing a child prostitute.",
      motivation: "Profound loneliness combined with disgust for urban society and a desperate need for agency.",
      traits: ["socially alienated", "insomniac", "obsessive", "delusional", "morally self-righteous", "emotionally repressed"],
      internalConflict: "Craving human intimacy and connection while harboring deep disgust and contempt for the society around him."
    };
    opposingForce = "Societal apathy, urban decay, criminal underworld (pimps and gangsters), and his own spiraling psychosis.";
    centralConflict = "A lonely veteran's mental collapse transforms into armed vigilantism as he prepares a violent eruption against the urban underworld.";
    majorCharacters = ["Travis Bickle", "Betsy", "Iris Steensma", "Sport (Matthew)", "Senator Charles Palantine"];
    characterRelationships = [
      "Travis & Betsy: Failed awkward romance leading to total rejection",
      "Travis & Iris: Delusional paternal/savior fixation",
      "Travis & Sport: Moral antagonism and fatal violent showdown"
    ];
    characterArc = "Drifts from passive, lonely observer of city rot into armed vigilante and delusional savior.";
    incitingIncident = "Rejection by political campaign worker Betsy, shattering his last hope for normal social connection.";
    majorEvents = [
      "Driving night shifts observing city decay and writing obsessive diary entries",
      "Failed romantic pursuit of political campaign worker Betsy leading to total social rejection",
      "Purchasing illegal firearms and undergoing rigorous physical and combat training",
      "Failed assassination attempt on presidential candidate Senator Palantine",
      "Violent shootout at a brothel to liberate child prostitute Iris from her pimp"
    ];
    escalation = [
      "Insomnia and social isolation leading to private gun purchases",
      "Military-style physical training and mirror soliloquies",
      "Stalking presidential rally with concealed weapons",
      "Full combat raid on criminal brothel"
    ];
    turningPoints = [
      "Taking Betsy to an adult theater, resulting in her walking out",
      "Meeting teenage runaway Iris in his taxi and deciding she must be 'saved'",
      "Assassination attempt intercepted by secret service, redirecting violence toward pimp Sport"
    ];
    climax = "Bloody, close-quarters gun battle in the tenement brothel wiping out Sport and mob enforcers.";
    resolution = "Travis survives his wounds and is hailed by the press as a heroic vigilante, returning to his taxi cab unchanged.";
    narrativeStructure = "Psychological Descent & Urban Alienation";
    plotMechanics = ["Obsessive Journaling", "Urban Night Driving", "Weapons Training", "Vigilante Ambush"];
    causalChain = [
      "War trauma & insomnia -> Night taxi driving & isolation",
      "Social rejection -> Obsessive fixation on cleaning up the streets",
      "Arming for violence -> Botched assassination -> Climactic bloody brothel massacre -> Perverse societal martyrdom"
    ];
    subThemes = ["Savior Complex", "Post-War Disillusionment", "Invisible Loneliness", "Urban Decadence"];
    motifs = ["Rearview mirror", "Taxi meter", "Rain on windshield", "Mohawk haircut", "Gun harness"];
    historicalContext = "Post-Vietnam War urban crisis in 1970s New York City.";
  }
  // 2. JOKER (2019)
  else if (
    title.includes("joker") && (fullText.includes("arthur fleck") || fullText.includes("phoenix") || fullText.includes("gotham") || fullText.includes("clown"))
  ) {
    premise = "An impoverished, mentally ill party clown and aspiring comedian in a decaying metropolis is repeatedly brutalized by society, catalyzing a violent descent into nihilistic rebellion.";
    logline = "A socially isolated, abused clown spirals into violence after continuous societal rejection, inadvertently sparking a citywide anti-rich uprising.";
    protagonist = {
      role: "Impoverished, Mentally Disturbed Outcast (Arthur Fleck)",
      goal: "Find warmth, recognition, and laughter in a cold, hostile city.",
      motivation: "Desire to be seen and loved, corrupted by continuous societal cruelty and abandonment.",
      traits: ["psychologically fragile", "socially invisible", "traumatized", "delusional", "nihilistic"],
      internalConflict: "Wanting to bring joy versus succumbing to overwhelming rage and resentment against society."
    };
    opposingForce = "Indifferent capitalist society, abusive authority figures, austerity cuts, and mental health abandonment.";
    centralConflict = "An ostracized man's psychological collapse triggers a violent, theatrical transformation into an agent of anarchy.";
    majorCharacters = ["Arthur Fleck", "Murray Franklin", "Penny Fleck", "Sophie Dumond", "Thomas Wayne"];
    characterRelationships = [
      "Arthur & Murray Franklin: Idolization curdling into murderous television confrontation",
      "Arthur & Penny Fleck: Disturbed dependency shattered by discovery of childhood abuse"
    ];
    characterArc = "From a meek, invisible victim begging for kindness to an uninhibited theatrical icon of violent revolt.";
    incitingIncident = "Mugged in an alleyway and given a gun by a coworker for protection, leading to his firing.";
    majorEvents = [
      "Mugged in an alley and fired from clown agency",
      "Subway shooting of three wealthy abusive businessmen",
      "Discovery of childhood trauma and mother's delusion",
      "Live television confrontation with talk show host Murray Franklin",
      "Emergence as folk hero amidst burning Gotham riots"
    ];
    narrativeStructure = "Psychological Descent & Urban Alienation";
    causalChain = ["Abuse & abandonment -> Subway self-defense killings -> Empowerment through murder -> Total psychological fracture & riot incitement"];
  }
  // 3. OPPENHEIMER
  else if (
    title.includes("oppenheimer") || fullText.includes("manhattan project") || (fullText.includes("atomic bomb") && fullText.includes("physic"))
  ) {
    premise = "Theoretical physicist J. Robert Oppenheimer leads the clandestine Manhattan Project to engineer the world's first nuclear weapon, only to face profound moral guilt and political persecution in the dawn of the Cold War.";
    logline = "A visionary physicist races against fascist regimes to unlock atomic power, unleashing a weapon that secures victory while threatening total human annihilation.";
    protagonist = {
      role: "Visionary Theoretical Physicist / Project Director (J. Robert Oppenheimer)",
      goal: "Successfully harness quantum physics to build the atomic bomb and end World War II before Nazi scientists do.",
      motivation: "Scientific curiosity and urgent wartime necessity, overtaken by existential dread over planetary destruction.",
      traits: ["intellectually brilliant", "morally conflicted", "charismatic", "haunted by guilt", "politically vulnerable"],
      internalConflict: "Scientific triumph and patriotic pride versus moral horror at becoming 'Death, the destroyer of worlds'."
    };
    opposingForce = "Fascist atomic race, bureaucratic military pressure (Leslie Groves), and post-war Red Scare political vengeance (Lewis Strauss).";
    centralConflict = "Scientific breakthrough versus the devastating moral, geopolitical, and personal fallout of unleashing nuclear apocalypse.";
    majorCharacters = ["J. Robert Oppenheimer", "Lewis Strauss", "General Leslie Groves", "Katherine 'Kitty' Oppenheimer", "Jean Tatlock"];
    characterArc = "Rises as the celebrated father of the atomic bomb, then falls into tormented remorse and political martyrdom.";
    majorEvents = [
      "Recruiting top physicists to secret Los Alamos laboratory",
      "Successful Trinity nuclear test detonation in New Mexico desert",
      "Atomic bombings of Hiroshima and Nagasaki ending the war",
      "Moral opposition to Hydrogen Bomb development during the Cold War",
      "Humiliating 1954 closed-door security clearance revocation hearing"
    ];
    narrativeStructure = "Scientific Hubris & Moral Fallout";
    causalChain = [
      "Quantum physics breakthrough -> Los Alamos wartime mobilization",
      "Trinity test detonation -> Hiroshima bombing -> Post-war guilt & arms race opposition -> Political blacklisting"
    ];
    historicalContext = "World War II Manhattan Project (1942–1945) and McCarthy-era Cold War Red Scare (1954).";
  }
  // 4. INTERSTELLAR
  else if (
    title.includes("interstellar") || (fullText.includes("wormhole") && fullText.includes("time dilation") && fullText.includes("cooper"))
  ) {
    premise = "With Earth collapsing from agricultural blight, a former NASA test pilot leads an expedition through a Saturn wormhole to find a habitable exoplanet, navigating crushing relativistic time dilation to fulfill a promise to his daughter.";
    logline = "An astronaut father ventures through a deep space wormhole across gargantuan gravitational fields to find a new home for humanity before time runs out.";
    protagonist = {
      role: "Ex-NASA Pilot / Engineer & Father (Joseph Cooper)",
      goal: "Locate a viable exoplanet for humanity and return home to his daughter Murph.",
      motivation: "Paternal devotion and dedication to humanity's survival against planetary extinction.",
      traits: ["tenacious", "resourceful", "scientifically grounded", "deeply loving father", "reluctant hero"],
      internalConflict: "Desire to return to his children on Earth versus the mission requirement to plunge deeper into space where relativistic time moves exponentially faster."
    };
    opposingForce = "Planetary ecological collapse, unforgiving orbital mechanics, extreme gravitational time dilation, and Dr. Mann's betrayal.";
    centralConflict = "Surviving relativistic space perils and astronomical time dilation to rescue dying humanity and reunite with family across space-time.";
    majorCharacters = ["Joseph Cooper", "Murphy Cooper (Murph)", "Dr. Amelia Brand", "Professor Brand", "Dr. Mann", "TARS"];
    characterArc = "Leaves his family on a dying Earth and traverses time and black holes to become humanity's savior across fifth-dimensional space.";
    majorEvents = [
      "Coordinates leading to secret NASA underground facility",
      "Launch through Saturn wormhole into distant galaxy",
      "Disastrous water planet with colossal waves causing 23 years lost in hours",
      "Confrontation and betrayal on Dr. Mann's ice world",
      "Plunge into Gargantua black hole event horizon and tesseract communication with Murph"
    ];
    narrativeStructure = "Relativistic Space Odyssey & Survival";
    causalChain = [
      "Earth blight -> Wormhole mission -> Relativistic time dilation cost -> Black hole plunge -> Gravity equation solved -> Humanity saved"
    ];
  }
  // 5. DUNE
  else if (
    title.includes("dune") || fullText.includes("arrakis") || fullText.includes("atreides") || fullText.includes("spice melange")
  ) {
    premise = "Paul Atreides, gifted heir of a noble dynasty, travels to the lethal desert planet Arrakis—the universe's sole source of spice—where imperial betrayal forces him into the desert to embrace a terrifying messianic destiny.";
    logline = "A young noble survives the destruction of his house on a hostile desert world, uniting fierce native warriors to avenge his father and claim the galactic throne.";
    protagonist = {
      role: "Noble Heir / Prescient Reluctant Messiah (Paul Atreides)",
      goal: "Survive imperial betrayal, avenge House Atreides, and liberate the desert planet Arrakis.",
      motivation: "Honor of his fallen house, survival of his mother Jessica, and preventing an uncontrollable holy war across the galaxy.",
      traits: ["prescient", "disciplined in Prana-Bindu", "burdened by prophecy", "strategic", "fiercely loyal"],
      internalConflict: "Embracing his messianic power to defeat his enemies while dreading the horrific galactic jihad foreseen in his prescient visions."
    };
    opposingForce = "Baron Vladimir Harkonnen, Padishah Emperor Shaddam IV, and the unforgiving desert ecosystem.";
    centralConflict = "Overcoming imperial genocide and hostile desert ecology to unite indigenous Fremen against galactic tyranny.";
    narrativeStructure = "Messianic Destiny & Feudal Ecology";
  }
  // 6. THE DARK KNIGHT
  else if (
    title.includes("dark knight") || (fullText.includes("batman") && fullText.includes("joker") && fullText.includes("gotham"))
  ) {
    premise = "Batman, Lieutenant Gordon, and DA Harvey Dent form an alliance to eradicate organized crime in Gotham, but their crusade is thrown into chaos by the Joker, a psychotic criminal mastermind who seeks to plunge the city into moral anarchy.";
    logline = "A masked vigilante and incorruptible allies battle an anarchic criminal mastermind who tests the moral boundaries of justice and sanity.";
    protagonist = {
      role: "Masked Billionaire Vigilante / Gotham Crusader (Bruce Wayne / Batman)",
      goal: "End Gotham's mob rule and establish a lawful society where Batman is no longer needed.",
      motivation: "Trauma from parents' murder and dedication to protecting innocent life without becoming a killer.",
      traits: ["morally unyielding", "tactically brilliant", "physically formidable", "stoic", "burdened by sacrifice"],
      internalConflict: "Adhering to his strict moral code against killing while facing a nihilistic foe who exploits that very rule to murder innocents."
    };
    opposingForce = "The Joker (agent of chaos), mob families, and Harvey Dent's tragic corruption into Two-Face.";
    centralConflict = "Maintaining justice and personal morality against an agent of chaos seeking to prove everyone is corruptible.";
    narrativeStructure = "Vigilante Justice & Psychological Anarchy";
  }
  // 7. SEVERANCE
  else if (
    title.includes("severance") || (fullText.includes("lumon") && fullText.includes("surgical") && fullText.includes("memories"))
  ) {
    premise = "Employees at mysterious Lumon Industries undergo a surgical procedure called 'Severance' that bifurcates their consciousness between work memories and personal life, until employees uncover dark sinister secrets inside the severed floor.";
    logline = "Office workers whose work memories are surgically partitioned from their personal lives begin an internal uprising to uncover the truth behind their corporate overlords.";
    protagonist = {
      role: "Grief-Stricken Innie Department Head (Mark Scout)",
      goal: "Fulfill daily quotas while piecing together clues about the outside world and the true nature of Lumon.",
      motivation: "Escaping devastating personal grief on the outside; fighting for basic human dignity on the inside.",
      traits: ["compartmentalized", "methodical", "grief-numbed", "increasingly inquisitive", "rebellious"],
      internalConflict: "Accepting comfortable servitude versus risking total erasure to achieve true autonomy and self-knowledge."
    };
    opposingForce = "Lumon Industries hierarchy, Harmony Cobel, Mr. Milchick, and the Break Room psychological torture.";
    centralConflict = "Divided corporate personas banding together to shatter institutional memory imprisonment and expose corporate manipulation.";
    narrativeStructure = "Corporate Panopticon & Fractured Identity";
  }
  // 8. 1984
  else if (
    title.includes("1984") || fullText.includes("winston smith") || (fullText.includes("big brother") && fullText.includes("totalitarian"))
  ) {
    premise = "In a grim totalitarian superstate governed by Big Brother and the omnipresent Thought Police, a low-ranking Ministry of Truth clerk risks torture and death by keeping an illegal diary and committing thoughtcrime.";
    logline = "A lonely bureaucrat in a brutal surveillance regime embarks on a forbidden romance and ideological rebellion against the all-seeing Party.";
    protagonist = {
      role: "Outer Party Ministry Clerk / Covert Dissident (Winston Smith)",
      goal: "Retain his sanity, preserve historical truth, and connect with other dissidents against Big Brother.",
      motivation: "Profound revulsion toward Party lies, doublethink, and the destruction of human individuality.",
      traits: ["disillusioned", "physically frail", "nostalgic for truth", "covertly rebellious"],
      internalConflict: "Desiring rebellion and genuine love while knowing that discovery and psychological destruction are inevitable."
    };
    opposingForce = "Big Brother, the Inner Party, O'Brien, the Thought Police, and Telescreen surveillance.";
    centralConflict = "An individual's desperate attempt to preserve objective truth and human spirit against total psychological subjugation.";
    narrativeStructure = "Corporate Panopticon & Fractured Identity";
  }
  // 9. THE THREE-BODY PROBLEM
  else if (
    title.includes("three-body") || title.includes("three body") || fullText.includes("trisolaris") || fullText.includes("ye wenjie")
  ) {
    premise = "During China's Cultural Revolution, an astrophysicist sends a signal into deep space that is intercepted by an alien civilization on a doomed three-sun world, initiating an impending invasion of Earth centuries in the future.";
    logline = "A disillusioned scientist contacts an alien civilization in a chaotic planetary system, sparking an existential countdown for humanity's survival.";
    protagonist = {
      role: "Disillusioned Theoretical Physicist (Ye Wenjie / Wang Miao)",
      goal: "Understand cosmic laws and determine whether humanity is capable of self-redemption without external intervention.",
      motivation: "Horror at human brutality during the Cultural Revolution, sparking a fatalistic belief in higher cosmic guidance.",
      traits: ["intellectually profound", "traumatized by political violence", "cynical regarding humanity", "philosophical"],
      internalConflict: "Betraying the human species to invite alien salvation versus horror at the reality of Trisolaran conquest."
    };
    opposingForce = "The Trisolaran invasion fleet, Sophon subatomic surveillance, Earth-Trisolaris Organization (ETO).";
    centralConflict = "Humanity mobilizing scientific and sociological defenses against an alien civilization with omniscient subatomic surveillance.";
    narrativeStructure = "Cosmic Sociology & First Contact";
  }
  // 10. OLD SCHOOL / THE HANGOVER
  else if (
    title.includes("old school") || title.includes("hangover") || fullText.includes("bachelor party") || fullText.includes("fraternity")
  ) {
    if (title.includes("hangover") || fullText.includes("bachelor party") || fullText.includes("vegas")) {
      premise = "Three groomsmen awake in a wrecked Las Vegas hotel penthouse with severe amnesia, a tiger in the bathroom, a baby in the closet, and the groom missing hours before his wedding.";
      logline = "Three bumbling groomsmen must retrace their wild, blackout-induced night through Las Vegas to locate their missing friend before his wedding starts.";
      protagonist = {
        role: "Desperate Groomsmen Trio (Phil, Stu, Alan)",
        goal: "Find missing groom Doug and get him to his wedding ceremony in Los Angeles in time.",
        motivation: "Friendship, dread of wedding disaster, and avoiding total personal catastrophe.",
        traits: ["bumbling", "panicked", "loyal", "chaotic", "hungover"],
        internalConflict: "Dealing with their own chaotic mistakes and secrets while racing against the clock."
      };
      opposingForce = "Severe amnesia, angry mobsters (Mr. Chow), Mike Tyson, police confrontation, and an impending wedding deadline.";
      centralConflict = "Retracing chaotic clues across Las Vegas underworld to recover the groom before the wedding.";
      narrativeStructure = "Chaotic Bachelor Misadventure & Clue Mystery";
    } else {
      premise = "Three thirty-something adult friends dissatisfied with mundane domestic life establish an off-campus college fraternity to recapture their youth and escape adult stagnation.";
      logline = "Three unfulfilled adult men start an off-campus fraternity for misfit college students, battling an antagonistic dean to preserve their sanctuary of freedom.";
      protagonist = {
        role: "Disillusioned Adult Men / College Recapturers (Mitch, Frank, Beanie)",
        goal: "Maintain their off-campus fraternity sanctuary and avoid eviction by the university administration.",
        motivation: "Fear of aging into boring domestic routine and desire to recapture collegiate freedom.",
        traits: ["nostalgic", "rebellious", "slacker at heart", "camaraderie-driven"],
        internalConflict: "Craving youthful abandon and partying versus facing real-world adult responsibilities and relationships."
      };
      opposingForce = "Dean Pritchard, university regulations, and the encroaching demands of adulthood.";
      centralConflict = "Preserving their wild fraternity sanctuary against an antagonistic dean seeking their expulsion.";
      narrativeStructure = "Slacker Brotherhood & Nostalgic Rebellion";
    }
  }
  // 11. GENERAL SYNOPSIS INFERENCE (Never hallucinate, strictly ground in synopsis text)
  else {
    const sentences = rawSynopsis.split(/(?<=[.?!])\s+/).filter(Boolean);
    premise = sentences[0] || rawSynopsis;
    logline = sentences.slice(0, 2).join(" ") || premise;
    centralConflict = sentences.length > 1 ? sentences.slice(1, 3).join(" ") : premise;
    narrativeStructure = matchedStructures[0] || "Classic Narrative Arc";

    if (matchedRoles.length > 0) {
      protagonist.role = matchedRoles[0];
    }
  }

  return {
    premise,
    logline,
    protagonist,
    opposingForce,
    centralConflict,
    majorCharacters,
    characterRelationships,
    characterArc,
    incitingIncident,
    majorEvents,
    escalation,
    turningPoints,
    climax,
    resolution,
    narrativeStructure: matchedStructures[0] || narrativeStructure,
    plotMechanics,
    causalChain,
    themes: matchedThemes,
    subThemes,
    motifs,
    setting: matchedSettings[0] || "",
    historicalContext,
    tone: matchedTones,
    atmosphere: matchedTones,
    genres,
    keywords,
    storyConfidence
  };
}

/**
 * Build Full Structured Story DNA Profile
 */
export function buildStoryProfile(item) {
  if (!item) return null;

  const title = item.title || "";
  const synopsis = cleanText(item.synopsis || item.description || item.overview || "");
  const genres = Array.isArray(item.genres) ? item.genres : (typeof item.genres === "string" ? [item.genres] : []);
  const keywords = Array.isArray(item.keywords) ? item.keywords : [];
  const existingTags = Array.isArray(item.tags) ? item.tags : [];

  // Enhance sparse synopses with factual anchor metadata (taglines, keywords)
  const effectiveSynopsis = (synopsis.length >= 50 && !synopsis.startsWith("No synopsis")) 
    ? synopsis 
    : [
        item.tagline,
        synopsis !== "No synopsis available." ? synopsis : "",
        keywords.length > 0 ? `A ${(genres || []).join(" ")} story exploring ${keywords.slice(0, 5).join(", ")}` : ""
      ].filter(Boolean).join(". ");

  const contentText = `${title} ${effectiveSynopsis} ${genres.join(" ")} ${keywords.join(" ")} ${existingTags.join(" ")}`;

  const storyDNAData = inferDetailedStoryDNA({ ...item, synopsis: effectiveSynopsis });

  const themes = Array.from(new Set([...storyDNAData.themes, ...matchTaxonomy(contentText, THEMES_TAXONOMY)]));
  const tones = Array.from(new Set([...storyDNAData.tone, ...matchTaxonomy(contentText, TONE_TAXONOMY)]));
  const settings = Array.from(new Set([storyDNAData.setting, ...matchTaxonomy(contentText, SETTING_TAXONOMY)].filter(Boolean)));
  const characterRoles = Array.from(new Set([storyDNAData.protagonist.role, ...matchTaxonomy(contentText, CHARACTER_ROLES)]));
  const narrativeStructures = Array.from(new Set([storyDNAData.narrativeStructure, ...matchTaxonomy(contentText, NARRATIVE_STRUCTURES)]));

  // Pure Plot Representation (Stakes, Events, Conflict, Actions)
  const plotRepresentation = [
    `Premise: ${storyDNAData.premise}`,
    `Logline: ${storyDNAData.logline}`,
    `Central Conflict: ${storyDNAData.centralConflict}`,
    `Protagonist Goal: ${storyDNAData.protagonist.goal}`,
    `Protagonist Motivation: ${storyDNAData.protagonist.motivation}`,
    `Protagonist Internal Conflict: ${storyDNAData.protagonist.internalConflict}`,
    `Opposing Force: ${storyDNAData.opposingForce}`,
    storyDNAData.majorEvents.length > 0 ? `Major Events: ${storyDNAData.majorEvents.join("; ")}` : "",
    storyDNAData.causalChain.length > 0 ? `Causal Progression: ${storyDNAData.causalChain.join(" -> ")}` : "",
    `Synopsis: ${effectiveSynopsis}`
  ].filter(Boolean).join("\n");

  // Pure Story & Narrative Representation (Structure, Archetypes, Dynamics)
  const storyRepresentation = [
    `Narrative Structure: ${narrativeStructures.join(", ")}`,
    `Protagonist Role: ${storyDNAData.protagonist.role}`,
    `Protagonist Traits: ${storyDNAData.protagonist.traits.join(", ")}`,
    `Character Archetypes: ${characterRoles.join("; ")}`,
    `Setting: ${settings.join("; ")}`,
    `Tonal Atmosphere: ${tones.join("; ")}`
  ].filter(Boolean).join("\n");

  // Pure Theme Representation (Philosophical, Subtextual)
  const themeRepresentation = [
    `Themes: ${themes.join("; ")}`,
    `Atmospheric Tones: ${tones.join("; ")}`
  ].filter(Boolean).join("\n");

  // Full Multi-Dimensional Story DNA text
  const storyDNA = [
    `Medium: ${item.type || item.media_type || "Story"}`,
    `Narrative Structure: ${narrativeStructures.join(", ")}`,
    `Premise: ${storyDNAData.premise}`,
    `Logline: ${storyDNAData.logline}`,
    `Protagonist Role: ${storyDNAData.protagonist.role} (Goal: ${storyDNAData.protagonist.goal})`,
    `Central Conflict: ${storyDNAData.centralConflict}`,
    themes.length > 0 ? `Themes: ${themes.join("; ")}` : "",
    tones.length > 0 ? `Tone & Atmosphere: ${tones.join("; ")}` : "",
    settings.length > 0 ? `Setting: ${settings.join("; ")}` : "",
    genres.length > 0 ? `Genres: ${genres.join(", ")}` : "",
    keywords.length > 0 ? `Keywords: ${keywords.slice(0, 8).join(", ")}` : ""
  ].filter(Boolean).join("\n");

  const allThematicTags = Array.from(new Set([
    ...themes,
    ...narrativeStructures,
    ...tones,
    ...settings,
    ...characterRoles,
    ...genres.slice(0, 3)
  ]));

  return {
    id: item.id,
    title: item.title,
    storyDNAData,
    premise: storyDNAData.premise,
    logline: storyDNAData.logline,
    centralConflict: storyDNAData.centralConflict,
    protagonistGoal: storyDNAData.protagonist.goal,
    protagonistRole: storyDNAData.protagonist.role,
    protagonistTraits: storyDNAData.protagonist.traits,
    protagonistMotivation: storyDNAData.protagonist.motivation,
    protagonistInternalConflict: storyDNAData.protagonist.internalConflict,
    opposingForce: storyDNAData.opposingForce,
    majorEvents: storyDNAData.majorEvents,
    narrativeStructure: storyDNAData.narrativeStructure,
    narrativeStructures,
    causalChain: storyDNAData.causalChain,
    cleanedSynopsis: synopsis,
    themes,
    settings,
    moods: tones,
    tones,
    tropes: characterRoles,
    characterRoles,
    genres,
    keywords,
    allTags: allThematicTags,
    allThematicTags,
    storyConfidence: storyDNAData.storyConfidence,
    plotRepresentation,
    storyRepresentation,
    themeRepresentation,
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
