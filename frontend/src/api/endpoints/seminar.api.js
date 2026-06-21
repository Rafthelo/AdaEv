import api from '../axios.config';

export const getTopics = (eventId) =>
  api.get('/seminar/topics', { params: { event_id: eventId } });

export const createTopic = (data) =>
  api.post('/seminar/topics', data);

export const setTopicAvailable = (id, available) =>
  api.patch(`/seminar/topics/${id}/available`, { available });

export const deleteTopic = (id) =>
  api.delete(`/seminar/topics/${id}`);

export const getEnrollments = (topicId) =>
  api.get(`/seminar/topics/${topicId}/enrollments`);

export const createEnrollment = (data) =>
  api.post('/seminar/enrollments', data);

export const bulkImport = (topicId, file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post(`/seminar/topics/${topicId}/import`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const searchByRu = (ruCode, eventId) =>
  api.get('/seminar/search', { params: { ru_code: ruCode, event_id: eventId } });

export const updateEnrollment = (id, data) =>
  api.put(`/seminar/enrollments/${id}`, data);

export const deliverCertificates = (ids) =>
  api.patch('/seminar/enrollments/deliver', { ids });

export const deleteEnrollment = (id) =>
  api.delete(`/seminar/enrollments/${id}`);