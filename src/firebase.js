// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAjMscUIRqKDumshKy4PQsq_H62epCYBro",
  authDomain: "sky-serve-project-k.firebaseapp.com",
  projectId: "sky-serve-project-k",
  storageBucket: "sky-serve-project-k.firebasestorage.app",
  messagingSenderId: "694619336714",
  appId: "1:694619336714:web:2d19c4b4b0c5f213de2ff3",
  measurementId: "G-54DFJXSBTG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };