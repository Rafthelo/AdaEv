const auditService = require('./audit.service');
const { successResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS } = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = {
      user_id: req.query.user_id,
      entity:  req.query.entity,
      action:  req.query.action,
      from:    req.query.from,
      to:      req.query.to,
    };
    const { rows, meta } = await auditService.getAll(filters, req.query);
    return res.status(HTTP_STATUS.OK).json(
      { success: true, data: rows, meta }
    );
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const log = await auditService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(log));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById };