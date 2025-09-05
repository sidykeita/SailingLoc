// Ce fichier configure Firebase Storage pour upload de fichiers
import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Utilise les variables d'environnement VITE_ avec fallback local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAC5YVB9Hs9ErM759QhLHnrtczlWzq_U-k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sailingloc-74c7a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sailingloc-74c7a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sailingloc-74c7a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "347035024665",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:347035024665:web:0adda43ed509e81a431988",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6JWJWJWJWJ"
};

// Empêche l'erreur duplicate-app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Résout le bucket en gs:// (supporte si VITE_FIREBASE_STORAGE_GS est fourni)
const configuredBucket = firebaseConfig.storageBucket;
const gsBucket = (import.meta.env.VITE_FIREBASE_STORAGE_GS)
  ? import.meta.env.VITE_FIREBASE_STORAGE_GS
  : (configuredBucket && configuredBucket.startsWith('gs://') ? configuredBucket : (configuredBucket ? `gs://${configuredBucket}` : undefined));

const storage = gsBucket ? getStorage(app, gsBucket) : getStorage(app);

export { storage };
