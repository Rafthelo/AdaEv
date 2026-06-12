import api from '../axios.config';

export const login = (credentials) =>
  api.post('/auth/login', credentials);

export const logout = () =>
  api.post('/auth/logout');

export const refreshToken = () =>
  api.post('/auth/refresh');

export const getMe = () =>
  api.get('/auth/me');