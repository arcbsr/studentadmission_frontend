import emailjs from 'emailjs-com';

// Initialize EmailJS with your service ID
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_USER_ID = process.env.REACT_APP_EMAILJS_USER_ID || 'your_user_id';

// Initialize EmailJS
emailjs.init(EMAILJS_USER_ID);

export const testEmailSending = async () => {
  try {
    console.log('🧪 Testing email sending...');
    console.log('📧 Service ID:', EMAILJS_SERVICE_ID);
    console.log('📝 Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('👤 User ID:', EMAILJS_USER_ID);

    const testParams = {
      to_email: 'bsrsoftbd@gmail.com',
      to_name: 'BSR Soft BD',
      from_name: 'RNBRIDGE Ltd',
      from_email: 'rnbridge25@gmail.com',
      subject: 'Test Email from RNBRIDGE Ltd System',
      message: `
Dear BSR Soft BD,

This is a test email from the RNBRIDGE Ltd Student Admission Management System.

**Test Details:**
- Sent from: RNBRIDGE Ltd System
- Date: ${new Date().toLocaleString()}
- Purpose: Testing email functionality
- Recipient: bsrsoftbd@gmail.com

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

    console.log('📤 Sending test email...');
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      testParams,
      EMAILJS_USER_ID
    );

    console.log('✅ Email sent successfully!');
    console.log('📨 Response:', response);
    
    return { 
      success: true, 
      message: 'Test email sent successfully to bsrsoftbd@gmail.com',
      response 
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { 
      success: false, 
      error: error.message,
      details: {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        userId: EMAILJS_USER_ID
      }
    };
  }
};

export const testInquiryEmail = async () => {
  try {
    console.log('🧪 Testing inquiry email...');
    
      // eslint-disable-next-line no-unused-vars
  const testStudentData = {
    fullName: 'Test Student',
    email: 'bsrsoftbd@gmail.com',
    phone: '+8801234567890',
    course: 'Computer Science',
    country: 'Bangladesh',
    state: 'Dhaka',
    message: 'This is a test inquiry for email functionality testing.'
  };

  // eslint-disable-next-line no-unused-vars
  const testAgentInfo = {
    name: 'Test Agent',
    email: 'testagent@example.com',
    referralKey: 'AGT-RNB1234',
    commissionPerReferral: 10
  };

    const testParams = {
      to_email: 'bsrsoftbd@gmail.com',
      to_name: 'Test Student',
      from_name: 'RNBRIDGE Ltd',
      from_email: 'rnbridge25@gmail.com',
      subject: 'Test Student Inquiry Confirmation - RNBRIDGE Ltd',
      message: `
Dear Test Student,

Thank you for submitting your admission inquiry to RNBRIDGE Ltd. We have received your application and our team will review it shortly.

**Inquiry Details:**
- Name: Test Student
- Email: bsrsoftbd@gmail.com
- Phone: +8801234567890
- Course: Computer Science
- Country: Bangladesh
- State: Dhaka
- Referred by: Test Agent (AGT-RNB1234)

**What happens next:**
1. Our team will review your inquiry within 24-48 hours
2. We'll contact you to discuss your academic goals
3. We'll provide guidance on university selection and application process

This is a test email to verify the email system is working correctly.

Best regards,
RNBRIDGE Ltd Team
      `.trim()
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      testParams,
      EMAILJS_USER_ID
    );

    console.log('✅ Inquiry test email sent successfully!');
    return { 
      success: true, 
      message: 'Test inquiry email sent successfully to bsrsoftbd@gmail.com',
      response 
    };
  } catch (error) {
    console.error('❌ Inquiry test email failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}; 