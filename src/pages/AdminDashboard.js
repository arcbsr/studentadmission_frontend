import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import { database, auth } from '../firebase/config';
import { ref, update, onValue, push, set, remove } from 'firebase/database';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { initializeUniversities } from '../utils/initializeUniversities';

const AdminDashboard = () => {
  const { currentUser, userRole, userData, isSuperAdmin } = useAuth();
  const { companyInfo, updateCompanyInfo } = useCompany();
  const [activeTab, setActiveTab] = useState('overview');
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
  
  // Commission editing state
  const [editingCommission, setEditingCommission] = useState(null);
  const [commissionValue, setCommissionValue] = useState('');
  
  // University management
  const [showUniversityForm, setShowUniversityForm] = useState(false);
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

  // User management
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
    isActive: true,
    commissionPerReferral: 0
  });

  useEffect(() => {
    const fetchData = () => {
      // Listen for inquiries
      const inquiriesRef = ref(database, 'inquiries');
      const inquiriesUnsubscribe = onValue(inquiriesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const inquiriesList = Object.entries(data).map(([id, inquiry]) => ({
            id,
            ...inquiry
          })).sort((a, b) => b.createdAt - a.createdAt);
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
                referralKey: user.referralKey,
                commissionPerReferral: user.commissionPerReferral,
                isActive: user.isActive,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
              }));
            
            // Combine agents from both tables, prioritizing agents table
            const agentsMap = new Map();
            
            // First, add agents from agents table
            agentsList.forEach(agent => {
              agentsMap.set(agent.referralKey, {
                ...agent,
                sourceTable: 'agents'
              });
            });
            
            // Then, add agents from users table (only if not already in agents table)
            userAgents.forEach(agent => {
              if (!agentsMap.has(agent.referralKey)) {
                agentsMap.set(agent.referralKey, {
                  ...agent,
                  sourceTable: 'users'
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
  
  // Filter data based on search terms
  useEffect(() => {
    // Filter inquiries
    const filtered = inquiries.filter(inquiry =>
      inquiry.fullName?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inquiry.courseInterested?.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inquiry.agentReferralKey?.toLowerCase().includes(inquirySearch.toLowerCase())
    );
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
      await update(ref(database, `inquiries/${inquiryId}`), {
        status: newStatus,
        updatedAt: Date.now()
      });
      toast.success('Inquiry status updated successfully!');
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast.error('Failed to update inquiry status.');
    }
  };

  const updateAgentCommission = async (agentId, commission) => {
    try {
      // Find the agent to determine which table to update
      const agent = agents.find(a => a.id === agentId);
      
      if (!agent) {
        toast.error('Agent not found!');
        return;
      }
      
      console.log('Updating commission for agent:', agent.name, 'in table:', agent.sourceTable, 'ID:', agentId);
      
      // Update based on source table
      if (agent.sourceTable === 'agents') {
        await update(ref(database, `agents/${agentId}`), {
          commissionPerReferral: commission,
          updatedAt: Date.now()
        });
        console.log('Updated in agents table');
      } else {
        await update(ref(database, `users/${agentId}`), {
          commissionPerReferral: commission,
          updatedAt: Date.now()
        });
        console.log('Updated in users table');
      }
      
      toast.success('Agent commission updated successfully!');
    } catch (error) {
      console.error('Error updating agent commission:', error);
      toast.error('Failed to update agent commission.');
    }
  };

  const startEditCommission = (agent) => {
    setEditingCommission(agent.id);
    setCommissionValue(agent.commissionPerReferral || 0);
  };

  const saveCommission = async () => {
    if (editingCommission && commissionValue !== '') {
      console.log('Saving commission:', commissionValue, 'for agent ID:', editingCommission);
      console.log('Current agents state:', agents);
      const agent = agents.find(a => a.id === editingCommission);
      console.log('Found agent:', agent);
      
      await updateAgentCommission(editingCommission, parseFloat(commissionValue));
      setEditingCommission(null);
      setCommissionValue('');
    }
  };

  const cancelEditCommission = () => {
    setEditingCommission(null);
    setCommissionValue('');
  };

  const toggleAgentStatus = async (agentId, isActive) => {
    try {
      await update(ref(database, `agents/${agentId}`), {
        isActive: !isActive,
        updatedAt: Date.now()
      });
      toast.success(`Agent ${isActive ? 'disabled' : 'enabled'} successfully!`);
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast.error('Failed to update agent status.');
    }
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
      console.error('Error saving university:', error);
      toast.error('Failed to save university.');
    }
  };

  const deleteUniversity = async (universityId) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      try {
        await remove(ref(database, `universities/${universityId}`));
        toast.success('University deleted successfully!');
      } catch (error) {
        console.error('Error deleting university:', error);
        toast.error('Failed to delete university.');
      }
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

  const handleCompanyUpdate = async () => {
    try {
      await updateCompanyInfo(companyForm);
      setEditingCompany(false);
      toast.success('Company information updated successfully!');
    } catch (error) {
      console.error('Error updating company info:', error);
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
    const prefix = 'AGT-RNB';
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}${randomNum}`;
  };

  const saveUser = async () => {
    try {
      if (!userForm.name || !userForm.email || (!editingUser && !userForm.password)) {
        toast.error('Please fill in all required fields.');
        return;
      }

      if (editingUser) {
        // Update existing user
        await update(ref(database, `users/${editingUser.id}`), {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          isActive: userForm.isActive,
          commissionPerReferral: userForm.role === 'agent' ? userForm.commissionPerReferral : 0,
          updatedAt: Date.now()
        });
        toast.success('User updated successfully!');
      } else {
        // Create new user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userForm.email,
          userForm.password
        );

        const newUser = {
          uid: userCredential.user.uid,
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          isActive: userForm.isActive,
          createdAt: Date.now(),
          lastLogin: null,
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
          newUser.referralKey = referralKey;
          newUser.commissionPerReferral = userForm.commissionPerReferral;
          
          // Also create entry in agents table for compatibility
          const agentData = {
            uid: userCredential.user.uid,
            name: userForm.name,
            email: userForm.email,
            phone: '',
            address: '',
            referralKey: referralKey,
            commissionPerReferral: userForm.commissionPerReferral,
            totalReferrals: 0,
            isActive: userForm.isActive,
            createdAt: Date.now()
          };
          
          await set(ref(database, `agents/${userCredential.user.uid}`), agentData);
          
          toast.success(`Agent created successfully! Referral Key: ${referralKey}`);
        } else {
          toast.success('User created successfully!');
        }

        // Save to database
        await set(ref(database, `users/${userCredential.user.uid}`), newUser);

        // Update Firebase Auth profile
        await updateProfile(userCredential.user, {
          displayName: userForm.name
        });

        toast.success('User created successfully!');
      }

      setShowUserForm(false);
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'agent',
        isActive: true,
        commissionPerReferral: 0
      });
    } catch (error) {
      console.error('Error saving user:', error);
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
      console.error('Error deleting user:', error);
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
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status.');
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'agent',
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
      console.error('Error initializing universities:', error);
      toast.error('Failed to initialize universities');
    }
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
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
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
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {inquiry.courseInterested}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            {inquiry.agentReferralKey ? (
                              (() => {
                                const agent = agents.find(agent => agent.referralKey === inquiry.agentReferralKey);
                                return agent ? (
                                  <>
                                    <div className="text-sm font-medium text-gray-900">
                                      {agent.name}
                                    </div>
                                    <div className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
                                      {inquiry.agentReferralKey}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-sm text-gray-500">
                                      Unknown Agent
                                    </div>
                                    <div className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
                                      {inquiry.agentReferralKey}
                                    </div>
                                  </>
                                );
                              })()
                            ) : (
                              <div className="text-sm text-gray-500">
                                Direct Inquiry
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            {inquiry.message ? (
                              <div className="text-sm text-gray-600 max-w-xs truncate" title={inquiry.message}>
                                {inquiry.message}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400">
                                No message
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(inquiry.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Agent Management</h2>
              
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
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referral Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referrals
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
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
                    {filteredAgents.map((agent) => {
                      const agentReferrals = inquiries.filter(inq => 
                        inq.agentReferralKey === agent.referralKey
                      );
                      const admittedReferrals = agentReferrals.filter(ref => ref.status === 'admitted').length;
                      return (
                        <tr key={agent.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {agent.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {agent.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {agent.referralKey}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {agentReferrals.length} total, {admittedReferrals} admitted
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingCommission === agent.id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={commissionValue}
                                  onChange={(e) => setCommissionValue(e.target.value)}
                                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-20"
                                  min="0"
                                  step="0.01"
                                />
                                <span className="text-sm text-gray-500">per referral</span>
                                <button
                                  onClick={saveCommission}
                                  className="text-green-600 hover:text-green-800"
                                  title="Save"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={cancelEditCommission}
                                  className="text-red-600 hover:text-red-800"
                                  title="Cancel"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-900">
                                  ${agent.commissionPerReferral || 0}
                                </span>
                                <span className="text-sm text-gray-500">per referral</span>
                                <button
                                  onClick={() => startEditCommission(agent)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit Commission"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              agent.isActive !== false 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {agent.isActive !== false ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => toggleAgentStatus(agent.id, agent.isActive !== false)}
                              className={`px-3 py-1 rounded text-xs ${
                                agent.isActive !== false
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {agent.isActive !== false ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
                      password: '',
                      role: 'agent',
                      isActive: true,
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
                                Commission per Referral
                              </label>
                              <input
                                type="number"
                                value={userForm.commissionPerReferral}
                                onChange={(e) => setUserForm({...userForm, commissionPerReferral: parseFloat(e.target.value) || 0})}
                                className="input-field"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Referral Key (Auto-generated)
                              </label>
                              <input
                                type="text"
                                value={userForm.role === 'agent' ? generateReferralKey() : ''}
                                readOnly
                                className="input-field bg-gray-50 font-mono text-lg"
                                placeholder="Will be generated automatically"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                This key will be automatically generated when the agent is created
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 