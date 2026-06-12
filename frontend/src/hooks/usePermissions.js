import useAuth from './useAuth';

const usePermissions = () => {
  const { hasPermission, hasRole, user } = useAuth();

  return {
    can:     hasPermission,
    isRole:  hasRole,
    user,
    permissions: user?.permissions || [],
    roles:       user?.roles       || [],
  };
};

export default usePermissions;