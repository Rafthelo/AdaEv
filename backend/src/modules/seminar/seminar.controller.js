const seminarService      = require('./seminar.service');
const { successResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

// ===== TOPICS =====

const getTopics = async (req, res, next) => {
  try {
    const topics = await seminarService.getTopics(req.query.event_id);
    return res.status(HTTP_STATUS.OK).json(successResponse(topics));
  } catch (error) {
    next(error);
  }
};

const createTopic = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const topic = await seminarService.createTopic(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(topic, 'Tema creado exitosamente'));
  } catch (error) {
    next(error);
  }
};

const setTopicAvailable = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const topic = await seminarService.setTopicAvailable(req.params.id, req.body.available, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(topic, 'Estado de certificados actualizado'));
  } catch (error) {
    next(error);
  }
};

const deleteTopic = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    await seminarService.deleteTopic(req.params.id, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(null, 'Tema eliminado'));
  } catch (error) {
    next(error);
  }
};

// ===== ENROLLMENTS =====

const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await seminarService.getEnrollments(req.params.topicId);
    return res.status(HTTP_STATUS.OK).json(successResponse(enrollments));
  } catch (error) {
    next(error);
  }
};

const createEnrollment = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const enrollment = await seminarService.createEnrollment(req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.CREATED).json(successResponse(enrollment, 'Inscripción registrada exitosamente'));
  } catch (error) {
    next(error);
  }
};

const bulkImport = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false, error: 'VALIDATION_ERROR', message: 'Debes subir un archivo Excel o CSV',
      });
    }
    const result = await seminarService.bulkImport(req.params.topicId, req.file.buffer, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(result, `${result.inserted} inscripciones cargadas, ${result.skipped} omitidas (duplicadas o inválidas)`));
  } catch (error) {
    next(error);
  }
};

const searchByRu = async (req, res, next) => {
  try {
    const results = await seminarService.searchByRu(req.query.ru_code, req.query.event_id);
    return res.status(HTTP_STATUS.OK).json(successResponse(results));
  } catch (error) {
    next(error);
  }
};

const updateEnrollment = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const enrollment = await seminarService.updateEnrollment(req.params.id, req.body, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(enrollment, 'Inscripción actualizada exitosamente'));
  } catch (error) {
    next(error);
  }
};

const deliverCertificates = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const ids = req.body.ids || [];
    if (ids.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false, error: 'VALIDATION_ERROR', message: 'Debes seleccionar al menos una inscripción',
      });
    }
    await seminarService.deliverCertificates(ids, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(null, 'Certificados entregados exitosamente'));
  } catch (error) {
    next(error);
  }
};

const deleteEnrollment = async (req, res, next) => {
  try {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    await seminarService.deleteEnrollment(req.params.id, req.user.id, meta);
    return res.status(HTTP_STATUS.OK).json(successResponse(null, 'Inscripción eliminada'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopics, createTopic, setTopicAvailable, deleteTopic,
  getEnrollments, createEnrollment, bulkImport, searchByRu,
  updateEnrollment, deliverCertificates, deleteEnrollment,
};