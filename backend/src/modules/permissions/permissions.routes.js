const router                 = require('express').Router();
const permissionsController  = require('./permissions.controller');
const authMiddleware         = require('../../middlewares/auth.middleware');
const { requirePermission }  = require('../../middlewares/permission.middleware');
const { PERMISSIONS }        = require('../../constants/permissions.constants');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  permissionsController.getAll
);

router.get('/modules',
  authMiddleware,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  permissionsController.getModules
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  permissionsController.getById
);

module.exports = router;