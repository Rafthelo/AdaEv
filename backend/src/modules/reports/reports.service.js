const ExcelJS = require('exceljs');
const pool    = require('../../config/database');
const financeService = require('../finance/finance.service');

const STYLES = {
  headerFill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } },
  headerFont: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 },
  titleFont:  { bold: true, size: 16, color: { argb: 'FF1E40AF' } },
  subFont:    { italic: true, size: 10, color: { argb: 'FF6B7280' } },
};

const applyHeaderStyle = (row) => {
  row.eachCell((cell) => {
    cell.fill = STYLES.headerFill;
    cell.font = STYLES.headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } } };
  });
};

const addTitle = (sheet, title, eventName) => {
  sheet.mergeCells('A1:H1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = title;
  titleCell.font = STYLES.titleFont;
  titleCell.alignment = { vertical: 'middle' };

  sheet.mergeCells('A2:H2');
  const subCell = sheet.getCell('A2');
  subCell.value = `Evento: ${eventName || 'Todos los eventos'} — Generado: ${new Date().toLocaleString('es-BO')}`;
  subCell.font = STYLES.subFont;

  sheet.addRow([]);
};

const getEventName = async (eventId) => {
  if (!eventId) return null;
  const [rows] = await pool.execute('SELECT name FROM events WHERE id = ?', [eventId]);
  return rows[0]?.name || null;
};

// ============ REPORTE DE VENTAS ============
const generateSalesReport = async (eventId) => {
  const eventName = await getEventName(eventId);

  let where = "WHERE s.status = 'completed'";
  const params = [];
  if (eventId) { where += ' AND s.event_id = ?'; params.push(eventId); }

  const [rows] = await pool.execute(
    `SELECT
       s.id, s.total, s.order_status, s.created_at,
       u.username AS seller, u.seller_type,
       e.name AS event_name,
       (SELECT GROUP_CONCAT(CONCAT(si.quantity, 'x ', p.name) SEPARATOR ', ')
          FROM sale_items si JOIN products p ON si.product_id = p.id
          WHERE si.sale_id = s.id) AS products
     FROM sales s
     LEFT JOIN users u ON s.user_id = u.id
     LEFT JOIN events e ON s.event_id = e.id
     ${where}
     ORDER BY s.created_at ASC`,
    params
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Ventas');
  addTitle(sheet, 'Reporte de Ventas', eventName);

  const headerRow = sheet.addRow(['#', 'Fecha/Hora', 'Vendedor', 'Tipo', 'Evento', 'Productos', 'Total (Bs.)', 'Estado']);
  applyHeaderStyle(headerRow);

  let total = 0;
  rows.forEach((r) => {
    total += parseFloat(r.total);
    sheet.addRow([
      r.id,
      new Date(r.created_at).toLocaleString('es-BO'),
      r.seller || '—',
      r.seller_type || '—',
      r.event_name || '—',
      r.products || '—',
      parseFloat(r.total),
      r.order_status === 'completed' ? 'Completada' : r.order_status,
    ]);
  });

  sheet.addRow([]);
  const totalRow = sheet.addRow(['', '', '', '', '', 'TOTAL', total, '']);
  totalRow.font = { bold: true };
  totalRow.getCell(7).numFmt = '#,##0.00';

  sheet.columns = [
    { width: 6 }, { width: 20 }, { width: 15 }, { width: 12 },
    { width: 18 }, { width: 40 }, { width: 14 }, { width: 14 },
  ];
  sheet.getColumn(7).numFmt = '#,##0.00';

  return workbook;
};

// ============ REPORTE DE CUSTODIA ============
const generateCustodyReport = async (eventId) => {
  const eventName = await getEventName(eventId);

  let where = 'WHERE 1=1';
  const params = [];
  if (eventId) { where += ' AND ci.event_id = ?'; params.push(eventId); }

  const [rows] = await pool.execute(
    `SELECT
       ci.ticket_code, ci.description, ci.price, ci.status,
       ci.received_at, ci.returned_at,
       u.username AS operator, ru.username AS returned_by
     FROM custody_items ci
     LEFT JOIN users u  ON ci.operator_id = u.id
     LEFT JOIN users ru ON ci.returned_by = ru.id
     ${where}
     ORDER BY ci.received_at ASC`,
    params
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Custodia');
  addTitle(sheet, 'Reporte de Custodia', eventName);

  const headerRow = sheet.addRow(['Ticket', 'Descripción', 'Precio (Bs.)', 'Estado', 'Recibido', 'Devuelto', 'Operador', 'Devuelto por']);
  applyHeaderStyle(headerRow);

  const STATUS_LABELS = { active: 'En custodia', returned: 'Devuelto', lost: 'Perdido' };
  let totalRevenue = 0;

  rows.forEach((r) => {
    totalRevenue += parseFloat(r.price) || 0;
    sheet.addRow([
      r.ticket_code,
      r.description,
      parseFloat(r.price) || 0,
      STATUS_LABELS[r.status] || r.status,
      new Date(r.received_at).toLocaleString('es-BO'),
      r.returned_at ? new Date(r.returned_at).toLocaleString('es-BO') : '—',
      r.operator || '—',
      r.returned_by || '—',
    ]);
  });

  sheet.addRow([]);
  const totalRow = sheet.addRow(['', '', totalRevenue, 'TOTAL RECAUDADO', '', '', '', '']);
  totalRow.font = { bold: true };

  sheet.columns = [
    { width: 15 }, { width: 35 }, { width: 14 }, { width: 14 },
    { width: 20 }, { width: 20 }, { width: 15 }, { width: 15 },
  ];
  sheet.getColumn(3).numFmt = '#,##0.00';

  return workbook;
};

// ============ REPORTE FINANCIERO ============
const generateFinanceReport = async (eventId) => {
  if (!eventId) {
    throw Object.assign(new Error('Debes seleccionar un evento para el reporte financiero'), { statusCode: 400 });
  }
  const eventName = await getEventName(eventId);
  const summary = await financeService.getSummary(eventId);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Finanzas');
  addTitle(sheet, 'Resumen Financiero', eventName);

  const addSection = (title, breakdown, total, color) => {
    const titleRow = sheet.addRow([title]);
    titleRow.font = { bold: true, size: 12 };
    titleRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    });

    Object.entries(breakdown).forEach(([type, amount]) => {
      sheet.addRow(['', type, amount]);
    });

    const totalRow = sheet.addRow(['', 'Total', total]);
    totalRow.font = { bold: true };
    sheet.addRow([]);
  };

  // Operación
  const opTitleRow = sheet.addRow(['OPERACIÓN']);
  opTitleRow.font = { bold: true, size: 12 };
  opTitleRow.eachCell((cell) => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } }; });
  sheet.addRow(['', 'Ventas', summary.operation.sales]);
  sheet.addRow(['', 'Custodia', summary.operation.custody]);
  const opTotalRow = sheet.addRow(['', 'Total Operación', summary.operation.total]);
  opTotalRow.font = { bold: true };
  sheet.addRow([]);

  addSection('INGRESOS EXTERNOS', summary.external_income.breakdown, summary.external_income.total, 'FFDCFCE7');
  addSection('APORTES E INVERSIONES', summary.contribution.breakdown, summary.contribution.total, 'FFDBEAFE');
  addSection('GASTOS', summary.expense.breakdown, summary.expense.total, 'FFFEE2E2');
  addSection('DEVOLUCIONES Y RETORNOS', summary.return.breakdown, summary.return.total, 'FFFEF3C7');

  sheet.addRow([]);
  const resultOpRow = sheet.addRow(['', 'RESULTADO OPERATIVO', summary.results.operative_result]);
  resultOpRow.font = { bold: true, size: 12 };
  const resultNetRow = sheet.addRow(['', 'RESULTADO NETO', summary.results.net_result]);
  resultNetRow.font = { bold: true, size: 13 };
  resultNetRow.eachCell((cell) => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF7CC' } }; });

  sheet.columns = [{ width: 6 }, { width: 35 }, { width: 18 }];
  sheet.getColumn(3).numFmt = '#,##0.00';

  return workbook;
};

// ============ REPORTE RENDIMIENTO VENDEDORES ============
const generateSellerPerformanceReport = async (eventId) => {
  const eventName = await getEventName(eventId);

  const [rows] = await pool.execute(
    `SELECT
       u.username, u.first_name, u.last_name, u.seller_type,
       COUNT(s.id) AS total_sales,
       COALESCE(SUM(s.total), 0) AS total_revenue
     FROM users u
     LEFT JOIN sales s ON s.user_id = u.id
       AND s.status = 'completed'
       AND s.order_status IN ('completed', 'delivered')
       ${eventId ? 'AND s.event_id = ?' : ''}
     WHERE u.seller_type IS NOT NULL AND u.deleted_at IS NULL
     ${eventId ? 'AND u.assigned_event_id = ?' : ''}
     GROUP BY u.id
     ORDER BY total_revenue DESC`,
    eventId ? [eventId, eventId] : []
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Rendimiento');
  addTitle(sheet, 'Rendimiento de Vendedores', eventName);

  const headerRow = sheet.addRow(['Vendedor', 'Nombre completo', 'Tipo', 'Ventas realizadas', 'Total recaudado (Bs.)']);
  applyHeaderStyle(headerRow);

  const TYPE_LABELS = { independent: 'Independiente', waiter: 'Mesero', bartender: 'Bartender' };
  let total = 0;

  rows.forEach((r) => {
    total += parseFloat(r.total_revenue);
    sheet.addRow([
      r.username,
      `${r.first_name} ${r.last_name}`,
      TYPE_LABELS[r.seller_type] || r.seller_type,
      r.total_sales,
      parseFloat(r.total_revenue),
    ]);
  });

  sheet.addRow([]);
  const totalRow = sheet.addRow(['', '', '', 'TOTAL', total]);
  totalRow.font = { bold: true };

  sheet.columns = [{ width: 18 }, { width: 25 }, { width: 15 }, { width: 16 }, { width: 18 }];
  sheet.getColumn(5).numFmt = '#,##0.00';

  return workbook;
};

module.exports = {
  generateSalesReport,
  generateCustodyReport,
  generateFinanceReport,
  generateSellerPerformanceReport,
};