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
import { getProducts, createProduct, updateProduct, deactivateProduct } from '../../api/endpoints/products.api';
import api from '../../api/axios.config';

const EMPTY_FORM = {
  name: '', description: '', sku: '',
  price: '', category_id: '',
};

const Products = () => {
  const { can } = usePermissions();

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [meta,        setMeta]        = useState({});
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [search,      setSearch]      = useState('');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);
  const [alert,       setAlert]       = useState({ type: '', message: '' });

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getProducts({ page, limit: 10, search });
        if (!cancelled) { setProducts(data.data); setMeta(data.meta); }
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar productos' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page, search]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data || [])).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name:        product.name,
      description: product.description || '',
      sku:         product.sku         || '',
      price:       product.price,
      category_id: product.category_id || '',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price:       parseFloat(form.price),
        category_id: form.category_id ? parseInt(form.category_id) : null,
        sku:         form.sku || null,
      };
      if (editing) {
        await updateProduct(editing.id, payload);
        setAlert({ type: 'success', message: 'Producto actualizado exitosamente' });
      } else {
        await createProduct(payload);
        setAlert({ type: 'success', message: 'Producto creado exitosamente' });
      }
      setModalOpen(false);
      setPage(1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('¿Desactivar este producto?')) return;
    try {
      await deactivateProduct(id);
      setAlert({ type: 'success', message: 'Producto desactivado' });
      setPage(1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al desactivar' });
    }
  };

  const columns = [
    { key: 'name',          label: 'Nombre',     render: (r) => <span className="font-medium text-gray-800">{r.name}</span> },
    { key: 'sku',           label: 'SKU',        render: (r) => r.sku || '—' },
    { key: 'category_name', label: 'Categoría',  render: (r) => r.category_name || '—' },
    { key: 'price',         label: 'Precio',     render: (r) => `Bs. ${parseFloat(r.price).toFixed(2)}` },
    { key: 'is_active',     label: 'Estado',     render: (r) => <Badge label={r.is_active ? 'Activo' : 'Inactivo'} color={r.is_active ? 'green' : 'red'} /> },
    {
      key: 'actions', label: 'Acciones', width: '160px',
      render: (r) => (
        <div className="flex gap-2">
          {can('products:update') && (
            <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
          )}
          {can('products:delete') && r.is_active === 1 && (
            <Button size="sm" variant="danger" onClick={() => handleDeactivate(r.id)}>Desactivar</Button>
          )}
        </div>
      )
    },
  ];

  return (
    <PageWrapper title="Productos">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <input
            type="text"
            placeholder="Buscar producto o SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          {can('products:create') && (
            <Button onClick={openCreate} icon="＋">Nuevo Producto</Button>
          )}
        </div>

        <Table
          columns={columns}
          data={products}
          loading={loading}
          emptyMessage="No hay productos registrados"
        />

        <Pagination page={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre" name="name" value={form.name}
            onChange={handleChange} required placeholder="Nombre del producto"
          />
          <Input
            label="Descripción" name="description" value={form.description}
            onChange={handleChange} placeholder="Descripción opcional"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU" name="sku" value={form.sku}
              onChange={handleChange} placeholder="Código único"
            />
            <Input
              label="Precio" name="price" type="number" value={form.price}
              onChange={handleChange} required placeholder="0.00"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Categoría</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default Products;