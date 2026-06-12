import api from '../axios.config';

export const getDashboardStats = (params) =>
  api.get('/dashboard', { params });