import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';
import { 
  GraduationCap, 
  BookOpen, 
  Shield, 
  Award, 
  Users, 
  Building2, 
  Star,
  ArrowRight,
  CheckCircle,
  DollarSign,
  FileText,
  Phone,
  Briefcase,
  Search,
  X,
  ExternalLink,
  Clock,
  MapPin
} from 'lucide-react';

const AdmissionInfo = () => {
  const { companyInfo } = useCompany();
  const [activeTab, setActiveTab] = useState('universities');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const universities = [
    "University of Bolton",
    "Anglia Ruskin University (ARU)",
    "University of Greenwich",
    "University of Bedfordshire",
    "University of Suffolk",
    "University of Ulster",
    "University of Northumbria",
    "University of Middlesex",
    "University of Roehampton",
    "Solent University Southampton",
    "University of Trinity St. David (TSD)",
    "University of Sunderland",
    "The University of Law",
    "Canterbury Christ Church University",
    "Cardiff Metropolitan University",
    "University of West of Scotland",
    "Architectural Association School of Architecture",
    "University of Aberdeen",
    "Aberystwyth University",
    "Alliance Manchester Business School",
    "Bucks(Buckinghamshire) New University",
    "Leeds Trinity University",
    "Leicester College (HND) P60- 3 years",
    "Amity University [IN]",
    "Arts University Bournemouth",
    "Goldsmith, University of London",
    "University of Hull",
    "Imperial college",
    "Keele University",
    "Aston University",
    "University of Bangor",
    "University of Bath",
    "University of Bath School of Management",
    "Bath spa University",
    "Birkbeck, University of London",
    "University of Birmingham",
    "Birmingham City University",
    "Bournemouth University",
    "BPP University",
    "University of Bradford",
    "University of Brighton",
    "University of Bristol",
    "Brunel University London",
    "University of Cambridge",
    "Cardiff University",
    "Cass Business School",
    "University of Chester",
    "City University",
    "Coventry University",
    "University of Cumbria",
    "De Montfort University",
    "University of Derby",
    "Dublin City University",
    "Durham University",
    "University of East Anglia",
    "University of East London",
    "University of Edinburgh",
    "University of Essex",
    "University of Exeter",
    "University of Glasgow",
    "University of Kent",
    "King's College London",
    "Kingston University",
    "University of Liverpool",
    "Liverpool Hope University",
    "Liverpool John Moore University",
    "London Business School",
    "London School of Economics (LSE)",
    "London Southbank University",
    "University of Manchester",
    "Middlesex University",
    "University of Oxford",
    "Queen Mary University of London",
    "University of Reading",
    "Richmond University",
    "Sheffield University",
    "SOAS, University of London",
    "University of St. Andrews",
    "St. George's University Newcastle",
    "University of Surrey",
    "University of Sussex",
    "UCL",
    "University College Birmingham",
    "University of West London",
    "University of Westminster",
    "University of Wolverhampton",
    "University of York",
    "University of Gloucestershire"
  ];

  // Filter universities based on search term
  const filteredUniversities = universities.filter(university =>
    university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUniversityClick = (university) => {
    setSelectedUniversity(university);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUniversity(null);
  };

  const courses = {
    "BUSINESS AND MANAGEMENT": [
      "MBA (Master of Business Administration)",
      "MSc in Accounting and Finance",
      "MSc in International Business",
      "MSC IN MARKETING"
    ],
    "Engineering and Technology": [
      "MSc in Mechanical Engineering",
      "MSc in Civil Engineering",
      "MSc in Artificial Intelligence",
      "MSC IN DATA SCIENCE"
    ],
    "Computer Science and IT": [
      "MSc in Cyber Security",
      "MSc in Software Engineering",
      "MSc in Information Systems"
    ],
    "EDUCATION": [
      "MA in Education",
      "MSc in TESOL (Teaching English)"
    ],
    "ARTS AND HUMANITIES": [
      "MA in Creative Writing",
      "MA in English Literature",
      "MA in History"
    ],
    "HEALTH AND MEDICINE": [
      "MSc in Public Health",
      "MSc in Nursing",
      "MSc in Clinical Psychology",
      "MSc in Biomedical Sciences"
    ],
    "LAW AND SOCIAL SCIENCES": [
      "LLM (Master of Laws)",
      "MSc in International Relations",
      "MSc in Criminology and Criminal Justice"
    ],
    "SCIENCE": [
      "MSc in Biotechnology",
      "MSc in Environmental Science",
      "MSc in Neuroscience"
    ],
    "ECONOMICS AND FINANCE": [
      "MSc in Economics",
      "MSc in Financial Economics"
    ],
    "HOSPITALITY AND TOURISM": [
      "MSc in Hospitality Management",
      "MSc in Tourism Management"
    ]
  };

  const services = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Admission Services",
      description: "Complete application processing and submission"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "SOP Writing",
      description: "Professional Statement of Purpose crafting"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Offer Letter Processing",
      description: "Fast-track offer letter management"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "CAS Interview Preparation",
      description: "Expert guidance for successful interviews"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Visa Document Filing",
      description: "Complete visa application assistance"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Accommodation Support",
      description: "Finding suitable student housing"
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Part-Time Job Assistance",
      description: "Help finding employment opportunities"
    }
  ];

  const stats = [
    { number: "90+", label: "Partner Universities", icon: <Building2 className="w-6 h-6" /> },
    { number: "50+", label: "Course Categories", icon: <BookOpen className="w-6 h-6" /> },
    { number: "£8K-35K", label: "Tuition Fee Range", icon: <DollarSign className="w-6 h-6" /> },
    { number: "100%", label: "Free Services", icon: <Star className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <GraduationCap className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Admission <span className="text-yellow-300">Information</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your gateway to world-class education with comprehensive support and expert guidance
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-white mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              <button
                onClick={() => setActiveTab('universities')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'universities'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Building2 className="w-5 h-5 inline mr-2" />
                Universities (UK)
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'courses'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Courses
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'services'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Shield className="w-5 h-5 inline mr-2" />
                Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'universities' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Partner Universities
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose from our extensive network of prestigious universities across the UK and beyond
                </p>
              </div>
              
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl">
                          Our Partner Universities
                        </h3>
                        <p className="text-blue-100 text-sm">
                          {searchTerm ? `${filteredUniversities.length} of ${universities.length}` : `${universities.length} Universities with Free Services`}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg px-3 py-1">
                      <span className="text-white text-sm font-medium">Free Services</span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Search Bar */}
                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-6 w-6 text-blue-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search universities by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-2xl transition-colors"
                      >
                        <X className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors" />
                      </button>
                    )}
                  </div>
                  {searchTerm && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Showing {filteredUniversities.length} matching universities
                      </div>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="h-[calc(100vh-350px)] overflow-y-auto">
                  {filteredUniversities.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 p-4">
                      {filteredUniversities.map((university, index) => (
                        <div
                          key={index}
                          onClick={() => handleUniversityClick(university)}
                          className="bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-purple-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300 group cursor-pointer hover:shadow-lg hover:scale-[1.01] transform"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                                  {university.charAt(0)}
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors text-lg mb-2">
                                  {university}
                                </h4>
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium border border-blue-200">
                                    Free Support
                                  </span>
                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium border border-green-200">
                                    Available
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <FileText className="w-3 h-3 mr-1" />
                                    SOP Writing
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Visa Support
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    Interview Prep
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="text-xs text-gray-500 mb-2">Click to view courses</div>
                              </div>
                              <div className="flex space-x-2">
                                <a
                                  href={`https://wa.me/${companyInfo.whatsapp.replace('+','')}?text=Hi, I'm interested in ${university} admission. Please provide more details.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 hover:shadow-md"
                                  title="Contact via WhatsApp"
                                >
                                  <Phone className="w-5 h-5 text-white" />
                                </a>
                                <div 
                                  onClick={() => handleUniversityClick(university)}
                                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 cursor-pointer hover:shadow-md"
                                  title="View courses"
                                >
                                  <ArrowRight className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-8 py-16 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">No universities found</h3>
                      <p className="text-gray-600 mb-6 text-lg">
                        No universities match your search term "{searchTerm}"
                      </p>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center mx-auto"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">All universities accepting applications</div>
                        <div className="text-sm text-gray-600">Free services: SOP Writing, Visa Support, Interview Prep</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-lg">WhatsApp</div>
                      <div className="text-sm text-gray-600">Instant support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Available Courses
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Explore diverse academic programs across multiple disciplines
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(courses).map(([category, courseList], index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {courseList.map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Our Services
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Comprehensive support throughout your educational journey - completely free of charge
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-blue-200"
                  >
                    <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Detailed Service Information */}
              <div className="mt-12 space-y-8">
                {/* Service Process */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Complete Service Process</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Initial Consultation</h4>
                      <p className="text-gray-600 text-sm">
                        Free assessment of your academic background, career goals, and university preferences. 
                        We help you choose the right program and university.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Application Process</h4>
                      <p className="text-gray-600 text-sm">
                        Complete application handling including document preparation, SOP writing, 
                        and submission to your chosen universities.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Visa & Settlement</h4>
                      <p className="text-gray-600 text-sm">
                        Visa application assistance, accommodation support, and post-arrival guidance 
                        to help you settle in smoothly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Benefits */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Services?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Expert Guidance</h4>
                          <p className="text-gray-600 text-sm">Professional counselors with years of experience in international education</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">100% Free Services</h4>
                          <p className="text-gray-600 text-sm">No hidden fees, no surprise charges - completely transparent pricing</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">High Success Rate</h4>
                          <p className="text-gray-600 text-sm">Proven track record with thousands of successful student placements</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                          <p className="text-gray-600 text-sm">Round-the-clock assistance throughout your entire journey</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Post-Arrival Support</h4>
                          <p className="text-gray-600 text-sm">Continued assistance after you arrive at your destination</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Partnership Network</h4>
                          <p className="text-gray-600 text-sm">Direct partnerships with 90+ universities worldwide</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tuition Information */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
                  <div className="text-center">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Affordable Education Options</h3>
                    <p className="text-gray-600 mb-6">
                      Quality education doesn't have to break the bank. Our partner universities offer excellent programs at competitive prices.
                    </p>
                    <div className="bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">£8,000</div>
                          <div className="text-sm text-gray-600">Starting from</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">£35,000</div>
                          <div className="text-sm text-gray-600">Maximum</div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        Tuition fees vary by university and program. Contact us for specific pricing information.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
                  <div className="text-center">
                    <Star className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
                    <p className="text-xl mb-6 opacity-90">
                      Get in touch with our expert team today and begin your path to international education.
                    </p>
                    <div className="bg-white/20 rounded-lg p-6 max-w-2xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Phone className="w-5 h-5" />
                          <span className="text-lg font-semibold">WhatsApp Support</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="w-5 h-5" />
                          <span className="text-lg font-semibold">Free Consultation</span>
                        </div>
                      </div>
                      <p className="text-lg leading-relaxed mt-4">
                        All our services are completely free. No hidden charges, no surprise fees. 
                        Start your seamless and stress-free journey to your desired university today!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who have achieved their dreams with our expert guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/inquiry"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Apply Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* University Courses Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUniversity}</h2>
                    <p className="text-blue-100 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      Available Courses & Programs
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(courses).map(([category, courseList], index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {courseList.map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                {course}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  1-2 Years
                                </span>
                                <span className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  £8K-35K
                                </span>
                                <span className="flex items-center text-green-600">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Available
                                </span>
                              </div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Free Admission Support</h3>
                    <p className="text-gray-700 mb-4">
                      All courses at {selectedUniversity} come with our comprehensive free admission support including SOP writing, visa assistance, and application guidance.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Free SOP Writing
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Visa Support
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        Application Guidance
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        Interview Prep
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    Premium university with excellent placement rates
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    to="/inquiry"
                    onClick={closeModal}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionInfo;
