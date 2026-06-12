const productsService     = require('./products.service');
const { successResponse, paginatedResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      search:      req.query.search,
      category_id: req.query.category_id,
      is_active:   typeof req.query.is_active !== 'undefined' ? Number(req.query.is_active) : undefined,
    };
    const { rows, meta } = await productsService.getAll(filters, req.query);
    return res.status(HTTP_STATUS.OK).json(paginatedResponse(rows, meta));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const product = await productsService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(product));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const meta    = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const product = await productsService.create(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(product, 'Producto creado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const meta    = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const product = await productsService.update(req.params.id, req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(product, 'Producto actualizado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const deactivate = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    await productsService.deactivate(req.params.id, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(null, 'Producto desactivado exitosamente'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, deactivate };