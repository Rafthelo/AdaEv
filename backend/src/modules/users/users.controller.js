const usersService = require('./users.service');
const { successResponse, paginatedResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS } = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      search:    req.query.search,
      is_active: typeof req.query.is_active !== 'undefined' ? Number(req.query.is_active) : undefined,
    };
    const { rows, meta } = await usersService.getAll(filters, req.query);
    return res.status(HTTP_STATUS.OK).json(paginatedResponse(rows, meta));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const user = await usersService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(user));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const user = await usersService.create(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(user, 'Usuario creado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const user = await usersService.update(req.params.id, req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(user, 'Usuario actualizado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    await usersService.changePassword(
      req.params.id,
      req.body.current_password,
      req.body.new_password,
      meta
    );
    return res.status(HTTP_STATUS.OK).json(successResponse(null, 'Contraseña actualizada exitosamente'));
  } catch (error) {
    next(error);
  }
};

const deactivate = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    await usersService.deactivate(req.params.id, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(null, 'Usuario desactivado exitosamente'));
  } catch (error) {
    next(error);
  }
};
const remove = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    await usersService.remove(req.params.id, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(null, 'Usuario eliminado exitosamente'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, changePassword, deactivate, remove };