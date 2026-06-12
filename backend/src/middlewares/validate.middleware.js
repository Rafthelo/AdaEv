const { HTTP_STATUS, ERROR_CODES } = require('../constants/http.constants');
const { errorResponse } = require('../helpers/response.helper');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const details = error.details.map((d) => ({
        field:   d.path.join('.'),
        message: d.message,
      }));

      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        errorResponse(ERROR_CODES.VALIDATION_ERROR, 'Error de validación', details)
      );
    }

    next();
  };
};

module.exports = validate;