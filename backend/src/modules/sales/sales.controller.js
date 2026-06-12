const salesService        = require('./sales.service');
const { successResponse, paginatedResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      event_id: req.query.event_id,
      user_id:  req.query.user_id,
      status:   req.query.status,
      from:     req.query.from,
      to:       req.query.to,
    };
    const { rows, meta } = await salesService.getAll(filters, req.query);
    return res.status(HTTP_STATUS.OK).json(paginatedResponse(rows, meta));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const sale = await salesService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(sale));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const sale = await salesService.create(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(sale, 'Venta registrada exitosamente'));
  } catch (error) {
    next(error);
  }
};

const voidSale = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const sale = await salesService.voidSale(
      req.params.id, req.user.id, req.body.void_reason, meta
    );
    return res.status(HTTP_STATUS.OK).json(successResponse(sale, 'Venta anulada exitosamente'));
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await salesService.getStats(req.query.event_id);
    return res.status(HTTP_STATUS.OK).json(successResponse(stats));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, voidSale, getStats };