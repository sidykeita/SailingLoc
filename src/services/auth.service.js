import apiClient from './api.service';

// Service d'authentification réel qui utilise l'API backend
class AuthService {
  // Inscription d'un nouvel utilisateur
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }

  // Connexion d'un utilisateur existant
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    // Stocker le token dans localStorage
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { user };
  }

  // Déconnexion
  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    await apiClient.post('/auth/logout');
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Obtenir les informations de l'utilisateur connecté
  async getCurrentUser() {
    const response = await apiClient.get('/auth/user');
    return response.data;
  }
}

export default new AuthService();
