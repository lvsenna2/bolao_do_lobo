import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let currentProfile = null;
let currentGames = [];
let myGuesses = [];

window.login = login;
window.logout = logout;
window.showPage = showPage;
window.loadGames = loadGames;
window.saveGuesses = saveGuesses;
window.loadMyGuesses = loadMyGuessesTable;
window.loadRanking = loadRanking;
window.showAdminTab = showAdminTab;
window.loadAdminGames = loadAdminGames;
window.saveResult = saveResult;
window.loadAllGuesses = loadAllGuesses;
window.loadUsers = loadUsers;

function getTodayBR() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  const year = parts.find(p => p.type === "year").value;
  const month = parts.find(p => p.type === "month").value;
  const day = parts.find(p => p.type === "day").value;
  return `${year}-${month}-${day}`;
}

function formatDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

function formatDateTime(value) {
  if (!value) return "";
  const date = value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleString("pt-BR");
}

function formatKickoff(k) {
  if (!k) return "";
  return new Date(k).toLocaleString("pt-BR");
}

function prize(i) {
  if (i === 0) return "R$ 150";
  if (i === 1) return "R$ 40";
  if (i === 2) return "R$ 20";
  return "";
}

function isDateReleased(date) {
  return date === getTodayBR();
}

function isLocked(game) {
  return !isDateReleased(game.date) || Date.now() >= new Date(game.kickoff).getTime();
}

function calculatePoints(guess, result, game, doubled) {
  if (!result) return 0;

  let points = 0;

  if (guess === "1X") {
    points = result === game.home || result === "Empate" ? 1 : 0;
  } else if (guess === "2X") {
    points = result === game.away || result === "Empate" ? 1 : 0;
  } else {
    points = guess === result ? 3 : 0;
  }

  if (doubled && points > 0) {
    points = (guess === "1X" || guess === "2X") ? 3 : 6;
  }

  return points;
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    document.getElementById("loginMsg").textContent = "Login inválido.";
  }
}

async function logout() {
  await signOut(auth);
  location.reload();
}

function showPage(page) {
  ["loginPage", "palpitesPage", "meusPage", "rankingPage", "adminPage"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });

  if (page === "palpites") document.getElementById("palpitesPage").classList.remove("hidden");
  if (page === "meus") {
    document.getElementById("meusPage").classList.remove("hidden");
    loadMyGuessesTable();
  }
  if (page === "ranking") {
    document.getElementById("rankingPage").classList.remove("hidden");
    loadRanking();
  }
  if (page === "admin") {
    document.getElementById("adminPage").classList.remove("hidden");
    loadAdminDates();
    loadAllGuesses();
    loadUsers();
  }
}

function showAdminTab(tab) {
  document.getElementById("adminResultados").classList.add("hidden");
  document.getElementById("adminTodosPalpites").classList.add("hidden");
  document.getElementById("adminUsuarios").classList.add("hidden");

  if (tab === "resultados") document.getElementById("adminResultados").classList.remove("hidden");
  if (tab === "todosPalpites") document.getElementById("adminTodosPalpites").classList.remove("hidden");
  if (tab === "usuarios") document.getElementById("adminUsuarios").classList.remove("hidden");
}

async function getAllGames() {
  const snap = await getDocs(query(collection(db, "games"), orderBy("kickoff")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function loadDates(selectId = "dateSelect") {
  const games = await getAllGames();
  const dates = [...new Set(games.map(g => g.date))].sort();
  const select = document.getElementById(selectId);
  const today = getTodayBR();

  select.innerHTML = dates.map(d => {
    const status = d === today ? " - HOJE" : d > today ? " - bloqueado" : " - encerrado";
    return `<option value="${d}">${formatDate(d)}${status}</option>`;
  }).join("");

  if (dates.includes(today)) select.value = today;
  else select.value = dates.find(d => d > today) || dates[dates.length - 1] || "";
}

async function loadMyGuessesRaw() {
  const snap = await getDocs(query(collection(db, "guesses"), where("userId", "==", currentUser.uid)));
  myGuesses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function loadGames() {
  await loadMyGuessesRaw();

  const date = document.getElementById("dateSelect").value;
  const snap = await getDocs(query(collection(db, "games"), where("date", "==", date), orderBy("kickoff")));
  currentGames = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const guessesOfDate = myGuesses.filter(g => g.date === date);
  const today = getTodayBR();
  const dateMsg = document.getElementById("dateMsg");

  if (date !== today) {
    dateMsg.textContent = date > today
      ? "Esta data ainda não está liberada. Volte no dia da rodada."
      : "Esta data já foi encerrada. Você pode visualizar, mas não alterar.";
  } else {
    dateMsg.textContent = "Data de hoje liberada. Cada jogo bloqueia no horário de início.";
  }

  const gamesBox = document.getElementById("games");

  if (!currentGames.length) {
    gamesBox.innerHTML = `<div class="info-card">Nenhum jogo nesta data.</div>`;
    return;
  }

  gamesBox.innerHTML = currentGames.map(g => {
    const locked = isLocked(g);
    const saved = guessesOfDate.find(x => String(x.gameId) === String(g.id));
    const savedGuess = saved ? saved.guess : "";
    const savedDouble = saved && saved.doubled ? "checked" : "";
    const lockLabel = locked ? (!isDateReleased(g.date) ? "Data bloqueada" : "Jogo iniciado") : "Aberto";

    return `
      <div class="game-card ${locked ? "locked" : ""}">
        <div class="game-head">
          <span class="group-badge">Grupo ${g.group}</span>
          ${locked ? `<span class="lock-badge">${lockLabel}</span>` : `<span class="group-badge">${lockLabel}</span>`}
        </div>

        <div class="match">${g.home} <span class="vs">x</span> ${g.away}</div>
        <div class="kickoff">Início: ${formatKickoff(g.kickoff)}</div>

        <select id="guess_${g.id}" ${locked ? "disabled" : ""}>
          <option value="">Selecione seu palpite</option>
          <option value="${g.home}" ${savedGuess === g.home ? "selected" : ""}>${g.home} vence - 3 pts</option>
          <option value="Empate" ${savedGuess === "Empate" ? "selected" : ""}>Empate - 3 pts</option>
          <option value="${g.away}" ${savedGuess === g.away ? "selected" : ""}>${g.away} vence - 3 pts</option>
          <option value="1X" ${savedGuess === "1X" ? "selected" : ""}>1X - ${g.home} ou empate - 1 pt</option>
          <option value="2X" ${savedGuess === "2X" ? "selected" : ""}>2X - ${g.away} ou empate - 1 pt</option>
        </select>

        <label class="double-box">
          <input type="radio" name="doubled" value="${g.id}" ${savedDouble} ${locked ? "disabled" : ""}>
          🐺 Dobrar este palpite
        </label>
      </div>
    `;
  }).join("");
}

async function saveGuesses() {
  const selectedDate = document.getElementById("dateSelect").value;

  if (selectedDate !== getTodayBR()) {
    document.getElementById("saveMsg").textContent = "Apenas os jogos do dia ficam liberados para palpite.";
    return;
  }

  const unlockedGames = currentGames.filter(g => !isLocked(g));

  if (!unlockedGames.length) {
    document.getElementById("saveMsg").textContent = "Todos os jogos desta data já estão bloqueados.";
    return;
  }

  const doubled = document.querySelector("input[name='doubled']:checked:not(:disabled)");

  if (!doubled) {
    document.getElementById("saveMsg").textContent = "Escolha um jogo aberto para dobrar.";
    return;
  }

  for (const g of unlockedGames) {
    const guess = document.getElementById(`guess_${g.id}`).value;

    if (!guess) {
      document.getElementById("saveMsg").textContent = "Preencha todos os palpites dos jogos ainda abertos.";
      return;
    }

    const guessId = `${currentUser.uid}_${g.id}`;

    await setDoc(doc(db, "guesses", guessId), {
      userId: currentUser.uid,
      userName: currentProfile.name,
      gameId: g.id,
      date: selectedDate,
      guess,
      doubled: String(g.id) === String(doubled.value),
      createdAt: serverTimestamp()
    }, { merge: true });
  }

  document.getElementById("saveMsg").textContent = "Palpites salvos com sucesso.";
  await loadGames();
  await loadMyGuessesTable();
  await loadRanking();
}

async function loadMyGuessesTable() {
  const games = await getAllGames();
  const snap = await getDocs(query(collection(db, "guesses"), where("userId", "==", currentUser.uid)));
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  const tbody = document.getElementById("myGuessesTable");

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6">Nenhum palpite cadastrado ainda.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(g => {
    const game = games.find(j => String(j.id) === String(g.gameId));
    return `
      <tr>
        <td>${formatDateTime(g.createdAt)}</td>
        <td>${formatDate(g.date)}</td>
        <td>${game ? `${game.home} x ${game.away}` : "Jogo removido"}</td>
        <td>${g.guess}</td>
        <td>${g.doubled ? "Sim" : "Não"}</td>
        <td>${game?.result || "Pendente"}</td>
      </tr>
    `;
  }).join("");
}

async function loadRanking() {
  const usersSnap = await getDocs(collection(db, "users"));
  const games = await getAllGames();
  const guessesSnap = await getDocs(collection(db, "guesses"));

  const ranking = {};

  usersSnap.docs.forEach(d => {
    const u = d.data();
    if (u.role === "user") {
      ranking[d.id] = { name: u.name, points: u.initialPoints || 0 };
    }
  });

  guessesSnap.docs.forEach(d => {
    const g = d.data();
    const game = games.find(j => String(j.id) === String(g.gameId));
    if (!game || !ranking[g.userId]) return;
    ranking[g.userId].points += calculatePoints(g.guess, game.result, game, g.doubled);
  });

  const list = Object.values(ranking).sort((a,b) => b.points - a.points);

  document.getElementById("ranking").innerHTML = list.map((r,i) => `
    <tr class="${i === 0 ? "prize1" : i === 1 ? "prize2" : i === 2 ? "prize3" : ""}">
      <td>${i + 1}º</td>
      <td>${r.name}</td>
      <td>${r.points}</td>
      <td>${prize(i)}</td>
    </tr>
  `).join("");
}

async function loadAdminDates() {
  await loadDates("adminDateSelect");
  await loadAdminGames();
}

async function loadAdminGames() {
  const date = document.getElementById("adminDateSelect").value;
  const snap = await getDocs(query(collection(db, "games"), where("date", "==", date), orderBy("kickoff")));
  const games = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  document.getElementById("adminGames").innerHTML = games.map(g => `
    <div class="game-card">
      <div class="game-head">
        <span class="group-badge">Grupo ${g.group}</span>
        <span class="group-badge">${g.result ? "Resultado lançado" : "Pendente"}</span>
      </div>
      <div class="match">${g.home} <span class="vs">x</span> ${g.away}</div>
      <div class="kickoff">Início: ${formatKickoff(g.kickoff)}</div>
      <select onchange="saveResult('${g.id}', this.value)">
        <option value="">Resultado oficial</option>
        <option value="${g.home}" ${g.result === g.home ? "selected" : ""}>${g.home}</option>
        <option value="Empate" ${g.result === "Empate" ? "selected" : ""}>Empate</option>
        <option value="${g.away}" ${g.result === g.away ? "selected" : ""}>${g.away}</option>
      </select>
    </div>
  `).join("");
}

async function saveResult(gameId, result) {
  await updateDoc(doc(db, "games", String(gameId)), { result });
  await loadAdminGames();
  await loadRanking();
}

async function loadAllGuesses() {
  const games = await getAllGames();
  const snap = await getDocs(collection(db, "guesses"));
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  document.getElementById("allGuessesTable").innerHTML = list.map(g => {
    const game = games.find(j => String(j.id) === String(g.gameId));
    return `
      <tr>
        <td>${formatDateTime(g.createdAt)}</td>
        <td>${g.userName || ""}</td>
        <td>${formatDate(g.date)}</td>
        <td>${game ? `${game.home} x ${game.away}` : "Jogo removido"}</td>
        <td>${g.guess}</td>
        <td>${g.doubled ? "Sim" : "Não"}</td>
      </tr>
    `;
  }).join("");
}

async function loadUsers() {
  const snap = await getDocs(collection(db, "users"));
  const users = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => a.name.localeCompare(b.name));

  document.getElementById("usersTable").innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email || ""}</td>
      <td>${u.initialPoints || 0}</td>
      <td>${u.role}</td>
    </tr>
  `).join("");
}

onAuthStateChanged(auth, async user => {
  currentUser = user;

  if (!user) {
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("nav").classList.add("hidden");
    ["palpitesPage", "meusPage", "rankingPage", "adminPage"].forEach(id => {
      document.getElementById(id).classList.add("hidden");
    });
    return;
  }

  const profileSnap = await getDoc(doc(db, "users", user.uid));
  currentProfile = profileSnap.data();

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("nav").classList.remove("hidden");
  document.getElementById("hello").textContent = `Bem-vindo, ${currentProfile.name}`;

  if (currentProfile.role === "admin") {
    document.getElementById("adminNav").classList.remove("hidden");
  }

  await loadDates();
  await loadGames();
  await loadRanking();
  await loadMyGuessesTable();

  showPage("palpites");
});
