const Joi = require('joi');

const createRegisterSchema = Joi.object({
  name:        Joi.string().min(2).max(100).required().messages({
    'string.empty': 'El nombre es requerido',
    'any.required': 'El nombre es requerido',
  }),
  description: Joi.string().max(255).optional().allow('', null),
});

const openSessionSchema = Joi.object({
  cash_register_id: Joi.number().integer().required().messages({
    'any.required': 'La caja es requerida',
  }),
  event_id:         Joi.number().integer().optional().allow(null),
  opening_amount:   Joi.number().min(0).required().messages({
    'any.required': 'El monto de apertura es requerido',
    'number.min':   'El monto no puede ser negativo',
  }),
  notes: Joi.string().max(500).optional().allow('', null),
});

const closeSessionSchema = Joi.object({
  closing_amount: Joi.number().min(0).required().messages({
    'any.required': 'El monto de cierre es requerido',
    'number.min':   'El monto no puede ser negativo',
  }),
  notes: Joi.string().max(500).optional().allow('', null),
});

const movementSchema = Joi.object({
  cash_session_id: Joi.number().integer().required().messages({
    'any.required': 'La sesión de caja es requerida',
  }),
  type:   Joi.string().valid('in', 'out', 'adjustment').required().messages({
    'any.required': 'El tipo de movimiento es requerido',
    'any.only':     'Tipo debe ser: in, out o adjustment',
  }),
  amount: Joi.number().min(0.01).required().messages({
    'any.required': 'El monto es requerido',
    'number.min':   'El monto debe ser mayor a 0',
  }),
  reason: Joi.string().max(255).optional().allow('', null),
});

module.exports = {
  createRegisterSchema,
  openSessionSchema,
  closeSessionSchema,
  movementSchema,
};