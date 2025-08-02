import emailjs from 'emailjs-com';

// Email verification and testing utility
export const verifyEmailSetup = () => {
  console.log('🔍 EmailJS Setup Verification');
  console.log('=============================');
  
  // Check environment variables
  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const userId = process.env.REACT_APP_EMAILJS_USER_ID;
  
  console.log('📧 Environment Variables:');
  console.log('✅ Service ID:', serviceId ? 'Configured' : '❌ Missing');
  console.log('✅ Template ID:', templateId ? 'Configured' : '❌ Missing');
  console.log('✅ User ID:', userId ? 'Configured' : '❌ Missing');
  
  if (!serviceId || !templateId || !userId) {
    console.error('❌ EmailJS credentials are missing!');
    console.log('💡 Please check your .env file and restart the server.');
    return false;
  }
  
  console.log('✅ All EmailJS credentials are configured!');
  return true;
};

export const testEmailSending = async () => {
  console.log('🧪 Testing Email Sending...');
  console.log('==========================');
  
  // Verify setup first
  if (!verifyEmailSetup()) {
    return { success: false, error: 'EmailJS not properly configured' };
  }
  
  try {
    // Initialize EmailJS
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const userId = process.env.REACT_APP_EMAILJS_USER_ID;
    
    emailjs.init(userId);
    
    console.log('📤 Sending test email to bsrsoftbd@gmail.com...');
    
    const testParams = {
      to_email: 'bsrsoftbd@gmail.com',
      to_name: 'BSR Soft BD',
      from_name: 'RNBRIDGE Ltd',
      from_email: 'rnbridge25@gmail.com',
      subject: 'Test Email - RNBRIDGE System Verification',
      message: `
Dear BSR Soft BD,

This is a test email from the RNBRIDGE Ltd Student Admission Management System.

**Test Information:**
- Time: ${new Date().toLocaleString()}
- Purpose: Email system verification
- Recipient: bsrsoftbd@gmail.com
- System: RNBRIDGE Ltd Student Admission Management

**System Features:**
✅ Student inquiry management
✅ Agent referral system  
✅ Admin dashboard
✅ Email notifications
✅ Real-time updates

If you receive this email, the email system is working correctly!

Best regards,
RNBRIDGE Ltd Team
      `.trim()
    };
    
    console.log('📧 Email Parameters:');
    console.log('- To:', testParams.to_email);
    console.log('- Subject:', testParams.subject);
    console.log('- Service ID:', serviceId);
    console.log('- Template ID:', templateId);
    
    const response = await emailjs.send(serviceId, templateId, testParams, userId);
    
    console.log('✅ Email sent successfully!');
    console.log('📨 Response:', response);
    
    return {
      success: true,
      message: 'Test email sent successfully to bsrsoftbd@gmail.com',
      response,
      details: {
        serviceId,
        templateId,
        userId,
        recipient: 'bsrsoftbd@gmail.com'
      }
    };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      code: error.code,
      status: error.status
    });
    
    return {
      success: false,
      error: error.message,
      details: {
        serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
        templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        userId: process.env.REACT_APP_EMAILJS_USER_ID,
        errorCode: error.code,
        errorStatus: error.status
      }
    };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.verifyEmailSetup = verifyEmailSetup;
  window.testEmailSending = testEmailSending;
  console.log('🧪 Email verification functions loaded!');
  console.log('📝 Run: verifyEmailSetup() to check configuration');
  console.log('📝 Run: testEmailSending() to send test email');
} 