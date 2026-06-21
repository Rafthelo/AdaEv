const seminarRepository = require('./seminar.repository');
const auditService      = require('../audit/audit.service');
const XLSX               = require('xlsx');

// ===== TOPICS =====

const getTopics = async (eventId) => {
  return seminarRepository.findTopicsByEvent(eventId);
};

const getTopicById = async (id) => {
  const topic = await seminarRepository.findTopicById(id);
  if (!topic) {
    throw Object.assign(new Error('Tema no encontrado'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return topic;
};

const createTopic = async (data, userId, meta = {}) => {
  const id = await seminarRepository.createTopic({ ...data, created_by: userId });

  await auditService.log({
    user_id:    userId,
    action:     'seminar:create_topic',
    entity:     'seminar_topics',
    entity_id:  id,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getTopicById(id);
};

const setTopicAvailable = async (id, available, userId, meta = {}) => {
  await getTopicById(id);
  await seminarRepository.setTopicAvailable(id, available);

  await auditService.log({
    user_id:    userId,
    action:     'seminar:toggle_certificates',
    entity:     'seminar_topics',
    entity_id:  id,
    new_values: { certificates_available: available },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getTopicById(id);
};

const deleteTopic = async (id, userId, meta = {}) => {
  const topic = await getTopicById(id);
  await seminarRepository.deleteTopic(id);

  await auditService.log({
    user_id:    userId,
    action:     'seminar:delete_topic',
    entity:     'seminar_topics',
    entity_id:  id,
    old_values: topic,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
};

// ===== ENROLLMENTS =====

const getEnrollments = async (topicId) => {
  await getTopicById(topicId);
  return seminarRepository.findEnrollmentsByTopic(topicId);
};

const createEnrollment = async (data, userId, meta = {}) => {
  await getTopicById(data.topic_id);

  let id;
  try {
    id = await seminarRepository.createEnrollment(data);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      throw Object.assign(
        new Error(`El RU "${data.ru_code}" ya está inscrito en este tema`),
        { statusCode: 409, code: 'CONFLICT' }
      );
    }
    throw e;
  }

  await auditService.log({
    user_id:    userId,
    action:     'seminar:create_enrollment',
    entity:     'seminar_enrollments',
    entity_id:  id,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  const [enrollment] = await seminarRepository.findEnrollmentsByTopic(data.topic_id);
  return enrollment;
};

const bulkImport = async (topicId, fileBuffer, userId, meta = {}) => {
  await getTopicById(topicId);

  const workbook  = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet     = workbook.Sheets[sheetName];
  const rawRows   = XLSX.utils.sheet_to_json(sheet);

  const rows = rawRows.map((r) => ({
    ru_code:     String(r.ru_code ?? r.RU ?? r.ru ?? '').trim(),
    full_name:   String(r.full_name ?? r.nombre ?? r.Nombre ?? '').trim(),
    career:      String(r.career ?? r.carrera ?? r.Carrera ?? '').trim() || null,
    amount_paid: parseFloat(r.amount_paid ?? r.monto ?? r.Monto ?? 0) || 0,
  })).filter((r) => r.ru_code && r.full_name);

  if (rows.length === 0) {
    throw Object.assign(
      new Error('El archivo no contiene filas válidas. Verifica que tenga las columnas ru_code, full_name, career, amount_paid'),
      { statusCode: 422, code: 'BUSINESS_ERROR' }
    );
  }

  const result = await seminarRepository.bulkCreateEnrollments(topicId, rows);

  await auditService.log({
    user_id:    userId,
    action:     'seminar:bulk_import',
    entity:     'seminar_topics',
    entity_id:  topicId,
    new_values: { inserted: result.inserted, skipped: result.skipped },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return result;
};

const getEnrollmentById = async (id) => {
  const enrollment = await seminarRepository.findEnrollmentById(id);
  if (!enrollment) {
    throw Object.assign(new Error('Inscripción no encontrada'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return enrollment;
};

const searchByRu = async (ruCode, eventId) => {
  const results = await seminarRepository.findByRu(ruCode, eventId);
  if (results.length === 0) {
    throw Object.assign(new Error('No se encontraron inscripciones con ese RU'), { statusCode: 404, code: 'NOT_FOUND' });
  }
  return results;
};

const updateEnrollment = async (id, data, userId, meta = {}) => {
  const existing = await getEnrollmentById(id);
  await seminarRepository.updateEnrollment(id, data);

  await auditService.log({
    user_id:    userId,
    action:     'seminar:update_enrollment',
    entity:     'seminar_enrollments',
    entity_id:  id,
    old_values: existing,
    new_values: data,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return getEnrollmentById(id);
};

const deliverCertificates = async (ids, userId, meta = {}) => {
  // Verificar que todos pertenezcan a temas con certificados habilitados
  for (const id of ids) {
    const enrollment = await getEnrollmentById(id);
    if (!enrollment.certificates_available) {
      throw Object.assign(
        new Error(`El certificado del tema "${enrollment.topic_name}" aún no está disponible para entrega`),
        { statusCode: 422, code: 'BUSINESS_ERROR' }
      );
    }
  }

  await seminarRepository.markDelivered(ids, userId);

  await auditService.log({
    user_id:    userId,
    action:     'seminar:deliver',
    entity:     'seminar_enrollments',
    new_values: { ids, count: ids.length },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
};

const deleteEnrollment = async (id, userId, meta = {}) => {
  const existing = await getEnrollmentById(id);
  await seminarRepository.deleteEnrollment(id);

  await auditService.log({
    user_id:    userId,
    action:     'seminar:delete_enrollment',
    entity:     'seminar_enrollments',
    entity_id:  id,
    old_values: existing,
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
};

const getEventTotals = async (eventId) => {
  return seminarRepository.getEventTotals(eventId);
};

module.exports = {
  getTopics, getTopicById, createTopic, setTopicAvailable, deleteTopic,
  getEnrollments, createEnrollment, bulkImport, getEnrollmentById,
  searchByRu, updateEnrollment, deliverCertificates, deleteEnrollment,
  getEventTotals,
};