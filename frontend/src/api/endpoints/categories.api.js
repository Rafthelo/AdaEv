import api from '../axios.config';

export const getCategories = (params) =>
  api.get('/categories', { params });

export const getCategoryById = (id) =>
  api.get(`/categories/${id}`);

export const createCategory = (data) =>
  api.post('/categories', data);

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data);

export const deactivateCategory = (id) =>
  api.patch(`/categories/${id}/deactivate`);