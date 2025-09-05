// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

// Read Firebase config from env with safe fallbacks for local dev
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAweKIX8uGuGkK6N0zxeGGtIgszYgsAceY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sailingloc-photo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sailingloc-photo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sailingloc-photo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "962161847677",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:962161847677:web:941b6fcba034a3b73e3014",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-X3KCDCSS3F"
};

const configuredBucket = firebaseConfig.storageBucket;
const gsBucket = (import.meta.env.VITE_FIREBASE_STORAGE_GS)
  ? import.meta.env.VITE_FIREBASE_STORAGE_GS
  : (configuredBucket?.startsWith('gs://') ? configuredBucket : `gs://${configuredBucket}`);

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app, gsBucket);

// Anonymous auth so Storage rules with request.auth pass (avoids 412)
const auth = getAuth(app);
signInAnonymously(auth).catch((err) => {
  // Do not block app if anonymous auth is disabled or fails
  console.warn('Firebase anonymous sign-in failed:', err?.message || err);
});
export { auth };
console.log("API Key utilisée:", import.meta.env.VITE_FIREBASE_API_KEY);
