import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Table       from '../../components/common/Table';
import Badge       from '../../components/common/Badge';
import Alert       from '../../components/common/Alert';
import Pagination  from '../../components/common/Pagination';
import Modal       from '../../components/common/Modal';
import { getAuditLogs, getAuditLogById } from '../../api/endpoints/audit.api';

const ACTION_COLORS = {
  post:   'green',
  put:    'blue',
  patch:  'yellow',
  delete: 'red',
};

const getActionColor = (action) => {
  const verb = action.split(':').pop();
  return ACTION_COLORS[verb] || 'gray';
};

const Audit = () => {
  const [logs,    setLogs]    = useState([]);
  const [meta,    setMeta]    = useState({});
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [filters, setFilters] = useState({ entity: '', action: '' });
  const [alert,   setAlert]   = useState({ type: '', message: '' });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detail,     setDetail]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 15 };
        if (filters.entity) params.entity = filters.entity;
        if (filters.action) params.action = filters.action;
        const { data } = await getAuditLogs(params);
        if (!cancelled) { setLogs(data.data); setMeta(data.meta); }
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar auditoría' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page, filters]);

  const openDetail = async (id) => {
    try {
      const { data } = await getAuditLogById(id);
      setDetail(data.data);
      setDetailOpen(true);
    } catch {
      setAlert({ type: 'error', message: 'Error al cargar el detalle' });
    }
  };

  const columns = [
    { key: 'id',         label: '#',         render: (r) => `#${r.id}` },
    { key: 'username',   label: 'Usuario',   render: (r) => r.username || 'Sistema' },
    { key: 'action',     label: 'Acción',    render: (r) => <Badge label={r.action} color={getActionColor(r.action)} /> },
    { key: 'entity',     label: 'Entidad',   render: (r) => r.entity },
    { key: 'entity_id',  label: 'ID Entidad',render: (r) => r.entity_id || '—' },
    { key: 'ip_address', label: 'IP',        render: (r) => r.ip_address || '—' },
    { key: 'created_at', label: 'Fecha',     render: (r) => new Date(r.created_at).toLocaleString('es-BO') },
    {
      key: 'actions', label: '', width: '100px',
      render: (r) => (
        <button
          onClick={() => openDetail(r.id)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Ver detalle
        </button>
      )
    },
  ];

  return (
    <PageWrapper title="Auditoría">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <input
            type="text"
            placeholder="Filtrar por entidad (ej. sales)"
            value={filters.entity}
            onChange={(e) => { setFilters({ ...filters, entity: e.target.value }); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
          <input
            type="text"
            placeholder="Filtrar por acción (ej. create)"
            value={filters.action}
            onChange={(e) => { setFilters({ ...filters, action: e.target.value }); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>

        <Table columns={columns} data={logs} loading={loading} emptyMessage="No hay registros de auditoría" />
        <Pagination page={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
      </div>

      {/* Detalle */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={`Registro #${detail?.id}`} size="lg">
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Usuario</p>
                <p className="font-medium text-gray-800">{detail.username || 'Sistema'}</p>
              </div>
              <div>
                <p className="text-gray-500">Acción</p>
                <p className="font-medium text-gray-800">{detail.action}</p>
              </div>
              <div>
                <p className="text-gray-500">Entidad</p>
                <p className="font-medium text-gray-800">{detail.entity} #{detail.entity_id || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Fecha</p>
                <p className="font-medium text-gray-800">{new Date(detail.created_at).toLocaleString('es-BO')}</p>
              </div>
              <div>
                <p className="text-gray-500">IP</p>
                <p className="font-medium text-gray-800">{detail.ip_address || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">User Agent</p>
                <p className="text-xs text-gray-600 break-all">{detail.user_agent || '—'}</p>
              </div>
            </div>

            {detail.old_values && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Valores anteriores</p>
                <pre className="bg-gray-50 rounded-lg p-3 text-xs overflow-x-auto">
                  {JSON.stringify(detail.old_values, null, 2)}
                </pre>
              </div>
            )}

            {detail.new_values && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Valores nuevos</p>
                <pre className="bg-gray-50 rounded-lg p-3 text-xs overflow-x-auto">
                  {JSON.stringify(detail.new_values, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default Audit;