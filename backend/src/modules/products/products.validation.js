const Joi = require('joi');

const createProductSchema = Joi.object({
  name:        Joi.string().min(2).max(150).required().messages({
    'string.empty': 'El nombre es requerido',
    'any.required': 'El nombre es requerido',
  }),
  description: Joi.string().max(500).optional().allow('', null),
  sku:         Joi.string().max(100).optional().allow('', null),
  price:       Joi.number().min(0).required().messages({
    'any.required': 'El precio es requerido',
    'number.min':   'El precio no puede ser negativo',
  }),
  category_id: Joi.number().integer().optional().allow(null),
});

const updateProductSchema = Joi.object({
  name:        Joi.string().min(2).max(150),
  description: Joi.string().max(500).optional().allow('', null),
  sku:         Joi.string().max(100).optional().allow('', null),
  price:       Joi.number().min(0),
  category_id: Joi.number().integer().optional().allow(null),
  is_active:   Joi.boolean(),
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar',
});

module.exports = { createProductSchema, updateProductSchema };