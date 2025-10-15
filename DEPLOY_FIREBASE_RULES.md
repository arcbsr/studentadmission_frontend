# Deploy Firebase Security Rules via Console

## Step-by-Step Guide

### 1. Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. In the left sidebar, click on **"Realtime Database"**

### 2. Access Rules Tab
1. In the Realtime Database section, click on the **"Rules"** tab
2. You'll see the current rules (which are probably wide open)

### 3. Replace the Rules
1. **Delete all existing rules** in the editor
2. **Copy the secure rules** from `firebase-database-rules.json`:

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
      "$uid": {
        ".read": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')",
        ".write": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')"
      }
    },
    
    "agents": {
      "$uid": {
        ".read": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')",
        ".write": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')"
      }
    },
    
    "inquiries": {
      ".read": "auth != null && (root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')",
      ".write": "auth != null",
      "$inquiryId": {
        ".read": "auth != null && (root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')",
        ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'super_admin')"
      }
    },
    
    "test-connection": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 4. Publish the Rules
1. **Paste the rules** into the editor
2. Click the **"Publish"** button
3. Wait for the confirmation message

### 5. Verify Deployment
1. Check that the rules are now active
2. You should see a success message
3. The rules will be applied immediately

## What These Rules Do

### 🔒 Security Features:
- **Default deny**: All access is denied by default
- **Public data**: Universities, FAQs, company info are readable by anyone
- **User data**: Users can only access their own data
- **Admin access**: Admins can access all data
- **Inquiries**: Anyone can create, only admins can read/write

### 🛡️ Protection:
- **No more open database**: Your data is now secure
- **Role-based access**: Different permissions for different user types
- **Data isolation**: Users can't see each other's data
- **Admin control**: Admins have full access for management

## Testing After Deployment

### 1. Test Public Access
- Visit your website
- Check that universities, FAQs, company info are still visible
- Verify public pages work normally

### 2. Test User Access
- Login as a regular user
- Verify they can access their own data
- Check they can't access other users' data

### 3. Test Admin Access
- Login as admin
- Verify they can access all data
- Check they can manage users and inquiries

## Troubleshooting

### If Public Data is Not Accessible:
- Check that the rules were published correctly
- Verify the JSON syntax is valid
- Make sure there are no typos in the rules

### If Users Can't Access Their Data:
- Check that users are properly authenticated
- Verify the user UID matches the data path
- Ensure the user role is set correctly

### If Admins Can't Access All Data:
- Verify admin role is set to "admin" or "super_admin"
- Check that admin is properly authenticated
- Ensure admin user exists in the users table

## Emergency Rollback

If something goes wrong and you need to temporarily allow all access:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ WARNING**: Only use this for debugging and remove immediately after!

## Next Steps

1. **Test thoroughly** with different user roles
2. **Monitor for any access issues**
3. **Update rules** as your app evolves
4. **Regular security audits** recommended

## Support

If you encounter issues:
1. Check the Firebase Console for error messages
2. Review the rules syntax
3. Test with different user accounts
4. Contact Firebase support if needed 