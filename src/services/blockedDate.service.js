import apiClient from './api.service';

class BlockedDateService {
  async listByBoat(boatId) {
    const res = await apiClient.get(`/blocks/boat/${boatId}`);
    return res.data;
  }

  async create(payload) {
    const res = await apiClient.post('/blocks', payload);
    return res.data;
  }

  async remove(id) {
    const res = await apiClient.delete(`/blocks/${id}`);
    return res.data;
  }
}

export default new BlockedDateService();
