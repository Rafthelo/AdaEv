const router                = require('express').Router();
const dashboardController   = require('./dashboard.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');

router.get('/active-events',
  authMiddleware,
  requirePermission(PERMISSIONS.DASHBOARD_VIEW),
  dashboardController.getActiveEvents
);

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.DASHBOARD_VIEW),
  dashboardController.getStats
);

module.exports = router;