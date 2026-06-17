const router                = require('express').Router();
const summaryController     = require('./event-summary.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');

router.get('/:eventId',
  authMiddleware,
  requirePermission(PERMISSIONS.EVENTS_SUMMARY),
  summaryController.getByEventId
);

module.exports = router;