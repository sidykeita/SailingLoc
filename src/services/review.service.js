import apiClient from './api.service';

class ReviewService {
  // Créer un avis (review)
  async createReview(reviewData) {
    try {
      const { data } = await apiClient.post(`/reviews`, reviewData);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  // Obtenir tous les avis (avec filtres et pagination)
  async getAllReviews(params = {}) {
    try {
      const { data } = await apiClient.get(`/reviews`, { params });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir un avis par son ID
  async getReviewById(id) {
    try {
      const { data } = await apiClient.get(`/reviews/${id}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir les avis d'un bateau
  async getReviewsByBoat(boatId, params = {}) {
    try {
      const merged = { ...params, boat: boatId };
      const { data } = await apiClient.get(`/reviews`, { params: merged });
      if (typeof window !== 'undefined') {
        console.debug('[review.service] getReviewsByBoat payload:', data);
      }
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir les avis d'un utilisateur (locataire)
  async getMyReviews() {
    try {
      const { data } = await apiClient.get(`/reviews/user/my-reviews`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mettre à jour un avis
  async updateReview(id, reviewData) {
    try {
      const { data } = await apiClient.put(`/reviews/${id}`, reviewData);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Supprimer un avis
  async deleteReview(id) {
    try {
      const { data } = await apiClient.delete(`/reviews/${id}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Ajouter une réponse du propriétaire à un avis
  async addOwnerResponse(id, responseText) {
    try {
      const { data } = await apiClient.post(`/reviews/${id}/response`, { text: responseText });
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

export default new ReviewService();
