const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'El usuario es requerido',
    'string.min':   'El usuario debe tener al menos 3 caracteres',
    'any.required': 'El usuario es requerido',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.empty': 'La contraseña es requerida',
    'string.min':   'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es requerida',
  }),
});

module.exports = { loginSchema };