import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database as db } from '../firebase/config';
import { ref, get, push, update, remove } from 'firebase/database';
import { Plus, Edit, Trash2, X, Save, ChevronDown, ChevronUp, HelpCircle, MessageSquare, BookOpen, Globe, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const FAQ = () => {
  const { user, userRole } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const isAdmin = userRole === 'admin' || userRole === 'super-admin';

  // Default FAQs
  const defaultFaqs = [
    {
      id: 'default-1',
      question: 'What services does RNBRIDGE Ltd provide?',
      answer: 'RNBRIDGE Ltd provides comprehensive student admission services including university applications, visa assistance, course guidance, and ongoing support throughout your academic journey.',
      isDefault: true
    },
    {
      id: 'default-2',
      question: 'How do I apply for university admission?',
      answer: 'You can apply by filling out our inquiry form on the website. Simply provide your details, course preferences, and any agent referral code if applicable. Our team will contact you within 24-48 hours.',
      isDefault: true
    },
    {
      id: 'default-3',
      question: 'What documents do I need for admission?',
      answer: 'Required documents typically include academic transcripts, passport copy, English proficiency test results (IELTS/TOEFL), statement of purpose, and letters of recommendation. Specific requirements vary by university.',
      isDefault: true
    },
    {
      id: 'default-4',
      question: 'How much does the admission service cost?',
      answer: 'Our service fees vary depending on the country and university. We offer competitive rates and transparent pricing. Contact us for a detailed quote based on your specific requirements.',
      isDefault: true
    },
    {
      id: 'default-5',
      question: 'How long does the admission process take?',
      answer: 'The admission process typically takes 4-8 weeks from application submission to receiving an offer letter. Processing times may vary depending on the university and country.',
      isDefault: true
    },
    {
      id: 'default-6',
      question: 'Do you provide visa assistance?',
      answer: 'Yes, we provide comprehensive visa assistance including document preparation, application guidance, interview preparation, and ongoing support until visa approval.',
      isDefault: true
    },
    {
      id: 'default-7',
      question: 'Which countries do you work with?',
      answer: 'We work with universities in the UK, USA, Canada, Australia, New Zealand, Germany, and many other countries. Contact us for specific country information.',
      isDefault: true
    },
    {
      id: 'default-8',
      question: 'How can I become an agent for RNBRIDGE Ltd?',
      answer: 'Agent applications are managed by our admin team. Contact us directly to express your interest in becoming an agent, and we will guide you through the application process.',
      isDefault: true
    }
  ];

  useEffect(() => {
    loadFaqs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const faqsRef = ref(db, 'faqs');
      const snapshot = await get(faqsRef);
      
      if (snapshot.exists()) {
        const faqsData = snapshot.val();
        const faqsArray = Object.keys(faqsData).map(key => ({
          id: key,
          ...faqsData[key]
        }));
        setFaqs([...defaultFaqs, ...faqsArray]);
      } else {
        // Initialize with default FAQs if no FAQs exist
        await initializeDefaultFaqs();
        setFaqs(defaultFaqs);
      }
    } catch (error) {
      // Handle FAQ loading error silently
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultFaqs = async () => {
    try {
      const faqsRef = ref(db, 'faqs');
      for (const faq of defaultFaqs) {
        await push(faqsRef, {
          question: faq.question,
          answer: faq.answer,
          isDefault: true,
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      // Handle FAQ initialization error silently
    }
  };

  const toggleFaq = (faqId) => {
    const newExpanded = new Set(expandedFaqs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFaqs(newExpanded);
  };

  const handleAddFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    try {
      const faqsRef = ref(db, 'faqs');
      const newFaqRef = await push(faqsRef, {
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
        isDefault: false,
        createdAt: new Date().toISOString(),
        createdBy: user.email
      });

      const addedFaq = {
        id: newFaqRef.key,
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
        isDefault: false,
        createdAt: new Date().toISOString(),
        createdBy: user.email
      };

      setFaqs(prev => [...prev, addedFaq]);
      setNewFaq({ question: '', answer: '' });
      setIsAdding(false);
      toast.success('FAQ added successfully');
    } catch (error) {
      // Handle FAQ adding error silently
      toast.error('Failed to add FAQ');
    }
  };

  const handleEditFaq = async (faq) => {
    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    try {
      const faqRef = ref(db, `faqs/${faq.id}`);
      await update(faqRef, {
        question: editingFaq.question.trim(),
        answer: editingFaq.answer.trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: user.email
      });

      setFaqs(prev => prev.map(f => 
        f.id === faq.id 
          ? { ...f, question: editingFaq.question.trim(), answer: editingFaq.answer.trim() }
          : f
      ));
      setEditingFaq(null);
      toast.success('FAQ updated successfully');
    } catch (error) {
      // Handle FAQ updating error silently
      toast.error('Failed to update FAQ');
    }
  };

  const handleDeleteFaq = async (faq) => {
    if (faq.isDefault) {
      toast.error('Cannot delete default FAQs');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      const faqRef = ref(db, `faqs/${faq.id}`);
      await remove(faqRef);

      setFaqs(prev => prev.filter(f => f.id !== faq.id));
      toast.success('FAQ deleted successfully');
    } catch (error) {
      // Handle FAQ deleting error silently
      toast.error('Failed to delete FAQ');
    }
  };

  const startEditing = (faq) => {
    setEditingFaq({ ...faq });
  };

  const cancelEditing = () => {
    setEditingFaq(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading FAQs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our student admission services, 
            application process, and how we can help you achieve your academic goals.
          </p>
          
          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">{faqs.length} Questions</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">Global Support</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Trusted Service</span>
            </div>
          </div>
        </div>

        {/* Enhanced Admin Controls */}
        {isAdmin && (
          <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Manage FAQs</h2>
                <p className="text-gray-600">Add, edit, or remove frequently asked questions</p>
              </div>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="btn-primary flex items-center gap-2 px-6 py-3 text-lg"
                >
                  <Plus size={20} />
                  Add New FAQ
                </button>
              )}
            </div>

            {/* Enhanced Add New FAQ Form */}
            {isAdding && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Question *
                    </label>
                    <textarea
                      value={newFaq.question}
                      onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                      className="input-field w-full text-base"
                      rows="3"
                      placeholder="Enter a clear and specific question..."
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Answer *
                    </label>
                    <textarea
                      value={newFaq.answer}
                      onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                      className="input-field w-full text-base"
                      rows="6"
                      placeholder="Provide a comprehensive and helpful answer..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddFaq}
                                              className="btn-primary flex items-center gap-2 px-6 py-2 text-base"
                      >
                        <Save size={18} />
                        Save FAQ
                      </button>
                      <button
                        onClick={() => {
                          setIsAdding(false);
                          setNewFaq({ question: '', answer: '' });
                        }}
                        className="btn-secondary flex items-center gap-2 px-6 py-2 text-base"
                      >
                        <X size={18} />
                        Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced FAQs List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              {/* FAQ Header */}
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {editingFaq?.id === faq.id ? (
                                <textarea
                                  value={editingFaq.question}
                                  onChange={(e) => setEditingFaq(prev => ({ ...prev, question: e.target.value }))}
                                  className="input-field w-full text-base"
                                  rows="2"
                                />
                              ) : (
                                faq.question
                              )}
                            </h3>
                      </div>
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="text-gray-400 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-primary-50"
                      >
                        {expandedFaqs.has(faq.id) ? (
                          <ChevronUp size={24} />
                        ) : (
                          <ChevronDown size={24} />
                        )}
                      </button>
                    </div>

                    {/* Enhanced Admin Actions */}
                    {isAdmin && !editingFaq && (
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => startEditing(faq)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        {!faq.isDefault && (
                          <button
                            onClick={() => handleDeleteFaq(faq)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        )}
                        {faq.isDefault && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                            Default FAQ
                          </span>
                        )}
                      </div>
                    )}

                    {/* Enhanced Edit Actions */}
                    {isAdmin && editingFaq?.id === faq.id && (
                      <div className="flex items-center gap-3 mt-4">
                                                      <button
                                onClick={() => handleEditFaq(faq)}
                                className="btn-primary text-xs flex items-center gap-2 px-3 py-1"
                              >
                                <Save size={14} />
                                Save Changes
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="btn-secondary text-xs flex items-center gap-2 px-3 py-1"
                              >
                                <X size={14} />
                                Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced FAQ Answer */}
                {expandedFaqs.has(faq.id) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                                              {editingFaq?.id === faq.id ? (
                            <textarea
                              value={editingFaq.answer}
                              onChange={(e) => setEditingFaq(prev => ({ ...prev, answer: e.target.value }))}
                              className="input-field w-full text-base"
                              rows="6"
                            />
                          ) : (
                            <div className="prose prose-gray max-w-none">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {faqs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs Available</h3>
            <p className="text-gray-600">No frequently asked questions have been added yet.</p>
          </div>
        )}

        {/* Enhanced Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-2xl shadow-lg border border-primary-100 p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <MessageSquare className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help you with any questions about our services.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                              <a
                  href="/contact"
                  className="btn-primary text-base px-6 py-3 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact Us
                </a>
                <a
                  href="/inquiry"
                  className="btn-secondary text-base px-6 py-3 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Submit Inquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 