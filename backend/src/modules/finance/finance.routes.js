const router                = require('express').Router();
const financeController     = require('./finance.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.FINANCE_READ),
  financeController.getAll
);

router.get('/summary',
  authMiddleware,
  requirePermission(PERMISSIONS.FINANCE_SUMMARY),
  financeController.getSummary
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.FINANCE_READ),
  financeController.getById
);

router.post('/',
  authMiddleware,
  requirePermission(PERMISSIONS.FINANCE_CREATE),
  financeController.create
);

router.put('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.FINANCE_CREATE),
  financeController.update
);

router.delete('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.FINANCE_DELETE),
  financeController.remove
);

module.exports = router;