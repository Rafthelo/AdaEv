const pool = require('../../config/database');
const { getPagination, getPaginationMeta } = require('../../helpers/pagination.helper');
const findAll = async (filters = {}, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  let where = 'WHERE 1=1';
  const params = [];

  if (filters.event_id) {
    where += ' AND ci.event_id = ?';
    params.push(filters.event_id);
  }
  if (filters.status) {
    where += ' AND ci.status = ?';
    params.push(filters.status);
  }
  if (filters.search) {
    where += ' AND (ci.ticket_code LIKE ? OR ci.description LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s);
  }
  if (filters.operator_id) {
    where += ' AND ci.operator_id = ?';
    params.push(filters.operator_id);
  }

  const [rows] = await pool.execute(
    `SELECT
       ci.id, ci.ticket_code, ci.display_code, ci.event_id, ci.description,
       ci.observations, ci.price, ci.photo_url, ci.status,
       ci.received_at, ci.returned_at,
       u.username  AS operator_username,
       e.name      AS event_name,
       ru.username AS returned_by_username
     FROM custody_items ci
     LEFT JOIN users u   ON ci.operator_id = u.id
     LEFT JOIN events e  ON ci.event_id    = e.id
     LEFT JOIN users ru  ON ci.returned_by = ru.id
     ${where}
     ORDER BY ci.received_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM custody_items ci ${where}`,
    params
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       ci.id, ci.ticket_code, ci.display_code, ci.event_id, ci.description,
       ci.observations, ci.price, ci.photo_url, ci.status,
       ci.received_at, ci.returned_at, ci.created_at, ci.updated_at,
       u.username  AS operator_username,
       e.name      AS event_name,
       ru.username AS returned_by_username
     FROM custody_items ci
     LEFT JOIN users u   ON ci.operator_id = u.id
     LEFT JOIN events e  ON ci.event_id    = e.id
     LEFT JOIN users ru  ON ci.returned_by = ru.id
     WHERE ci.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findByTicket = async (ticketCode, eventId = null) => {
  let query = `SELECT ci.*, e.name AS event_name
               FROM custody_items ci
               LEFT JOIN events e ON ci.event_id = e.id
               WHERE ci.ticket_code = ?`;
  const params = [ticketCode];

  if (eventId) {
    query += ' AND ci.event_id = ?';
    params.push(eventId);
  }

  query += ' ORDER BY ci.received_at DESC LIMIT 1';

  const [rows] = await pool.execute(query, params);
  return rows[0] || null;
};

const findActiveByTicketAndEvent = async (ticketCode, eventId) => {
  let query = `SELECT id FROM custody_items
               WHERE ticket_code = ? AND status = 'active'`;
  const params = [ticketCode];

  if (eventId) {
    query += ' AND event_id = ?';
    params.push(eventId);
  } else {
    query += ' AND event_id IS NULL';
  }

  const [rows] = await pool.execute(query, params);
  return rows[0] || null;
};

const create = async (data) => {
  let displayCode = null;
  if (data.event_id) {
    const [[eventData]] = await pool.execute(
      `SELECT prefix FROM events WHERE id = ?`,
      [data.event_id]
    );
    if (eventData?.prefix) {
      displayCode = `${eventData.prefix}C-${data.ticket_code}`;
    }
  }

  const [result] = await pool.execute(
    `INSERT INTO custody_items
       (ticket_code, display_code, event_id, operator_id, description, observations, price, photo_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.ticket_code,
      displayCode,
      data.event_id     || null,
      data.operator_id  || null,
      data.description,
      data.observations || null,
      data.price        || 0.00,
      data.photo_url    || null,
    ]
  );
  return result.insertId;
};

const markReturned = async (id, returnedBy) => {
  await pool.execute(
    `UPDATE custody_items
     SET status = 'returned', returned_at = NOW(), returned_by = ?
     WHERE id = ?`,
    [returnedBy, id]
  );
};

const markLost = async (id) => {
  await pool.execute(
    `UPDATE custody_items SET status = 'lost' WHERE id = ?`,
    [id]
  );
};

module.exports = {
  findAll, findById, findByTicket, findActiveByTicketAndEvent,
  create, markReturned, markLost,
};