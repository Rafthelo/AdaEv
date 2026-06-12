const Joi = require('joi');

const adjustStockSchema = Joi.object({
  product_id: Joi.number().integer().required().messages({
    'any.required': 'El producto es requerido',
  }),
  event_id: Joi.number().integer().optional().allow(null),
  type: Joi.string().valid('in', 'out', 'adjustment', 'return').required().messages({
    'any.required': 'El tipo de movimiento es requerido',
    'any.only':     'Tipo debe ser: in, out, adjustment o return',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'La cantidad es requerida',
    'number.min':   'La cantidad debe ser mayor a 0',
  }),
  reason:    Joi.string().max(255).optional().allow('', null),
  reference: Joi.string().max(100).optional().allow('', null),
});

const setMinStockSchema = Joi.object({
  min_stock: Joi.number().integer().min(0).required().messages({
    'any.required': 'El stock mínimo es requerido',
    'number.min':   'El stock mínimo no puede ser negativo',
  }),
});

module.exports = { adjustStockSchema, setMinStockSchema };