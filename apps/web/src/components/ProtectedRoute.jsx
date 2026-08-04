import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requireHost = false, requireGuest = false }) => {
  const { currentUser, isHost } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Host routes redirect to /host/login; guest routes redirect to /login
    const loginPath = requireHost ? '/host/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requireHost && !isHost) {
    return <Navigate to="/guest/dashboard" replace />;
  }

  if (requireGuest && isHost) {
    return <Navigate to="/host/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
