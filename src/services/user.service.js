import axios from 'axios';
import { API_URL } from '../lib/api';

const updateProfile = async (userData) => {
  const token = localStorage.getItem('token');
  const { _id, ...data } = userData;
  
  // Ne garder que les champs qui peuvent être mis à jour
  const updateData = {
    email: data.email,
    phone: data.phone,
    // Ajouter d'autres champs modifiables si nécessaire
  };

  const res = await axios.patch(
    `${API_URL}/users/${_id}`,
    updateData,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
};

const getAllUsers = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/auth/users`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  return res.data;
};

const getUserById = async (userId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/auth/users/${userId}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  return res.data;
};

const deleteUser = async (userId) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${API_URL}/auth/users/${userId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return res.data;
};

export default {
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  // Supprimer le compte courant (soft delete) avec confirmation de mot de passe
  async deleteMe(currentPassword) {
    const token = localStorage.getItem('token');
    const res = await axios.delete(`${API_URL}/users/me`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json',
      },
      data: { currentPassword },
    });
    return res.data;
  },
};
