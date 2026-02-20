import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

import { ServiceEditPage } from './pages/admin/ServiceEditPage';
import { AdminServicesPage } from './pages/AdminServicesPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AddAgentPage } from './pages/AddAgentPage';
import { hasAdminSession } from '../src/utils/adminSession';

function RequireAdmin({ children }: { children: JSX.Element }) {
  if (!hasAdminSession()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Admin login (unprotected) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/services"
          element={
            <RequireAdmin>
              <AdminServicesPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/services/new"
          element={
            <RequireAdmin>
              <ServiceEditPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/services/:slug/edit"
          element={
            <RequireAdmin>
              <ServiceEditPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAdmin>
              <AdminUsersPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <RequireAdmin>
              <AddAgentPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <RequireAdmin>
              <AdminSettingsPage />
            </RequireAdmin>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
