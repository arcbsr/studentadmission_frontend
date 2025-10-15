import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { database } from '../firebase/config';
import { ref, set, get } from 'firebase/database';
import { useCompany } from '../contexts/CompanyContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Home, Users, TrendingUp, Shield, Mail, Phone, MapPin, User, Lock, ArrowRight } from 'lucide-react';

const AgentRegistration = () => {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { companyInfo } = useCompany();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  // Generate unique referral key
  const generateUniqueReferralKey = async () => {
    const prefix = 'AGT';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      const randomNum = Math.floor(Math.random() * 900000) + 100000;
      const currentReferralKey = `${prefix}${randomNum}`;
      
      // Check if this referral key already exists
      const agentsRef = ref(database, 'agents');
      const agentsSnapshot = await get(agentsRef);
      
      if (agentsSnapshot.exists()) {
        const agents = agentsSnapshot.val();
        const existingAgent = Object.values(agents).find(agent => agent.referralKey === currentReferralKey);
        if (!existingAgent) {
          isUnique = true;
          return currentReferralKey;
        }
      } else {
        isUnique = true;
        return currentReferralKey;
      }
      
      attempts++;
    }

    throw new Error('Unable to generate unique referral key. Please try again.');
  };

  const onSubmit = async (data) => {
    if (!companyInfo.agentRegistrationEnabled) {
      toast.error(companyInfo.agentRegistrationMessage || 'Agent registration is currently disabled.');
      return;
    }

    setLoading(true);
    try {
      // Generate unique referral key
      const referralKey = await generateUniqueReferralKey();
      
      // Create Firebase Auth account
      const userCredential = await signup(data.email, data.password, 'agent', {
        name: data.name,
        phone: data.phone,
        country: data.country,
        address: data.address,
        referralKey: referralKey,
        commissionPerReferral: companyInfo.agentDefaultCommission,
        isActive: companyInfo.agentRegistrationRequiresApproval ? false : true, // Requires approval if enabled
        needsApproval: companyInfo.agentRegistrationRequiresApproval,
        createdAt: Date.now()
      });

      // Create agent entry in agents table
      const agentData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        address: data.address,
        referralKey: referralKey,
        commissionPerReferral: companyInfo.agentDefaultCommission,
        totalReferrals: 0,
        isActive: companyInfo.agentRegistrationRequiresApproval ? false : true,
        needsApproval: companyInfo.agentRegistrationRequiresApproval,
        uid: userCredential.user.uid,
        createdAt: Date.now()
      };

      await set(ref(database, `agents/${userCredential.user.uid}`), agentData);

      if (companyInfo.agentRegistrationRequiresApproval) {
        toast.success(`Registration submitted successfully! Your referral key is: ${referralKey}. Your account will be reviewed by an administrator.`);
        navigate('/agent/login');
      } else {
        toast.success(`Registration successful! Your referral key is: ${referralKey}. You can now login to your dashboard.`);
        navigate('/agent/login');
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already exists. Please use a different email or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please use a stronger password.');
      } else if (error.message.includes('referral key')) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <Home size={24} />
              <span className="text-lg font-semibold">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-700 text-white p-12">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Become an Agent</h1>
              <p className="text-xl text-primary-100">
                Join our network of education agents and start earning commissions by helping students find their perfect university.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Users size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Student Referrals</h3>
                  <p className="text-primary-100">
                    Help students find the right university and earn commissions for successful placements.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Commission Earnings</h3>
                  <p className="text-primary-100">
                    Earn competitive commissions for every successful student placement you facilitate.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Shield size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Professional Support</h3>
                  <p className="text-primary-100">
                    Get access to our comprehensive university database and professional support team.
                  </p>
                </div>
              </div>
            </div>

            {companyInfo.agentRegistrationRequiresApproval && (
              <div className="mt-12 p-6 bg-white bg-opacity-10 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Approval Process</h4>
                <p className="text-primary-100 mb-4">
                  Your registration will be reviewed by our administration team. You'll receive an email once your account is approved.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Agent Registration</h2>
              <p className="text-gray-600">Join our network of education agents</p>
            </div>

            {!companyInfo.agentRegistrationEnabled ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <Shield size={32} className="text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Registration Disabled</h3>
                  <p className="text-gray-600 mb-6">
                    {companyInfo.agentRegistrationMessage}
                  </p>
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Contact Administrator
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        {...register('name', { required: 'Full name is required' })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        {...register('country', { required: 'Country is required' })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Enter your country"
                      />
                    </div>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      {...register('address')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter your address (optional)"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Create a password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        {...register('confirmPassword', { 
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Confirm your password"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        'Create Agent Account'
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Already have an agent account?
                    </p>
                    <Link 
                      to="/agent/login" 
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      Sign In to Dashboard
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Features */}
            <div className="lg:hidden mt-8 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-600">Student Referrals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <TrendingUp size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-600">Commission Earnings</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Shield size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-600">Professional Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentRegistration; 