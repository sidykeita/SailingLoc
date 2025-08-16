import axios from 'axios';
import { API_URL } from '../lib/api';

const updateProfile = async (userId, data) => {
  // Récupère le token du localStorage (ou autre selon ton AuthContext)
  const token = localStorage.getItem('token');
  const res = await axios.patch(
    `${API_URL}/${userId}`,
    data,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  return res.data;
};

const getAllUsers = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  return res.data;
};

export default {
  updateProfile,
  getAllUsers,
};
