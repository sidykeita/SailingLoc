// Ce fichier configure Firebase Storage pour upload de fichiers
import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAweKIX8uGuGkK6N0zxeGGtIgszYgsAceY",
  authDomain: "sailingloc-photo.firebaseapp.com",
  projectId: "sailingloc-photo",
  storageBucket: "sailingloc-photo.firebasestorage.app",
  messagingSenderId: "962161847677",
  appId: "1:962161847677:web:941b6fcba034a3b73e3014",
  measurementId: "G-X3KCDCSS3F"
};


// Empêche l'erreur duplicate-app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

export { storage };
