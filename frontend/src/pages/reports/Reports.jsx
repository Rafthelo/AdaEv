import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button       from '../../components/common/Button';
import Alert         from '../../components/common/Alert';
import usePermissions from '../../hooks/usePermissions';
import { getEvents } from '../../api/endpoints/events.api';
import {
  downloadSalesReport, downloadCustodyReport,
  downloadFinanceReport, downloadPerformanceReport,
} from '../../api/endpoints/reports.api';

const ReportCard = ({ icon, title, description, onDownload, loading, disabled, requiresEvent }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <span className="text-3xl">{icon}</span>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    {requiresEvent && disabled && (
      <p className="text-xs text-amber-600">Selecciona un evento para este reporte</p>
    )}
    <Button onClick={onDownload} loading={loading} disabled={disabled} icon="⬇️">
      Descargar Excel
    </Button>
  </div>
);

const Reports = () => {
  const { can } = usePermissions();

  const [events,        setEvents]        = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [loadingType,   setLoadingType]   = useState(null);
  const [alert,         setAlert]         = useState({ type: '', message: '' });

  useEffect(() => {
    getEvents({ limit: 100 }).then(({ data }) => setEvents(data.data || [])).catch(() => {});
  }, []);

  const handleDownload = async (type, fn) => {
    setLoadingType(type);
    setAlert({ type: '', message: '' });
    try {
      await fn(selectedEvent || null);
      setAlert({ type: 'success', message: 'Reporte descargado exitosamente' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al generar el reporte' });
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <PageWrapper title="Reportes">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      {/* Selector de evento */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 mb-6">
        <label className="text-sm font-medium text-gray-600 block mb-2">Evento</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los eventos</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-2">
          Si no seleccionas un evento, los reportes de ventas, custodia y rendimiento incluirán todos los eventos. El reporte financiero requiere un evento específico.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {can('sales:read_all') && (
          <ReportCard
            icon="📊" title="Reporte de Ventas"
            description="Listado completo de ventas con vendedor, productos, montos y estado"
            onDownload={() => handleDownload('sales', downloadSalesReport)}
            loading={loadingType === 'sales'}
          />
        )}

        {can('custody:manage') && (
          <ReportCard
            icon="🎫" title="Reporte de Custodia"
            description="Objetos recibidos, devueltos y perdidos, con montos recaudados"
            onDownload={() => handleDownload('custody', downloadCustodyReport)}
            loading={loadingType === 'custody'}
          />
        )}

        {can('finance:summary') && (
          <ReportCard
            icon="💵" title="Reporte Financiero"
            description="Resumen completo: operación, ingresos, gastos y resultado neto"
            onDownload={() => handleDownload('finance', downloadFinanceReport)}
            loading={loadingType === 'finance'}
            disabled={!selectedEvent}
            requiresEvent
          />
        )}

        {can('sales:read_all') && (
          <ReportCard
            icon="👥" title="Rendimiento de Vendedores"
            description="Ventas totales y desempeño individual de cada vendedor"
            onDownload={() => handleDownload('performance', downloadPerformanceReport)}
            loading={loadingType === 'performance'}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default Reports;