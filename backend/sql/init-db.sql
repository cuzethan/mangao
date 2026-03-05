CREATE TABLE IF NOT EXISTSusers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hashed TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mangas (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT,
    tracking_enabled BOOLEAN NOT NULL,
    mangadex_id TEXT,
    tracked_max_chapters INTEGER NOT NULL,
    last_checked TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS user_manga_ref (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    manga_id INTEGER REFERENCES mangas(id) ON DELETE CASCADE,
    status VARCHAR(255) NOT NULL,
    tracking BOOLEAN NOT NULL,
    cur_chapter INTEGER NOT NULL,
    max_chapters INTEGER NOT NULL,
    manga_checked BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL
);