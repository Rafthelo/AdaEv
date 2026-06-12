const { HTTP_STATUS, ERROR_CODES } = require('../constants/http.constants');
const { errorResponse } = require('../helpers/response.helper');

const requirePermission = (permission) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];

    if (!userPermissions.includes(permission)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        errorResponse(
          ERROR_CODES.FORBIDDEN,
          `No tienes permiso para realizar esta acción: ${permission}`
        )
      );
    }

    next();
  };
};

const requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];
    const hasAny = permissions.some((p) => userPermissions.includes(p));

    if (!hasAny) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        errorResponse(
          ERROR_CODES.FORBIDDEN,
          'No tienes permisos suficientes para esta acción'
        )
      );
    }

    next();
  };
};

module.exports = { requirePermission, requireAnyPermission };