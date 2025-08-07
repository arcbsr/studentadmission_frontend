import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role, permission }) => {
  const { userRole, hasPermission, isSuperAdmin, loading, isAuthenticated } = useAuth();

  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not properly authenticated, redirect to home
  if (!isAuthenticated()) {
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