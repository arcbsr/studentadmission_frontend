import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { initializeDefaultAdmin } from './utils/initializeAdmin';
import { initializeUniversities } from './utils/initializeUniversities';
import './utils/quickEmailTest'; // Import for global email testing
import './utils/emailVerification'; // Import for email verification

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Universities from './pages/Universities';
import InquiryForm from './pages/InquiryForm';
import AgentLogin from './pages/AgentLogin';

import AgentDashboard from './pages/AgentDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TestPage from './pages/TestPage';
import EmailTest from './pages/EmailTest';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    // Initialize default admin user
    initializeDefaultAdmin().then(result => {
      if (result.success) {
        console.log('Admin initialization:', result.message);
      } else {
        console.error('Admin initialization failed:', result.message);
      }
    });

    // Initialize default universities
    initializeUniversities().then(result => {
      if (result.success) {
        console.log('Universities initialization:', result.message);
      } else {
        console.error('Universities initialization failed:', result.message);
      }
    });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CompanyProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/universities" element={<Universities />} />
                <Route path="/inquiry" element={<InquiryForm />} />

                {/* Agent Routes */}
                <Route path="/agent/login" element={<AgentLogin />} />
                <Route
                  path="/agent/dashboard"
                  element={
                    <ProtectedRoute role="agent">
                      <AgentDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute permission="viewAnalytics">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Test Routes */}
                <Route path="/test" element={<TestPage />} />
                <Route path="/email-test" element={<EmailTest />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </CompanyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 