import api from '../axios.config';

export const getMovements = (params) =>
  api.get('/finance', { params });

export const getMovementById = (id) =>
  api.get(`/finance/${id}`);

export const createMovement = (data) =>
  api.post('/finance', data);

export const updateMovement = (id, data) =>
  api.put(`/finance/${id}`, data);

export const deleteMovement = (id, reason) =>
  api.delete(`/finance/${id}`, { data: { reason } });

export const getFinanceSummary = (eventId) =>
  api.get('/finance/summary', { params: { event_id: eventId } });