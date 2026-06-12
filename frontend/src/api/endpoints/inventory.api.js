import api from '../axios.config';

export const getInventory = (params) =>
  api.get('/inventory', { params });

export const getInventoryById = (id) =>
  api.get(`/inventory/${id}`);

export const adjustStock = (data) =>
  api.post('/inventory/adjust', data);

export const setMinStock = (id, data) =>
  api.patch(`/inventory/${id}/min-stock`, data);

export const getMovements = (id, params) =>
  api.get(`/inventory/${id}/movements`, { params });