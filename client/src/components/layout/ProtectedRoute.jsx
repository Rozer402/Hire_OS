import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';

export function ProtectedRoute({ role }) {
  const { user, token } = useAuthStore();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}

export default ProtectedRoute;
