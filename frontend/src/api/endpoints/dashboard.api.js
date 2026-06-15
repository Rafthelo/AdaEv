import api from '../axios.config';

export const getActiveEvents = () =>
  api.get('/dashboard/active-events');

export const getDashboardStats = (eventId = null) =>
  api.get('/dashboard', { params: eventId ? { event_id: eventId } : {} });