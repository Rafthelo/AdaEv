import api from '../axios.config';

export const getEventSummary = (eventId) =>
  api.get(`/event-summary/${eventId}`);