import React from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

const Contact = () => {
  const { companyInfo } = useCompany();

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: companyInfo.email,
      link: `mailto:${companyInfo.email}`,
      description: "Send us an email anytime"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "WhatsApp",
      value: companyInfo.whatsapp,
      link: `https://wa.me/${companyInfo.whatsapp.replace('+', '')}`,
      description: "Chat with us on WhatsApp"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: companyInfo.location,
      link: null,
      description: "Visit our office"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      value: "Mon - Fri: 9:00 AM - 6:00 PM",
      link: null,
      description: "We're here to help"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Ready to start your international education journey? Contact us today 
            and let's make your dreams a reality.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Information
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help you with all your international education needs. 
              Reach out to us through any of the following channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                {method.link ? (
                  <a
                    href={method.link}
                    className="text-primary-600 hover:text-primary-700 font-medium block mb-2"
                  >
                    {method.value}
                  </a>
                ) : (
                  <p className="text-gray-900 font-medium mb-2">
                    {method.value}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="card">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select className="input-field" required>
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="admission">Admission Information</option>
                  <option value="visa">Visa Assistance</option>
                  <option value="university">University Selection</option>
                  <option value="agent">Agent Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  rows="6"
                  className="input-field"
                  placeholder="Tell us about your inquiry..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary text-lg px-8 py-3 flex items-center"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about our services and processes.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does the application process take?
              </h3>
              <p className="text-gray-600">
                The application process typically takes 4-8 weeks, depending on the university 
                and program. We'll guide you through each step to ensure a smooth process.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you charge for consultation services?
              </h3>
              <p className="text-gray-600">
                We offer free initial consultations to understand your needs and provide 
                personalized guidance. Some specialized services may have associated fees.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Which countries do you work with?
              </h3>
              <p className="text-gray-600">
                We have partnerships with universities in the UK, USA, Canada, Australia, 
                New Zealand, Germany, and many other countries. Contact us for specific details.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What documents do I need to apply?
              </h3>
              <p className="text-gray-600">
                Requirements vary by university and program, but typically include academic 
                transcripts, English proficiency test scores, personal statement, and references.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you help with visa applications?
              </h3>
              <p className="text-gray-600">
                Yes, we provide comprehensive visa application support including document 
                preparation, application guidance, and interview preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Don't wait any longer. Contact us today and take the first step towards 
            your international education dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/inquiry"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Submit Inquiry
            </a>
            <a 
              href={`https://wa.me/${companyInfo.whatsapp.replace('+', '')}`}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              WhatsApp Chat
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 