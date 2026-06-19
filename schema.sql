-- Esquema do Bolão do Lobo PostgreSQL
-- O server.js cria essas tabelas automaticamente.

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  initial_points INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL,
  kickoff TIMESTAMPTZ NOT NULL,
  group_name TEXT NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  result TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS guesses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  guess TEXT NOT NULL,
  doubled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);
