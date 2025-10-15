# 🚨 EMERGENCY FIX: Website Not Loading

## Immediate Solution

### Step 1: Apply Emergency Rules
1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**
3. **Go to Realtime Database**
4. **Click "Rules" tab**
5. **Delete ALL existing rules**
6. **Paste these emergency rules**:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

7. **Click "Publish"**
8. **Wait 30 seconds** for rules to propagate

### Step 2: Clear Browser Cache
1. **Open browser developer tools** (F12)
2. **Right-click refresh button** → "Empty Cache and Hard Reload"
3. **Or press Ctrl+Shift+R** (Cmd+Shift+R on Mac)

### Step 3: Check Browser Console
1. **Open browser developer tools** (F12)
2. **Go to Console tab**
3. **Look for any error messages**
4. **Take a screenshot** of any errors

### Step 4: Test the Site
1. **Go to http://localhost:3000**
2. **Check if pages load now**
3. **Test different pages** (Home, Universities, etc.)

## If Still Not Working

### Check 1: Firebase Connection
1. **Open browser console** (F12)
2. **Look for Firebase connection errors**
3. **Check if Firebase is initialized properly**

### Check 2: Network Issues
1. **Go to Network tab** in developer tools
2. **Refresh the page**
3. **Look for failed requests** (red entries)
4. **Check if Firebase requests are failing**

### Check 3: JavaScript Errors
1. **Look for JavaScript errors** in console
2. **Check for syntax errors**
3. **Look for import/export errors**

## Debugging Steps

### Step 1: Check Firebase Config
Make sure your Firebase config is correct in `src/firebase/config.js`:

```javascript
// Check if this file exists and has correct config
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // Your config should be here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
```

### Step 2: Check App.js
Make sure your App.js is properly structured:

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// ... other imports

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Your routes here */}
      </AuthProvider>
    </Router>
  );
}

export default App;
```

### Step 3: Check Package.json
Make sure all dependencies are installed:

```bash
npm install
npm start
```

## Common Issues & Solutions

### Issue 1: Firebase Permission Denied
**Solution**: Use emergency rules above

### Issue 2: React Router Issues
**Solution**: Check if all routes are properly defined

### Issue 3: Import Errors
**Solution**: Check if all files exist and imports are correct

### Issue 4: Authentication Issues
**Solution**: Check if AuthContext is properly configured

## Next Steps After Fix

1. **Once site works** with emergency rules
2. **Gradually implement** stricter security
3. **Test each change** thoroughly
4. **Monitor for issues**

## Emergency Contact

If nothing works:
1. **Check Firebase project settings**
2. **Verify API keys** are correct
3. **Check if database exists**
4. **Contact Firebase support**

## Quick Commands

```bash
# Restart development server
npm start

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm run build
``` 