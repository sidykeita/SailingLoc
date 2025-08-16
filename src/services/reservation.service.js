import axios from 'axios';
import { API_URL } from '../lib/api';

class ReservationService {
  // Créer une nouvelle réservation
  async createReservation(reservationData) {
    try {
      const response = await axios.post(`${API_URL}/reservations`, reservationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir les réservations d'un locataire
  async getMyReservations() {
    try {
      const response = await axios.get(`${API_URL}/reservations/user/my-reservations`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir les réservations des bateaux d'un propriétaire
  async getMyBoatsReservations() {
    try {
      const response = await axios.get(`${API_URL}/reservations/owner`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir une réservation par son ID
  async getReservationById(id) {
    try {
      const response = await axios.get(`${API_URL}/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mettre à jour le statut d'une réservation (pour les propriétaires)
  async updateReservationStatus(id, statusData) {
    try {
      const response = await axios.put(`${API_URL}/reservations/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Annuler une réservation (pour les locataires)
  async cancelReservation(id, reason) {
    try {
      const response = await axios.put(`${API_URL}/reservations/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Ajouter un avis à une réservation
  async addReview(id, reviewData) {
    try {
      const response = await axios.post(`${API_URL}/reservations/${id}/review`, reviewData);
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

  // Obtenir toutes les réservations d'un bateau donné
  async getReservationsByBoat(boatId) {
    try {
      const response = await axios.get(`${API_URL}/reservations/boat/${boatId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtenir toutes les réservations (admin/global)
  async getAllReservations() {
    try {
      const response = await axios.get(`${API_URL}/reservations`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new ReservationService();
