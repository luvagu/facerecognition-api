-- Deploy fresh database tables
\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'

-- Dummy data
\i '/docker-entrypoint-initdb.d/seed/seed.sql'