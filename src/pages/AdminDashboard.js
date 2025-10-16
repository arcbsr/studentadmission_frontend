import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import { database } from '../firebase/config';
import { ref, update, onValue, push, set, remove, get } from 'firebase/database';


import { 
  Users, 
  Settings, 
  FileText, 
  UserCheck, 
  TrendingUp,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Trash2,
  Building,
  UserPlus,
  Shield,
  UserX,
  Copy,
  Search,
  MessageSquare,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  FileCode,
  AlertCircle,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { initializeUniversities } from '../utils/initializeUniversities';
import { sendStatusUpdateNotification, sendAgentWelcomeEmail } from '../utils/emailService';
import { createUserInDatabaseOnly } from '../utils/initializeAdmin';
import MessageModal from '../components/MessageModal';

const AdminDashboard = () => {
  const { currentUser, userRole, userData, isSuperAdmin } = useAuth();
  const { companyInfo, updateCompanyInfo } = useCompany();
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [agents, setAgents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState(companyInfo);
  
  // Search states
  const [inquirySearch, setInquirySearch] = useState('');
  const [agentSearch, setAgentSearch] = useState('');
  const [universitySearch, setUniversitySearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  
  // Filtered data states
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  

  
  // Message modal state
  const [messageModal, setMessageModal] = useState({ isOpen: false, inquiry: null });
  
  // University management
  const [showUniversityForm, setShowUniversityForm] = useState(false);
  const [showJsonUniversityForm, setShowJsonUniversityForm] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [universityForm, setUniversityForm] = useState({
    name: '',
    country: '',
    location: '',
    rating: 0,
    students: '',
    courses: [],
    description: '',
    image: '',
    isActive: true
  });
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [showJsonStructure, setShowJsonStructure] = useState(false);
  const [parsedUniversities, setParsedUniversities] = useState([]);
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'multiple'
  const [expandedUniversities, setExpandedUniversities] = useState(new Set());

  // User management
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    role: 'agent',
    referralKey: '',
    commissionPerReferral: 0
  });

  // FAQ management
  const [faqs, setFaqs] = useState([]);
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  useEffect(() => {
    const fetchData = () => {
      // Listen for inquiries
      const inquiriesRef = ref(database, 'inquiries');
      const inquiriesUnsubscribe = onValue(inquiriesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const inquiriesList = Object.entries(data).map(([id, inquiry]) => {
            // Handle legacy inquiries that don't have messages array
            if (!inquiry.messages && inquiry.message) {
              // Convert legacy structure to new structure
              return {
                id,
                ...inquiry,
                messages: [{
                  message: inquiry.message,
                  courseInterested: inquiry.courseInterested,
                  country: inquiry.country,
                  university: inquiry.university,
                  agentReferralKey: inquiry.agentReferralKey,
                  agentInfo: inquiry.agentInfo,
                  submittedAt: inquiry.createdAt
                }]
              };
            }
            return {
              id,
              ...inquiry
            };
          }).sort((a, b) => b.createdAt - a.createdAt);
          
          setInquiries(inquiriesList);
        } else {
          setInquiries([]);
        }
      });

      // Listen for agents (from both agents and users tables)
      const agentsRef = ref(database, 'agents');
      const agentsUnsubscribe = onValue(agentsRef, (snapshot) => {
        let agentsList = [];
        if (snapshot.exists()) {
          const data = snapshot.val();
          agentsList = Object.entries(data).map(([id, agent]) => ({
            id,
            ...agent
          }));
        }
        
        // Also get agents from users table
        const usersRef = ref(database, 'users');
        const usersUnsubscribe = onValue(usersRef, (usersSnapshot) => {
          if (usersSnapshot.exists()) {
            const usersData = usersSnapshot.val();
            const userAgents = Object.entries(usersData)
              .filter(([id, user]) => user.role === 'agent')
              .map(([id, user]) => ({
                id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                country: user.country,
                referralKey: user.referralKey,
                commissionPerReferral: user.commissionPerReferral,
                isActive: user.isActive,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
              }));
            
            // Combine agents from both tables, prioritizing agents table
            const agentsMap = new Map();
            
            // First, add agents from agents table (only if they have a referralKey)
            agentsList.forEach(agent => {
              if (agent.referralKey && agent.name && agent.email) {
                agentsMap.set(agent.referralKey, {
                  ...agent,
                  sourceTable: 'agents',
                  firebaseKey: agent.id // Store the Firebase key for updates
                });
              }
            });
            
            // Then, add agents from users table (only if not already in agents table and have valid data)
            userAgents.forEach(agent => {
              if (agent.referralKey && agent.name && agent.email && !agentsMap.has(agent.referralKey)) {
                agentsMap.set(agent.referralKey, {
                  ...agent,
                  sourceTable: 'users',
                  firebaseKey: agent.id // Store the Firebase key for updates
                });
              }
            });
            
            const agentsWithSource = Array.from(agentsMap.values());
            
            setAgents(agentsWithSource.sort((a, b) => b.createdAt - a.createdAt));
          } else {
            setAgents(agentsList.sort((a, b) => b.createdAt - a.createdAt));
          }
        });
        
        return () => {
          agentsUnsubscribe();
          usersUnsubscribe();
        };
      });

      // Listen for universities
      const universitiesRef = ref(database, 'universities');
      const universitiesUnsubscribe = onValue(universitiesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const universitiesList = Object.entries(data).map(([id, university]) => ({
            id,
            ...university
          })).sort((a, b) => b.createdAt - a.createdAt);
          setUniversities(universitiesList);
        } else {
          setUniversities([]);
        }
      });

      // Listen for users (for super admin)
      const usersRef = ref(database, 'users');
      const usersUnsubscribe = onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const usersList = Object.entries(data).map(([id, user]) => ({
            id,
            ...user
          })).sort((a, b) => b.createdAt - a.createdAt);
          setUsers(usersList);
        } else {
          setUsers([]);
        }
        setLoading(false);
      });

      return () => {
        inquiriesUnsubscribe();
        universitiesUnsubscribe();
        usersUnsubscribe();
      };
    };

    fetchData();
  }, []);

  // Load FAQs when component mounts
  useEffect(() => {
    loadFaqs();
  }, []);
  
  // Filter data based on search terms
  useEffect(() => {
    // Filter inquiries
    const filtered = inquiries.filter(inquiry => {
      const searchTerm = inquirySearch.toLowerCase();
      const hasMatchingMessage = inquiry.messages?.some(msg => 
        msg.message?.toLowerCase().includes(searchTerm) ||
        msg.courseInterested?.toLowerCase().includes(searchTerm) ||
        msg.agentReferralKey?.toLowerCase().includes(searchTerm)
      );
      
      return (
        inquiry.fullName?.toLowerCase().includes(searchTerm) ||
        inquiry.email?.toLowerCase().includes(searchTerm) ||
        hasMatchingMessage
      );
    });
    setFilteredInquiries(filtered);
  }, [inquiries, inquirySearch]);
  
  useEffect(() => {
    // Filter agents
    const filtered = agents.filter(agent =>
      agent.name?.toLowerCase().includes(agentSearch.toLowerCase()) ||
      agent.email?.toLowerCase().includes(agentSearch.toLowerCase()) ||
      agent.referralKey?.toLowerCase().includes(agentSearch.toLowerCase())
    );
    setFilteredAgents(filtered);
  }, [agents, agentSearch]);
  
  useEffect(() => {
    // Filter universities
    const filtered = universities.filter(university =>
      university.name?.toLowerCase().includes(universitySearch.toLowerCase()) ||
      university.country?.toLowerCase().includes(universitySearch.toLowerCase()) ||
      university.location?.toLowerCase().includes(universitySearch.toLowerCase())
    );
    setFilteredUniversities(filtered);
  }, [universities, universitySearch]);
  
  useEffect(() => {
    // Filter users
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.role?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.referralKey?.toLowerCase().includes(userSearch.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, userSearch]);

  const updateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      // Find the inquiry to get student data
      const inquiry = inquiries.find(inq => inq.id === inquiryId);
      if (!inquiry) {
        toast.error('Inquiry not found!');
        return;
      }

      // Update status in Firebase
      await update(ref(database, `inquiries/${inquiryId}`), {
        status: newStatus,
        updatedAt: Date.now()
      });

      // Send status update email to student
      try {
        await sendStatusUpdateNotification(inquiry, newStatus, inquiry.agentInfo);
                } catch (emailError) {
            // Failed to send status update email - handled silently
          }

      toast.success('Inquiry status updated successfully! Email notification sent.');
    } catch (error) {
      toast.error('Failed to update inquiry status.');
    }
  };







  const openMessageModal = (inquiry) => {
    setMessageModal({ isOpen: true, inquiry });
  };

  const closeMessageModal = () => {
    setMessageModal({ isOpen: false, inquiry: null });
  };



  const saveUniversity = async () => {
    try {
      if (editingUniversity) {
        // Update existing university
        await update(ref(database, `universities/${editingUniversity.id}`), {
          ...universityForm,
          updatedAt: Date.now()
        });
        toast.success('University updated successfully!');
      } else {
        // Add new university
        const newUniversityRef = push(ref(database, 'universities'));
        await set(newUniversityRef, {
          ...universityForm,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        toast.success('University added successfully!');
      }
      
      setShowUniversityForm(false);
      setEditingUniversity(null);
      setUniversityForm({
        name: '',
        country: '',
        location: '',
        rating: 0,
        students: '',
        courses: [],
        description: '',
        image: '',
        isActive: true
      });
    } catch (error) {
      toast.error('Failed to save university.');
    }
  };

  const deleteUniversity = async (universityId) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      try {
        await remove(ref(database, `universities/${universityId}`));
        toast.success('University deleted successfully!');
          } catch (error) {
      toast.error('Failed to delete university.');
    }
    }
  };

  // JSON University functions
  const validateUniversityJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Check if it's an object or array
      if (typeof parsed !== 'object' || parsed === null) {
        return { valid: false, error: 'JSON must be an object or array' };
      }

      // Handle array of universities
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          return { valid: false, error: 'Array cannot be empty' };
        }

        // Validate each university in the array
        for (let i = 0; i < parsed.length; i++) {
          const university = parsed[i];
          const validation = validateSingleUniversity(university, i + 1);
          if (!validation.valid) {
            return validation;
          }
        }

        return { valid: true, data: parsed, isArray: true };
      }

      // Handle single university object
      const validation = validateSingleUniversity(parsed);
      return validation;
    } catch (error) {
      return { valid: false, error: `Invalid JSON format: ${error.message}` };
    }
  };

  // Helper function to validate a single university
  const validateSingleUniversity = (university, universityIndex = null) => {
    const prefix = universityIndex ? `University ${universityIndex}: ` : '';
    
    // Check if it's an object
    if (typeof university !== 'object' || university === null) {
      return { valid: false, error: `${prefix}Must be an object` };
    }

    // Check required fields
    const requiredFields = ['name', 'country', 'location', 'rating', 'students', 'courses', 'description'];
    const missingFields = requiredFields.filter(field => !university.hasOwnProperty(field) || university[field] === null || university[field] === undefined);

    if (missingFields.length > 0) {
      return { valid: false, error: `${prefix}Missing required fields: ${missingFields.join(', ')}` };
    }

    // Validate field types
    if (typeof university.name !== 'string' || university.name.trim() === '') {
      return { valid: false, error: `${prefix}Name must be a non-empty string` };
    }

    if (typeof university.country !== 'string' || university.country.trim() === '') {
      return { valid: false, error: `${prefix}Country must be a non-empty string` };
    }

    if (typeof university.location !== 'string' || university.location.trim() === '') {
      return { valid: false, error: `${prefix}Location must be a non-empty string` };
    }

    if (typeof university.rating !== 'number' || university.rating < 1 || university.rating > 5) {
      return { valid: false, error: `${prefix}Rating must be a number between 1 and 5` };
    }

    if (typeof university.students !== 'string' || university.students.trim() === '') {
      return { valid: false, error: `${prefix}Students must be a non-empty string` };
    }

    if (!Array.isArray(university.courses) || university.courses.length === 0) {
      return { valid: false, error: `${prefix}Courses must be a non-empty array` };
    }

    // Validate course structure (support both old and new formats)
    for (let i = 0; i < university.courses.length; i++) {
      const course = university.courses[i];

      // Check if it's the new detailed format
      if (typeof course === 'object' && course !== null) {
        // New format: object with detailed course information
        const requiredCourseFields = ['programName', 'degreeType', 'tuition', 'applicationFee', 'duration', 'successPrediction', 'tags'];
        const missingCourseFields = requiredCourseFields.filter(field => !course.hasOwnProperty(field) || course[field] === null || course[field] === undefined);

        if (missingCourseFields.length > 0) {
          return { valid: false, error: `${prefix}Course ${i + 1} missing required fields: ${missingCourseFields.join(', ')}` };
        }

        // Validate course field types
        if (typeof course.programName !== 'string' || course.programName.trim() === '') {
          return { valid: false, error: `${prefix}Course ${i + 1}: programName must be a non-empty string` };
        }

        if (typeof course.degreeType !== 'string' || course.degreeType.trim() === '') {
          return { valid: false, error: `${prefix}Course ${i + 1}: degreeType must be a non-empty string` };
        }
        
        if (typeof course.tuition !== 'string' || course.tuition.trim() === '') {
          return { valid: false, error: `${prefix}Course ${i + 1}: tuition must be a non-empty string` };
        }
        
        if (typeof course.applicationFee !== 'string') {
          return { valid: false, error: `${prefix}Course ${i + 1}: applicationFee must be a string` };
        }
        
        if (typeof course.duration !== 'string' || course.duration.trim() === '') {
          return { valid: false, error: `${prefix}Course ${i + 1}: duration must be a non-empty string` };
        }
        
        if (typeof course.successPrediction !== 'string' || course.successPrediction.trim() === '') {
          return { valid: false, error: `${prefix}Course ${i + 1}: successPrediction must be a non-empty string` };
        }
        
        if (!Array.isArray(course.tags)) {
          return { valid: false, error: `${prefix}Course ${i + 1}: tags must be an array` };
        }
      } else if (typeof course === 'string') {
        // Old format: simple string array - this is still supported
        if (course.trim() === '') {
          return { valid: false, error: `${prefix}Course ${i + 1}: course name cannot be empty` };
        }
      } else {
        return { valid: false, error: `${prefix}Course ${i + 1}: must be either a string or an object with detailed course information` };
      }
    }
    
    if (typeof university.description !== 'string' || university.description.trim() === '') {
      return { valid: false, error: `${prefix}Description must be a non-empty string` };
    }

    // Optional fields validation
    if (university.image && typeof university.image !== 'string') {
      return { valid: false, error: `${prefix}Image must be a string (URL)` };
    }
    
    if (university.isActive !== undefined && typeof university.isActive !== 'boolean') {
      return { valid: false, error: `${prefix}isActive must be a boolean` };
    }

    return { valid: true, data: university };
  };

  const addUniversityFromJson = async () => {
    setJsonError('');
    
    if (!jsonInput.trim()) {
      setJsonError('Please enter JSON data');
      return;
    }

    const validation = validateUniversityJson(jsonInput);
    
    if (!validation.valid) {
      setJsonError(validation.error);
      return;
    }

    try {
      if (validation.isArray) {
        // Handle multiple universities
        const universities = validation.data;
        let successCount = 0;
        let errorCount = 0;

        for (const university of universities) {
          try {
            const newUniversityRef = push(ref(database, 'universities'));
            await set(newUniversityRef, {
              ...university,
              image: university.image || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              isActive: university.isActive !== undefined ? university.isActive : true,
              createdAt: Date.now(),
              updatedAt: Date.now()
            });
            successCount++;
          } catch (error) {
            console.error(`Error adding university ${university.name}:`, error);
            errorCount++;
          }
        }

        setJsonInput('');
        setShowJsonUniversityForm(false);
        
        if (successCount === universities.length) {
          toast.success(`${successCount} universities added successfully!`);
        } else if (successCount > 0) {
          toast.success(`${successCount} universities added successfully. ${errorCount} failed.`);
        } else {
          toast.error('Failed to add any universities.');
        }
      } else {
        // Handle single university
        const newUniversityRef = push(ref(database, 'universities'));
        await set(newUniversityRef, {
          ...validation.data,
          image: validation.data.image || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          isActive: validation.data.isActive !== undefined ? validation.data.isActive : true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        
        toast.success('University added successfully!');
        setShowJsonUniversityForm(false);
        setJsonInput('');
      }
    } catch (error) {
      toast.error('Failed to add university.');
      setJsonError('Database error: ' + error.message);
    }
  };

  const editUniversity = (university) => {
    setEditingUniversity(university);
    setUniversityForm({
      name: university.name || '',
      country: university.country || '',
      location: university.location || '',
      rating: university.rating || 0,
      students: university.students || '',
      courses: university.courses || [],
      description: university.description || '',
      image: university.image || '',
      isActive: university.isActive !== false
    });
    setShowUniversityForm(true);
  };

  // Visual Editor Functions
  const parseJsonForVisualEditor = () => {
    console.log('parseJsonForVisualEditor called');
    setJsonError('');
    
    if (!jsonInput.trim()) {
      setJsonError('Please enter JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      console.log('JSON parsed successfully:', parsed);
      let universitiesArray = [];
      
      if (Array.isArray(parsed)) {
        universitiesArray = parsed;
        setViewMode('multiple');
      } else {
        universitiesArray = [parsed];
        setViewMode('single');
      }

      console.log('Universities array:', universitiesArray);

      // For visual editor, we'll be more lenient with validation
      // Just ensure basic structure exists
      const validatedUniversities = [];
      for (let i = 0; i < universitiesArray.length; i++) {
        const university = universitiesArray[i];
        
        // Basic validation for visual editor
        if (!university || typeof university !== 'object') {
          setJsonError(`University ${i + 1}: Must be an object`);
          return;
        }

        // Ensure required fields exist with defaults
        const validatedUniversity = {
          name: university.name || '',
          country: university.country || '',
          location: university.location || '',
          rating: typeof university.rating === 'number' ? university.rating : 5,
          students: university.students || '',
          courses: Array.isArray(university.courses) ? university.courses : [],
          description: university.description || '',
          image: university.image || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          isActive: university.isActive !== undefined ? university.isActive : true
        };

        // Validate courses structure
        if (validatedUniversity.courses.length > 0) {
          validatedUniversity.courses = validatedUniversity.courses.map(course => {
            if (typeof course === 'string') {
              // Convert old format to new format
              return {
                programName: course,
                degreeType: '',
                tuition: '',
                applicationFee: '',
                duration: '',
                successPrediction: '',
                tags: []
              };
            } else if (typeof course === 'object' && course !== null) {
              // Ensure new format has all required fields
              return {
                programName: course.programName || '',
                degreeType: course.degreeType || '',
                tuition: course.tuition || '',
                applicationFee: course.applicationFee || '',
                duration: course.duration || '',
                successPrediction: course.successPrediction || '',
                tags: Array.isArray(course.tags) ? course.tags : []
              };
            } else {
              return {
                programName: '',
                degreeType: '',
                tuition: '',
                applicationFee: '',
                duration: '',
                successPrediction: '',
                tags: []
              };
            }
          });
        }

        validatedUniversities.push(validatedUniversity);
      }

      console.log('Validated universities:', validatedUniversities);
      setParsedUniversities(validatedUniversities);
      setShowVisualEditor(true);
      console.log('Visual editor should now be visible');
    } catch (error) {
      console.error('JSON parsing error:', error);
      setJsonError(`Invalid JSON format: ${error.message}`);
    }
  };

  const toggleUniversityExpansion = (index) => {
    const newExpanded = new Set(expandedUniversities);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedUniversities(newExpanded);
  };

  const updateUniversityInVisualEditor = (index, field, value) => {
    const updatedUniversities = [...parsedUniversities];
    updatedUniversities[index] = {
      ...updatedUniversities[index],
      [field]: value
    };
    setParsedUniversities(updatedUniversities);
  };

  const updateCourseInVisualEditor = (universityIndex, courseIndex, field, value) => {
    const updatedUniversities = [...parsedUniversities];
    updatedUniversities[universityIndex].courses[courseIndex] = {
      ...updatedUniversities[universityIndex].courses[courseIndex],
      [field]: value
    };
    setParsedUniversities(updatedUniversities);
  };

  const addCourseToUniversity = (universityIndex) => {
    const updatedUniversities = [...parsedUniversities];
    updatedUniversities[universityIndex].courses.push({
      programName: '',
      degreeType: '',
      tuition: '',
      applicationFee: '',
      duration: '',
      successPrediction: '',
      tags: []
    });
    setParsedUniversities(updatedUniversities);
  };

  const removeCourseFromUniversity = (universityIndex, courseIndex) => {
    const updatedUniversities = [...parsedUniversities];
    updatedUniversities[universityIndex].courses.splice(courseIndex, 1);
    setParsedUniversities(updatedUniversities);
  };

  const saveUniversitiesFromVisualEditor = async () => {
    try {
      let successCount = 0;
      
      for (const university of parsedUniversities) {
        try {
          const newUniversityRef = push(ref(database, 'universities'));
          await set(newUniversityRef, {
            ...university,
            image: university.image || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            isActive: university.isActive !== undefined ? university.isActive : true,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
          successCount++;
        } catch (error) {
          console.error('Error adding university:', error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully added ${successCount} universit${successCount === 1 ? 'y' : 'ies'}!`);
        setShowJsonUniversityForm(false);
        setShowVisualEditor(false);
        setJsonInput('');
        setParsedUniversities([]);
        setExpandedUniversities(new Set());
      } else {
        toast.error('Failed to add universities');
      }
    } catch (error) {
      toast.error('Error saving universities');
    }
  };

  const handleCompanyUpdate = async () => {
    try {
      await updateCompanyInfo(companyForm);
      setEditingCompany(false);
      toast.success('Company information updated successfully!');
    } catch (error) {
      toast.error('Failed to update company information.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'admitted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Admitted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  // User management functions
  const generateReferralKey = () => {
    const prefix = 'AGENT';
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    return `${prefix}${randomNum}`;
  };



  const saveUser = async () => {
    try {
      if (!userForm.name || !userForm.email || (!editingUser && !userForm.password)) {
        toast.error('Please fill in all required fields.');
        return;
      }

      // Validate password requirements
      if (!editingUser && (!userForm.password || userForm.password.length < 6)) {
        toast.error('Password must be at least 6 characters long.');
        return;
      }

      if (editingUser) {
        // Update existing user
        const updateData = {
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          country: userForm.country,
          role: userForm.role,
          isActive: userForm.isActive,
          commissionPerReferral: userForm.role === 'agent' ? userForm.commissionPerReferral : 0,
          updatedAt: Date.now()
        };

        // If password is provided, update it
        if (userForm.password && userForm.password.length >= 6) {
          updateData.password = userForm.password;
        }

        await update(ref(database, `users/${editingUser.id}`), updateData);
        
        // If password was changed, also update in agents table
        if (userForm.password && userForm.password.length >= 6) {
          await changeUserPassword(editingUser.id, userForm.password);
        }
        
        // If editing an agent, also update the agents table
        if (userForm.role === 'agent' && editingUser.referralKey) {
          const agentUpdateData = {
            name: userForm.name,
            email: userForm.email,
            phone: userForm.phone,
            country: userForm.country,
            commissionPerReferral: userForm.commissionPerReferral,
            isActive: userForm.isActive,
            updatedAt: Date.now()
          };

          // If password is provided, update it in agents table too
          if (userForm.password && userForm.password.length >= 6) {
            agentUpdateData.password = userForm.password;
          }

          await update(ref(database, `agents/${editingUser.id}`), agentUpdateData);
        }
        
        toast.success('User updated successfully!');
      } else {
        // Create new user
        const userData = {
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          country: userForm.country,
          role: userForm.role,
          isActive: userForm.isActive,
          permissions: userForm.role === 'super_admin' ? {
            viewAnalytics: true,
            manageUsers: true,
            manageAgents: true,
            manageInquiries: true,
            manageUniversities: true,
            manageCompany: true,
            manageCommissions: true
          } : userForm.role === 'admin' ? {
            viewAnalytics: true,
            manageAgents: true,
            manageInquiries: true,
            manageUniversities: true,
            manageCompany: true,
            manageCommissions: true
          } : {
            viewAnalytics: false,
            manageUsers: false,
            manageAgents: false,
            manageInquiries: false,
            manageUniversities: false,
            manageCompany: false,
            manageCommissions: false
          }
        };

        // Add agent-specific data
        if (userForm.role === 'agent') {
          const referralKey = generateReferralKey();
          userData.referralKey = referralKey;
          userData.commissionPerReferral = userForm.commissionPerReferral;
        }

        // For agents, create only in agents table initially
        if (userForm.role === 'agent') {
          const agentData = {
            name: userForm.name,
            email: userForm.email,
            phone: userForm.phone,
            country: userForm.country,
            address: '',
            referralKey: userData.referralKey,
            commissionPerReferral: userForm.commissionPerReferral,
            totalReferrals: 0,
            isActive: userForm.isActive,
            password: userForm.password, // Store password temporarily for Firebase Auth creation
            createdAt: Date.now()
          };
          
          // Generate a unique UID for the agent
          const agentUid = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Save to agents table
          await set(ref(database, `agents/${agentUid}`), agentData);
          
          // Send welcome email to new agent
          try {
            await sendAgentWelcomeEmail({ ...agentData, uid: agentUid });
          } catch (emailError) {
            // Failed to send welcome email - handled silently
          }
          
          toast.success(`Agent created successfully! Referral Key: ${userData.referralKey}. Welcome email sent. Firebase Auth account will be created on first login.`);
        } else {
          // For non-agents, use the database-only approach
          const result = await createUserInDatabaseOnly(userForm.email, userForm.password, userData);
          
          if (!result.success) {
            throw new Error(result.message);
          }
          
          toast.success('User created successfully!');
        }
      }

      setShowUserForm(false);
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        phone: '',
        country: '',
        password: '',
        role: 'agent',
        isActive: true,
        commissionPerReferral: 0
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already exists. Please use a different email.');
      } else {
        toast.error('Failed to save user. Please try again.');
      }
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await remove(ref(database, `users/${userId}`));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete user.');
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await update(ref(database, `users/${userId}`), {
        isActive: !isActive,
        updatedAt: Date.now()
      });
      toast.success(`User ${!isActive ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      toast.error('Failed to update user status.');
    }
  };

  const changeUserPassword = async (userId, newPassword) => {
    try {
      // Update password in users table
      await update(ref(database, `users/${userId}`), {
        password: newPassword,
        updatedAt: Date.now()
      });

      // Also update in agents table if it's an agent
      const agentsRef = ref(database, 'agents');
      const agentsSnapshot = await get(agentsRef);
      
      if (agentsSnapshot.exists()) {
        const agents = agentsSnapshot.val();
        const agentEntry = Object.entries(agents).find(([uid, agent]) => uid === userId);
        
        if (agentEntry) {
          await update(ref(database, `agents/${userId}`), {
            password: newPassword,
            updatedAt: Date.now()
          });
        }
      }

      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error('Failed to update password.');
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      country: user.country || '',
      password: '',
      role: user.role || 'agent',
      referralKey: user.referralKey || '',
      isActive: user.isActive !== false,
      commissionPerReferral: user.commissionPerReferral || 0
    });
    setShowUserForm(true);
  };

  const handleInitializeUniversities = async () => {
    try {
      const result = await initializeUniversities();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to initialize universities');
    }
  };

  // FAQ Management Functions
  const loadFaqs = async () => {
    try {
      const faqsRef = ref(database, 'faqs');
      const snapshot = await get(faqsRef);
      
      if (snapshot.exists()) {
        const faqsData = snapshot.val();
        const faqsArray = Object.keys(faqsData).map(key => ({
          id: key,
          ...faqsData[key]
        }));
        setFaqs(faqsArray);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      toast.error('Failed to load FAQs');
    }
  };

  const toggleFaq = (faqId) => {
    const newExpanded = new Set(expandedFaqs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFaqs(newExpanded);
  };

  const handleAddFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    try {
      const faqsRef = ref(database, 'faqs');
      const newFaqRef = await push(faqsRef, {
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
        isDefault: false,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.email
      });

      const addedFaq = {
        id: newFaqRef.key,
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
        isDefault: false,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.email
      };

      setFaqs(prev => [...prev, addedFaq]);
      setNewFaq({ question: '', answer: '' });
      setIsAddingFaq(false);
      toast.success('FAQ added successfully');
    } catch (error) {
      toast.error('Failed to add FAQ');
    }
  };

  const handleEditFaq = async (faq) => {
    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    try {
      const faqRef = ref(database, `faqs/${faq.id}`);
      await update(faqRef, {
        question: editingFaq.question.trim(),
        answer: editingFaq.answer.trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.email
      });

      setFaqs(prev => prev.map(f => 
        f.id === faq.id 
          ? { ...f, question: editingFaq.question.trim(), answer: editingFaq.answer.trim() }
          : f
      ));
      setEditingFaq(null);
      toast.success('FAQ updated successfully');
    } catch (error) {
      toast.error('Failed to update FAQ');
    }
  };

  const handleDeleteFaq = async (faq) => {
    if (faq.isDefault) {
      toast.error('Cannot delete default FAQs');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      const faqRef = ref(database, `faqs/${faq.id}`);
      await remove(faqRef);

      setFaqs(prev => prev.filter(f => f.id !== faq.id));
      toast.success('FAQ deleted successfully');
    } catch (error) {
      toast.error('Failed to delete FAQ');
    }
  };

  const startEditingFaq = (faq) => {
    setEditingFaq({ ...faq });
  };

  const cancelEditingFaq = () => {
    setEditingFaq(null);
  };

  const totalInquiries = inquiries.length;
  const pendingInquiries = inquiries.filter(inq => inq.status === 'pending').length;
  const activeAgents = agents.filter(agent => agent.isActive !== false).length;
  const activeUniversities = universities.filter(uni => uni.isActive !== false).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isSuperAdmin() ? 'Super Admin' : 'Admin'} Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {userData?.name || currentUser?.email}
                {isSuperAdmin() && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Super Admin
                  </span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Role: {userRole}</p>
              <p className="text-sm text-gray-500">Last Login: {userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{totalInquiries}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingInquiries}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{activeAgents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Universities</p>
                <p className="text-2xl font-bold text-gray-900">{activeUniversities}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
                           {[
                 { id: 'overview', name: 'Overview', icon: TrendingUp },
                 { id: 'inquiries', name: 'Student Inquiries', icon: FileText },
                 { id: 'agents', name: 'Agents', icon: Users },
                 { id: 'universities', name: 'Universities', icon: Building },
                 { id: 'users', name: 'User Management', icon: UserPlus },
                 { id: 'faqs', name: 'FAQ Management', icon: HelpCircle },
                 { id: 'company', name: 'Company Profile', icon: Settings }
               ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="card">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Inquiries</h3>
                  <div className="space-y-3">
                    {inquiries.slice(0, 5).map((inquiry) => (
                      <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{inquiry.fullName}</p>
                          <p className="text-sm text-gray-500">{inquiry.courseInterested}</p>
                        </div>
                        {getStatusBadge(inquiry.status)}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Top Agents</h3>
                  <div className="space-y-3">
                    {agents.slice(0, 5).map((agent) => {
                      const agentReferrals = inquiries.filter(inq => 
                        inq.agentReferralKey === agent.referralKey
                      ).length;
                      return (
                        <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{agent.name}</p>
                            <p className="text-sm text-gray-500">{agentReferrals} referrals</p>
                          </div>
                          <span className="text-sm text-gray-500">{agent.referralKey}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div>
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by student name, email, course, or agent referral key..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                {inquirySearch && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing {filteredInquiries.length} of {inquiries.length} inquiries
                  </p>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Messages
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInquiries.map((inquiry) => (
                      <tr key={inquiry.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {inquiry.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {inquiry.email}
                            </div>
                            {inquiry.phone && (
                              <div className="text-xs text-gray-400">
                                📞 {inquiry.phone}
                              </div>
                            )}
                            {inquiry.address && (
                              <div className="text-xs text-gray-400 max-w-xs truncate" title={inquiry.address}>
                                📍 {inquiry.address}
                              </div>
                            )}
                            {inquiry.country && inquiry.state && (
                              <div className="text-xs text-gray-400">
                                🌍 {inquiry.state}, {inquiry.country}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {inquiry.messages && inquiry.messages.length > 0 ? (
                              <div>
                                <div className="text-sm text-gray-600 mb-2">
                                  {(() => {
                                    const lastMessage = inquiry.messages[inquiry.messages.length - 1];
                                    const lastMessageTime = new Date(lastMessage.submittedAt);
                                    const now = new Date();
                                    const diffInHours = (now - lastMessageTime) / (1000 * 60 * 60);
                                    const diffInDays = diffInHours / 24;
                                    
                                    if (diffInDays >= 7) {
                                      return `Last message: ${lastMessageTime.toLocaleDateString()}`;
                                    } else if (diffInDays >= 1) {
                                      const days = Math.floor(diffInDays);
                                      return `Last message: ${days} day${days > 1 ? 's' : ''} ago`;
                                    } else if (diffInHours >= 1) {
                                      const hours = Math.floor(diffInHours);
                                      return `Last message: ${hours} hour${hours > 1 ? 's' : ''} ago`;
                                    } else {
                                      const minutes = Math.floor((now - lastMessageTime) / (1000 * 60));
                                      return `Last message: ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
                                    }
                                  })()}
                                </div>
                                <button
                                  onClick={() => openMessageModal(inquiry)}
                                  className="inline-flex items-center px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  View All ({inquiry.messages.length} message{inquiry.messages.length > 1 ? 's' : ''})
                                </button>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400">
                                No messages
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            {inquiry.messages && inquiry.messages.length > 0 ? (
                              (() => {
                                const lastMessage = inquiry.messages[inquiry.messages.length - 1];
                                const agent = agents.find(agent => agent.referralKey === lastMessage.agentReferralKey);
                                return lastMessage.agentReferralKey ? (
                                  <>
                                    <div className="text-sm font-medium text-gray-900">
                                      {agent ? agent.name : 'Unknown Agent'}
                                    </div>
                                    <div className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
                                      {lastMessage.agentReferralKey}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    Direct Inquiry
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="text-sm text-gray-500">
                                No agent
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(inquiry.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {inquiry.lastMessageAt ? 
                            new Date(inquiry.lastMessageAt).toLocaleDateString() :
                            new Date(inquiry.createdAt).toLocaleDateString()
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={inquiry.status}
                            onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="admitted">Admitted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Agent Management</h2>
              </div>
              
              {/* Pending Approvals Section */}
              {agents.filter(agent => agent.needsApproval && !agent.isActive).length > 0 && (
                <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm font-medium">!</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-yellow-800">Pending Agent Approvals</h3>
                      <p className="text-sm text-yellow-700">
                        {agents.filter(agent => agent.needsApproval && !agent.isActive).length} agent(s) waiting for approval
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {agents.filter(agent => agent.needsApproval && !agent.isActive).map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {agent.name?.charAt(0)?.toUpperCase() || 'A'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                            <div className="text-sm text-gray-500">{agent.email}</div>
                            <div className="text-xs text-gray-400">Registered: {new Date(agent.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleUserStatus(agent.id, true)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => deleteUser(agent.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by agent name, email, or referral key..."
                    value={agentSearch}
                    onChange={(e) => setAgentSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                {agentSearch && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing {filteredAgents.length} of {agents.length} agents
                  </p>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referral Key
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Commission
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                      </tr>
                    </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {agent.name?.charAt(0)?.toUpperCase() || 'A'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {agent.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="text-sm text-gray-900">{agent.phone || 'No phone'}</div>
                            <div className="text-sm text-gray-500">{agent.country || 'No country'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {agent.referralKey}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {agent.commissionPerReferral}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            agent.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {agent.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'universities' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">University Management</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={handleInitializeUniversities}
                    className="btn-secondary flex items-center"
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Initialize Default Universities
                  </button>
                  <button
                    onClick={() => {
                      setShowUniversityForm(true);
                      setEditingUniversity(null);
                      setUniversityForm({
                        name: '',
                        country: '',
                        location: '',
                        rating: 0,
                        students: '',
                        courses: [],
                        description: '',
                        image: '',
                        isActive: true
                      });
                    }}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add University
                  </button>
                  <button
                    onClick={() => {
                      setShowJsonUniversityForm(true);
                      setJsonInput('');
                      setJsonError('');
                      setShowJsonStructure(false);
                    }}
                    className="btn-secondary flex items-center"
                  >
                    <FileCode className="w-4 h-4 mr-2" />
                    Add from JSON
                  </button>
                </div>
              </div>

              {/* University Form Modal */}
              {showUniversityForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        {editingUniversity ? 'Edit University' : 'Add New University'}
                      </h3>
                      <button
                        onClick={() => setShowUniversityForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            University Name *
                          </label>
                          <input
                            type="text"
                            value={universityForm.name}
                            onChange={(e) => setUniversityForm({...universityForm, name: e.target.value})}
                            className="input-field"
                            placeholder="University name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country *
                          </label>
                          <input
                            type="text"
                            value={universityForm.country}
                            onChange={(e) => setUniversityForm({...universityForm, country: e.target.value})}
                            className="input-field"
                            placeholder="Country"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={universityForm.location}
                            onChange={(e) => setUniversityForm({...universityForm, location: e.target.value})}
                            className="input-field"
                            placeholder="City, State"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating (0-5)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={universityForm.rating}
                            onChange={(e) => setUniversityForm({...universityForm, rating: parseFloat(e.target.value)})}
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Students
                        </label>
                        <input
                          type="text"
                          value={universityForm.students}
                          onChange={(e) => setUniversityForm({...universityForm, students: e.target.value})}
                          className="input-field"
                          placeholder="e.g., 50,000+"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows="3"
                          value={universityForm.description}
                          onChange={(e) => setUniversityForm({...universityForm, description: e.target.value})}
                          className="input-field"
                          placeholder="University description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={universityForm.image}
                          onChange={(e) => setUniversityForm({...universityForm, image: e.target.value})}
                          className="input-field"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={universityForm.isActive}
                          onChange={(e) => setUniversityForm({...universityForm, isActive: e.target.checked})}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                          Active
                        </label>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={() => setShowUniversityForm(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveUniversity}
                          disabled={!universityForm.name || !universityForm.country}
                          className="btn-primary disabled:opacity-50"
                        >
                          {editingUniversity ? 'Update' : 'Add'} University
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by university name, country, or location..."
                    value={universitySearch}
                    onChange={(e) => setUniversitySearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                {universitySearch && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing {filteredUniversities.length} of {universities.length} universities
                  </p>
                )}
              </div>

              {/* Universities List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        University
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUniversities.map((university) => (
                      <tr key={university.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {university.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {university.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {university.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{university.rating}</span>
                            <span className="text-yellow-400 ml-1">★</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            university.isActive !== false 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {university.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editUniversity(university)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUniversity(university.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <button
                  onClick={() => {
                    setShowUserForm(true);
                    setEditingUser(null);
                    setUserForm({
                      name: '',
                      email: '',
                      phone: '',
                      country: '',
                      password: '',
                      role: 'agent',
                      referralKey: '',
                      commissionPerReferral: 0
                    });
                  }}
                  className="btn-primary flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>


              {/* User Form Modal */}
              {showUserForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                  <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div className="mt-3">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {editingUser ? 'Edit User' : 'Add New User'}
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={userForm.name}
                            onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                            className="input-field"
                            placeholder="Enter full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                            className="input-field"
                            placeholder="Enter email address"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={userForm.phone}
                              onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                              className="input-field"
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              value={userForm.country}
                              onChange={(e) => setUserForm({...userForm, country: e.target.value})}
                              className="input-field"
                              placeholder="Enter country"
                            />
                          </div>
                        </div>

                        {!editingUser && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Password *
                            </label>
                            <input
                              type="password"
                              value={userForm.password}
                              onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                              className="input-field"
                              placeholder="Enter password"
                            />
                          </div>
                        )}

                        {editingUser && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password (Leave blank to keep current password)
                            </label>
                            <input
                              type="password"
                              value={userForm.password}
                              onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                              className="input-field"
                              placeholder="Enter new password (optional)"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Minimum 6 characters. Leave blank to keep the current password unchanged.
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role *
                          </label>
                          <select
                            value={userForm.role}
                            onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                            className="input-field"
                          >
                            <option value="agent">Agent</option>
                            <option value="admin">Admin</option>
                            {isSuperAdmin() && <option value="super_admin">Super Admin</option>}
                          </select>
                        </div>

                        {userForm.role === 'agent' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Commission Rate (%)
                              </label>
                              <input
                                type="number"
                                value={userForm.commissionPerReferral}
                                onChange={(e) => setUserForm({...userForm, commissionPerReferral: parseFloat(e.target.value) || 0})}
                                className="input-field"
                                placeholder="0"
                                step="0.1"
                                min="0"
                                max="100"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Percentage commission per admitted referral
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Referral Key {editingUser ? '(Cannot be changed)' : '(Auto-generated)'}
                              </label>
                              <input
                                type="text"
                                value={editingUser ? (userForm.referralKey || '') : (userForm.role === 'agent' ? generateReferralKey() : '')}
                                readOnly
                                className="input-field bg-gray-50 font-mono text-lg"
                                placeholder={editingUser ? "Existing referral key" : "Will be generated automatically"}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {editingUser 
                                  ? 'Referral keys cannot be changed once assigned to maintain data integrity'
                                  : 'This key will be automatically generated when the agent is created'
                                }
                              </p>
                            </div>
                          </>
                        )}

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="userIsActive"
                            checked={userForm.isActive}
                            onChange={(e) => setUserForm({...userForm, isActive: e.target.checked})}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor="userIsActive" className="ml-2 block text-sm text-gray-900">
                            Active
                          </label>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            onClick={() => setShowUserForm(false)}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveUser}
                            disabled={!userForm.name || !userForm.email || (!editingUser && !userForm.password)}
                            className="btn-primary disabled:opacity-50"
                          >
                            {editingUser ? 'Update' : 'Add'} User
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by user name, email, role, or referral key..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                {userSearch && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing {filteredUsers.length} of {users.length} users
                  </p>
                )}
              </div>

              {/* Users List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referral Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'super_admin' ? <Shield className="w-3 h-3 mr-1" /> :
                             user.role === 'admin' ? <UserCheck className="w-3 h-3 mr-1" /> :
                             <Users className="w-3 h-3 mr-1" />}
                            {user.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.role === 'agent' && user.referralKey ? (
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {user.referralKey}
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(user.referralKey);
                                  toast.success('Referral key copied!');
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive !== false 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive !== false ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editUser(user)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id, user.isActive !== false)}
                              className={`${
                                user.isActive !== false
                                  ? 'text-red-600 hover:text-red-900'
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {user.isActive !== false ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">FAQ Management</h2>
                {!isAddingFaq && (
                  <button
                    onClick={() => setIsAddingFaq(true)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add New FAQ
                  </button>
                )}
              </div>

              {/* Add New FAQ Form */}
              {isAddingFaq && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Question *
                      </label>
                      <textarea
                        value={newFaq.question}
                        onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                        className="input-field w-full text-base"
                        rows="3"
                        placeholder="Enter a clear and specific question..."
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Answer *
                      </label>
                      <textarea
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                        className="input-field w-full text-base"
                        rows="6"
                        placeholder="Provide a comprehensive and helpful answer..."
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleAddFaq}
                        className="btn-primary flex items-center gap-2 px-6 py-2 text-base"
                      >
                        <Save size={18} />
                        Save FAQ
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingFaq(false);
                          setNewFaq({ question: '', answer: '' });
                        }}
                        className="btn-secondary flex items-center gap-2 px-6 py-2 text-base"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQs List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="p-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <HelpCircle className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {editingFaq?.id === faq.id ? (
                                  <textarea
                                    value={editingFaq.question}
                                    onChange={(e) => setEditingFaq(prev => ({ ...prev, question: e.target.value }))}
                                    className="input-field w-full text-base"
                                    rows="2"
                                  />
                                ) : (
                                  faq.question
                                )}
                              </h3>
                            </div>
                            <button
                              onClick={() => toggleFaq(faq.id)}
                              className="text-gray-400 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-primary-50"
                            >
                              {expandedFaqs.has(faq.id) ? (
                                <ChevronUp size={24} />
                              ) : (
                                <ChevronDown size={24} />
                              )}
                            </button>
                          </div>

                          {/* Admin Actions */}
                          {!editingFaq && (
                            <div className="flex items-center gap-3 mt-4">
                              <button
                                onClick={() => startEditingFaq(faq)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                              {!faq.isDefault && (
                                <button
                                  onClick={() => handleDeleteFaq(faq)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              )}
                              {faq.isDefault && (
                                <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                  Default FAQ
                                </span>
                              )}
                            </div>
                          )}

                          {/* Edit Actions */}
                          {editingFaq?.id === faq.id && (
                            <div className="flex items-center gap-3 mt-4">
                              <button
                                onClick={() => handleEditFaq(faq)}
                                className="btn-primary text-xs flex items-center gap-2 px-3 py-1"
                              >
                                <Save size={14} />
                                Save Changes
                              </button>
                              <button
                                onClick={cancelEditingFaq}
                                className="btn-secondary text-xs flex items-center gap-2 px-3 py-1"
                              >
                                <X size={14} />
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* FAQ Answer */}
                      {expandedFaqs.has(faq.id) && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          {editingFaq?.id === faq.id ? (
                            <textarea
                              value={editingFaq.answer}
                              onChange={(e) => setEditingFaq(prev => ({ ...prev, answer: e.target.value }))}
                              className="input-field w-full text-base"
                              rows="6"
                            />
                          ) : (
                            <div className="prose prose-gray max-w-none">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {faqs.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <HelpCircle className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs Available</h3>
                  <p className="text-gray-600">No frequently asked questions have been added yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'company' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Company Profile</h2>
                {editingCompany ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCompanyUpdate}
                      className="btn-primary flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingCompany(false);
                        setCompanyForm(companyInfo);
                      }}
                      className="btn-secondary flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingCompany(true)}
                    className="btn-primary flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                    disabled={!editingCompany}
                    className="input-field disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                    disabled={!editingCompany}
                    className="input-field disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={companyForm.whatsapp}
                    onChange={(e) => setCompanyForm({...companyForm, whatsapp: e.target.value})}
                    disabled={!editingCompany}
                    className="input-field disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={companyForm.location}
                    onChange={(e) => setCompanyForm({...companyForm, location: e.target.value})}
                    disabled={!editingCompany}
                    className="input-field disabled:bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                    disabled={!editingCompany}
                    className="input-field disabled:bg-gray-50"
                  />
                </div>

                {/* Agent Registration Settings */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Registration Settings</h3>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="agentRegistrationEnabled"
                      checked={companyForm.agentRegistrationEnabled || false}
                      onChange={(e) => setCompanyForm({...companyForm, agentRegistrationEnabled: e.target.checked})}
                      disabled={!editingCompany}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agentRegistrationEnabled" className="text-sm font-medium text-gray-700">
                      Enable Agent Self-Registration
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Allow agents to register themselves through the registration page.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="agentRegistrationRequiresApproval"
                      checked={companyForm.agentRegistrationRequiresApproval || false}
                      onChange={(e) => setCompanyForm({...companyForm, agentRegistrationRequiresApproval: e.target.checked})}
                      disabled={!editingCompany}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agentRegistrationRequiresApproval" className="text-sm font-medium text-gray-700">
                      Require Admin Approval for New Agents
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    New agent registrations will require admin approval before they can access the dashboard.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Commission Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={companyForm.agentDefaultCommission || 10}
                    onChange={(e) => setCompanyForm({...companyForm, agentDefaultCommission: parseInt(e.target.value) || 10})}
                    disabled={!editingCompany}
                    className="input-field disabled:bg-gray-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">Default commission percentage for new agents</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Disabled Message
                  </label>
                  <textarea
                    value={companyForm.agentRegistrationMessage || ''}
                    onChange={(e) => setCompanyForm({...companyForm, agentRegistrationMessage: e.target.value})}
                    disabled={!editingCompany}
                    rows="3"
                    className="input-field disabled:bg-gray-50"
                    placeholder="Message shown when registration is disabled"
                  />
                  <p className="text-sm text-gray-500 mt-1">Message displayed when agent registration is disabled</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={closeMessageModal}
        inquiry={messageModal.inquiry}
      />

      {/* JSON University Form Modal - AT COMPONENT ROOT */}
      {showJsonUniversityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Add University from JSON
              </h3>
              <button
                onClick={() => {
                  setShowJsonUniversityForm(false);
                  setJsonInput('');
                  setJsonError('');
                  setShowJsonStructure(false);
                  setShowVisualEditor(false);
                  setParsedUniversities([]);
                  setExpandedUniversities(new Set());
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!showVisualEditor ? (
              // JSON Input Mode
              <div className="space-y-4">
                {/* JSON Structure Display */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <button
                    onClick={() => setShowJsonStructure(!showJsonStructure)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-sm font-medium text-gray-700">
                      JSON Structure (Supports Single or Multiple Universities)
                    </h4>
                    {showJsonStructure ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  
                  {showJsonStructure && (
                    <div className="space-y-4 mt-4">
                      {/* Single University Format */}
                      <div>
                        <h5 className="text-xs font-semibold text-gray-600 mb-1">Single University:</h5>
                        <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
{`{
  "name": "University Name",
  "country": "Country Name", 
  "location": "City, State/Province",
  "rating": 5,
  "students": "24,000+",
  "courses": [
    {
      "programName": "Master of Laws - International Law",
      "degreeType": "Master's",
      "tuition": "£17,500 GBP",
      "applicationFee": "Free",
      "duration": "12 months",
      "successPrediction": "Very High",
      "tags": ["Scholarships", "Prime", "Fast Acceptance"]
    }
  ],
  "description": "University description...",
  "image": "https://example.com/image.jpg",
  "isActive": true
}`}
                        </pre>
                      </div>

                      {/* Multiple Universities Format */}
                      <div>
                        <h5 className="text-xs font-semibold text-gray-600 mb-1">Multiple Universities (Array):</h5>
                        <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
{`[
  {
    "name": "University 1",
    "country": "Country 1",
    "location": "City 1",
    "rating": 5,
    "students": "24,000+",
    "courses": [...],
    "description": "Description 1..."
  },
  {
    "name": "University 2",
    "country": "Country 2", 
    "location": "City 2",
    "rating": 4,
    "students": "18,000+",
    "courses": [...],
    "description": "Description 2..."
  }
]`}
                        </pre>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Note: Courses can also be simple strings for backward compatibility.
                      </p>
                    </div>
                  )}
                </div>

                {/* JSON Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    JSON Data *
                  </label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => {
                      setJsonInput(e.target.value);
                      setJsonError('');
                    }}
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    placeholder="Paste your university JSON data here..."
                  />
                </div>

                {/* Error Display */}
                {jsonError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm text-red-700 font-medium">Error:</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{jsonError}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowJsonUniversityForm(false);
                      setJsonInput('');
                      setJsonError('');
                      setShowJsonStructure(false);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const testJson = `[
  {
    "name": "Massey University",
    "country": "New Zealand",
    "location": "Greater London, UK",
    "rating": 5,
    "students": "24,000+",
    "courses": [
      {
        "programName": "Master of Science - Big Data Technologies (Quantitative)",
        "degreeType": "Master's Degree",
        "tuition": "£18,100 GBP",
        "applicationFee": "Free",
        "duration": "12 months",
        "successPrediction": "Jan 2026: High, Feb 2026: Average, Sep 2026: High",
        "tags": ["High Job Demand"]
      }
    ],
    "description": "Massey University offers specialized Master's programs in data science, environmental management, and fashion business with strong industry connections and practical outcomes.",
    "image": "https://www.massey.ac.nz/logo.png",
    "isActive": true
  }
]`;
                      setJsonInput(testJson);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <FileCode className="w-4 h-4 mr-2" />
                    Load Test Data
                  </button>
                  <button
                    onClick={parseJsonForVisualEditor}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview & Edit
                  </button>
                  <button
                    onClick={addUniversityFromJson}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Directly
                  </button>
                </div>
              </div>
            ) : (
              // Visual Editor Mode
              <div className="space-y-4">
                {/* Header with View Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h4 className="text-md font-medium text-gray-800">
                      Visual Editor ({parsedUniversities.length} universit{parsedUniversities.length === 1 ? 'y' : 'ies'})
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">View Mode:</span>
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('single')}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            viewMode === 'single' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Single
                        </button>
                        <button
                          onClick={() => setViewMode('multiple')}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            viewMode === 'multiple' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Multiple
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowVisualEditor(false);
                      setParsedUniversities([]);
                      setExpandedUniversities(new Set());
                    }}
                    className="text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <EyeOff className="w-4 h-4 mr-1" />
                    Back to JSON
                  </button>
                </div>

                {/* University List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {parsedUniversities.map((university, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      {/* University Header */}
                      <div className="bg-gray-50 p-4 rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleUniversityExpansion(index)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedUniversities.has(index) ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </button>
                            {/* University Image Thumbnail */}
                            <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                              <img
                                src={university.image || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                                alt="University"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={university.name}
                                onChange={(e) => updateUniversityInVisualEditor(index, 'name', e.target.value)}
                                className="text-lg font-semibold bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                                placeholder="University Name"
                              />
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-500">{university.country}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm text-gray-500">{university.location}</span>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-sm ${i < university.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {university.courses?.length || 0} courses
                            </span>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">Active:</span>
                              <button
                                onClick={() => updateUniversityInVisualEditor(index, 'isActive', !university.isActive)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                {university.isActive ? (
                                  <ToggleRight className="w-5 h-5 text-green-500" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* University Details (Collapsible) */}
                      {expandedUniversities.has(index) && (
                        <div className="p-4 space-y-4">
                          {/* Basic Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                              <input
                                type="text"
                                value={university.country}
                                onChange={(e) => updateUniversityInVisualEditor(index, 'country', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Country"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={university.location}
                                onChange={(e) => updateUniversityInVisualEditor(index, 'location', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="City, State/Province"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                              <input
                                type="number"
                                min="1"
                                max="5"
                                value={university.rating}
                                onChange={(e) => updateUniversityInVisualEditor(index, 'rating', parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Students</label>
                              <input
                                type="text"
                                value={university.students}
                                onChange={(e) => updateUniversityInVisualEditor(index, 'students', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g., 24,000+"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={university.description}
                              onChange={(e) => updateUniversityInVisualEditor(index, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              rows="3"
                              placeholder="University description..."
                            />
                          </div>

                          {/* Image URL */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <div className="flex items-center space-x-3">
                              <input
                                type="url"
                                value={university.image}
                                onChange={(e) => updateUniversityInVisualEditor(index, 'image', e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="https://example.com/image.jpg"
                              />
                              <button
                                onClick={() => updateUniversityInVisualEditor(index, 'image', 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                              >
                                Use Default
                              </button>
                            </div>
                            {/* Image Preview */}
                            <div className="mt-2">
                              <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                                <img
                                  src={university.image || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                                  alt="University preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                                  }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {university.image ? 'Current image preview' : 'Default university image'}
                              </p>
                            </div>
                          </div>

                          {/* Courses Section */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-medium text-gray-700">Courses ({university.courses?.length || 0})</h5>
                              <button
                                onClick={() => addCourseToUniversity(index)}
                                className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors flex items-center"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Course
                              </button>
                            </div>

                            <div className="space-y-3">
                              {university.courses?.map((course, courseIndex) => (
                                <div key={courseIndex} className="bg-gray-50 p-3 rounded-md">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">Course {courseIndex + 1}</span>
                                    <button
                                      onClick={() => removeCourseFromUniversity(index, courseIndex)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Program Name</label>
                                      <input
                                        type="text"
                                        value={course.programName}
                                        onChange={(e) => updateCourseInVisualEditor(index, courseIndex, 'programName', e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Program Name"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Degree Type</label>
                                      <input
                                        type="text"
                                        value={course.degreeType}
                                        onChange={(e) => updateCourseInVisualEditor(index, courseIndex, 'degreeType', e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Master's Degree"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Tuition</label>
                                      <input
                                        type="text"
                                        value={course.tuition}
                                        onChange={(e) => updateCourseInVisualEditor(index, courseIndex, 'tuition', e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="£18,100 GBP"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Application Fee</label>
                                      <input
                                        type="text"
                                        value={course.applicationFee}
                                        onChange={(e) => updateCourseInVisualEditor(index, courseIndex, 'applicationFee', e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Free"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                                      <input
                                        type="text"
                                        value={course.duration}
                                        onChange={(e) => updateCourseInVisualEditor(index, courseIndex, 'duration', e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="12 months"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">Success Prediction</label>
                                      <input
                                        type="text"
                                        value={course.successPrediction}
                                        onChange={(e) => updateCourseInVisualEditor(index, courseIndex, 'successPrediction', e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Jan 2026: High, Feb 2026: Average"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
                                    <input
                                      type="text"
                                      value={Array.isArray(course.tags) ? course.tags.join(', ') : course.tags}
                                      onChange={(e) => {
                                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                                        updateCourseInVisualEditor(index, courseIndex, 'tags', tags);
                                      }}
                                      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      placeholder="High Job Demand, Fast Acceptance"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowVisualEditor(false);
                      setParsedUniversities([]);
                      setExpandedUniversities(new Set());
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveUniversitiesFromVisualEditor}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save {parsedUniversities.length} Universit{parsedUniversities.length === 1 ? 'y' : 'ies'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 