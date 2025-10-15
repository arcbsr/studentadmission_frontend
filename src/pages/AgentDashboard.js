import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../firebase/config';
import { ref, get, onValue } from 'firebase/database';
import { Users, DollarSign, Copy, CheckCircle, Clock, XCircle, Search, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import MessageModal from '../components/MessageModal';

const AgentDashboard = () => {
  const { currentUser } = useAuth();
  const [agentInfo, setAgentInfo] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [messageModal, setMessageModal] = useState({ isOpen: false, inquiry: null });

  useEffect(() => {
    const fetchAgentData = async (retryCount = 0) => {
      if (!currentUser) return;

      try {
        setLoading(true);
        let agent = null;

        // First, try to find agent in the agents table
        const agentsRef = ref(database, 'agents');
        const agentsSnapshot = await get(agentsRef);
        
        if (agentsSnapshot.exists()) {
          const agents = agentsSnapshot.val();
          const agentEntry = Object.entries(agents).find(
            ([id, agentData]) => agentData.email === currentUser.email
          );
          
          if (agentEntry) {
            const [agentId, agentData] = agentEntry;
            agent = {
              ...agentData,
              uid: agentId
            };
          }
        }

        // If not found in agents table, try users table
        if (!agent) {
          const usersRef = ref(database, 'users');
          const usersSnapshot = await get(usersRef);
          
          if (usersSnapshot.exists()) {
            const users = usersSnapshot.val();
            const userEntry = Object.entries(users).find(
              ([id, userData]) => userData.email === currentUser.email && userData.role === 'agent'
            );
            
            if (userEntry) {
              const [userId, userData] = userEntry;
              agent = {
                ...userData,
                uid: userId
              };
            }
          }
        }
        
        if (agent) {
          setAgentInfo(agent);
        } else {
          // Retry up to 3 times with a delay
          if (retryCount < 3) {
            setTimeout(() => {
              fetchAgentData(retryCount + 1);
            }, 1000 * (retryCount + 1)); // 1s, 2s, 3s delays
            return;
          }
          
          // After 3 retries, show error
          toast.error('Agent profile not found. Please contact admin.');
          setLoading(false);
          return;
        }

        // Listen for referrals
        const inquiriesRef = ref(database, 'inquiries');
        const unsubscribe = onValue(inquiriesRef, (snapshot) => {
          if (snapshot.exists()) {
            const inquiries = snapshot.val();
            const agentReferrals = Object.entries(inquiries)
              .filter(([id, inquiry]) => {
                // Check if any message in the inquiry has this agent's referral key
                if (inquiry.messages && Array.isArray(inquiry.messages)) {
                  return inquiry.messages.some(message => 
                    message.agentReferralKey === agent?.referralKey
                  );
                }
                // Fallback for legacy inquiries that might have agentReferralKey at inquiry level
                return inquiry.agentReferralKey === agent?.referralKey;
              })
              .map(([id, inquiry]) => ({
                id,
                ...inquiry
              }))
              .sort((a, b) => b.createdAt - a.createdAt);
            
            setReferrals(agentReferrals);
          } else {
            setReferrals([]);
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        // Handle agent data fetch error silently
        if (retryCount < 3) {
          setTimeout(() => {
            fetchAgentData(retryCount + 1);
          }, 1000 * (retryCount + 1));
          return;
        }
        
        toast.error('Failed to load agent data');
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [currentUser]);

  // Filter referrals based on search and status
  useEffect(() => {
    let filtered = referrals;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(referral => {
        const searchLower = searchTerm.toLowerCase();
        
        // Check basic fields
        const basicMatch = 
          referral.fullName?.toLowerCase().includes(searchLower) ||
          referral.email?.toLowerCase().includes(searchLower);
        
        if (basicMatch) return true;
        
        // Check course information in messages
        if (referral.messages && Array.isArray(referral.messages)) {
          return referral.messages.some(message => 
            message.courseInterested?.toLowerCase().includes(searchLower)
          );
        }
        
        // Fallback for legacy inquiries
        return referral.courseInterested?.toLowerCase().includes(searchLower);
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(referral => referral.status === statusFilter);
    }

    setFilteredReferrals(filtered);
  }, [referrals, searchTerm, statusFilter]);

  const copyReferralKey = () => {
    const referralKey = agentInfo?.referralKey || agentInfo?.referral_key;
    if (referralKey) {
      navigator.clipboard.writeText(referralKey);
      toast.success('Referral key copied to clipboard!');
    } else {
      toast.error('No referral key available to copy');
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

  const openMessageModal = (inquiry) => {
    setMessageModal({ isOpen: true, inquiry });
  };

  const closeMessageModal = () => {
    setMessageModal({ isOpen: false, inquiry: null });
  };

  const totalReferrals = referrals.length;
  const admittedReferrals = referrals.filter(ref => ref.status === 'admitted').length;
  const pendingReferrals = referrals.filter(ref => ref.status === 'pending').length;
  const rejectedReferrals = referrals.filter(ref => ref.status === 'rejected').length;
  
  // Calculate commission as percentage (assuming a base amount per admitted student)
  const baseAmountPerAdmission = 100; // Base amount per admitted student
  const commissionPercentage = agentInfo?.commissionPerReferral || 0;
  const totalCommission = admittedReferrals * (baseAmountPerAdmission * commissionPercentage / 100);
  // Calculate average commission per admitted referral (for future use)
  // const averageCommission = admittedReferrals > 0 ? totalCommission / admittedReferrals : 0;

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
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600">Welcome back, {agentInfo?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admitted</p>
                <p className="text-2xl font-bold text-gray-900">{admittedReferrals}</p>
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
                <p className="text-2xl font-bold text-gray-900">{pendingReferrals}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Commission</p>
                <p className="text-2xl font-bold text-gray-900">${totalCommission.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{commissionPercentage}% of ${baseAmountPerAdmission} per admission</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedReferrals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Key Section */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Referral Key</h2>
          {agentInfo?.referralKey || agentInfo?.referral_key || agentInfo?.referralKey ? (
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={agentInfo.referralKey || agentInfo.referral_key || ''}
                  readOnly
                  className="input-field bg-gray-50 font-mono text-lg"
                />
              </div>
              <button
                onClick={copyReferralKey}
                className="btn-primary flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>No referral key found.</strong> Please contact the administrator to get your referral key assigned.
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                Debug info: Agent data available: {agentInfo ? 'Yes' : 'No'}, 
                Referral key fields: referralKey={agentInfo?.referralKey}, 
                referral_key={agentInfo?.referral_key}
              </p>
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-900">Commission Rate</p>
              <p className="text-blue-700">{agentInfo?.commissionPerReferral || 0}% per admitted referral</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium text-green-900">Total Earnings</p>
              <p className="text-green-700">${totalCommission.toFixed(2)} from {admittedReferrals} admitted referrals</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="font-medium text-purple-900">Success Rate</p>
              <p className="text-purple-700">
                {totalReferrals > 0 ? Math.round((admittedReferrals / totalReferrals) * 100) : 0}% 
                ({admittedReferrals}/{totalReferrals})
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Share this key with students to track your referrals and earn commissions. 
            Students can use this key when submitting their inquiry form.
          </p>
        </div>

        {/* Referrals List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Referrals</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search referrals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="admitted">Admitted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No referrals yet. Share your referral key to start earning!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredReferrals.length} of {referrals.length} referrals
                {searchTerm && ` matching "${searchTerm}"`}
                {statusFilter !== 'all' && ` with status "${statusFilter}"`}
              </div>
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
                      Messages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReferrals.map((referral) => (
                    <tr key={referral.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {referral.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {referral.email}
                          </div>
                          {referral.phone && (
                            <div className="text-xs text-gray-400">
                              📞 {referral.phone}
                            </div>
                          )}
                          {referral.address && (
                            <div className="text-xs text-gray-400 max-w-xs truncate" title={referral.address}>
                              📍 {referral.address}
                            </div>
                          )}
                          {referral.country && referral.state && (
                            <div className="text-xs text-gray-400">
                              🌍 {referral.state}, {referral.country}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {(() => {
                            // Get course from the latest message that has course information
                            if (referral.messages && Array.isArray(referral.messages)) {
                              const latestMessage = referral.messages[referral.messages.length - 1];
                              return latestMessage?.courseInterested || 'Not specified';
                            }
                            // Fallback for legacy inquiries
                            return referral.courseInterested || 'Not specified';
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {referral.messages && referral.messages.length > 0 ? (
                            <div>
                              <div className="text-sm text-gray-600 mb-2">
                                {(() => {
                                  const lastMessage = referral.messages[referral.messages.length - 1];
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
                                onClick={() => openMessageModal(referral)}
                                className="inline-flex items-center px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                              >
                                <MessageSquare className="w-3 h-3 mr-1" />
                                View All ({referral.messages.length} message{referral.messages.length > 1 ? 's' : ''})
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
                        {getStatusBadge(referral.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {referral.status === 'admitted' ? `${agentInfo?.commissionPerReferral || 0}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </div>
  );
};

export default AgentDashboard; 