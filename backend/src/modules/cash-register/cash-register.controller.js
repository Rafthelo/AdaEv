const cashService         = require('./cash-register.service');
const { successResponse, paginatedResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAllRegisters = async (req, res, next) => {
  try {
    const registers = await cashService.getAllRegisters();
    return res.status(HTTP_STATUS.OK).json(successResponse(registers));
  } catch (error) {
    next(error);
  }
};

const createRegister = async (req, res, next) => {
  try {
    const meta     = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const register = await cashService.createRegister(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(register, 'Caja creada exitosamente'));
  } catch (error) {
    next(error);
  }
};

const getAllSessions = async (req, res, next) => {
  try {
    const filters = {
      cash_register_id: req.query.cash_register_id,
      event_id:         req.query.event_id,
      status:           req.query.status,
    };
    const { rows, meta } = await cashService.getAllSessions(filters, req.query);
    return res.status(HTTP_STATUS.OK).json(paginatedResponse(rows, meta));
  } catch (error) {
    next(error);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const session = await cashService.getSessionById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(session));
  } catch (error) {
    next(error);
  }
};

const openSession = async (req, res, next) => {
  try {
    const meta    = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const session = await cashService.openSession(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(session, 'Caja abierta exitosamente'));
  } catch (error) {
    next(error);
  }
};

const closeSession = async (req, res, next) => {
  try {
    const meta    = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const session = await cashService.closeSession(req.params.id, req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(session, 'Caja cerrada exitosamente'));
  } catch (error) {
    next(error);
  }
};

const createMovement = async (req, res, next) => {
  try {
    const meta    = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const session = await cashService.createMovement(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(session, 'Movimiento registrado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const getMovements = async (req, res, next) => {
  try {
    const { rows, meta } = await cashService.getMovements(req.params.id, req.query);
    return res.status(HTTP_STATUS.OK).json(paginatedResponse(rows, meta));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRegisters, createRegister,
  getAllSessions, getSessionById,
  openSession, closeSession,
  createMovement, getMovements,
};