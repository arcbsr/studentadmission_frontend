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
    <div className="min-h-screen home-theme home-section-light">
      {/* Hero Section */}
      <section className="home-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About {companyInfo.name}
          </h1>
          <p className="text-xl md:text-2xl home-muted-text max-w-3xl mx-auto">
            Your trusted partner in international education, connecting ambitious students 
            with world-class universities and opportunities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 home-section-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold home-title-dark mb-6">
                Our Mission
              </h2>
              <p className="text-lg home-text-dark mb-6">
                At {companyInfo.name}, we believe that education has the power to transform lives 
                and create opportunities for growth and success. Our mission is to bridge the gap 
                between ambitious students and their dream universities worldwide.
              </p>
              <p className="text-lg home-text-dark mb-6">
                We provide comprehensive support services that go beyond just university applications. 
                From initial consultation to post-arrival assistance, we ensure that every student 
                receives the guidance and support they need to succeed in their international education journey.
              </p>
              <p className="text-lg home-text-dark">
                Our commitment to excellence, transparency, and student success has made us a trusted 
                partner for thousands of students and their families.
              </p>
            </div>
            <div className="home-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold home-title-dark mb-6">Why Choose Us?</h3>
              <div className="space-y-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" style={{color: 'var(--color-crimson-red)'}} />
                    <span className="home-text-dark">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 home-section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold home-title-dark mb-4">
              What We Offer
            </h2>
            <p className="text-xl home-text-dark max-w-3xl mx-auto">
              Comprehensive services designed to make your international education journey 
              smooth, successful, and rewarding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 home-card">
                <div className="home-icon-primary mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold home-title-dark mb-2">
                  {feature.title}
                </h3>
                <p className="home-text-dark">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 home-section-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold home-title-dark mb-4">
              Our Services
            </h2>
            <p className="text-xl home-text-dark max-w-3xl mx-auto">
              From initial consultation to post-arrival support, we provide comprehensive 
              services to ensure your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="home-card rounded-lg p-6">
              <h3 className="text-xl font-semibold home-title-dark mb-4">University Selection</h3>
              <p className="home-text-dark mb-4">
                Expert guidance in choosing the right university based on your academic goals, 
                budget, and preferences.
              </p>
              <ul className="text-sm home-text-dark space-y-2">
                <li>• Course and program analysis</li>
                <li>• University ranking and reputation</li>
                <li>• Cost and scholarship opportunities</li>
              </ul>
            </div>

            <div className="home-card rounded-lg p-6">
              <h3 className="text-xl font-semibold home-title-dark mb-4">Application Support</h3>
              <p className="home-text-dark mb-4">
                Complete assistance with university applications, document preparation, 
                and submission processes.
              </p>
              <ul className="text-sm home-text-dark space-y-2">
                <li>• Document preparation and verification</li>
                <li>• Application form assistance</li>
                <li>• Statement of purpose guidance</li>
              </ul>
            </div>

            <div className="home-card rounded-lg p-6">
              <h3 className="text-xl font-semibold home-title-dark mb-4">Visa Assistance</h3>
              <p className="home-text-dark mb-4">
                Comprehensive visa application support including documentation, 
                interview preparation, and follow-up.
              </p>
              <ul className="text-sm home-text-dark space-y-2">
                <li>• Visa application guidance</li>
                <li>• Document checklist preparation</li>
                <li>• Interview preparation support</li>
              </ul>
            </div>

            <div className="home-card rounded-lg p-6">
              <h3 className="text-xl font-semibold home-title-dark mb-4">Pre-Departure Support</h3>
              <p className="home-text-dark mb-4">
                Essential guidance and preparation for your journey to your new university.
              </p>
              <ul className="text-sm home-text-dark space-y-2">
                <li>• Travel arrangements guidance</li>
                <li>• Accommodation assistance</li>
                <li>• Cultural orientation</li>
              </ul>
            </div>

            <div className="home-card rounded-lg p-6">
              <h3 className="text-xl font-semibold home-title-dark mb-4">Post-Arrival Support</h3>
              <p className="home-text-dark mb-4">
                Ongoing support after you arrive at your university to ensure a smooth transition.
              </p>
              <ul className="text-sm home-text-dark space-y-2">
                <li>• Airport pickup coordination</li>
                <li>• Local orientation assistance</li>
                <li>• Ongoing academic support</li>
              </ul>
            </div>

            <div className="home-card rounded-lg p-6">
              <h3 className="text-xl font-semibold home-title-dark mb-4">24/7 Support</h3>
              <p className="home-text-dark mb-4">
                Round-the-clock support to address any concerns or questions you may have.
              </p>
              <ul className="text-sm home-text-dark space-y-2">
                <li>• Emergency assistance</li>
                <li>• Academic counseling</li>
                <li>• Personal support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 home-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 home-muted-text">
            Contact us today to begin your international education adventure with {companyInfo.name}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`mailto:${companyInfo.email}`}
              className="home-btn-primary font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Email Us
            </a>
            <a 
              href={`https://wa.me/${companyInfo.whatsapp.replace('+', '')}`}
              className="home-btn-secondary font-semibold py-3 px-8 rounded-lg transition-colors"
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