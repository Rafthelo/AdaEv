import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Table       from '../../components/common/Table';
import Button      from '../../components/common/Button';
import Modal       from '../../components/common/Modal';
import Badge       from '../../components/common/Badge';
import Alert       from '../../components/common/Alert';
import usePermissions from '../../hooks/usePermissions';
import { getRoles, assignPermissions } from '../../api/endpoints/roles.api';
import { getPermissions } from '../../api/endpoints/permissions.api';

const PROTECTED_ROLES = ['superadmin'];

const Roles = () => {
  const { can } = usePermissions();

  const [roles,       setRoles]       = useState([]);
  const [grouped,     setGrouped]     = useState({});
  const [loading,     setLoading]     = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selected,    setSelected]    = useState([]);
  const [saving,      setSaving]      = useState(false);
  const [alert,       setAlert]       = useState({ type: '', message: '' });
  const [refreshKey,  setRefreshKey]  = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const [rolesRes, permsRes] = await Promise.all([getRoles(), getPermissions()]);
        if (!cancelled) {
          setRoles(rolesRes.data.data || []);
          setGrouped(permsRes.data.data.grouped || {});
        }
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar roles' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [refreshKey]);

 const openPermissions = async (role) => {
  setEditingRole(role);
  try {
    const res = await fetch(`/api/v1/roles/${role.id}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('accessToken')}` }
    });
    const json = await res.json();
    setSelected((json.data.permissions || []).map((p) => p.id));
  } catch {
    setSelected([]);
  }
  setModalOpen(true);
};

  const togglePermission = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const toggleModule = (modulePerms) => {
    const ids = modulePerms.map((p) => p.id);
    const allSelected = ids.every((id) => selected.includes(id));
    setSelected((prev) =>
      allSelected
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await assignPermissions(editingRole.id, selected);
      setAlert({ type: 'success', message: 'Permisos actualizados exitosamente' });
      setModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al guardar permisos' });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'name',        label: 'Rol', render: (r) => <span className="font-medium text-gray-800 dark:text-gray-100 capitalize">{r.name}</span> },
    { key: 'description', label: 'Descripción', render: (r) => r.description || '—' },
    { key: 'total_users', label: 'Usuarios', render: (r) => <Badge label={r.total_users} color="blue" /> },
    { key: 'total_permissions', label: 'Permisos', render: (r) => <Badge label={r.total_permissions} color="purple" /> },
    {
      key: 'actions', label: 'Acciones', width: '160px',
      render: (r) => (
        can('roles:manage') && !PROTECTED_ROLES.includes(r.name) ? (
          <Button size="sm" variant="secondary" onClick={() => openPermissions(r)}>Permisos</Button>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">Sistema</span>
        )
      )
    },
  ];

  return (
    <PageWrapper title="Roles">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Roles del sistema</h3>
        </div>
        <Table columns={columns} data={roles} loading={loading} emptyMessage="No hay roles registrados" />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Permisos del rol: ${editingRole?.name}`}
        size="xl"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(grouped).map(([module, perms]) => {
            const allSelected = perms.every((p) => selected.includes(p.id));
            return (
              <div key={module} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">{module}</h4>
                  <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => toggleModule(perms)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
                    />
                    Seleccionar todo
                  </label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {perms.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={() => togglePermission(p.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{p.action}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} loading={saving}>Guardar Permisos</Button>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Roles;