import api from '../axios.config';

export const getSales = (params) =>
  api.get('/sales', { params });

export const getSaleById = (id) =>
  api.get(`/sales/${id}`);

export const createSale = (data) =>
  api.post('/sales', data);

export const voidSale = (id, data) =>
  api.patch(`/sales/${id}/void`, data);

export const getSalesStats = (params) =>
  api.get('/sales/stats', { params });