import React, { useState } from 'react';
import { testEmailSending, testInquiryEmail } from '../utils/testEmail';
import { Mail, Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailTest = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const handleTestEmail = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      const result = await testEmailSending();
      setTestResults(result);
      
      if (result.success) {
        toast.success('Test email sent successfully! Check bsrsoftbd@gmail.com');
      } else {
        toast.error('Email test failed. Check console for details.');
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestInquiryEmail = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      const result = await testInquiryEmail();
      setTestResults(result);
      
      if (result.success) {
        toast.success('Inquiry test email sent successfully! Check bsrsoftbd@gmail.com');
      } else {
        toast.error('Inquiry email test failed. Check console for details.');
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Email Testing Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Test email functionality for RNBRIDGE Ltd System
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Email Card */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold">Test Basic Email</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Send a test email to bsrsoftbd@gmail.com to verify EmailJS configuration.
            </p>
            <button
              onClick={handleTestEmail}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  Send Test Email
                </div>
              )}
            </button>
          </div>

          {/* Test Inquiry Email Card */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold">Test Inquiry Email</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Send a test student inquiry confirmation email to bsrsoftbd@gmail.com.
            </p>
            <button
              onClick={handleTestInquiryEmail}
              disabled={loading}
              className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  Send Inquiry Test
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Test Results</h3>
            <div className={`card ${testResults.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start">
                {testResults.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 mr-3 mt-1" />
                )}
                <div className="flex-1">
                  <h4 className={`font-semibold ${testResults.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResults.success ? 'Test Successful' : 'Test Failed'}
                  </h4>
                  <p className={`mt-1 ${testResults.success ? 'text-green-700' : 'text-red-700'}`}>
                    {testResults.message || testResults.error}
                  </p>
                  {testResults.details && (
                    <div className="mt-3 p-3 bg-gray-100 rounded">
                      <h5 className="font-medium text-gray-800 mb-2">Configuration Details:</h5>
                      <div className="text-sm text-gray-600">
                        <p>Service ID: {testResults.details.serviceId}</p>
                        <p>Template ID: {testResults.details.templateId}</p>
                        <p>User ID: {testResults.details.userId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Status */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Configuration Status</h3>
          <div className="card">
            <div className="space-y-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                <span className="text-gray-700">
                  <strong>Service ID:</strong> {process.env.REACT_APP_EMAILJS_SERVICE_ID || 'Not configured'}
                </span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                <span className="text-gray-700">
                  <strong>Template ID:</strong> {process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'Not configured'}
                </span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                <span className="text-gray-700">
                  <strong>User ID:</strong> {process.env.REACT_APP_EMAILJS_USER_ID || 'Not configured'}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> If you see "Not configured", please set up your EmailJS credentials in the .env file.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">How to Test</h3>
          <div className="card">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Ensure your EmailJS credentials are configured in .env file</li>
              <li>Click "Send Test Email" to test basic email functionality</li>
              <li>Click "Send Inquiry Test" to test student inquiry email</li>
              <li>Check bsrsoftbd@gmail.com for received emails</li>
              <li>Check browser console for detailed logs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTest; 