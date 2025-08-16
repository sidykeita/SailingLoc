import axios from 'axios';
import { API_URL } from '../lib/api';

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    console.log('[DEBUG][auth.service.js] Réponse login backend:', response.data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('[DEBUG][auth.service.js] Erreur login backend:', error.response?.data || error);
    throw error.response?.data || { message: 'Erreur de connexion' };
  }
};

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur d'inscription" };
  }
};

const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw { message: 'Non authentifié' };
  try {
    const response = await axios.get(`${API_URL}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erreur de récupération de l\'utilisateur' };
  }
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.user;
};

const logout = () => {
  localStorage.removeItem('token');
};

export default {
  login,
  register,
  getCurrentUser,
  logout,
};