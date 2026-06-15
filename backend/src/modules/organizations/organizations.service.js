const orgsRepository = require('./organizations.repository');

const getAll = async (filters) => orgsRepository.findAll(filters);

const getById = async (id) => {
  const org = await orgsRepository.findById(id);
  if (!org) throw Object.assign(new Error('Organización no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
  return org;
};

const create = async (data) => {
  const id = await orgsRepository.create(data);
  return getById(id);
};

const update = async (id, data) => {
  await getById(id);
  await orgsRepository.update(id, data);
  return getById(id);
};

module.exports = { getAll, getById, create, update };