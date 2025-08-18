import api from '../lib/api';

export const getFavorites = () => api.get('/favorites');
export const addFavorite = (boatId) => api.post(`/favorites/${boatId}`);
export const removeFavorite = (boatId) => api.delete(`/favorites/${boatId}`);
