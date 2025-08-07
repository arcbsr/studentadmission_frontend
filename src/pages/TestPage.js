import React, { useState, useEffect } from 'react';
import { database, auth } from '../firebase/config';
import { ref, get, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const TestPage = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const results = {};

    // Test 1: Firebase Auth State
    try {
      await new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          results.authState = {
            success: true,
            message: user ? `User authenticated: ${user.email}` : 'No user authenticated'
          };
          resolve();
        }, (error) => {
          results.authState = {
            success: false,
            message: `Auth state error: ${error.message}`
          };
          reject(error);
        });
      });
    } catch (error) {
      results.authState = {
        success: false,
        message: `Auth state error: ${error.message}`
      };
    }

    // Test 2: Database Connection - Public Data
    try {
      const universitiesRef = ref(database, 'universities');
      const snapshot = await get(universitiesRef);
      results.databasePublic = {
        success: true,
        message: snapshot.exists() ? 'Public data accessible' : 'Public data accessible (empty)'
      };
    } catch (error) {
      results.databasePublic = {
        success: false,
        message: `Database public access error: ${error.message}`
      };
    }

    // Test 3: Database Connection - Company Data
    try {
      const companyRef = ref(database, 'company');
      const snapshot = await get(companyRef);
      results.databaseCompany = {
        success: true,
        message: snapshot.exists() ? 'Company data accessible' : 'Company data accessible (empty)'
      };
    } catch (error) {
      results.databaseCompany = {
        success: false,
        message: `Database company access error: ${error.message}`
      };
    }

    // Test 4: Test Connection Node
    try {
      const testRef = ref(database, 'test-connection');
      await set(testRef, { timestamp: Date.now(), test: true });
      results.testConnection = {
        success: true,
        message: 'Test connection write successful'
      };
    } catch (error) {
      results.testConnection = {
        success: false,
        message: `Test connection error: ${error.message}`
      };
    }

    // Test 5: Environment Variables
    results.environment = {
      success: true,
      message: `API Key: ${process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Missing'}, Database URL: ${process.env.REACT_APP_FIREBASE_DATABASE_URL ? 'Set' : 'Missing'}`
    };

    setTestResults(results);
    setLoading(false);
  };

  const getStatusColor = (success) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Firebase Connection Test</h1>
        
        <div className="grid gap-6">
          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 capitalize">
                {testName.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className={`${getStatusColor(result.success)}`}>
                {result.message}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-2">
            <p>Total Tests: {Object.keys(testResults).length}</p>
            <p>Passed: {Object.values(testResults).filter(r => r.success).length}</p>
            <p>Failed: {Object.values(testResults).filter(r => !r.success).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 