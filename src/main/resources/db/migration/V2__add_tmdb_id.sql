-- V2: Add tmdb_id to movies table for reliable identity tracking
ALTER TABLE movies ADD COLUMN IF NOT EXISTS tmdb_id BIGINT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_movies_tmdb_id ON movies(tmdb_id);
