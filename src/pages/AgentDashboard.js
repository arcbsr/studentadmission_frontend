import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../firebase/config';
import { ref, get, onValue } from 'firebase/database';
import { Users, DollarSign, Copy, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AgentDashboard = () => {
  const { currentUser } = useAuth();
  const [agentInfo, setAgentInfo] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        // Get agent info from both users and agents tables
        let agent = null;
        
        // First try to get from agents table
        const agentsRef = ref(database, 'agents');
        const agentsSnapshot = await get(agentsRef);
        if (agentsSnapshot.exists()) {
          const agents = agentsSnapshot.val();
          agent = Object.values(agents).find(
            agent => agent.email === currentUser.email
          );
        }
        
        // If not found in agents table, try users table
        if (!agent) {
          const usersRef = ref(database, 'users');
          const usersSnapshot = await get(usersRef);
          if (usersSnapshot.exists()) {
            const users = usersSnapshot.val();
            const user = Object.values(users).find(
              user => user.email === currentUser.email && user.role === 'agent'
            );
            if (user) {
              agent = {
                ...user,
                uid: user.uid || Object.keys(users).find(key => users[key].email === currentUser.email)
              };
            }
          }
        }
        
        if (agent) {
          setAgentInfo(agent);
        } else {
          console.error('Agent not found in database');
          toast.error('Agent profile not found. Please contact admin.');
        }

        // Listen for referrals
        const inquiriesRef = ref(database, 'inquiries');
        const unsubscribe = onValue(inquiriesRef, (snapshot) => {
          if (snapshot.exists()) {
            const inquiries = snapshot.val();
            const agentReferrals = Object.entries(inquiries)
              .filter(([id, inquiry]) => 
                inquiry.agentReferralKey === agentInfo?.referralKey
              )
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
        console.error('Error fetching agent data:', error);
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [currentUser, agentInfo?.referralKey]);

  // Filter referrals based on search and status
  useEffect(() => {
    let filtered = referrals;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(referral =>
        referral.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.courseInterested?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(referral => referral.status === statusFilter);
    }

    setFilteredReferrals(filtered);
  }, [referrals, searchTerm, statusFilter]);

  const copyReferralKey = () => {
    if (agentInfo?.referralKey) {
      navigator.clipboard.writeText(agentInfo.referralKey);
      toast.success('Referral key copied to clipboard!');
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

  const totalReferrals = referrals.length;
  const admittedReferrals = referrals.filter(ref => ref.status === 'admitted').length;
  const pendingReferrals = referrals.filter(ref => ref.status === 'pending').length;
  const rejectedReferrals = referrals.filter(ref => ref.status === 'rejected').length;
  const totalCommission = admittedReferrals * (agentInfo?.commissionPerReferral || 0);
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
                <p className="text-2xl font-bold text-gray-900">${totalCommission}</p>
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
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={agentInfo?.referralKey || ''}
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-900">Commission Rate</p>
              <p className="text-blue-700">${agentInfo?.commissionPerReferral || 0} per admitted referral</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium text-green-900">Total Earnings</p>
              <p className="text-green-700">${totalCommission} from {admittedReferrals} admitted referrals</p>
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
                          {referral.courseInterested}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(referral.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {referral.status === 'admitted' ? `$${agentInfo?.commissionPerReferral || 0}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard; 