const custodyRepository = require('./custody.repository');
const auditService      = require('../audit/audit.service');
const path              = require('path');
const fs                = require('fs');

const getAll = async (filters, query) => {
  return custodyRepository.findAll(filters, query);
};

const getById = async (id) => {
  const item = await custodyRepository.findById(id);
  if (!item) {
    throw Object.assign(new Error('Registro de custodia no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return item;
};

const searchByTicket = async (ticketCode, eventId) => {
  const item = await custodyRepository.findByTicket(ticketCode, eventId);
  if (!item) {
    throw Object.assign(new Error('Ticket no encontrado o ya fue devuelto'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return item;
};

const create = async (data, operatorId, photoFile, meta = {}) => { // Guardar foto si viene
  // Verificar ticket duplicado en el mismo evento
  const existing = await custodyRepository.findActiveByTicketAndEvent(
    data.ticket_code,
    data.event_id || null
  );
  if (existing) {
    throw Object.assign(
      new Error(`El ticket "${data.ticket_code}" ya está activo en este evento`),
      { statusCode: 409, code: 'CONFLICT' }
    );
  }
  let photo_url = null;
  if (photoFile) {
    const uploadDir = path.join(__dirname, '../../../uploads/custody');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filename = `${Date.now()}_${photoFile.originalname.replace(/\s/g, '_')}`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, photoFile.buffer);
    photo_url = `/uploads/custody/${filename}`;
  }

    const id = await custodyRepository.create({
    ...data,
    operator_id: operatorId,
    price: parseFloat(data.price) || 0.00,
    photo_url,
    });

  await auditService.log({
    user_id:    operatorId,
    action:     'custody:create',
    entity:     'custody_items',
    entity_id:  id,
    new_values: { ticket_code: data.ticket_code, description: data.description },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const markReturned = async (id, userId, meta = {}) => {
  const item = await getById(id);

  if (item.status !== 'active') {
    throw Object.assign(
      new Error('Este objeto ya fue devuelto o está marcado como perdido'),
      { statusCode: 422, code: 'BUSINESS_ERROR' }
    );
  }

  await custodyRepository.markReturned(id, userId);

  await auditService.log({
    user_id:    userId,
    action:     'custody:return',
    entity:     'custody_items',
    entity_id:  id,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const markLost = async (id, userId, meta = {}) => {
  const item = await getById(id);

  if (item.status !== 'active') {
    throw Object.assign(
      new Error('Este objeto ya fue devuelto o está marcado como perdido'),
      { statusCode: 422, code: 'BUSINESS_ERROR' }
    );
  }

  await custodyRepository.markLost(id);

  await auditService.log({
    user_id:    userId,
    action:     'custody:lost',
    entity:     'custody_items',
    entity_id:  id,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

module.exports = { getAll, getById, searchByTicket, create, markReturned, markLost };