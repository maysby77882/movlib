import { initDb, saveMediaItem, saveConnection } from "./index.js";

export const initialSeedData = [
  // MOVIES
  {
    id: "tmdb_movie_103",
    externalId: "103",
    title: "Taxi Driver",
    type: "Movie",
    media_type: "movie",
    year: "1976",
    creator: "Martin Scorsese",
    synopsis: "A mentally unstable Vietnam War veteran works as a nighttime taxi driver in New York City, where the perceived decadence and sleaze fuels an urge for violent action and a delusional quest to save a young prostitute.",
    genres: ["Drama", "Crime"],
    tags: ["Psychological Descent & Urban Alienation", "Insomniac Veteran", "Loneliness", "Vigilante Morality", "New York Grime", "Anti-Hero"],
    posterUrl: "https://image.tmdb.org/t/p/w500/ekstpH694DaPWAnbr14qjAVR2Ls.jpg"
  },
  {
    id: "tmdb_movie_475557",
    externalId: "475557",
    title: "Joker",
    type: "Movie",
    media_type: "movie",
    year: "2019",
    creator: "Todd Phillips",
    synopsis: "During the 1980s, a failed stand-up comedian and party clown in Gotham City is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
    genres: ["Crime", "Thriller", "Drama"],
    tags: ["Psychological Descent & Urban Alienation", "Social Decay", "Mental Illness", "Nihilism", "Urban Isolation"],
    posterUrl: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"
  },
  {
    id: "tmdb_movie_242582",
    externalId: "242582",
    title: "Nightcrawler",
    type: "Movie",
    media_type: "movie",
    year: "2014",
    creator: "Dan Gilroy",
    synopsis: "When Lou Bloom, a driven man desperate for work, muscles into the world of L.A. crime journalism, he blurs the line between observer and participant to become the star of his own story.",
    genres: ["Crime", "Drama", "Thriller"],
    tags: ["Psychological Descent & Urban Alienation", "Sociopathy", "Urban Nightscape", "Moral Rot", "Obsession"],
    posterUrl: "https://image.tmdb.org/t/p/w500/8A7ox0w0A4mK2XQv3j1n5P6Fh4H.jpg"
  },
  {
    id: "tmdb_movie_872585",
    externalId: "872585",
    title: "Oppenheimer",
    type: "Movie",
    media_type: "movie",
    year: "2023",
    creator: "Christopher Nolan",
    synopsis: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, and the devastating political and personal fallout during the Cold War security hearings.",
    genres: ["Drama", "History"],
    tags: ["Scientific Hubris & Moral Fallout", "Manhattan Project", "Atomic Bomb", "Existential Threat", "Political Persecution"],
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"
  },
  {
    id: "seed_movie_interstellar",
    externalId: "157336",
    title: "Interstellar",
    type: "Movie",
    media_type: "movie",
    year: "2014",
    creator: "Christopher Nolan",
    synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    genres: ["Science Fiction", "Drama", "Adventure"],
    tags: ["Relativistic Space Odyssey & Survival", "Time Dilation", "Cosmic Scale", "Humanity Survival", "Love & Physics", "Black Hole", "Wormhole"],
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    id: "seed_movie_dune",
    externalId: "438631",
    title: "Dune",
    type: "Movie",
    media_type: "movie",
    year: "2021",
    creator: "Denis Villeneuve",
    synopsis: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    genres: ["Science Fiction", "Adventure"],
    tags: ["Messianic Destiny & Feudal Ecology", "Space Opera", "Desert Ecology", "Feudal Politics", "Messianic Prophecy", "Resource Warfare"],
    posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
  },
  {
    id: "tmdb_movie_155",
    externalId: "155",
    title: "The Dark Knight",
    type: "Movie",
    media_type: "movie",
    year: "2008",
    creator: "Christopher Nolan",
    synopsis: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    genres: ["Drama", "Action", "Crime", "Thriller"],
    tags: ["Vigilante Justice & Psychological Anarchy", "Agent of Chaos", "Moral Limits", "Gotham Corruption", "Duality"],
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    id: "seed_movie_the_proposal",
    externalId: "18240",
    title: "The Proposal",
    type: "Movie",
    media_type: "movie",
    year: "2009",
    creator: "Anne Fletcher",
    synopsis: "A high-powered book editor faces deportation to Canada and convinces her harried assistant to marry her in order to keep her visa, only for the two to travel to Alaska and discover genuine intimacy under a facade of convenience.",
    genres: ["Romance", "Comedy", "Drama"],
    tags: ["Deception to Romance & Marriage of Convenience", "Fake Relationship", "Enemies to Lovers", "Workplace Romance", "Alaska"],
    posterUrl: "https://thumb.wikimedia.org/wikipedia/en/thumb/0/02/The_Proposal.jpg/500px-The_Proposal.jpg"
  },
  {
    id: "tmdb_movie_11635",
    externalId: "11635",
    title: "Old School",
    type: "Movie",
    media_type: "movie",
    year: "2003",
    creator: "Todd Phillips",
    synopsis: "Three thirty-something adult friends attempt to recapture the glory of their college days by starting their own off-campus fraternity, sparking an all-out war with the university dean.",
    genres: ["Comedy"],
    tags: ["Slacker Brotherhood & Nostalgic Rebellion", "Fraternity", "Male Friendship", "Recapture Youth", "Midlife Crisis"],
    posterUrl: "https://image.tmdb.org/t/p/w500/b13uXbZg6g0Jq8WqB8jV9WkC8N.jpg"
  },

  // TV SHOWS
  {
    id: "seed_tv_dark",
    externalId: "70523",
    title: "Dark",
    type: "TV Show",
    media_type: "tv",
    year: "2017",
    creator: "Baran bo Odar, Jantje Friese",
    synopsis: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations across recursive 33-year time loops.",
    genres: ["Sci-Fi & Fantasy", "Drama", "Mystery"],
    tags: ["Recursive Time Loops & Determinism", "Bootstrap Paradox", "Generational Trauma", "Nietzschean Philosophy", "Somber Tone"],
    posterUrl: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg"
  },
  {
    id: "seed_tv_severance",
    externalId: "95396",
    title: "Severance",
    type: "TV Show",
    media_type: "tv",
    year: "2022",
    creator: "Dan Erickson",
    synopsis: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    genres: ["Drama", "Mystery", "Sci-Fi & Fantasy"],
    tags: ["Corporate Panopticon & Fractured Identity", "Dual Identity", "Kafkaesque", "Workplace Panopticon", "Psychological Thriller"],
    posterUrl: "https://thumb.wikimedia.org/wikipedia/en/thumb/f/f6/Severance_TV_series_poster.jpg/500px-Severance_TV_series_poster.jpg"
  },
  {
    id: "seed_tv_mr_robot",
    externalId: "62560",
    title: "Mr. Robot",
    type: "TV Show",
    media_type: "tv",
    year: "2015",
    creator: "Sam Esmail",
    synopsis: "Elliot, a brilliant but highly unstable cybersecurity engineer and vigilante hacker suffering from social anxiety disorder and clinical depression, is recruited by an insurrectionary anarchist known as Mr. Robot to destroy corporate debt.",
    genres: ["Drama", "Crime", "Thriller"],
    tags: ["Psychological Descent & Urban Alienation", "Vigilante Hacker", "Social Isolation", "Corporate Panopticon", "Dissociation", "Insomnia"],
    posterUrl: "https://image.tmdb.org/t/p/w500/oKIBNmZWRqpPtJJI6CsuqiMV4QB.jpg"
  },
  {
    id: "seed_tv_the_expanse",
    externalId: "63639",
    title: "The Expanse",
    type: "TV Show",
    media_type: "tv",
    year: "2015",
    creator: "Mark Fergus, Hawk Ostby",
    synopsis: "A thriller set two hundred years in the future following the case of a missing young woman who brings a hardened detective and a rogue ship's captain together in a race across the solar system.",
    genres: ["Sci-Fi & Fantasy", "Drama", "Mystery"],
    tags: ["Hard Sci-Fi", "Solar Politics", "Alien Protomolecule", "Belter Rebellion", "Orbital Mechanics"],
    posterUrl: "https://image.tmdb.org/t/p/w500/kNO4Nq1e7e7yH6K6U5f5n0L3Q4.jpg"
  },

  // BOOKS
  {
    id: "seed_book_notes_underground",
    externalId: "ol_OL112233W",
    title: "Notes from Underground",
    type: "Book",
    media_type: "book",
    year: "1864",
    creator: "Fyodor Dostoevsky",
    synopsis: "A bitter, isolated former civil servant living in St. Petersburg writes a passionate, obsessive diary chronicling his profound alienation, spite, moral contradictions, and descent into psychological withdrawal from human society.",
    genres: ["Philosophical Fiction", "Classic Literature"],
    tags: ["Psychological Descent & Urban Alienation", "Isolated Loner", "Existential Spite", "Urban Alienation", "Nihilism", "Obsessive Diary"],
    posterUrl: "https://covers.openlibrary.org/b/id/8231856-L.jpg"
  },
  {
    id: "seed_book_crime_and_punishment",
    externalId: "ol_OL223344W",
    title: "Crime and Punishment",
    type: "Book",
    media_type: "book",
    year: "1866",
    creator: "Fyodor Dostoevsky",
    synopsis: "An impoverished, isolated ex-student in St. Petersburg formulates a theory of extraordinary individuals and commits a brutal murder to test his moral supremacy, only to spiral into agonizing guilt, feverish paranoia, and mental collapse.",
    genres: ["Psychological Fiction", "Classic Literature"],
    tags: ["Psychological Descent & Urban Alienation", "Moral Guilt", "Vigilante Hubris", "Psychological Breakdown", "Paranoia"],
    posterUrl: "https://covers.openlibrary.org/b/id/8231920-L.jpg"
  },
  {
    id: "seed_book_the_stranger",
    externalId: "ol_OL334455W",
    title: "The Stranger",
    type: "Book",
    media_type: "book",
    year: "1942",
    creator: "Albert Camus",
    synopsis: "Meursault, an emotionally detached and psychologically isolated French Algerian clerk, commits a senseless murder on a scorching beach and faces trial for his refusal to conform to society's moral and emotional expectations.",
    genres: ["Philosophical Fiction", "Absurdist Literature"],
    tags: ["Psychological Descent & Urban Alienation", "Absurdism", "Emotional Detachment", "Alienation", "Nihilism"],
    posterUrl: "https://covers.openlibrary.org/b/id/8312456-L.jpg"
  },
  {
    id: "seed_book_three_body_problem",
    externalId: "gbook_three_body",
    title: "The Three-Body Problem",
    type: "Book",
    media_type: "book",
    year: "2008",
    creator: "Cixin Liu",
    synopsis: "Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space to establish contact with aliens, leading to a catastrophic chain of events.",
    genres: ["Hard Science Fiction", "Cosmic Philosophy"],
    tags: ["Cosmic Sociology & First Contact", "Theoretical Physics", "First Contact", "Extinction Threat", "Dimensions"],
    posterUrl: "https://covers.openlibrary.org/b/id/8302196-L.jpg"
  },
  {
    id: "seed_book_1984",
    externalId: "gbook_1984",
    title: "1984",
    type: "Book",
    media_type: "book",
    year: "1949",
    creator: "George Orwell",
    synopsis: "A dystopian social science fiction novel and cautionary tale about totalitarianism, mass surveillance, and repressive regimentation of persons and behaviors within society.",
    genres: ["Classic Literature", "Dystopian"],
    tags: ["Corporate Panopticon & Fractured Identity", "Totalitarianism", "Surveillance State", "Doublethink", "Thought Police"],
    posterUrl: "https://covers.openlibrary.org/b/id/8575742-L.jpg"
  },
  {
    id: "seed_book_project_hail_mary",
    externalId: "gbook_hail_mary",
    title: "Project Hail Mary",
    type: "Book",
    media_type: "book",
    year: "2021",
    creator: "Andy Weir",
    synopsis: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
    genres: ["Science Fiction", "Survival Thriller"],
    tags: ["Relativistic Space Odyssey & Survival", "Interstellar Voyage", "Scientific Problem Solving", "First Contact", "Resourcefulness"],
    posterUrl: "https://covers.openlibrary.org/b/id/11181467-L.jpg"
  }
];

export async function runSeed() {
  await initDb();
  console.log("Seeding database with Story-First cross-media catalog...");

  for (const item of initialSeedData) {
    saveMediaItem(item);
  }

  saveConnection("tmdb_movie_103", "tmdb_movie_475557", 0.94, "Both feature isolated urban loners descending into psychological breakdown and violent rebellion against decaying metropolitan society.");
  saveConnection("tmdb_movie_103", "seed_book_notes_underground", 0.92, "Shares the foundational theme of the alienated outsider recording his spite and contempt for society from the urban margins.");
  saveConnection("tmdb_movie_103", "seed_tv_mr_robot", 0.89, "Centers on an alienated, insomniac protagonist driven by psychological delusion to dismantle societal corruption.");

  console.log(`✓ Database seeded with ${initialSeedData.length} core titles and cross-media links.`);
}

if (process.argv[1]?.endsWith("seed.js")) {
  runSeed();
}
