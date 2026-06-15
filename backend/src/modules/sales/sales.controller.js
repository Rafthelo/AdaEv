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

    // Si no tiene permiso para ver todas las ventas, forzar solo las propias
    const permissions = req.user.permissions || [];
    if (!permissions.includes('sales:read_all')) {
      filters.user_id = req.user.id;
    }

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
    const sale = await salesService.create(req.body, req.user.id, req.user.seller_type, meta);
    const message = req.user.seller_type === 'waiter'
      ? 'Pedido enviado exitosamente'
      : 'Venta registrada exitosamente';
    return res.status(HTTP_STATUS.CREATED).json(successResponse(sale, message));
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
const getPendingOrders = async (req, res, next) => {
  try {
    const eventId = req.user.assigned_event_id;
    if (!eventId) {
      return res.status(HTTP_STATUS.OK).json(successResponse([]));
    }
    const orders = await salesService.getPendingOrders(eventId);
    return res.status(HTTP_STATUS.OK).json(successResponse(orders));
  } catch (error) {
    next(error);
  }
};
const getReadyOrders = async (req, res, next) => {
  try {
    const eventId = req.user.assigned_event_id;
    if (!eventId) {
      return res.status(HTTP_STATUS.OK).json(successResponse([]));
    }
    const orders = await salesService.getReadyOrders(eventId);
    return res.status(HTTP_STATUS.OK).json(successResponse(orders));
  } catch (error) {
    next(error);
  }
};
const markReady = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const sale = await salesService.markReady(req.params.id, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(sale, 'Pedido marcado como listo'));
  } catch (error) {
    next(error);
  }
};

const confirmDelivery = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const sale = await salesService.confirmDelivery(req.params.id, req.user.id, req.body.code, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(sale, 'Pedido confirmado exitosamente'));
  } catch (error) {
    next(error);
  }
};
module.exports = { getAll, getById, create, voidSale, getStats, getPendingOrders, getReadyOrders, markReady, confirmDelivery };