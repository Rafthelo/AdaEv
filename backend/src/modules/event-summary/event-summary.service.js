const pool = require('../../config/database');
const summaryRepository = require('./event-summary.repository');
const financeService    = require('../finance/finance.service');

const calculateAndSave = async (eventId, generatedBy) => {
  // Datos del evento (fechas)
  const [[event]] = await pool.execute(
    `SELECT starts_at, ends_at, status FROM events WHERE id = ?`,
    [eventId]
  );

  // Ventas
  const [[salesStats]] = await pool.execute(
    `SELECT COUNT(*) AS cnt, COALESCE(SUM(total), 0) AS revenue
     FROM sales
     WHERE event_id = ? AND status = 'completed'
       AND order_status IN ('completed', 'delivered')`,
    [eventId]
  );

  const [[voidStats]] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM sales WHERE event_id = ? AND status = 'voided'`,
    [eventId]
  );

  // Custodia
  const [[custodyStats]] = await pool.execute(
    `SELECT
       COUNT(*) AS received,
       SUM(status = 'returned') AS returned,
       SUM(status = 'lost') AS lost,
       COALESCE(SUM(price), 0) AS revenue
     FROM custody_items
     WHERE event_id = ?`,
    [eventId]
  );

  // Finanzas (reutilizamos el resumen ya existente)
  const finance = await financeService.getSummary(eventId);

  // Participantes reales (con al menos una acción en el evento)
  const [[participantsStats]] = await pool.execute(
    `SELECT COUNT(DISTINCT user_id) AS cnt FROM (
       SELECT user_id FROM sales WHERE event_id = ? AND user_id IS NOT NULL
       UNION
       SELECT prepared_by FROM sales WHERE event_id = ? AND prepared_by IS NOT NULL
       UNION
       SELECT operator_id FROM custody_items WHERE event_id = ? AND operator_id IS NOT NULL
       UNION
       SELECT returned_by FROM custody_items WHERE event_id = ? AND returned_by IS NOT NULL
       UNION
       SELECT user_id FROM financial_movements WHERE event_id = ? AND user_id IS NOT NULL
     ) AS participants`,
    [eventId, eventId, eventId, eventId, eventId]
  );

  // Ajustes de inventario (solo tipo 'adjustment')
  const [[adjustmentStats]] = await pool.execute(
    `SELECT COUNT(*) AS cnt
     FROM inventory_movements im
     JOIN inventory i ON im.inventory_id = i.id
     WHERE i.event_id = ? AND im.type = 'adjustment'`,
    [eventId]
  );

  // Top 5 productos más vendidos
  const [topProducts] = await pool.execute(
    `SELECT p.name AS product, p.sku, SUM(si.quantity) AS quantity
     FROM sale_items si
     JOIN sales s     ON si.sale_id = s.id
     JOIN products p  ON si.product_id = p.id
     WHERE s.event_id = ? AND s.status = 'completed'
       AND s.order_status IN ('completed', 'delivered')
     GROUP BY p.id, p.name, p.sku
     ORDER BY quantity DESC
     LIMIT 5`,
    [eventId]
  );

  const data = {
    sales_count:            parseInt(salesStats.cnt),
    sales_revenue:          parseFloat(salesStats.revenue),
    custody_received:       parseInt(custodyStats.received) || 0,
    custody_returned:       parseInt(custodyStats.returned) || 0,
    custody_lost:           parseInt(custodyStats.lost) || 0,
    custody_revenue:        parseFloat(custodyStats.revenue) || 0,
    external_income:        finance.external_income.total,
    contributions:          finance.contribution.total,
    expenses:               finance.expense.total,
    returns:                finance.return.total,
    operative_result:       finance.results.operative_result,
    net_result:             finance.results.net_result,
    participants_count:     parseInt(participantsStats.cnt),
    voids_count:            parseInt(voidStats.cnt),
    inventory_adjustments:  parseInt(adjustmentStats.cnt),
    top_products:           topProducts.map((p) => ({
      product: p.product, sku: p.sku, quantity: parseInt(p.quantity),
    })),
    opened_at: event.starts_at,
    closed_at: new Date(),
  };

  return summaryRepository.upsert(eventId, data, generatedBy);
};

const getByEventId = async (eventId) => {
  const summary = await summaryRepository.findByEventId(eventId);
  if (!summary) {
    throw Object.assign(
      new Error('Este evento aún no tiene un resumen generado (debe estar cerrado)'),
      { statusCode: 404, code: 'NOT_FOUND' }
    );
  }
  return summary;
};

module.exports = { calculateAndSave, getByEventId };