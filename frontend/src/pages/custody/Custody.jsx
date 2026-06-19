import { useState, useEffect, useRef } from 'react';
import PageWrapper    from '../../components/layout/PageWrapper';
import Table          from '../../components/common/Table';
import Button         from '../../components/common/Button';
import Modal          from '../../components/common/Modal';
import Input          from '../../components/common/Input';
import Badge          from '../../components/common/Badge';
import Alert          from '../../components/common/Alert';
import Pagination     from '../../components/common/Pagination';
import usePermissions from '../../hooks/usePermissions';
import useAuth        from '../../hooks/useAuth';
import {
  getCustodyItems, searchByTicket, createCustodyItem,
  returnCustodyItem, markCustodyLost,
} from '../../api/endpoints/custody.api';
import { getEvents } from '../../api/endpoints/events.api';

const STATUS_LABELS = { active: 'En custodia', returned: 'Devuelto', lost: 'Perdido' };
const STATUS_COLORS = { active: 'blue', returned: 'green', lost: 'red' };

const EMPTY_FORM = {
  ticket_code: '', description: '', observations: '', event_id: '', price: '',
};

const Custody = () => {
  const { can }  = usePermissions();
  const { user } = useAuth();

  const [items,      setItems]      = useState([]);
  const [events,     setEvents]     = useState([]);
  const [meta,       setMeta]       = useState({});
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [search               ]     = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [refreshKey, setRefreshKey] = useState(0);
  const [alert,      setAlert]      = useState({ type: '', message: '' });

  // Modal registro
  const [createModal, setCreateModal] = useState(false);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [photo,       setPhoto]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving,      setSaving]      = useState(false);
  const fileRef   = useRef();
  const cameraRef = useRef();

  // Modal búsqueda por ticket
  const [searchModal,  setSearchModal]  = useState(false);
  const [ticketSearch, setTicketSearch] = useState('');
  const [foundItem,    setFoundItem]    = useState(null);
  const [searching,    setSearching]    = useState(false);

  // Modal detalle
  const [detailModal, setDetailModal] = useState(false);
  const [detailItem,  setDetailItem]  = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (search) params.search = search;
        if (statusFilter) params.status = statusFilter;
        if (user?.assigned_event_id) params.event_id = user.assigned_event_id;
        const { data } = await getCustodyItems(params);
        if (!cancelled) { setItems(data.data); setMeta(data.meta); }
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar custodia' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page, search, statusFilter, refreshKey, user]);

  useEffect(() => {
    getEvents({ limit: 100 }).then(({ data }) => setEvents(data.data || [])).catch(() => {});
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('ticket_code',  form.ticket_code);
      fd.append('description',  form.description);
      fd.append('observations', form.observations || '');
      fd.append('event_id', form.event_id || user?.assigned_event_id || '');
      fd.append('price', form.price || '0');
      if (photo) fd.append('photo', photo);

      await createCustodyItem(fd);
      setAlert({ type: 'success', message: 'Objeto registrado en custodia' });
      setCreateModal(false);
      setForm(EMPTY_FORM);
      setPhoto(null);
      setPhotoPreview(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al registrar' });
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async () => {
    if (!ticketSearch.trim()) return;
    setSearching(true);
    setFoundItem(null);
    try {
      const { data } = await searchByTicket(ticketSearch, user?.assigned_event_id || null);
      setFoundItem(data.data);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Ticket no encontrado' });
      setSearchModal(false);
    } finally {
      setSearching(false);
    }
  };

  const handleReturn = async (id) => {
    setSaving(true);
    try {
      await returnCustodyItem(id);
      setAlert({ type: 'success', message: 'Objeto devuelto exitosamente' });
      setSearchModal(false);
      setFoundItem(null);
      setTicketSearch('');
      setDetailModal(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al devolver' });
    } finally {
      setSaving(false);
    }
  };

  const handleLost = async (id) => {
    if (!window.confirm('¿Marcar este objeto como perdido?')) return;
    setSaving(true);
    try {
      await markCustodyLost(id);
      setAlert({ type: 'success', message: 'Objeto marcado como perdido' });
      setDetailModal(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error' });
    } finally {
      setSaving(false);
    }
  };

  const openDetail = (item) => {
    setDetailItem(item);
    setDetailModal(true);
  };

  const columns = [
    { key: 'ticket_code', label: 'Ticket',    render: (r) => <span className="font-bold text-blue-600 dark:text-blue-400">{r.display_code || r.ticket_code}</span> },
    { key: 'description', label: 'Descripción', render: (r) => <span className="text-gray-800 dark:text-gray-100">{r.description}</span> },
    { key: 'event_name',  label: 'Evento',    render: (r) => r.event_name || '—' },
    { key: 'operator_username', label: 'Operador', render: (r) => r.operator_username || '—' },
    { key: 'price', label: 'Precio', render: (r) => parseFloat(r.price) > 0 ? `Bs. ${parseFloat(r.price).toFixed(2)}` : 'Gratis' },
    { key: 'status',      label: 'Estado',    render: (r) => <Badge label={STATUS_LABELS[r.status]} color={STATUS_COLORS[r.status]} /> },
    { key: 'received_at', label: 'Recibido',  render: (r) => new Date(r.received_at).toLocaleString('es-BO') },
    {
      key: 'actions', label: 'Acciones', width: '100px',
      render: (r) => (
        <Button size="sm" variant="primary" onClick={() => openDetail(r)}icon="👁️">Detalles</Button>
      )
    },
  ];
  
  return (
    <PageWrapper title="Custodia">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="active">En custodia</option>
              <option value="returned">Devueltos</option>
              <option value="lost">Perdidos</option>
            </select>
          </div>
          <div className="flex gap-2">
            {can('custody:return') && (
              <Button variant="secondary" onClick={() => { setSearchModal(true); setFoundItem(null); setTicketSearch(''); }}>
                🔍 Buscar ticket
              </Button>
            )}
            {can('custody:create') && (
              <Button onClick={() => { setForm(EMPTY_FORM); setPhoto(null); setPhotoPreview(null); setCreateModal(true); }} icon="＋">
                Registrar objeto
              </Button>
            )}
          </div>
        </div>

        <Table columns={columns} data={items} loading={loading} emptyMessage="No hay objetos en custodia" />
        <Pagination page={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
      </div>

      {/* Modal Registrar */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Registrar objeto en custodia" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Código de ticket" name="ticket_code" value={form.ticket_code}
              onChange={(e) => setForm({ ...form, ticket_code: e.target.value })}
              required placeholder="Ej. 042, A-12, cualquier código"
            />
            {!user?.assigned_event_id && can('custody:manage') && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Evento</label>
                <select
                  value={form.event_id}
                  onChange={(e) => setForm({ ...form, event_id: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin evento</option>
                  {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <Input
            label="Descripción del objeto" name="description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required placeholder="Ej. Chaqueta negra talla M, mochila roja con laptop..."
          />

          <Input
            label="Observaciones" name="observations" value={form.observations}
            onChange={(e) => setForm({ ...form, observations: e.target.value })}
            placeholder="Detalles adicionales, daños previos, etc."
          />
        <Input
        label="Precio (0 = gratis)" name="price" type="number" value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        placeholder="0.00"
        />
          {/* Foto */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fotografía</label>

<div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
  {photoPreview ? (
    <img src={photoPreview} alt="preview" className="max-h-40 mx-auto rounded-lg object-contain mb-3" />
  ) : (
    <div className="text-gray-400 dark:text-gray-500 text-center mb-3">
      <p className="text-2xl mb-1">📷</p>
      <p className="text-sm">Agrega una foto (opcional)</p>
    </div>
  )}
  <div className="flex gap-2 justify-center">
    <Button type="button" size="sm" variant="secondary" onClick={() => cameraRef.current?.click()}>
      📷 Tomar foto
    </Button>
    <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
      🖼️ Elegir de galería
    </Button>
  </div>
</div>
<input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoChange} />
<input ref={fileRef}   type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          {photoPreview && (
              <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(null); }} className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-left">
                Eliminar foto
              </button>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Registrar</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Buscar Ticket */}
      <Modal isOpen={searchModal} onClose={() => setSearchModal(false)} title="Buscar por ticket" size="sm">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ingresa el código del ticket..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleSearch} loading={searching}>Buscar</Button>
          </div>

          {foundItem && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {foundItem.photo_url && (
                <img
                  src={foundItem.photo_url}
                  alt="objeto"
                  className="w-full max-h-48 object-cover"
                />
              )}
              <div className="p-4 space-y-2">
                <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">Ticket: {foundItem.display_code || foundItem.ticket_code}</p>
                <p className="text-gray-700 dark:text-gray-300">{foundItem.description}</p>
                {foundItem.observations && <p className="text-sm text-gray-500 dark:text-gray-400">{foundItem.observations}</p>}
                <p className={`font-bold text-lg ${parseFloat(foundItem.price) > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {parseFloat(foundItem.price) > 0 ? `Cobrar: Bs. ${parseFloat(foundItem.price).toFixed(2)}` : 'Sin costo'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Recibido: {new Date(foundItem.received_at).toLocaleString('es-BO')}</p>
                <div className="pt-2 flex gap-2">
                  {can('custody:return') && (
                    <Button onClick={() => handleReturn(foundItem.id)} loading={saving}>
                      ✓ Confirmar devolución
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal Detalle */}
      <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} title={`Custodia #${detailItem?.id}`} size="md">
        {detailItem && (
          <div className="space-y-4">
            {detailItem.photo_url && (
              <img
                src={detailItem.photo_url}
                alt="objeto"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Ticket</p>
                <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{detailItem.display_code || detailItem.ticket_code}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Estado</p>
                <Badge label={STATUS_LABELS[detailItem.status]} color={STATUS_COLORS[detailItem.status]} />
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 dark:text-gray-400">Descripción</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{detailItem.description}</p>
              </div>
              {detailItem.observations && (
                <div className="col-span-2">
                  <p className="text-gray-500 dark:text-gray-400">Observaciones</p>
                  <p className="text-gray-700 dark:text-gray-300">{detailItem.observations}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 dark:text-gray-400">Operador</p>
                <p className="text-gray-700 dark:text-gray-300">{detailItem.operator_username || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Evento</p>
                <p className="text-gray-700 dark:text-gray-300">{detailItem.event_name || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Precio</p>
                <p className={`font-medium ${parseFloat(detailItem.price) > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {parseFloat(detailItem.price) > 0 ? `Bs. ${parseFloat(detailItem.price).toFixed(2)}` : 'Gratis'}
                </p>
                </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Recibido</p>
                <p className="text-gray-700 dark:text-gray-300">{new Date(detailItem.received_at).toLocaleString('es-BO')}</p>
              </div>
              {detailItem.returned_at && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Devuelto</p>
                  <p className="text-gray-700 dark:text-gray-300">{new Date(detailItem.returned_at).toLocaleString('es-BO')}</p>
                </div>
              )}
            </div>

            {detailItem.status === 'active' && (
              <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                {can('custody:return') && (
                  <Button onClick={() => handleReturn(detailItem.id)} loading={saving}>
                    ✓ Devolver objeto
                  </Button>
                )}
                {can('custody:manage') && (
                  <Button variant="danger" onClick={() => handleLost(detailItem.id)} loading={saving}>
                    Marcar perdido
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default Custody;