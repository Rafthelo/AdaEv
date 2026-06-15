const orgsService         = require('./organizations.service');
const { successResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const getAll = async (req, res, next) => {
  try {
    const filters = { search: req.query.search, is_active: typeof req.query.is_active !== 'undefined' ? Number(req.query.is_active) : undefined };
    const orgs = await orgsService.getAll(filters);
    return res.status(HTTP_STATUS.OK).json(successResponse(orgs));
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const org = await orgsService.getById(req.params.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(org));
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const org = await orgsService.create(req.body);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(org, 'Organización creada exitosamente'));
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const org = await orgsService.update(req.params.id, req.body);
    return res.status(HTTP_STATUS.OK).json(successResponse(org, 'Organización actualizada exitosamente'));
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update };