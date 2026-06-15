const router          = require('express').Router();
const usersController = require('./users.controller');
const authMiddleware  = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const validate        = require('../../middlewares/validate.middleware');
const { PERMISSIONS } = require('../../constants/permissions.constants');
const {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
} = require('./users.validation');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.USERS_MANAGE),
  usersController.getAll
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.USERS_MANAGE),
  usersController.getById
);

router.post('/',
  authMiddleware,
  requirePermission(PERMISSIONS.USERS_MANAGE),
  validate(createUserSchema),
  usersController.create
);

router.put('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.USERS_MANAGE),
  validate(updateUserSchema),
  usersController.update
);

router.patch('/:id/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  usersController.changePassword
);

router.patch('/:id/deactivate',
  authMiddleware,
  requirePermission(PERMISSIONS.USERS_MANAGE),
  usersController.deactivate
);

router.delete('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.USERS_MANAGE),
  usersController.remove
);

module.exports = router;