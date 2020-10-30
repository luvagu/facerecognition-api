BEGIN TRANSACTION;

-- TRUNCATE TABLE users;
-- TRUNCATE TABLE login;

INSERT INTO users (name, email, entries, joined)
VALUES('Luis', 'luiavag@gmail.com', 0, '2020-08-16 12:20:06.723');

INSERT INTO login (hash, email)
VALUES('$2a$10$4VyIzgkn6KMdq.X4xIUfq.MBWiOrYuJwL0r91EAAS2mepL5hFqkba', 'luiavag@gmail.com');

COMMIT;