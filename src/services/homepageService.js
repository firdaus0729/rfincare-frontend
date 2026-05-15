import { apiClient } from '../lib/apiClient';

export const homepageService = {
  async getNews() {
    const res = await apiClient.get('/public/homepage/news');
    return res.data;
  },
  async getVideos() {
    const res = await apiClient.get('/public/homepage/videos');
    return res.data;
  },
  async getSuccessStories() {
    const res = await apiClient.get('/public/success-stories');
    return res.data;
  },
  async submitStory(payload) {
    const res = await apiClient.post('/public/success-stories', payload);
    return res.data;
  },
  async calculateEligibility(payload) {
    const res = await apiClient.post('/public/eligibility/calculate', payload);
    return res.data;
  },
  async requestStatusOtp(payload) {
    const res = await apiClient.post('/public/status-check/request-otp', payload);
    return res.data;
  },
  async verifyStatusCheck(payload) {
    const res = await apiClient.post('/public/status-check/verify', payload);
    return res.data;
  },
  async getLegalPage(slug) {
    const res = await apiClient.get(`/public/legal/${slug}`);
    return res.data;
  },
};
