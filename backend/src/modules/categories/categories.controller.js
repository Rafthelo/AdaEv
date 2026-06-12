const categoriesService   = require('./categories.service');
const { successResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      is_active: typeof req.query.is_active !== 'undefined' ? Number(req.query.is_active) : undefined,
      parent_id: req.query.parent_id,
    };
    const categories = await categoriesService.getAll(filters);
    return res.status(HTTP_STATUS.OK).json(successResponse(categories));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const category = await categoriesService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(category));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const meta     = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const category = await categoriesService.create(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(category, 'Categoría creada exitosamente'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const meta     = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const category = await categoriesService.update(req.params.id, req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(category, 'Categoría actualizada exitosamente'));
  } catch (error) {
    next(error);
  }
};

const deactivate = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    await categoriesService.deactivate(req.params.id, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(null, 'Categoría desactivada exitosamente'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, deactivate };