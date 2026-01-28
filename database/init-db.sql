DROP TABLE IF EXISTS mangas;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password_hashed VARCHAR(100) NOT NULL
);

CREATE TABLE mangas (
    title VARCHAR(255) PRIMARY KEY NOT NULL,
    status VARCHAR(255) NOT NULL,
    imageURL TEXT
);

INSERT INTO mangas VALUES ('One Piece', 'completed', NULL);
INSERT INTO mangas VALUES ('Naruto', 'planned', NULL);
INSERT INTO mangas VALUES ('Bleach', 'planned', NULL);