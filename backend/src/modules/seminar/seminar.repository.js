const pool = require('../../config/database');

// ===== TOPICS (Temas) =====

const findTopicsByEvent = async (eventId) => {
  const [rows] = await pool.execute(
    `SELECT
       t.id, t.event_id, t.name, t.certificates_available, t.created_at,
       COUNT(e.id) AS total_enrolled,
       SUM(e.status = 'delivered') AS total_delivered
     FROM seminar_topics t
     LEFT JOIN seminar_enrollments e ON t.id = e.topic_id
     WHERE t.event_id = ?
     GROUP BY t.id
     ORDER BY t.created_at ASC`,
    [eventId]
  );
  return rows;
};

const findTopicById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT t.*, ev.name AS event_name
     FROM seminar_topics t
     LEFT JOIN events ev ON t.event_id = ev.id
     WHERE t.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const createTopic = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO seminar_topics (event_id, name, created_by) VALUES (?, ?, ?)`,
    [data.event_id, data.name, data.created_by || null]
  );
  return result.insertId;
};

const setTopicAvailable = async (id, available) => {
  await pool.execute(
    `UPDATE seminar_topics SET certificates_available = ? WHERE id = ?`,
    [available ? 1 : 0, id]
  );
};

const deleteTopic = async (id) => {
  await pool.execute(`DELETE FROM seminar_topics WHERE id = ?`, [id]);
};

// ===== ENROLLMENTS (Inscripciones) =====

const findEnrollmentsByTopic = async (topicId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM seminar_enrollments WHERE topic_id = ? ORDER BY full_name ASC`,
    [topicId]
  );
  return rows;
};

const findEnrollmentById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT e.*, t.name AS topic_name, t.certificates_available, t.event_id, ev.name AS event_name
     FROM seminar_enrollments e
     JOIN seminar_topics t ON e.topic_id = t.id
     JOIN events ev ON t.event_id = ev.id
     WHERE e.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findByRu = async (ruCode, eventId = null) => {
  let query = `
    SELECT e.*, t.name AS topic_name, t.certificates_available, t.event_id, ev.name AS event_name
    FROM seminar_enrollments e
    JOIN seminar_topics t ON e.topic_id = t.id
    JOIN events ev ON t.event_id = ev.id
    WHERE e.ru_code = ?`;
  const params = [ruCode];

  if (eventId) {
    query += ' AND t.event_id = ?';
    params.push(eventId);
  }

  query += ' ORDER BY t.name ASC';

  const [rows] = await pool.execute(query, params);
  return rows;
};

const createEnrollment = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO seminar_enrollments (topic_id, ru_code, full_name, career, amount_paid)
     VALUES (?, ?, ?, ?, ?)`,
    [data.topic_id, data.ru_code, data.full_name, data.career || null, data.amount_paid || 0]
  );
  return result.insertId;
};

const bulkCreateEnrollments = async (topicId, rows) => {
  let inserted = 0;
  let skipped = 0;

  for (const row of rows) {
    try {
      await pool.execute(
        `INSERT INTO seminar_enrollments (topic_id, ru_code, full_name, career, amount_paid)
         VALUES (?, ?, ?, ?, ?)`,
        [topicId, row.ru_code, row.full_name, row.career || null, row.amount_paid || 0]
      );
      inserted++;
    } catch (e) {
      // Duplicado (mismo RU en el mismo tema) u otro error de fila — se salta
      skipped++;
    }
  }

  return { inserted, skipped };
};

const updateEnrollment = async (id, data) => {
  const fields = [];
  const params = [];

  if (typeof data.ru_code     !== 'undefined') { fields.push('ru_code = ?');     params.push(data.ru_code); }
  if (typeof data.full_name   !== 'undefined') { fields.push('full_name = ?');   params.push(data.full_name); }
  if (typeof data.career      !== 'undefined') { fields.push('career = ?');      params.push(data.career); }
  if (typeof data.amount_paid !== 'undefined') { fields.push('amount_paid = ?'); params.push(data.amount_paid); }

  if (fields.length === 0) return;
  params.push(id);

  await pool.execute(
    `UPDATE seminar_enrollments SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
};

const markDelivered = async (ids, deliveredBy) => {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => '?').join(',');
  await pool.execute(
    `UPDATE seminar_enrollments
     SET status = 'delivered', delivered_at = NOW(), delivered_by = ?
     WHERE id IN (${placeholders}) AND status = 'registered'`,
    [deliveredBy, ...ids]
  );
};

const deleteEnrollment = async (id) => {
  await pool.execute(`DELETE FROM seminar_enrollments WHERE id = ?`, [id]);
};

const getEventTotals = async (eventId) => {
  const [[totals]] = await pool.execute(
    `SELECT
       COUNT(e.id) AS total_enrollments,
       SUM(e.status = 'delivered') AS total_delivered,
       COALESCE(SUM(e.amount_paid), 0) AS total_revenue
     FROM seminar_enrollments e
     JOIN seminar_topics t ON e.topic_id = t.id
     WHERE t.event_id = ?`,
    [eventId]
  );
  return totals;
};

module.exports = {
  findTopicsByEvent, findTopicById, createTopic, setTopicAvailable, deleteTopic,
  findEnrollmentsByTopic, findEnrollmentById, findByRu, createEnrollment,
  bulkCreateEnrollments, updateEnrollment, markDelivered, deleteEnrollment,
  getEventTotals,
};