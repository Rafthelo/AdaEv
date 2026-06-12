import api from '../axios.config';

export const getPermissions = () =>
  api.get('/permissions');