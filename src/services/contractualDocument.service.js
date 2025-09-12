import apiClient from './api.service';

class ContractualDocumentService {
  // Upload d'un document contractuel
  async uploadDocument(documentType, file) {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const { data } = await apiClient.post('/contractual-documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
