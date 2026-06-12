import api from '../axios.config';

export const getRegisters = () =>
  api.get('/cash-registers/registers');

export const createRegister = (data) =>
  api.post('/cash-registers/registers', data);

export const getSessions = (params) =>
  api.get('/cash-registers/sessions', { params });

export const getSessionById = (id) =>
  api.get(`/cash-registers/sessions/${id}`);

export const openSession = (data) =>
  api.post('/cash-registers/sessions/open', data);

export const closeSession = (id, data) =>
  api.patch(`/cash-registers/sessions/${id}/close`, data);

export const createMovement = (data) =>
  api.post('/cash-registers/movements', data);

export const getSessionMovements = (id, params) =>
  api.get(`/cash-registers/sessions/${id}/movements`, { params });