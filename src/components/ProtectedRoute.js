import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role, permission }) => {
  const { currentUser, userRole, hasPermission, isSuperAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Super admin has access to everything
  if (isSuperAdmin()) {
    return children;
  }

  // Check specific role requirement
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // Check specific permission requirement
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 