import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useNavigationWithScroll } from '../utils/navigation';

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { navigateWithScroll } = useNavigationWithScroll();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to home page after logout
      navigateWithScroll('/');
    } catch (error) {
      // Even on error, navigate to home
      navigateWithScroll('/');
    }
  };

  // Only show logout menu if user is properly authenticated
  const isProperlyAuthenticated = currentUser && userRole && currentUser.email && currentUser.uid;

  return (
    <nav className="bg-gradient-to-r from-white via-gray-50 to-white shadow-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <button 
              onClick={() => navigateWithScroll(isProperlyAuthenticated ? (userRole === 'agent' ? '/agent/dashboard' : '/admin/dashboard') : '/')}
              className="flex items-center group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <img 
                  src="/rnbridge_logo.png" 
                  alt="RNBRIDGE Logo" 
                  className="w-16 h-16 object-contain drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isProperlyAuthenticated ? (
              // Public navigation
              <>
                <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">Home</Link>
                <Link to="/about" className="text-gray-700 hover:text-primary-600 transition-colors">About</Link>
                <Link to="/admission-info" className="text-gray-700 hover:text-primary-600 transition-colors">Admission Info (UK)</Link>
                <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">Contact</Link>
                <Link to="/faq" className="text-gray-700 hover:text-primary-600 transition-colors">FAQ</Link>
                <Link to="/inquiry" className="btn-primary">Apply Now</Link>
              </>
            ) : (
              // Authenticated user navigation
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigateWithScroll(userRole === 'agent' ? '/agent/dashboard' : '/admin/dashboard')}
                  className="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="w-5 h-5" />
                    <span>{currentUser.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
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
            {!isProperlyAuthenticated ? (
              // Public navigation
              <>
                <Link to="/" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                  Home
                </Link>
              <Link to="/admission-info" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                Admission Info (UK)
              </Link>
                <Link to="/about" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                  About
                </Link>
                <Link to="/contact" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                  Contact
                </Link>
                <Link to="/faq" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                  FAQ
                </Link>
                <Link to="/inquiry" className="block btn-primary text-base font-medium text-center">
                  Apply Now
                </Link>
              </>
            ) : (
              // Authenticated user navigation
              <>
                <Link 
                  to={userRole === 'agent' ? "/agent/dashboard" : "/admin/dashboard"} 
                  className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  <div className="flex items-center">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </div>
                </Link>
                <div className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {currentUser.email}
                  </div>
                </div>
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
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 