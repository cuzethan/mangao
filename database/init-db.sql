DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS mangas;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_manga_ref;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hashed TEXT NOT NULL
);

CREATE TABLE mangas (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    image_url TEXT,
    max_chapters NUMERIC(10, 1) NOT NULL,
    tracking BOOLEAN NOT NULL,
    mangadex_id TEXT,
    last_checked TIMESTAMP NOT NULL
);

CREATE TABLE user_manga_ref (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    manga_id INTEGER REFERENCES mangas(id) ON DELETE CASCADE,
    cur_chapter INTEGER
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL
);