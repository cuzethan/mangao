DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS mangas;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hashed TEXT NOT NULL
);

CREATE TABLE mangas (
    title VARCHAR(255) PRIMARY KEY NOT NULL,
    status VARCHAR(255) NOT NULL,
    imageURL TEXT
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

INSERT INTO mangas VALUES ('One Piece', 'completed', NULL);
INSERT INTO mangas VALUES ('Naruto', 'planned', NULL);
INSERT INTO mangas VALUES ('Bleach', 'planned', NULL);