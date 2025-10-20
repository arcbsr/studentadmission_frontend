import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { database } from '../firebase/config';
import { ref, push, get, update, onValue } from 'firebase/database';
import { User, MessageSquare, BookOpen, Globe } from 'lucide-react';

// UK Universities list from AdmissionInfo - moved outside component to prevent recreation
const UK_UNIVERSITIES = [
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

const InquiryForm = () => {
  const [loading, setLoading] = useState(false);
  const [agentInfo, setAgentInfo] = useState(null);
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm();
  const agentReferralKey = watch('agentReferralKey');
  const selectedCountry = watch('country');
  const selectedUniversity = watch('university');

  // Manual filtering function with useCallback
  const filterUniversitiesByCountry = useCallback((country) => {
    if (country && country.trim() !== '') {
      // Special handling for United Kingdom
      if (country.toLowerCase() === 'united kingdom' || country.toLowerCase() === 'uk') {
        const ukUniList = UK_UNIVERSITIES.map((uni, index) => ({
          id: `uk-${index}`,
          name: uni,
          country: 'United Kingdom'
        }));
        setFilteredUniversities(ukUniList);
      } else {
        // Regular filtering for other countries
        const filtered = universities.filter(uni => uni.country === country);
        setFilteredUniversities(filtered);
      }
    } else {
      setFilteredUniversities([]);
    }
  }, [universities]);

  // Reset university when country changes
  useEffect(() => {
    if (selectedCountry) {
      setValue('university', '');
      filterUniversitiesByCountry(selectedCountry);
    }
  }, [selectedCountry, setValue, filterUniversitiesByCountry]);

  // Load countries and universities from database
  useEffect(() => {
    const universitiesRef = ref(database, 'universities');
    const unsubscribe = onValue(universitiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Handle different data structures
        let universitiesList = [];
        if (Array.isArray(data)) {
          // If data is an array
          universitiesList = data
            .map((university, index) => ({
              id: index.toString(),
              ...university
            }))
            .filter(uni => uni.isActive !== false);
        } else {
          // If data is an object with keys
          universitiesList = Object.entries(data)
            .map(([id, university]) => ({
              id,
              ...university
            }))
            .filter(uni => uni.isActive !== false);
        }
        
        setUniversities(universitiesList);
        
        // Extract unique countries and clean them
        const uniqueCountries = [...new Set(universitiesList.map(uni => uni.country).filter(Boolean))].sort();
        // Ensure United Kingdom is always included
        if (!uniqueCountries.includes('United Kingdom')) {
          uniqueCountries.unshift('United Kingdom');
        }
        setCountries(uniqueCountries);
      } else {
        setUniversities([]);
        // Even if no universities in database, include United Kingdom
        setCountries(['United Kingdom']);
      }
    });

    return unsubscribe;
  }, []);

  // Check agent referral key
  useEffect(() => {
    const checkAgentKey = async () => {
      if (agentReferralKey && agentReferralKey.length >= 3) {
        try {
          const agentsRef = ref(database, 'agents');
          const snapshot = await get(agentsRef);
          if (snapshot.exists()) {
            const agents = snapshot.val();
            const agent = Object.values(agents).find(
              agent => agent.referralKey === agentReferralKey
            );
            if (agent) {
              setAgentInfo(agent);
            } else {
              setAgentInfo(null);
            }
          }
        } catch (error) {
          // Handle agent key check error silently
          setAgentInfo(null);
        }
      } else {
        setAgentInfo(null);
      }
    };

    checkAgentKey();
  }, [agentReferralKey]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Check if inquiry with same email already exists
      const inquiriesRef = ref(database, 'inquiries');
      const snapshot = await get(inquiriesRef);
      let existingInquiryId = null;
      
      if (snapshot.exists()) {
        const inquiries = snapshot.val();
        const existingInquiry = Object.entries(inquiries).find(([id, inquiry]) => 
          inquiry.email === data.email
        );
        if (existingInquiry) {
          existingInquiryId = existingInquiry[0];
        }
      }

      const newMessage = {
        message: data.message || 'No message provided',
        courseInterested: data.courseInterested,
        country: data.country,
        university: data.university,
        agentReferralKey: data.agentReferralKey || null,
        agentInfo: agentInfo ? {
          name: agentInfo.name,
          email: agentInfo.email,
          referralKey: agentInfo.referralKey
        } : null,
        submittedAt: Date.now()
      };

      if (existingInquiryId) {
        // Update existing inquiry with new message
        const existingInquiryRef = ref(database, `inquiries/${existingInquiryId}`);
        const existingSnapshot = await get(existingInquiryRef);
        const existingData = existingSnapshot.val();
        
        const updatedMessages = existingData.messages || [];
        updatedMessages.push(newMessage);
        
        await update(existingInquiryRef, {
          ...existingData,
          messages: updatedMessages,
          updatedAt: Date.now(),
          lastMessageAt: Date.now()
        });
      } else {
        // Create new inquiry
        const inquiryData = {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          country: data.country,
          state: data.state,
          university: data.university,
          messages: [newMessage],
          status: 'pending',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastMessageAt: Date.now()
        };

        await push(ref(database, 'inquiries'), inquiryData);
      }
      
      toast.success('Your inquiry has been submitted successfully! We will contact you soon.');
      reset();
      navigate('/');
    } catch (error) {
      // Handle inquiry submission error silently
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const courses = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Medicine",
    "Law",
    "Arts & Humanities",
    "Social Sciences",
    "Natural Sciences",
    "Education",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Submit Your Admission Inquiry
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your academic goals and we'll help you find the perfect university match.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Full name is required' })}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className="input-field"
                    placeholder="Enter your state/province"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className="input-field"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            {/* Country and University Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Country & University Interest
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country of Interest *
                  </label>
                  <select
                    {...register('country', { required: 'Please select a country' })}
                    className="input-field"
                    value={selectedCountry || ''}
                    onChange={(e) => {
                      const newCountry = e.target.value;
                      setValue('country', newCountry);
                      setValue('university', '');
                      if (newCountry) {
                        filterUniversitiesByCountry(newCountry);
                      } else {
                        setFilteredUniversities([]);
                      }
                    }}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University of Interest
                  </label>
                  <select
                    key={selectedCountry || 'no-country'}
                    {...register('university')}
                    className="input-field"
                    disabled={!selectedCountry}
                    value={selectedUniversity || ''}
                    onChange={(e) => {
                      setValue('university', e.target.value);
                    }}
                  >
                    <option value="">
                      {selectedCountry ? 'Select a university' : 'Select a country first'}
                    </option>
                    {filteredUniversities.map((university) => (
                      <option key={university.id} value={university.name}>
                        {university.name}
                      </option>
                    ))}
                  </select>
                  {!selectedCountry && (
                    <p className="text-sm text-gray-500 mt-1">
                      Please select a country to see available universities
                    </p>
                  )}
                  {selectedCountry && filteredUniversities.length === 0 && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ No universities found for {selectedCountry}
                      </p>
                      <p className="text-yellow-700 text-xs mt-1">
                        We don't have partner universities in this country yet. You can still submit your inquiry and we'll help you find suitable options.
                      </p>
                    </div>
                  )}
                  {selectedCountry && filteredUniversities.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Found {filteredUniversities.length} university{filteredUniversities.length > 1 ? 'ies' : ''} in {selectedCountry}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Academic Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Interested In *
                </label>
                <select
                  {...register('courseInterested', { required: 'Please select a course' })}
                  className="input-field"
                >
                  <option value="">Select a course</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </select>
                {errors.courseInterested && (
                  <p className="text-red-500 text-sm mt-1">{errors.courseInterested.message}</p>
                )}
              </div>
            </div>

            {/* Agent Referral */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Agent Referral (Optional)
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Referral Key
                </label>
                <input
                  type="text"
                  {...register('agentReferralKey')}
                  className="input-field"
                  placeholder="Enter agent referral key (e.g., AGT-RNB001)"
                />
                {agentInfo && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      ✓ Valid agent referral: {agentInfo.name} ({agentInfo.email})
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Message */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Additional Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  {...register('message')}
                  rows="4"
                  className="input-field"
                  placeholder="Tell us more about your academic goals, preferred countries, or any specific requirements..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm; 