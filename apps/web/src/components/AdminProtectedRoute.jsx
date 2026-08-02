import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminProtectedRoute;