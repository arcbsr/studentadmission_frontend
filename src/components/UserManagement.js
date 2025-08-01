import React, { useState, useEffect } from 'react';
import { database } from '../firebase/config';
import { ref, onValue, update, remove } from 'firebase/database';
import { Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
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

    return unsubscribe;
  }, []);

  const updateUserRole = async (userId, newRole) => {
    try {
      await update(ref(database, `users/${userId}`), {
        role: newRole,
        updatedAt: Date.now()
      });
      toast.success('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role.');
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await update(ref(database, `users/${userId}`), {
        isActive: !isActive,
        updatedAt: Date.now()
      });
      toast.success(`User ${isActive ? 'disabled' : 'enabled'} successfully!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status.');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await remove(ref(database, `users/${userId}`));
        toast.success('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user.');
      }
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      super_admin: { color: 'bg-purple-100 text-purple-800', text: 'Super Admin' },
      admin: { color: 'bg-blue-100 text-blue-800', text: 'Admin' },
      agent: { color: 'bg-green-100 text-green-800', text: 'Agent' }
    };
    
    const badge = badges[role] || { color: 'bg-gray-100 text-gray-800', text: role };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive !== false 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive !== false ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

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
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.isActive)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                      disabled={user.role === 'super_admin'}
                    >
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                    
                    <button
                      onClick={() => toggleUserStatus(user.id, user.isActive !== false)}
                      className={`px-2 py-1 rounded text-xs ${
                        user.isActive !== false
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      disabled={user.role === 'super_admin'}
                    >
                      {user.isActive !== false ? 'Disable' : 'Enable'}
                    </button>
                    
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={user.role === 'super_admin'}
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

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Note:</strong> Super Admin users cannot be modified or deleted for security reasons.</p>
      </div>
    </div>
  );
};

export default UserManagement; 