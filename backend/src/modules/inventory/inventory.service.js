const inventoryRepository = require('./inventory.repository');
const productsRepository  = require('../products/products.repository');
const auditService        = require('../audit/audit.service');
const { getIO }           = require('../../config/socket');
const pool                = require('../../config/database');

const getAll = async (filters, query) => {
  return inventoryRepository.findAll(filters, query);
};

const getById = async (id) => {
  const item = await inventoryRepository.findById(id);
  if (!item) {
    throw Object.assign(new Error('Registro de inventario no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return item;
};

const adjust = async (data, userId, meta = {}) => {
  const product = await productsRepository.findById(data.product_id);
  if (!product) {
    throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  let inventory;

  await pool.transaction(async (conn) => {
    if (data.type === 'in' || data.type === 'return') {
      inventory = await inventoryRepository.createOrUpdate(
        data.product_id, data.event_id, data.quantity, conn
      );
    } else if (data.type === 'out') {
      const success = await inventoryRepository.decrementStock(
        data.product_id, data.event_id, data.quantity, conn
      );
      if (!success) {
        throw Object.assign(
          new Error('Stock insuficiente para realizar la salida'),
          { statusCode: 422, code: 'BUSINESS_ERROR' }
        );
      }
      inventory = await inventoryRepository.findByProductAndEvent(data.product_id, data.event_id);
    } else if (data.type === 'adjustment') {
      await inventoryRepository.setQuantity(data.product_id, data.event_id, data.quantity);
      inventory = await inventoryRepository.findByProductAndEvent(data.product_id, data.event_id);
    }

    if (inventory) {
      await inventoryRepository.createMovement({
        inventory_id: inventory.id,
        type:         data.type,
        quantity:     data.quantity,
        reason:       data.reason,
        reference:    data.reference,
        created_by:   userId,
      }, conn);
    }
  });

  // Alerta de stock bajo via Socket.IO
  const updated = await inventoryRepository.findByProductAndEvent(data.product_id, data.event_id);
  if (updated && updated.quantity <= updated.min_stock) {
    try {
      getIO().emit('inventory:low_stock', {
        productId:   updated.product_id,
        productName: product.name,
        current:     updated.quantity,
        threshold:   updated.min_stock,
        eventId:     data.event_id || null,
      });
    } catch (e) {
      // Socket no crítico
    }
  }

  await auditService.log({
    user_id:    userId,
    action:     `inventory:${data.type}`,
    entity:     'inventory',
    entity_id:  updated?.id,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return updated;
};

const setMinStock = async (id, minStock, userId, meta = {}) => {
  await getById(id);
  await inventoryRepository.updateMinStock(id, minStock);

  await auditService.log({
    user_id:    userId,
    action:     'inventory:set_min_stock',
    entity:     'inventory',
    entity_id:  id,
    new_values: { min_stock: minStock },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const getMovements = async (id, query) => {
  await getById(id);
  return inventoryRepository.getMovements(id, query);
};

module.exports = { getAll, getById, adjust, setMinStock, getMovements };