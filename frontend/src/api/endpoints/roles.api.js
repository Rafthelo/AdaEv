import api from '../axios.config';

export const getRoles = () =>
  api.get('/roles');

export const getRoleById = (id) =>
  api.get(`/roles/${id}`);

export const createRole = (data) =>
  api.post('/roles', data);

export const updateRole = (id, data) =>
  api.put(`/roles/${id}`, data);

export const assignPermissions = (id, permissions) =>
  api.patch(`/roles/${id}/permissions`, { permissions });