import apiClient from './api.service';

class AuthService {
  // Inscription d'un nouvel utilisateur
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      if (response.data.success) {
        this.setTokens(response.data.token, response.data.refreshToken);
        this.setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Connexion d'un utilisateur
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.success) {
        this.setTokens(response.data.token, response.data.refreshToken);
        this.setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Déconnexion d'un utilisateur
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
      this.clearAuth();
      return { success: true };
    } catch (error) {
      this.clearAuth();
      throw this.handleError(error);
    }
  }

  // Récupérer les informations de l'utilisateur connecté
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mettre à jour le profil de l'utilisateur
  async updateProfile(userData) {
    try {
      const response = await apiClient.put('/auth/update-profile', userData);
      if (response.data.success) {
        this.setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Changer le mot de passe
  async changePassword(passwordData) {
    try {
      const response = await apiClient.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Rafraîchir le token JWT
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Refresh token non disponible');
      }
      
      const response = await apiClient.post('/auth/refresh-token', { refreshToken });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      this.clearAuth();
      throw this.handleError(error);
    }
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Obtenir l'utilisateur actuel depuis le stockage local
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Stocker les tokens dans le stockage local
  setTokens(token, refreshToken) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Stocker l'utilisateur dans le stockage local
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Effacer toutes les données d'authentification
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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

export default new AuthService();
