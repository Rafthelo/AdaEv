import api from '../axios.config';

export const getCustodyItems = (params) =>
  api.get('/custody', { params });

export const getCustodyById = (id) =>
  api.get(`/custody/${id}`);

export const searchByTicket = (ticketCode, eventId = null) =>
  api.get('/custody/search', { params: { ticket_code: ticketCode, event_id: eventId } });

export const createCustodyItem = (formData) =>
  api.post('/custody', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const returnCustodyItem = (id) =>
  api.patch(`/custody/${id}/return`);

export const markCustodyLost = (id) =>
  api.patch(`/custody/${id}/lost`);