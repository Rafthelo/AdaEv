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
import { getSales, createSale, voidSale } from '../../api/endpoints/sales.api';
import { getEvents } from '../../api/endpoints/events.api';
import { getProducts } from '../../api/endpoints/products.api';

const STATUS_COLORS = { completed: 'green', voided: 'red', pending: 'yellow' };
const STATUS_LABELS = { completed: 'Completada', voided: 'Anulada', pending: 'Pendiente' };

const EMPTY_FORM = { event_id: '', notes: '', items: [] };
const EMPTY_ITEM = { product_id: '', quantity: 1, unit_price: '' };

const Sales = () => {
  const { can } = usePermissions();

  const [sales,       setSales]       = useState([]);
  const [events,      setEvents]      = useState([]);
  const [products,    setProducts]    = useState([]);
  const [meta,        setMeta]        = useState({});
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [voidModal,   setVoidModal]   = useState(false);
  const [voidingId,   setVoidingId]   = useState(null);
  const [voidReason,  setVoidReason]  = useState('');
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);
  const [alert,       setAlert]       = useState({ type: '', message: '' });

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getSales({ page, limit: 10 });
        if (!cancelled) { setSales(data.data); setMeta(data.meta); }
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar ventas' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page]);

  useEffect(() => {
    getEvents({ limit: 100 }).then(({ data }) => setEvents(data.data || [])).catch(() => {});
    getProducts({ limit: 100, is_active: 1 }).then(({ data }) => setProducts(data.data || [])).catch(() => {});
  }, []);

  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));

  const removeItem = (i) => setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const updateItem = (i, field, value) => {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: value };
    // Auto-fill price from product
    if (field === 'product_id') {
      const product = products.find((p) => p.id === parseInt(value));
      if (product) items[i].unit_price = product.price;
    }
    setForm((f) => ({ ...f, items }));
  };

  const getTotal = () =>
    form.items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unit_price) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.items.length === 0) {
      setAlert({ type: 'error', message: 'Agrega al menos un producto' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        event_id: form.event_id ? parseInt(form.event_id) : null,
        notes:    form.notes || null,
        items:    form.items.map((item) => ({
          product_id: parseInt(item.product_id),
          quantity:   parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
        })),
      };
      await createSale(payload);
      setAlert({ type: 'success', message: 'Venta registrada exitosamente' });
      setModalOpen(false);
      setForm(EMPTY_FORM);
      setPage(1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al registrar venta' });
    } finally {
      setSaving(false);
    }
  };

  const openVoid = (id) => {
    setVoidingId(id);
    setVoidReason('');
    setVoidModal(true);
  };

  const handleVoid = async () => {
    if (!voidReason.trim()) {
      setAlert({ type: 'error', message: 'El motivo de anulación es requerido' });
      return;
    }
    setSaving(true);
    try {
      await voidSale(voidingId, { void_reason: voidReason });
      setAlert({ type: 'success', message: 'Venta anulada exitosamente' });
      setVoidModal(false);
      setPage(1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al anular' });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'id',               label: '#',         render: (r) => <span className="font-medium text-gray-800">#{r.id}</span> },
    { key: 'event_name',       label: 'Evento',    render: (r) => r.event_name || '—' },
    { key: 'cashier_username', label: 'Cajero',    render: (r) => r.cashier_username || '—' },
    { key: 'total',            label: 'Total',     render: (r) => <span className="font-bold text-green-600">Bs. {parseFloat(r.total).toFixed(2)}</span> },
    { key: 'status',           label: 'Estado',    render: (r) => <Badge label={STATUS_LABELS[r.status]} color={STATUS_COLORS[r.status]} /> },
    { key: 'created_at',       label: 'Fecha',     render: (r) => new Date(r.created_at).toLocaleDateString('es-BO') },
    {
      key: 'actions', label: 'Acciones', width: '120px',
      render: (r) => (
        <div className="flex gap-2">
          {can('sales:void') && r.status === 'completed' && (
            <Button size="sm" variant="danger" onClick={() => openVoid(r.id)}>Anular</Button>
          )}
        </div>
      )
    },
  ];

  return (
    <PageWrapper title="Ventas">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Historial de ventas</h3>
          {can('sales:create') && (
            <Button onClick={() => { setForm(EMPTY_FORM); setModalOpen(true); }} icon="＋">
              Nueva Venta
            </Button>
          )}
        </div>

        <Table columns={columns} data={sales} loading={loading} emptyMessage="No hay ventas registradas" />
        <Pagination page={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
      </div>

      {/* Modal Nueva Venta */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nueva Venta" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Evento</label>
            <select
              name="event_id"
              value={form.event_id}
              onChange={(e) => setForm({ ...form, event_id: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin evento</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Productos</label>
              <Button size="sm" variant="secondary" onClick={addItem} type="button" icon="＋">
                Agregar
              </Button>
            </div>

            {form.items.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
                Agrega productos a la venta
              </p>
            )}

            {form.items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-end">
                <div className="col-span-5">
                  <select
                    value={item.product_id}
                    onChange={(e) => updateItem(i, 'product_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Producto...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="number" min="1" value={item.quantity}
                    onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                    placeholder="Cant."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number" min="0" step="0.01" value={item.unit_price}
                    onChange={(e) => updateItem(i, 'unit_price', e.target.value)}
                    placeholder="Precio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <Button size="sm" variant="danger" onClick={() => removeItem(i)} type="button">✕</Button>
                </div>
              </div>
            ))}
          </div>

          {form.items.length > 0 && (
            <div className="flex justify-end">
              <p className="text-lg font-bold text-gray-800">
                Total: <span className="text-green-600">Bs. {getTotal().toFixed(2)}</span>
              </p>
            </div>
          )}

          <Input
            label="Notas" name="notes" value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Observaciones opcionales"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Registrar Venta</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Anular */}
      <Modal isOpen={voidModal} onClose={() => setVoidModal(false)} title="Anular Venta" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Esta acción devolverá el stock de los productos. ¿Confirmas la anulación?</p>
          <Input
            label="Motivo de anulación"
            name="void_reason"
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            placeholder="Describe el motivo..."
            required
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setVoidModal(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleVoid} loading={saving}>Confirmar Anulación</Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Sales;