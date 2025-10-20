import React from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';
import { GraduationCap, Globe, Users, Award, ArrowRight, CheckCircle, Shield, TrendingUp, Home as HomeIcon, Briefcase, LifeBuoy, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigationWithScroll } from '../utils/navigation';

const Home = () => {
  const { companyInfo } = useCompany();
  const { navigateWithScroll } = useNavigationWithScroll();

  const handleApplyNow = () => {
    navigateWithScroll('/inquiry');
  };

  const handleExploreUniversities = () => {
    navigateWithScroll('/admission-info');
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
    },
    {
      icon: <HomeIcon className="w-8 h-8" />,
      title: "Accommodation Assistance",
      description: "Guidance to secure safe and affordable housing near your university."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Part‑Time Jobs Guidance",
      description: "Tips and resources to help you find part‑time opportunities while you study."
    },
    {
      icon: <LifeBuoy className="w-8 h-8" />,
      title: "Post‑Arrival Support",
      description: "On‑ground assistance for banking, SIM, transport, and settling‑in needs."
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
    <div className="min-h-screen home-theme">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white home-gradient">
        {/* Decorative blobs */}
        <span className="hero-blob top-[-10rem] -left-10 bg-white/10"></span>
        <span className="hero-blob bottom-[-12rem] -right-10 bg-white/10 delay-300"></span>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-up">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm mb-4">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                Trusted by students worldwide
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                Your Gateway to
                <span className="block text-primary-200 glow">Global Education</span>
              </h1>

              <p className="text-lg md:text-xl mb-10 text-primary-100 max-w-2xl">
                {companyInfo.name} connects ambitious students with world-class universities. 
                Start your international academic journey with expert guidance and comprehensive support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleApplyNow}
                  className="group home-btn-primary text-lg px-8 py-3 inline-flex items-center justify-center home-accent-border"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <button
                  onClick={handleExploreUniversities}
                  className="home-btn-secondary text-lg px-8 py-3"
                >
                  Explore Universities
                </button>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
                <div className="rounded-xl bg-white/10 border border-white/10 p-4 text-center">
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-xs text-primary-100">Partner Countries</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/10 p-4 text-center">
                  <p className="text-2xl font-bold">1000+</p>
                  <p className="text-xs text-primary-100">Programs</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/10 p-4 text-center">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-xs text-primary-100">Student Support</p>
                </div>
              </div>
            </div>

            {/* Right card */}
            <div className="hidden lg:block fade-in-up lg:delay-100">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl border border-white/20"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                     boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)'
                   }}>
                {/* Clean header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-2">Contact Us</h3>
                  <p className="text-white/80">Get in touch with our education consultants</p>
                </div>
                
                {/* Simple contact methods */}
                <div className="space-y-4 mb-8">
                  <a href={`mailto:${companyInfo.email}`} 
                     className="flex items-center p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group backdrop-blur-sm">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="w-5 h-5 text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Email</p>
                      <p className="text-sm text-white/70">{companyInfo.email}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                  </a>

                  <a href={`https://wa.me/${companyInfo.whatsapp.replace('+','')}`} target="_blank" rel="noreferrer"
                     className="flex items-center p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group backdrop-blur-sm">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                      <Phone className="w-5 h-5 text-green-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">WhatsApp</p>
                      <p className="text-sm text-white/70">{companyInfo.whatsapp}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                  </a>

                  <div className="flex items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="w-5 h-5 text-white/80" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Office</p>
                      <p className="text-sm text-white/70">{companyInfo.location}</p>
                    </div>
                  </div>
                </div>

                {/* Simple action buttons */}
                <div className="space-y-3">
                  <a href={`mailto:${companyInfo.email}`}
                     className="w-full bg-blue-500/80 hover:bg-blue-500 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center backdrop-blur-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                  <a href={`https://wa.me/${companyInfo.whatsapp.replace('+','')}`} target="_blank" rel="noreferrer"
                     className="w-full bg-green-500/80 hover:bg-green-500 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors flex items-center justify-center backdrop-blur-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp Chat
                  </a>
                </div>

                {/* Professional footer */}
                <div className="text-center mt-6 pt-4 border-t border-white/20">
                  <p className="text-xs text-white/60">
                    Professional consultation • Free of charge
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 home-section-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold home-title-dark mb-4">
              Why Choose {companyInfo.name}?
            </h2>
            <p className="text-xl home-text-dark max-w-3xl mx-auto">
              We provide comprehensive support throughout your international education journey, 
              from initial consultation to post-arrival assistance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 home-card hover:shadow-lg transition-shadow">
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

      {/* Benefits Section */}
      <section className="py-20 home-section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold home-title-dark mb-6">
                Comprehensive Student Support
              </h2>
              <p className="text-xl home-text-dark mb-8">
                Our dedicated team ensures you have everything you need for a successful 
                international education experience.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" style={{color:'var(--color-crimson-red)'}} />
                    <span className="home-text-dark">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="home-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold home-title-dark mb-6">
                Ready to Start Your Journey?
              </h3>
              <p className="home-text-dark mb-6">
                Fill out our inquiry form and our experts will get back to you within 24 hours 
                with personalized guidance.
              </p>
              <Link to="/inquiry" className="home-btn-primary w-full text-center home-accent-border">
                Submit Your Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Portal Section */}
      <section className="py-20 home-section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold home-title-dark mb-6">
                Are You an Agent?
              </h2>
              <p className="text-xl home-text-dark mb-8">
                Access your exclusive agent dashboard to manage student referrals, track commissions, 
                and grow your business with {companyInfo.name}.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{backgroundColor:'var(--color-light-gray)'}}>
                    <Users className="w-5 h-5" style={{color:'var(--color-crimson-red)'}} />
                  </div>
                  <span className="home-text-dark">Manage student referrals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{backgroundColor:'var(--color-light-gray)'}}>
                    <TrendingUp className="w-5 h-5" style={{color:'var(--color-crimson-red)'}} />
                  </div>
                  <span className="home-text-dark">Track commissions and earnings</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{backgroundColor:'var(--color-light-gray)'}}>
                    <Shield className="w-5 h-5" style={{color:'var(--color-crimson-red)'}} />
                  </div>
                  <span className="home-text-dark">Secure access to your dashboard</span>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  to="/agent/login" 
                  className="inline-flex items-center home-btn-primary font-semibold py-3 px-8 rounded-lg transition-colors home-accent-border"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Agent Login
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="home-card rounded-2xl p-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{backgroundColor:'var(--color-light-gray)'}}>
                  <Shield className="w-8 h-8" style={{color:'var(--color-crimson-red)'}} />
                </div>
                <h3 className="text-2xl font-bold home-title-dark mb-4">
                  Agent Benefits
                </h3>
                <p className="home-text-dark mb-6">
                  Join our network of successful agents and start earning commissions while helping students achieve their dreams.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm home-text-dark">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" style={{color:'var(--color-crimson-red)'}} />
                    <span>Competitive commission rates</span>
                  </div>
                  <div className="flex items-center text-sm home-text-dark">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" style={{color:'var(--color-crimson-red)'}} />
                    <span>Real-time tracking system</span>
                  </div>
                  <div className="flex items-center text-sm home-text-dark">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" style={{color:'var(--color-crimson-red)'}} />
                    <span>Dedicated support team</span>
                  </div>
                  <div className="flex items-center text-sm home-text-dark">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" style={{color:'var(--color-crimson-red)'}} />
                    <span>Marketing materials provided</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 home-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your International Education Journey Today
          </h2>
          <p className="text-xl mb-8 home-muted-text">
            Join thousands of successful students who have achieved their dreams with {companyInfo.name}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inquiry" className="home-btn-primary font-semibold py-3 px-8 rounded-lg transition-colors">
              Apply Now
            </Link>
            <Link to="/contact" className="home-btn-secondary font-semibold py-3 px-8 rounded-lg transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 