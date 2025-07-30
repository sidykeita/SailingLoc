import api from './api';

/**
 * Service pour gérer les réservations
 */
const reservationService = {
  /**
   * Crée une nouvelle réservation
   * @param {Object} reservationData - Données de la réservation
   * @param {string} reservationData.boatId - ID du bateau
   * @param {Date} reservationData.startDate - Date de début
   * @param {Date} reservationData.endDate - Date de fin
   * @param {number} reservationData.totalPrice - Prix total
   * @returns {Promise} Réservation créée
   */
  createReservation: async (reservationData) => {
    try {
      const response = await api.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de la réservation' };
    }
  },

  /**
   * Récupère les réservations de l'utilisateur connecté (locataire)
   * @returns {Promise} Liste des réservations
   */
  getMyReservations: async () => {
    try {
      const response = await api.get('/reservations/my-reservations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de vos réservations' };
    }
  },

  /**
   * Récupère les réservations pour les bateaux de l'utilisateur connecté (propriétaire)
   * @returns {Promise} Liste des réservations
   */
  getMyBoatsReservations: async () => {
    try {
      const response = await api.get('/reservations/my-boats-reservations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des réservations' };
    }
  },

  /**
   * Récupère une réservation par son ID
   * @param {string} id - ID de la réservation
   * @returns {Promise} Détails de la réservation
   */
  getReservationById: async (id) => {
    try {
      const response = await api.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de la réservation' };
    }
  },

  /**
   * Met à jour le statut d'une réservation (pour le propriétaire)
   * @param {string} id - ID de la réservation
   * @param {string} status - Nouveau statut (confirmed, rejected, cancelled)
   * @param {string} message - Message optionnel
   * @returns {Promise} Réservation mise à jour
   */
  updateReservationStatus: async (id, status, message = '') => {
    try {
      const response = await api.put(`/reservations/${id}/status`, { status, message });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du statut' };
    }
  },

  /**
   * Annule une réservation (pour le locataire)
   * @param {string} id - ID de la réservation
   * @param {string} reason - Raison de l'annulation
   * @returns {Promise} Réservation annulée
   */
  cancelReservation: async (id, reason = '') => {
    try {
      const response = await api.put(`/reservations/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'annulation de la réservation' };
    }
  },

  /**
   * Ajoute un avis à une réservation terminée
   * @param {string} reservationId - ID de la réservation
   * @param {Object} reviewData - Données de l'avis
   * @param {number} reviewData.rating - Note (1-5)
   * @param {string} reviewData.comment - Commentaire
   * @returns {Promise} Avis créé
   */
  addReview: async (reservationId, reviewData) => {
    try {
      const response = await api.post(`/reservations/${reservationId}/review`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'ajout de l\'avis' };
    }
  },

  /**
   * Récupère les réservations pour un bateau spécifique (pour le propriétaire)
   * @param {string} boatId - ID du bateau
   * @returns {Promise} Liste des réservations
   */
  getReservationsByBoat: async (boatId) => {
    try {
      const response = await api.get(`/reservations/boat/${boatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des réservations' };
    }
  }
};

export default reservationService;
