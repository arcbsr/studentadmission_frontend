import { database as db } from '../firebase/config';
import { ref, get, push } from 'firebase/database';

// Default FAQs for RNBRIDGE Ltd
const defaultFaqs = [
  {
    question: 'What services does RNBRIDGE Ltd provide?',
    answer: 'RNBRIDGE Ltd provides comprehensive student admission services including university applications, visa assistance, course guidance, and ongoing support throughout your academic journey.',
    isDefault: true
  },
  {
    question: 'How do I apply for university admission?',
    answer: 'You can apply by filling out our inquiry form on the website. Simply provide your details, course preferences, and any agent referral code if applicable. Our team will contact you within 24-48 hours.',
    isDefault: true
  },
  {
    question: 'What documents do I need for admission?',
    answer: 'Required documents typically include academic transcripts, passport copy, English proficiency test results (IELTS/TOEFL), statement of purpose, and letters of recommendation. Specific requirements vary by university.',
    isDefault: true
  },
  {
    question: 'How much does the admission service cost?',
    answer: 'Our service fees vary depending on the country and university. We offer competitive rates and transparent pricing. Contact us for a detailed quote based on your specific requirements.',
    isDefault: true
  },
  {
    question: 'How long does the admission process take?',
    answer: 'The admission process typically takes 4-8 weeks from application submission to receiving an offer letter. Processing times may vary depending on the university and country.',
    isDefault: true
  },
  {
    question: 'Do you provide visa assistance?',
    answer: 'Yes, we provide comprehensive visa assistance including document preparation, application guidance, interview preparation, and ongoing support until visa approval.',
    isDefault: true
  },
  {
    question: 'Which countries do you work with?',
    answer: 'We work with universities in the UK, USA, Canada, Australia, New Zealand, Germany, and many other countries. Contact us for specific country information.',
    isDefault: true
  },
  {
    question: 'How can I become an agent for RNBRIDGE Ltd?',
    answer: 'Agent applications are managed by our admin team. Contact us directly to express your interest in becoming an agent, and we will guide you through the application process.',
    isDefault: true
  }
];

export const initializeDefaultFaqs = async () => {
  try {
    console.log('Initializing default FAQs...');
    
    const faqsRef = ref(db, 'faqs');
    const snapshot = await get(faqsRef);
    
    if (snapshot.exists()) {
      console.log('FAQs already exist in database');
      return {
        success: true,
        message: 'FAQs already initialized'
      };
    }

    // Add default FAQs to database
    for (const faq of defaultFaqs) {
      await push(faqsRef, {
        ...faq,
        createdAt: new Date().toISOString()
      });
    }

    console.log('Default FAQs initialized successfully');
    return {
      success: true,
      message: 'Default FAQs initialized successfully'
    };
  } catch (error) {
    console.error('Error initializing default FAQs:', error);
    return {
      success: false,
      message: `Failed to initialize FAQs: ${error.message}`
    };
  }
};

export const checkFaqsExist = async () => {
  try {
    const faqsRef = ref(db, 'faqs');
    const snapshot = await get(faqsRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking FAQs:', error);
    return false;
  }
}; 