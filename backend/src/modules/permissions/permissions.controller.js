const permissionsService  = require('./permissions.service');
const { successResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = { module: req.query.module };
    const result  = await permissionsService.getAll(filters);
    return res.status(HTTP_STATUS.OK).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const permission = await permissionsService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(permission));
  } catch (error) {
    next(error);
  }
};

const getModules = async (req, res, next) => {
  try {
    const modules = await permissionsService.getModules();
    return res.status(HTTP_STATUS.OK).json(successResponse(modules));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, getModules };