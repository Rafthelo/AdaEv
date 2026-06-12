const cashRepository = require('./cash-register.repository');
const auditService   = require('../audit/audit.service');
const { getIO }      = require('../../config/socket');

// === Registers ===
const getAllRegisters = async () => {
  return cashRepository.findAllRegisters();
};

const createRegister = async (data, createdBy, meta = {}) => {
  const id = await cashRepository.createRegister(data);

  await auditService.log({
    user_id:    createdBy,
    action:     'cash:create_register',
    entity:     'cash_registers',
    entity_id:  id,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return cashRepository.findRegisterById(id);
};

// === Sessions ===
const getAllSessions = async (filters, query) => {
  return cashRepository.findAllSessions(filters, query);
};

const getSessionById = async (id) => {
  const session = await cashRepository.findSessionById(id);
  if (!session) {
    throw Object.assign(new Error('Sesión de caja no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return session;
};

const openSession = async (data, userId, meta = {}) => {
  const register = await cashRepository.findRegisterById(data.cash_register_id);
  if (!register) {
    throw Object.assign(new Error('Caja no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  if (!register.is_active) {
    throw Object.assign(new Error('La caja está inactiva'), { statusCode: 422, code: 'BUSINESS_ERROR' });
  }

  const openSession = await cashRepository.findOpenSession(data.cash_register_id);
  if (openSession) {
    throw Object.assign(
      new Error('Esta caja ya tiene una sesión abierta'),
      { statusCode: 422, code: 'BUSINESS_ERROR' }
    );
  }

  const id = await cashRepository.openSession({ ...data, opened_by: userId });

  try {
    getIO().emit('cash:session_opened', {
      sessionId:  id,
      registerId: data.cash_register_id,
      openedBy:   userId,
    });
  } catch (e) {}

  await auditService.log({
    user_id:    userId,
    action:     'cash:open',
    entity:     'cash_sessions',
    entity_id:  id,
    new_values: { opening_amount: data.opening_amount },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getSessionById(id);
};

const closeSession = async (id, data, userId, meta = {}) => {
  const session = await getSessionById(id);

  if (session.status === 'closed') {
    throw Object.assign(new Error('La sesión ya está cerrada'), { statusCode: 422, code: 'BUSINESS_ERROR' });
  }

  // Calcular total esperado
  const salesTotal    = await cashRepository.getSessionSalesTotal(id);
  const expectedAmount = parseFloat(session.opening_amount) + salesTotal;
  const difference     = parseFloat(data.closing_amount) - expectedAmount;

  await cashRepository.closeSession(id, {
    closed_by:       userId,
    closing_amount:  data.closing_amount,
    expected_amount: expectedAmount,
    difference,
    notes:           data.notes,
  });

  try {
    getIO().emit('cash:session_closed', {
      sessionId: id,
      total:     data.closing_amount,
      closedBy:  userId,
      difference,
    });
  } catch (e) {}

  await auditService.log({
    user_id:    userId,
    action:     'cash:close',
    entity:     'cash_sessions',
    entity_id:  id,
    new_values: { closing_amount: data.closing_amount, difference },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getSessionById(id);
};

const createMovement = async (data, userId, meta = {}) => {
  const session = await getSessionById(data.cash_session_id);

  if (session.status === 'closed') {
    throw Object.assign(
      new Error('No se pueden registrar movimientos en una sesión cerrada'),
      { statusCode: 422, code: 'BUSINESS_ERROR' }
    );
  }

  const id = await cashRepository.createMovement({ ...data, created_by: userId });

  await auditService.log({
    user_id:    userId,
    action:     'cash:movement',
    entity:     'cash_movements',
    entity_id:  id,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return cashRepository.findSessionById(data.cash_session_id);
};

const getMovements = async (sessionId, query) => {
  await getSessionById(sessionId);
  return cashRepository.getMovements(sessionId, query);
};

module.exports = {
  getAllRegisters, createRegister,
  getAllSessions, getSessionById,
  openSession, closeSession,
  createMovement, getMovements,
};