import api from './api';

export const aiService = {
  analyzeUrl: async (url) => {
    const response = await api.post('/ai/analyze-url', { url });
    return response.data;
  },

  getAnalyticsInsights: async (analyticsData) => {
    const response = await api.post('/ai/analytics-insights', analyticsData);
    return response.data;
  },

  suggestCampaign: async (goal) => {
    const response = await api.post('/ai/suggest-campaign', { goal });
    return response.data;
  },
};

export default aiService;
