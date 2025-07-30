import api from './api';

/**
 * Service pour gérer les bateaux
 */
const boatService = {
  /**
   * Récupère tous les bateaux avec filtres optionnels
   * @param {Object} filters - Filtres à appliquer
   * @param {number} filters.minPrice - Prix minimum
   * @param {number} filters.maxPrice - Prix maximum
   * @param {number} filters.minSize - Taille minimum en mètres
   * @param {number} filters.maxSize - Taille maximum en mètres
   * @param {string} filters.type - Type de bateau (voilier, moteur, catamaran, etc.)
   * @param {string} filters.location - Localisation (ville, port)
   * @param {number} page - Numéro de page pour la pagination
   * @param {number} limit - Nombre d'éléments par page
   * @returns {Promise} Liste des bateaux
   */
  getAllBoats: async (filters = {}, page = 1, limit = 10) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Ajout des filtres à la requête
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.minSize) queryParams.append('minSize', filters.minSize);
      if (filters.maxSize) queryParams.append('maxSize', filters.maxSize);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.location) queryParams.append('location', filters.location);
      
      // Pagination
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      const response = await api.get(`/boats?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des bateaux' };
    }
  },

  /**
   * Récupère un bateau par son ID
   * @param {string} id - ID du bateau
   * @returns {Promise} Détails du bateau
   */
  getBoatById: async (id) => {
    try {
      const response = await api.get(`/boats/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du bateau' };
    }
  },

  /**
   * Récupère les bateaux d'un propriétaire
   * @returns {Promise} Liste des bateaux du propriétaire
   */
  getMyBoats: async () => {
    try {
      const response = await api.get('/boats/my-boats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de vos bateaux' };
    }
  },

  /**
   * Crée un nouveau bateau
   * @param {Object} boatData - Données du bateau
   * @returns {Promise} Bateau créé
   */
  createBoat: async (boatData) => {
    try {
      const response = await api.post('/boats', boatData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création du bateau' };
    }
  },

  /**
   * Met à jour un bateau
   * @param {string} id - ID du bateau
   * @param {Object} boatData - Données à mettre à jour
   * @returns {Promise} Bateau mis à jour
   */
  updateBoat: async (id, boatData) => {
    try {
      const response = await api.put(`/boats/${id}`, boatData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du bateau' };
    }
  },

  /**
   * Supprime un bateau
   * @param {string} id - ID du bateau
   * @returns {Promise} Message de confirmation
   */
  deleteBoat: async (id) => {
    try {
      const response = await api.delete(`/boats/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression du bateau' };
    }
  },

  /**
   * Télécharge une image pour un bateau
   * @param {string} boatId - ID du bateau
   * @param {File} imageFile - Fichier image
   * @returns {Promise} URL de l'image téléchargée
   */
  uploadBoatImage: async (boatId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post(`/boats/${boatId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors du téléchargement de l\'image' };
    }
  },

  /**
   * Récupère les disponibilités d'un bateau
   * @param {string} id - ID du bateau
   * @param {Date} startDate - Date de début
   * @param {Date} endDate - Date de fin
   * @returns {Promise} Disponibilités du bateau
   */
  getBoatAvailability: async (id, startDate, endDate) => {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate.toISOString());
      if (endDate) queryParams.append('endDate', endDate.toISOString());
      
      const response = await api.get(`/boats/${id}/availability?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des disponibilités' };
    }
  }
};

export default boatService;
