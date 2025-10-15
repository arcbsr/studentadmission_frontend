import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RedirectIfAuthenticated = ({ children }) => {
  const { currentUser, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && userRole && !loading) {
      // Redirect based on user role
      if (userRole === 'agent') {
        navigate('/agent/dashboard');
      } else if (userRole === 'admin' || userRole === 'super_admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [currentUser, userRole, loading, navigate]);

  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is authenticated and has a role, don't render children (will redirect)
  if (currentUser && userRole) {
    return null;
  }

  // If not authenticated or no role, render the children (public pages)
  return children;
};

export default RedirectIfAuthenticated; 