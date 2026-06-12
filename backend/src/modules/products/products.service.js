const productsRepository   = require('./products.repository');
const categoriesRepository = require('../categories/categories.repository');
const auditService         = require('../audit/audit.service');

const getAll = async (filters, query) => {
  return productsRepository.findAll(filters, query);
};

const getById = async (id) => {
  const product = await productsRepository.findById(id);
  if (!product) {
    throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return product;
};

const create = async (data, createdBy, meta = {}) => {
  if (data.sku) {
    const existing = await productsRepository.findBySku(data.sku);
    if (existing) {
      throw Object.assign(new Error('Ya existe un producto con ese SKU'), { statusCode: 409, code: 'CONFLICT' });
    }
  }

  if (data.category_id) {
    const category = await categoriesRepository.findById(data.category_id);
    if (!category) {
      throw Object.assign(new Error('Categoría no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
    }
  }

  const id = await productsRepository.create({ ...data, created_by: createdBy });

  await auditService.log({
    user_id:    createdBy,
    action:     'products:create',
    entity:     'products',
    entity_id:  id,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const update = async (id, data, updatedBy, meta = {}) => {
  const existing = await productsRepository.findById(id);
  if (!existing) {
    throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  if (data.sku && data.sku !== existing.sku) {
    const skuTaken = await productsRepository.findBySku(data.sku);
    if (skuTaken) {
      throw Object.assign(new Error('Ya existe un producto con ese SKU'), { statusCode: 409, code: 'CONFLICT' });
    }
  }

  if (data.category_id) {
    const category = await categoriesRepository.findById(data.category_id);
    if (!category) {
      throw Object.assign(new Error('Categoría no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
    }
  }

  await productsRepository.update(id, data);

  await auditService.log({
    user_id:    updatedBy,
    action:     'products:update',
    entity:     'products',
    entity_id:  id,
    old_values: existing,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getById(id);
};

const deactivate = async (id, deactivatedBy, meta = {}) => {
  const existing = await productsRepository.findById(id);
  if (!existing) {
    throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  await productsRepository.update(id, { is_active: 0 });

  await auditService.log({
    user_id:    deactivatedBy,
    action:     'products:deactivate',
    entity:     'products',
    entity_id:  id,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
};

module.exports = { getAll, getById, create, update, deactivate };