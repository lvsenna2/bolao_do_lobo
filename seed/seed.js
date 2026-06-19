import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

const participants = [
  ["Carlão", "carlao@bolao.local", "123456", "user", 31],
  ["Doutor mikto", "doutormikto@bolao.local", "123456", "user", 30],
  ["rp", "rp@bolao.local", "123456", "user", 27],
  ["Julio", "julio@bolao.local", "123456", "user", 27],
  ["Zé", "ze@bolao.local", "123456", "user", 27],
  ["Luiz Presídio", "luizpresidio@bolao.local", "123456", "user", 27],
  ["LVSENNA", "lvsenna@bolao.local", "123456", "user", 25],
  ["Rafael", "rafael@bolao.local", "123456", "user", 25],
  ["Luiz La black ma", "luizlablackma@bolao.local", "123456", "user", 25],
  ["Matheuzico", "matheuzico@bolao.local", "123456", "user", 22],
  ["H.França", "hfranca@bolao.local", "123456", "user", 22],
  ["Davi", "davi@bolao.local", "123456", "user", 21],
  ["Esquerdo", "esquerdo@bolao.local", "123456", "user", 13],
  ["Obeson", "obeson@bolao.local", "123456", "user", 9],
  ["Guimacê", "guimace@bolao.local", "123456", "user", 9],
  ["Juruna", "juruna@bolao.local", "123456", "user", 3],
  ["Administrador", "admin@bolao.local", "admin123", "admin", 0]
];

const games = [
  ["1","2026-06-11","2026-06-11T16:00:00-03:00","A","México","África do Sul","México"],
  ["2","2026-06-11","2026-06-11T23:00:00-03:00","A","Coreia do Sul","Tchéquia","Coreia do Sul"],
  ["3","2026-06-12","2026-06-12T16:00:00-03:00","B","Canadá","Bósnia e Herzegovina","Empate"],
  ["4","2026-06-12","2026-06-12T22:00:00-03:00","D","Estados Unidos","Paraguai","Estados Unidos"],
  ["5","2026-06-13","2026-06-13T16:00:00-03:00","B","Catar","Suíça","Empate"],
  ["6","2026-06-13","2026-06-13T19:00:00-03:00","C","Brasil","Marrocos","Empate"],
  ["7","2026-06-13","2026-06-13T22:00:00-03:00","C","Haiti","Escócia","Escócia"],
  ["8","2026-06-14","2026-06-14T01:00:00-03:00","D","Austrália","Turquia","Austrália"],
  ["9","2026-06-14","2026-06-14T14:00:00-03:00","E","Alemanha","Curaçao","Alemanha"],
  ["10","2026-06-14","2026-06-14T17:00:00-03:00","F","Holanda","Japão","Empate"],
  ["11","2026-06-14","2026-06-14T20:00:00-03:00","E","Costa do Marfim","Equador","Costa do Marfim"],
  ["12","2026-06-14","2026-06-14T23:00:00-03:00","F","Suécia","Tunísia","Suécia"],
  ["13","2026-06-15","2026-06-15T13:00:00-03:00","H","Espanha","Cabo Verde","Empate"],
  ["14","2026-06-15","2026-06-15T16:00:00-03:00","G","Bélgica","Egito","Empate"],
  ["15","2026-06-15","2026-06-15T19:00:00-03:00","H","Arábia Saudita","Uruguai","Empate"],
  ["16","2026-06-15","2026-06-15T22:00:00-03:00","G","Irã","Nova Zelândia","Empate"],
  ["17","2026-06-16","2026-06-16T16:00:00-03:00","I","França","Senegal","França"],
  ["18","2026-06-16","2026-06-16T19:00:00-03:00","I","Iraque","Noruega","Noruega"],
  ["19","2026-06-16","2026-06-16T22:00:00-03:00","J","Argentina","Argélia","Argentina"],
  ["20","2026-06-17","2026-06-17T01:00:00-03:00","J","Áustria","Jordânia","Áustria"],
  ["21","2026-06-17","2026-06-17T14:00:00-03:00","K","Portugal","RD Congo","Empate"],
  ["22","2026-06-17","2026-06-17T17:00:00-03:00","L","Inglaterra","Croácia","Empate"],
  ["23","2026-06-17","2026-06-17T20:00:00-03:00","L","Gana","Panamá","Gana"],
  ["24","2026-06-17","2026-06-17T23:00:00-03:00","K","Uzbequistão","Colômbia","Colômbia"],
  ["25","2026-06-18","2026-06-18T13:00:00-03:00","A","Tchéquia","África do Sul","Empate"],
  ["26","2026-06-18","2026-06-18T16:00:00-03:00","B","Suíça","Bósnia e Herzegovina","Suíça"],
  ["27","2026-06-18","2026-06-18T19:00:00-03:00","B","Canadá","Catar","Canadá"],
  ["28","2026-06-18","2026-06-18T22:00:00-03:00","A","México","Coreia do Sul",""],
  ["29","2026-06-19","2026-06-19T16:00:00-03:00","D","Estados Unidos","Austrália",""],
  ["30","2026-06-19","2026-06-19T19:00:00-03:00","C","Escócia","Marrocos",""],
  ["31","2026-06-19","2026-06-19T21:30:00-03:00","C","Brasil","Haiti",""],
  ["32","2026-06-20","2026-06-20T00:00:00-03:00","D","Turquia","Paraguai",""],
  ["33","2026-06-20","2026-06-20T14:00:00-03:00","F","Holanda","Suécia",""],
  ["34","2026-06-20","2026-06-20T17:00:00-03:00","E","Alemanha","Costa do Marfim",""],
  ["35","2026-06-20","2026-06-20T21:00:00-03:00","E","Equador","Curaçao",""],
  ["36","2026-06-21","2026-06-21T01:00:00-03:00","F","Tunísia","Japão",""],
  ["37","2026-06-21","2026-06-21T13:00:00-03:00","H","Espanha","Arábia Saudita",""],
  ["38","2026-06-21","2026-06-21T16:00:00-03:00","G","Bélgica","Irã",""],
  ["39","2026-06-21","2026-06-21T19:00:00-03:00","H","Uruguai","Cabo Verde",""],
  ["40","2026-06-21","2026-06-21T22:00:00-03:00","G","Nova Zelândia","Egito",""],
  ["41","2026-06-22","2026-06-22T14:00:00-03:00","J","Argentina","Áustria",""],
  ["42","2026-06-22","2026-06-22T18:00:00-03:00","I","França","Iraque",""],
  ["43","2026-06-22","2026-06-22T21:00:00-03:00","I","Noruega","Senegal",""],
  ["44","2026-06-23","2026-06-23T00:00:00-03:00","J","Jordânia","Argélia",""],
  ["45","2026-06-23","2026-06-23T14:00:00-03:00","K","Portugal","Uzbequistão",""],
  ["46","2026-06-23","2026-06-23T17:00:00-03:00","L","Inglaterra","Gana",""],
  ["47","2026-06-23","2026-06-23T20:00:00-03:00","L","Panamá","Croácia",""],
  ["48","2026-06-23","2026-06-23T23:00:00-03:00","K","Colômbia","RD Congo",""]
];

async function seed() {
  for (const [name, email, password, role, initialPoints] of participants) {
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("Usuário talvez já exista:", email);
      continue;
    }

    await setDoc(doc(db, "users", userCredential.user.uid), {
      name,
      email,
      role,
      initialPoints
    });

    console.log("Usuário criado:", email);
  }

  for (const [id, date, kickoff, group, home, away, result] of games) {
    await setDoc(doc(db, "games", id), {
      id,
      date,
      kickoff,
      group,
      home,
      away,
      result
    });

    console.log("Jogo criado:", id);
  }
}

seed();
