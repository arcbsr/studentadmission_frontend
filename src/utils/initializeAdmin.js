import { auth, database } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';

export const initializeDefaultAdmin = async () => {
  const email = process.env.REACT_APP_SUPER_ADMIN_EMAIL || 'rnbridge25@gmail.com';
  const password = process.env.REACT_APP_SUPER_ADMIN_PASSWORD || 'Extra@2613';
  
  try {
    // Check if super admin already exists in database
    const adminSnapshot = await get(ref(database, 'users'));
    
    if (adminSnapshot.exists()) {
      const users = adminSnapshot.val();
      const superAdmin = Object.values(users).find(user => 
        user.role === 'super_admin' && user.email === email
      );
      
      if (superAdmin) {
        return {
          success: true,
          message: 'Super admin user already exists'
        };
      }
    }

    // Create super admin user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const superAdminUser = {
      uid: userCredential.user.uid,
      name: 'Super Admin',
      email: email,
      role: 'super_admin',
      isActive: true,
      createdAt: Date.now(),
      lastLogin: null,
      permissions: {
        viewAnalytics: true,
        manageUsers: true,
        manageAgents: true,
        manageInquiries: true,
        manageUniversities: true,
        manageCompany: true,
        manageCommissions: true
      }
    };

    // Save to database
    await set(ref(database, `users/${userCredential.user.uid}`), superAdminUser);

    // Update Firebase Auth profile
    await updateProfile(userCredential.user, {
      displayName: 'Super Admin'
    });

    return {
      success: true,
      message: 'Super admin user created successfully'
    };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      try {
        // First, try to find the user in Firebase Auth by email
        const usersSnapshot = await get(ref(database, 'users'));
        let existingUser = null;
        let existingUserId = null;
        
        if (usersSnapshot.exists()) {
          const users = usersSnapshot.val();
          const userEntry = Object.entries(users).find(([uid, user]) => 
            user.email === email
          );
          
          if (userEntry) {
            [existingUserId, existingUser] = userEntry;
          }
        }
        
        if (existingUser) {
          // Update existing user to super admin
          await update(ref(database, `users/${existingUserId}`), {
            role: 'super_admin',
            permissions: {
              viewAnalytics: true,
              manageUsers: true,
              manageAgents: true,
              manageInquiries: true,
              manageUniversities: true,
              manageCompany: true,
              manageCommissions: true
            },
            updatedAt: Date.now()
          });

          return {
            success: true,
            message: 'Super admin user updated successfully'
          };
        } else {
          // User exists in Firebase Auth but not in database
          const authUser = auth.currentUser;
          if (authUser && authUser.email === email) {
            // Create database entry for existing Firebase Auth user
            await set(ref(database, `users/${authUser.uid}`), {
              uid: authUser.uid,
              name: 'Super Admin',
              email: email,
              role: 'super_admin',
              isActive: true,
              createdAt: Date.now(),
              lastLogin: null,
              permissions: {
                viewAnalytics: true,
                manageUsers: true,
                manageAgents: true,
                manageInquiries: true,
                manageUniversities: true,
                manageCompany: true,
                manageCommissions: true
              }
            });

            return {
              success: true,
              message: 'Database entry created for existing Firebase Auth user'
            };
          }
        }
      } catch (dbError) {
        return {
          success: false,
          message: 'Error handling existing user: ' + dbError.message
        };
      }
    }
    
    return {
      success: false,
      message: 'Error creating super admin: ' + error.message
    };
  }
};

export const checkAdminExists = async () => {
  try {
    const adminSnapshot = await get(ref(database, 'users'));
    
    if (adminSnapshot.exists()) {
      const users = adminSnapshot.val();
      const superAdmin = Object.values(users).find(user => 
        user.role === 'super_admin'
      );
      
      return !!superAdmin;
    }
    
    return false;
  } catch (error) {
    return false;
  }
};

export const ensureSuperAdminExists = async () => {
  try {
    const adminExists = await checkAdminExists();
    
    if (!adminExists) {
      // Try to check and fix Firebase Auth user
      const email = process.env.REACT_APP_SUPER_ADMIN_EMAIL || 'rnbridge25@gmail.com';
      const password = process.env.REACT_APP_SUPER_ADMIN_PASSWORD || 'Extra@2613';
      
      const fixResult = await checkAndFixFirebaseAuthUser(email, password);
      if (fixResult.success) {
        return fixResult;
      } else {
        return await initializeDefaultAdmin();
      }
    } else {
      return {
        success: true,
        message: 'Super admin already exists'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error ensuring super admin exists: ' + error.message
    };
  }
};

export const createSuperUser = async (email, password, userData = {}) => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Save user data to database
    await set(ref(database, `users/${uid}`), {
      email,
      role: 'super_admin',
      name: userData.name || 'Super Admin',
      permissions: {
        manageUsers: true,
        manageUniversities: true,
        manageInquiries: true,
        manageAgents: true,
        manageCompany: true,
        viewAnalytics: true,
        systemSettings: true
      },
      isActive: true,
      isSuperAdmin: true,
      ...userData,
      createdAt: Date.now(),
      lastLogin: Date.now()
    });
    
    return { 
      success: true, 
      message: 'Super user created successfully',
      uid 
    };
    
  } catch (error) {
    return { 
      success: false, 
      message: 'Error creating super user: ' + error.message 
    };
  }
};

export const updateUserRole = async (uid, newRole, permissions = {}) => {
  try {
    await update(ref(database, `users/${uid}`), {
      role: newRole,
      permissions,
      updatedAt: Date.now()
    });
    
    return { success: true, message: 'User role updated successfully' };
    
  } catch (error) {
    return { 
      success: false, 
      message: 'Error updating user role: ' + error.message 
    };
  }
};

export const checkAndFixFirebaseAuthUser = async (email, password) => {
  try {
    // Try to sign in to check if user exists in Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Check if user exists in database
    const userSnapshot = await get(ref(database, `users/${uid}`));
    
    if (!userSnapshot.exists()) {
      // User exists in Firebase Auth but not in database, create database entry
      await set(ref(database, `users/${uid}`), {
        uid: uid,
        name: 'Super Admin',
        email: email,
        role: 'super_admin',
        isActive: true,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        permissions: {
          viewAnalytics: true,
          manageUsers: true,
          manageAgents: true,
          manageInquiries: true,
          manageUniversities: true,
          manageCompany: true,
          manageCommissions: true
        }
      });
      
      return {
        success: true,
        message: 'Firebase Auth user fixed - database entry created'
      };
    } else {
      // User exists in both Firebase Auth and database
      const userData = userSnapshot.val();
      
      if (userData.role !== 'super_admin') {
        // Update user to super admin
        await update(ref(database, `users/${uid}`), {
          role: 'super_admin',
          permissions: {
            viewAnalytics: true,
            manageUsers: true,
            manageAgents: true,
            manageInquiries: true,
            manageUniversities: true,
            manageCompany: true,
            manageCommissions: true
          },
          updatedAt: Date.now()
        });
        
        return {
          success: true,
          message: 'Firebase Auth user fixed - role updated to super admin'
        };
      } else {
        return {
          success: true,
          message: 'Firebase Auth user already exists as super admin'
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error fixing Firebase Auth user: ' + error.message
    };
  }
}; 

export const createUserWithoutSignIn = async (email, password, userData = {}) => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Immediately sign out to prevent auto login
    await signOut(auth);
    
    // Save user data to database
    await set(ref(database, `users/${uid}`), {
      email,
      role: userData.role || 'agent',
      name: userData.name || 'New User',
      phone: userData.phone || '',
      country: userData.country || '',
      permissions: userData.permissions || {},
      isActive: userData.isActive !== false,
      ...userData,
      createdAt: Date.now(),
      lastLogin: null
    });
    
    return { 
      success: true, 
      message: 'User created successfully',
      uid 
    };
    
  } catch (error) {
    return { 
      success: false, 
      message: 'Error creating user: ' + error.message 
    };
  }
}; 

export const createUserInDatabaseOnly = async (email, password, userData = {}) => {
  try {
    // Generate a unique UID for the user (since we're not using Firebase Auth)
    const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save user data to database only
    await set(ref(database, `users/${uid}`), {
      uid,
      email,
      role: userData.role || 'agent',
      name: userData.name || 'New User',
      phone: userData.phone || '',
      country: userData.country || '',
      permissions: userData.permissions || {},
      isActive: userData.isActive !== false,
      password: password, // Store password temporarily for Firebase Auth creation
      needsFirebaseAuth: true, // Flag to indicate this user needs Firebase Auth account
      ...userData,
      createdAt: Date.now(),
      lastLogin: null
    });
    
    return { 
      success: true, 
      message: 'User created in database. Firebase Auth account will be created on first login.',
      uid 
    };
    
  } catch (error) {
    return { 
      success: false, 
      message: 'Error creating user: ' + error.message 
    };
  }
}; 