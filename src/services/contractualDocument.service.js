import apiClient from './api.service';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

class ContractualDocumentService {
  // Upload d'un document contractuel
  async uploadDocument(documentType, file) {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const { data } = await apiClient.post('/contractual-documents/upload', formData, { headers });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload avant inscription: envoie vers un dossier pre-register en utilisant un identifiant (email)
  async uploadPreRegister(documentType, file, emailKey) {
    try {
      const safeName = file.name.replace(/\s+/g, '_');
      const safeKey = String(emailKey || 'unknown').replace(/[^a-zA-Z0-9_.-]/g, '_');
      const firebasePath = `contractual-documents/pre-register/${safeKey}/${documentType}_${Date.now()}_${safeName}`;
      const storageRef = ref(storage, firebasePath);
      await uploadBytes(storageRef, file);
      const firebaseUrl = await getDownloadURL(storageRef);
      return {
        documentType,
        firebaseUrl,
        firebasePath,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload via Firebase client, puis enregistrement URL côté backend
  async uploadViaFirebase(documentType, file, userId) {
    try {
      const safeName = file.name.replace(/\s+/g, '_');
      const firebasePath = `contractual-documents/${userId}/${documentType}_${Date.now()}_${safeName}`;
      const storageRef = ref(storage, firebasePath);
      await uploadBytes(storageRef, file);
      const firebaseUrl = await getDownloadURL(storageRef);

      const payload = {
        documentType,
        firebaseUrl,
        firebasePath,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };
      const { data } = await apiClient.post('/contractual-documents/upload-url', payload);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Enregistrer une URL déjà uploadée côté client
  async recordUploadedUrl(documentType, firebaseUrl, firebasePath, meta = {}) {
    try {
      const payload = { documentType, firebaseUrl, firebasePath, ...meta };
      const { data } = await apiClient.post('/contractual-documents/upload-url', payload);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer les documents de l'utilisateur connecté
  async getUserDocuments() {
    try {
      const { data } = await apiClient.get('/contractual-documents');
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Supprimer un document
  async deleteDocument(documentId) {
    try {
      const { data } = await apiClient.delete(`/contractual-documents/${documentId}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Gérer les erreurs de manière uniforme
  handleError(error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || 'Une erreur est survenue',
        status: error.response.status
      };
    }
    return {
      success: false,
      message: error.message || 'Erreur de connexion au serveur',
      status: 500
    };
  }
}

export default new ContractualDocumentService();
