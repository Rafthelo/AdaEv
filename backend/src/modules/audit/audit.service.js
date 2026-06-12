const auditRepository = require('./audit.repository');

const log = async (data) => {
  try {
    await auditRepository.create(data);
  } catch (error) {
    // Nunca debe romper el flujo principal
    console.error('Audit log error:', error.message);
  }
};

const getAll = async (filters, query) => {
  return auditRepository.findAll(filters, query);
};

const getById = async (id) => {
  const log = await auditRepository.findById(id);
  if (!log) {
    const error = new Error('Registro de auditoría no encontrado');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return log;
};

module.exports = { log, getAll, getById };