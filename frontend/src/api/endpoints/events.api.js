import api from '../axios.config';

export const getEvents = (params) =>
  api.get('/events', { params });

export const getEventById = (id) =>
  api.get(`/events/${id}`);

export const createEvent = (data) =>
  api.post('/events', data);

export const updateEvent = (id, data) =>
  api.put(`/events/${id}`, data);

export const getEventProducts = (id) =>
  api.get(`/events/${id}/products`);

export const addEventProduct = (id, data) =>
  api.post(`/events/${id}/products`, data);

export const removeEventProduct = (id, productId) =>
  api.delete(`/events/${id}/products/${productId}`);