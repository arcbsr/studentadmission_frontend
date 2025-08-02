// Quick Email Test Function
// Run this in browser console to test email functionality

export const quickEmailTest = async () => {
  try {
    console.log('🧪 Starting quick email test...');
    
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
      console.error('❌ EmailJS not loaded');
      return { success: false, error: 'EmailJS not loaded' };
    }

    // Check environment variables
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const userId = process.env.REACT_APP_EMAILJS_USER_ID;

    console.log('📧 Configuration:');
    console.log('- Service ID:', serviceId);
    console.log('- Template ID:', templateId);
    console.log('- User ID:', userId);

    if (!serviceId || !templateId || !userId) {
      console.error('❌ EmailJS credentials not configured');
      return { 
        success: false, 
        error: 'EmailJS credentials not configured. Please set up your .env file.' 
      };
    }

    // Test email parameters
    const testParams = {
      to_email: 'bsrsoftbd@gmail.com',
      to_name: 'BSR Soft BD',
      from_name: 'RNBRIDGE Ltd',
      from_email: 'rnbridge25@gmail.com',
      subject: 'Quick Test Email - RNBRIDGE System',
      message: `
Hello BSR Soft BD,

This is a quick test email from the RNBRIDGE Ltd Student Admission Management System.

**Test Details:**
- Time: ${new Date().toLocaleString()}
- Purpose: Testing email functionality
- System: RNBRIDGE Ltd Student Admission Management

If you receive this email, the email system is working correctly!

Best regards,
RNBRIDGE Ltd Team
      `.trim()
    };

    console.log('📤 Sending test email...');
    
    // eslint-disable-next-line no-undef
    const response = await emailjs.send(serviceId, templateId, testParams, userId);
    
    console.log('✅ Email sent successfully!');
    console.log('📨 Response:', response);
    
    return { 
      success: true, 
      message: 'Test email sent successfully to bsrsoftbd@gmail.com',
      response 
    };
  } catch (error) {
    console.error('❌ Email test failed:', error);
    return { 
      success: false, 
      error: error.message,
      details: {
        serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
        templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        userId: process.env.REACT_APP_EMAILJS_USER_ID
      }
    };
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  window.quickEmailTest = quickEmailTest;
  console.log('🧪 Quick email test function loaded. Run: quickEmailTest()');
} 