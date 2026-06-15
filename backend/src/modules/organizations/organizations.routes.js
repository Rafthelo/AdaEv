const router                = require('express').Router();
const orgsController        = require('./organizations.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.ORGANIZATIONS_READ),
  orgsController.getAll
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.ORGANIZATIONS_READ),
  orgsController.getById
);

router.post('/',
  authMiddleware,
  requirePermission(PERMISSIONS.ORGANIZATIONS_MANAGE),
  orgsController.create
);

router.put('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.ORGANIZATIONS_MANAGE),
  orgsController.update
);

module.exports = router;