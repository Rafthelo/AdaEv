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
import { getInventory, adjustStock, setMinStock } from '../../api/endpoints/inventory.api';
import { getEvents } from '../../api/endpoints/events.api';
import { getProducts } from '../../api/endpoints/products.api';


const EMPTY_ADJUST = { product_id: '', event_id: '', type: 'in', quantity: '', reason: '' };

const Inventory = () => {
  const { can } = usePermissions();

  const [inventory,  setInventory]  = useState([]);
  const [events,     setEvents]     = useState([]);
  const [products,   setProducts]   = useState([]);
  const [meta,       setMeta]       = useState({});
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [lowStock,   setLowStock]   = useState(false);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [minStockModal, setMinStockModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [minStockValue, setMinStockValue] = useState('');
  const [form,       setForm]       = useState(EMPTY_ADJUST);
  const [saving,     setSaving]     = useState(false);
  const [alert,      setAlert]      = useState({ type: '', message: '' });

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getInventory({ page, limit: 10, low_stock: lowStock || undefined });
        if (!cancelled) { setInventory(data.data); setMeta(data.meta); }
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar inventario' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page, lowStock]);

  useEffect(() => {
    getEvents({ limit: 100 }).then(({ data }) => setEvents(data.data || [])).catch(() => {});
    getProducts({ limit: 100, is_active: 1 }).then(({ data }) => setProducts(data.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        product_id: parseInt(form.product_id),
        event_id:   form.event_id ? parseInt(form.event_id) : null,
        type:       form.type,
        quantity:   parseInt(form.quantity),
        reason:     form.reason || null,
      };
      await adjustStock(payload);
      setAlert({ type: 'success', message: 'Movimiento de inventario registrado' });
      setModalOpen(false);
      setForm(EMPTY_ADJUST);
      setPage(1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al ajustar inventario' });
    } finally {
      setSaving(false);
    }
  };

  const openMinStock = (item) => {
    setEditingItem(item);
    setMinStockValue(item.min_stock);
    setMinStockModal(true);
  };

  const handleSetMinStock = async () => {
    setSaving(true);
    try {
      await setMinStock(editingItem.id, { min_stock: parseInt(minStockValue) });
      setAlert({ type: 'success', message: 'Stock mínimo actualizado' });
      setMinStockModal(false);
      setPage(1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al actualizar' });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'product_name', label: 'Producto', render: (r) => <span className="font-medium text-gray-800">{r.product_name}</span> },
    { key: 'sku',          label: 'SKU',       render: (r) => r.sku || '—' },
    { key: 'event_name',   label: 'Evento',    render: (r) => r.event_name || 'General' },
    {
      key: 'quantity', label: 'Stock actual',
      render: (r) => (
        <span className={`font-bold ${r.quantity <= r.min_stock && r.min_stock > 0 ? 'text-red-600' : 'text-gray-800'}`}>
          {r.quantity}
        </span>
      )
    },
    { key: 'min_stock', label: 'Stock mínimo', render: (r) => r.min_stock },
    {
      key: 'status', label: 'Estado',
      render: (r) => (
        r.min_stock > 0 && r.quantity <= r.min_stock
          ? <Badge label="Stock bajo" color="red" />
          : <Badge label="Normal" color="green" />
      )
    },
    {
      key: 'actions', label: 'Acciones', width: '140px',
      render: (r) => (
        can('inventory:adjust') && (
          <Button size="sm" variant="secondary" onClick={() => openMinStock(r)}>Stock mín.</Button>
        )
      )
    },
  ];

  return (
    <PageWrapper title="Inventario">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(e) => { setLowStock(e.target.checked); setPage(1); }}
              className="rounded border-gray-300 text-blue-600"
            />
            Mostrar solo stock bajo
          </label>
          {can('inventory:adjust') && (
            <Button onClick={() => { setForm(EMPTY_ADJUST); setModalOpen(true); }} icon="＋">
              Ajustar Inventario
            </Button>
          )}
        </div>

        <Table columns={columns} data={inventory} loading={loading} emptyMessage="No hay registros de inventario" />
        <Pagination page={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
      </div>

      {/* Modal Ajuste */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Ajustar Inventario">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Producto <span className="text-red-500">*</span></label>
            <select
              name="product_id" value={form.product_id} onChange={handleChange} required
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un producto...</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Evento</label>
            <select
              name="event_id" value={form.event_id} onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">General (sin evento)</option>
              {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Tipo de movimiento <span className="text-red-500">*</span></label>
              <select
                name="type" value={form.type} onChange={handleChange} required
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="in">Entrada</option>
                <option value="out">Salida</option>
                <option value="adjustment">Ajuste (valor exacto)</option>
                <option value="return">Devolución</option>
              </select>
            </div>
            <Input
              label="Cantidad" name="quantity" type="number" min="1" value={form.quantity}
              onChange={handleChange} required placeholder="0"
            />
          </div>

          <Input
            label="Motivo" name="reason" value={form.reason}
            onChange={handleChange} placeholder="Ej. Compra a proveedor, merma, etc."
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Registrar Movimiento</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Stock Mínimo */}
      <Modal isOpen={minStockModal} onClose={() => setMinStockModal(false)} title="Stock Mínimo" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Producto: <span className="font-medium">{editingItem?.product_name}</span>
          </p>
          <Input
            label="Stock mínimo" type="number" min="0" value={minStockValue}
            onChange={(e) => setMinStockValue(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setMinStockModal(false)}>Cancelar</Button>
            <Button onClick={handleSetMinStock} loading={saving}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Inventory;