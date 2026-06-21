const pool = require('../../config/database');

const getActiveEvents = async () => {
  const [rows] = await pool.execute(
    `SELECT id, name, starts_at, ends_at
     FROM events
     WHERE status = 'active'
     ORDER BY starts_at DESC`
  );
  return rows;
};

const getStats = async (eventId = null) => {
  let eventWhere    = eventId ? 'AND event_id = ?' : '';
  let eventWhereRaw = eventId ? 'AND event_id = ?' : '';
  const p = eventId ? [eventId] : [];

  // Ventas del evento
  const [[salesStats]] = await pool.execute(
    `SELECT
       COUNT(*)                AS total_sales,
       COALESCE(SUM(total), 0) AS total_revenue
     FROM sales
     WHERE status = 'completed'
       AND order_status IN ('completed', 'delivered')
       ${eventWhere}`,
    p
  );

  // Custodia activa
  const [[custodyStats]] = await pool.execute(
    `SELECT COUNT(*) AS total_active
     FROM custody_items
     WHERE status = 'active'
       ${eventWhereRaw}`,
    p
  );

// Seminarios
const [[seminarStats]] = await pool.execute(
  `SELECT
     COUNT(e.id) AS total_participants,
     COALESCE(SUM(e.amount_paid), 0) AS total_revenue
   FROM seminar_enrollments e
   JOIN seminar_topics t ON e.topic_id = t.id
   WHERE 1=1 ${eventId ? 'AND t.event_id = ?' : ''}`,
  p
);

  // Stock bajo
  const [[lowStockStats]] = await pool.execute(
    `SELECT COUNT(*) AS total_low
     FROM inventory i
     WHERE i.quantity <= i.min_stock
       AND i.min_stock > 0
       ${eventId ? 'AND i.event_id = ?' : ''}`,
    p
  );

  // Vendedores activos asignados al evento
  const [[sellersStats]] = await pool.execute(
    `SELECT COUNT(*) AS total_sellers
     FROM users
     WHERE seller_type IS NOT NULL
       AND is_active = 1
       AND deleted_at IS NULL
       ${eventId ? 'AND assigned_event_id = ?' : ''}`,
    p
  );

  // Últimas 5 ventas
  const [recentSales] = await pool.execute(
    `SELECT
       s.id, s.total, s.created_at,
       u.username AS seller_username,
       (SELECT GROUP_CONCAT(p.sku SEPARATOR ', ')
          FROM sale_items si
          JOIN products p ON si.product_id = p.id
          WHERE si.sale_id = s.id) AS product_codes
     FROM sales s
     LEFT JOIN users u ON s.user_id = u.id
     WHERE s.status = 'completed'
       AND s.order_status IN ('completed', 'delivered')
       ${eventWhere}
     ORDER BY s.created_at DESC
     LIMIT 5`,
    p
  );

  // Rendimiento por vendedor
  const [sellerPerformance] = await pool.execute(
    `SELECT
       u.username,
       u.seller_type,
       COUNT(s.id)             AS total_sales,
       COALESCE(SUM(s.total), 0) AS total_revenue
     FROM users u
     LEFT JOIN sales s ON s.user_id = u.id
       AND s.status = 'completed'
       AND s.order_status IN ('completed', 'delivered')
       ${eventId ? 'AND s.event_id = ?' : ''}
     WHERE u.seller_type IS NOT NULL
       AND u.is_active = 1
       AND u.deleted_at IS NULL
       ${eventId ? 'AND u.assigned_event_id = ?' : ''}
     GROUP BY u.id, u.username, u.seller_type
     ORDER BY total_revenue DESC`,
    eventId ? [eventId, eventId] : []
  );

  // Stock bajo — detalle
  const [lowStockItems] = await pool.execute(
    `SELECT
       i.quantity, i.min_stock,
       p.name AS product_name, p.sku
     FROM inventory i
     JOIN products p ON i.product_id = p.id
     WHERE i.quantity <= i.min_stock
       AND i.min_stock > 0
       ${eventId ? 'AND i.event_id = ?' : ''}
     ORDER BY i.quantity ASC
     LIMIT 5`,
    p
  );

  const SELLER_TYPE_LABELS = {
    independent: 'Independiente',
    waiter:      'Mesero',
    bartender:   'Bartender',
  };

return {
  summary: {
    total_sales:     parseInt(salesStats.total_sales),
    total_revenue:   parseFloat(salesStats.total_revenue),
    custody_active:  parseInt(custodyStats.total_active),
    low_stock:       parseInt(lowStockStats.total_low),
    active_sellers:  parseInt(sellersStats.total_sellers),
    seminar_participants: parseInt(seminarStats.total_participants) || 0,
    seminar_revenue:      parseFloat(seminarStats.total_revenue) || 0,
  },
    recent_sales: recentSales,
    seller_performance: sellerPerformance.map((s) => ({
      ...s,
      seller_type_label: SELLER_TYPE_LABELS[s.seller_type] || s.seller_type,
      total_revenue: parseFloat(s.total_revenue),
    })),
    low_stock_items: lowStockItems,
  };
};

module.exports = { getActiveEvents, getStats };