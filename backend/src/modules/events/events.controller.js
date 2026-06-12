const eventsService       = require('./events.service');
const { successResponse, paginatedResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      search:    req.query.search,
      status:    req.query.status,
      is_active: typeof req.query.is_active !== 'undefined' ? Number(req.query.is_active) : undefined,
    };
    const { rows, meta } = await eventsService.getAll(filters, req.query);
    return res.status(HTTP_STATUS.OK).json(paginatedResponse(rows, meta));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const event = await eventsService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(event));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const meta  = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const event = await eventsService.create(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(event, 'Evento creado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const meta  = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const event = await eventsService.update(req.params.id, req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(event, 'Evento actualizado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const getEventProducts = async (req, res, next) => {
  try {
    const products = await eventsService.getEventProducts(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(products));
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const meta     = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const products = await eventsService.addProduct(req.params.id, req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(products, 'Producto agregado al evento'));
  } catch (error) {
    next(error);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    await eventsService.removeProduct(req.params.id, req.params.productId, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(null, 'Producto eliminado del evento'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, getEventProducts, addProduct, removeProduct };