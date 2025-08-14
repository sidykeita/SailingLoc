import axios from 'axios';

const API_URL = '/api/users';

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

export default {
  updateProfile,
};
