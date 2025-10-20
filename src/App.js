import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Universities from './pages/Universities';
import AdmissionInfo from './pages/AdmissionInfo';
import InquiryForm from './pages/InquiryForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AgentLogin from './pages/AgentLogin';
import AgentRegistration from './pages/AgentRegistration';
import AgentDashboard from './pages/AgentDashboard';
import FAQ from './pages/FAQ';
import TestPage from './pages/TestPage';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CompanyProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Test Route */}
                <Route path="/test" element={<TestPage />} />
                
                {/* Public Routes - Redirect authenticated users to dashboard */}
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
                <Route path="/admission-info" element={
                  <RedirectIfAuthenticated>
                    <AdmissionInfo />
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
                <Route path="/agent/register" element={<AgentRegistration />} />
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
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
            <ScrollToTop />
          </div>
        </CompanyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 