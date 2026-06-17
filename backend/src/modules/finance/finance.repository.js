const pool = require('../../config/database');
const { getPagination, getPaginationMeta } = require('../../helpers/pagination.helper');

const CATEGORY_TYPES = {
  external_income: ['sponsorship', 'donation', 'advance', 'payment', 'other_income'],
  contribution:    ['contribution', 'loan', 'investment'],
  expense:         ['supplies', 'services', 'transport', 'advertising', 'logistics', 'other_expense'],
  return:          ['loan_return', 'contribution_return', 'investor_payment', 'investment_return'],
};

const findAll = async (filters = {}, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  let where = 'WHERE 1=1';
  const params = [];

  if (filters.event_id) {
    where += ' AND fm.event_id = ?';
    params.push(filters.event_id);
  }
  if (filters.category) {
    where += ' AND fm.category = ?';
    params.push(filters.category);
  }
  if (filters.type) {
    where += ' AND fm.type = ?';
    params.push(filters.type);
  }

  const [rows] = await pool.execute(
    `SELECT
       fm.id, fm.event_id, fm.category, fm.type,
       fm.amount, fm.description, fm.date,
       fm.related_movement_id, fm.created_at,
       u.username        AS created_by_username,
       o.name            AS organization_name,
       e.name            AS event_name,
       rm.description    AS related_description,
       rm.amount         AS related_amount
     FROM financial_movements fm
     LEFT JOIN users u         ON fm.user_id          = u.id
     LEFT JOIN organizations o ON fm.organization_id  = o.id
     LEFT JOIN events e        ON fm.event_id         = e.id
     LEFT JOIN financial_movements rm ON fm.related_movement_id = rm.id
     ${where}
     ORDER BY fm.date DESC, fm.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM financial_movements fm ${where}`,
    params
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       fm.id, fm.event_id, fm.category, fm.type,
       fm.amount, fm.description, fm.date,
       fm.related_movement_id, fm.created_at, fm.updated_at,
       u.username        AS created_by_username,
       o.name            AS organization_name,
       o.id              AS organization_id,
       e.name            AS event_name,
       rm.description    AS related_description,
       rm.amount         AS related_amount
     FROM financial_movements fm
     LEFT JOIN users u         ON fm.user_id          = u.id
     LEFT JOIN organizations o ON fm.organization_id  = o.id
     LEFT JOIN events e        ON fm.event_id         = e.id
     LEFT JOIN financial_movements rm ON fm.related_movement_id = rm.id
     WHERE fm.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO financial_movements
       (event_id, user_id, organization_id, related_movement_id, category, type, amount, description, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.event_id             || null,
      data.user_id              || null,
      data.organization_id      || null,
      data.related_movement_id  || null,
      data.category,
      data.type,
      data.amount,
      data.description          || null,
      data.date,
    ]
  );
  return result.insertId;
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  if (typeof data.category            !== 'undefined') { fields.push('category = ?');            params.push(data.category); }
  if (typeof data.type                !== 'undefined') { fields.push('type = ?');                 params.push(data.type); }
  if (typeof data.amount              !== 'undefined') { fields.push('amount = ?');               params.push(data.amount); }
  if (typeof data.description         !== 'undefined') { fields.push('description = ?');          params.push(data.description); }
  if (typeof data.date                !== 'undefined') { fields.push('date = ?');                  params.push(data.date); }
  if (typeof data.organization_id     !== 'undefined') { fields.push('organization_id = ?');       params.push(data.organization_id); }
  if (typeof data.related_movement_id !== 'undefined') { fields.push('related_movement_id = ?');   params.push(data.related_movement_id); }

  if (fields.length === 0) return;
  params.push(id);

  await pool.execute(
    `UPDATE financial_movements SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
};

const remove = async (id) => {
  await pool.execute(`DELETE FROM financial_movements WHERE id = ?`, [id]);
};

const getSummary = async (eventId) => {
  // Ventas del evento
  const [[salesData]] = await pool.execute(
    `SELECT COALESCE(SUM(total), 0) AS total
     FROM sales
     WHERE event_id = ? AND status = 'completed'
       AND order_status IN ('completed', 'delivered')`,
    [eventId]
  );

  // Custodia del evento
  const [[custodyData]] = await pool.execute(
    `SELECT COALESCE(SUM(price), 0) AS total
     FROM custody_items
     WHERE event_id = ? AND price > 0`,
    [eventId]
  );

  // Movimientos financieros por categoría y tipo
  const [movements] = await pool.execute(
    `SELECT category, type, COALESCE(SUM(amount), 0) AS total
     FROM financial_movements
     WHERE event_id = ?
     GROUP BY category, type`,
    [eventId]
  );

  // Organizar por categoría
  const byCategory = {
    external_income: {},
    contribution:    {},
    expense:         {},
    return:          {},
  };

  movements.forEach((m) => {
    if (!byCategory[m.category]) byCategory[m.category] = {};
    byCategory[m.category][m.type] = parseFloat(m.total);
  });

  const sumCategory = (cat) =>
    Object.values(byCategory[cat] || {}).reduce((a, b) => a + b, 0);

  const operationTotal    = parseFloat(salesData.total) + parseFloat(custodyData.total);
  const externalTotal     = sumCategory('external_income');
  const contributionTotal = sumCategory('contribution');
  const expenseTotal      = sumCategory('expense');
  const returnTotal       = sumCategory('return');

  const operativeResult = operationTotal - expenseTotal;
  const netResult       = operativeResult + externalTotal + contributionTotal - returnTotal;

  return {
    operation: {
      sales:   parseFloat(salesData.total),
      custody: parseFloat(custodyData.total),
      total:   operationTotal,
    },
    external_income: {
      breakdown: byCategory.external_income,
      total:     externalTotal,
    },
    contribution: {
      breakdown: byCategory.contribution,
      total:     contributionTotal,
    },
    expense: {
      breakdown: byCategory.expense,
      total:     expenseTotal,
    },
    return: {
      breakdown: byCategory.return,
      total:     returnTotal,
    },
    results: {
      operative_result: operativeResult,
      net_result:       netResult,
    },
  };
};

module.exports = { CATEGORY_TYPES, findAll, findById, create, update, remove, getSummary };