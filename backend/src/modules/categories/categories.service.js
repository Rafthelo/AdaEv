const categoriesRepository = require('./categories.repository');
const auditService         = require('../audit/audit.service');

const getAll = async (filters) => {
  return categoriesRepository.findAll(filters);
};

const getById = async (id) => {
  const category = await categoriesRepository.findById(id);
  if (!category) {
    throw Object.assign(new Error('Categoría no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return category;
};

const create = async (data, createdBy, meta = {}) => {
  const existing = await categoriesRepository.findByName(data.name, data.parent_id);
  if (existing) {
    throw Object.assign(new Error('Ya existe una categoría con ese nombre'), { statusCode: 409, code: 'CONFLICT' });
  }

  if (data.parent_id) {
    const parent = await categoriesRepository.findById(data.parent_id);
    if (!parent) {
      throw Object.assign(new Error('Categoría padre no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
    }
  }

  const id = await categoriesRepository.create(data);

  await auditService.log({
    user_id:    createdBy,
    action:     'categories:create',
    entity:     'categories',
    entity_id:  id,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const update = async (id, data, updatedBy, meta = {}) => {
  const existing = await categoriesRepository.findById(id);
  if (!existing) {
    throw Object.assign(new Error('Categoría no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  // Evitar que una categoría sea su propio padre
  if (data.parent_id && Number(data.parent_id) === Number(id)) {
    throw Object.assign(new Error('Una categoría no puede ser su propio padre'), { statusCode: 422, code: 'BUSINESS_ERROR' });
  }

  await categoriesRepository.update(id, data);

  await auditService.log({
    user_id:    updatedBy,
    action:     'categories:update',
    entity:     'categories',
    entity_id:  id,
    old_values: existing,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const deactivate = async (id, deactivatedBy, meta = {}) => {
  const existing = await categoriesRepository.findById(id);
  if (!existing) {
    throw Object.assign(new Error('Categoría no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  const children = await categoriesRepository.getChildren(id);
  if (children.length > 0) {
    throw Object.assign(
      new Error('No se puede desactivar una categoría con subcategorías activas'),
      { statusCode: 422, code: 'BUSINESS_ERROR' }
    );
  }

  await categoriesRepository.update(id, { is_active: 0 });

  await auditService.log({
    user_id:    deactivatedBy,
    action:     'categories:deactivate',
    entity:     'categories',
    entity_id:  id,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
};

module.exports = { getAll, getById, create, update, deactivate };