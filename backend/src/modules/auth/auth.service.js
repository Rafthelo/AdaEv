const jwt            = require('jsonwebtoken');
const env            = require('../../config/environment');
const authRepository = require('./auth.repository');
const auditService   = require('../audit/audit.service');
const { comparePassword } = require('../../helpers/crypto.helper');
const { generateToken }   = require('../../helpers/crypto.helper');
const { addDays }         = require('../../helpers/date.helper');

const login = async (username, password, meta = {}) => {
  // 1. Buscar usuario
  const user = await authRepository.findUserByUsername(username);
  if (!user) {
    throw Object.assign(new Error('Credenciales inválidas'), { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  // 2. Verificar que esté activo
  if (!user.is_active) {
    throw Object.assign(new Error('Usuario inactivo'), { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  // 3. Verificar contraseña
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    throw Object.assign(new Error('Credenciales inválidas'), { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  // 4. Obtener roles y permisos
  const [roles, permissions] = await Promise.all([
    authRepository.getUserRoles(user.id),
    authRepository.getUserPermissions(user.id),
  ]);

  // 5. Generar access token
  const accessToken = jwt.sign(
    {
      id:          user.id,
      username:    user.username,
      email:       user.email,
      first_name:  user.first_name,
      last_name:   user.last_name,
      roles,
      permissions,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  // 6. Generar refresh token
  const refreshToken = generateToken();
  const expiresAt    = addDays(new Date(), 7);
  await authRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

  // 7. Actualizar last_login_at
  await authRepository.updateLastLogin(user.id);

  // 8. Auditoría
  await auditService.log({
    user_id:    user.id,
    action:     'auth:login',
    entity:     'users',
    entity_id:  user.id,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id:         user.id,
      username:   user.username,
      email:      user.email,
      first_name: user.first_name,
      last_name:  user.last_name,
      roles,
      permissions,
    },
  };
};

const refresh = async (token) => {
  // 1. Buscar refresh token válido
  const stored = await authRepository.findRefreshToken(token);
  if (!stored) {
    throw Object.assign(new Error('Refresh token inválido o expirado'), { statusCode: 401, code: 'AUTH_INVALID' });
  }

  // 2. Obtener usuario
  const user = await authRepository.findUserById(stored.user_id);
  if (!user || !user.is_active) {
    throw Object.assign(new Error('Usuario no encontrado o inactivo'), { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  // 3. Revocar token usado (rotación)
  await authRepository.revokeRefreshToken(token);

  // 4. Obtener roles y permisos actualizados
  const [roles, permissions] = await Promise.all([
    authRepository.getUserRoles(user.id),
    authRepository.getUserPermissions(user.id),
  ]);

  // 5. Generar nuevo access token
  const accessToken = jwt.sign(
    {
      id:         user.id,
      username:   user.username,
      email:      user.email,
      first_name: user.first_name,
      last_name:  user.last_name,
      roles,
      permissions,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  // 6. Generar nuevo refresh token
  const newRefreshToken = generateToken();
  const expiresAt       = addDays(new Date(), 7);
  await authRepository.saveRefreshToken(user.id, newRefreshToken, expiresAt);

  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (token, userId, meta = {}) => {
  if (token) {
    await authRepository.revokeRefreshToken(token);
  }

  await auditService.log({
    user_id:    userId,
    action:     'auth:logout',
    entity:     'users',
    entity_id:  userId,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
};

const me = async (userId) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  const [roles, permissions] = await Promise.all([
    authRepository.getUserRoles(userId),
    authRepository.getUserPermissions(userId),
  ]);

  return { ...user, roles, permissions };
};

module.exports = { login, refresh, logout, me };