const rolesService = require('./roles.service');
const { successResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const roles = await rolesService.getAll();
    return res.status(HTTP_STATUS.OK).json(successResponse(roles));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const role = await rolesService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(role));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const role = await rolesService.create(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(role, 'Rol creado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const role = await rolesService.update(req.params.id, req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(role, 'Rol actualizado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const assignPermissions = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const role = await rolesService.assignPermissions(
      req.params.id,
      req.body.permissions,
      req.user.id,
      meta
    );
    return res.status(HTTP_STATUS.OK).json(successResponse(role, 'Permisos asignados exitosamente'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, assignPermissions };