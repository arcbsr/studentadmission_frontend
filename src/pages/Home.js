import React from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';
import { GraduationCap, Globe, Users, Award, ArrowRight, CheckCircle, Shield, TrendingUp } from 'lucide-react';
import { useNavigationWithScroll } from '../utils/navigation';

const Home = () => {
  const { companyInfo } = useCompany();
  const { navigateWithScroll } = useNavigationWithScroll();

  const handleApplyNow = () => {
    navigateWithScroll('/inquiry');
  };

  const handleExploreUniversities = () => {
    navigateWithScroll('/universities');
  };

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Top Universities",
      description: "Access to prestigious universities worldwide with comprehensive course offerings."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Opportunities",
      description: "Study abroad programs in multiple countries with expert guidance."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Support",
      description: "Dedicated counselors and agents to guide you through the entire process."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Proven Success",
      description: "Thousands of successful student placements with high satisfaction rates."
    }
  ];

  const benefits = [
    "Free consultation and guidance",
    "Visa application assistance",
    "Accommodation support",
    "Pre-departure orientation",
    "24/7 student support",
    "Post-arrival assistance"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Gateway to
                <span className="block text-primary-200">Global Education</span>
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                {companyInfo.name} connects ambitious students with world-class universities. 
                Start your international academic journey with expert guidance and comprehensive support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleApplyNow}
                  className="btn-primary text-lg px-8 py-3 inline-flex items-center"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button 
                  onClick={handleExploreUniversities}
                  className="btn-secondary text-lg px-8 py-3"
                >
                  Explore Universities
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">📧</span>
                    </div>
                    <div>
                      <p className="text-sm text-primary-200">Email</p>
                      <p className="font-semibold">{companyInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">📱</span>
                    </div>
                    <div>
                      <p className="text-sm text-primary-200">WhatsApp</p>
                      <p className="font-semibold">{companyInfo.whatsapp}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">📍</span>
                    </div>
                    <div>
                      <p className="text-sm text-primary-200">Location</p>
                      <p className="font-semibold">{companyInfo.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose {companyInfo.name}?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive support throughout your international education journey, 
              from initial consultation to post-arrival assistance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Comprehensive Student Support
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our dedicated team ensures you have everything you need for a successful 
                international education experience.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-600 mb-6">
                Fill out our inquiry form and our experts will get back to you within 24 hours 
                with personalized guidance.
              </p>
              <Link to="/inquiry" className="btn-primary w-full text-center">
                Submit Your Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Portal Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Are You an Agent?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Access your exclusive agent dashboard to manage student referrals, track commissions, 
                and grow your business with {companyInfo.name}.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-700">Manage student referrals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-700">Track commissions and earnings</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-700">Secure access to your dashboard</span>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  to="/agent/login" 
                  className="inline-flex items-center bg-primary-600 text-white hover:bg-primary-700 font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Agent Login
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Agent Benefits
                </h3>
                <p className="text-gray-600 mb-6">
                  Join our network of successful agents and start earning commissions while helping students achieve their dreams.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Competitive commission rates</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Real-time tracking system</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Dedicated support team</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Marketing materials provided</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your International Education Journey Today
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of successful students who have achieved their dreams with {companyInfo.name}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inquiry" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
              Apply Now
            </Link>
            <Link to="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 