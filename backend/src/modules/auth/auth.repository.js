const pool = require('../../config/database');

const findUserByUsername = async (username) => {
  const [rows] = await pool.execute(
    `SELECT
       u.id, u.username, u.email, u.password_hash,
       u.first_name, u.last_name, u.is_active, u.last_login_at
     FROM users u
     WHERE u.username = ?`,
    [username]
  );
  return rows[0] || null;
};

const findUserById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       u.id, u.username, u.email,
       u.first_name, u.last_name, u.is_active
     FROM users u
     WHERE u.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const getUserPermissions = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT DISTINCT p.code
     FROM permissions p
     JOIN role_permissions rp ON p.id = rp.permission_id
     JOIN user_roles ur        ON rp.role_id = ur.role_id
     WHERE ur.user_id = ?`,
    [userId]
  );
  return rows.map((r) => r.code);
};

const getUserRoles = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT r.name
     FROM roles r
     JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [userId]
  );
  return rows.map((r) => r.name);
};

const saveRefreshToken = async (userId, token, expiresAt) => {
  await pool.execute(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES (?, ?, ?)`,
    [userId, token, expiresAt]
  );
};

const findRefreshToken = async (token) => {
  const [rows] = await pool.execute(
    `SELECT * FROM refresh_tokens
     WHERE token = ?
       AND revoked = 0
       AND expires_at > NOW()`,
    [token]
  );
  return rows[0] || null;
};

const revokeRefreshToken = async (token) => {
  await pool.execute(
    `UPDATE refresh_tokens SET revoked = 1 WHERE token = ?`,
    [token]
  );
};

const revokeAllUserTokens = async (userId) => {
  await pool.execute(
    `UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?`,
    [userId]
  );
};

const updateLastLogin = async (userId) => {
  await pool.execute(
    `UPDATE users SET last_login_at = NOW() WHERE id = ?`,
    [userId]
  );
};

module.exports = {
  findUserByUsername,
  findUserById,
  getUserPermissions,
  getUserRoles,
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  updateLastLogin,
};