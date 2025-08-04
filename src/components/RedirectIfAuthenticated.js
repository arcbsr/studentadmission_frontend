import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RedirectIfAuthenticated = ({ children }) => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      // Redirect based on user role
      if (userRole === 'agent') {
        navigate('/agent/dashboard');
      } else if (userRole === 'admin' || userRole === 'super-admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [currentUser, userRole, navigate]);

  // If user is authenticated, don't render children (will redirect)
  if (currentUser) {
    return null;
  }

  // If not authenticated, render the children (public pages)
  return children;
};

export default RedirectIfAuthenticated; 