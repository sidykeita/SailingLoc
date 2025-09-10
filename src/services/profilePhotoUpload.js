import { storage } from './firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadProfilePhoto = async (file, userId) => {
  if (!file) throw new Error('Aucun fichier fourni');
  
  // Vérifier que c'est une image
  if (!file.type.startsWith('image/')) {
    throw new Error('Seules les images sont acceptées');
  }
  
  // Créer un nom de fichier unique pour la photo de profil
  const timestamp = Date.now();
  const fileName = `profile_${userId}_${timestamp}.${file.name.split('.').pop()}`;
  
  // Référence vers le dossier profiles
  const storageRef = ref(storage, `profiles/${fileName}`);
  
  try {
    // Upload du fichier
    const snapshot = await uploadBytes(storageRef, file);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      fileName: fileName,
      path: `profiles/${fileName}`
    };
  } catch (error) {
    console.error('Erreur upload photo Firebase:', error);
    throw new Error('Erreur lors de l\'upload de la photo');
  }
};
