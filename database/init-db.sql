DROP TABLE IF EXISTS mangas;

CREATE TABLE mangas (
    title VARCHAR(255) PRIMARY KEY,
    status VARCHAR(255),
    imageURL VARCHAR(255)
);

INSERT INTO mangas VALUES ('One Piece', 'completed', NULL);
INSERT INTO mangas VALUES ('Naruto', 'unfinished', NULL);
INSERT INTO mangas VALUES ('Bleach', 'planned', NULL);