const eventsRepository   = require('./events.repository');
const productsRepository = require('../products/products.repository');
const auditService       = require('../audit/audit.service');
const { getIO }          = require('../../config/socket');
const { EVENT_STATUS }   = require('../../constants/events.constants');

const CLOSED_STATUSES = [EVENT_STATUS.CLOSED, EVENT_STATUS.CANCELLED];

const getAll = async (filters, query) => {
  return eventsRepository.findAll(filters, query);
};

const getById = async (id) => {
  const event = await eventsRepository.findById(id);
  if (!event) {
    throw Object.assign(new Error('Evento no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return event;
};

const create = async (data, createdBy, meta = {}) => {
  const existing = await eventsRepository.findByName(data.name);
  if (existing) {
    throw Object.assign(new Error('Ya existe un evento con ese nombre'), { statusCode: 409, code: 'CONFLICT' });
  }

  const id = await eventsRepository.create({ ...data, created_by: createdBy });

  await auditService.log({
    user_id:    createdBy,
    action:     'events:create',
    entity:     'events',
    entity_id:  id,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const update = async (id, data, updatedBy, meta = {}) => {
  const existing = await eventsRepository.findById(id);
  if (!existing) {
    throw Object.assign(new Error('Evento no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  if (CLOSED_STATUSES.includes(existing.status)) {
    // Evento cerrado/cancelado: solo se permite cambiar el status (reabrir)
    const onlyStatusChange = Object.keys(data).every((key) => key === 'status');

    if (!onlyStatusChange) {
      throw Object.assign(
        new Error('Un evento cerrado o cancelado solo puede cambiar su estado (reabrir)'),
        { statusCode: 422, code: 'BUSINESS_ERROR' }
      );
    }

    if (!data.status || CLOSED_STATUSES.includes(data.status)) {
      throw Object.assign(
        new Error('Debes seleccionar un estado activo para reabrir el evento'),
        { statusCode: 422, code: 'BUSINESS_ERROR' }
      );
    }
  }

  await eventsRepository.update(id, data);

  // Notificar via Socket.IO si el estado cambia
  if (data.status && data.status !== existing.status) {
    try {
      getIO().emit('event:status_changed', { eventId: id, status: data.status });
    } catch (e) {
      // Socket no crítico
    }
  }

  await auditService.log({
    user_id:    updatedBy,
    action:     'events:update',
    entity:     'events',
    entity_id:  id,
    old_values: { status: existing.status },
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const getEventProducts = async (id) => {
  await getById(id);
  return eventsRepository.getEventProducts(id);
};

const addProduct = async (eventId, data, addedBy, meta = {}) => {
  await getById(eventId);

  const product = await productsRepository.findById(data.product_id);
  if (!product) {
    throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  await eventsRepository.addProduct(eventId, data);

  await auditService.log({
    user_id:    addedBy,
    action:     'events:add_product',
    entity:     'events',
    entity_id:  eventId,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getEventProducts(eventId);
};

const removeProduct = async (eventId, productId, removedBy, meta = {}) => {
  await getById(eventId);
  await eventsRepository.removeProduct(eventId, productId);

  await auditService.log({
    user_id:    removedBy,
    action:     'events:remove_product',
    entity:     'events',
    entity_id:  eventId,
    new_values: { product_id: productId },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
};

module.exports = { getAll, getById, create, update, getEventProducts, addProduct, removeProduct };