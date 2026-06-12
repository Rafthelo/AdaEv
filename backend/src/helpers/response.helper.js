const successResponse = (data, message = 'OK') => ({
  success: true,
  message,
  data,
});

const paginatedResponse = (data, meta, message = 'OK') => ({
  success: true,
  message,
  data,
  meta,
});

const errorResponse = (error, message, details = null) => ({
  success: false,
  error,
  message,
  ...(details && { details }),
});

module.exports = { successResponse, paginatedResponse, errorResponse };