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

export const confirmDelivery = (id, code) =>
  api.patch(`/sales/${id}/deliver`, { code });

export const getPendingOrders = () =>
  api.get('/sales/pending-orders');

export const markReady = (id) =>
  api.patch(`/sales/${id}/ready`);
export const getReadyOrders = () =>
  api.get('/sales/ready-orders');