import { initDb, saveMediaItem, saveConnection } from "./index.js";

export const initialSeedData = [
  // MOVIES
  {
    id: "seed_movie_interstellar",
    externalId: "157336",
    title: "Interstellar",
    type: "Movie",
    year: "2014",
    creator: "Christopher Nolan",
    synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    genres: ["Science Fiction", "Drama", "Adventure"],
    tags: ["Time Dilation", "Cosmic Scale", "Humanity Survival", "Love & Physics", "Black Hole", "Wormhole"],
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    id: "seed_movie_the_proposal",
    externalId: "18240",
    title: "The Proposal",
    type: "Movie",
    year: "2009",
    creator: "Anne Fletcher",
    synopsis: "A high-powered book editor faces deportation to Canada and convinces her harried assistant to marry her in order to keep her visa, only for the two to travel to Alaska and discover genuine intimacy under a facade of convenience.",
    genres: ["Romance", "Comedy", "Drama"],
    tags: ["Fake Relationship", "Enemies to Lovers", "Workplace Romance", "Alaska", "Marriage of Convenience"],
    posterUrl: "https://thumb.wikimedia.org/wikipedia/en/thumb/0/02/The_Proposal.jpg/500px-The_Proposal.jpg"
  },
  {
    id: "seed_movie_tropic_thunder",
    externalId: "7446",
    title: "Tropic Thunder",
    type: "Movie",
    year: "2008",
    creator: "Ben Stiller",
    synopsis: "While shooting a big-budget Vietnam War epic, a group of self-absorbed actors are dropped into the real jungle by their frustrated director, completely unaware they are facing real heroin-producing militia.",
    genres: ["Comedy", "Action", "Adventure"],
    tags: ["Hollywood Satire", "Action Parody", "Meta-Cinema", "Absurdist Comedy", "Method Acting"],
    posterUrl: "https://image.tmdb.org/t/p/w500/zAurB9mNxfYRoVrVjAJJwGV3sPg.jpg"
  },
  {
    id: "seed_movie_pride_and_prejudice",
    externalId: "4348",
    title: "Pride & Prejudice",
    type: "Movie",
    year: "2005",
    creator: "Joe Wright",
    synopsis: "Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class.",
    genres: ["Romance", "Drama"],
    tags: ["Enemies to Lovers", "Class Divide", "Social Expectations", "Repressed Passion", "Regency England"],
    posterUrl: "https://thumb.wikimedia.org/wikipedia/en/thumb/0/03/Prideandprejudiceposter.jpg/500px-Prideandprejudiceposter.jpg"
  },
  {
    id: "seed_movie_when_harry_met_sally",
    externalId: "239",
    title: "When Harry Met Sally...",
    type: "Movie",
    year: "1989",
    creator: "Rob Reiner",
    synopsis: "Harry and Sally have known each other for years and are very good friends, but they fear that sleeping together would ruin their friendship.",
    genres: ["Romance", "Comedy", "Drama"],
    tags: ["Friends to Lovers", "Witty Banter", "Intimacy & Timing", "Modern Romance"],
    posterUrl: "https://thumb.wikimedia.org/wikipedia/en/thumb/1/13/WhenHarryMetSallyPoster.jpg/500px-WhenHarryMetSallyPoster.jpg"
  },
  {
    id: "seed_movie_arrival",
    externalId: "329865",
    title: "Arrival",
    type: "Movie",
    year: "2016",
    creator: "Denis Villeneuve",
    synopsis: "Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace or are a threat.",
    genres: ["Science Fiction", "Mystery", "Drama"],
    tags: ["First Contact", "Non-linear Time", "Linguistics", "Grief", "Universal Communication"],
    posterUrl: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg"
  },
  {
    id: "seed_movie_bladerunner2049",
    externalId: "335984",
    title: "Blade Runner 2049",
    type: "Movie",
    year: "2017",
    creator: "Denis Villeneuve",
    synopsis: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    genres: ["Science Fiction", "Mystery", "Action"],
    tags: ["Neo-Noir", "Cyberpunk", "Artificial Intelligence", "Consciousness", "Existential Dread"],
    posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg"
  },
  {
    id: "seed_movie_dune",
    externalId: "438631",
    title: "Dune",
    type: "Movie",
    year: "2021",
    creator: "Denis Villeneuve",
    synopsis: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    genres: ["Science Fiction", "Adventure"],
    tags: ["Space Opera", "Desert Ecology", "Feudal Politics", "Messianic Prophecy", "Resource Warfare"],
    posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
  },

  // TV SHOWS
  {
    id: "seed_tv_dark",
    externalId: "70523",
    title: "Dark",
    type: "TV Show",
    year: "2017",
    creator: "Baran bo Odar, Jantje Friese",
    synopsis: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
    genres: ["Sci-Fi & Fantasy", "Drama", "Mystery"],
    tags: ["Time Travel", "Bootstrap Paradox", "Generational Trauma", "Nietzschean Philosophy", "Somber Tone"],
    posterUrl: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg"
  },
  {
    id: "seed_tv_severance",
    externalId: "95396",
    title: "Severance",
    type: "TV Show",
    year: "2022",
    creator: "Dan Erickson",
    synopsis: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    genres: ["Drama", "Mystery", "Sci-Fi & Fantasy"],
    tags: ["Corporate Dystopia", "Dual Identity", "Kafkaesque", "Workplace Panopticon", "Psychological Thriller"],
    posterUrl: "https://thumb.wikimedia.org/wikipedia/en/thumb/f/f6/Severance_TV_series_poster.jpg/500px-Severance_TV_series_poster.jpg"
  },
  {
    id: "seed_tv_fleabag",
    externalId: "67070",
    title: "Fleabag",
    type: "TV Show",
    year: "2016",
    creator: "Phoebe Waller-Bridge",
    synopsis: "A sharp-witted, dry-humored woman navigating life and love in London while trying to cope with tragedy, intimacy, and forbidden connections.",
    genres: ["Comedy", "Drama", "Romance"],
    tags: ["Witty Banter", "Vulnerability", "Forbidden Love", "Emotional Depth", "Fourth Wall"],
    posterUrl: "https://thumb.wikimedia.org/wikipedia/en/thumb/b/b3/Fleabag_Season_1.jpg/500px-Fleabag_Season_1.jpg"
  },
  {
    id: "seed_tv_the_expanse",
    externalId: "63639",
    title: "The Expanse",
    type: "TV Show",
    year: "2015",
    creator: "Mark Fergus, Hawk Ostby",
    synopsis: "A thriller set two hundred years in the future following the case of a missing young woman who brings a hardened detective and a rogue ship's captain together in a race across the solar system.",
    genres: ["Sci-Fi & Fantasy", "Drama", "Mystery"],
    tags: ["Hard Sci-Fi", "Solar Politics", "Alien Protomolecule", "Belter Rebellion", "Orbital Mechanics"],
    posterUrl: "https://image.tmdb.org/t/p/w500/kNO4Nq1e7e7yH6K6U5f5n0L3Q4.jpg"
  },
  {
    id: "seed_tv_breaking_bad",
    externalId: "1396",
    title: "Breaking Bad",
    type: "TV Show",
    year: "2008",
    creator: "Vince Gilligan",
    synopsis: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's financial future.",
    genres: ["Drama", "Crime", "Thriller"],
    tags: ["Moral Degeneration", "Antihero Journey", "Family & Pride", "High-Stakes Crime", "Psychological Tension"],
    posterUrl: "https://thumb.wikimedia.org/wikipedia/en/thumb/6/61/Breaking_Bad_title_card.png/500px-Breaking_Bad_title_card.png"
  },

  // BOOKS
  {
    id: "seed_book_pride_and_prejudice",
    externalId: "ol_OL66554W",
    title: "Pride and Prejudice",
    type: "Book",
    year: "1813",
    creator: "Jane Austen",
    synopsis: "The turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner, exploring pride, social decorum, and genuine emotional affinity.",
    genres: ["Classic Literature", "Romance", "Social Satire"],
    tags: ["Enemies to Lovers", "Social Satire", "Class Nuance", "Witty Dialogue", "Repressed Passion"],
    posterUrl: "https://covers.openlibrary.org/b/id/8226191-L.jpg"
  },
  {
    id: "seed_book_three_body_problem",
    externalId: "gbook_three_body",
    title: "The Three-Body Problem",
    type: "Book",
    year: "2008",
    creator: "Cixin Liu",
    synopsis: "Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space to establish contact with aliens, leading to a catastrophic chain of events.",
    genres: ["Hard Science Fiction", "Cosmic Philosophy"],
    tags: ["Cosmic Sociology", "Theoretical Physics", "First Contact", "Extinction Threat", "Dimensions"],
    posterUrl: "https://covers.openlibrary.org/b/id/8302196-L.jpg"
  },
  {
    id: "seed_book_project_hail_mary",
    externalId: "gbook_hail_mary",
    title: "Project Hail Mary",
    type: "Book",
    year: "2021",
    creator: "Andy Weir",
    synopsis: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
    genres: ["Science Fiction", "Survival Thriller"],
    tags: ["Interstellar Voyage", "Amnesia", "Scientific Problem Solving", "First Contact", "Resourcefulness"],
    posterUrl: "https://covers.openlibrary.org/b/id/11181467-L.jpg"
  },
  {
    id: "seed_book_1984",
    externalId: "gbook_1984",
    title: "1984",
    type: "Book",
    year: "1949",
    creator: "George Orwell",
    synopsis: "A dystopian social science fiction novel and cautionary tale about totalitarianism, mass surveillance, and repressive regimentation of persons and behaviors within society.",
    genres: ["Classic Literature", "Dystopian"],
    tags: ["Totalitarianism", "Surveillance State", "Doublethink", "Thought Police", "Psychological Manipulation"],
    posterUrl: "https://covers.openlibrary.org/b/id/8575742-L.jpg"
  },
  {
    id: "seed_book_hyperion",
    externalId: "gbook_hyperion",
    title: "Hyperion",
    type: "Book",
    year: "1989",
    creator: "Dan Simmons",
    synopsis: "On the world of Hyperion, the mysterious Time Tombs are opening, and seven pilgrims set forth on a final voyage to uncover their secrets.",
    genres: ["Space Opera", "Literary Sci-Fi"],
    tags: ["Pilgrimage", "Time Tombs", "The Shrike", "Galactic Hegemony", "Poetics"],
    posterUrl: "https://covers.openlibrary.org/b/id/8231991-L.jpg"
  }
];

export async function runSeed() {
  await initDb();
  console.log("Seeding database with initial cross-media catalog...");

  for (const item of initialSeedData) {
    saveMediaItem(item);
  }

  // Seed cross-media thematic connections
  saveConnection("seed_movie_interstellar", "seed_tv_dark", 0.88, "Time travel, generational loops, and deep emotional stakes.");
  saveConnection("seed_movie_interstellar", "seed_book_three_body_problem", 0.92, "Cosmic scale, theoretical physics, and humanity's survival.");
  saveConnection("seed_movie_bladerunner2049", "seed_tv_severance", 0.86, "Artificially conditioned identities and corporate control of consciousness.");

  console.log(`✓ Database seeded with ${initialSeedData.length} core titles and cross-media links.`);
}

// Auto-run when executed directly via node db/seed.js
if (process.argv[1]?.endsWith("seed.js")) {
  runSeed();
}
