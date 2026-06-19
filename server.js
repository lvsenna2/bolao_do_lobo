
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const { Pool } = require("pg");

const app = express();

if (!process.env.DATABASE_URL) {
  console.error("ERRO: configure a variavel DATABASE_URL do PostgreSQL.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "troque-esta-chave-secreta",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: false
  }
}));

app.use(express.static(path.join(__dirname, "public")));

const seedUsers = [[1, "Carlão", "carlao", "123456", "user", 31], [2, "Doutor mikto", "doutormikto", "123456", "user", 30], [3, "rp", "rp", "123456", "user", 27], [4, "Julio", "julio", "123456", "user", 27], [5, "Zé", "ze", "123456", "user", 27], [6, "Luiz Presídio", "luizpresidio", "123456", "user", 27], [7, "LVSENNA", "lvsenna", "123456", "user", 25], [8, "Rafael", "rafael", "123456", "user", 25], [9, "Luiz La black ma", "luizlablackma", "123456", "user", 25], [10, "Matheuzico", "matheuzico", "123456", "user", 22], [11, "H.França", "hfranca", "123456", "user", 22], [12, "Davi", "davi", "123456", "user", 21], [13, "Esquerdo", "esquerdo", "123456", "user", 13], [14, "Obeson", "obeson", "123456", "user", 9], [15, "Guimacê", "guimace", "123456", "user", 9], [16, "Juruna", "juruna", "123456", "user", 3], [99, "Administrador", "admin", "admin123", "admin", 0]];
const seedGames = [[1, "2026-06-11", "2026-06-11T16:00:00-03:00", "A", "México", "África do Sul", "México"], [2, "2026-06-11", "2026-06-11T23:00:00-03:00", "A", "Coreia do Sul", "Tchéquia", "Coreia do Sul"], [3, "2026-06-12", "2026-06-12T16:00:00-03:00", "B", "Canadá", "Bósnia e Herzegovina", "Empate"], [4, "2026-06-12", "2026-06-12T22:00:00-03:00", "D", "Estados Unidos", "Paraguai", "Estados Unidos"], [5, "2026-06-13", "2026-06-13T16:00:00-03:00", "B", "Catar", "Suíça", "Empate"], [6, "2026-06-13", "2026-06-13T19:00:00-03:00", "C", "Brasil", "Marrocos", "Empate"], [7, "2026-06-13", "2026-06-13T22:00:00-03:00", "C", "Haiti", "Escócia", "Escócia"], [8, "2026-06-14", "2026-06-14T01:00:00-03:00", "D", "Austrália", "Turquia", "Austrália"], [9, "2026-06-14", "2026-06-14T14:00:00-03:00", "E", "Alemanha", "Curaçao", "Alemanha"], [10, "2026-06-14", "2026-06-14T17:00:00-03:00", "F", "Holanda", "Japão", "Empate"], [11, "2026-06-14", "2026-06-14T20:00:00-03:00", "E", "Costa do Marfim", "Equador", "Costa do Marfim"], [12, "2026-06-14", "2026-06-14T23:00:00-03:00", "F", "Suécia", "Tunísia", "Suécia"], [13, "2026-06-15", "2026-06-15T13:00:00-03:00", "H", "Espanha", "Cabo Verde", "Empate"], [14, "2026-06-15", "2026-06-15T16:00:00-03:00", "G", "Bélgica", "Egito", "Empate"], [15, "2026-06-15", "2026-06-15T19:00:00-03:00", "H", "Arábia Saudita", "Uruguai", "Empate"], [16, "2026-06-15", "2026-06-15T22:00:00-03:00", "G", "Irã", "Nova Zelândia", "Empate"], [17, "2026-06-16", "2026-06-16T16:00:00-03:00", "I", "França", "Senegal", "França"], [18, "2026-06-16", "2026-06-16T19:00:00-03:00", "I", "Iraque", "Noruega", "Noruega"], [19, "2026-06-16", "2026-06-16T22:00:00-03:00", "J", "Argentina", "Argélia", "Argentina"], [20, "2026-06-17", "2026-06-17T01:00:00-03:00", "J", "Áustria", "Jordânia", "Áustria"], [21, "2026-06-17", "2026-06-17T14:00:00-03:00", "K", "Portugal", "RD Congo", "Empate"], [22, "2026-06-17", "2026-06-17T17:00:00-03:00", "L", "Inglaterra", "Croácia", "Empate"], [23, "2026-06-17", "2026-06-17T20:00:00-03:00", "L", "Gana", "Panamá", "Gana"], [24, "2026-06-17", "2026-06-17T23:00:00-03:00", "K", "Uzbequistão", "Colômbia", "Colômbia"], [25, "2026-06-18", "2026-06-18T13:00:00-03:00", "A", "Tchéquia", "África do Sul", "Empate"], [26, "2026-06-18", "2026-06-18T16:00:00-03:00", "B", "Suíça", "Bósnia e Herzegovina", "Suíça"], [27, "2026-06-18", "2026-06-18T19:00:00-03:00", "B", "Canadá", "Catar", "Canadá"], [28, "2026-06-18", "2026-06-18T22:00:00-03:00", "A", "México", "Coreia do Sul", ""], [29, "2026-06-19", "2026-06-19T16:00:00-03:00", "D", "Estados Unidos", "Austrália", ""], [30, "2026-06-19", "2026-06-19T19:00:00-03:00", "C", "Escócia", "Marrocos", ""], [31, "2026-06-19", "2026-06-19T21:30:00-03:00", "C", "Brasil", "Haiti", ""], [32, "2026-06-20", "2026-06-20T00:00:00-03:00", "D", "Turquia", "Paraguai", ""], [33, "2026-06-20", "2026-06-20T14:00:00-03:00", "F", "Holanda", "Suécia", ""], [34, "2026-06-20", "2026-06-20T17:00:00-03:00", "E", "Alemanha", "Costa do Marfim", ""], [35, "2026-06-20", "2026-06-20T21:00:00-03:00", "E", "Equador", "Curaçao", ""], [36, "2026-06-21", "2026-06-21T01:00:00-03:00", "F", "Tunísia", "Japão", ""], [37, "2026-06-21", "2026-06-21T13:00:00-03:00", "H", "Espanha", "Arábia Saudita", ""], [38, "2026-06-21", "2026-06-21T16:00:00-03:00", "G", "Bélgica", "Irã", ""], [39, "2026-06-21", "2026-06-21T19:00:00-03:00", "H", "Uruguai", "Cabo Verde", ""], [40, "2026-06-21", "2026-06-21T22:00:00-03:00", "G", "Nova Zelândia", "Egito", ""], [41, "2026-06-22", "2026-06-22T14:00:00-03:00", "J", "Argentina", "Áustria", ""], [42, "2026-06-22", "2026-06-22T18:00:00-03:00", "I", "França", "Iraque", ""], [43, "2026-06-22", "2026-06-22T21:00:00-03:00", "I", "Noruega", "Senegal", ""], [44, "2026-06-23", "2026-06-23T00:00:00-03:00", "J", "Jordânia", "Argélia", ""], [45, "2026-06-23", "2026-06-23T14:00:00-03:00", "K", "Portugal", "Uzbequistão", ""], [46, "2026-06-23", "2026-06-23T17:00:00-03:00", "L", "Inglaterra", "Gana", ""], [47, "2026-06-23", "2026-06-23T20:00:00-03:00", "L", "Panamá", "Croácia", ""], [48, "2026-06-23", "2026-06-23T23:00:00-03:00", "K", "Colômbia", "RD Congo", ""]];

async function initDb() {
  await pool.query(`
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
  `);

  for (const u of seedUsers) {
    const [id, name, username, password, role, initialPoints] = u;
    const passwordHash = bcrypt.hashSync(password, 10);

    await pool.query(`
      INSERT INTO users (id, name, username, password_hash, role, initial_points)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        username = EXCLUDED.username,
        role = EXCLUDED.role,
        initial_points = EXCLUDED.initial_points
    `, [id, name, username, passwordHash, role, initialPoints]);
  }

  for (const g of seedGames) {
    const [id, date, kickoff, group, home, away, result] = g;

    await pool.query(`
      INSERT INTO games (id, date, kickoff, group_name, home_team, away_team, result)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        date = EXCLUDED.date,
        kickoff = EXCLUDED.kickoff,
        group_name = EXCLUDED.group_name,
        home_team = EXCLUDED.home_team,
        away_team = EXCLUDED.away_team
    `, [id, date, kickoff, group, home, away, result]);
  }
}

function requireLogin(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: "Nao autenticado" });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso restrito ao ADM" });
  }
  next();
}

function getTodayBR() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const year = parts.find(p => p.type === "year").value;
  const month = parts.find(p => p.type === "month").value;
  const day = parts.find(p => p.type === "day").value;

  return `${year}-${month}-${day}`;
}

function isDateReleased(date) {
  return date === getTodayBR();
}

function isLocked(game) {
  return Date.now() >= new Date(game.kickoff).getTime();
}

function mapGame(g) {
  return {
    id: g.id,
    date: g.date,
    kickoff: g.kickoff,
    group: g.group_name,
    home: g.home_team,
    away: g.away_team,
    result: g.result || "",
    dateReleased: isDateReleased(g.date),
    locked: !isDateReleased(g.date) || isLocked(g),
    lockedByDate: !isDateReleased(g.date),
    lockedByTime: isLocked(g)
  };
}

function calculatePoints(guess, result, game, doubled) {
  if (!result) return 0;

  let points = 0;

  if (guess === "1X") {
    points = (result === game.home_team || result === "Empate") ? 1 : 0;
  } else if (guess === "2X") {
    points = (result === game.away_team || result === "Empate") ? 1 : 0;
  } else {
    points = guess === result ? 3 : 0;
  }

  if (doubled && points > 0) {
    points = (guess === "1X" || guess === "2X") ? 3 : 6;
  }

  return points;
}

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  const user = result.rows[0];

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Login invalido" });
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role
  };

  res.json({ user: req.session.user });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => {
  res.json({ user: req.session.user || null });
});

app.get("/api/dates", async (req, res) => {
  const result = await pool.query("SELECT DISTINCT date FROM games ORDER BY date");
  res.json(result.rows.map(r => r.date));
});

app.get("/api/games", async (req, res) => {
  const { date } = req.query;

  let result;

  if (date) {
    result = await pool.query("SELECT * FROM games WHERE date = $1 ORDER BY kickoff", [date]);
  } else {
    result = await pool.query("SELECT * FROM games ORDER BY kickoff");
  }

  res.json(result.rows.map(mapGame));
});

app.get("/api/my-guesses", requireLogin, async (req, res) => {
  const result = await pool.query("SELECT * FROM guesses WHERE user_id = $1", [req.session.user.id]);
  res.json(result.rows.map(g => ({
    id: g.id,
    userId: g.user_id,
    gameId: g.game_id,
    date: g.date,
    guess: g.guess,
    doubled: g.doubled,
    createdAt: g.created_at
  })));
});

app.get("/api/my-guesses-detailed", requireLogin, async (req, res) => {
  const result = await pool.query(`
    SELECT
      guesses.id,
      guesses.date,
      guesses.created_at,
      guesses.guess,
      guesses.doubled,
      games.group_name,
      games.home_team,
      games.away_team,
      games.kickoff,
      games.result
    FROM guesses
    JOIN games ON games.id = guesses.game_id
    WHERE guesses.user_id = $1
    ORDER BY guesses.created_at DESC
  `, [req.session.user.id]);

  res.json(result.rows.map(r => ({
    id: r.id,
    date: r.date,
    createdAt: r.created_at,
    game: `${r.home_team} x ${r.away_team}`,
    group: r.group_name,
    kickoff: r.kickoff,
    guess: r.guess,
    doubled: r.doubled ? "Sim" : "Nao",
    result: r.result || ""
  })));
});

app.post("/api/guesses", requireLogin, async (req, res) => {
  const { date, guesses, doubledGameId } = req.body;

  if (!date || !Array.isArray(guesses) || !doubledGameId) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  if (!isDateReleased(date)) {
    return res.status(403).json({ error: "Apenas os jogos do dia ficam liberados para palpite." });
  }

  const gamesResult = await pool.query("SELECT * FROM games WHERE date = $1 ORDER BY kickoff", [date]);
  const dayGames = gamesResult.rows;

  if (!dayGames.length) return res.status(400).json({ error: "Data invalida" });

  const unlockedGames = dayGames.filter(g => !isLocked(g));

  if (!unlockedGames.length) {
    return res.status(403).json({ error: "Todos os jogos desta data ja estao bloqueados." });
  }

  const unlockedIds = unlockedGames.map(g => Number(g.id));
  const receivedUnlocked = guesses.filter(g => unlockedIds.includes(Number(g.gameId)));

  if (receivedUnlocked.length !== unlockedGames.length || receivedUnlocked.some(g => !g.guess)) {
    return res.status(400).json({ error: "Preencha todos os palpites dos jogos ainda abertos." });
  }

  if (!unlockedIds.includes(Number(doubledGameId))) {
    return res.status(400).json({ error: "O palpite dobrado precisa ser de um jogo ainda aberto." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const g of receivedUnlocked) {
      await client.query(`
        INSERT INTO guesses (user_id, game_id, date, guess, doubled, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (user_id, game_id) DO UPDATE SET
          guess = EXCLUDED.guess,
          doubled = EXCLUDED.doubled,
          created_at = NOW()
      `, [
        req.session.user.id,
        Number(g.gameId),
        date,
        g.guess,
        Number(g.gameId) === Number(doubledGameId)
      ]);
    }

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar palpites." });
  } finally {
    client.release();
  }
});

app.post("/api/results", requireAdmin, async (req, res) => {
  const { gameId, result } = req.body;

  const gameResult = await pool.query("SELECT * FROM games WHERE id = $1", [gameId]);
  const game = gameResult.rows[0];

  if (!game) return res.status(404).json({ error: "Jogo nao encontrado" });

  const valid = [game.home_team, "Empate", game.away_team, ""];
  if (!valid.includes(result)) return res.status(400).json({ error: "Resultado invalido" });

  await pool.query("UPDATE games SET result = $1 WHERE id = $2", [result, gameId]);
  res.json({ ok: true });
});

app.get("/api/ranking", async (req, res) => {
  const usersResult = await pool.query("SELECT id, name, initial_points FROM users WHERE role = 'user'");
  const guessesResult = await pool.query(`
    SELECT guesses.*, games.home_team, games.away_team, games.result
    FROM guesses
    JOIN games ON games.id = guesses.game_id
  `);

  const ranking = {};

  usersResult.rows.forEach(u => {
    ranking[u.id] = { name: u.name, points: u.initial_points || 0 };
  });

  guessesResult.rows.forEach(g => {
    const points = calculatePoints(g.guess, g.result, g, g.doubled);

    if (!ranking[g.user_id]) {
      ranking[g.user_id] = { name: "Sem nome", points: 0 };
    }

    ranking[g.user_id].points += points;
  });

  res.json(Object.values(ranking).sort((a, b) => b.points - a.points));
});

app.get("/api/all-guesses", requireAdmin, async (req, res) => {
  const result = await pool.query(`
    SELECT
      guesses.id,
      guesses.date,
      guesses.created_at,
      guesses.guess,
      guesses.doubled,
      users.name AS participant,
      users.username,
      games.group_name,
      games.home_team,
      games.away_team,
      games.kickoff
    FROM guesses
    JOIN users ON users.id = guesses.user_id
    JOIN games ON games.id = guesses.game_id
    ORDER BY guesses.created_at DESC
  `);

  res.json(result.rows.map(r => ({
    id: r.id,
    participant: r.participant,
    username: r.username,
    date: r.date,
    createdAt: r.created_at,
    game: `${r.home_team} x ${r.away_team}`,
    group: r.group_name,
    kickoff: r.kickoff,
    guess: r.guess,
    doubled: r.doubled ? "Sim" : "Nao"
  })));
});

app.get("/api/users", requireAdmin, async (req, res) => {
  const result = await pool.query("SELECT id, name, username, role, initial_points AS \"initialPoints\" FROM users ORDER BY role, name");
  res.json(result.rows);
});

app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.get("/app", (req, res) => res.sendFile(path.join(__dirname, "public", "app.html")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

initDb()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Bolao do Lobo rodando na porta ${PORT}`));
  })
  .catch(error => {
    console.error("Erro ao iniciar banco:", error);
    process.exit(1);
  });
