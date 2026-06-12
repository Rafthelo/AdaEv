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
import {
  getRegisters, createRegister,
  getSessions, openSession, closeSession,
  createMovement, getSessionMovements,
} from '../../api/endpoints/cashRegister.api';
import { getEvents } from '../../api/endpoints/events.api';

const STATUS_COLORS = { open: 'green', closed: 'gray' };
const STATUS_LABELS = { open: 'Abierta', closed: 'Cerrada' };
const MOVEMENT_LABELS = { open: 'Apertura', close: 'Cierre', in: 'Ingreso', out: 'Salida', adjustment: 'Ajuste' };

const Registers = ({ registers, can, onCreated, setAlert }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createRegister(form);
      setAlert({ type: 'success', message: 'Caja creada exitosamente' });
      setModalOpen(false);
      setForm({ name: '', description: '' });
      onCreated();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al crear caja' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Cajas registradas</h3>
        {can('cash:open') && (
          <Button size="sm" onClick={() => setModalOpen(true)} icon="＋">Nueva Caja</Button>
        )}
      </div>
      <div className="p-6 flex gap-3 flex-wrap">
        {registers.length === 0 && <p className="text-sm text-gray-400">No hay cajas registradas</p>}
        {registers.map((r) => (
          <div key={r.id} className="border border-gray-200 rounded-lg px-4 py-3">
            <p className="font-medium text-gray-800">{r.name}</p>
            <p className="text-xs text-gray-500">{r.description || 'Sin descripción'}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nueva Caja" size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required placeholder="Ej. Caja Principal"
          />
          <Input
            label="Descripción" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Opcional"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Crear</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const CashRegister = () => {
  const { can } = usePermissions();

  const [registers,  setRegisters]  = useState([]);
  const [sessions,   setSessions]   = useState([]);
  const [events,     setEvents]     = useState([]);
  const [meta,       setMeta]       = useState({});
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [alert,      setAlert]      = useState({ type: '', message: '' });

  const [openModal,  setOpenModal]  = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [movModal,   setMovModal]   = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [movements,  setMovements]  = useState([]);
  const [saving,     setSaving]     = useState(false);

  const [openForm,  setOpenForm]  = useState({ cash_register_id: '', event_id: '', opening_amount: '', notes: '' });
  const [closeForm, setCloseForm] = useState({ closing_amount: '', notes: '' });
  const [movForm,   setMovForm]   = useState({ type: 'in', amount: '', reason: '' });

  const loadRegisters = () => {
    getRegisters().then(({ data }) => setRegisters(data.data || [])).catch(() => {});
  };

  const loadSessions = () => {
    setLoading(true);
    getSessions({ page, limit: 10 })
      .then(({ data }) => { setSessions(data.data); setMeta(data.meta); })
      .catch(() => setAlert({ type: 'error', message: 'Error al cargar sesiones' }))
      .finally(() => setLoading(false));
  };

useEffect(() => {
  loadRegisters();
}, []);

useEffect(() => {
  let cancelled = false;
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data } = await getSessions({ page, limit: 10 });
      if (!cancelled) { setSessions(data.data); setMeta(data.meta); }
    } catch {
      if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar sesiones' });
    } finally {
      if (!cancelled) setLoading(false);
    }
  };
  fetchSessions();
  return () => { cancelled = true; };
}, [page]);

useEffect(() => {
  getEvents({ limit: 100 }).then(({ data }) => setEvents(data.data || [])).catch(() => {});
}, []);

  const handleOpenSession = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await openSession({
        cash_register_id: parseInt(openForm.cash_register_id),
        event_id:          openForm.event_id ? parseInt(openForm.event_id) : null,
        opening_amount:    parseFloat(openForm.opening_amount),
        notes:             openForm.notes || null,
      });
      setAlert({ type: 'success', message: 'Caja abierta exitosamente' });
      setOpenModal(false);
      setOpenForm({ cash_register_id: '', event_id: '', opening_amount: '', notes: '' });
      loadSessions();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al abrir caja' });
    } finally {
      setSaving(false);
    }
  };

  const openCloseModal = (session) => {
    setActiveSession(session);
    setCloseForm({ closing_amount: '', notes: '' });
    setCloseModal(true);
  };

  const handleCloseSession = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await closeSession(activeSession.id, {
        closing_amount: parseFloat(closeForm.closing_amount),
        notes:          closeForm.notes || null,
      });
      setAlert({ type: 'success', message: 'Caja cerrada exitosamente' });
      setCloseModal(false);
      loadSessions();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al cerrar caja' });
    } finally {
      setSaving(false);
    }
  };

  const openMovementsModal = async (session) => {
    setActiveSession(session);
    setMovForm({ type: 'in', amount: '', reason: '' });
    try {
      const { data } = await getSessionMovements(session.id, { limit: 50 });
      setMovements(data.data || []);
    } catch {
      setMovements([]);
    }
    setMovModal(true);
  };

  const handleCreateMovement = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createMovement({
        cash_session_id: activeSession.id,
        type:   movForm.type,
        amount: parseFloat(movForm.amount),
        reason: movForm.reason || null,
      });
      setAlert({ type: 'success', message: 'Movimiento registrado' });
      const { data } = await getSessionMovements(activeSession.id, { limit: 50 });
      setMovements(data.data || []);
      setMovForm({ type: 'in', amount: '', reason: '' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al registrar movimiento' });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'id',            label: '#',       render: (r) => `#${r.id}` },
    { key: 'register_name', label: 'Caja',    render: (r) => r.register_name },
    { key: 'event_name',    label: 'Evento',  render: (r) => r.event_name || '—' },
    { key: 'opening_amount',label: 'Apertura',render: (r) => `Bs. ${parseFloat(r.opening_amount).toFixed(2)}` },
    { key: 'closing_amount',label: 'Cierre',  render: (r) => r.closing_amount ? `Bs. ${parseFloat(r.closing_amount).toFixed(2)}` : '—' },
    { key: 'difference',    label: 'Diferencia', render: (r) => r.difference !== null
        ? <span className={parseFloat(r.difference) < 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
            Bs. {parseFloat(r.difference).toFixed(2)}
          </span>
        : '—'
    },
    { key: 'status', label: 'Estado', render: (r) => <Badge label={STATUS_LABELS[r.status]} color={STATUS_COLORS[r.status]} /> },
    { key: 'opened_by_username', label: 'Abierta por', render: (r) => r.opened_by_username || '—' },
    {
      key: 'actions', label: 'Acciones', width: '220px',
      render: (r) => (
        <div className="flex gap-2">
          {can('cash:movement') && (
            <Button size="sm" variant="secondary" onClick={() => openMovementsModal(r)}>Movimientos</Button>
          )}
          {can('cash:close') && r.status === 'open' && (
            <Button size="sm" variant="warning" onClick={() => openCloseModal(r)}>Cerrar</Button>
          )}
        </div>
      )
    },
  ];

  return (
    <PageWrapper title="Caja">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <Registers registers={registers} can={can} onCreated={loadRegisters} setAlert={setAlert} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Sesiones de caja</h3>
          {can('cash:open') && (
            <Button onClick={() => setOpenModal(true)} icon="＋">Abrir Caja</Button>
          )}
        </div>

        <Table columns={columns} data={sessions} loading={loading} emptyMessage="No hay sesiones registradas" />
        <Pagination page={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
      </div>

      {/* Modal Abrir Sesión */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title="Abrir Caja">
        <form onSubmit={handleOpenSession} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Caja <span className="text-red-500">*</span></label>
            <select
              value={openForm.cash_register_id}
              onChange={(e) => setOpenForm({ ...openForm, cash_register_id: e.target.value })}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una caja...</option>
              {registers.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Evento</label>
            <select
              value={openForm.event_id}
              onChange={(e) => setOpenForm({ ...openForm, event_id: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin evento</option>
              {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
            </select>
          </div>
          <Input
            label="Monto de apertura" type="number" min="0" step="0.01"
            value={openForm.opening_amount}
            onChange={(e) => setOpenForm({ ...openForm, opening_amount: e.target.value })}
            required placeholder="0.00"
          />
          <Input
            label="Notas" value={openForm.notes}
            onChange={(e) => setOpenForm({ ...openForm, notes: e.target.value })}
            placeholder="Opcional"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Abrir Caja</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Cerrar Sesión */}
      <Modal isOpen={closeModal} onClose={() => setCloseModal(false)} title="Cerrar Caja" size="sm">
        <form onSubmit={handleCloseSession} className="space-y-4">
          <p className="text-sm text-gray-600">
            Apertura: <span className="font-medium">Bs. {parseFloat(activeSession?.opening_amount || 0).toFixed(2)}</span>
          </p>
          <Input
            label="Monto de cierre (conteo físico)" type="number" min="0" step="0.01"
            value={closeForm.closing_amount}
            onChange={(e) => setCloseForm({ ...closeForm, closing_amount: e.target.value })}
            required placeholder="0.00"
          />
          <Input
            label="Notas" value={closeForm.notes}
            onChange={(e) => setCloseForm({ ...closeForm, notes: e.target.value })}
            placeholder="Opcional"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCloseModal(false)}>Cancelar</Button>
            <Button type="submit" variant="warning" loading={saving}>Cerrar Caja</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Movimientos */}
      <Modal isOpen={movModal} onClose={() => setMovModal(false)} title={`Movimientos — Sesión #${activeSession?.id}`} size="lg">
        <div className="space-y-4">
          {can('cash:movement') && activeSession?.status === 'open' && (
            <form onSubmit={handleCreateMovement} className="grid grid-cols-12 gap-2 items-end bg-gray-50 p-4 rounded-lg">
              <div className="col-span-3">
                <label className="text-xs font-medium text-gray-700">Tipo</label>
                <select
                  value={movForm.type}
                  onChange={(e) => setMovForm({ ...movForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
                >
                  <option value="in">Ingreso</option>
                  <option value="out">Salida</option>
                  <option value="adjustment">Ajuste</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="text-xs font-medium text-gray-700">Monto</label>
                <input
                  type="number" min="0.01" step="0.01" required
                  value={movForm.amount}
                  onChange={(e) => setMovForm({ ...movForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-4">
                <label className="text-xs font-medium text-gray-700">Motivo</label>
                <input
                  type="text"
                  value={movForm.reason}
                  onChange={(e) => setMovForm({ ...movForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
                  placeholder="Opcional"
                />
              </div>
              <div className="col-span-2">
                <Button type="submit" size="sm" loading={saving} className="w-full">Registrar</Button>
              </div>
            </form>
          )}

          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {movements.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sin movimientos registrados</p>
            ) : (
              movements.map((m) => (
                <div key={m.id} className="py-2 flex items-center justify-between text-sm">
                  <div>
                    <Badge label={MOVEMENT_LABELS[m.type]} color={m.type === 'in' || m.type === 'open' ? 'green' : m.type === 'out' ? 'red' : 'blue'} />
                    <span className="ml-2 text-gray-600">{m.reason || '—'}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">Bs. {parseFloat(m.amount).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{m.created_by_username}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default CashRegister;