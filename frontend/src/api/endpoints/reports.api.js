import api from '../axios.config';

const downloadFile = async (url, params, defaultName) => {
  const response = await api.get(url, { params, responseType: 'blob' });

  const disposition = response.headers['content-disposition'];
  let filename = defaultName;
  if (disposition) {
    const match = disposition.match(/filename="(.+)"/);
    if (match) filename = match[1];
  }

  const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const downloadSalesReport = (eventId) =>
  downloadFile('/reports/sales', eventId ? { event_id: eventId } : {}, 'reporte_ventas.xlsx');

export const downloadCustodyReport = (eventId) =>
  downloadFile('/reports/custody', eventId ? { event_id: eventId } : {}, 'reporte_custodia.xlsx');

export const downloadFinanceReport = (eventId) =>
  downloadFile('/reports/finance', { event_id: eventId }, 'reporte_financiero.xlsx');

export const downloadPerformanceReport = (eventId) =>
  downloadFile('/reports/performance', eventId ? { event_id: eventId } : {}, 'reporte_rendimiento.xlsx');