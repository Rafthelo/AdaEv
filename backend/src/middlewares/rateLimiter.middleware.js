const rateLimit = require('express-rate-limit');
const env = require('../config/environment');
const { errorResponse } = require('../helpers/response.helper');
const { ERROR_CODES } = require('../constants/http.constants');

const authLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max:      env.rateLimit.max,
  handler:  (req, res) => {
    res.status(429).json(
      errorResponse(
        ERROR_CODES.FORBIDDEN,
        'Demasiados intentos. Intenta de nuevo en 15 minutos.'
      )
    );
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      200,
  handler:  (req, res) => {
    res.status(429).json(
      errorResponse(ERROR_CODES.FORBIDDEN, 'Demasiadas solicitudes.')
    );
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

module.exports = { authLimiter, generalLimiter };