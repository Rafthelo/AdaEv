const Joi = require('joi');

const createUserSchema = Joi.object({
  username:   Joi.string().min(3).max(50).required().messages({
    'string.empty': 'El usuario es requerido',
    'any.required': 'El usuario es requerido',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'El email es requerido',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.empty': 'La contraseña es requerida',
    'string.min':   'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es requerida',
  }),
  first_name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'El nombre es requerido',
    'any.required': 'El nombre es requerido',
  }),
  last_name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'El apellido es requerido',
    'any.required': 'El apellido es requerido',
  }),
  roles: Joi.array().items(Joi.number().integer()).min(1).required().messages({
    'array.min':    'Debe asignar al menos un rol',
    'any.required': 'Los roles son requeridos',
  }),
});

const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Email inválido',
  }),
  first_name: Joi.string().min(2).max(50),
  last_name:  Joi.string().min(2).max(50),
  is_active:  Joi.boolean(),
  roles:      Joi.array().items(Joi.number().integer()).min(1),
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar',
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required().messages({
    'any.required': 'La contraseña actual es requerida',
  }),
  new_password: Joi.string().min(6).max(100).required().messages({
    'string.min':   'La nueva contraseña debe tener al menos 6 caracteres',
    'any.required': 'La nueva contraseña es requerida',
  }),
});

module.exports = { createUserSchema, updateUserSchema, changePasswordSchema };