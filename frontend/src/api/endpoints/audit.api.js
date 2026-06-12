import api from '../axios.config';

export const getAuditLogs = (params) =>
  api.get('/audit', { params });

export const getAuditLogById = (id) =>
  api.get(`/audit/${id}`);