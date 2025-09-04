// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAweKIX8uGuGkK6N0zxeGGtIgszYgsAceY",
  authDomain: "sailingloc-photo.firebaseapp.com",
  projectId: "sailingloc-photo",
  storageBucket: "sailingloc-photo.firebasestorage.app",
  messagingSenderId: "962161847677",
  appId: "1:962161847677:web:941b6fcba034a3b73e3014",
  measurementId: "G-X3KCDCSS3F"
};

const app = initializeApp(firebaseConfig);

// Cible explicitement le bucket custom
export const storage = getStorage(app, 'gs://sailingloc-photo.firebasestorage.app');

// Auth anonyme pour que request.auth soit présent côté Storage (évite 412 si règles l'exigent)
const auth = getAuth(app);
signInAnonymously(auth).catch((err) => {
  // Évite de bloquer l'app si l'auth anonyme échoue (ex: désactivée côté console)
  console.warn('Firebase anonymous sign-in failed:', err?.message || err);
});
export { auth };
