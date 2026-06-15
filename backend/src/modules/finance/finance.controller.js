const financeService      = require('./finance.service');
const { successResponse, paginatedResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      event_id: req.query.event_id,
      category: req.query.category,
      type:     req.query.type,
    };
    const { rows, meta } = await financeService.getAll(filters, req.query);
    return res.status(HTTP_STATUS.OK).json(paginatedResponse(rows, meta));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const item = await financeService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(item));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const item = await financeService.create(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(item, 'Movimiento registrado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    await financeService.remove(req.params.id, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(null, 'Movimiento eliminado'));
  } catch (error) {
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const eventId = req.query.event_id || req.params.event_id;
    if (!eventId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false, error: 'VALIDATION_ERROR', message: 'event_id es requerido',
      });
    }
    const summary = await financeService.getSummary(eventId);
    return res.status(HTTP_STATUS.OK).json(successResponse(summary));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, remove, getSummary };