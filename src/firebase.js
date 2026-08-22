import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

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
export const db = getDatabase(app);
export const auth = getAuth(app);
