const inventoryService    = require('./inventory.service');
const { successResponse, paginatedResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      event_id:   req.query.event_id,
      product_id: req.query.product_id,
      low_stock:  req.query.low_stock === 'true',
    };
    const { rows, meta } = await inventoryService.getAll(filters, req.query);
    return res.status(HTTP_STATUS.OK).json(paginatedResponse(rows, meta));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const item = await inventoryService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(item));
  } catch (error) {
    next(error);
  }
};

const adjust = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const item = await inventoryService.adjust(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(item, 'Inventario ajustado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const setMinStock = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const item = await inventoryService.setMinStock(req.params.id, req.body.min_stock, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(item, 'Stock mínimo actualizado'));
  } catch (error) {
    next(error);
  }
};

const getMovements = async (req, res, next) => {
  try {
    const { rows, meta } = await inventoryService.getMovements(req.params.id, req.query);
    return res.status(HTTP_STATUS.OK).json(paginatedResponse(rows, meta));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, adjust, setMinStock, getMovements };