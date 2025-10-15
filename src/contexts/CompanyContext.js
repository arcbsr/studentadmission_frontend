import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../firebase/config';
import { ref, set, onValue } from 'firebase/database';
import { toast } from 'react-hot-toast';

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
    website: 'https://rnbridge.com',
    // Agent registration settings
    agentRegistrationEnabled: false,
    agentRegistrationRequiresApproval: true,
    agentDefaultCommission: 10, // Default commission percentage
    agentRegistrationMessage: 'Agent registration is currently disabled. Please contact admin for access.'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    
    try {
      const companyRef = ref(database, 'company');
      
      unsubscribe = onValue(companyRef, (snapshot) => {
        try {
          if (snapshot.exists()) {
            setCompanyInfo(snapshot.val());
          }
        } catch (error) {
          // Error processing company data handled silently
        } finally {
          setLoading(false);
        }
      }, (error) => {
        // Company data load error handled silently
        setLoading(false);
      });

      // Set a timeout to ensure loading state is cleared
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 5000);

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
        clearTimeout(timeout);
      };
    } catch (error) {
      // CompanyContext initialization error handled silently
      setLoading(false);
    }
  }, []);

  const updateCompanyInfo = async (newInfo) => {
    try {
      await set(ref(database, 'company'), newInfo);
      setCompanyInfo(newInfo);
      toast.success('Company information updated successfully');
    } catch (error) {
      // Company info update error handled silently
      toast.error('Failed to update company information');
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