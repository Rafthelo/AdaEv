const Joi = require('joi');

const createEventSchema = Joi.object({
  name:        Joi.string().min(2).max(150).required().messages({
    'string.empty': 'El nombre es requerido',
    'any.required': 'El nombre es requerido',
  }),
  description: Joi.string().max(500).optional().allow('', null),
  location:    Joi.string().max(255).optional().allow('', null),
  starts_at:   Joi.date().iso().required().messages({
    'any.required': 'La fecha de inicio es requerida',
    'date.format':  'La fecha debe estar en formato ISO',
  }),
  ends_at:     Joi.date().iso().min(Joi.ref('starts_at')).optional().allow(null).messages({
    'date.min': 'La fecha de fin debe ser posterior a la fecha de inicio',
  }),
  status:      Joi.string().valid('draft', 'active', 'paused', 'closed', 'cancelled').optional(),
});

const updateEventSchema = Joi.object({
  name:        Joi.string().min(2).max(150),
  description: Joi.string().max(500).optional().allow('', null),
  location:    Joi.string().max(255).optional().allow('', null),
  starts_at:   Joi.date().iso(),
  ends_at:     Joi.date().iso().optional().allow(null),
  status:      Joi.string().valid('draft', 'active', 'paused', 'closed', 'cancelled'),
  is_active:   Joi.boolean(),
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar',
});

const addProductSchema = Joi.object({
  product_id: Joi.number().integer().required().messages({
    'any.required': 'El producto es requerido',
  }),
  price: Joi.number().min(0).optional().allow(null),
});

module.exports = { createEventSchema, updateEventSchema, addProductSchema };