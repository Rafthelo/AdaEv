const financeRepository = require('./finance.repository');
const auditService      = require('../audit/audit.service');

const VALID_TYPES = {
  external_income: ['sponsorship', 'donation', 'advance', 'payment', 'other_income'],
  contribution:    ['contribution', 'loan', 'investment'],
  expense:         ['supplies', 'services', 'transport', 'advertising', 'logistics', 'other_expense'],
  return:          ['loan_return', 'contribution_return', 'investor_payment', 'investment_return'],
};

const getAll = async (filters, query) => {
  return financeRepository.findAll(filters, query);
};

const getById = async (id) => {
  const item = await financeRepository.findById(id);
  if (!item) {
    throw Object.assign(new Error('Movimiento no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return item;
};

const create = async (data, userId, meta = {}) => {
  // Validar que el tipo pertenece a la categoría
  const validTypes = VALID_TYPES[data.category];
  if (!validTypes || !validTypes.includes(data.type)) {
    throw Object.assign(
      new Error(`Tipo "${data.type}" no válido para categoría "${data.category}"`),
      { statusCode: 400, code: 'VALIDATION_ERROR' }
    );
  }

  // Si es una devolución, verificar que el movimiento relacionado existe
  if (data.category === 'return' && data.related_movement_id) {
    const related = await financeRepository.findById(data.related_movement_id);
    if (!related) {
      throw Object.assign(new Error('Movimiento relacionado no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
    }
  }

  const id = await financeRepository.create({ ...data, user_id: userId });

  await auditService.log({
    user_id:    userId,
    action:     'finance:create',
    entity:     'financial_movements',
    entity_id:  id,
    new_values: { category: data.category, type: data.type, amount: data.amount },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const remove = async (id, userId, meta = {}) => {
  await getById(id);
  await financeRepository.remove(id);

  await auditService.log({
    user_id:    userId,
    action:     'finance:delete',
    entity:     'financial_movements',
    entity_id:  id,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
};

const getSummary = async (eventId) => {
  return financeRepository.getSummary(eventId);
};

module.exports = { getAll, getById, create, remove, getSummary, VALID_TYPES };