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
  getEvents, createEvent, updateEvent,
} from '../../api/endpoints/events.api';

const STATUS_COLORS = {
  draft:     'gray',
  active:    'green',
  paused:    'yellow',
  closed:    'blue',
  cancelled: 'red',
};

const STATUS_LABELS = {
  draft:     'Borrador',
  active:    'Activo',
  paused:    'Pausado',
  closed:    'Cerrado',
  cancelled: 'Cancelado',
};

const EMPTY_FORM = {
  name: '', description: '', location: '',
  starts_at: '', ends_at: '', status: 'draft',
};

const Events = () => {
  const { can } = usePermissions();

  const [events,     setEvents]     = useState([]);
  const [meta,       setMeta]       = useState({});
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [alert,      setAlert]      = useState({ type: '', message: '' });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data } = await getEvents({ page, limit: 10, search });
        if (!cancelled) {
          setEvents(data.data);
          setMeta(data.meta);
        }
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar eventos' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchEvents();
    return () => { cancelled = true; };
  }, [page, search, refreshKey]);

  const isLocked = editing && ['closed', 'cancelled'].includes(editing.status);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      name:        event.name,
      description: event.description || '',
      location:    event.location    || '',
      starts_at:   event.starts_at?.slice(0, 16) || '',
      ends_at:     event.ends_at?.slice(0, 16)   || '',
      status:      ['closed', 'cancelled'].includes(event.status) ? 'active' : event.status,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = isLocked
        ? { status: form.status }
        : {
            ...form,
            starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : undefined,
            ends_at:   form.ends_at   ? new Date(form.ends_at).toISOString()   : undefined,
          };

      if (editing) {
        await updateEvent(editing.id, payload);
        setAlert({ type: 'success', message: 'Evento actualizado exitosamente' });
      } else {
        await createEvent(payload);
        setAlert({ type: 'success', message: 'Evento creado exitosamente' });
      }
      setModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'name',     label: 'Nombre',   render: (r) => <span className="font-medium text-gray-800">{r.name}</span> },
    { key: 'location', label: 'Lugar',    render: (r) => r.location || '—' },
    { key: 'starts_at',label: 'Inicio',   render: (r) => new Date(r.starts_at).toLocaleDateString('es-BO') },
    { key: 'status',   label: 'Estado',   render: (r) => <Badge label={STATUS_LABELS[r.status]} color={STATUS_COLORS[r.status]} /> },
    { key: 'created_by_username', label: 'Creado por', render: (r) => r.created_by_username || '—' },
    {
      key: 'actions', label: 'Acciones', width: '120px',
      render: (r) => (
        <div className="flex gap-2">
          {can('events:update') && (
            <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
          )}
        </div>
      )
    },
  ];

  return (
    <PageWrapper title="Eventos">
      {/* Alert */}
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Buscar evento..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          {can('events:create') && (
            <Button onClick={openCreate} icon="＋">Nuevo Evento</Button>
          )}
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={events}
          loading={loading}
          emptyMessage="No hay eventos registrados"
        />

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={meta.totalPages || 1}
          onPageChange={setPage}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Evento' : 'Nuevo Evento'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {isLocked && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
              Este evento está {editing.status === 'closed' ? 'cerrado' : 'cancelado'}. Solo puedes cambiar su estado para reabrirlo.
            </div>
          )}

          {!isLocked && (
            <>
              <Input
                label="Nombre"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nombre del evento"
              />
              <Input
                label="Descripción"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción opcional"
              />
              <Input
                label="Lugar"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Ubicación del evento"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Fecha de inicio"
                  name="starts_at"
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Fecha de fin"
                  name="ends_at"
                  type="datetime-local"
                  value={form.ends_at}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {editing && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Estado</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLocked ? (
                  <>
                    <option value="draft">Borrador</option>
                    <option value="active">Activo</option>
                    <option value="paused">Pausado</option>
                  </>
                ) : (
                  <>
                    <option value="draft">Borrador</option>
                    <option value="active">Activo</option>
                    <option value="paused">Pausado</option>
                    <option value="closed">Cerrado</option>
                    <option value="cancelled">Cancelado</option>
                  </>
                )}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Guardar cambios' : 'Crear evento'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default Events;