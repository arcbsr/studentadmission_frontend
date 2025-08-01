import React from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { GraduationCap, Globe, Users, Award, CheckCircle } from 'lucide-react';

const About = () => {
  const { companyInfo } = useCompany();

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Expert Guidance",
      description: "Our experienced counselors provide personalized guidance to help you choose the right university and course."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Network",
      description: "Partnerships with top universities worldwide to provide you with the best educational opportunities."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Dedicated Support",
      description: "Comprehensive support throughout your entire journey, from application to post-arrival assistance."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Proven Success",
      description: "Thousands of successful student placements with high satisfaction rates and positive outcomes."
    }
  ];

  const values = [
    "Excellence in Education",
    "Student-Centric Approach",
    "Transparency & Trust",
    "Innovation & Growth",
    "Global Perspective",
    "Continuous Support"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About {companyInfo.name}
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Your trusted partner in international education, connecting ambitious students 
            with world-class universities and opportunities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At {companyInfo.name}, we believe that education has the power to transform lives 
                and create opportunities for growth and success. Our mission is to bridge the gap 
                between ambitious students and their dream universities worldwide.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We provide comprehensive support services that go beyond just university applications. 
                From initial consultation to post-arrival assistance, we ensure that every student 
                receives the guidance and support they need to succeed in their international education journey.
              </p>
              <p className="text-lg text-gray-600">
                Our commitment to excellence, transparency, and student success has made us a trusted 
                partner for thousands of students and their families.
              </p>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
              <div className="space-y-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive services designed to make your international education journey 
              smooth, successful, and rewarding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
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

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial consultation to post-arrival support, we provide comprehensive 
              services to ensure your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">University Selection</h3>
              <p className="text-gray-600 mb-4">
                Expert guidance in choosing the right university based on your academic goals, 
                budget, and preferences.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Course and program analysis</li>
                <li>• University ranking and reputation</li>
                <li>• Cost and scholarship opportunities</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Application Support</h3>
              <p className="text-gray-600 mb-4">
                Complete assistance with university applications, document preparation, 
                and submission processes.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Document preparation and verification</li>
                <li>• Application form assistance</li>
                <li>• Statement of purpose guidance</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Visa Assistance</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive visa application support including documentation, 
                interview preparation, and follow-up.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Visa application guidance</li>
                <li>• Document checklist preparation</li>
                <li>• Interview preparation support</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pre-Departure Support</h3>
              <p className="text-gray-600 mb-4">
                Essential guidance and preparation for your journey to your new university.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Travel arrangements guidance</li>
                <li>• Accommodation assistance</li>
                <li>• Cultural orientation</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Post-Arrival Support</h3>
              <p className="text-gray-600 mb-4">
                Ongoing support after you arrive at your university to ensure a smooth transition.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Airport pickup coordination</li>
                <li>• Local orientation assistance</li>
                <li>• Ongoing academic support</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600 mb-4">
                Round-the-clock support to address any concerns or questions you may have.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Emergency assistance</li>
                <li>• Academic counseling</li>
                <li>• Personal support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Contact us today to begin your international education adventure with {companyInfo.name}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`mailto:${companyInfo.email}`}
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Email Us
            </a>
            <a 
              href={`https://wa.me/${companyInfo.whatsapp.replace('+', '')}`}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 