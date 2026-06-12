const permissionsRepository = require('./permissions.repository');

const getAll = async (filters) => {
  const permissions = await permissionsRepository.findAll(filters);

  // Agrupar por módulo
  const grouped = permissions.reduce((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  }, {});

  return { permissions, grouped };
};

const getById = async (id) => {
  const permission = await permissionsRepository.findById(id);
  if (!permission) {
    throw Object.assign(new Error('Permiso no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return permission;
};

const getModules = async () => {
  return permissionsRepository.getModules();
};

module.exports = { getAll, getById, getModules };