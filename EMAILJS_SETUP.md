# EmailJS Setup Guide for RNBRIDGE Ltd

## 📧 Complete EmailJS Configuration

This guide will help you set up EmailJS to enable email notifications in your RNBRIDGE Ltd Student Admission Management System.

## 🚀 Step 1: Sign Up for EmailJS

1. **Visit EmailJS**: Go to https://www.emailjs.com/
2. **Create Account**: Sign up with your email address
3. **Verify Email**: Check your inbox and verify your account

## 🔧 Step 2: Create Email Service

1. **Go to Email Services**: In your EmailJS dashboard, click "Email Services"
2. **Add New Service**: Click "Add New Service"
3. **Choose Gmail**: Select "Gmail" as your email service
4. **Configure Gmail**:
   - **Service Name**: `RNBRIDGE Email Service`
   - **Email**: `rnbridge25@gmail.com`
   - **Password**: Use Gmail App Password (not your regular password)

### 🔐 Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in EmailJS (not your regular Gmail password)

### ⚠️ IMPORTANT: Fix Gmail API Authentication Scopes Error

If you get "412Gmail_API: Request had insufficient authentication scopes" error:

#### Option 1: Use Gmail SMTP (Recommended)
1. **In EmailJS Dashboard**:
   - Go to Email Services
   - Edit your Gmail service
   - Change from "Gmail API" to "Gmail SMTP"
   - Use these settings:
     - **Host**: smtp.gmail.com
     - **Port**: 587
     - **Username**: rnbridge25@gmail.com
     - **Password**: Your Gmail App Password
     - **Security**: TLS

#### Option 2: Use Gmail API with Proper Scopes
1. **Enable Gmail API**:
   - Go to Google Cloud Console: https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable Gmail API
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add these scopes:
     - `https://www.googleapis.com/auth/gmail.send`
     - `https://www.googleapis.com/auth/gmail.compose`

#### Option 3: Use Alternative Email Service
If Gmail continues to have issues, try:
1. **Outlook/Hotmail**: Use your Outlook account
2. **Yahoo Mail**: Use Yahoo SMTP
3. **Custom SMTP**: Use your own email server

## 📝 Step 3: Create Email Template

1. **Go to Email Templates**: In EmailJS dashboard, click "Email Templates"
2. **Add New Template**: Click "Add New Template"
3. **Configure Template**:

### Template Settings:
- **Template Name**: `RNBRIDGE Email Template`
- **Subject**: `{{subject}}`
- **Content Type**: HTML

### Template Content:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; }
        .btn { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>RNBRIDGE Ltd</h1>
        </div>
        <div class="content">
            <p><strong>From:</strong> {{from_name}} ({{from_email}})</p>
            <p><strong>To:</strong> {{to_name}} ({{to_email}})</p>
            <p><strong>Subject:</strong> {{subject}}</p>
            <hr>
            <div style="white-space: pre-wrap;">{{message}}</div>
        </div>
        <div class="footer">
            <p>This email was sent from RNBRIDGE Ltd Student Admission Management System</p>
            <p>© 2024 RNBRIDGE Ltd. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

## 🔑 Step 4: Get Your Credentials

After creating the service and template, you'll get:

1. **Service ID**: Found in Email Services tab
2. **Template ID**: Found in Email Templates tab  
3. **User ID**: Found in Account → API Keys

## ⚙️ Step 5: Configure Environment Variables

Create a `.env` file in your project root:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# EmailJS Configuration
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_USER_ID=your_user_id_here
```

## 🧪 Step 6: Test Email Functionality

1. **Restart your development server**:
   ```bash
   npm start
   ```

2. **Test Student Inquiry**:
   - Go to http://localhost:3000/inquiry
   - Submit a test inquiry
   - Check if confirmation email is sent

3. **Test Admin Functions**:
   - Login as admin (rnbridge25@gmail.com / Extra@2613)
   - Create a new agent
   - Check if welcome email is sent

## 📧 Email Scenarios

### Student Inquiry Confirmation
- **Triggered**: When student submits inquiry form
- **Recipients**: Student, Agent (if referral used), Admin
- **Content**: Inquiry details, next steps

### Agent Welcome Email
- **Triggered**: When admin creates new agent
- **Recipients**: New agent
- **Content**: Welcome message, referral key, commission rate

### Status Update Notification
- **Triggered**: When admin updates inquiry status
- **Recipients**: Student
- **Content**: Status change, next steps

### Agent Referral Notification
- **Triggered**: When student uses agent referral key
- **Recipients**: Agent
- **Content**: Student details, commission info

## 🔍 Troubleshooting

### Common Issues:

1. **"412Gmail_API: Request had insufficient authentication scopes" error**:
   - **Solution**: Switch to Gmail SMTP instead of Gmail API
   - **Steps**: Edit your EmailJS service → Change to SMTP → Use smtp.gmail.com:587
   - **Alternative**: Use Outlook, Yahoo, or custom SMTP

2. **"Email sending failed" error**:
   - Check EmailJS credentials in .env file
   - Verify Gmail app password is correct
   - Ensure EmailJS service is active

3. **Emails not being sent**:
   - Check browser console for errors
   - Verify EmailJS initialization
   - Test with EmailJS dashboard

4. **Gmail authentication issues**:
   - Use App Password, not regular password
   - Enable 2-Factor Authentication
   - Check Gmail security settings

### Debug Steps:

1. **Check Console Logs**: Look for email-related errors
2. **Test EmailJS Dashboard**: Use EmailJS test feature
3. **Verify Environment Variables**: Ensure all EmailJS variables are set
4. **Check Network Tab**: Monitor API calls to EmailJS
5. **Try Alternative Email Service**: If Gmail fails, try Outlook or Yahoo

## 📞 Support

If you encounter issues:

1. **EmailJS Documentation**: https://www.emailjs.com/docs/
2. **Gmail App Passwords**: https://support.google.com/accounts/answer/185833
3. **Gmail API Scopes**: https://developers.google.com/gmail/api/auth/scopes
4. **Project Issues**: Check the project README.md

## ✅ Success Indicators

You'll know EmailJS is working when:

- ✅ Student inquiry confirmation emails are sent
- ✅ Agent welcome emails are delivered
- ✅ Status update notifications work
- ✅ No console errors related to email sending
- ✅ EmailJS dashboard shows successful sends

---

**Note**: EmailJS has a free tier with 200 emails/month. For production use, consider upgrading to a paid plan. 