import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { database } from '../firebase/config';
import { ref, push, get, update } from 'firebase/database';
import { User, MessageSquare, BookOpen } from 'lucide-react';


const InquiryForm = () => {
  const [loading, setLoading] = useState(false);
  const [agentInfo, setAgentInfo] = useState(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const agentReferralKey = watch('agentReferralKey');

  // Check agent referral key
  React.useEffect(() => {
    const checkAgentKey = async () => {
      if (agentReferralKey && agentReferralKey.length >= 3) {
        try {
          const agentsRef = ref(database, 'agents');
          const snapshot = await get(agentsRef);
          if (snapshot.exists()) {
            const agents = snapshot.val();
            const agent = Object.values(agents).find(
              agent => agent.referralKey === agentReferralKey
            );
            if (agent) {
              setAgentInfo(agent);
            } else {
              setAgentInfo(null);
            }
          }
        } catch (error) {
          console.error('Error checking agent key:', error);
        }
      } else {
        setAgentInfo(null);
      }
    };

    checkAgentKey();
  }, [agentReferralKey]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Check if inquiry with same email already exists
      const inquiriesRef = ref(database, 'inquiries');
      const snapshot = await get(inquiriesRef);
      let existingInquiryId = null;
      
      if (snapshot.exists()) {
        const inquiries = snapshot.val();
        const existingInquiry = Object.entries(inquiries).find(([id, inquiry]) => 
          inquiry.email === data.email
        );
        if (existingInquiry) {
          existingInquiryId = existingInquiry[0];
        }
      }

      const newMessage = {
        message: data.message || 'No message provided',
        courseInterested: data.courseInterested,
        agentReferralKey: data.agentReferralKey || null,
        agentInfo: agentInfo ? {
          name: agentInfo.name,
          email: agentInfo.email,
          referralKey: agentInfo.referralKey
        } : null,
        submittedAt: Date.now()
      };

      if (existingInquiryId) {
        // Update existing inquiry with new message
        const existingInquiryRef = ref(database, `inquiries/${existingInquiryId}`);
        const existingSnapshot = await get(existingInquiryRef);
        const existingData = existingSnapshot.val();
        
        const updatedMessages = existingData.messages || [];
        updatedMessages.push(newMessage);
        
        await update(existingInquiryRef, {
          ...existingData,
          messages: updatedMessages,
          updatedAt: Date.now(),
          lastMessageAt: Date.now()
        });
      } else {
        // Create new inquiry
        const inquiryData = {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          country: data.country,
          state: data.state,
          messages: [newMessage],
          status: 'pending',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastMessageAt: Date.now()
        };

        await push(ref(database, 'inquiries'), inquiryData);
      }
      
      toast.success('Your inquiry has been submitted successfully! We will contact you soon.');
      reset();
      navigate('/');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const courses = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Medicine",
    "Law",
    "Arts & Humanities",
    "Social Sciences",
    "Natural Sciences",
    "Education",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Submit Your Admission Inquiry
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your academic goals and we'll help you find the perfect university match.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Full name is required' })}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    {...register('country', { required: 'Country is required' })}
                    className="input-field"
                    placeholder="Enter your country"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className="input-field"
                    placeholder="Enter your state/province"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className="input-field"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Academic Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Interested In *
                </label>
                <select
                  {...register('courseInterested', { required: 'Please select a course' })}
                  className="input-field"
                >
                  <option value="">Select a course</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </select>
                {errors.courseInterested && (
                  <p className="text-red-500 text-sm mt-1">{errors.courseInterested.message}</p>
                )}
              </div>
            </div>

            {/* Agent Referral */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Agent Referral (Optional)
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Referral Key
                </label>
                <input
                  type="text"
                  {...register('agentReferralKey')}
                  className="input-field"
                  placeholder="Enter agent referral key (e.g., AGT-RNB001)"
                />
                {agentInfo && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      ✓ Valid agent referral: {agentInfo.name} ({agentInfo.email})
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Message */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Additional Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  {...register('message')}
                  rows="4"
                  className="input-field"
                  placeholder="Tell us more about your academic goals, preferred countries, or any specific requirements..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm; 