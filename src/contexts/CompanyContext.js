import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../firebase/config';
import { ref, set, onValue } from 'firebase/database';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'RNBRIDGE Ltd',
    email: 'info@rnbridge.com',
    whatsapp: '+1234567890',
    location: 'London, UK',
    website: 'https://rnbridge.com'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const companyRef = ref(database, 'company');
    
    const unsubscribe = onValue(companyRef, (snapshot) => {
      if (snapshot.exists()) {
        setCompanyInfo(snapshot.val());
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateCompanyInfo = async (newInfo) => {
    try {
      await set(ref(database, 'company'), newInfo);
      setCompanyInfo(newInfo);
    } catch (error) {
      console.error('Error updating company info:', error);
      throw error;
    }
  };

  const value = {
    companyInfo,
    updateCompanyInfo,
    loading
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}; 