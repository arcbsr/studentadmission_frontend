import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, database } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { ref, get, set, update } from 'firebase/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});
  const [userData, setUserData] = useState(null);

  // Simplified logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      setUserPermissions({});
      setUserData(null);
    } catch (error) {
      // Logout error handled silently
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          
          // Get user data from database
          try {
            const userRef = ref(database, `users/${user.uid}`);
            const userSnapshot = await get(userRef);
            
            if (userSnapshot.exists()) {
              const userInfo = userSnapshot.val();
              
              if (userInfo && userInfo.role) {
                // Check if user is active
                if (userInfo.isActive === false) {
                  await logout();
                  return;
                }
                
                setUserRole(userInfo.role);
                setUserPermissions(userInfo.permissions || {});
                setUserData(userInfo);
              }
            } else {
              // Check agents table
              const agentsRef = ref(database, 'agents');
              const agentsSnapshot = await get(agentsRef);
              
              if (agentsSnapshot.exists()) {
                const agents = agentsSnapshot.val();
                const agentEntry = Object.entries(agents).find(
                  ([id, agentData]) => agentData.email === user.email
                );
                
                if (agentEntry) {
                  const [agentId, agentData] = agentEntry;
                  const userInfo = {
                    ...agentData,
                    uid: agentId,
                    role: 'agent'
                  };
                  
                  if (userInfo.isActive === false) {
                    await logout();
                    return;
                  }
                  
                  setUserRole(userInfo.role);
                  setUserPermissions(userInfo.permissions || {});
                  setUserData(userInfo);
                }
              }
            }
          } catch (error) {
            // Error fetching user data handled silently
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setUserPermissions({});
          setUserData(null);
        }
      } catch (error) {
        // Auth state change error handled silently
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const isAuthenticated = () => {
    if (loading) {
      return false;
    }
    return currentUser && currentUser.email && currentUser.uid;
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      // Login error handled silently
      throw error;
    }
  };

  const signup = async (email, password, role, userData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Save additional user data to database
      await set(ref(database, `users/${result.user.uid}`), {
        email,
        role,
        permissions: getDefaultPermissions(role),
        isActive: true,
        ...userData,
        createdAt: Date.now(),
        lastLogin: Date.now()
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (newPassword) => {
    try {
      await updatePassword(currentUser, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      await update(ref(database, `users/${currentUser.uid}`), {
        ...updates,
        updatedAt: Date.now()
      });

      // Update local state
      setUserData(prev => ({ ...prev, ...updates }));
    } catch (error) {
      throw error;
    }
  };

  const hasPermission = (permission) => {
    if (userRole === 'super_admin') {
      return true;
    }
    return userPermissions[permission] || false;
  };

  const isSuperAdmin = () => {
    return userRole === 'super_admin';
  };

  const isAdmin = () => {
    return userRole === 'admin' || userRole === 'super_admin';
  };

  const isAgent = () => {
    return userRole === 'agent';
  };

  const getDefaultPermissions = (role) => {
    switch (role) {
      case 'super_admin':
        return {
          manageUsers: true,
          manageUniversities: true,
          manageInquiries: true,
          manageAgents: true,
          manageCompany: true,
          viewAnalytics: true,
          systemSettings: true
        };
      case 'admin':
        return {
          manageUniversities: true,
          manageInquiries: true,
          manageAgents: true,
          manageCompany: true,
          viewAnalytics: true
        };
      case 'agent':
        return {
          viewOwnReferrals: true,
          viewOwnCommissions: true
        };
      default:
        return {};
    }
  };

  const value = {
    currentUser,
    userRole,
    userPermissions,
    userData,
    loading,
    login,
    logout,
    signup,
    changePassword,
    resetPassword,
    updateUserProfile,
    hasPermission,
    isSuperAdmin,
    isAdmin,
    isAgent,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};