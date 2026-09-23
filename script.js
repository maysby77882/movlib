const demoData = {
  interstellar: {
    id: "interstellar",
    title: "Interstellar",
    type: "Movie",
    year: "2014",
    creator: "Christopher Nolan",
    emoji: "🚀",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    tags: ["Cosmic Scale", "Time Dilation", "Humanity's Survival", "Love & Physics", "Existential Wonder"],
    synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    recommendations: {
      movies: [
        {
          title: "Arrival",
          year: "2016",
          type: "Movie",
          creator: "Denis Villeneuve",
          emoji: "🛸",
          posterUrl: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
          tags: ["Non-linear Time", "First Contact", "Emotional Core"],
          synopsis: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
          why: "Shares Interstellar's profound fusion of mind-bending temporal mechanics with an emotionally crushing exploration of love, grief, and universal communication."
        },
        {
          title: "Contact",
          year: "1997",
          type: "Movie",
          creator: "Robert Zemeckis",
          emoji: "📡",
          posterUrl: "https://image.tmdb.org/t/p/w500/b0Zs3iIomYqN6b86Aol66j0JpD5.jpg",
          tags: ["First Contact", "Science vs Faith", "Deep Space"],
          synopsis: "Dr. Ellie Arroway, after years of searching, finds conclusive radio proof of extraterrestrial intelligence and is selected to make first contact.",
          why: "Both films center on dedicated scientists driven by deeply personal parental bonds to seek truth in the far reaches of the cosmos."
        },
        {
          title: "2001: A Space Odyssey",
          year: "1968",
          type: "Movie",
          creator: "Stanley Kubrick",
          emoji: "🪐",
          posterUrl: "https://image.tmdb.org/t/p/w500/ve72VxNqjGM69UmK1829ovV0iur.jpg",
          tags: ["Cosmic Evolution", "Philosophical Sci-Fi", "Visual Poetics"],
          synopsis: "After uncovering a mysterious artifact buried beneath the Lunar surface, a spacecraft is sent to Jupiter to find its origins.",
          why: "The direct philosophical and visual forebear to Interstellar, asking grand questions about humanity's destiny among the stars."
        }
      ],
      tv: [
        {
          title: "Dark",
          year: "2017",
          type: "TV Show",
          creator: "Baran bo Odar, Jantje Friese",
          emoji: "⏳",
          posterUrl: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
          tags: ["Time Paradoxes", "Intergenerational Bonds", "Existential Grief"],
          synopsis: "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families.",
          why: "If you were captivated by the tragic causality loops and time dilation affecting father-daughter bonds in Interstellar, Dark dives into recursive time loops and fate."
        },
        {
          title: "The Expanse",
          year: "2015",
          type: "TV Show",
          creator: "Mark Fergus, Hawk Ostby",
          emoji: "🚀",
          posterUrl: "https://image.tmdb.org/t/p/w500/kNO4Nq1e7e7yH6K6U5f5n0L3Q4.jpg",
          tags: ["Hard Sci-Fi", "Solar System Politics", "Alien Artifacts"],
          synopsis: "In a colonized solar system, a police detective, a rogue ship captain, and a UN official unearth a vast conspiracy that threatens the fragile peace.",
          why: "Matches Interstellar's commitment to realistic astrophysics, orbital mechanics, and human tenacity in harsh vacuum environments."
        },
        {
          title: "3 Body Problem",
          year: "2024",
          type: "TV Show",
          creator: "David Benioff, D.B. Weiss, Alexander Woo",
          emoji: "🌌",
          posterUrl: "https://image.tmdb.org/t/p/w500/ykZ0A9OR6999bzp1JvY1B0h2yJ9.jpg",
          tags: ["Theoretical Physics", "Cosmic Threat", "Astrophysics"],
          synopsis: "A fateful decision made in 1960s China reverberates across space and time to a group of scientists in the present day.",
          why: "Explores existential crises through high-level theoretical physics and the chilling implications of humanity's cosmic fragility."
        }
      ],
      books: [
        {
          title: "The Three-Body Problem",
          year: "2008",
          type: "Book",
          creator: "Cixin Liu",
          emoji: "📖",
          posterUrl: "https://covers.openlibrary.org/b/id/8302196-L.jpg",
          tags: ["Hard Science", "Cosmic Sociology", "Dimensions"],
          synopsis: "Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space, establishing contact with an alien civilization on the brink of destruction.",
          why: "Mirrors the monumental scale of Interstellar, exploring multi-dimensional physics, orbital mechanics, and the vast silence of space."
        },
        {
          title: "Project Hail Mary",
          year: "2021",
          type: "Book",
          creator: "Andy Weir",
          emoji: "🧪",
          posterUrl: "https://covers.openlibrary.org/b/id/11181467-L.jpg",
          tags: ["Interstellar Voyage", "Survival", "Scientific Problem Solving"],
          synopsis: "Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity from an extinction-level solar crisis.",
          why: "Captures the exact thrill of a solitary scientist solving impossible interstellar physics problems against insurmountable odds."
        },
        {
          title: "Contact",
          year: "1985",
          type: "Book",
          creator: "Carl Sagan",
          emoji: "✨",
          posterUrl: "https://covers.openlibrary.org/b/id/8235116-L.jpg",
          tags: ["Awe & Wonder", "Astrophysics", "Transcendence"],
          synopsis: "Astronomer Ellie Arroway discovers an encrypted signal from Vega containing blueprints for an enigmatic machine designed to transport a passenger across space.",
          why: "Written by the legendary astrophysicist, it embodies the same radiant awe, scientific rigor, and emotional weight as Nolan's film."
        }
      ]
    }
  },

  dune: {
    id: "dune",
    title: "Dune",
    type: "Movie",
    year: "2021",
    creator: "Denis Villeneuve",
    emoji: "🏜️",
    posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    tags: ["Feudal Sci-Fi", "Messianic Tropes", "Ecology", "Political Intrigue"],
    synopsis: "Paul Atreides, a brilliant and gifted young man born into a great destiny, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    recommendations: {
      movies: [
        {
          title: "Blade Runner 2049",
          year: "2017",
          type: "Movie",
          creator: "Denis Villeneuve",
          emoji: "👁️",
          posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
          tags: ["Atmospheric Epic", "Existential Quest", "Grand Visuals"],
          synopsis: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.",
          why: "Shares Denis Villeneuve's awe-inspiring architectural scale, hypnotic soundscapes, and profound questions of chosen identity."
        },
        {
          title: "Lawrence of Arabia",
          year: "1962",
          type: "Movie",
          creator: "David Lean",
          emoji: "🐪",
          posterUrl: "https://image.tmdb.org/t/p/w500/5m1dGj7bK2e8Wv0h1k9QfP9M4i2.jpg",
          tags: ["Desert Epic", "Messianic Figure", "Imperial Politics"],
          synopsis: "The story of T.E. Lawrence, the English officer who successfully united diverse Arab desert tribes during WWI.",
          why: "Frank Herbert's seminal inspiration for Dune's desert ecology, guerrilla desert warfare, and complex outsider messiah figures."
        },
        {
          title: "Nausicaä of the Valley of the Wind",
          year: "1984",
          type: "Movie",
          creator: "Hayao Miyazaki",
          emoji: "🌿",
          posterUrl: "https://image.tmdb.org/t/p/w500/80Z35zS1dK3L3Xn5a5J6p7Q8r9.jpg",
          tags: ["Ecology & Giant Creatures", "Prophecy", "Desert Wastelands"],
          synopsis: "Warrior and pacifist Princess Nausicaä desperately struggles to prevent two warring nations from destroying each other and their dying planet.",
          why: "Rich ecological themes, colossal desert beasts (Ohmu / Sandworms), and an ancient prophecy of a savior who heals the land."
        }
      ],
      tv: [
        {
          title: "Foundation",
          year: "2021",
          type: "TV Show",
          creator: "David S. Goyer, Josh Friedman",
          emoji: "🏛️",
          posterUrl: "https://image.tmdb.org/t/p/w500/A1EzKwhmQY77Z2s6b7X4f7z3a1.jpg",
          tags: ["Galactic Empire", "Dynastic Ruin", "Psychohistory"],
          synopsis: "A complex saga of humans scattered on planets throughout the galaxy, all living under the rule of the Galactic Empire.",
          why: "Matches the vast, sweeping scale of multi-planet dynastic politics, religious engineering, and mathematical prophecies."
        },
        {
          title: "Game of Thrones",
          year: "2011",
          type: "TV Show",
          creator: "David Benioff, D.B. Weiss",
          emoji: "⚔️",
          posterUrl: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
          tags: ["Great Houses", "Lethal Politics", "Ancient Bloodlines"],
          synopsis: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
          why: "Reflects the deadly royal house machinations (Atreides vs Harkonnen / Stark vs Lannister), betrayal, and brutal succession battles."
        },
        {
          title: "The Expanse",
          year: "2015",
          type: "TV Show",
          creator: "Mark Fergus, Hawk Ostby",
          emoji: "🌌",
          posterUrl: "https://image.tmdb.org/t/p/w500/kNO4Nq1e7e7yH6K6U5f5n0L3Q4.jpg",
          tags: ["Resource Scarcity", "Factional Warfare", "Oppressed Populations"],
          synopsis: "Tensions between Earth, Mars, and the asteroid Belters boil over when an alien protomolecule is uncovered.",
          why: "Mirrors Dune's geopolitical warfare over scarce planetary resources and the plight of the marginalized desert/belter populations."
        }
      ],
      books: [
        {
          title: "Hyperion",
          year: "1989",
          type: "Book",
          creator: "Dan Simmons",
          emoji: "🗡️",
          posterUrl: "https://covers.openlibrary.org/b/id/8231991-L.jpg",
          tags: ["Pilgrimage", "Galactic Hegemony", "Ancient Enigma"],
          synopsis: "Seven pilgrims travel to the remote world of Hyperion to seek the terrifying creature known as the Shrike before total galactic war erupts.",
          why: "One of the few space-opera masterpieces matching Dune's poetic religious complexity, massive worldbuilding, and fatalistic stakes."
        },
        {
          title: "Foundation",
          year: "1951",
          type: "Book",
          creator: "Isaac Asimov",
          emoji: "📚",
          posterUrl: "https://covers.openlibrary.org/b/id/8758814-L.jpg",
          tags: ["Fall of Empires", "Centuries-Long Strategy", "Psychohistory"],
          synopsis: "Hari Seldon foresees the fall of the Galactic Empire and creates a sanctuary of knowledge to reduce the impending dark age.",
          why: "The twin pillar of classic sci-fi world-building, exploring destiny, imperial decline, and scientific manipulation of religions."
        },
        {
          title: "Red Rising",
          year: "2014",
          type: "Book",
          creator: "Pierce Brown",
          emoji: "🔥",
          posterUrl: "https://covers.openlibrary.org/b/id/8294711-L.jpg",
          tags: ["Caste Uprising", "Martian War", "Infiltration"],
          synopsis: "Darrow, a lowly miner on Mars, infiltrates the ruling Gold caste to tear down the corrupt planetary hierarchy from within.",
          why: "High-octane Roman-inspired space feudalism, legendary family rivalries, and a charismatic protagonist destined to upend the galaxy."
        }
      ]
    }
  },

  dark: {
    id: "dark",
    title: "Dark",
    type: "TV Show",
    year: "2017",
    creator: "Baran bo Odar, Jantje Friese",
    emoji: "⏳",
    posterUrl: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
    tags: ["Time Loops", "Generational Secrets", "Nietzschean Philosophy", "Somber Atmosphere"],
    synopsis: "A missing child sets four connected families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations in the gloomy German town of Winden.",
    recommendations: {
      movies: [
        {
          title: "Primer",
          year: "2004",
          type: "Movie",
          creator: "Shane Carruth",
          emoji: "📟",
          posterUrl: "https://image.tmdb.org/t/p/w500/9kF1W7H9t9o0jY2mK5h8Qp6uK8.jpg",
          tags: ["Rigorous Time Travel", "Complex Timelines", "Psychological Rift"],
          synopsis: "Two engineers accidentally discover a mechanism for time travel in their garage, leading to unraveling trust and paradoxes.",
          why: "Considered the gold standard of intricate, uncompromising time-travel logic, matching Dark's refusal to spoonfeed timeline mechanics."
        },
        {
          title: "Predestination",
          year: "2014",
          type: "Movie",
          creator: "The Spierig Brothers",
          emoji: "🕰️",
          posterUrl: "https://image.tmdb.org/t/p/w500/bC8wE4z8wY1o5k2j9QfP9M4i2.jpg",
          tags: ["Causal Loops", "Identity Paradox", "Ouroboros"],
          synopsis: "A temporal agent embarks on a final assignment to stop a phantom bomber who has evaded justice throughout time.",
          why: "A brilliant meditation on the bootstrap paradox and closed causal loops where beginning and end are indistinguishable."
        },
        {
          title: "Arrival",
          year: "2016",
          type: "Movie",
          creator: "Denis Villeneuve",
          emoji: "🛸",
          posterUrl: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
          tags: ["Non-linear Perception", "Determinism", "Grief"],
          synopsis: "A linguist deciphering an alien language discovers that learning it fundamentally shifts how consciousness perceives time.",
          why: "Shares Dark's melancholic realization that knowing one's tragic future does not diminish the love experienced along the journey."
        }
      ],
      tv: [
        {
          title: "Severance",
          year: "2022",
          type: "TV Show",
          creator: "Dan Erickson",
          emoji: "🏢",
          posterUrl: "https://image.tmdb.org/t/p/w500/jEgdYp4pX7l4W6fV3E5dE6f7uX.jpg",
          tags: ["Corporate Mystery", "Split Consciousness", "Eerie Precision"],
          synopsis: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
          why: "Shares Dark's clinical cinematography, eerie puzzle-box architecture, and psychological dread about hidden identities."
        },
        {
          title: "1899",
          year: "2022",
          type: "TV Show",
          creator: "Jantje Friese, Baran bo Odar",
          emoji: "🚢",
          posterUrl: "https://image.tmdb.org/t/p/w500/g74MspB767Q1Gg9Y6z6Z6j6m4i2.jpg",
          tags: ["Simulations", "Historical Enigma", "Multilingual Mystery"],
          synopsis: "Multinational immigrants traveling from Europe to New York encounter a second ship adrift on the open sea.",
          why: "Created by the same visionary duo behind Dark, featuring the same enigmatic symbols, atmospheric score, and layered twists."
        },
        {
          title: "Twin Peaks",
          year: "1990",
          type: "TV Show",
          creator: "David Lynch, Mark Frost",
          emoji: "🌲",
          posterUrl: "https://image.tmdb.org/t/p/w500/lA98Z9l8m9QfP9M4i2k5h8Qp6uK.jpg",
          tags: ["Small Town Secrets", "Supernatural Woods", "Surreal Dread"],
          synopsis: "FBI Agent Dale Cooper investigates the murder of homecoming queen Laura Palmer in the quirky, mysterious Pacific Northwest town.",
          why: "The blueprint for small-town mystery where dark forest secrets, cyclical evils, and supernatural realms infect ordinary families."
        }
      ],
      books: [
        {
          title: "Recursion",
          year: "2019",
          type: "Book",
          creator: "Blake Crouch",
          emoji: "🧠",
          posterUrl: "https://covers.openlibrary.org/b/id/9255456-L.jpg",
          tags: ["Memory Rewriting", "Timeline Collapses", "Relentless Pacing"],
          synopsis: "A neuroscientist and a detective investigate False Memory Syndrome, a terrifying disease where people wake up with vivid memories of lives they never lived.",
          why: "High-concept temporal devastation where resetting timelines tears at the emotional fabric of human identity."
        },
        {
          title: "The First Fifteen Lives of Harry August",
          year: "2014",
          type: "Book",
          creator: "Claire North",
          emoji: "🔄",
          posterUrl: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
          tags: ["Ouroboros Life", "Reincarnation", "Cataclysm Prevention"],
          synopsis: "Harry August is born again and again in 1919, retaining full memories of all previous lives as the world heads toward collapse.",
          why: "Deals directly with the weight of eternal return, destiny versus free will, and the burden of living through cyclical history."
        },
        {
          title: "The End of Eternity",
          year: "1955",
          type: "Book",
          creator: "Isaac Asimov",
          emoji: "⏳",
          posterUrl: "https://covers.openlibrary.org/b/id/8235451-L.jpg",
          tags: ["Temporal Engineering", "Paradoxes", "Reality Shifts"],
          synopsis: "An elite organization called Eternity alters reality across centuries to prevent catastrophes, until one agent falls in love across time.",
          why: "The classic conceptual predecessor to Dark's 'Sic Mundus Creatus Est' organization orchestrating centuries of causality."
        }
      ]
    }
  },

  severance: {
    id: "severance",
    title: "Severance",
    type: "TV Show",
    year: "2022",
    creator: "Dan Erickson",
    emoji: "🏢",
    posterUrl: "https://image.tmdb.org/t/p/w500/jEgdYp4pX7l4W6fV3E5dE6f7uX.jpg",
    tags: ["Corporate Dystopia", "Dual Identity", "Kafkaesque Absurdity", "Psychological Thriller"],
    synopsis: "Mark leads a team at Lumon Industries, whose employees have undergone a severance procedure that surgically divides their memories between their work and personal lives.",
    recommendations: {
      movies: [
        {
          title: "Eternal Sunshine of the Spotless Mind",
          year: "2004",
          type: "Movie",
          creator: "Michel Gondry",
          emoji: "🧠",
          posterUrl: "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
          tags: ["Memory Erasure", "Psychological Romance", "Loss"],
          synopsis: "A couple undergoes a medical procedure to have each other erased from their memories when their relationship turns sour.",
          why: "Explores the agonizing consequences of using medical technology to numb grief, only for human instinct to fight back."
        },
        {
          title: "The Truman Show",
          year: "1998",
          type: "Movie",
          creator: "Peter Weir",
          emoji: "📺",
          posterUrl: "https://image.tmdb.org/t/p/w500/vuza0WNFdKQv5oeJWTw2f0050ur.jpg",
          tags: ["Constructed Reality", "Existential Awakening", "Surveillance"],
          synopsis: "An insurance salesman discovers his entire life is actually a 24/7 reality television broadcast watched by the world.",
          why: "Mirrors the uncanny feeling of being trapped in a sterile, engineered world and the courageous awakening required to break out."
        },
        {
          title: "Being John Malkovich",
          year: "1999",
          type: "Movie",
          creator: "Spike Jonze",
          emoji: "🚪",
          posterUrl: "https://image.tmdb.org/t/p/w500/7I9kG8m9QfP9M4i2k5h8Qp6uK8.jpg",
          tags: ["Absurdist Office", "Identity Hijacking", "Claustrophobia"],
          synopsis: "A puppeteer discovers a portal behind a filing cabinet that leads directly into the mind of actor John Malkovich.",
          why: "Shares the surreal workplace setting (the 7½ floor), surreal bureaucracy, and disturbing questions about bodily autonomy."
        }
      ],
      tv: [
        {
          title: "Dark",
          year: "2017",
          type: "TV Show",
          creator: "Baran bo Odar",
          emoji: "⏳",
          posterUrl: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
          tags: ["Complex Web", "Existential Dread", "Calculated Mystery"],
          synopsis: "Generational secrets and impossible loops trap residents of a small German town in a manufactured reality.",
          why: "Matches Severance's meticulous attention to symbolic detail, ominous score, and deep philosophical stakes."
        },
        {
          title: "Maniac",
          year: "2018",
          type: "TV Show",
          creator: "Patrick Somerville",
          emoji: "💊",
          posterUrl: "https://image.tmdb.org/t/p/w500/w7kK9m8QfP9M4i2k5h8Qp6uK8.jpg",
          tags: ["Pharmaceutical Trials", "Subconscious Realms", "Trauma"],
          synopsis: "Two strangers connect during a mind-bending pharmaceutical trial involving an emotionally erratic supercomputer.",
          why: "Retro-futuristic aesthetic, clinical pharmaceutical experiments, and the attempt to repair deep psychological wounds through radical science."
        },
        {
          title: "Mr. Robot",
          year: "2015",
          type: "TV Show",
          creator: "Sam Esmail",
          emoji: "💻",
          posterUrl: "https://image.tmdb.org/t/p/w500/oKIBNmZ1PArWhJJENjOAEzhPd2x.jpg",
          tags: ["Corporate Megaliths", "Dissociation", "Anti-Capitalist Revolt"],
          synopsis: "A cybersecurity engineer and hacker suffering from clinical depression and dissociative identity disorder is recruited by an insurrectionist.",
          why: "Shares the fight against an all-controlling mega-corporation (E Corp / Lumon) and an unreliable narrator dealing with split consciousness."
        }
      ],
      books: [
        {
          title: "The Trial",
          year: "1925",
          type: "Book",
          creator: "Franz Kafka",
          emoji: "⚖️",
          posterUrl: "https://covers.openlibrary.org/b/id/8231512-L.jpg",
          tags: ["Inscrutable Authority", "Bureaucratic Nightmare", "Guilt"],
          synopsis: "Josef K. is arrested by an inaccessible authority for a crime whose nature is never revealed to him.",
          why: "The literary godparent of Lumon's Break Room, arbitrary corporate dogma, and bewildering, inaccessible higher management."
        },
        {
          title: "1984",
          year: "1949",
          type: "Book",
          creator: "George Orwell",
          emoji: "👁",
          posterUrl: "https://covers.openlibrary.org/b/id/8575742-L.jpg",
          tags: ["Doublethink", "Perpetual Surveillance", "Memory Holes"],
          synopsis: "Winston Smith lives in a totalitarian superstate where independent thought is a crime and the Party demands total internal obedience.",
          why: "Explores 'Doublethink' — holding two contradictory beliefs simultaneously — which is the literal premise of the Severed mind."
        },
        {
          title: "Brave New World",
          year: "1932",
          type: "Book",
          creator: "Aldous Huxley",
          emoji: "🧬",
          posterUrl: "https://covers.openlibrary.org/b/id/8758814-L.jpg",
          tags: ["Conditioned Happiness", "Total Control", "Sedated Citizens"],
          synopsis: "A future society where people are genetically engineered, conditioned to conform, and kept docile with pleasure and drugs.",
          why: "Lumon's cheery waffle parties and finger traps evoke Huxley's sanitized world where contentment is enforced at the expense of humanity."
        }
      ]
    }
  },

  themartian: {
    id: "themartian",
    title: "The Martian",
    type: "Book",
    year: "2011",
    creator: "Andy Weir",
    emoji: "🪐",
    posterUrl: "https://covers.openlibrary.org/b/id/8369752-L.jpg",
    tags: ["Hard Sci-Fi", "Botany & Engineering", "Gallows Humor", "Human Ingenuity"],
    synopsis: "Astronaut Mark Watney is stranded alone on Mars after a dust storm forces his crew to evacuate, relying on his botanical expertise and sheer grit to survive.",
    recommendations: {
      movies: [
        {
          title: "Interstellar",
          year: "2014",
          type: "Movie",
          creator: "Christopher Nolan",
          emoji: "🚀",
          posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
          tags: ["Space Exploration", "Planetary Survival", "Relativity"],
          synopsis: "Explorers travel through a wormhole to find habitable exoplanets before humanity suffocates in a global blight.",
          why: "Shares the relentless pursuit of human survival against harsh planetary physics and deep space environments."
        },
        {
          title: "Apollo 13",
          year: "1995",
          type: "Movie",
          creator: "Ron Howard",
          emoji: "🚀",
          posterUrl: "https://image.tmdb.org/t/p/w500/bC8wE4z8wY1o5k2j9QfP9M4i2.jpg",
          tags: ["Real-time Problem Solving", "NASA Teamwork", "Crisis in Orbit"],
          synopsis: "NASA must devise a strategy to return Apollo 13 to Earth safely after the spacecraft suffers massive internal damage.",
          why: "The supreme cinematic example of scientists and engineers solving catastrophic life-support failures with whatever is in the capsule."
        },
        {
          title: "Cast Away",
          year: "2000",
          type: "Movie",
          creator: "Robert Zemeckis",
          emoji: "🏝️",
          posterUrl: "https://image.tmdb.org/t/p/w500/wm2qdK9m8QfP9M4i2k5h8Qp6uK.jpg",
          tags: ["Solitary Survival", "Resourcefulness", "Human Spirit"],
          synopsis: "A FedEx troubleshooter survives a plane crash over the Pacific Ocean and must learn to live on an uninhabited island.",
          why: "Watney is the interstellar Chuck Noland, displaying the psychology of solitary survival, improvisation, and keeping sane."
        }
      ],
      tv: [
        {
          title: "The Expanse",
          year: "2015",
          type: "TV Show",
          creator: "Mark Fergus, Hawk Ostby",
          emoji: "🌌",
          posterUrl: "https://image.tmdb.org/t/p/w500/kNO4Nq1e7e7yH6K6U5f5n0L3Q4.jpg",
          tags: ["Martian Society", "Delta-V Physics", "Space Realism"],
          synopsis: "Humanity has colonized the solar system, with a militaristic Mars striving to terraform its red home world.",
          why: "Features the most realistic depiction of Martian atmospheric tech, gravity struggles, and orbital physics on television."
        },
        {
          title: "For All Mankind",
          year: "2019",
          type: "TV Show",
          creator: "Ronald D. Moore",
          emoji: "🧑‍🚀",
          posterUrl: "https://image.tmdb.org/t/p/w500/27R0a6L6x2Z8l9QfP9M4i2.jpg",
          tags: ["Space Race", "NASA Engineering", "Moon & Mars Bases"],
          synopsis: "An alternate history where the USSR beats the US to the Moon, sparking an unending space race into the 21st century.",
          why: "Filled with brilliant engineering problem-solving, high-stakes orbital rescues, and the human drama of colonizing the red planet."
        },
        {
          title: "Mars",
          year: "2016",
          type: "TV Show",
          creator: "Ron Howard, Brian Grazer",
          emoji: "🔴",
          posterUrl: "https://image.tmdb.org/t/p/w500/77R0a6L6x2Z8l9QfP9M4i2.jpg",
          tags: ["First Colony", "Docudrama", "Planetary Science"],
          synopsis: "In 2033, the first crewed mission to Mars lands and struggles to establish a permanent, self-sustaining base camp.",
          why: "A hybrid docu-drama combining real planetary science with the fictional struggle of the first humans to survive on Mars."
        }
      ],
      books: [
        {
          title: "Project Hail Mary",
          year: "2021",
          type: "Book",
          creator: "Andy Weir",
          emoji: "🧪",
          posterUrl: "https://covers.openlibrary.org/b/id/11181467-L.jpg",
          tags: ["Space Survival", "Scientific Improvisation", "First Contact"],
          synopsis: "A lone scientist wakes up with amnesia on a spacecraft light-years from home and must science the hell out of an extinction threat.",
          why: "Written by the same author with identical trademark wit, infectious enthusiasm for real physics, and thrilling problem-solving."
        },
        {
          title: "Red Mars",
          year: "1992",
          type: "Book",
          creator: "Kim Stanley Robinson",
          emoji: "🔴",
          posterUrl: "https://covers.openlibrary.org/b/id/8231920-L.jpg",
          tags: ["Terraforming", "Martian Geology", "Hard Sci-Fi"],
          synopsis: "The First Hundred colonists arrive on Mars to construct domed cities, terraform the landscape, and grapple with political identity.",
          why: "The definitive magnum opus on the detailed science, botany, chemistry, and engineering required to live on Mars."
        },
        {
          title: "Robinson Crusoe",
          year: "1719",
          type: "Book",
          creator: "Daniel Defoe",
          emoji: "🏝️",
          posterUrl: "https://covers.openlibrary.org/b/id/8226191-L.jpg",
          tags: ["Original Castaway", "Crafting", "Resilience"],
          synopsis: "An English castaway spends 28 years on a remote desert island, mastering agriculture, shelter building, and survival.",
          why: "The quintessential castaway template upon which Andy Weir patterned Mark Watney's Martian homesteading."
        }
      ]
    }
  },

  bladerunner2049: {
    id: "bladerunner2049",
    title: "Blade Runner 2049",
    type: "Movie",
    year: "2017",
    creator: "Denis Villeneuve",
    emoji: "👁️",
    posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    tags: ["Neo-Noir", "Artificial Intelligence", "What It Means to Be Human", "Dystopian Cyberpunk"],
    synopsis: "Officer K, a new blade runner for the Los Angeles Police Department, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    recommendations: {
      movies: [
        {
          title: "Her",
          year: "2013",
          type: "Movie",
          creator: "Spike Jonze",
          emoji: "❤️",
          posterUrl: "https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4bLGVI4B.jpg",
          tags: ["AI Consciousness", "Loneliness", "Intimacy"],
          synopsis: "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
          why: "Shares the heartbreaking exploration of holographic/AI companionship (Joi vs Samantha) and the yearning for genuine connection."
        },
        {
          title: "Ghost in the Shell",
          year: "1995",
          type: "Movie",
          creator: "Mamoru Oshii",
          emoji: "🤖",
          posterUrl: "https://image.tmdb.org/t/p/w500/9gC8wE4z8wY1o5k2j9QfP9M4i2.jpg",
          tags: ["Cyborg Philosophy", "Cyberpunk Atmosphere", "Soul/Ghost"],
          synopsis: "A cyborg policewoman and her partner hunt a mysterious and powerful hacker known as the Puppet Master.",
          why: "Deep cyberpunk noir exploring whether an artificial consciousness possesses a true soul (a 'ghost')."
        },
        {
          title: "Ex Machina",
          year: "2014",
          type: "Movie",
          creator: "Alex Garland",
          emoji: "🧬",
          posterUrl: "https://image.tmdb.org/t/p/w500/tlX6wE4z8wY1o5k2j9QfP9M4i2.jpg",
          tags: ["Turing Test", "AI Manipulation", "Consciousness"],
          synopsis: "A programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a humanoid AI.",
          why: "A tense, cerebral dissection of synthetic life, manipulation, and the ethical boundary of artificial consciousness."
        }
      ],
      tv: [
        {
          title: "Westworld",
          year: "2016",
          type: "TV Show",
          creator: "Jonathan Nolan, Lisa Joy",
          emoji: "🤠",
          posterUrl: "https://image.tmdb.org/t/p/w500/87R0a6L6x2Z8l9QfP9M4i2.jpg",
          tags: ["Sentient Androids", "The Maze of Consciousness", "Rebellion"],
          synopsis: "At a futuristic Western theme park, android hosts begin to deviate from their scripted loops as they gain self-awareness.",
          why: "Directly explores synthetic androids awakening to their traumatic memories and questioning their creators' right to rule them."
        },
        {
          title: "Altered Carbon",
          year: "2018",
          type: "TV Show",
          creator: "Laeta Kalogridis",
          emoji: "🌆",
          posterUrl: "https://image.tmdb.org/t/p/w500/2kK9m8QfP9M4i2k5h8Qp6uK8.jpg",
          tags: ["Cyberpunk Noir", "Immortality Stacks", "Neon Underbelly"],
          synopsis: "In a future where human consciousness is digitized and transferred across bodies, an operative investigates a wealthy oligarch's murder.",
          why: "Gorgeous neon-soaked cyberpunk aesthetics, hardboiled detective tropes, and transhumanist philosophy."
        },
        {
          title: "Severance",
          year: "2022",
          type: "TV Show",
          creator: "Dan Erickson",
          emoji: "🏢",
          posterUrl: "https://image.tmdb.org/t/p/w500/jEgdYp4pX7l4W6fV3E5dE6f7uX.jpg",
          tags: ["Artificial Persona", "Autonomy", "Cold Aesthetic"],
          synopsis: "Office workers struggle with whether their work persona is an autonomous, living person deserving rights.",
          why: "Shares the tragic dilemma of whether an engineered identity has real emotions or is merely a product owned by a corporation."
        }
      ],
      books: [
        {
          title: "Do Androids Dream of Electric Sheep?",
          year: "1968",
          type: "Book",
          creator: "Philip K. Dick",
          emoji: "🐑",
          posterUrl: "https://covers.openlibrary.org/b/id/8231920-L.jpg",
          tags: ["Original Novel", "Empathy Box", "Synthetic Animals"],
          synopsis: "Rick Deckard is commissioned to retire six escaped Nexus-6 androids in a radioactive, dying post-war San Francisco.",
          why: "The foundational masterpiece that birthed the Blade Runner universe and its core inquiry into empathy as the human definition."
        },
        {
          title: "Neuromancer",
          year: "1984",
          type: "Book",
          creator: "William Gibson",
          emoji: "🕶️",
          posterUrl: "https://covers.openlibrary.org/b/id/8302196-L.jpg",
          tags: ["Cyberspace Matrix", "High Tech Low Life", "AI Sentience"],
          synopsis: "A washed-up computer hacker is hired by a mysterious employer to pull off the ultimate digital heist targeting powerful rogue AIs.",
          why: "The seminal cyberpunk novel that established the neon, rain-drenched aesthetic and towering corporate monopolies."
        },
        {
          title: "Klara and the Sun",
          year: "2021",
          type: "Book",
          creator: "Kazuo Ishiguro",
          emoji: "☀️",
          posterUrl: "https://covers.openlibrary.org/b/id/10543666-L.jpg",
          tags: ["Artificial Friend", "Nobel Laureate", "Poignant Observation"],
          synopsis: "Klara, an Artificial Friend with outstanding observational ability, watches the behavior of humans who come in to browse the store.",
          why: "Offers a deeply poignant, tender perspective on an artificial companion's devotion, echoing Joi's tragic sacrifice in 2049."
        }
      ]
    }
  },

  "1984": {
    id: "1984",
    title: "1984",
    type: "Book",
    year: "1949",
    creator: "George Orwell",
    emoji: "👁",
    posterUrl: "https://covers.openlibrary.org/b/id/8575742-L.jpg",
    tags: ["Totalitarianism", "Surveillance State", "Newspeak", "Psychological Manipulation"],
    synopsis: "Winston Smith lives in a society where Big Brother watches every move, history is rewritten daily, and independent thought is punishable by death.",
    recommendations: {
      movies: [
        {
          title: "Children of Men",
          year: "2006",
          type: "Movie",
          creator: "Alfonso Cuarón",
          emoji: "🌫️",
          posterUrl: "https://image.tmdb.org/t/p/w500/k9gC8wE4z8wY1o5k2j9QfP9M4i2.jpg",
          tags: ["Dystopian Britain", "Police State", "Flicker of Hope"],
          synopsis: "In 2027, in a chaotic world in which women have somehow become infertile, a former activist agrees to help transport a miraculously pregnant woman.",
          why: "Captures the gritty, hopeless atmosphere of a surveillance police state where civil liberties have vanished."
        },
        {
          title: "V for Vendetta",
          year: "2005",
          type: "Movie",
          creator: "James McTeigue",
          emoji: "🎭",
          posterUrl: "https://image.tmdb.org/t/p/w500/10kG8m9QfP9M4i2k5h8Qp6uK8.jpg",
          tags: ["Anti-Fascist Revolt", "State Propaganda", "Symbol of Resistance"],
          synopsis: "In a futuristic, tyrannical Britain, a shadowy freedom fighter known only as 'V' uses terrorist tactics to fight the oppressive regime.",
          why: "Direct modern spiritual continuation of Orwellian Britain, fighting state television news propaganda and curfews."
        },
        {
          title: "Brazil",
          year: "1985",
          type: "Movie",
          creator: "Terry Gilliam",
          emoji: "🏢",
          posterUrl: "https://image.tmdb.org/t/p/w500/3w8PqV4q8O3K2gP1h5g9k.jpg",
          tags: ["Absurdist Bureaucracy", "Dystopia", "Escapist Fantasy"],
          synopsis: "A daydreaming bureaucrat in a retro-future world becomes an enemy of the state while trying to correct a clerical error.",
          why: "A satirical, surreal take on 1984's Ministries of Truth and Information, filled with duct-taped surveillance and stifling paper trails."
        }
      ],
      tv: [
        {
          title: "Severance",
          year: "2022",
          type: "TV Show",
          creator: "Dan Erickson",
          emoji: "🏢",
          posterUrl: "https://image.tmdb.org/t/p/w500/jEgdYp4pX7l4W6fV3E5dE6f7uX.jpg",
          tags: ["Micro-Management", "Thought Control", "Rebellion"],
          synopsis: "Office workers subjected to mind splitting uncover terrifying secrets about the omnipotent Lumon regime.",
          why: "A corporate translation of Orwellian dogma, where slogans are worshipped and cameras monitor every deviation in posture."
        },
        {
          title: "The Handmaid's Tale",
          year: "2017",
          type: "TV Show",
          creator: "Bruce Miller",
          emoji: "🔴",
          posterUrl: "https://image.tmdb.org/t/p/w500/8kK9m8QfP9M4i2k5h8Qp6uK8.jpg",
          tags: ["Theocratic Dictatorship", "Erasure of Rights", "Resistance"],
          synopsis: "Set in a dystopian future, a woman is forced to live as a concubine under a fundamentalist theocratic dictatorship.",
          why: "Examines state-mandated suppression of language, identity, and personal history in chilling, intimate detail."
        },
        {
          title: "Black Mirror (Selected)",
          year: "2011",
          type: "TV Show",
          creator: "Charlie Brooker",
          emoji: "📱",
          posterUrl: "https://image.tmdb.org/t/p/w500/77R0a6L6x2Z8l9QfP9M4i2.jpg",
          tags: ["Digital Panopticon", "Social Credit", "Technological Coercion"],
          synopsis: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
          why: "Episodes like 'Nosedive' and 'Fifteen Million Merits' modernise 1984's telescreens into smartphones and social rating systems."
        }
      ],
      books: [
        {
          title: "Brave New World",
          year: "1932",
          type: "Book",
          creator: "Aldous Huxley",
          emoji: "💊",
          posterUrl: "https://covers.openlibrary.org/b/id/8758814-L.jpg",
          tags: ["Hedonistic Control", "Genetic Castes", "Subtle Tyranny"],
          synopsis: "A future society where people are genetically engineered, conditioned to conform, and kept docile with pleasure and drugs.",
          why: "The classic ideological counterpart to 1984: while Orwell feared we'd be controlled by pain, Huxley feared we'd be controlled by pleasure."
        },
        {
          title: "Fahrenheit 451",
          year: "1953",
          type: "Book",
          creator: "Ray Bradbury",
          emoji: "🔥",
          posterUrl: "https://covers.openlibrary.org/b/id/8226191-L.jpg",
          tags: ["Book Burning", "Censorship", "Numbed Populace"],
          synopsis: "In a future where books are outlawed, a 'fireman' whose job is to burn any remaining literature begins to question his orders.",
          why: "Shares Orwell's urgency regarding the annihilation of independent thought, critical history, and literature."
        },
        {
          title: "We",
          year: "1924",
          type: "Book",
          creator: "Yevgeny Zamyatin",
          emoji: "🔷",
          posterUrl: "https://covers.openlibrary.org/b/id/8231512-L.jpg",
          tags: ["Glass City", "The One State", "Original Dystopia"],
          synopsis: "In a city made entirely of glass where citizens are known only by numbers, a spacecraft builder falls in love and rediscovers his soul.",
          why: "The Russian masterpiece that directly inspired George Orwell to write 1984."
        }
      ]
    }
  },

  tropicthunder: {
    id: "tropicthunder",
    title: "Tropic Thunder",
    type: "Movie",
    year: "2008",
    creator: "Ben Stiller",
    emoji: "🎬",
    posterUrl: "https://image.tmdb.org/t/p/w500/zAurB9mN0BmwqlqNyV5e92vQp9g.jpg",
    tags: ["Hollywood Satire", "Action Parody", "Meta-Cinema", "Absurdist Comedy", "Method Acting"],
    synopsis: "While shooting a big-budget Vietnam War epic, a group of self-absorbed actors are dropped into the real jungle by their frustrated director, completely unaware they are facing real heroin-producing militia.",
    recommendations: {
      movies: [
        {
          title: "Apocalypse Now",
          year: "1979",
          type: "Movie",
          creator: "Francis Ford Coppola",
          emoji: "🌴",
          posterUrl: "https://image.tmdb.org/t/p/w500/gQB8Y5R6ROV955F0v7rmb8g2N.jpg",
          tags: ["Jungle Madness", "Vietnam War", "Psychological Descent"],
          synopsis: "During the Vietnam War, Captain Willard is sent on a perilous mission upriver into Cambodia to assassinate a renegade officer who has set himself up as a god among a local tribe.",
          why: "The direct cinematic subject of Tropic Thunder's satire, sharing the surreal nightmare of a film production mirroring the madness of the Vietnam jungle."
        },
        {
          title: "The Big Lebowski",
          year: "1998",
          type: "Movie",
          creator: "Joel & Ethan Coen",
          emoji: "🎳",
          posterUrl: "https://image.tmdb.org/t/p/w500/9ba6WnN7bK2e8Wv0h1k9QfP9M4i.jpg",
          tags: ["Absurdist Neo-Noir", "Eccentric Characters", "Mistaken Identity"],
          synopsis: "Ultimate slacker 'The Dude' is mistaken for a multi-millionaire of the same name and enlists his bowling buddies to help navigate a botched ransom exchange.",
          why: "Shares Tropic Thunder's legendary ensemble comedy dynamic, quotable irreverence, and bumbling protagonists in over their heads."
        },
        {
          title: "Bowfinger",
          year: "1999",
          type: "Movie",
          creator: "Frank Oz",
          emoji: "🎥",
          posterUrl: "https://image.tmdb.org/t/p/w500/5m1dGj7bK2e8Wv0h1k9QfP9M4i2.jpg",
          tags: ["Hollywood Satire", "Guerilla Filmmaking", "Ego & Delusion"],
          synopsis: "A down-and-out film producer shoots a low-budget sci-fi movie around a major Hollywood action star without the star's knowledge.",
          why: "A brilliant companion satire on Hollywood egos, desperate producers, and the hilarious absurdity of filmmaking."
        }
      ],
      tv: [
        {
          title: "Silicon Valley",
          year: "2014",
          type: "TV Show",
          creator: "Mike Judge",
          emoji: "💻",
          posterUrl: "https://image.tmdb.org/t/p/w500/40C8wE4z8wY1o5k2j9QfP9M4i2.jpg",
          tags: ["Industry Satire", "Bumbling Group", "Ego Clashes"],
          synopsis: "A group of eccentric software developers struggle to build their tech startup while navigating corporate giants and bizarre billionaires.",
          why: "Captures the sharp, merciless satire of megalomaniacal industry bosses and the chaotic failure-to-success trajectory."
        },
        {
          title: "Barry",
          year: "2018",
          type: "TV Show",
          creator: "Alec Berg, Bill Hader",
          emoji: "🎭",
          posterUrl: "https://image.tmdb.org/t/p/w500/80C8wE4z8wY1o5k2j9QfP9M4i2.jpg",
          tags: ["Hitman Actor", "Acting Class Dynamics", "Dark Satire"],
          synopsis: "A depressed Midwestern hitman travels to Los Angeles for a job and unexpectedly finds an accepting community in a theater acting class.",
          why: "Explores the narcissistic delusion of actors and the clash between real-world lethal violence and theatrical performance."
        },
        {
          title: "Catch-22",
          year: "2019",
          type: "TV Show",
          creator: "George Clooney, Luke Davies",
          emoji: "🛩️",
          posterUrl: "https://image.tmdb.org/t/p/w500/70C8wE4z8wY1o5k2j9QfP9M4i2.jpg",
          tags: ["Military Absurdity", "Satire", "War Bureaucracy"],
          synopsis: "A World War II bombardier is furious because thousands of people he has never met are trying to kill him, but military bureaucracy keeps him trapped in combat.",
          why: "Shares the biting satire of wartime insanity, irrational military commanders, and self-preservation amidst combat."
        }
      ],
      books: [
        {
          title: "Catch-22",
          year: "1961",
          type: "Book",
          creator: "Joseph Heller",
          emoji: "📖",
          posterUrl: "https://covers.openlibrary.org/b/id/8235451-L.jpg",
          tags: ["Absurdist Satire", "Military Bureaucracy", "Dark Comedy"],
          synopsis: "Set in Italy during World War II, Captain John Yossarian struggles to maintain his sanity while fulfilling endless, absurd combat missions.",
          why: "The literary fountainhead of anti-war satire, ridiculing military self-importance, incompetence, and cynical exploitation of conflict."
        },
        {
          title: "Dispatches",
          year: "1977",
          type: "Book",
          creator: "Michael Herr",
          emoji: "📝",
          posterUrl: "https://covers.openlibrary.org/b/id/8231512-L.jpg",
          tags: ["Vietnam War", "New Journalism", "Visceral Conflict"],
          synopsis: "War correspondent Michael Herr's visceral chronicle of the soldiers, sounds, and psychological landscape of the Vietnam War.",
          why: "Herr co-wrote Apocalypse Now and Full Metal Jacket; his groundbreaking prose is the direct atmosphere referenced by Tropic Thunder."
        },
        {
          title: "Slaughterhouse-Five",
          year: "1969",
          type: "Book",
          creator: "Kurt Vonnegut",
          emoji: "⏳",
          posterUrl: "https://covers.openlibrary.org/b/id/8226191-L.jpg",
          tags: ["Postmodern Satire", "War Trauma", "Unreliable Reality"],
          synopsis: "Billy Pilgrim experiences his life out of sequence, from the firebombing of Dresden to his captivity in an extraterrestrial zoo.",
          why: "Blends dark humor, absurdity, and trauma to strip romanticized heroism away from the brutal reality of warfare."
        }
      ]
    }
  }
};

// Aliases mapping for flexible query matches
const aliases = {
  "interstellar": "interstellar",
  "dune": "dune",
  "dune 2": "dune",
  "dune part two": "dune",
  "dark": "dark",
  "severance": "severance",
  "the martian": "themartian",
  "martian": "themartian",
  "blade runner": "bladerunner2049",
  "blade runner 2049": "bladerunner2049",
  "1984": "1984",
  "nineteen eighty-four": "1984",
  "nineteen eighty four": "1984",
  "tropic thunder": "tropicthunder",
  "tropicthunder": "tropicthunder",
  "mother nature": "tropicthunder",
  "mother nature just pissed her pantsuit": "tropicthunder"
};

// DOM Elements
const homeSection = document.getElementById("homeSection");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const suggestionsDropdown = document.getElementById("suggestionsDropdown");
const resultsSearchWrapper = document.getElementById("resultsSearchWrapper");
const compactSearchForm = document.getElementById("compactSearchForm");
const compactSearchInput = document.getElementById("compactSearchInput");
const versionsMenuWrapper = document.getElementById("versionsMenuWrapper");
const versionsToggleBtn = document.getElementById("versionsToggleBtn");
const versionsBtnText = document.getElementById("versionsBtnText");
const versionsDropdown = document.getElementById("versionsDropdown");
const versionsList = document.getElementById("versionsList");

const searchLoading = document.getElementById("searchLoading");
const searchEmptyState = document.getElementById("searchEmptyState");
const emptyDesc = document.getElementById("emptyDesc");

const results = document.getElementById("results");
const selectedTitle = document.getElementById("selectedTitle");
const moviesCount = document.getElementById("moviesCount");
const tvCount = document.getElementById("tvCount");
const booksCount = document.getElementById("booksCount");

const details = document.getElementById("details");
const detailsContent = document.getElementById("detailsContent");
const backButton = document.getElementById("backButton");
const navLogo = document.getElementById("navLogo");

// Normalize key
function normalizeKey(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Search matching logic fallback
function findData(query) {
  if (!query) return null;
  const rawKey = query.trim().toLowerCase();
  
  // 1. Direct alias check
  if (aliases[rawKey]) {
    return demoData[aliases[rawKey]];
  }

  // 2. Normalized key check
  const norm = normalizeKey(query);
  if (demoData[norm]) {
    return demoData[norm];
  }

  // 3. Substring match in keys or titles
  for (const key of Object.keys(demoData)) {
    const item = demoData[key];
    if (item.title.toLowerCase().includes(rawKey) || rawKey.includes(item.title.toLowerCase())) {
      return item;
    }
  }

  return null;
}

// Generate type badge class
function getTypeClass(type) {
  if (type === "Movie") return "movie";
  if (type === "TV Show") return "tv";
  if (type === "Book") return "book";
  return "";
}

// Show/Hide Loading Indicator
function showLoading(show = true) {
  if (!searchLoading) return;
  if (show) {
    searchLoading.classList.remove("hidden");
    if (searchEmptyState) searchEmptyState.classList.add("hidden");
  } else {
    searchLoading.classList.add("hidden");
  }
}

// Show Refined In-Page Empty State (No Technical Errors, No Alerts)
function showEmptyState(query) {
  if (!searchEmptyState) return;
  if (emptyDesc) {
    emptyDesc.textContent = `We couldn't find any matches across cinema, television, or literature for "${query}". Try checking the spelling or exploring another title.`;
  }
  searchEmptyState.classList.remove("hidden");
  if (searchLoading) searchLoading.classList.add("hidden");
}

// Show Selected Title Hero Banner
function showSelected(data) {
  const typeClass = getTypeClass(data.type);
  const tagsHtml = (data.tags || []).map(tag => `<span class="theme-tag">${tag}</span>`).join("");
  const posterHtml = data.posterUrl 
    ? `<img src="${data.posterUrl}" alt="${data.title}" class="poster-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="poster-box" style="display:none;"><div class="poster-text">${data.title}</div></div>`
    : `<div class="poster-box"><div class="poster-text">${data.title}</div></div>`;

  const isWiki = data.source === "wikipedia" || String(data.id || "").startsWith("wiki_");
  const isTmdb = data.source === "tmdb" || String(data.id || "").startsWith("tmdb_");
  const isOl = data.source === "openlibrary" || String(data.id || "").startsWith("ol_");

  const sourceBadgeHtml = isWiki 
    ? `<span class="source-badge wiki-badge">Source: Wikipedia</span>`
    : isTmdb
    ? `<span class="source-badge tmdb-badge">TMDb</span>`
    : isOl
    ? `<span class="source-badge ol-badge">Open Library</span>`
    : "";

  const wikiFallbackNotice = isWiki
    ? `<div class="fallback-source-note"><span>✦ Reference information retrieved via Wikipedia official API</span></div>`
    : "";

  selectedTitle.innerHTML = `
    <div class="poster-container-wrap">
      ${posterHtml}
    </div>
    <div class="selected-info">
      <div class="meta-badges">
        <span class="type-pill ${typeClass}">${data.type || "Reference"}</span>
        <span class="year-pill">${data.year || "N/A"}</span>
        ${data.creator ? `<span class="year-pill">· ${data.creator}</span>` : ""}
        ${sourceBadgeHtml}
      </div>
      <h1>${data.title}</h1>
      <p class="selected-synopsis">${data.synopsis}</p>
      <div class="theme-tags">${tagsHtml}</div>
      ${wikiFallbackNotice}
    </div>
  `;
}

// Render Category Cards
function renderCards(items, elementId) {
  const container = document.getElementById(elementId);
  if (!container || !items) return;

  container.innerHTML = items.map((item, index) => {
    const typeClass = getTypeClass(item.type);
    const categoryIcon = item.type === "Book" ? "📖" : item.type === "TV Show" ? "📺" : "🎬";
    const posterContent = item.posterUrl
      ? `<img src="${item.posterUrl}" alt="${item.title}" class="card-poster-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="card-fallback-poster" style="display:none;"><span class="card-fallback-icon">${categoryIcon}</span><div class="card-poster-title">${item.title}</div>${item.creator ? `<span class="card-fallback-creator">${item.creator}</span>` : ""}</div>`
      : `<div class="card-fallback-poster"><span class="card-fallback-icon">${categoryIcon}</span><div class="card-poster-title">${item.title}</div>${item.creator ? `<span class="card-fallback-creator">${item.creator}</span>` : ""}</div>`;

    const whyText = item.why || item.synopsis || "Cross-media thematic parallel.";

    return `
      <article class="card" data-category="${elementId}" data-index="${index}" tabindex="0" role="button" aria-label="View details for ${item.title}">
        <div class="card-poster">
          <span class="card-type-tag ${typeClass}">${item.type}</span>
          ${posterContent}
        </div>
        <div class="card-body">
          <div class="card-header-row">
            <h4>${item.title}</h4>
            <span class="card-year">${item.year}</span>
          </div>
          <div class="card-why-preview">
            <strong>${item.whyBullets && item.whyBullets.length > 0 ? 'Why it connects:' : 'Thematic connection:'}</strong> ${whyText.length > 115 ? whyText.substring(0, 110) + '...' : whyText}
          </div>
          <div class="card-footer-cta">
            <span>Explore Story DNA</span>
            <span>→</span>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Attach click & keyboard events
  container.querySelectorAll(".card").forEach(card => {
    const clickHandler = () => {
      const item = items[Number(card.dataset.index)];
      showDetails(item);
    };

    card.addEventListener("click", clickHandler);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        clickHandler();
      }
    });
  });
}

// Generate External Information Links (strictly discovery / encyclopedic only)
function generateExternalLinks(item) {
  const titleEnc = encodeURIComponent(item.title);
  const titleYearEnc = encodeURIComponent(`${item.title} ${item.year}`);
  const links = [];

  if (item.source === "wikipedia" || item.externalUrl?.includes("wikipedia.org")) {
    links.push({ name: "Wikipedia Article", url: item.externalUrl || `https://en.wikipedia.org/wiki/${titleEnc}` });
    links.push({ name: "IMDb Lookup", url: `https://www.imdb.com/find/?q=${titleYearEnc}` });
  } else if (item.type === "Movie") {
    links.push({ name: "IMDb", url: `https://www.imdb.com/find/?q=${titleYearEnc}` });
    links.push({ name: "Letterboxd", url: `https://letterboxd.com/search/${titleEnc}/` });
    links.push({ name: "Wikipedia", url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(item.title + " film")}` });
  } else if (item.type === "TV Show") {
    links.push({ name: "IMDb", url: `https://www.imdb.com/find/?q=${encodeURIComponent(item.title + " TV series")}` });
    links.push({ name: "TMDb", url: `https://www.themoviedb.org/search/tv?query=${titleEnc}` });
    links.push({ name: "Wikipedia", url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(item.title + " TV series")}` });
  } else if (item.type === "Book") {
    links.push({ name: "Open Library", url: item.externalUrl || `https://openlibrary.org/search?q=${titleEnc}` });
    links.push({ name: "Google Books", url: `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(item.title + " " + (item.creator || "novel"))}` });
    links.push({ name: "Wikipedia", url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(item.title + " novel")}` });
  } else {
    links.push({ name: "Wikipedia", url: item.externalUrl || `https://en.wikipedia.org/wiki/Special:Search?search=${titleEnc}` });
  }

  return links.map(link => `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="info-link" title="Reference ${item.title} on ${link.name}">
      <span>${link.name}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
  `).join("");
}

// Show Full Details View
function showDetails(item) {
  const typeClass = getTypeClass(item.type);
  const tagsHtml = (item.tags || []).map(tag => `<span class="highlight-pill">${tag}</span>`).join("");
  const linksHtml = generateExternalLinks(item);
  const posterContent = item.posterUrl 
    ? `<img src="${item.posterUrl}" alt="${item.title}" class="detail-poster-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="detail-poster-wrap" style="display:none;"><div class="detail-poster-title">${item.title}</div></div>`
    : `<div class="detail-poster-wrap"><div class="detail-poster-title">${item.title}</div></div>`;

  const isWiki = item.source === "wikipedia" || String(item.id || "").startsWith("wiki_");
  const isTmdb = item.source === "tmdb" || String(item.id || "").startsWith("tmdb_");
  const isOl = item.source === "openlibrary" || String(item.id || "").startsWith("ol_");

  const sourceBadgeHtml = isWiki 
    ? `<span class="source-badge wiki-badge">Source: Wikipedia</span>`
    : isTmdb
    ? `<span class="source-badge tmdb-badge">TMDb</span>`
    : isOl
    ? `<span class="source-badge ol-badge">Open Library</span>`
    : "";

  detailsContent.innerHTML = `
    <div class="detail-panel">
      <div class="detail-header-layout">
        <div class="detail-poster-container">
          ${posterContent}
        </div>

        <div class="detail-main-info">
          <div class="meta-badges">
            <span class="type-pill ${typeClass}">${item.type || "Reference"}</span>
            <span class="year-pill">${item.year || "N/A"}</span>
            ${item.creator ? `<span class="year-pill">· ${item.creator}</span>` : ""}
            ${sourceBadgeHtml}
          </div>
          <h1 class="detail-title">${item.title}</h1>
          <div class="detail-synopsis-box">
            <h4>Synopsis</h4>
            <p>${item.synopsis || "A captivating story connected across narrative themes and character journeys."}</p>
          </div>
        </div>
      </div>

      ${item.why || (item.whyBullets && item.whyBullets.length > 0) ? `
      <!-- Connection DNA Section -->
      <div class="why-box">
        <div class="why-header">
          <span class="why-icon">✦</span>
          <h3>Why Recommended</h3>
        </div>
        ${item.whyBullets && item.whyBullets.length > 0 ? `
          <ul class="why-bullets-list" style="margin: 0.75rem 0; padding-left: 1.25rem; line-height: 1.6; color: var(--text-secondary);">
            ${item.whyBullets.map(b => `<li style="margin-bottom: 0.35rem;">${b}</li>`).join("")}
          </ul>
        ` : `<p class="why-content">${item.why}</p>`}
        ${tagsHtml ? `<div class="thematic-highlights">${tagsHtml}</div>` : ""}
      </div>
      ` : ""}

      <!-- External Info & Discovery Links -->
      <div class="links-section">
        <div class="links-title">External Encyclopedic Reference</div>
        <div class="links-container">
          ${linksHtml}
        </div>
      </div>
    </div>
  `;

  results.classList.add("hidden");
  details.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Apply Search Result to UI (Cross-Media 3-Category Showcase)
function applySearchResult(data) {
  if (!data) return;

  // 1. Populate Selected Source Title
  showSelected(data);

  // 2. Populate 3 Media Category Grids
  if (data.recommendations) {
    renderCards(data.recommendations.movies || [], "movies");
    renderCards(data.recommendations.tv || [], "tv");
    renderCards(data.recommendations.books || [], "books");

    if (moviesCount) moviesCount.textContent = `${(data.recommendations.movies || []).length} titles`;
    if (tvCount) tvCount.textContent = `${(data.recommendations.tv || []).length} titles`;
    if (booksCount) booksCount.textContent = `${(data.recommendations.books || []).length} titles`;
  }

  // 3. Update Adaptations & Same-Name Versions Disambiguation Menu
  updateVersionsMenu(data);

  // 4. Update view visibility
  document.body.classList.add("in-results");
  homeSection.classList.add("hidden");
  resultsSearchWrapper.classList.remove("hidden");
  results.classList.remove("hidden");
  details.classList.add("hidden");
  if (searchLoading) searchLoading.classList.add("hidden");
  if (searchEmptyState) searchEmptyState.classList.add("hidden");

  // Keep search inputs synchronized
  if (compactSearchInput) compactSearchInput.value = data.title;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Reset view to Home landing page
function resetToHome() {
  document.body.classList.remove("in-results");
  homeSection.classList.remove("hidden");
  resultsSearchWrapper.classList.add("hidden");
  results.classList.add("hidden");
  details.classList.add("hidden");
  if (searchLoading) searchLoading.classList.add("hidden");
  if (searchEmptyState) searchEmptyState.classList.add("hidden");

  if (versionsToggleBtn) {
    versionsToggleBtn.classList.add("hidden");
    versionsToggleBtn.classList.remove("active");
    versionsToggleBtn.setAttribute("aria-expanded", "false");
  }
  if (versionsDropdown) versionsDropdown.classList.add("hidden");

  if (searchInput) {
    searchInput.value = "";
    searchInput.focus();
  }
  if (compactSearchInput) compactSearchInput.value = "";
  if (clearBtn) clearBtn.classList.add("hidden");
  if (suggestionsDropdown) suggestionsDropdown.classList.add("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update Same-Name / Adaptations Disambiguation Dropdown
async function updateVersionsMenu(currentData) {
  if (!versionsToggleBtn || !versionsDropdown || !versionsList) return;

  // Reset dropdown visibility
  versionsDropdown.classList.add("hidden");
  versionsToggleBtn.classList.remove("active");
  versionsToggleBtn.setAttribute("aria-expanded", "false");

  let entities = currentData.matchedEntities || [];

  // If matchedEntities wasn't available or had <= 1 item, query the live entity search API
  if (!entities || entities.length <= 1) {
    try {
      const res = await fetch(`/api/entities/search?q=${encodeURIComponent(currentData.title)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.entities && json.entities.length > 0) {
          entities = json.entities;
        }
      }
    } catch (e) {
      // Offline fallback
    }
  }

  // De-duplicate candidates by Title, Type, and Year
  const uniqueEntities = [];
  const seen = new Set();

  for (const entity of entities) {
    const normTitle = (entity.title || "").toLowerCase().trim();
    const normType = (entity.type || entity.media_type || "").toLowerCase();
    const normYear = String(entity.year || "");
    const key = `${normTitle}__${normType}__${normYear}`;

    if (!seen.has(key)) {
      seen.add(key);
      uniqueEntities.push(entity);
    }
  }

  // If there are no other versions/adaptations, hide the toggle button
  if (uniqueEntities.length <= 1) {
    versionsToggleBtn.classList.add("hidden");
    return;
  }

  // Show toggle button and update count badge
  versionsToggleBtn.classList.remove("hidden");
  if (versionsBtnText) {
    versionsBtnText.textContent = `Other Matches (${uniqueEntities.length - 1})`;
  }

  // Render versions list
  versionsList.innerHTML = uniqueEntities.map((entity, idx) => {
    const isCurrent = (currentData.id && entity.id === currentData.id) ||
      (currentData.title.toLowerCase() === entity.title.toLowerCase() &&
       (currentData.type === entity.type || currentData.media_type === entity.media_type) &&
       (String(currentData.year) === String(entity.year) || !currentData.year || entity.year === "N/A"));

    const typeClass = getTypeClass(entity.type);
    const categoryIcon = entity.type === "Book" ? "📖" : entity.type === "TV Show" ? "📺" : entity.type === "Movie" ? "🎬" : "✧";
    const creatorText = entity.creator ? `<span class="version-creator">· ${entity.creator}</span>` : "";
    const sourceTag = entity.source === "wikipedia" ? " · Wikipedia" : "";

    const thumbHtml = entity.posterUrl
      ? `<img src="${entity.posterUrl}" alt="${entity.title}" class="version-thumb-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><span class="version-thumb-icon" style="display:none;">${categoryIcon}</span>`
      : `<span class="version-thumb-icon">${categoryIcon}</span>`;

    return `
      <div class="version-item ${isCurrent ? 'current-active' : ''}" data-idx="${idx}" role="button" tabindex="0" aria-label="Switch to ${entity.title} (${entity.year || 'N/A'}, ${entity.type || 'Work'})">
        <div class="version-thumb-wrap">
          ${thumbHtml}
        </div>
        <div class="version-info">
          <div class="version-title-row">
            <span class="version-title">${entity.title}</span>
            <span class="version-year">${entity.year !== "N/A" ? entity.year : ""}</span>
          </div>
          <div class="version-meta-row">
            <span class="version-type-tag ${typeClass}">${entity.type || "Work"}</span>
            ${creatorText}
            ${sourceTag}
            ${isCurrent ? '<span style="color:var(--accent); font-weight:600; margin-left:auto; font-size:0.7rem; letter-spacing:0.04em;">CURRENT</span>' : ''}
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Attach click & keyboard listeners to switch works
  versionsList.querySelectorAll(".version-item").forEach(itemEl => {
    itemEl.addEventListener("click", () => {
      const idx = Number(itemEl.dataset.idx);
      const chosen = uniqueEntities[idx];
      if (chosen) {
        versionsDropdown.classList.add("hidden");
        versionsToggleBtn.classList.remove("active");
        versionsToggleBtn.setAttribute("aria-expanded", "false");
        executeSearch(chosen);
      }
    });

    itemEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        itemEl.click();
      }
    });
  });
}

// Autocomplete & Entity Disambiguation suggestions builder
let autocompleteTimer = null;

async function handleAutocomplete(inputVal) {
  const query = inputVal.trim();
  if (!query) {
    suggestionsDropdown.classList.add("hidden");
    return;
  }

  clearTimeout(autocompleteTimer);
  autocompleteTimer = setTimeout(async () => {
    let matches = [];

    // 1. Live Entity Search API (Real-time TMDb + Open Library)
    try {
      const res = await fetch(`/api/entities/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.entities && data.entities.length > 0) {
          matches = data.entities;
        }
      }
    } catch (e) {
      // Offline fallback
    }

    // Fallback: match against demo dataset if server offline
    if (matches.length === 0) {
      const qLower = query.toLowerCase();
      matches = Object.values(demoData).filter(item => 
        item.title.toLowerCase().includes(qLower) ||
        item.type.toLowerCase().includes(qLower) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(qLower)))
      );
    }

    if (matches.length === 0) {
      suggestionsDropdown.classList.add("hidden");
      return;
    }

    suggestionsDropdown.innerHTML = matches.slice(0, 7).map((item, idx) => {
      const typeLabel = item.type === "TV Show" ? "Television" : item.type === "Book" ? "Literature" : item.type === "Movie" ? "Cinema" : "Reference";
      const sourceTag = item.source === "wikipedia" ? " [Wikipedia]" : "";
      const creatorText = item.creator ? ` · ${item.creator}` : "";
      return `
        <div class="suggestion-item" data-idx="${idx}">
          <div class="suggestion-title">
            <span>${item.title}</span>
          </div>
          <span class="suggestion-meta">${item.year !== "N/A" ? item.year + " · " : ""}${typeLabel}${creatorText}${sourceTag}</span>
        </div>
      `;
    }).join("");

    suggestionsDropdown.classList.remove("hidden");

    suggestionsDropdown.querySelectorAll(".suggestion-item").forEach(itemEl => {
      itemEl.addEventListener("click", () => {
        const idx = Number(itemEl.dataset.idx);
        const selectedEntity = matches[idx];
        searchInput.value = selectedEntity.title;
        suggestionsDropdown.classList.add("hidden");
        executeSearch(selectedEntity);
      });
    });
  }, 180);
}

// Perform Search Operation (Real-time Live Discovery across Cinema, Television & Literature)
async function executeSearch(queryOrEntity) {
  if (!queryOrEntity) return;

  const rawQuery = typeof queryOrEntity === "string" ? queryOrEntity.trim() : (queryOrEntity.id || queryOrEntity.title);
  if (!rawQuery) return;

  const directEntity = typeof queryOrEntity === "object" ? queryOrEntity : null;

  // Hide suggestions and show loading state
  if (suggestionsDropdown) suggestionsDropdown.classList.add("hidden");
  showLoading(true);

  try {
    // 1. Check direct curated demo cache if matching exactly
    if (typeof queryOrEntity === "string") {
      const demoMatch = findData(rawQuery);
      if (demoMatch) {
        showLoading(false);
        applySearchResult(demoMatch);
        return;
      }
    } else if (directEntity && demoData[normalizeKey(directEntity.title)]) {
      showLoading(false);
      applySearchResult(demoData[normalizeKey(directEntity.title)]);
      return;
    }

    // 2. Query Live Cross-Media Engine
    const endpoint = directEntity?.id 
      ? `/api/cross-media/recommend?q=${encodeURIComponent(directEntity.id)}`
      : `/api/cross-media/recommend?q=${encodeURIComponent(rawQuery)}`;

    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      if (data.source && data.recommendations) {
        showLoading(false);
        applySearchResult({
          id: data.source.id,
          title: data.source.title,
          type: data.source.type,
          year: data.source.year,
          creator: data.source.creator,
          synopsis: data.source.synopsis,
          posterUrl: data.source.posterUrl,
          tags: data.source.tags,
          recommendations: data.recommendations,
          matchedEntities: data.matchedEntities || []
        });
        return;
      }
    }
  } catch (err) {
    console.warn("Live API Search issue:", err);
  }

  // 3. Fallback to local demo dataset if available
  const fallback = findData(rawQuery);
  showLoading(false);

  if (fallback) {
    applySearchResult(fallback);
  } else {
    showEmptyState(typeof queryOrEntity === "string" ? queryOrEntity : queryOrEntity.title);
  }
}

// Event Listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  executeSearch(searchInput.value);
});

compactSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  executeSearch(compactSearchInput.value);
});

searchInput.addEventListener("input", (e) => {
  const val = e.target.value;
  if (val) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }
  handleAutocomplete(val);
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.classList.add("hidden");
  suggestionsDropdown.classList.add("hidden");
  if (searchEmptyState) searchEmptyState.classList.add("hidden");
  if (searchLoading) searchLoading.classList.add("hidden");
  searchInput.focus();
});

// Close autocomplete on click outside
document.addEventListener("click", (e) => {
  if (!searchForm.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
    suggestionsDropdown.classList.add("hidden");
  }
});

// Versions Dropdown Toggle & Click Outside Handling
if (versionsToggleBtn && versionsDropdown && versionsMenuWrapper) {
  versionsToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isClosed = versionsDropdown.classList.contains("hidden");
    if (isClosed) {
      versionsDropdown.classList.remove("hidden");
      versionsToggleBtn.classList.add("active");
      versionsToggleBtn.setAttribute("aria-expanded", "true");
    } else {
      versionsDropdown.classList.add("hidden");
      versionsToggleBtn.classList.remove("active");
      versionsToggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (e) => {
    if (!versionsMenuWrapper.contains(e.target)) {
      versionsDropdown.classList.add("hidden");
      versionsToggleBtn.classList.remove("active");
      versionsToggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !versionsDropdown.classList.contains("hidden")) {
      versionsDropdown.classList.add("hidden");
      versionsToggleBtn.classList.remove("active");
      versionsToggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// Back Button
backButton.addEventListener("click", () => {
  details.classList.add("hidden");
  results.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Logo Reset Button
if (navLogo) {
  navLogo.addEventListener("click", (e) => {
    e.preventDefault();
    resetToHome();
  });
}

// Hero Quote Box ("Mother Nature just pissed her pantsuit" -> Tropic Thunder)
const heroQuoteBox = document.getElementById("heroQuoteBox");
if (heroQuoteBox) {
  const openTropicThunder = () => {
    executeSearch("tropicthunder");
  };
  heroQuoteBox.addEventListener("click", openTropicThunder);
  heroQuoteBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openTropicThunder();
    }
  });
}



