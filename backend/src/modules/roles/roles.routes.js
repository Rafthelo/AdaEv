const router          = require('express').Router();
const rolesController = require('./roles.controller');
const authMiddleware  = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const { PERMISSIONS } = require('../../constants/permissions.constants');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  rolesController.getAll
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  rolesController.getById
);

router.post('/',
  authMiddleware,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  rolesController.create
);

router.put('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  rolesController.update
);

router.patch('/:id/permissions',
  authMiddleware,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  rolesController.assignPermissions
);

module.exports = router;