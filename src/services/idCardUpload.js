import { storage } from './firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadIdCard = async (file, userId) => {
  if (!file) throw new Error('Aucun fichier fourni');
  
  // Créer un nom de fichier unique
  const timestamp = Date.now();
  const fileName = `${userId}_${timestamp}_${file.name}`;
  
  // Référence vers le dossier cv (comme demandé)
  const storageRef = ref(storage, `cv/${fileName}`);
  
  try {
    // Upload du fichier
    const snapshot = await uploadBytes(storageRef, file);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      fileName: fileName,
      path: `cv/${fileName}`
    };
  } catch (error) {
    console.error('Erreur upload Firebase:', error);
    throw new Error('Erreur lors de l\'upload du fichier');
  }
};
