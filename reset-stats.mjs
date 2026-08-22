import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAe3C_t4mhxCom1MuzRmmJM3coRcS-y5GM",
  authDomain: "mk8-random.firebaseapp.com",
  databaseURL: "https://mk8-random-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mk8-random",
  storageBucket: "mk8-random.firebasestorage.app",
  messagingSenderId: "955981216553",
  appId: "1:955981216553:web:e9135d716291da54d3d538"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const snapshot = await get(ref(db, 'players'));
const players = snapshot.val();

if (!players) {
  console.log("Aucun joueur trouvé.");
  process.exit(0);
}

for (const [id, player] of Object.entries(players)) {
  await update(ref(db, `players/${id}`), {
    streak: 0,
    bestStreak: 0,
    stats: { played: 0, first: 0, second: 0, third: 0 }
  });
  console.log(`✅ ${player.name} remis à zéro`);
}

console.log("\nTout l'historique a été remis à zéro !");
process.exit(0);
