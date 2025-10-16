import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://demo-project-default-rtdb.firebaseio.com/",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "demo-app-id",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "demo-measurement-id"
};

// Initialize Firebase with error handling
let app, database, auth;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);

  // Set persistence to browser local storage (persists across page reloads)
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn('Firebase persistence setting failed:', error);
  });
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // Create mock objects to prevent app crashes
  app = null;
  database = null;
  auth = null;
}

export { database, auth };

export default app; 