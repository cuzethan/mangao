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
    imageURL TEXT
);

CREATE TABLE user_manga_ref (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    manga_id INTEGER REFERENCES mangas(id) ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL
);