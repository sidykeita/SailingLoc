import apiClient from './api.service';

// Service d'authentification réel qui utilise l'API backend
class AuthService {
  // Inscription d'un nouvel utilisateur
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Connexion d'un utilisateur existant
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Stocker le token dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Déconnexion
  async logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Appel API pour déconnexion (si nécessaire)
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Obtenir les informations de l'utilisateur connecté
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/user');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Gérer les erreurs de manière uniforme
  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || error.response.data.error);
    }
    return error;
  }
}

export default new AuthService();
