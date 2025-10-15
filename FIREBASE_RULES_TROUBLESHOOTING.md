# Firebase Rules Troubleshooting Guide

## Issue: Blank Pages After Adding Security Rules

If your pages are blank after adding Firebase security rules, follow these steps:

## Step 1: Use Debug Rules (Immediate Fix)

1. **Go to Firebase Console**
2. **Navigate to Realtime Database → Rules**
3. **Replace current rules with debug rules**:

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null",
    
    "universities": {
      ".read": true,
      ".write": "auth != null"
    },
    
    "faqs": {
      ".read": true,
      ".write": "auth != null"
    },
    
    "company": {
      ".read": true,
      ".write": "auth != null"
    },
    
    "users": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    
    "agents": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    
    "inquiries": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$inquiryId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    
    "test-connection": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

4. **Click "Publish"**
5. **Refresh your app** - pages should now load

## Step 2: Check Browser Console for Errors

1. **Open browser developer tools** (F12)
2. **Go to Console tab**
3. **Look for Firebase permission errors** like:
   - "Permission denied"
   - "Client doesn't have permission"
   - "Rules are not satisfied"

## Step 3: Identify the Problem

### Common Issues:

1. **Public data not accessible**
   - Universities, FAQs, company info need public read access
   - Check if these are being loaded on public pages

2. **Authentication issues**
   - Users might not be properly authenticated
   - Check if auth state is being handled correctly

3. **Database path issues**
   - Data might be stored in different paths than expected
   - Check the actual database structure

## Step 4: Gradual Security Implementation

Once the debug rules work, gradually implement security:

### Phase 1: Basic Security
```json
{
  "rules": {
    ".read": false,
    ".write": false,
    
    "universities": {
      ".read": true,
      ".write": "auth != null"
    },
    
    "faqs": {
      ".read": true,
      ".write": "auth != null"
    },
    
    "company": {
      ".read": true,
      ".write": "auth != null"
    },
    
    "users": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    
    "agents": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    
    "inquiries": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### Phase 2: Role-Based Security
```json
{
  "rules": {
    ".read": false,
    ".write": false,
    
    "universities": {
      ".read": true,
      ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')"
    },
    
    "faqs": {
      ".read": true,
      ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')"
    },
    
    "company": {
      ".read": true,
      ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')"
    },
    
    "users": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$uid": {
        ".read": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')",
        ".write": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')"
      }
    },
    
    "agents": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$uid": {
        ".read": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')",
        ".write": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')"
      }
    },
    
    "inquiries": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$inquiryId": {
        ".read": "auth != null && (root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')",
        ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')"
      }
    }
  }
}
```

## Step 5: Testing Checklist

### Test Public Pages:
- [ ] Home page loads
- [ ] Universities page loads
- [ ] FAQs page loads
- [ ] Contact page loads
- [ ] About page loads

### Test Authentication:
- [ ] Login works
- [ ] Registration works
- [ ] User dashboard loads
- [ ] Agent dashboard loads
- [ ] Admin dashboard loads

### Test Data Access:
- [ ] Public data is readable
- [ ] User can access own data
- [ ] Admin can access all data
- [ ] Inquiries can be created
- [ ] Admin can manage inquiries

## Emergency Rollback

If everything breaks, use these rules temporarily:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ WARNING**: Only use for debugging and remove immediately!

## Debugging Tips

1. **Check Firebase Console** for rule violations
2. **Use browser console** to see permission errors
3. **Test with different user roles**
4. **Verify authentication state**
5. **Check database structure**

## Common Error Messages

- **"Permission denied"**: Rules are too restrictive
- **"Client doesn't have permission"**: User not authenticated or wrong role
- **"Rules are not satisfied"**: Rule syntax error or logic issue
- **"Path not found"**: Database path doesn't exist

## Next Steps

1. **Start with debug rules** to get app working
2. **Identify specific issues** causing blank pages
3. **Gradually implement security** once working
4. **Test thoroughly** at each step
5. **Monitor for issues** after deployment 