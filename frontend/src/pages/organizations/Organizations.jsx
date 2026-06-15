import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Table       from '../../components/common/Table';
import Button      from '../../components/common/Button';
import Modal       from '../../components/common/Modal';
import Input       from '../../components/common/Input';
import Badge       from '../../components/common/Badge';
import Alert       from '../../components/common/Alert';
import usePermissions from '../../hooks/usePermissions';
import { getOrganizations, createOrganization, updateOrganization } from '../../api/endpoints/organizations.api';

const EMPTY_FORM = { name: '', type: '', contact: '', phone: '', observations: '' };

const Organizations = () => {
  const { can } = usePermissions();

  const [orgs,       setOrgs]       = useState([]);
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
        const { data } = await getOrganizations();
        if (!cancelled) setOrgs(data.data || []);
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar organizaciones' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit   = (org) => {
    setEditing(org);
    setForm({ name: org.name, type: org.type || '', contact: org.contact || '', phone: org.phone || '', observations: org.observations || '' });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateOrganization(editing.id, form);
        setAlert({ type: 'success', message: 'Organización actualizada' });
      } else {
        await createOrganization(form);
        setAlert({ type: 'success', message: 'Organización creada exitosamente' });
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
    { key: 'name',    label: 'Nombre',   render: (r) => <span className="font-medium text-gray-800">{r.name}</span> },
    { key: 'type',    label: 'Tipo',     render: (r) => r.type || '—' },
    { key: 'contact', label: 'Contacto', render: (r) => r.contact || '—' },
    { key: 'phone',   label: 'Teléfono', render: (r) => r.phone || '—' },
    { key: 'is_active', label: 'Estado', render: (r) => <Badge label={r.is_active ? 'Activa' : 'Inactiva'} color={r.is_active ? 'green' : 'red'} /> },
    {
      key: 'actions', label: 'Acciones', width: '100px',
      render: (r) => can('organizations:manage') && (
        <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
      )
    },
  ];

  return (
    <PageWrapper title="Organizaciones">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Organizaciones</h3>
          {can('organizations:manage') && (
            <Button onClick={openCreate} icon="＋">Nueva Organización</Button>
          )}
        </div>
        <Table columns={columns} data={orgs} loading={loading} emptyMessage="No hay organizaciones registradas" />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Organización' : 'Nueva Organización'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" name="name" value={form.name} onChange={handleChange} required placeholder="Nombre de la organización" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sin tipo</option>
                <option value="sponsor">Patrocinador</option>
                <option value="investor">Inversor</option>
                <option value="supplier">Proveedor</option>
                <option value="donor">Donante</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} placeholder="+591 7000 0000" />
          </div>
          <Input label="Contacto" name="contact" value={form.contact} onChange={handleChange} placeholder="Nombre de la persona de contacto" />
          <Input label="Observaciones" name="observations" value={form.observations} onChange={handleChange} placeholder="Notas adicionales" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editing ? 'Guardar cambios' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default Organizations;