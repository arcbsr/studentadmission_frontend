import React, { useState } from 'react';
import { initializeUniversities } from '../utils/initializeUniversities';
import { testUniversities } from '../utils/testUniversities';
import { manualInitialize } from '../utils/manualInitialize';
import { database } from '../firebase/config';
import { ref, get } from 'firebase/database';

const TestPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testFirebaseConnection = async () => {
    setLoading(true);
    addResult('Testing Firebase connection...', 'info');
    
    try {
      const testRef = ref(database, 'test-connection');
      await get(testRef);
      addResult('✅ Firebase connection successful', 'success');
    } catch (error) {
      addResult(`❌ Firebase connection failed: ${error.message}`, 'error');
    }
    setLoading(false);
  };

  const initializeUnis = async () => {
    setLoading(true);
    addResult('Initializing universities...', 'info');
    
    try {
      const result = await initializeUniversities();
      if (result.success) {
        addResult(`✅ ${result.message}`, 'success');
      } else {
        addResult(`❌ ${result.message}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, 'error');
    }
    setLoading(false);
  };

  const manualInit = async () => {
    setLoading(true);
    addResult('Manual initialization...', 'info');
    
    try {
      const result = await manualInitialize();
      if (result.success) {
        addResult(`✅ ${result.message}`, 'success');
      } else {
        addResult(`❌ ${result.message}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, 'error');
    }
    setLoading(false);
  };

  const testUnis = async () => {
    setLoading(true);
    addResult('Testing universities...', 'info');
    
    try {
      const result = await testUniversities();
      if (result.success) {
        addResult(`✅ ${result.message}`, 'success');
      } else {
        addResult(`❌ ${result.message}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Error: ${error.message}`, 'error');
    }
    setLoading(false);
  };

  const checkDatabase = async () => {
    setLoading(true);
    addResult('Checking database structure...', 'info');
    
    try {
      const universitiesRef = ref(database, 'universities');
      const snapshot = await get(universitiesRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const count = Object.keys(data).length;
        addResult(`✅ Found ${count} universities in database`, 'success');
        
        // Log first 3 universities
        Object.entries(data).slice(0, 3).forEach(([id, uni]) => {
          addResult(`- ${uni.name} (${uni.country})`, 'info');
        });
      } else {
        addResult('❌ No universities found in database', 'error');
      }
    } catch (error) {
      addResult(`❌ Database check failed: ${error.message}`, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Firebase Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Functions</h2>
            <div className="space-y-3">
              <button
                onClick={testFirebaseConnection}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                Test Firebase Connection
              </button>
              
              <button
                onClick={initializeUnis}
                disabled={loading}
                className="w-full btn-secondary disabled:opacity-50"
              >
                Initialize Universities
              </button>
              
              <button
                onClick={manualInit}
                disabled={loading}
                className="w-full btn-secondary disabled:opacity-50"
              >
                Manual Initialize (3 Universities)
              </button>
              
              <button
                onClick={testUnis}
                disabled={loading}
                className="w-full btn-secondary disabled:opacity-50"
              >
                Test Universities Loading
              </button>
              
              <button
                onClick={checkDatabase}
                disabled={loading}
                className="w-full btn-secondary disabled:opacity-50"
              >
                Check Database Structure
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm ${
                    result.type === 'success' ? 'bg-green-100 text-green-800' :
                    result.type === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}
                >
                  <span className="text-xs text-gray-500">{result.timestamp}</span>
                  <div>{result.message}</div>
                </div>
              ))}
              {results.length === 0 && (
                <p className="text-gray-500">No tests run yet. Click a button above to start testing.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Test Firebase Connection" to verify Firebase is working</li>
            <li>Click "Initialize Universities" to add default universities</li>
            <li>Click "Test Universities Loading" to check if universities are accessible</li>
            <li>Click "Check Database Structure" to see what's in the database</li>
            <li>Check the results panel for detailed information</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 