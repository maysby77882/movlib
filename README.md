# ✦ movlib — Cross-Media Story Discovery

> **Discover stories that resonate across cinema, TV, and literature.**  
> Search any movie, TV series, or book and get connected recommendations across **ALL THREE** categories based on themes, mood, atmosphere, and narrative DNA.

---

## 🌟 Search Sources & Priority Architecture

Movlib implements a multi-tier search hierarchy across entertainment and literary media:

```mermaid
flowchart TD
    A[User Search Query] --> B[/api/search]
    B --> C1[Cinema & Television]
    B --> C2[Literature / Books]
    
    C1 --> D1[PRIMARY: TMDb Multi-Search]
    D1 --> E1{Useful Results?}
    E1 -- Yes --> F1[Return TMDb Verified Records]
    E1 -- No / API Unconfigured --> G1[SECONDARY FALLBACK: Official Wikipedia API]
    G1 --> H1[Normalize & Label as Wikipedia Reference]
    
    C2 --> D2[PRIMARY: Open Library]
    D2 --> E2{Useful Results?}
    E2 -- Yes --> F2[Return Open Library Works]
    E2 -- No --> G2[SECONDARY FALLBACK: Wikipedia / Google Books]
    G2 --> H2[Normalize Book Record]
    
    F1 --> I[Unified Movlib Payload & Story DNA Recommender]
    H1 --> I
    F2 --> I
    H2 --> I
```

### Search Sources

- **Movies & TV Shows (Cinema & Television)**:
  - **Primary**: [The Movie Database (TMDb)](https://developer.themoviedb.org/) (`/search/multi` filtered for movies & TV series).
  - **Secondary Fallback**: Official [Wikimedia / Wikipedia API](https://en.wikipedia.org/w/api.php) (invoked **only** when TMDb produces zero useful results or encounters a connection issue).
- **Books (Literature)**:
  - **Primary**: [Open Library](https://openlibrary.org/) with work-level deduplication.
  - **Secondary Fallback**: Official Wikipedia API / Google Books.

---

## 🚀 Features

* **Strict Search Priority**: Always queries canonical media databases first (TMDb, Open Library) and only invokes Wikipedia when primary providers produce 0 useful matches.
* **Tri-Category Recommendations**: Every search produces recommendations divided cleanly across **🎬 Movies**, **📺 TV Shows**, and **📖 Books**.
* **Deep Thematic Matching**: Matches content using deep story features (e.g. *Time Dilation, AI Consciousness, Totalitarian Panopticon, Desert Nomad Ecology, Generational Grief*) — not just superficial genre tags.
* **Pure Discovery & Information**: Contextual links to **IMDb**, **Letterboxd**, **Wikipedia**, **Google Books**, and **TMDb**. *Strictly no streaming/buy links.*
* **High-Performance In-Memory Caching**: Ultra-low latency query responses (<10ms for cached titles).
* **Zero-Config Persistent Storage**: Works out of the box with file-backed JSON store (`db/movlib_store.json`).

---

## 🛠️ Tech Stack

* **Frontend**: Vanilla JavaScript (ES6+), Modern Semantic HTML5, Responsive CSS (Dark Editorial Theme, Glassmorphism, CSS Grid & Flexbox).
* **Backend**: Node.js, Express.js.
* **External APIs**:
  - [The Movie Database (TMDb) API](https://developer.themoviedb.org/) (Primary Movies/TV)
  - [Open Library](https://openlibrary.org/) (Primary Books)
  - [Official Wikipedia Action & Summary APIs](https://en.wikipedia.org/w/api.php) (Secondary Fallback)
  - [Google Books API](https://developers.google.com/books) (Book Enrichment)
* **Database**: Unified Cross-Media Schema (`db/movlib_store.json`).

---

## 🏁 Quickstart & Installation

### 1. Prerequisites
* [Node.js (v18+)](https://nodejs.org/) installed.

### 2. Clone & Install Dependencies
```bash
npm install
```

### 3. Configure API Keys (Server-Side Only)
Copy the example environment file:
```bash
cp .env.example .env
```
Edit `.env` with your API credentials:
```env
PORT=3000
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_ACCESS_TOKEN=
GOOGLE_BOOKS_API_KEY=
```

> **Security Note**: `TMDB_API_KEY` and `TMDB_ACCESS_TOKEN` are kept strictly server-side and are never exposed in browser JavaScript or public assets. `.env` is gitignored.
> TMDb API keys are free and instant at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api). Open Library and Wikipedia work immediately without a key.

### 4. Start the Application
```bash
npm start
```
Open **`http://localhost:3000`** in your browser.

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/cross-media/recommend?q=...` | `GET` | **Primary discovery endpoint**: Returns source item and Top-3 recommendations across Movies, TV, and Books. |
| `/api/search?q=...` | `GET` | Unified search following TMDb/Open Library primary priority with conditional Wikipedia fallback. |
| `/api/entities/search?q=...` | `GET` | Entity search & disambiguation matching works across TMDb, Open Library, and Wikipedia. |
| `/api/details?type=...&id=...` | `GET` | Full metadata lookup for any movie, TV show, book, or Wikipedia reference. |
| `/api/wikipedia?q=...` | `GET` | Direct Wikipedia search endpoint for fallback lookup and testing. |
| `/api/db/stats` | `GET` | Catalog statistics (count of stored movies, shows, books, and connections). |
| `/api/health` | `GET` | Health check and external provider status. |

---

## 🧪 Testing

Run the automated test suite verifying TMDB-first search priority, Wikipedia fallback, entity classification, and cross-media recommendations:

```bash
node test/test_search_priority.js
```

---

## 📄 License

MIT
