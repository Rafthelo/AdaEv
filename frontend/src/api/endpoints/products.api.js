import api from '../axios.config';

export const getProducts = (params) =>
  api.get('/products', { params });

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const createProduct = (data) =>
  api.post('/products', data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const deactivateProduct = (id) =>
  api.patch(`/products/${id}/deactivate`);