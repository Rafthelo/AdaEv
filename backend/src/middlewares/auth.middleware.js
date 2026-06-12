const jwt = require('jsonwebtoken');
const env = require('../config/environment');
const { HTTP_STATUS, ERROR_CODES } = require('../constants/http.constants');
const { errorResponse } = require('../helpers/response.helper');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      errorResponse(ERROR_CODES.AUTH_REQUIRED, 'Token de autenticación requerido')
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = payload;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        errorResponse(ERROR_CODES.AUTH_EXPIRED, 'Token expirado')
      );
    }
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      errorResponse(ERROR_CODES.AUTH_INVALID, 'Token inválido')
    );
  }
};

module.exports = authMiddleware;