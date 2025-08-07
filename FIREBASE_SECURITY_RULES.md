# Firebase Database Security Rules

## Overview
This document explains the security rules implemented for the Firebase Realtime Database to ensure proper access control and data protection.

## Security Rules Structure

### Default Access
- **Default**: Deny all access (`.read: false`, `.write: false`)
- **Principle**: Secure by default, explicit permissions required

### Public Data (Readable by Anyone)
- **Universities**: Public read, admin-only write
- **FAQs**: Public read, admin-only write  
- **Company Info**: Public read, admin-only write

### User Data (Restricted Access)
- **Users**: Users can only access their own data, admins can access all
- **Agents**: Agents can only access their own data, admins can access all

### Inquiries (Controlled Access)
- **Create**: Anyone authenticated can create inquiries
- **Read/Write**: Only admins can read and modify inquiries

## Access Control Matrix

| Data Type | Public Read | Authenticated Write | Admin Read | Admin Write |
|-----------|-------------|-------------------|------------|-------------|
| Universities | ✅ | ❌ | ✅ | ✅ |
| FAQs | ✅ | ❌ | ✅ | ✅ |
| Company Info | ✅ | ❌ | ✅ | ✅ |
| Users (own) | ❌ | ✅ | ✅ | ✅ |
| Users (others) | ❌ | ❌ | ✅ | ✅ |
| Agents (own) | ❌ | ✅ | ✅ | ✅ |
| Agents (others) | ❌ | ❌ | ✅ | ✅ |
| Inquiries | ❌ | ✅ (create only) | ✅ | ✅ |

## Role-Based Access

### Public Users
- Can read: universities, FAQs, company info
- Can write: inquiries (create only)

### Authenticated Users
- Can read: own user data, own agent data
- Can write: own user data, own agent data, inquiries (create)

### Admins
- Can read: all data
- Can write: all data

### Super Admins
- Can read: all data
- Can write: all data

## Deployment Instructions

### 1. Deploy Rules via Firebase Console
1. Go to Firebase Console
2. Select your project
3. Go to Realtime Database
4. Click on "Rules" tab
5. Copy the contents of `firebase-database-rules.json`
6. Paste into the rules editor
7. Click "Publish"

### 2. Deploy Rules via Firebase CLI
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init

# Deploy the rules
firebase deploy --only database
```

### 3. Verify Deployment
1. Check Firebase Console > Realtime Database > Rules
2. Verify the rules are active
3. Test access with different user roles

## Security Best Practices

### 1. Regular Audits
- Review access patterns monthly
- Monitor for unauthorized access attempts
- Update rules based on usage patterns

### 2. Principle of Least Privilege
- Users only get access to what they need
- Admins have broader access but still controlled
- Public data is limited to read-only

### 3. Data Validation
- Validate data structure in rules
- Enforce required fields
- Prevent malicious data injection

### 4. Monitoring
- Enable Firebase Analytics
- Monitor database usage
- Set up alerts for unusual activity

## Troubleshooting

### Common Issues

1. **Users can't access their data**
   - Check if user is authenticated
   - Verify user UID matches data path
   - Ensure user role is properly set

2. **Admins can't access all data**
   - Verify admin role in users table
   - Check role spelling (admin, super_admin)
   - Ensure admin is authenticated

3. **Public data not readable**
   - Check if rules are properly deployed
   - Verify no conflicting rules
   - Test with unauthenticated requests

### Testing Rules

```javascript
// Test authenticated user access
firebase.database().ref('users/user123').once('value')
  .then(snapshot => console.log('Access granted'))
  .catch(error => console.log('Access denied:', error));

// Test admin access
firebase.database().ref('users').once('value')
  .then(snapshot => console.log('Admin access granted'))
  .catch(error => console.log('Admin access denied:', error));
```

## Emergency Access

If you need to temporarily allow full access for debugging:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ WARNING**: Only use this for debugging and remove immediately after!

## Updates and Maintenance

1. **Review rules quarterly**
2. **Update based on new features**
3. **Test thoroughly before deployment**
4. **Monitor for security issues**
5. **Keep documentation updated**

## Support

For issues with security rules:
1. Check Firebase Console for error messages
2. Review the rules syntax
3. Test with Firebase CLI simulator
4. Contact Firebase support if needed 