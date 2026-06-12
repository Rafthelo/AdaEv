import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute    from './PrivateRoute';
import PermissionRoute from './PermissionRoute';

import Login     from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import Users     from '../pages/users/Users';
import Roles     from '../pages/roles/Roles';
import Events    from '../pages/events/Events';
import Products  from '../pages/products/Products';
import Inventory from '../pages/inventory/Inventory';
import Sales     from '../pages/sales/Sales';
import CashRegister from '../pages/cash-register/CashRegister';
import Audit     from '../pages/audit/Audit';
import Categories from '../pages/categories/Categories';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login />} />

        {/* Privadas */}
        <Route path="/" element={
          <PrivateRoute>
            <Navigate to="/dashboard" replace />
          </PrivateRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <PermissionRoute permission="dashboard:view">
              <Dashboard />
            </PermissionRoute>
          </PrivateRoute>
        } />

        <Route path="/users" element={
          <PrivateRoute>
            <PermissionRoute permission="users:manage">
              <Users />
            </PermissionRoute>
          </PrivateRoute>
        } />

        <Route path="/roles" element={
          <PrivateRoute>
            <PermissionRoute permission="roles:manage">
              <Roles />
            </PermissionRoute>
          </PrivateRoute>
        } />

        <Route path="/events" element={
          <PrivateRoute>
            <PermissionRoute permission="events:read">
              <Events />
            </PermissionRoute>
          </PrivateRoute>
        } />

        <Route path="/products" element={
          <PrivateRoute>
            <PermissionRoute permission="products:read">
              <Products />
            </PermissionRoute>
          </PrivateRoute>
        } />

<Route path="/categories" element={
  <PrivateRoute>
    <PermissionRoute permission="categories:read">
      <Categories />
    </PermissionRoute>
  </PrivateRoute>
} />

        <Route path="/inventory" element={
          <PrivateRoute>
            <PermissionRoute permission="inventory:read">
              <Inventory />
            </PermissionRoute>
          </PrivateRoute>
        } />

        <Route path="/sales" element={
          <PrivateRoute>
            <PermissionRoute permission="sales:read">
              <Sales />
            </PermissionRoute>
          </PrivateRoute>
        } />

        <Route path="/cash-register" element={
          <PrivateRoute>
            <PermissionRoute permission="cash:read">
              <CashRegister />
            </PermissionRoute>
          </PrivateRoute>
        } />

        <Route path="/audit" element={
          <PrivateRoute>
            <PermissionRoute permission="audit:read">
              <Audit />
            </PermissionRoute>
          </PrivateRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;