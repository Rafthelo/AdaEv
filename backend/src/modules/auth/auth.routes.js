const router          = require('express').Router();
const authController  = require('./auth.controller');
const authMiddleware  = require('../../middlewares/auth.middleware');
const validate        = require('../../middlewares/validate.middleware');
const { authLimiter } = require('../../middlewares/rateLimiter.middleware');
const { loginSchema } = require('./auth.validation');

router.post('/login',
  authLimiter,
  validate(loginSchema),
  authController.login
);

router.post('/refresh',
  authLimiter,
  authController.refresh
);

router.post('/logout',
  authMiddleware,
  authController.logout
);

router.get('/me',
  authMiddleware,
  authController.me
);

module.exports = router;