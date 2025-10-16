import React, { useState, useEffect } from 'react';
import { database } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  Building, 
  X, 
  BookOpen, 
  Clock, 
  DollarSign, 
  Award, 
  Tag,
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Globe
} from 'lucide-react';

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showUniversityModal, setShowUniversityModal] = useState(false);

  useEffect(() => {
    const universitiesRef = ref(database, 'universities');
    const unsubscribe = onValue(universitiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const universitiesList = Object.entries(data)
          .map(([id, university]) => ({
            id,
            ...university
          }))
          .filter(uni => uni.isActive !== false) // Only show active universities
          .sort((a, b) => b.rating - a.rating);
        setUniversities(universitiesList);
      } else {
        setUniversities([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Get unique countries for filter
  const countries = [...new Set(universities.map(uni => uni.country))].sort();

  // Handle university selection
  const handleUniversityClick = (university) => {
    setSelectedUniversity(university);
    setShowUniversityModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowUniversityModal(false);
    setSelectedUniversity(null);
  };

  // Handle Apply Now email
  const handleApplyNow = (university) => {
    const subject = `Application Request - ${university.name}`;
    const body = `Dear RN Bridge Admissions Team,

I am writing to express my interest in applying to ${university.name} through your services.

University Details:
- University: ${university.name}
- Location: ${university.location}, ${university.country}
- Rating: ${university.rating}/5 stars

I would like to request assistance with my application process and would appreciate any guidance you can provide regarding:
- Application requirements and deadlines
- Document preparation and submission
- Visa assistance and requirements
- Scholarship opportunities

Please provide me with detailed information about the application process and next steps.

Thank you for your time and assistance.

Best regards,
[Your Name]
[Your Email]
[Your Phone Number]
[Your Country]`;

    const mailtoLink = `mailto:admissionrequest@rnbridge.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  // Handle Request Information email
  const handleRequestInfo = (university) => {
    const subject = `Information Request - ${university.name}`;
    const body = `Dear RN Bridge Admissions Team,

I am interested in learning more about ${university.name} and the programs available through your services.

University Details:
- University: ${university.name}
- Location: ${university.location}, ${university.country}
- Rating: ${university.rating}/5 stars
- Student Body: ${university.students || 'N/A'}

I would like to request the following information:
- Detailed program information and course offerings
- Admission requirements and eligibility criteria
- Tuition fees and scholarship opportunities
- Application deadlines and process
- Student support services
- Campus facilities and accommodation options

Please send me comprehensive information about this university and the programs that would be suitable for my academic goals.

Thank you for your assistance.

Best regards,
[Your Name]
[Your Email]
[Your Phone Number]
[Your Country]`;

    const mailtoLink = `mailto:admissionrequest@rnbridge.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  // Filter universities based on search and filters
  const filteredUniversities = universities.filter(university => {
    const matchesSearch = university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         university.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         university.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = !selectedCountry || university.country === selectedCountry;
    const matchesRating = !selectedRating || university.rating >= parseFloat(selectedRating);

    return matchesSearch && matchesCountry && matchesRating;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading universities...</p>
        </div>
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No universities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Universities will be loaded automatically. Please check back in a few moments.
            </p>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen home-theme home-section-light py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold home-title-dark mb-4">
            Partner Universities
          </h1>
          <p className="text-xl home-text-dark max-w-3xl mx-auto">
            Discover world-class universities and institutions that partner with us to provide
            exceptional educational opportunities for international students.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="home-card rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 home-icon-primary w-5 h-5" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3.0">3.0+ Stars</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center justify-center">
              {filteredUniversities.length} universities found
            </div>
          </div>
        </div>

        {/* Universities Grid */}
        {filteredUniversities.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 home-icon-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium home-title-dark mb-2">No universities found</h3>
            <p className="home-text-dark">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((university) => (
              <div 
                key={university.id} 
                className="home-card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleUniversityClick(university)}
              >
                {university.image && (
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img
                      src={university.image}
                      alt={university.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                      <span className="text-xs font-bold text-gray-800">
                        {university.rating}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold home-title-dark line-clamp-2">
                      {university.name}
                    </h3>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm home-text-dark">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{university.location}, {university.country}</span>
                    </div>
                    
                    {university.students && (
                      <div className="flex items-center text-sm home-text-dark">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{university.students} students</span>
                      </div>
                    )}

                    {university.courses && (
                      <div className="flex items-center text-sm home-text-dark">
                        <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{Array.isArray(university.courses) ? university.courses.length : 0} programs available</span>
                      </div>
                    )}
                  </div>

                  {university.description && (
                    <p className="text-sm home-text-dark mb-4 line-clamp-3">
                      {university.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(university.rating)
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <button className="home-btn-primary text-sm font-medium px-4 py-2 rounded-lg flex items-center hover:shadow-md transition-all">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 home-card p-8">
          <h2 className="text-2xl font-bold home-title-dark mb-6 text-center">
            Why Choose Our Partner Universities?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--color-light-gray)'}}>
                <Building className="w-6 h-6" style={{color: 'var(--color-crimson-red)'}} />
              </div>
              <h3 className="text-lg font-semibold home-title-dark mb-2">
                World-Class Institutions
              </h3>
              <p className="home-text-dark">
                Partner with top-ranked universities and colleges worldwide, ensuring quality education and recognized degrees.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--color-light-gray)'}}>
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold home-title-dark mb-2">
                High Success Rates
              </h3>
              <p className="home-text-dark">
                Our partner universities have excellent student success rates and strong career outcomes for graduates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--color-light-gray)'}}>
                <Users className="w-6 h-6" style={{color: 'var(--color-crimson-red)'}} />
              </div>
              <h3 className="text-lg font-semibold home-title-dark mb-2">
                Diverse Student Body
              </h3>
              <p className="home-text-dark">
                Join a multicultural community with students from around the world, enriching your learning experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* University Details Modal */}
      {showUniversityModal && selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedUniversity.name}
                  </h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{selectedUniversity.location}, {selectedUniversity.country}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                      <span className="font-semibold">{selectedUniversity.rating}/5</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* University Image and Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  {selectedUniversity.image && (
                    <div className="h-64 bg-gray-200 rounded-lg overflow-hidden mb-6">
                      <img
                        src={selectedUniversity.image}
                        alt={selectedUniversity.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">About This University</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedUniversity.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">University Stats</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Users className="w-5 h-5 mr-2" />
                          <span>Student Body</span>
                        </div>
                        <span className="font-semibold text-gray-900">{selectedUniversity.students || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <BookOpen className="w-5 h-5 mr-2" />
                          <span>Programs</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {Array.isArray(selectedUniversity.courses) ? selectedUniversity.courses.length : 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Globe className="w-5 h-5 mr-2" />
                          <span>Country</span>
                        </div>
                        <span className="font-semibold text-gray-900">{selectedUniversity.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Rating</h3>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.floor(selectedUniversity.rating)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {selectedUniversity.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Programs Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Programs</h3>
                {selectedUniversity.courses && Array.isArray(selectedUniversity.courses) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUniversity.courses.map((course, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        {typeof course === 'object' && course !== null ? (
                          // New detailed format
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                {course.programName}
                              </h4>
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2">
                                {course.degreeType}
                              </span>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <DollarSign className="w-4 h-4 mr-2" />
                                <span className="font-medium">Tuition: {course.tuition}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>Duration: {course.duration}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="mr-2">Application Fee:</span>
                                <span className={course.applicationFee === 'Free' ? 'text-green-600 font-medium' : 'text-gray-900'}>
                                  {course.applicationFee}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                <span className={`font-medium ${
                                  course.successPrediction === 'Very High' ? 'text-green-600' :
                                  course.successPrediction === 'High' ? 'text-blue-600' :
                                  course.successPrediction === 'Average' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  Success Rate: {course.successPrediction}
                                </span>
                              </div>
                            </div>

                            {course.tags && course.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {course.tags.map((tag, tagIndex) => (
                                  <span 
                                    key={tagIndex}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          // Old simple format
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {course}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Contact us for detailed program information including tuition, duration, and requirements.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No program information available at this time.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-200">
                <button 
                  onClick={() => handleApplyNow(selectedUniversity)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Apply Now
                </button>
                <button 
                  onClick={() => handleRequestInfo(selectedUniversity)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Request Information
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Universities; 