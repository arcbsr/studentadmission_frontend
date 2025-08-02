# How to Find EmailJS User ID

## 📍 Step-by-Step Guide to Get Your EmailJS User ID

### Step 1: Login to EmailJS Dashboard
1. **Go to:** https://www.emailjs.com/
2. **Sign in** to your EmailJS account
3. **Access your dashboard**

### Step 2: Navigate to Account Settings
1. **Click on your profile/account** (usually in top-right corner)
2. **Look for "Account" or "Profile"** in the dropdown menu
3. **Click on "Account"** or "Account Settings"

### Step 3: Find API Keys Section
1. **Scroll down** in the account settings
2. **Look for "API Keys"** or "Public Key" section
3. **You'll see your User ID** (also called Public Key)

### Alternative Method: Direct URL
1. **Go directly to:** https://dashboard.emailjs.com/admin
2. **Click on "Account"** in the left sidebar
3. **Find "API Keys"** section

## 🔑 What Your User ID Looks Like

Your EmailJS User ID will look something like this:
```
user_abc123def456ghi789
```

**Example:**
```
REACT_APP_EMAILJS_USER_ID=user_abc123def456ghi789
```

## 📋 Complete EmailJS Setup Checklist

### 1. Service ID (REACT_APP_EMAILJS_SERVICE_ID)
- **Where:** Email Services tab
- **Format:** `service_abc123`
- **How to get:** Create email service → Copy Service ID

### 2. Template ID (REACT_APP_EMAILJS_TEMPLATE_ID)
- **Where:** Email Templates tab
- **Format:** `template_xyz789`
- **How to get:** Create email template → Copy Template ID

### 3. User ID (REACT_APP_EMAILJS_USER_ID) ⭐
- **Where:** Account → API Keys
- **Format:** `user_def456`
- **How to get:** Account settings → Copy Public Key

## 🎯 Visual Guide

```
EmailJS Dashboard
├── Email Services
│   └── Service ID: service_abc123
├── Email Templates
│   └── Template ID: template_xyz789
└── Account Settings
    └── API Keys
        └── User ID: user_def456
```

## ⚠️ Important Notes

1. **User ID is Public**: This is safe to use in frontend code
2. **Keep Service ID Private**: Don't share your service credentials
3. **Template ID is Public**: Safe to use in frontend code

## 🔧 Add to .env File

Once you have all three IDs, add them to your `.env` file:

```env
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_USER_ID=user_def456
```

## ✅ Verification

After adding the credentials:
1. **Restart your development server**
2. **Test email functionality**
3. **Check browser console** for any errors
4. **Verify emails are being sent**

---

**Need Help?** If you can't find the User ID, try:
1. Check the EmailJS documentation: https://www.emailjs.com/docs/
2. Look for "Public Key" or "API Key" in account settings
3. Contact EmailJS support if needed 