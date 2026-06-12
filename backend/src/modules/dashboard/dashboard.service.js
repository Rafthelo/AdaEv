const pool = require('../../config/database');

const getStats = async (eventId = null) => {
  let eventWhere = '';
  const params = [];

  if (eventId) {
    eventWhere = 'AND event_id = ?';
    params.push(eventId);
  }

  // Ventas del día
  const [[salesStats]] = await pool.execute(
    `SELECT
       COUNT(*)            AS total_sales,
       COALESCE(SUM(total), 0) AS total_revenue,
       COALESCE(AVG(total), 0) AS avg_sale
     FROM sales
     WHERE status = 'completed'
       AND DATE(created_at) = CURDATE()
       ${eventWhere}`,
    params
  );

  // Ventas totales
  const [[allSalesStats]] = await pool.execute(
    `SELECT
       COUNT(*)                AS total_sales_all,
       COALESCE(SUM(total), 0) AS total_revenue_all
     FROM sales
     WHERE status = 'completed'
       ${eventWhere}`,
    params
  );

  // Productos con stock bajo
  const [lowStockItems] = await pool.execute(
    `SELECT
       i.id, i.quantity, i.min_stock,
       p.name AS product_name, p.sku,
       e.name AS event_name
     FROM inventory i
     JOIN products p    ON i.product_id = p.id
     LEFT JOIN events e ON i.event_id   = e.id
     WHERE i.quantity <= i.min_stock
       AND i.min_stock > 0
     ORDER BY i.quantity ASC
     LIMIT 10`
  );

  // Últimas 5 ventas
  const [recentSales] = await pool.execute(
    `SELECT
       s.id, s.total, s.status, s.created_at,
       u.username AS cashier_username,
       e.name     AS event_name
     FROM sales s
     LEFT JOIN users u  ON s.user_id  = u.id
     LEFT JOIN events e ON s.event_id = e.id
     WHERE s.status = 'completed'
       ${eventWhere}
     ORDER BY s.created_at DESC
     LIMIT 5`,
    params
  );

  // Eventos activos
  const [[{ active_events }]] = await pool.execute(
    `SELECT COUNT(*) AS active_events FROM events WHERE status = 'active'`
  );

  // Sesiones de caja abiertas
  const [[{ open_sessions }]] = await pool.execute(
    `SELECT COUNT(*) AS open_sessions FROM cash_sessions WHERE status = 'open'`
  );

  // Usuarios activos
  const [[{ active_users }]] = await pool.execute(
    `SELECT COUNT(*) AS active_users FROM users WHERE is_active = 1`
  );

  // Ventas por hora (últimas 8 horas)
  const [salesByHour] = await pool.execute(
    `SELECT
       HOUR(created_at)        AS hour,
       COUNT(*)                AS count,
       COALESCE(SUM(total), 0) AS revenue
     FROM sales
     WHERE status = 'completed'
       AND created_at >= DATE_SUB(NOW(), INTERVAL 8 HOUR)
       ${eventWhere}
     GROUP BY HOUR(created_at)
     ORDER BY hour ASC`,
    params
  );

  return {
    today: {
      total_sales:    parseInt(salesStats.total_sales),
      total_revenue:  parseFloat(salesStats.total_revenue),
      avg_sale:       parseFloat(salesStats.avg_sale),
    },
    all_time: {
      total_sales:   parseInt(allSalesStats.total_sales_all),
      total_revenue: parseFloat(allSalesStats.total_revenue_all),
    },
    system: {
      active_events:  parseInt(active_events),
      open_sessions:  parseInt(open_sessions),
      active_users:   parseInt(active_users),
    },
    low_stock:    lowStockItems,
    recent_sales: recentSales,
    sales_by_hour: salesByHour,
  };
};

module.exports = { getStats };