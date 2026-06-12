const router = require('express').Router();
const auditController = require('./audit.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const { PERMISSIONS } = require('../../constants/permissions.constants');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.AUDIT_READ),
  auditController.getAll
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.AUDIT_READ),
  auditController.getById
);

module.exports = router;