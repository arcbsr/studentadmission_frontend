import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { initializeDefaultAdmin } from './utils/initializeAdmin';
import { initializeUniversities } from './utils/initializeUniversities';
import { initializeDefaultFaqs } from './utils/initializeFaqs';
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
import FAQ from './pages/FAQ';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';

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

    // Initialize default FAQs
    initializeDefaultFaqs().then(result => {
      if (result.success) {
        console.log('FAQs initialization:', result.message);
      } else {
        console.error('FAQs initialization failed:', result.message);
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
                {/* Public Routes - Only accessible when not logged in */}
                <Route path="/" element={
                  <RedirectIfAuthenticated>
                    <Home />
                  </RedirectIfAuthenticated>
                } />
                <Route path="/about" element={
                  <RedirectIfAuthenticated>
                    <About />
                  </RedirectIfAuthenticated>
                } />
                <Route path="/contact" element={
                  <RedirectIfAuthenticated>
                    <Contact />
                  </RedirectIfAuthenticated>
                } />
                <Route path="/universities" element={
                  <RedirectIfAuthenticated>
                    <Universities />
                  </RedirectIfAuthenticated>
                } />
                <Route path="/inquiry" element={
                  <RedirectIfAuthenticated>
                    <InquiryForm />
                  </RedirectIfAuthenticated>
                } />
                <Route path="/faq" element={
                  <RedirectIfAuthenticated>
                    <FAQ />
                  </RedirectIfAuthenticated>
                } />

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