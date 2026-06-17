import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Table       from '../../components/common/Table';
import Button      from '../../components/common/Button';
import Modal       from '../../components/common/Modal';
import Input       from '../../components/common/Input';
import Badge       from '../../components/common/Badge';
import Alert       from '../../components/common/Alert';
import Pagination  from '../../components/common/Pagination';
import usePermissions from '../../hooks/usePermissions';
import { getMovements, createMovement, updateMovement, deleteMovement, getFinanceSummary } from '../../api/endpoints/finance.api';
import { getOrganizations } from '../../api/endpoints/organizations.api';
import { getEvents }        from '../../api/endpoints/events.api';

const CATEGORIES = {
  external_income: { label: 'Ingreso Externo', color: 'green' },
  contribution:    { label: 'Aporte / Inversión', color: 'blue' },
  expense:         { label: 'Gasto', color: 'red' },
  return:          { label: 'Devolución / Retorno', color: 'yellow' },
};

const TYPES = {
  external_income: [
    { value: 'sponsorship',  label: 'Patrocinio' },
    { value: 'donation',     label: 'Donación' },
    { value: 'advance',      label: 'Adelanto' },
    { value: 'payment',      label: 'Pago recibido' },
    { value: 'other_income', label: 'Otro ingreso' },
  ],
  contribution: [
    { value: 'contribution', label: 'Aporte interno' },
    { value: 'loan',         label: 'Préstamo' },
    { value: 'investment',   label: 'Inversión' },
  ],
  expense: [
    { value: 'supplies',      label: 'Insumos / Compras' },
    { value: 'services',      label: 'Servicios' },
    { value: 'transport',     label: 'Transporte' },
    { value: 'advertising',   label: 'Publicidad' },
    { value: 'logistics',     label: 'Logística' },
    { value: 'other_expense', label: 'Otro gasto' },
  ],
  return: [
    { value: 'loan_return',          label: 'Devolución de préstamo' },
    { value: 'contribution_return',  label: 'Devolución de aporte' },
    { value: 'investor_payment',     label: 'Pago a inversionista' },
    { value: 'investment_return',    label: 'Retorno de inversión' },
  ],
};

const getTypeLabel = (category, type) => {
  const found = TYPES[category]?.find((t) => t.value === type);
  return found?.label || type;
};

const SummaryCard = ({ title, amount, color, children }) => (
  <div className={`bg-white rounded-xl border-2 ${color} p-4`}>
    <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
    <p className="text-2xl font-bold text-gray-800">Bs. {parseFloat(amount || 0).toFixed(2)}</p>
    {children}
  </div>
);

const EMPTY_FORM = {
  event_id: '', category: '', type: '', amount: '',
  description: '', date: new Date().toISOString().slice(0, 10),
  organization_id: '', related_movement_id: '',
};

const Finance = () => {
  const { can } = usePermissions();

  const [movements,   setMovements]   = useState([]);
  const [events,      setEvents]      = useState([]);
  const [orgs,        setOrgs]        = useState([]);
  const [meta,        setMeta]        = useState({});
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [filterEvent, setFilterEvent] = useState('');
  const [filterCat,   setFilterCat]   = useState('');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingId,  setDeletingId]  = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summary,     setSummary]     = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);
  const [alert,       setAlert]       = useState({ type: '', message: '' });
  const [refreshKey,  setRefreshKey]  = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 15 };
        if (filterEvent) params.event_id = filterEvent;
        if (filterCat)   params.category = filterCat;
        const { data } = await getMovements(params);
        if (!cancelled) { setMovements(data.data); setMeta(data.meta); }
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar movimientos' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page, filterEvent, filterCat, refreshKey]);

  useEffect(() => {
    getEvents({ limit: 100 }).then(({ data }) => setEvents(data.data || [])).catch(() => {});
    getOrganizations().then(({ data }) => setOrgs(data.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === 'category' ? { type: '' } : {}),
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    const payload = {
      event_id:            form.event_id            || null,
      category:            form.category,
      type:                form.type,
      amount:              parseFloat(form.amount),
      description:         form.description         || null,
      date:                form.date,
      organization_id:     form.organization_id     || null,
      related_movement_id: form.related_movement_id || null,
    };

    if (editing) {
      await updateMovement(editing.id, payload);
      setAlert({ type: 'success', message: 'Movimiento actualizado exitosamente' });
    } else {
      await createMovement(payload);
      setAlert({ type: 'success', message: 'Movimiento registrado exitosamente' });
    }

    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setRefreshKey((k) => k + 1);
  } catch (err) {
    setAlert({ type: 'error', message: err.response?.data?.message || 'Error al guardar' });
  } finally {
    setSaving(false);
  }
};

const openEdit = (movement) => {
  setEditing(movement);
  setForm({
    event_id:            movement.event_id || '',
    category:            movement.category,
    type:                movement.type,
    amount:              movement.amount,
    description:         movement.description || '',
    date:                movement.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    organization_id:     movement.organization_id || '',
    related_movement_id: movement.related_movement_id || '',
  });
  setModalOpen(true);
};

const openDelete = (id) => {
  setDeletingId(id);
  setDeleteReason('');
  setDeleteModal(true);
};

const handleDelete = async () => {
  if (!deleteReason.trim()) {
    setAlert({ type: 'error', message: 'El motivo de eliminación es requerido' });
    return;
  }
  setSaving(true);
  try {
    await deleteMovement(deletingId, deleteReason);
    setAlert({ type: 'success', message: 'Movimiento eliminado exitosamente' });
    setDeleteModal(false);
    setRefreshKey((k) => k + 1);
  } catch (err) {
    setAlert({ type: 'error', message: err.response?.data?.message || 'Error al eliminar' });
  } finally {
    setSaving(false);
  }
};

  const openSummary = async () => {
    if (!filterEvent) {
      setAlert({ type: 'error', message: 'Selecciona un evento para ver el resumen' });
      return;
    }
    try {
      const { data } = await getFinanceSummary(filterEvent);
      setSummary(data.data);
      setSummaryOpen(true);
    } catch {
      setAlert({ type: 'error', message: 'Error al cargar resumen' });
    }
  };

  const columns = [
    { key: 'date',      label: 'Fecha',     render: (r) => new Date(r.date).toLocaleDateString('es-BO') },
    { key: 'category',  label: 'Categoría', render: (r) => <Badge label={CATEGORIES[r.category]?.label} color={CATEGORIES[r.category]?.color} /> },
    { key: 'type',      label: 'Tipo',      render: (r) => getTypeLabel(r.category, r.type) },
    { key: 'description', label: 'Descripción', render: (r) => r.description || '—' },
    { key: 'organization_name', label: 'Organización', render: (r) => r.organization_name || '—' },
    { key: 'event_name', label: 'Evento',   render: (r) => r.event_name || '—' },
    { key: 'amount',    label: 'Monto',     render: (r) => <span className={`font-bold ${r.category === 'expense' || r.category === 'return' ? 'text-red-600' : 'text-green-600'}`}>Bs. {parseFloat(r.amount).toFixed(2)}</span> },
{
  key: 'actions', label: '', width: '160px',
  render: (r) => (
    <div className="flex gap-2">
      {can('finance:create') && (
        <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
      )}
      {can('finance:delete') && (
        <Button size="sm" variant="danger" onClick={() => openDelete(r.id)}>Eliminar</Button>
      )}
    </div>
  )
},
  ];

  return (
    <PageWrapper title="Gestión Financiera">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <select
              value={filterEvent}
              onChange={(e) => { setFilterEvent(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los eventos</option>
              {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
            </select>
            <select
              value={filterCat}
              onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            {can('finance:summary') && (
              <Button variant="secondary" onClick={openSummary}>📊 Resumen del evento</Button>
            )}
{can('finance:create') && (
  <Button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); }} icon="＋">
    Nuevo movimiento
  </Button>
)}
          </div>
        </div>

        <Table columns={columns} data={movements} loading={loading} emptyMessage="No hay movimientos registrados" />
        <Pagination page={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
      </div>

      {/* Modal Nuevo Movimiento */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Movimiento Financiero' : 'Nuevo Movimiento Financiero'} size="lg"> <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Evento</label>
              <select name="event_id" value={form.event_id} onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sin evento</option>
                {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
              </select>
            </div>
            <Input label="Fecha" name="date" type="date" value={form.date} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Categoría <span className="text-red-500">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} required
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selecciona...</option>
                {Object.entries(CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Tipo <span className="text-red-500">*</span></label>
              <select name="type" value={form.type} onChange={handleChange} required disabled={!form.category}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                <option value="">Selecciona categoría primero</option>
                {(TYPES[form.category] || []).map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Monto" name="amount" type="number" min="0" step="0.01"
              value={form.amount} onChange={handleChange} required placeholder="0.00" />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Organización</label>
              <select name="organization_id" value={form.organization_id} onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sin organización</option>
                {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
          </div>

          <Input label="Descripción" name="description" value={form.description}
            onChange={handleChange} placeholder="Detalle del movimiento" />

          {(form.category === 'return') && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Vinculado a (movimiento original)</label>
              <select name="related_movement_id" value={form.related_movement_id} onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sin vincular</option>
                {movements.filter((m) => m.category === 'contribution').map((m) => (
                  <option key={m.id} value={m.id}>
                    #{m.id} — {getTypeLabel(m.category, m.type)} — Bs. {parseFloat(m.amount).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button type="submit" loading={saving}>{editing ? 'Guardar cambios' : 'Registrar'}</Button>
           </div>
        </form>
      </Modal>

      {/* Modal Resumen */}
      <Modal isOpen={summaryOpen} onClose={() => setSummaryOpen(false)} title="Resumen Financiero del Evento" size="xl">
        {summary && (
          <div className="space-y-6">
            {/* Operación */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wide">Operación</h3>
              <div className="grid grid-cols-3 gap-3">
                <SummaryCard title="Ventas" amount={summary.operation.sales} color="border-green-200" />
                <SummaryCard title="Custodia" amount={summary.operation.custody} color="border-green-200" />
                <SummaryCard title="Total Operación" amount={summary.operation.total} color="border-green-400" />
              </div>
            </div>

            {/* Ingresos Externos */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wide">Ingresos Externos</h3>
              <div className="bg-green-50 rounded-lg p-4">
                {Object.entries(summary.external_income.breakdown).length === 0
                  ? <p className="text-sm text-gray-400">Sin ingresos externos registrados</p>
                  : Object.entries(summary.external_income.breakdown).map(([type, amount]) => (
                    <div key={type} className="flex justify-between text-sm py-1">
                      <span className="text-gray-700">{getTypeLabel('external_income', type)}</span>
                      <span className="font-medium text-green-700">Bs. {amount.toFixed(2)}</span>
                    </div>
                  ))
                }
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-green-200 mt-2">
                  <span>Total</span>
                  <span className="text-green-700">Bs. {summary.external_income.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Aportes e Inversiones */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wide">Aportes e Inversiones</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                {Object.entries(summary.contribution.breakdown).length === 0
                  ? <p className="text-sm text-gray-400">Sin aportes registrados</p>
                  : Object.entries(summary.contribution.breakdown).map(([type, amount]) => (
                    <div key={type} className="flex justify-between text-sm py-1">
                      <span className="text-gray-700">{getTypeLabel('contribution', type)}</span>
                      <span className="font-medium text-blue-700">Bs. {amount.toFixed(2)}</span>
                    </div>
                  ))
                }
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-blue-200 mt-2">
                  <span>Total</span>
                  <span className="text-blue-700">Bs. {summary.contribution.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Gastos */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wide">Gastos</h3>
              <div className="bg-red-50 rounded-lg p-4">
                {Object.entries(summary.expense.breakdown).length === 0
                  ? <p className="text-sm text-gray-400">Sin gastos registrados</p>
                  : Object.entries(summary.expense.breakdown).map(([type, amount]) => (
                    <div key={type} className="flex justify-between text-sm py-1">
                      <span className="text-gray-700">{getTypeLabel('expense', type)}</span>
                      <span className="font-medium text-red-700">Bs. {amount.toFixed(2)}</span>
                    </div>
                  ))
                }
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-red-200 mt-2">
                  <span>Total</span>
                  <span className="text-red-700">Bs. {summary.expense.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Devoluciones */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wide">Devoluciones y Retornos</h3>
              <div className="bg-yellow-50 rounded-lg p-4">
                {Object.entries(summary.return.breakdown).length === 0
                  ? <p className="text-sm text-gray-400">Sin devoluciones registradas</p>
                  : Object.entries(summary.return.breakdown).map(([type, amount]) => (
                    <div key={type} className="flex justify-between text-sm py-1">
                      <span className="text-gray-700">{getTypeLabel('return', type)}</span>
                      <span className="font-medium text-yellow-700">Bs. {amount.toFixed(2)}</span>
                    </div>
                  ))
                }
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-yellow-200 mt-2">
                  <span>Total</span>
                  <span className="text-yellow-700">Bs. {summary.return.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-xl p-4 ${summary.results.operative_result >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-sm text-gray-500">Resultado Operativo</p>
                  <p className={`text-2xl font-bold ${summary.results.operative_result >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    Bs. {summary.results.operative_result.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">Operación - Gastos</p>
                </div>
                <div className={`rounded-xl p-4 ${summary.results.net_result >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-sm text-gray-500">Resultado Neto</p>
                  <p className={`text-2xl font-bold ${summary.results.net_result >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    Bs. {summary.results.net_result.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">Operativo + Ingresos + Aportes - Devoluciones</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      {/* Modal Eliminar con motivo */}
<Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Eliminar Movimiento" size="sm">
  <div className="space-y-4">
    <p className="text-sm text-gray-600">
      Esta acción no se puede deshacer. Indica el motivo de la eliminación (quedará registrado en auditoría).
    </p>
    <Input
      label="Motivo de eliminación"
      value={deleteReason}
      onChange={(e) => setDeleteReason(e.target.value)}
      placeholder="Ej. Registrado por error, monto incorrecto..."
      required
    />
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancelar</Button>
      <Button variant="danger" onClick={handleDelete} loading={saving}>Confirmar Eliminación</Button>
    </div>
  </div>
</Modal>
    </PageWrapper>
  );
};

export default Finance;