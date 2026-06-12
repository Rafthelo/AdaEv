const Joi = require('joi');

const createSaleSchema = Joi.object({
  event_id: Joi.number().integer().optional().allow(null),
  notes:    Joi.string().max(500).optional().allow('', null),
  items:    Joi.array().items(
    Joi.object({
      product_id: Joi.number().integer().required().messages({
        'any.required': 'El producto es requerido en cada ítem',
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        'any.required': 'La cantidad es requerida',
        'number.min':   'La cantidad debe ser mayor a 0',
      }),
      unit_price: Joi.number().min(0).required().messages({
        'any.required': 'El precio unitario es requerido',
        'number.min':   'El precio no puede ser negativo',
      }),
    })
  ).min(1).required().messages({
    'array.min':    'La venta debe tener al menos un ítem',
    'any.required': 'Los ítems son requeridos',
  }),
});

const voidSaleSchema = Joi.object({
  void_reason: Joi.string().min(5).max(255).required().messages({
    'string.empty': 'El motivo de anulación es requerido',
    'string.min':   'El motivo debe tener al menos 5 caracteres',
    'any.required': 'El motivo de anulación es requerido',
  }),
});

module.exports = { createSaleSchema, voidSaleSchema };