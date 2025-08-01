import React, { useState } from 'react';
import { testFirebaseConnection, testAuthConnection } from '../utils/firebaseTest';

const FirebaseTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults(null);

    try {
      console.log('=== Starting Firebase Connection Tests ===');
      
      // Test Database Connection
      const dbResult = await testFirebaseConnection();
      console.log('Database Test Result:', dbResult);
      
      // Test Auth Connection
      const authResult = await testAuthConnection();
      console.log('Auth Test Result:', authResult);
      
      setTestResults({
        database: dbResult,
        auth: authResult,
        timestamp: new Date().toLocaleString()
      });
      
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        error: error.message,
        timestamp: new Date().toLocaleString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Firebase Connection Test
      </h2>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="btn-primary mb-4"
      >
        {loading ? 'Running Tests...' : 'Run Firebase Tests'}
      </button>

      {testResults && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Test Results</h3>
            <p className="text-sm text-gray-600 mb-2">
              Timestamp: {testResults.timestamp}
            </p>
            
            {testResults.error ? (
              <div className="text-red-600">
                <strong>Error:</strong> {testResults.error}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <strong>Database Connection:</strong>
                  <span className={`ml-2 ${testResults.database.success ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.database.success ? '✅ PASSED' : '❌ FAILED'}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {testResults.database.message}
                  </p>
                </div>
                
                <div>
                  <strong>Auth Connection:</strong>
                  <span className={`ml-2 ${testResults.auth.success ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.auth.success ? '✅ PASSED' : '❌ FAILED'}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {testResults.auth.message}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>Note:</strong> Check the browser console for detailed test logs.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest; 