import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userRole, logout } = useAuth();
  const { companyInfo } = useCompany();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                {companyInfo.name}
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/universities" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Universities
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                {(userRole === 'agent' || userRole === 'admin' || userRole === 'super_admin') && (
                  <Link 
                    to={userRole === 'agent' ? "/agent/dashboard" : "/admin/dashboard"} 
                    className="flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/agent/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Agent Login
                </Link>
                <Link to="/admin/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Admin Login
                </Link>
              </div>
            )}
            
            <Link to="/inquiry" className="btn-primary text-sm">
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link to="/" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/universities" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Universities
            </Link>
            <Link to="/about" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            <Link to="/contact" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
              Contact
            </Link>
            <Link to="/inquiry" className="block btn-primary text-base font-medium text-center">
              Apply Now
            </Link>

            {currentUser ? (
              <>
                {(userRole === 'agent' || userRole === 'admin' || userRole === 'super_admin') && (
                  <Link 
                    to={userRole === 'agent' ? "/agent/dashboard" : "/admin/dashboard"} 
                    className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    <div className="flex items-center">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </div>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  <div className="flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link to="/agent/login" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                  Agent Login
                </Link>
                <Link to="/admin/login" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 