const usersRepository = require('./users.repository');
const auditService    = require('../audit/audit.service');
const { hashPassword, comparePassword } = require('../../helpers/crypto.helper');

const getAll = async (filters, query) => {
  return usersRepository.findAll(filters, query);
};

const getById = async (id) => {
  const user = await usersRepository.findById(id);
  if (!user) {
    throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  const roles = await usersRepository.getUserRoles(id);
  return { ...user, roles };
};

const create = async (data, createdBy, meta = {}) => {
  // Verificar duplicados
  const existingUsername = await usersRepository.findByUsername(data.username);
  if (existingUsername) {
    throw Object.assign(new Error('El nombre de usuario ya existe'), { statusCode: 409, code: 'CONFLICT' });
  }

  const existingEmail = await usersRepository.findByEmail(data.email);
  if (existingEmail) {
    throw Object.assign(new Error('El email ya está registrado'), { statusCode: 409, code: 'CONFLICT' });
  }

  const password_hash = await hashPassword(data.password);

  let newUserId;
  await require('../../config/database').transaction(async (conn) => {
    newUserId = await usersRepository.create({ ...data, password_hash }, conn);
    await usersRepository.assignRoles(newUserId, data.roles, conn);
  });

  await auditService.log({
    user_id:    createdBy,
    action:     'users:create',
    entity:     'users',
    entity_id:  newUserId,
    new_values: { username: data.username, email: data.email },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(newUserId);
};

const update = async (id, data, updatedBy, meta = {}) => {
  const existing = await usersRepository.findById(id);
  if (!existing) {
    throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  if (data.email && data.email !== existing.email) {
    const emailTaken = await usersRepository.findByEmail(data.email);
    if (emailTaken) {
      throw Object.assign(new Error('El email ya está registrado'), { statusCode: 409, code: 'CONFLICT' });
    }
  }

  await usersRepository.update(id, data);

  if (data.roles) {
    await usersRepository.assignRoles(id, data.roles);
  }

  await auditService.log({
    user_id:    updatedBy,
    action:     'users:update',
    entity:     'users',
    entity_id:  id,
    old_values: existing,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const changePassword = async (id, currentPassword, newPassword, meta = {}) => {
  const hash = await usersRepository.findPasswordHash(id);
  if (!hash) {
    throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  const valid = await comparePassword(currentPassword, hash);
  if (!valid) {
    throw Object.assign(new Error('La contraseña actual es incorrecta'), { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  const newHash = await hashPassword(newPassword);
  await usersRepository.update(id, { password_hash: newHash });

  await auditService.log({
    user_id:    id,
    action:     'users:change_password',
    entity:     'users',
    entity_id:  id,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
};

const deactivate = async (id, deactivatedBy, meta = {}) => {
  const existing = await usersRepository.findById(id);
  if (!existing) {
    throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  if (id === deactivatedBy) {
    throw Object.assign(new Error('No puedes desactivar tu propio usuario'), { statusCode: 422, code: 'BUSINESS_ERROR' });
  }

  await usersRepository.update(id, { is_active: 0 });

  await auditService.log({
    user_id:    deactivatedBy,
    action:     'users:deactivate',
    entity:     'users',
    entity_id:  id,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
};

module.exports = { getAll, getById, create, update, changePassword, deactivate };