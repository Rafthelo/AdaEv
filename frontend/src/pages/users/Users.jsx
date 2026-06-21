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
import useAuth from '../../hooks/useAuth';
import { getUsers, createUser, updateUser, deactivateUser, deleteUser } from '../../api/endpoints/users.api';
import { getRoles } from '../../api/endpoints/roles.api';
import { getEvents } from '../../api/endpoints/events.api';
import { QRCodeSVG } from 'qrcode.react';

const EMPTY_FORM = {
  username: '', email: '', password: '',
  first_name: '', last_name: '', roles: [],
  seller_type: '', assigned_event_id: '',
};

const SELLER_TYPE_LABELS = {
  independent: 'Vendedor independiente',
  waiter:      'Mesero',
  bartender:   'Bartender',
};

const Users = () => {
  const { can } = usePermissions();
  const { user } = useAuth();

  const [users,      setUsers]      = useState([]);
  const [roles,      setRoles]      = useState([]);
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
  const [qrModal, setQrModal] = useState(false);
  const [manualIp, setManualIp] = useState(() => localStorage.getItem('adaev_local_ip') || '');

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getUsers({ page, limit: 10, search });
        if (!cancelled) { setUsers(data.data); setMeta(data.meta); }
      } catch {
        if (!cancelled) setAlert({ type: 'error', message: 'Error al cargar usuarios' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page, search, refreshKey]);

    useEffect(() => {
      getRoles().then(({ data }) => setRoles(data.data || [])).catch(() => {});
      getEvents({ limit: 100, status: 'active' }).then(({ data }) => setEvents(data.data || [])).catch(() => {});
    }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

    const openEdit = (user) => {
      setEditing(user);
      setForm({
        username:   user.username,
        email:      user.email,
        password:   '',
        first_name: user.first_name,
        last_name:  user.last_name,
        roles:      user.roles?.map((r) => r.id) || [],
        seller_type: user.seller_type || '',
        assigned_event_id: user.assigned_event_id || '',
      });
      setModalOpen(true);
    };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleToggle = (roleId) => {
    const id = parseInt(roleId);
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(id)
        ? prev.roles.filter((r) => r !== id)
        : [...prev.roles, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const payload = {
          email:      form.email,
          first_name: form.first_name,
          last_name:  form.last_name,
          roles:      form.roles,
          seller_type: form.seller_type || null,
          assigned_event_id: form.assigned_event_id ? parseInt(form.assigned_event_id) : null,
        };
      await updateUser(editing.id, payload);      
        setAlert({ type: 'success', message: 'Usuario actualizado exitosamente' });
      } else {
        const payload = {
          ...form,
          seller_type: form.seller_type || null,
          assigned_event_id: form.assigned_event_id ? parseInt(form.assigned_event_id) : null,
        };
        await createUser(payload);
        setAlert({ type: 'success', message: 'Usuario creado exitosamente' });
      }
      setModalOpen(false);
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('¿Desactivar este usuario?')) return;
    try {
      await deactivateUser(id);
      setAlert({ type: 'success', message: 'Usuario desactivado' });
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al desactivar' });
    }
  };
  const handleActivate = async (id) => {
  try {
    await updateUser(id, { is_active: true });
    setAlert({ type: 'success', message: 'Usuario activado' });
    setRefreshKey((k) => k + 1);
  } catch (err) {
    setAlert({ type: 'error', message: err.response?.data?.message || 'Error al activar' });
  }
};
const handleDelete = async (id) => {
  if (!window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer desde la interfaz.')) return;
  try {
    await deleteUser(id);
    setAlert({ type: 'success', message: 'Usuario eliminado exitosamente' });
    setRefreshKey((k) => k + 1);
  } catch (err) {
    setAlert({ type: 'error', message: err.response?.data?.message || 'Error al eliminar' });
  }
};
  const columns = [
    { key: 'username',   label: 'Usuario',   render: (r) => <span className="font-medium text-gray-800 dark:text-gray-100">{r.username}</span> },
    { key: 'email',      label: 'Email',     render: (r) => r.email },
    { key: 'first_name', label: 'Nombre',    render: (r) => `${r.first_name} ${r.last_name}` },
    { key: 'is_active',  label: 'Estado',    render: (r) => <Badge label={r.is_active ? 'Activo' : 'Inactivo'} color={r.is_active ? 'green' : 'red'} /> },
    { key: 'seller_type', label: 'Tipo vendedor', render: (r) => r.seller_type ? SELLER_TYPE_LABELS[r.seller_type] : '—' },
    { key: 'assigned_event_name', label: 'Evento asignado', render: (r) => r.assigned_event_name || '—' },
    { key: 'last_login_at', label: 'Último acceso', render: (r) => r.last_login_at ? new Date(r.last_login_at).toLocaleDateString('es-BO') : '—' },
    {
      key: 'actions', label: 'Acciones', width: '160px',
      render: (r) => (
        <div className="flex gap-2">
          {can('users:manage') && (
            <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Editar</Button>
          )}
{can('users:manage') && r.id !== user.id && r.is_active === 1 && (
  <Button size="sm" variant="danger" onClick={() => handleDeactivate(r.id)}>Desactivar</Button>
)}
{can('users:manage') && r.id !== user.id && r.is_active === 0 && (
  <Button size="sm" variant="success" onClick={() => handleActivate(r.id)}>Activar</Button>
)}
{can('users:manage') && r.id !== user.id && (
  <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>Eliminar</Button>
)}
        </div>
      )
    },
  ];

  return (
    <PageWrapper title="Usuarios">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => { setSearch(e.target.value);  setRefreshKey((k) => k + 1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setQrModal(true)} icon="📱">Generar QR</Button>
            {can('users:manage') && (
              <Button onClick={openCreate} icon="＋">Nuevo Usuario</Button>
            )}
          </div>
        </div>

        <Table
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="No hay usuarios registrados"
        />

        <Pagination page={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre" name="first_name" value={form.first_name}
              onChange={handleChange} required placeholder="Nombre"
            />
            <Input
              label="Apellido" name="last_name" value={form.last_name}
              onChange={handleChange} required placeholder="Apellido"
            />
          </div>
          <Input
            label="Usuario" name="username" value={form.username}
            onChange={handleChange} required placeholder="Nombre de usuario"
            disabled={!!editing}
          />
          <Input
            label="Email" name="email" type="email" value={form.email}
            onChange={handleChange} required placeholder="correo@ejemplo.com"
          />
          {!editing && (
            <Input
              label="Contraseña" name="password" type="password" value={form.password}
              onChange={handleChange} required placeholder="Mínimo 6 caracteres"
            />
          )}
            {/* Tipo de vendedor y evento asignado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de vendedor</label>
                <select
                  name="seller_type"
                  value={form.seller_type}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No es vendedor</option>
                  <option value="independent">Vendedor independiente</option>
                  <option value="waiter">Mesero</option>
                  <option value="bartender">Bartender</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Evento asignado</label>
                <select
                  name="assigned_event_id"
                  value={form.assigned_event_id}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin evento asignado</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>
            </div>
          {/* Roles */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Roles <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.roles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{role.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </div>
        </form>
      </Modal>

{/* Modal QR de acceso */}
<Modal isOpen={qrModal} onClose={() => setQrModal(false)} title="Código QR de acceso" size="sm">
  <div className="text-center space-y-4">
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Escanea este código desde el celular para abrir AdaEv directamente, sin escribir la dirección.
    </p>
    {window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? (
      <div className="space-y-3">
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Estás accediendo por "localhost". Ingresa la IP de red de esta PC para generar el QR correcto:
        </p>
        <Input
          value={manualIp}
          onChange={(e) => {
            setManualIp(e.target.value);
            localStorage.setItem('adaev_local_ip', e.target.value);
          }}
          placeholder="Ej. 192.168.1.8//0.10"
        />
        {manualIp && (
          <div className="bg-white p-4 rounded-lg inline-block">
            <QRCodeSVG value={`http://${manualIp}:5173`} size={220} />
          </div>
        )}
      </div>
    ) : (
      <div className="bg-white p-4 rounded-lg inline-block">
        <QRCodeSVG value={window.location.origin} size={220} />
      </div>
    )}
    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
      {window.location.hostname === 'localhost' ? (manualIp ? `http://${manualIp}:5173` : '') : window.location.origin}
    </p>
  </div>
</Modal>

    </PageWrapper>
  );
};

export default Users;