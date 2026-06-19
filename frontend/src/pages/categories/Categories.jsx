import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Table       from '../../components/common/Table';
import Button      from '../../components/common/Button';
import Modal       from '../../components/common/Modal';
import Input       from '../../components/common/Input';
import Badge       from '../../components/common/Badge';
import Alert       from '../../components/common/Alert';
import usePermissions from '../../hooks/usePermissions';
import {
  getCategories, createCategory, updateCategory, deactivateCategory,
} from '../../api/endpoints/categories.api';

const EMPTY_FORM = { name: '', description: '', parent_id: '' };

const Categories = () => {
  const { can } = usePermissions();

  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [alert,      setAlert]      = useState({ type: '', message: '' });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getCategories();
        if (!cancelled) setCategories(data.data || []);
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar categorías' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name:        cat.name,
      description: cat.description || '',
      parent_id:   cat.parent_id || '',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name:        form.name,
        description: form.description || null,
        parent_id:   form.parent_id ? parseInt(form.parent_id) : null,
      };
      if (editing) {
        await updateCategory(editing.id, payload);
        setAlert({ type: 'success', message: 'Categoría actualizada exitosamente' });
      } else {
        await createCategory(payload);
        setAlert({ type: 'success', message: 'Categoría creada exitosamente' });
      }
      setModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('¿Desactivar esta categoría?')) return;
    try {
      await deactivateCategory(id);
      setAlert({ type: 'success', message: 'Categoría desactivada' });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al desactivar' });
    }
  };
  const handleActivate = async (id) => {
    try {
      await updateCategory(id, { is_active: true });
      setAlert({ type: 'success', message: 'Categoría activada' });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al activar' });
    }
  };
  const columns = [
    { key: 'name',        label: 'Nombre',     render: (r) => <span className="font-medium text-gray-800 dark:text-gray-100">{r.name}</span> },
    { key: 'description', label: 'Descripción', render: (r) => r.description || '—' },
    { key: 'parent_name', label: 'Categoría padre', render: (r) => r.parent_name || '—' },
    { key: 'is_active',   label: 'Estado', render: (r) => <Badge label={r.is_active ? 'Activa' : 'Inactiva'} color={r.is_active ? 'green' : 'red'} /> },
{
  key: 'actions', label: 'Acciones', width: '160px',
  render: (r) => (
    <div className="flex gap-2">
      {can('categories:update') && (
        <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
      )}
      {can('categories:delete') && r.is_active === 1 && (
        <Button size="sm" variant="danger" onClick={() => handleDeactivate(r.id)}>Desactivar</Button>
      )}
      {can('categories:update') && r.is_active === 0 && (
        <Button size="sm" variant="success" onClick={() => handleActivate(r.id)}>Activar</Button>
      )}
    </div>
  )
},
  ];

  return (
    <PageWrapper title="Categorías">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Categorías de productos</h3>
          {can('categories:create') && (
            <Button onClick={openCreate} icon="＋">Nueva Categoría</Button>
          )}
        </div>

        <Table columns={columns} data={categories} loading={loading} emptyMessage="No hay categorías registradas" />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Categoría' : 'Nueva Categoría'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre" name="name" value={form.name}
            onChange={handleChange} required placeholder="Nombre de la categoría"
          />
          <Input
            label="Descripción" name="description" value={form.description}
            onChange={handleChange} placeholder="Descripción opcional"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría padre</label>
            <select
              name="parent_id" value={form.parent_id} onChange={handleChange}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin categoría padre</option>
              {categories
                .filter((c) => !editing || c.id !== editing.id)
                .map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default Categories;