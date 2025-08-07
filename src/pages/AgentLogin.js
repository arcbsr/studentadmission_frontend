import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Shield, Users, TrendingUp, ArrowRight, Home, UserPlus } from 'lucide-react';

const AgentLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { companyInfo } = useCompany();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Login successful!');
      navigate('/agent/dashboard');
    } catch (error) {
      // Handle login error with specific messages
      if (error.message && error.message.includes('disabled')) {
        toast.error('Your account has been disabled by the administrator. Please contact the administrator for assistance.');
      } else if (error.message && error.message.includes('blocked')) {
        toast.error('Your account has been blocked. Please contact the administrator for assistance.');
      } else {
        toast.error('Login failed. Please check your credentials.');
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
              <h1 className="text-4xl font-bold mb-4">Agent Portal</h1>
              <p className="text-xl text-primary-100">
                Access your exclusive agent dashboard and manage your student referrals with ease.
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
                  <h3 className="text-lg font-semibold mb-2">Student Management</h3>
                  <p className="text-primary-100">
                    Track all your referred students and their application status in real-time.
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
                  <h3 className="text-lg font-semibold mb-2">Commission Tracking</h3>
                  <p className="text-primary-100">
                    Monitor your earnings and commission rates for successful referrals.
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
                  <h3 className="text-lg font-semibold mb-2">Secure Access</h3>
                  <p className="text-primary-100">
                    Your data is protected with enterprise-grade security and encryption.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white bg-opacity-10 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">Need an Agent Account?</h4>
              <p className="text-primary-100 mb-4">
                {companyInfo.agentRegistrationEnabled 
                  ? 'You can register for an agent account directly or contact our administration team for assistance.'
                  : 'Contact our administration team to set up your agent account and start earning commissions.'
                }
              </p>
              <p className="text-primary-100 mb-4 text-sm">
                If your account has been disabled or you're having login issues, please contact our administrator for assistance.
              </p>
              {companyInfo.agentRegistrationEnabled ? (
                <div className="space-y-3">
                  <Link 
                    to="/agent/register" 
                    className="inline-flex items-center text-white hover:text-primary-100 transition-colors"
                  >
                    <UserPlus size={16} className="mr-2" />
                    Register as Agent
                  </Link>
                  <div className="text-primary-200 text-sm">
                    or
                  </div>
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center text-white hover:text-primary-100 transition-colors"
                  >
                    Contact Admin
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              ) : (
                <Link 
                  to="/contact" 
                  className="inline-flex items-center text-white hover:text-primary-100 transition-colors"
                >
                  Contact Admin
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Shield size={32} className="text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Agent Login</h2>
              <p className="text-gray-600">Access your exclusive agent dashboard</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      {...register('password', { required: 'Password is required' })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Account Blocked Message */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Having trouble logging in?
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          If your account has been disabled, blocked, or you're having login issues, please contact our administrator for assistance.
                        </p>
                      </div>
                      <div className="mt-3">
                        <Link 
                          to="/contact" 
                          className="inline-flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900"
                        >
                          Contact Administrator
                          <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
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
                        Signing in...
                      </div>
                    ) : (
                      'Sign In to Dashboard'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Don't have an agent account?
                  </p>
                  {companyInfo.agentRegistrationEnabled ? (
                    <div className="space-y-3">
                      <Link 
                        to="/agent/register" 
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                      >
                        <UserPlus size={16} className="mr-1" />
                        Register as Agent
                      </Link>
                      <div className="text-gray-400 text-xs">
                        or
                      </div>
                      <Link 
                        to="/contact" 
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                      >
                        Contact Administrator
                        <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  ) : (
                    <Link 
                      to="/contact" 
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      Contact Administrator
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Features */}
            <div className="lg:hidden mt-8 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-600">Student Management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <TrendingUp size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-600">Commission Tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Shield size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-gray-600">Secure Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLogin; 