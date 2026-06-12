const { HTTP_STATUS, ERROR_CODES } = require('../constants/http.constants');
const { errorResponse } = require('../helpers/response.helper');

const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, {
    stack:  err.stack,
    path:   req.path,
    method: req.method,
  });

  // Error de CORS
  if (err.message === 'Not allowed by CORS') {
    return res.status(HTTP_STATUS.FORBIDDEN).json(
      errorResponse(ERROR_CODES.FORBIDDEN, 'Origen no permitido')
    );
  }

  // Error de negocio conocido
  if (err.statusCode) {
    return res.status(err.statusCode).json(
      errorResponse(err.code || ERROR_CODES.BUSINESS_ERROR, err.message)
    );
  }

  // Error genérico — no exponer detalles en producción
  const message = process.env.NODE_ENV === 'development'
    ? err.message
    : 'Error interno del servidor';

  return res.status(HTTP_STATUS.SERVER_ERROR).json(
    errorResponse(ERROR_CODES.SERVER_ERROR, message)
  );
};

module.exports = errorMiddleware;