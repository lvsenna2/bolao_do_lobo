import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClWnhvUHym5RF6jhaK0A_yBQZ_AZBECaw",
  authDomain: "bolaodolobo-e867e.firebaseapp.com",
  projectId: "bolaodolobo-e867e",
  storageBucket: "bolaodolobo-e867e.firebasestorage.app",
  messagingSenderId: "25366687259",
  appId: "1:25366687259:web:db57a21d2194a5986c12be"
};

const ADMIN_EMAIL = "lvaz@id.uff.br";
const ADMIN_PASSWORD = "LoboAdmin2026";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let currentProfile = null;
let currentGames = [];
let myPredictions = [];
let unsubscribeRanking = null;

const calendarGames = [
  ["1","2026-06-11","16:00","A","México","África do Sul"],
  ["2","2026-06-11","23:00","A","Coreia do Sul","Tchéquia"],
  ["3","2026-06-12","16:00","B","Canadá","Bósnia e Herzegovina"],
  ["4","2026-06-12","22:00","D","Estados Unidos","Paraguai"],
  ["5","2026-06-13","16:00","B","Catar","Suíça"],
  ["6","2026-06-13","19:00","C","Brasil","Marrocos"],
  ["7","2026-06-13","22:00","C","Haiti","Escócia"],
  ["8","2026-06-14","01:00","D","Austrália","Turquia"],
  ["9","2026-06-14","14:00","E","Alemanha","Curaçao"],
  ["10","2026-06-14","17:00","F","Holanda","Japão"],
  ["11","2026-06-14","20:00","E","Costa do Marfim","Equador"],
  ["12","2026-06-14","23:00","F","Suécia","Tunísia"],
  ["13","2026-06-15","13:00","H","Espanha","Cabo Verde"],
  ["14","2026-06-15","16:00","G","Bélgica","Egito"],
  ["15","2026-06-15","19:00","H","Arábia Saudita","Uruguai"],
  ["16","2026-06-15","22:00","G","Irã","Nova Zelândia"],
  ["17","2026-06-16","16:00","I","França","Senegal"],
  ["18","2026-06-16","19:00","I","Iraque","Noruega"],
  ["19","2026-06-16","22:00","J","Argentina","Argélia"],
  ["20","2026-06-17","01:00","J","Áustria","Jordânia"],
  ["21","2026-06-17","14:00","K","Portugal","RD Congo"],
  ["22","2026-06-17","17:00","L","Inglaterra","Croácia"],
  ["23","2026-06-17","20:00","L","Gana","Panamá"],
  ["24","2026-06-17","23:00","K","Uzbequistão","Colômbia"],
  ["25","2026-06-18","13:00","A","Tchéquia","África do Sul"],
  ["26","2026-06-18","16:00","B","Suíça","Bósnia e Herzegovina"],
  ["27","2026-06-18","19:00","B","Canadá","Catar"],
  ["28","2026-06-18","22:00","A","México","Coreia do Sul"],
  ["29","2026-06-19","16:00","D","Estados Unidos","Austrália"],
  ["30","2026-06-19","19:00","C","Escócia","Marrocos"],
  ["31","2026-06-19","21:30","C","Brasil","Haiti"],
  ["32","2026-06-20","00:00","D","Turquia","Paraguai"],
  ["33","2026-06-20","14:00","F","Holanda","Suécia"],
  ["34","2026-06-20","17:00","E","Alemanha","Costa do Marfim"],
  ["35","2026-06-20","21:00","E","Equador","Curaçao"],
  ["36","2026-06-21","01:00","F","Tunísia","Japão"],
  ["37","2026-06-21","13:00","H","Espanha","Arábia Saudita"],
  ["38","2026-06-21","16:00","G","Bélgica","Irã"],
  ["39","2026-06-21","19:00","H","Uruguai","Cabo Verde"],
  ["40","2026-06-21","22:00","G","Nova Zelândia","Egito"],
  ["41","2026-06-22","14:00","J","Argentina","Áustria"],
  ["42","2026-06-22","18:00","I","França","Iraque"],
  ["43","2026-06-22","21:00","I","Noruega","Senegal"],
  ["44","2026-06-23","00:00","J","Jordânia","Argélia"],
  ["45","2026-06-23","14:00","K","Portugal","Uzbequistão"],
  ["46","2026-06-23","17:00","L","Inglaterra","Gana"],
  ["47","2026-06-23","20:00","L","Panamá","Croácia"],
  ["48","2026-06-23","23:00","K","Colômbia","RD Congo"]
];

window.showLoginTab = showLoginTab;
window.loginUser = loginUser;
window.createAccount = createAccount;
window.loginAdmin = loginAdmin;
window.logout = logout;
window.showPage = showPage;
window.showAdminTab = showAdminTab;
window.loadGamesForSelectedDate = loadGamesForSelectedDate;
window.savePredictions = savePredictions;
window.loadMyPredictions = loadMyPredictions;
window.loadRanking = loadRanking;
window.createGame = createGame;
window.loadAdminResultCards = loadAdminResultCards;
window.saveResult = saveResult;
window.seedCalendar = seedCalendar;
window.clearV12Database = clearV12Database;
window.deleteGame = deleteGame;
window.exportPredictionsCSV = exportPredictionsCSV;

function showLoginTab(tab) {
  document.getElementById("tabEntrar").classList.add("hidden");
  document.getElementById("tabCriar").classList.add("hidden");
  document.getElementById("tabAdmin").classList.add("hidden");

  if (tab === "entrar") document.getElementById("tabEntrar").classList.remove("hidden");
  if (tab === "criar") document.getElementById("tabCriar").classList.remove("hidden");
  if (tab === "admin") document.getElementById("tabAdmin").classList.remove("hidden");
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

function formatDate(date) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

function formatTimeFromISO(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateTime(value) {
  if (!value) return "";
  const date = value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleString("pt-BR");
}

function prize(index) {
  if (index === 0) return "R$ 150";
  if (index === 1) return "R$ 40";
  if (index === 2) return "R$ 20";
  return "";
}

function isDateReleased(date) {
  return date === getTodayBR();
}

function isLocked(game) {
  return !isDateReleased(game.date) || Date.now() >= new Date(game.kickoff).getTime();
}

function calculatePoints(prediction, result, game, doubled) {
  if (!result) return 0;

  let points = 0;

  if (prediction === "1X") {
    points = result === game.home || result === "Empate" ? 1 : 0;
  } else if (prediction === "2X") {
    points = result === game.away || result === "Empate" ? 1 : 0;
  } else {
    points = prediction === result ? 3 : 0;
  }

  if (doubled && points > 0) {
    points = prediction === "1X" || prediction === "2X" ? 3 : 6;
  }

  return points;
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const msg = document.getElementById("loginMsg");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    msg.textContent = "Login realizado.";
  } catch (error) {
    console.error(error);
    msg.textContent = "Login inválido. Verifique e-mail e senha.";
  }
}

async function createAccount() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const msg = document.getElementById("loginMsg");

  if (!name || !email || password.length < 6) {
    msg.textContent = "Preencha nome, e-mail e senha com no mínimo 6 caracteres.";
    return;
  }

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "v12_users", credential.user.uid), {
      uid: credential.user.uid,
      name,
      email,
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    msg.textContent = "Conta criada com sucesso.";
  } catch (error) {
    console.error(error);
    msg.textContent = "Erro ao criar conta: " + (error.code || error.message);
  }
}

async function loginAdmin() {
  const password = document.getElementById("adminPassword").value;
  const msg = document.getElementById("loginMsg");

  if (password !== ADMIN_PASSWORD) {
    msg.textContent = "Senha do ADM incorreta.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    msg.textContent = "ADM conectado.";
  } catch (error) {
    if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
      try {
        const credential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        await setDoc(doc(db, "v12_users", credential.user.uid), {
          uid: credential.user.uid,
          name: "Administrador",
          email: ADMIN_EMAIL,
          role: "admin",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        msg.textContent = "ADM criado e conectado.";
      } catch (createError) {
        console.error(createError);
        msg.textContent = "Não foi possível criar o ADM. Verifique se Email/Senha está ativado no Firebase.";
      }
    } else {
      console.error(error);
      msg.textContent = "Erro no login ADM: " + (error.code || error.message);
    }
  }
}

async function logout() {
  await signOut(auth);
  location.reload();
}

async function ensureProfile(user) {
  const ref = doc(db, "v12_users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) return snap.data();

  const role = user.email === ADMIN_EMAIL ? "admin" : "user";
  const name = role === "admin" ? "Administrador" : user.email.split("@")[0];

  await setDoc(ref, {
    uid: user.uid,
    name,
    email: user.email,
    role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const newSnap = await getDoc(ref);
  return newSnap.data();
}

function showPage(page) {
  ["loginPage", "palpitesPage", "meusPage", "rankingPage", "adminPage"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });

  if (page === "palpites") {
    document.getElementById("palpitesPage").classList.remove("hidden");
    loadDates("dateSelect").then(loadGamesForSelectedDate);
  }

  if (page === "meus") {
    document.getElementById("meusPage").classList.remove("hidden");
    loadMyPredictions();
  }

  if (page === "ranking") {
    document.getElementById("rankingPage").classList.remove("hidden");
    loadRanking();
  }

  if (page === "admin") {
    document.getElementById("adminPage").classList.remove("hidden");
    showAdminTab("dashboard");
    loadAdminData();
  }
}

function showAdminTab(tab) {
  ["adminDashboard", "adminJogos", "adminResultados", "adminPalpites", "adminUsuarios"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });

  if (tab === "dashboard") document.getElementById("adminDashboard").classList.remove("hidden");
  if (tab === "jogos") document.getElementById("adminJogos").classList.remove("hidden");
  if (tab === "resultados") document.getElementById("adminResultados").classList.remove("hidden");
  if (tab === "palpites") document.getElementById("adminPalpites").classList.remove("hidden");
  if (tab === "usuarios") document.getElementById("adminUsuarios").classList.remove("hidden");
}

async function getAllGames() {
  const snap = await getDocs(query(collection(db, "v12_games"), orderBy("kickoff")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function loadDates(selectId) {
  const games = await getAllGames();
  const dates = [...new Set(games.map(g => g.date))].sort();
  const select = document.getElementById(selectId);
  const today = getTodayBR();

  if (!dates.length) {
    select.innerHTML = `<option value="">Nenhum jogo cadastrado</option>`;
    return;
  }

  select.innerHTML = dates.map(date => {
    const label = date === today ? " - HOJE" : date > today ? " - bloqueado" : " - encerrado";
    return `<option value="${date}">${formatDate(date)}${label}</option>`;
  }).join("");

  if (dates.includes(today)) select.value = today;
  else select.value = dates.find(d => d > today) || dates[dates.length - 1];
}

async function loadMyPredictionsRaw() {
  const snap = await getDocs(query(collection(db, "v12_predictions"), where("userId", "==", currentUser.uid)));
  myPredictions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function loadGamesForSelectedDate() {
  await loadMyPredictionsRaw();

  const date = document.getElementById("dateSelect").value;
  const gamesBox = document.getElementById("games");
  const dateMsg = document.getElementById("dateMsg");

  if (!date) {
    gamesBox.innerHTML = `<div class="info-card">Nenhum jogo cadastrado.</div>`;
    return;
  }

  const snap = await getDocs(query(collection(db, "v12_games"), where("date", "==", date), orderBy("kickoff")));
  currentGames = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  if (date !== getTodayBR()) {
    dateMsg.textContent = date > getTodayBR()
      ? "Esta data ainda está bloqueada. Volte no dia da rodada."
      : "Esta data já foi encerrada. Você pode visualizar, mas não alterar.";
  } else {
    dateMsg.textContent = "Data de hoje liberada. Cada jogo bloqueia automaticamente no horário de início.";
  }

  if (!currentGames.length) {
    gamesBox.innerHTML = `<div class="info-card">Nenhum jogo nesta data.</div>`;
    return;
  }

  gamesBox.innerHTML = currentGames.map(game => {
    const locked = isLocked(game);
    const saved = myPredictions.find(p => String(p.gameId) === String(game.id));
    const savedPrediction = saved ? saved.prediction : "";
    const savedDoubled = saved && saved.doubled ? "checked" : "";
    const status = locked ? (!isDateReleased(game.date) ? "Data bloqueada" : "Jogo iniciado") : "Aberto";

    return `
      <div class="game-card ${locked ? "locked" : ""}">
        <div class="game-head">
          <span class="badge">Grupo ${game.group || "-"}</span>
          ${locked ? `<span class="lock-badge">${status}</span>` : `<span class="badge">${status}</span>`}
        </div>

        <div class="match">${game.home} <span class="vs">x</span> ${game.away}</div>
        <div class="kickoff">Início: ${formatDate(game.date)} às ${formatTimeFromISO(game.kickoff)}</div>

        <select id="prediction_${game.id}" ${locked ? "disabled" : ""}>
          <option value="">Selecione seu palpite</option>
          <option value="${game.home}" ${savedPrediction === game.home ? "selected" : ""}>${game.home} vence - 3 pts</option>
          <option value="Empate" ${savedPrediction === "Empate" ? "selected" : ""}>Empate - 3 pts</option>
          <option value="${game.away}" ${savedPrediction === game.away ? "selected" : ""}>${game.away} vence - 3 pts</option>
          <option value="1X" ${savedPrediction === "1X" ? "selected" : ""}>1X - ${game.home} ou empate - 1 pt</option>
          <option value="2X" ${savedPrediction === "2X" ? "selected" : ""}>2X - ${game.away} ou empate - 1 pt</option>
        </select>

        <label class="double-box">
          <input type="radio" name="doubled" value="${game.id}" ${savedDoubled} ${locked ? "disabled" : ""}>
          🐺 Dobrar este palpite
        </label>
      </div>
    `;
  }).join("");
}

async function savePredictions() {
  const date = document.getElementById("dateSelect").value;
  const saveMsg = document.getElementById("saveMsg");

  if (date !== getTodayBR()) {
    saveMsg.textContent = "Apenas os jogos do dia ficam liberados para palpite.";
    return;
  }

  const unlockedGames = currentGames.filter(g => !isLocked(g));

  if (!unlockedGames.length) {
    saveMsg.textContent = "Todos os jogos desta data já estão bloqueados.";
    return;
  }

  const doubled = document.querySelector("input[name='doubled']:checked:not(:disabled)");

  if (!doubled) {
    saveMsg.textContent = "Escolha um jogo aberto para dobrar.";
    return;
  }

  for (const game of unlockedGames) {
    const prediction = document.getElementById(`prediction_${game.id}`).value;

    if (!prediction) {
      saveMsg.textContent = "Preencha todos os palpites dos jogos ainda abertos.";
      return;
    }

    const predictionId = `${currentUser.uid}_${game.id}`;

    await setDoc(doc(db, "v12_predictions", predictionId), {
      userId: currentUser.uid,
      userName: currentProfile.name,
      userEmail: currentProfile.email,
      gameId: game.id,
      date,
      prediction,
      doubled: String(game.id) === String(doubled.value),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
  }

  saveMsg.textContent = "Palpites salvos com sucesso.";
  await loadGamesForSelectedDate();
  await loadMyPredictions();
  await loadRanking();
}

async function loadMyPredictions() {
  const games = await getAllGames();
  const snap = await getDocs(query(collection(db, "v12_predictions"), where("userId", "==", currentUser.uid)));
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.updatedAt?.seconds || b.createdAt?.seconds || 0) - (a.updatedAt?.seconds || a.createdAt?.seconds || 0));

  const tbody = document.getElementById("myPredictionsTable");

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7">Nenhum palpite cadastrado ainda.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(p => {
    const game = games.find(g => String(g.id) === String(p.gameId));
    const points = game ? calculatePoints(p.prediction, game.result, game, p.doubled) : 0;

    return `
      <tr>
        <td>${formatDateTime(p.updatedAt || p.createdAt)}</td>
        <td>${formatDate(p.date)}</td>
        <td>${game ? `${game.home} x ${game.away}` : "Jogo removido"}</td>
        <td>${p.prediction}</td>
        <td>${p.doubled ? "Sim" : "Não"}</td>
        <td>${game?.result || "Pendente"}</td>
        <td>${points}</td>
      </tr>
    `;
  }).join("");
}

async function loadRanking() {
  const games = await getAllGames();
  const usersSnap = await getDocs(collection(db, "v12_users"));
  const predictionsSnap = await getDocs(collection(db, "v12_predictions"));

  const ranking = {};

  usersSnap.docs.forEach(docSnap => {
    const user = docSnap.data();
    if (user.role === "user") {
      ranking[docSnap.id] = { name: user.name, points: 0 };
    }
  });

  predictionsSnap.docs.forEach(docSnap => {
    const p = docSnap.data();
    const game = games.find(g => String(g.id) === String(p.gameId));
    if (!game || !ranking[p.userId]) return;
    ranking[p.userId].points += calculatePoints(p.prediction, game.result, game, p.doubled);
  });

  const list = Object.values(ranking).sort((a, b) => b.points - a.points);
  const tbody = document.getElementById("rankingTable");

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="4">Ranking ainda vazio.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((item, index) => `
    <tr class="${index === 0 ? "prize1" : index === 1 ? "prize2" : index === 2 ? "prize3" : ""}">
      <td>${index + 1}º</td>
      <td>${item.name}</td>
      <td>${item.points}</td>
      <td>${prize(index)}</td>
    </tr>
  `).join("");
}

async function createGame() {
  if (currentProfile.role !== "admin") return;

  const date = document.getElementById("gameDate").value;
  const time = document.getElementById("gameTime").value;
  const group = document.getElementById("gameGroup").value.trim().toUpperCase();
  const home = document.getElementById("homeTeam").value.trim();
  const away = document.getElementById("awayTeam").value.trim();
  const msg = document.getElementById("gameMsg");

  if (!date || !time || !home || !away) {
    msg.textContent = "Preencha data, hora, time da casa e visitante.";
    return;
  }

  const kickoff = `${date}T${time}:00-03:00`;

  await addDoc(collection(db, "v12_games"), {
    date,
    kickoff,
    group,
    home,
    away,
    result: "",
    createdAt: serverTimestamp()
  });

  msg.textContent = "Jogo cadastrado.";
  document.getElementById("homeTeam").value = "";
  document.getElementById("awayTeam").value = "";
  await loadAdminData();
}

async function loadAdminData() {
  if (currentProfile.role !== "admin") return;

  await loadDates("adminDateSelect");
  await loadAdminGamesTable();
  await loadAdminResultCards();
  await loadAllPredictions();
  await loadUsers();

  const usersSnap = await getDocs(collection(db, "v12_users"));
  const gamesSnap = await getDocs(collection(db, "v12_games"));
  const predictionsSnap = await getDocs(collection(db, "v12_predictions"));
  const today = getTodayBR();
  const todayGames = gamesSnap.docs.filter(d => d.data().date === today).length;

  document.getElementById("statUsers").textContent = usersSnap.docs.filter(d => d.data().role === "user").length;
  document.getElementById("statGames").textContent = gamesSnap.size;
  document.getElementById("statPredictions").textContent = predictionsSnap.size;
  document.getElementById("statTodayGames").textContent = todayGames;
}

async function loadAdminGamesTable() {
  const games = await getAllGames();

  document.getElementById("adminGamesTable").innerHTML = games.map(g => `
    <tr>
      <td>${formatDate(g.date)}</td>
      <td>${formatTimeFromISO(g.kickoff)}</td>
      <td>${g.group || ""}</td>
      <td>${g.home} x ${g.away}</td>
      <td>${g.result || "Pendente"}</td>
      <td><button class="danger" onclick="deleteGame('${g.id}')">Excluir</button></td>
    </tr>
  `).join("");
}

async function loadAdminResultCards() {
  const date = document.getElementById("adminDateSelect").value;
  if (!date) return;

  const snap = await getDocs(query(collection(db, "v12_games"), where("date", "==", date), orderBy("kickoff")));
  const games = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  document.getElementById("adminResultsCards").innerHTML = games.map(g => `
    <div class="game-card">
      <div class="game-head">
        <span class="badge">Grupo ${g.group || "-"}</span>
        <span class="badge">${g.result ? "Resultado lançado" : "Pendente"}</span>
      </div>

      <div class="match">${g.home} <span class="vs">x</span> ${g.away}</div>

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
  if (currentProfile.role !== "admin") return;
  await updateDoc(doc(db, "v12_games", gameId), { result });
  await loadAdminData();
  await loadRanking();
  await loadMyPredictions();
}

async function deleteGame(gameId) {
  if (currentProfile.role !== "admin") return;
  if (!confirm("Excluir este jogo?")) return;
  await deleteDoc(doc(db, "v12_games", gameId));
  await loadAdminData();
}

async function seedCalendar() {
  if (currentProfile.role !== "admin") return;
  const msg = document.getElementById("adminMsg");
  msg.textContent = "Cadastrando calendário...";

  for (const [id, date, time, group, home, away] of calendarGames) {
    await setDoc(doc(db, "v12_games", id), {
      date,
      kickoff: `${date}T${time}:00-03:00`,
      group,
      home,
      away,
      result: "",
      createdAt: serverTimestamp()
    }, { merge: true });
  }

  msg.textContent = "Calendário cadastrado com sucesso.";
  await loadAdminData();
}

async function clearCollection(name) {
  const snap = await getDocs(collection(db, name));
  for (const d of snap.docs) {
    await deleteDoc(doc(db, name, d.id));
  }
}

async function clearV12Database() {
  if (currentProfile.role !== "admin") return;
  if (!confirm("Isso apagará jogos, palpites e usuários do V12. Continuar?")) return;

  await clearCollection("v12_predictions");
  await clearCollection("v12_games");
  const usersSnap = await getDocs(collection(db, "v12_users"));
  for (const d of usersSnap.docs) {
    if (d.data().email !== ADMIN_EMAIL) {
      await deleteDoc(doc(db, "v12_users", d.id));
    }
  }

  document.getElementById("adminMsg").textContent = "Banco V12 limpo.";
  await loadAdminData();
}

async function loadAllPredictions() {
  const games = await getAllGames();
  const snap = await getDocs(collection(db, "v12_predictions"));
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.updatedAt?.seconds || b.createdAt?.seconds || 0) - (a.updatedAt?.seconds || a.createdAt?.seconds || 0));

  document.getElementById("allPredictionsTable").innerHTML = list.map(p => {
    const game = games.find(g => String(g.id) === String(p.gameId));

    return `
      <tr>
        <td>${formatDateTime(p.updatedAt || p.createdAt)}</td>
        <td>${p.userName || ""}</td>
        <td>${formatDate(p.date)}</td>
        <td>${game ? `${game.home} x ${game.away}` : "Jogo removido"}</td>
        <td>${p.prediction}</td>
        <td>${p.doubled ? "Sim" : "Não"}</td>
      </tr>
    `;
  }).join("");
}

async function loadUsers() {
  const snap = await getDocs(collection(db, "v12_users"));
  const users = snap.docs.map(d => d.data()).sort((a, b) => String(a.name).localeCompare(String(b.name)));

  document.getElementById("usersTable").innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${formatDateTime(u.createdAt)}</td>
    </tr>
  `).join("");
}

async function exportPredictionsCSV() {
  const games = await getAllGames();
  const snap = await getDocs(collection(db, "v12_predictions"));
  const rows = [["Enviado em", "Participante", "Email", "Data", "Jogo", "Palpite", "Dobrado"]];

  snap.docs.forEach(d => {
    const p = d.data();
    const game = games.find(g => String(g.id) === String(p.gameId));

    rows.push([
      formatDateTime(p.updatedAt || p.createdAt),
      p.userName || "",
      p.userEmail || "",
      formatDate(p.date),
      game ? `${game.home} x ${game.away}` : "",
      p.prediction,
      p.doubled ? "Sim" : "Não"
    ]);
  });

  const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "palpites_bolao_do_lobo.csv";
  a.click();
  URL.revokeObjectURL(url);
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

  try {
    currentProfile = await ensureProfile(user);

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("nav").classList.remove("hidden");
    document.getElementById("welcome").textContent = `Bem-vindo, ${currentProfile.name}`;

    if (currentProfile.role === "admin") {
      document.getElementById("adminBtn").classList.remove("hidden");
    } else {
      document.getElementById("adminBtn").classList.add("hidden");
    }

    await loadDates("dateSelect");
    await loadGamesForSelectedDate();
    await loadRanking();
    showPage("palpites");

    if (unsubscribeRanking) unsubscribeRanking();
    unsubscribeRanking = onSnapshot(collection(db, "v12_predictions"), () => loadRanking());
  } catch (error) {
    console.error(error);
    document.getElementById("loginMsg").textContent = "Erro ao carregar perfil: " + (error.code || error.message);
    document.getElementById("loginPage").classList.remove("hidden");
  }
});
