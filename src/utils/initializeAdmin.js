import { auth, database } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';

export const initializeDefaultAdmin = async () => {
  const adminEmail = 'rnbridge25@gmail.com';
  const adminPassword = 'Extra@2613';
  
  try {
    console.log('Initializing default super admin user...');
    
    // Check if admin already exists
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      const existingAdmin = Object.values(users).find(
        user => user.email === adminEmail && user.role === 'super_admin'
      );
      
      if (existingAdmin) {
        console.log('✅ Super admin user already exists');
        return { success: true, message: 'Super admin user already exists' };
      }
    }
    
    // Create admin user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const adminUid = userCredential.user.uid;
    
    // Save super admin data to database
    await set(ref(database, `users/${adminUid}`), {
      email: adminEmail,
      role: 'super_admin',
      name: 'RNBRIDGE Super Admin',
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
      createdAt: Date.now(),
      lastLogin: Date.now()
    });
    
    console.log('✅ Super admin user created successfully');
    return { 
      success: true, 
      message: 'Super admin user created successfully',
      uid: adminUid 
    };
    
  } catch (error) {
    console.error('❌ Error creating super admin user:', error);
    
    // If user already exists in Firebase Auth, just ensure database is updated
    if (error.code === 'auth/email-already-in-use') {
      try {
        // Find the user in the database by email
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const users = snapshot.val();
          const adminEntry = Object.entries(users).find(([uid, user]) => 
            user.email === adminEmail
          );
          
          if (adminEntry) {
            const [adminUid] = adminEntry;
            
            // Update user data in database
            await update(ref(database, `users/${adminUid}`), {
              role: 'super_admin',
              name: 'RNBRIDGE Super Admin',
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
              updatedAt: Date.now()
            });
            
            console.log('✅ Super admin user updated successfully');
            return { 
              success: true, 
              message: 'Super admin user updated successfully',
              uid: adminUid 
            };
          }
        }
        
        console.log('✅ Super admin user exists but not found in database');
        return { 
          success: true, 
          message: 'Super admin user exists but not found in database'
        };
      } catch (updateError) {
        console.error('❌ Error updating admin:', updateError);
        return { 
          success: false, 
          message: 'Error updating super admin user: ' + updateError.message 
        };
      }
    }
    
    return { 
      success: false, 
      message: 'Error creating super admin user: ' + error.message 
    };
  }
};

export const checkAdminExists = async () => {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      const admin = Object.values(users).find(
        user => user.email === 'rnbridge25@gmail.com' && user.role === 'super_admin'
      );
      return admin ? true : false;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin:', error);
    return false;
  }
};

export const createSuperUser = async (email, password, userData = {}) => {
  try {
    console.log('Creating super user:', email);
    
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
    
    console.log('✅ Super user created successfully');
    return { 
      success: true, 
      message: 'Super user created successfully',
      uid 
    };
    
  } catch (error) {
    console.error('❌ Error creating super user:', error);
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
    
    console.log('✅ User role updated successfully');
    return { success: true, message: 'User role updated successfully' };
    
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    return { 
      success: false, 
      message: 'Error updating user role: ' + error.message 
    };
  }
}; 