const reportsService = require('./reports.service');

const sendWorkbook = async (res, workbook, filename) => {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  await workbook.xlsx.write(res);
  res.end();
};

const salesReport = async (req, res, next) => {
  try {
    const workbook = await reportsService.generateSalesReport(req.query.event_id || null);
    await sendWorkbook(res, workbook, `reporte_ventas_${Date.now()}.xlsx`);
  } catch (error) {
    next(error);
  }
};

const custodyReport = async (req, res, next) => {
  try {
    const workbook = await reportsService.generateCustodyReport(req.query.event_id || null);
    await sendWorkbook(res, workbook, `reporte_custodia_${Date.now()}.xlsx`);
  } catch (error) {
    next(error);
  }
};

const financeReport = async (req, res, next) => {
  try {
    const workbook = await reportsService.generateFinanceReport(req.query.event_id || null);
    await sendWorkbook(res, workbook, `reporte_financiero_${Date.now()}.xlsx`);
  } catch (error) {
    next(error);
  }
};

const performanceReport = async (req, res, next) => {
  try {
    const workbook = await reportsService.generateSellerPerformanceReport(req.query.event_id || null);
    await sendWorkbook(res, workbook, `reporte_rendimiento_${Date.now()}.xlsx`);
  } catch (error) {
    next(error);
  }
};

module.exports = { salesReport, custodyReport, financeReport, performanceReport };