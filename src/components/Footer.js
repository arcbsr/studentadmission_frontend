import React from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  const { companyInfo } = useCompany();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-400 mb-4">
              {companyInfo.name}
            </h3>
            <p className="text-gray-300 mb-6">
              Your trusted partner for international student admissions. We connect students 
              with top universities worldwide and provide comprehensive support throughout 
              their academic journey.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3" />
                <a href={`mailto:${companyInfo.email}`} className="hover:text-primary-400">
                  {companyInfo.email}
                </a>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3" />
                <a href={`https://wa.me/${companyInfo.whatsapp.replace('+', '')}`} 
                   className="hover:text-primary-400">
                  {companyInfo.whatsapp}
                </a>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3" />
                <span>{companyInfo.location}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Globe className="w-4 h-4 mr-3" />
                <a href={companyInfo.website} target="_blank" rel="noopener noreferrer" 
                   className="hover:text-primary-400">
                  {companyInfo.website}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/admission-info" className="text-gray-300 hover:text-primary-400">
                  Universities
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/inquiry" className="text-gray-300 hover:text-primary-400">
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Student Admissions</li>
              <li className="text-gray-300">University Partnerships</li>
              <li className="text-gray-300">Visa Assistance</li>
              <li className="text-gray-300">Academic Counseling</li>
              <li className="text-gray-300">Agent Network</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 