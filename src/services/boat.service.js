import apiClient from './api.service';

class BoatService {
  // Obtenir tous les bateaux avec filtres et pagination
  async getAllBoats(filters = {}) {
    try {
      const response = await apiClient.get('/boats', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir un bateau par son ID
  async getBoatById(id) {
    try {
      const response = await apiClient.get(`/boats/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir les bateaux d'un propriétaire
  async getMyBoats() {
    try {
      const response = await apiClient.get('/boats/user/my-boats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Créer un nouveau bateau
  async createBoat(boatData) {
    try {
      const response = await apiClient.post('/boats', boatData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mettre à jour un bateau
  async updateBoat(id, boatData) {
    try {
      const response = await apiClient.put(`/boats/${id}`, boatData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Supprimer un bateau
  async deleteBoat(id) {
    try {
      const response = await apiClient.delete(`/boats/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Télécharger une image de bateau
  async uploadBoatImage(id, imageData) {
    try {
      const formData = new FormData();
      formData.append('image', imageData.file);
      
      if (imageData.caption) {
        formData.append('caption', imageData.caption);
      }
      
      const response = await apiClient.post(`/boats/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Supprimer une image de bateau
  async deleteBoatImage(boatId, imageId) {
    try {
      const response = await apiClient.delete(`/boats/${boatId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir la disponibilité d'un bateau
  async getBoatAvailability(id) {
    try {
      const response = await apiClient.get(`/boats/${id}/availability`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mettre à jour la disponibilité d'un bateau
  async updateBoatAvailability(id, availabilityData) {
    try {
      const response = await apiClient.post(`/boats/${id}/availability`, {
        availability: availabilityData
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir les avis d'un bateau
  async getBoatReviews(id) {
    try {
      const response = await apiClient.get(`/boats/${id}/reviews`);
      return response.data;
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

export default new BoatService();
