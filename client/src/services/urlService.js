import api from './api';

export const urlService = {
  createUrl: async (urlData) => {
    const response = await api.post('/urls', urlData);
    return response.data;
  },

  getUserUrls: async () => {
    const response = await api.get('/urls');
    return response.data;
  },

  getUrlById: async (id) => {
    const response = await api.get(`/urls/${id}`);
    return response.data;
  },

  updateUrl: async (id, updateData) => {
    const response = await api.put(`/urls/${id}`, updateData);
    return response.data;
  },

  deleteUrl: async (id) => {
    const response = await api.delete(`/urls/${id}`);
    return response.data;
  },
};

export default urlService;
