const summaryService      = require('./event-summary.service');
const { successResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getByEventId = async (req, res, next) => {
  try {
    const summary = await summaryService.getByEventId(req.params.eventId);
    return res.status(HTTP_STATUS.OK).json(successResponse(summary));
  } catch (error) {
    next(error);
  }
};

module.exports = { getByEventId };