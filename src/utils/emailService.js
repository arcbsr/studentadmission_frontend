import emailjs from 'emailjs-com';

// Initialize EmailJS with your service ID
// You'll need to replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_USER_ID = process.env.REACT_APP_EMAILJS_USER_ID || 'your_user_id';

// Initialize EmailJS
emailjs.init(EMAILJS_USER_ID);

export const sendEmail = async (templateParams) => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_USER_ID
    );
    return { success: true, data: response };
  } catch (error) {
    console.error('Email sending failed:', error);
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