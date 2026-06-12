const salesRepository     = require('./sales.repository');
const inventoryRepository = require('../inventory/inventory.repository');
const auditService        = require('../audit/audit.service');
const { getIO }           = require('../../config/socket');
const pool                = require('../../config/database');

const getAll = async (filters, query) => {
  return salesRepository.findAll(filters, query);
};

const getById = async (id) => {
  const sale = await salesRepository.findById(id);
  if (!sale) {
    throw Object.assign(new Error('Venta no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  const items = await salesRepository.getSaleItems(id);
  return { ...sale, items };
};

const create = async (data, userId, meta = {}) => {
  // Calcular subtotales y total
  const items = data.items.map((item) => ({
    ...item,
    subtotal: parseFloat((item.quantity * item.unit_price).toFixed(2)),
  }));
  const total = parseFloat(items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2));

  let saleId;

  await pool.transaction(async (conn) => {
    // Descontar inventario por cada ítem
    for (const item of items) {
      const success = await inventoryRepository.decrementStock(
        item.product_id, data.event_id, item.quantity, conn
      );
      if (!success) {
        const err = new Error(`Stock insuficiente para el producto ID ${item.product_id}`);
        err.statusCode = 422;
        err.code = 'BUSINESS_ERROR';
        throw err;
      }

      // Registrar movimiento de inventario
      const inventory = await inventoryRepository.findByProductAndEvent(
        item.product_id, data.event_id
      );
      if (inventory) {
        await inventoryRepository.createMovement({
          inventory_id: inventory.id,
          type:         'out',
          quantity:     item.quantity,
          reason:       'Venta',
          reference:    null,
          created_by:   userId,
        }, conn);
      }
    }

    // Crear venta
    saleId = await salesRepository.create({ ...data, user_id: userId, total }, conn);

    // Crear ítems
    await salesRepository.createItems(saleId, items, conn);
  });

  // Emitir evento Socket.IO
  try {
    getIO().emit('sale:created', {
      saleId,
      total,
      eventId: data.event_id || null,
      userId,
    });

    if (data.event_id) {
      getIO().to(`event:${data.event_id}`).emit('sale:created', { saleId, total });
    }
  } catch (e) {
    // Socket no crítico
  }

  await auditService.log({
    user_id:    userId,
    action:     'sales:create',
    entity:     'sales',
    entity_id:  saleId,
    new_values: { total, items: items.length, event_id: data.event_id },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(saleId);
};

const voidSale = async (id, userId, voidReason, meta = {}) => {
  const sale = await salesRepository.findById(id);
  if (!sale) {
    throw Object.assign(new Error('Venta no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  if (sale.status === 'voided') {
    throw Object.assign(new Error('La venta ya fue anulada'), { statusCode: 422, code: 'BUSINESS_ERROR' });
  }

  const items = await salesRepository.getSaleItems(id);

  await pool.transaction(async (conn) => {
    // Devolver stock
    for (const item of items) {
      await inventoryRepository.createOrUpdate(
        item.product_id, sale.event_id, item.quantity, conn
      );
      const inventory = await inventoryRepository.findByProductAndEvent(
        item.product_id, sale.event_id
      );
      if (inventory) {
        await inventoryRepository.createMovement({
          inventory_id: inventory.id,
          type:         'return',
          quantity:     item.quantity,
          reason:       `Anulación de venta #${id}`,
          created_by:   userId,
        }, conn);
      }
    }

    await salesRepository.voidSale(id, userId, voidReason, conn);
  });

  await auditService.log({
    user_id:    userId,
    action:     'sales:void',
    entity:     'sales',
    entity_id:  id,
    new_values: { void_reason: voidReason },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const getStats = async (eventId) => {
  return salesRepository.getSaleStats(eventId);
};

module.exports = { getAll, getById, create, voidSale, getStats };