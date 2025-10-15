import React, { useState, useEffect } from 'react';
import { database } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import { Search, MapPin, Star, Users, Building } from 'lucide-react';

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

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
              <div key={university.id} className="home-card overflow-hidden hover:shadow-lg transition-shadow">
                {university.image && (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={university.image}
                      alt={university.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold home-title-dark">
                      {university.name}
                    </h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm font-medium home-title-dark">
                        {university.rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm home-text-dark">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{university.location}, {university.country}</span>
                    </div>
                    
                    {university.students && (
                      <div className="flex items-center text-sm home-text-dark">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{university.students} students</span>
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
                    
                    <button className="home-btn-secondary text-sm font-medium px-3 py-1">
                      Learn More
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
    </div>
  );
};

export default Universities; 