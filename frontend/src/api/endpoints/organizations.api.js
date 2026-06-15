import api from '../axios.config';

export const getOrganizations = (params) =>
  api.get('/organizations', { params });

export const getOrganizationById = (id) =>
  api.get(`/organizations/${id}`);

export const createOrganization = (data) =>
  api.post('/organizations', data);

export const updateOrganization = (id, data) =>
  api.put(`/organizations/${id}`, data);