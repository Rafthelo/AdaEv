const pool = require('../../config/database');

const findByEventId = async (eventId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM event_summaries WHERE event_id = ?`,
    [eventId]
  );
  return rows[0] || null;
};

const upsert = async (eventId, data, generatedBy) => {
  const existing = await findByEventId(eventId);
  const nextVersion = existing ? existing.summary_version + 1 : 1;

  await pool.execute(
    `INSERT INTO event_summaries (
       event_id, sales_count, sales_revenue,
       custody_received, custody_returned, custody_lost, custody_revenue,
       external_income, contributions, expenses, returns,
       operative_result, net_result,
       participants_count, voids_count, inventory_adjustments,
       top_products, opened_at, closed_at,
       generated_by, summary_version
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       sales_count = VALUES(sales_count),
       sales_revenue = VALUES(sales_revenue),
       custody_received = VALUES(custody_received),
       custody_returned = VALUES(custody_returned),
       custody_lost = VALUES(custody_lost),
       custody_revenue = VALUES(custody_revenue),
       external_income = VALUES(external_income),
       contributions = VALUES(contributions),
       expenses = VALUES(expenses),
       returns = VALUES(returns),
       operative_result = VALUES(operative_result),
       net_result = VALUES(net_result),
       participants_count = VALUES(participants_count),
       voids_count = VALUES(voids_count),
       inventory_adjustments = VALUES(inventory_adjustments),
       top_products = VALUES(top_products),
       opened_at = VALUES(opened_at),
       closed_at = VALUES(closed_at),
       generated_at = CURRENT_TIMESTAMP,
       generated_by = VALUES(generated_by),
       summary_version = VALUES(summary_version)`,
    [
      eventId, data.sales_count, data.sales_revenue,
      data.custody_received, data.custody_returned, data.custody_lost, data.custody_revenue,
      data.external_income, data.contributions, data.expenses, data.returns,
      data.operative_result, data.net_result,
      data.participants_count, data.voids_count, data.inventory_adjustments,
      JSON.stringify(data.top_products || []), data.opened_at, data.closed_at,
      generatedBy, nextVersion,
    ]
  );

  return findByEventId(eventId);
};

module.exports = { findByEventId, upsert };