const router                = require('express').Router();
const reportsController     = require('./reports.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');

router.get('/sales',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_READ_ALL),
  reportsController.salesReport
);

router.get('/custody',
  authMiddleware,
  requirePermission(PERMISSIONS.CUSTODY_MANAGE),
  reportsController.custodyReport
);

router.get('/finance',
  authMiddleware,
  requirePermission(PERMISSIONS.FINANCE_SUMMARY),
  reportsController.financeReport
);

router.get('/performance',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_READ_ALL),
  reportsController.performanceReport
);

router.get('/seminar',
  authMiddleware,
  requirePermission(PERMISSIONS.SEMINAR_READ),
  reportsController.seminarReport
);

router.get('/inventory',
  authMiddleware,
  requirePermission(PERMISSIONS.INVENTORY_READ),
  reportsController.inventoryReport
);

module.exports = router;