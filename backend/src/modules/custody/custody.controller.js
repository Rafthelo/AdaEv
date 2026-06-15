const custodyService      = require('./custody.service');
const { successResponse, paginatedResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      event_id:    req.query.event_id,
      status:      req.query.status,
      search:      req.query.search,
      operator_id: req.query.operator_id,
    };
    const { rows, meta } = await custodyService.getAll(filters, req.query);
    return res.status(HTTP_STATUS.OK).json(paginatedResponse(rows, meta));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const item = await custodyService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(item));
  } catch (error) {
    next(error);
  }
};

const searchByTicket = async (req, res, next) => {
  try {
    const item = await custodyService.searchByTicket(
      req.query.ticket_code,
      req.query.event_id || null
    );
    return res.status(HTTP_STATUS.OK).json(successResponse(item));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const item = await custodyService.create(
      req.body,
      req.user.id,
      req.file || null,
      meta
    );
    return res.status(HTTP_STATUS.CREATED).json(successResponse(item, 'Objeto registrado en custodia'));
  } catch (error) {
    next(error);
  }
};

const markReturned = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const item = await custodyService.markReturned(req.params.id, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(item, 'Objeto devuelto exitosamente'));
  } catch (error) {
    next(error);
  }
};

const markLost = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const item = await custodyService.markLost(req.params.id, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(item, 'Objeto marcado como perdido'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, searchByTicket, create, markReturned, markLost };