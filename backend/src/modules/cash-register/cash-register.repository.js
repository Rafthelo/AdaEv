const pool = require('../../config/database');
const { getPagination, getPaginationMeta } = require('../../helpers/pagination.helper');

// === Cash Registers ===
const findAllRegisters = async () => {
  const [rows] = await pool.execute(
    `SELECT id, name, description, is_active, created_at
     FROM cash_registers
     ORDER BY name ASC`
  );
  return rows;
};

const findRegisterById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, description, is_active, created_at, updated_at
     FROM cash_registers WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const createRegister = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO cash_registers (name, description) VALUES (?, ?)`,
    [data.name, data.description || null]
  );
  return result.insertId;
};

// === Cash Sessions ===
const findAllSessions = async (filters = {}, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  let where = 'WHERE 1=1';
  const params = [];

  if (filters.cash_register_id) {
    where += ' AND cs.cash_register_id = ?';
    params.push(filters.cash_register_id);
  }
  if (filters.event_id) {
    where += ' AND cs.event_id = ?';
    params.push(filters.event_id);
  }
  if (filters.status) {
    where += ' AND cs.status = ?';
    params.push(filters.status);
  }

  const [rows] = await pool.execute(
    `SELECT
       cs.id, cs.cash_register_id, cs.event_id, cs.status,
       cs.opening_amount, cs.closing_amount, cs.expected_amount,
       cs.difference, cs.opened_at, cs.closed_at, cs.notes,
       cr.name  AS register_name,
       e.name   AS event_name,
       ou.username AS opened_by_username,
       cu.username AS closed_by_username
     FROM cash_sessions cs
     JOIN cash_registers cr  ON cs.cash_register_id = cr.id
     LEFT JOIN events e      ON cs.event_id   = e.id
     LEFT JOIN users ou      ON cs.opened_by  = ou.id
     LEFT JOIN users cu      ON cs.closed_by  = cu.id
     ${where}
     ORDER BY cs.opened_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM cash_sessions cs ${where}`,
    params
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

const findSessionById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       cs.id, cs.cash_register_id, cs.event_id, cs.status,
       cs.opening_amount, cs.closing_amount, cs.expected_amount,
       cs.difference, cs.opened_at, cs.closed_at, cs.notes,
       cr.name  AS register_name,
       e.name   AS event_name,
       ou.username AS opened_by_username,
       cu.username AS closed_by_username
     FROM cash_sessions cs
     JOIN cash_registers cr  ON cs.cash_register_id = cr.id
     LEFT JOIN events e      ON cs.event_id  = e.id
     LEFT JOIN users ou      ON cs.opened_by = ou.id
     LEFT JOIN users cu      ON cs.closed_by = cu.id
     WHERE cs.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findOpenSession = async (cashRegisterId) => {
  const [rows] = await pool.execute(
    `SELECT id FROM cash_sessions
     WHERE cash_register_id = ? AND status = 'open'`,
    [cashRegisterId]
  );
  return rows[0] || null;
};

const openSession = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO cash_sessions
       (cash_register_id, event_id, opened_by, opening_amount, status, notes)
     VALUES (?, ?, ?, ?, 'open', ?)`,
    [
      data.cash_register_id,
      data.event_id      || null,
      data.opened_by,
      data.opening_amount,
      data.notes         || null,
    ]
  );

  // Registrar movimiento de apertura
  await pool.execute(
    `INSERT INTO cash_movements (cash_session_id, type, amount, reason, created_by)
     VALUES (?, 'open', ?, 'Apertura de caja', ?)`,
    [result.insertId, data.opening_amount, data.opened_by]
  );

  return result.insertId;
};

const closeSession = async (id, data) => {
  await pool.execute(
    `UPDATE cash_sessions SET
       status = 'closed',
       closed_by      = ?,
       closing_amount = ?,
       expected_amount = ?,
       difference     = ?,
       closed_at      = NOW(),
       notes          = COALESCE(?, notes)
     WHERE id = ?`,
    [
      data.closed_by,
      data.closing_amount,
      data.expected_amount,
      data.difference,
      data.notes || null,
      id,
    ]
  );

  // Registrar movimiento de cierre
  await pool.execute(
    `INSERT INTO cash_movements (cash_session_id, type, amount, reason, created_by)
     VALUES (?, 'close', ?, 'Cierre de caja', ?)`,
    [id, data.closing_amount, data.closed_by]
  );
};

const createMovement = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO cash_movements (cash_session_id, type, amount, reason, created_by)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.cash_session_id,
      data.type,
      data.amount,
      data.reason     || null,
      data.created_by || null,
    ]
  );
  return result.insertId;
};

const getMovements = async (sessionId, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  const [rows] = await pool.execute(
    `SELECT
       cm.id, cm.type, cm.amount, cm.reason, cm.created_at,
       u.username AS created_by_username
     FROM cash_movements cm
     LEFT JOIN users u ON cm.created_by = u.id
     WHERE cm.cash_session_id = ?
     ORDER BY cm.created_at ASC
     LIMIT ${limit} OFFSET ${offset}`,
    [sessionId]
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM cash_movements WHERE cash_session_id = ?`,
    [sessionId]
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

const getSessionSalesTotal = async (sessionId) => {
  const session = await findSessionById(sessionId);
  if (!session) return 0;

  const [[{ total }]] = await pool.execute(
    `SELECT COALESCE(SUM(s.total), 0) AS total
     FROM sales s
     WHERE s.event_id = ?
       AND s.status = 'completed'
       AND s.created_at BETWEEN ? AND COALESCE(?, NOW())`,
    [session.event_id, session.opened_at, session.closed_at]
  );
  return parseFloat(total);
};

module.exports = {
  findAllRegisters, findRegisterById, createRegister,
  findAllSessions, findSessionById, findOpenSession,
  openSession, closeSession,
  createMovement, getMovements, getSessionSalesTotal,
};