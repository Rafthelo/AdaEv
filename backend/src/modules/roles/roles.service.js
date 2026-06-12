const rolesRepository = require('./roles.repository');
const auditService    = require('../audit/audit.service');

const PROTECTED_ROLES = ['superadmin'];

const getAll = async () => {
  return rolesRepository.findAll();
};

const getById = async (id) => {
  const role = await rolesRepository.findById(id);
  if (!role) {
    throw Object.assign(new Error('Rol no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  const permissions = await rolesRepository.getRolePermissions(id);
  return { ...role, permissions };
};

const create = async (data, createdBy, meta = {}) => {
  const existing = await rolesRepository.findByName(data.name);
  if (existing) {
    throw Object.assign(new Error('Ya existe un rol con ese nombre'), { statusCode: 409, code: 'CONFLICT' });
  }

  const roleId = await rolesRepository.create(data);

  if (data.permissions && data.permissions.length > 0) {
    await rolesRepository.assignPermissions(roleId, data.permissions);
  }

  await auditService.log({
    user_id:    createdBy,
    action:     'roles:create',
    entity:     'roles',
    entity_id:  roleId,
    new_values: { name: data.name },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(roleId);
};

const update = async (id, data, updatedBy, meta = {}) => {
  const existing = await rolesRepository.findById(id);
  if (!existing) {
    throw Object.assign(new Error('Rol no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  if (PROTECTED_ROLES.includes(existing.name)) {
    throw Object.assign(new Error('Este rol no puede ser modificado'), { statusCode: 422, code: 'BUSINESS_ERROR' });
  }

  await rolesRepository.update(id, data);

  if (data.permissions) {
    await rolesRepository.assignPermissions(id, data.permissions);
  }

  await auditService.log({
    user_id:    updatedBy,
    action:     'roles:update',
    entity:     'roles',
    entity_id:  id,
    old_values: existing,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const assignPermissions = async (id, permissionIds, updatedBy, meta = {}) => {
  const existing = await rolesRepository.findById(id);
  if (!existing) {
    throw Object.assign(new Error('Rol no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  if (PROTECTED_ROLES.includes(existing.name)) {
    throw Object.assign(new Error('Este rol no puede ser modificado'), { statusCode: 422, code: 'BUSINESS_ERROR' });
  }

  await rolesRepository.assignPermissions(id, permissionIds);

  await auditService.log({
    user_id:    updatedBy,
    action:     'roles:assign_permissions',
    entity:     'roles',
    entity_id:  id,
    new_values: { permissions: permissionIds },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

module.exports = { getAll, getById, create, update, assignPermissions };