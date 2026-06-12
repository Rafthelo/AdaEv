const dashboardService    = require('./dashboard.service');
const { successResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats(req.query.event_id);
    return res.status(HTTP_STATUS.OK).json(successResponse(stats));
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };