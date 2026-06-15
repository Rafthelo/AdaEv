import api from '../axios.config';

export const getMovements = (params) =>
  api.get('/finance', { params });

export const getMovementById = (id) =>
  api.get(`/finance/${id}`);

export const createMovement = (data) =>
  api.post('/finance', data);

export const deleteMovement = (id) =>
  api.delete(`/finance/${id}`);

export const getFinanceSummary = (eventId) =>
  api.get('/finance/summary', { params: { event_id: eventId } });