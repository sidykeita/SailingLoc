import axios from 'axios';

const API_URL = '/api/owner-docs';

const getDocs = async (ownerId, token) => {
  const res = await axios.get(`${API_URL}/${ownerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const uploadDoc = async (type, file, token, ownerId) => {
  // 1. Upload sur Firebase Storage
  const storageRef = ref(storage, `ownerDocs/${ownerId}/${type}_${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  // 2. Envoie l’URL au backend pour sauvegarde
  const res = await axios.post(`${API_URL}/upload-url`, { type, url }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const deleteDoc = async (ownerId, type, token) => {
  const res = await axios.delete(`${API_URL}/${ownerId}/${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export default {
  getDocs,
  uploadDoc,
  deleteDoc,
};
