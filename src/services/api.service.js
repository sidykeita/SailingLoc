import axios from 'axios';

// Configuration de base d'axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT aux requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (non autorisé) et qu'il n'a pas déjà essayé
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // [DEBUG] Ne supprime plus le token automatiquement ici. Laisse le front gérer la déconnexion explicite.
      console.log('401 détecté dans axios, NE SUPPRIME PAS le token automatiquement');
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // (optionnel) localStorage.removeItem('refreshToken');
      // Ne pas rediriger automatiquement, laisse le front gérer la session expirée
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
