import emailjs from 'emailjs-com';

// Initialize EmailJS with your service ID
// You'll need to replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_ADMIN_REPLY_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_ADMIN_REPLY_TEMPLATE_ID || 'your_admin_reply_template_id';
const EMAILJS_USER_ID = process.env.REACT_APP_EMAILJS_USER_ID || 'your_user_id';

// Initialize EmailJS
emailjs.init(EMAILJS_USER_ID);

export const sendEmail = async (templateParams, templateId = EMAILJS_TEMPLATE_ID) => {
  try {
    console.log('EmailJS Configuration:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: templateId,
      userId: EMAILJS_USER_ID
    });
    
    console.log('Sending email with params:', {
      templateId,
      to_email: templateParams.to_email,
      to_name: templateParams.to_name,
      subject: templateParams.subject,
      message: templateParams.message?.substring(0, 100) + '...'
    });
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_USER_ID
    );
    console.log('Email sent successfully:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Email sending failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

// Email templates for different scenarios
export const emailTemplates = {
  // Student inquiry confirmation
  studentInquiryConfirmation: (studentData, agentInfo = null) => ({
    to_email: studentData.email,
    to_name: studentData.fullName,
    from_name: 'RNBRIDGE Ltd',
    from_email: 'rnbridge25@gmail.com',
    subject: 'Your Admission Inquiry Received - RNBRIDGE Ltd',
    message: `
Dear ${studentData.fullName},

Thank you for submitting your admission inquiry to RNBRIDGE Ltd. We have received your application and our team will review it shortly.

**Inquiry Details:**
- Name: ${studentData.fullName}
- Email: ${studentData.email}
- Phone: ${studentData.phone}
- Course: ${studentData.course}
- Country: ${studentData.country}
- State: ${studentData.state}
${agentInfo ? `- Referred by: ${agentInfo.name} (${agentInfo.referralKey})` : ''}

**What happens next:**
1. Our team will review your inquiry within 24-48 hours
2. We'll contact you to discuss your academic goals
3. We'll provide guidance on university selection and application process

If you have any questions, please don't hesitate to contact us.

Best regards,
RNBRIDGE Ltd Team
    `.trim()
  }),

  // Agent referral notification
  agentReferralNotification: (agentData, studentData) => ({
    to_email: agentData.email,
    to_name: agentData.name,
    from_name: 'RNBRIDGE Ltd',
    from_email: 'rnbridge25@gmail.com',
    subject: 'New Student Referral - RNBRIDGE Ltd',
    message: `
Dear ${agentData.name},

A new student has been referred using your referral key: ${agentData.referralKey}

**Student Details:**
- Name: ${studentData.fullName}
- Email: ${studentData.email}
- Phone: ${studentData.phone}
- Course: ${studentData.course}
- Country: ${studentData.country}
- State: ${studentData.state}

**Commission Information:**
- Your commission rate: ${agentData.commissionPerReferral || 0}%
- This referral will be tracked in your dashboard

Please log into your agent dashboard to view full details and track the progress of this referral.

Best regards,
RNBRIDGE Ltd Team
    `.trim()
  }),

  // Admin notification for new inquiry
  adminInquiryNotification: (studentData, agentInfo = null) => ({
    to_email: 'rnbridge25@gmail.com', // Admin email
    to_name: 'Admin',
    from_name: 'RNBRIDGE Ltd System',
    from_email: 'rnbridge25@gmail.com',
    subject: 'New Student Inquiry Received',
    message: `
New student inquiry received:

**Student Details:**
- Name: ${studentData.fullName}
- Email: ${studentData.email}
- Phone: ${studentData.phone}
- Course: ${studentData.course}
- Country: ${studentData.country}
- State: ${studentData.state}
- Message: ${studentData.message || 'No additional message'}

${agentInfo ? `
**Agent Information:**
- Agent: ${agentInfo.name}
- Referral Key: ${agentInfo.referralKey}
- Commission Rate: ${agentInfo.commissionPerReferral || 0}%
` : '**Direct Inquiry (No Agent Referral)**'}

Please review this inquiry in the admin dashboard.

Best regards,
RNBRIDGE Ltd System
    `.trim()
  }),

  // Welcome email for new agents
  agentWelcomeEmail: (agentData) => ({
    to_email: agentData.email,
    to_name: agentData.name,
    from_name: 'RNBRIDGE Ltd',
    from_email: 'rnbridge25@gmail.com',
    subject: 'Welcome to RNBRIDGE Ltd - Agent Account Created',
    message: `
Dear ${agentData.name},

Welcome to RNBRIDGE Ltd! Your agent account has been successfully created.

**Your Account Details:**
- Email: ${agentData.email}
- Referral Key: ${agentData.referralKey}
- Commission Rate: ${agentData.commissionPerReferral || 0}%

**Getting Started:**
1. Log into your agent dashboard using your email and password
2. Share your referral key with potential students
3. Track your referrals and commissions in real-time
4. Contact us if you need any assistance

**Important Links:**
- Agent Dashboard: [Your website URL]/agent-dashboard
- Contact Support: admin@rnbridge.com

We're excited to have you as part of our team!

Best regards,
RNBRIDGE Ltd Team
    `.trim()
  }),

  // Status update notification
  statusUpdateNotification: (studentData, newStatus, agentInfo = null) => ({
    to_email: studentData.email,
    to_name: studentData.fullName,
    from_name: 'RNBRIDGE Ltd',
    from_email: 'rnbridge25@gmail.com',
    subject: `Application Status Update - ${newStatus.toUpperCase()}`,
    message: `
Dear ${studentData.fullName},

Your admission inquiry status has been updated to: **${newStatus.toUpperCase()}**

**Application Details:**
- Name: ${studentData.fullName}
- Course: ${studentData.course}
- Current Status: ${newStatus}
${agentInfo ? `- Referred by: ${agentInfo.name}` : ''}

**Next Steps:**
${newStatus === 'admitted' ? `
🎉 Congratulations! Your application has been accepted.
Our team will contact you within 24 hours to discuss the next steps in your admission process.
` : newStatus === 'rejected' ? `
We regret to inform you that your application was not successful at this time.
Our team will contact you to discuss alternative options or reapplication procedures.
` : `
Your application is currently under review.
We will keep you updated on any further developments.
`}

If you have any questions, please don't hesitate to contact us.

Best regards,
RNBRIDGE Ltd Team
    `.trim()
  }),

  // Admin reply to student
  adminReplyToStudent: (studentData, adminMessage) => ({
    to_email: studentData.email,
    to_name: studentData.fullName,
    from_name: 'RNBRIDGE Ltd',
    from_email: 'rnbridge25@gmail.com',
    subject: 'Response to Your Inquiry - RNBRIDGE Ltd',
    message: `
Dear ${studentData.fullName},

Thank you for your inquiry. Here is our response:

**Your Inquiry Details:**
- Name: ${studentData.fullName}
- Email: ${studentData.email}
- Course: ${studentData.courseInterested || 'Not specified'}

**Our Response:**
${adminMessage}

If you have any further questions or need additional information, please don't hesitate to contact us.

Best regards,
RNBRIDGE Ltd Team
    `.trim()
  }),

  // Simple admin reply template (for EmailJS templates that use different parameter names)
  adminReplySimple: (studentData, adminMessage) => ({
    user_email: studentData.email, // Alternative parameter name
    user_name: studentData.fullName,
    reply_message: adminMessage,
    student_name: studentData.fullName,
    student_email: studentData.email,
    course: studentData.courseInterested || 'Not specified'
  })
};

// Helper function to send inquiry confirmation
export const sendInquiryConfirmation = async (studentData, agentInfo = null) => {
  const templateParams = emailTemplates.studentInquiryConfirmation(studentData, agentInfo);
  return await sendEmail(templateParams);
};

// Helper function to send agent referral notification
export const sendAgentReferralNotification = async (agentData, studentData) => {
  const templateParams = emailTemplates.agentReferralNotification(agentData, studentData);
  return await sendEmail(templateParams);
};

// Helper function to send admin notification
export const sendAdminInquiryNotification = async (studentData, agentInfo = null) => {
  const templateParams = emailTemplates.adminInquiryNotification(studentData, agentInfo);
  return await sendEmail(templateParams);
};

// Helper function to send agent welcome email
export const sendAgentWelcomeEmail = async (agentData) => {
  const templateParams = emailTemplates.agentWelcomeEmail(agentData);
  return await sendEmail(templateParams);
};

// Helper function to send status update notification
export const sendStatusUpdateNotification = async (studentData, newStatus, agentInfo = null) => {
  const templateParams = emailTemplates.statusUpdateNotification(studentData, newStatus, agentInfo);
  return await sendEmail(templateParams);
};

// Helper function to send admin reply to student
export const sendAdminReplyToStudent = async (studentData, adminMessage) => {
  const emailSubject = 'Response to Your Inquiry - RNBRIDGE Ltd';
  const emailMessage = `
Dear ${studentData.fullName},

Thank you for your inquiry. Here is our response:

**Your Inquiry Details:**
- Name: ${studentData.fullName}
- Email: ${studentData.email}
- Course: ${studentData.courseInterested || 'Not specified'}

**Our Response:**
${adminMessage}

If you have any further questions or need additional information, please don't hesitate to contact us.

Best regards,
RNBRIDGE Ltd Team
  `.trim();
  
  console.log('Sending admin reply to student:', studentData.email);
  
  // Use direct email function that bypasses template issues
  return await sendDirectEmail(studentData.email, emailSubject, emailMessage);
};

// Test function to debug email configuration
export const testEmailConfiguration = () => {
  console.log('EmailJS Configuration Test:');
  console.log('Service ID:', EMAILJS_SERVICE_ID);
  console.log('Template ID:', EMAILJS_TEMPLATE_ID);
  console.log('Admin Reply Template ID:', EMAILJS_ADMIN_REPLY_TEMPLATE_ID);
  console.log('User ID:', EMAILJS_USER_ID);
  
  const testParams = {
    to_email: 'test@example.com',
    to_name: 'Test User',
    from_name: 'RNBRIDGE Ltd',
    from_email: 'rnbridge25@gmail.com',
    subject: 'Test Email',
    message: 'This is a test email'
  };
  
  console.log('Test email params:', testParams);
  
  return {
    serviceId: EMAILJS_SERVICE_ID,
    templateId: EMAILJS_TEMPLATE_ID,
    adminReplyTemplateId: EMAILJS_ADMIN_REPLY_TEMPLATE_ID,
    userId: EMAILJS_USER_ID,
    testParams
  };
};

// Test function to send a simple email
export const testSendSimpleEmail = async (testEmail = 'test@example.com') => {
  try {
    const testParams = {
      to_email: testEmail,
      to_name: 'Test User',
      from_name: 'RNBRIDGE Ltd',
      from_email: 'rnbridge25@gmail.com',
      subject: 'Test Email from RNBRIDGE',
      message: 'This is a test email to verify EmailJS configuration.',
      user_email: testEmail,
      email: testEmail
    };
    
    console.log('Testing simple email send to:', testEmail);
    const result = await sendEmail(testParams, EMAILJS_TEMPLATE_ID);
    console.log('Simple email test result:', result);
    return result;
  } catch (error) {
    console.error('Simple email test failed:', error);
    return { success: false, error: error.message };
  }
};

// Direct email sending function that bypasses template issues
export const sendDirectEmail = async (toEmail, subject, message) => {
  try {
    // Create a simple email template that should work with any EmailJS setup
    const emailParams = {
      // Standard EmailJS parameters
      to_email: toEmail,
      to_name: 'Student',
      from_name: 'RNBRIDGE Ltd',
      from_email: 'rnbridge25@gmail.com',
      subject: subject,
      message: message,
      
      // Alternative parameter names
      user_email: toEmail,
      user_name: 'Student',
      reply_message: message,
      student_email: toEmail,
      student_name: 'Student',
      
      // Direct parameters
      email: toEmail,
      name: 'Student',
      admin_message: message,
      
      // Additional fallback parameters
      recipient_email: toEmail,
      recipient_name: 'Student',
      email_content: message,
      email_subject: subject
    };
    
    console.log('Sending direct email to:', toEmail);
    console.log('Email parameters:', emailParams);
    
    const result = await sendEmail(emailParams, EMAILJS_TEMPLATE_ID);
    console.log('Direct email result:', result);
    return result;
  } catch (error) {
    console.error('Direct email failed:', error);
    return { success: false, error: error.message };
  }
};

// Function to check EmailJS template configuration
export const checkEmailJSTemplateConfig = () => {
  console.log('🔧 EmailJS Template Configuration Check:');
  console.log('');
  console.log('📋 REQUIRED TEMPLATE PARAMETERS:');
  console.log('To Email: {{to_email}} (NOT hardcoded email)');
  console.log('To Name: {{to_name}}');
  console.log('From Name: {{from_name}}');
  console.log('From Email: {{from_email}}');
  console.log('Subject: {{subject}}');
  console.log('Message: {{message}}');
  console.log('');
  console.log('❌ COMMON PROBLEM:');
  console.log('If "To Email" is set to: rnbridge25@gmail.com');
  console.log('Then emails will ALWAYS go to admin instead of student');
  console.log('');
  console.log('✅ SOLUTION:');
  console.log('1. Go to EmailJS Dashboard > Email Templates');
  console.log('2. Edit your template');
  console.log('3. Change "To Email" from rnbridge25@gmail.com to {{to_email}}');
  console.log('4. Save the template');
  console.log('');
  console.log('🧪 TEST AFTER FIX:');
  console.log('Use "Test Email" button to verify emails go to student');
  
  return {
    message: 'Check console for EmailJS template configuration guide',
    templateParams: ['to_email', 'to_name', 'from_name', 'from_email', 'subject', 'message']
  };
};

// Function to create a new EmailJS template
export const createNewEmailJSTemplate = () => {
  console.log('🆕 CREATE NEW EMAILJS TEMPLATE:');
  console.log('');
  console.log('📝 STEP-BY-STEP GUIDE:');
  console.log('');
  console.log('1. Go to EmailJS Dashboard: https://dashboard.emailjs.com/');
  console.log('2. Click "Email Templates" in the left sidebar');
  console.log('3. Click "Create New Template"');
  console.log('4. Choose your email service (Gmail, etc.)');
  console.log('');
  console.log('📧 TEMPLATE SETTINGS:');
  console.log('Template Name: RNBRIDGE Admin Reply');
  console.log('To Email: {{to_email}} ← IMPORTANT: Use this parameter');
  console.log('To Name: {{to_name}}');
  console.log('From Name: {{from_name}}');
  console.log('From Email: {{from_email}}');
  console.log('Subject: {{subject}}');
  console.log('');
  console.log('📄 EMAIL CONTENT:');
  console.log('{{message}}');
  console.log('');
  console.log('💾 SAVE AND TEST:');
  console.log('1. Save the template');
  console.log('2. Copy the Template ID');
  console.log('3. Update your .env file with the new Template ID');
  console.log('4. Test with "Test Email" button');
  
  return {
    message: 'New template creation guide logged to console',
    steps: ['Create template', 'Use {{to_email}} parameter', 'Save and test']
  };
};

// Function to fix current EmailJS template
export const fixCurrentEmailJSTemplate = () => {
  console.log('🔧 FIX CURRENT EMAILJS TEMPLATE:');
  console.log('');
  console.log('❌ CURRENT PROBLEM:');
  console.log('Your EmailJS template has:');
  console.log('To: rnbridge25@gmail.com (hardcoded)');
  console.log('From: Student <rnbridge25@gmail.com>');
  console.log('Reply-To: bsrsoftbd@gmail.com');
  console.log('');
  console.log('✅ CORRECT SETUP:');
  console.log('To: {{to_email}} (dynamic parameter)');
  console.log('From: RNBRIDGE Ltd <rnbridge25@gmail.com>');
  console.log('Reply-To: rnbridge25@gmail.com');
  console.log('');
  console.log('📝 FIX STEPS:');
  console.log('1. Go to EmailJS Dashboard: https://dashboard.emailjs.com/');
  console.log('2. Click "Email Templates" in left sidebar');
  console.log('3. Find your current template and click "Edit"');
  console.log('4. In the template settings, change:');
  console.log('   - "To Email" from "rnbridge25@gmail.com" to "{{to_email}}"');
  console.log('   - "From Name" from "Student" to "RNBRIDGE Ltd"');
  console.log('   - "Reply-To" from "bsrsoftbd@gmail.com" to "rnbridge25@gmail.com"');
  console.log('5. Save the template');
  console.log('6. Test with "Test Email" button');
  console.log('');
  console.log('🎯 EXPECTED RESULT:');
  console.log('After fix, emails should go to: bsrsoftbd@gmail.com (student)');
  console.log('Instead of: rnbridge25@gmail.com (admin)');
  
  return {
    message: 'Template fix guide logged to console',
    problem: 'Hardcoded "To" email in template',
    solution: 'Use {{to_email}} parameter instead'
  };
}; 