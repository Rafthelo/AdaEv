import { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button      from '../../components/common/Button';
import Input       from '../../components/common/Input';
import Alert       from '../../components/common/Alert';
import Badge       from '../../components/common/Badge';
import useAuth     from '../../hooks/useAuth';
import { updateUser, changePassword } from '../../api/endpoints/users.api';

const Profile = () => {
  const { user } = useAuth();

  const [infoForm, setInfoForm] = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    email:      user?.email      || '',
  });
  const [passForm, setPassForm] = useState({
    current_password: '',
    new_password:     '',
    confirm_password: '',
  });

  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [alert,      setAlert]      = useState({ type: '', message: '' });

  const handleInfoChange = (e) => setInfoForm({ ...infoForm, [e.target.name]: e.target.value });
  const handlePassChange = (e) => setPassForm({ ...passForm, [e.target.name]: e.target.value });

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      await updateUser(user.id, infoForm);
      setAlert({ type: 'success', message: 'Datos actualizados exitosamente. Vuelve a iniciar sesión para ver los cambios.' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al actualizar' });
    } finally {
      setSavingInfo(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passForm.new_password !== passForm.confirm_password) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }
    setSavingPass(true);
    try {
      await changePassword(user.id, {
        current_password: passForm.current_password,
        new_password:     passForm.new_password,
      });
      setAlert({ type: 'success', message: 'Contraseña actualizada exitosamente' });
      setPassForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al cambiar contraseña' });
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <PageWrapper title="Mi Perfil">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info del usuario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Información personal</h3>
          </div>
          <div className="p-6">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">{user?.first_name} {user?.last_name}</p>
                <p className="text-sm text-gray-500">@{user?.username}</p>
                <div className="flex gap-1 mt-1">
                  {user?.roles?.map((r) => (
                    <Badge key={r} label={r} color="blue" />
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre" name="first_name" value={infoForm.first_name}
                  onChange={handleInfoChange} required
                />
                <Input
                  label="Apellido" name="last_name" value={infoForm.last_name}
                  onChange={handleInfoChange} required
                />
              </div>
              <Input
                label="Email" name="email" type="email" value={infoForm.email}
                onChange={handleInfoChange} required
              />
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500">Usuario: <span className="font-medium text-gray-700">@{user?.username}</span> (no editable)</p>
              </div>
              <Button type="submit" loading={savingInfo}>Guardar cambios</Button>
            </form>
          </div>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Cambiar contraseña</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handlePassSubmit} className="space-y-4">
              <Input
                label="Contraseña actual" name="current_password" type="password"
                value={passForm.current_password} onChange={handlePassChange} required
                placeholder="Tu contraseña actual"
              />
              <Input
                label="Nueva contraseña" name="new_password" type="password"
                value={passForm.new_password} onChange={handlePassChange} required
                placeholder="Mínimo 6 caracteres"
              />
              <Input
                label="Confirmar nueva contraseña" name="confirm_password" type="password"
                value={passForm.confirm_password} onChange={handlePassChange} required
                placeholder="Repite la nueva contraseña"
              />
              <Button type="submit" loading={savingPass}>Cambiar contraseña</Button>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;