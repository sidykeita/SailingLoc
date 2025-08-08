import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Remplacer les valeurs ci-dessous par celles de la console Firebase
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
export const storage = getStorage(app);