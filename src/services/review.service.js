import axios from 'axios';
import { API_URL } from '../lib/api';

class ReviewService {
  // Créer un avis (review)
  async createReview(reviewData) {
    try {
      const response = await axios.post(`${API_URL}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  // Obtenir tous les avis (avec filtres et pagination)
  async getAllReviews(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/reviews`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir un avis par son ID
  async getReviewById(id) {
    try {
      const response = await axios.get(`${API_URL}/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir les avis d'un bateau
  async getReviewsByBoat(boatId, params = {}) {
    try {
      const response = await axios.get(`${API_URL}/reviews/boat/${boatId}`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir les avis d'un utilisateur (locataire)
  async getMyReviews() {
    try {
      const response = await axios.get(`${API_URL}/reviews/user/my-reviews`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mettre à jour un avis
  async updateReview(id, reviewData) {
    try {
      const response = await axios.put(`${API_URL}/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Supprimer un avis
  async deleteReview(id) {
    try {
      const response = await axios.delete(`${API_URL}/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Ajouter une réponse du propriétaire à un avis
  async addOwnerResponse(id, responseText) {
    try {
      const response = await axios.post(`${API_URL}/reviews/${id}/response`, { text: responseText });
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

export default new ReviewService();
