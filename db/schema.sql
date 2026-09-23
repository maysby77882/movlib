-- ==============================================================================
-- movlib Unified Cross-Media Schema
-- Works with SQLite (Local dev) and PostgreSQL + pgvector (Production)
-- ==============================================================================

-- 1. Unified Media Items Table
CREATE TABLE IF NOT EXISTS media_items (
    id TEXT PRIMARY KEY,                       -- Unique identifier (e.g. tmdb_movie_157336, gbook_zyTCAlFPjgYC)
    external_id TEXT NOT NULL,                 -- Source ID from TMDb / Google Books / OpenLibrary
    media_type TEXT NOT NULL CHECK(media_type IN ('movie', 'tv', 'book')),
    title TEXT NOT NULL,
    release_year TEXT,
    creator TEXT,                              -- Director / Show Creator / Author
    synopsis TEXT,
    poster_url TEXT,
    backdrop_url TEXT,
    genres TEXT DEFAULT '[]',                  -- JSON array of genres
    tags TEXT DEFAULT '[]',                    -- JSON array of extracted themes, tropes, keywords
    embedding TEXT,                            -- Serialized Float32Array / Vector (for Phase 5)
    raw_metadata TEXT DEFAULT '{}',            -- JSON object containing extra provider payload
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(external_id, media_type)
);

-- 2. Indexes for Fast Retrieval
CREATE INDEX IF NOT EXISTS idx_media_type ON media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_media_title ON media_items(title);
CREATE INDEX IF NOT EXISTS idx_media_external ON media_items(external_id, media_type);

-- 3. Thematic Connections Table (For caching cross-media similarity & recommendations)
CREATE TABLE IF NOT EXISTS media_connections (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    similarity_score REAL DEFAULT 0.0,
    connection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(source_id) REFERENCES media_items(id) ON DELETE CASCADE,
    FOREIGN KEY(target_id) REFERENCES media_items(id) ON DELETE CASCADE,
    UNIQUE(source_id, target_id)
);

CREATE INDEX IF NOT EXISTS idx_conn_source ON media_connections(source_id);
CREATE INDEX IF NOT EXISTS idx_conn_target ON media_connections(target_id);

-- ==============================================================================
-- PostgreSQL + pgvector Production Variant (Reference):
-- ==============================================================================
-- CREATE EXTENSION IF NOT EXISTS vector;
-- CREATE TABLE media_items (
--     id VARCHAR(255) PRIMARY KEY,
--     external_id VARCHAR(255) NOT NULL,
--     media_type VARCHAR(20) NOT NULL CHECK(media_type IN ('movie', 'tv', 'book')),
--     title VARCHAR(500) NOT NULL,
--     release_year VARCHAR(20),
--     creator VARCHAR(255),
--     synopsis TEXT,
--     poster_url TEXT,
--     backdrop_url TEXT,
--     genres JSONB DEFAULT '[]',
--     tags JSONB DEFAULT '[]',
--     embedding vector(768),
--     raw_metadata JSONB DEFAULT '{}',
--     created_at TIMESTAMPTZ DEFAULT NOW(),
--     updated_at TIMESTAMPTZ DEFAULT NOW(),
--     UNIQUE(external_id, media_type)
-- );
-- CREATE INDEX idx_media_embedding ON media_items USING hnsw (embedding vector_cosine_ops);
