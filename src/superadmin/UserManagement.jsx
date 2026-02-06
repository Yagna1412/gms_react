import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Filter,
  UserPlus,
  Shield,
  Lock,
  Unlock,
  Edit,
  Key,
  Clock,
  MapPin,
  Trash2,
  Download
} from 'lucide-react';

export default function UserManagement() {
  const { users, branches, addUser, updateUser, deleteUser, resetUserPassword, toggleUserLock } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    accountValidity: 365,
    mfaEnabled: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const filteredUsers = users.filter(user => {
    if (user.status === 'Deleted') return false;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to deactivate user: ${name}?`)) {
      deleteUser(id);
      toast.success(`User ${name} deactivated successfully`);
    }
  };

  const handleResetPassword = (id, email) => {
    if (window.confirm(`Reset password for ${email}? User will receive reset email.`)) {
      resetUserPassword(id);
      toast.success('Password reset email sent successfully');
    }
  };

  const handleToggleLock = (id, name, currentStatus) => {
    const action = currentStatus === 'Locked' ? 'unlock' : 'lock';
    if (window.confirm(`Are you sure you want to ${action} user: ${name}?`)) {
      toggleUserLock(id);
      toast.success(`User ${name} ${action}ed successfully`);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '', // Password optional when editing
      accountValidity: user.accountValidity || 365,
      mfaEnabled: user.mfaEnabled || false
    });
    setShowCreateModal(true);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newUser.name.trim()) {
      errors.name = 'Full name is required';
    } else if (newUser.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!newUser.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(newUser.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!newUser.role) {
      errors.role = 'Please select a user role';
    }

    if (!editingUser && !newUser.password) {
      errors.password = 'Temporary password is required';
    } else if (newUser.password) {
      if (newUser.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(newUser.password)) {
        errors.password = 'Password must include at least one uppercase letter';
      } else if (!/[a-z]/.test(newUser.password)) {
        errors.password = 'Password must include at least one lowercase letter';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newUser.password)) {
        errors.password = 'Password must include at least one special character';
      }
    }

    if (!editingUser && !newUser.mfaEnabled) {
      errors.mfa = 'MFA must be enabled for administrative accounts';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (editingUser) {
      const updates = { ...newUser };
      if (!updates.password) delete updates.password; // Don't update password if empty

      updateUser(editingUser.id, updates);
      toast.success(`User ${newUser.name} updated successfully`);
    } else {
      const userToCreate = {
        ...newUser,
        status: 'Active',
        branches: []
      };
      addUser(userToCreate);
      toast.success(`User ${newUser.name} created successfully`);
    }

    setShowCreateModal(false);
    setEditingUser(null);
    setNewUser({
      name: '',
      email: '',
      role: '',
      password: '',
      accountValidity: 365,
      mfaEnabled: false
    });
    setFormErrors({});
    setShowPassword(false);
  };

  const formatLastLogin = (isoString) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const handleExport = () => {
    const csv = [
      ['User ID', 'Name', 'Email', 'Role', 'Status', 'Branches', 'Last Login', 'MFA Enabled'],
      ...filteredUsers.map(u => [u.id, u.name, u.email, u.role, u.status, u.branches.length, formatLastLogin(u.lastLogin), u.mfaEnabled])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Users exported successfully');
  };

  const roleColors = {
    'Branch Admin': 'bg-blue-50 text-blue-700',
    'Regional Manager': 'bg-purple-50 text-purple-700',
    'Service Manager': 'bg-green-50 text-green-700',
    'Super Admin': 'bg-red-50 text-red-700'
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">User & Access Management</h1>
          <p className="text-gray-600 text-sm">Manage user accounts, roles, and permissions</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setNewUser({
              name: '',
              email: '',
              role: '',
              password: '',
              accountValidity: 365,
              mfaEnabled: false
            });
            setShowCreateModal(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-semibold"
        >
          <UserPlus className="w-5 h-5" />
          Create Admin User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Users</span>
            <UserPlus className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-black">1,248</div>
          <div className="text-xs text-green-600 mt-1">+24 this month</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Now</span>
            <Clock className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-black">324</div>
          <div className="text-xs text-gray-600 mt-1">26% of total</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">MFA Enabled</span>
            <Shield className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-black">892</div>
          <div className="text-xs text-gray-600 mt-1">71% coverage</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Locked Accounts</span>
            <Lock className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-black">8</div>
          <div className="text-xs text-red-600 mt-1">Requires attention</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary/50 transition-all"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent hover:border-[#2563EB]/50 transition-all"
            >
              <option value="all">All Roles</option>
              <option value="Branch Admin">Branch Admin</option>
              <option value="Regional Manager">Regional Manager</option>
              <option value="Service Manager">Service Manager</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent hover:border-[#2563EB]/50 transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="locked">Locked</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Download className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-20">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">User</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="hidden lg:table-cell text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Branch Access</th>
                  <th className="hidden md:table-cell text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Last Login</th>
                  <th className="hidden xl:table-cell text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Security</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-black">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell py-4 px-6">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700">
                          {user.branches.slice(0, 2).join(', ')}
                          {user.branches.length > 2 && (
                            <span className="text-primary font-medium ml-1">+{user.branches.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-4 px-6">
                      <div className="text-sm text-gray-700 font-medium">{user.lastLogin}</div>
                      <div className="text-xs text-gray-400">{user.lastLoginDate}</div>
                    </td>
                    <td className="hidden xl:table-cell py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <Shield className={`w-4 h-4 ${user.twoFactor ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">{user.twoFactor ? '2FA Active' : '2FA Off'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${user.status === 'Active'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="Edit User" onClick={() => handleEdit(user)}>
                          <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        </button>
                        <button className="p-2 hover:bg-yellow-50 rounded-lg transition-colors group" title="Reset Password" onClick={() => handleResetPassword(user.id, user.email)}>
                          <Key className="w-4 h-4 text-gray-400 group-hover:text-yellow-500" />
                        </button>
                        {user.status === 'Locked' ? (
                          <button className="p-2 hover:bg-green-50 rounded-lg transition-colors group" title="Unlock Account" onClick={() => handleToggleLock(user.id, user.name, user.status)}>
                            <Unlock className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                          </button>
                        ) : (
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Lock Account" onClick={() => handleToggleLock(user.id, user.name, user.status)}>
                            <Lock className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                          </button>
                        )}
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Deactivate User"
                          onClick={() => handleDelete(user.id, user.name)}
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-black mb-1">No Users Found</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              We couldn't find any users matching "{searchTerm}". Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
                setFilterStatus('all');
              }}
              className="mt-6 text-primary font-semibold text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-8">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-bold text-black">{editingUser ? 'Edit Admin User' : 'Create Admin User'}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {editingUser ? `Updating details for ${editingUser.name}` : 'Add a new user with administrative access'}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">FULL NAME *</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChange={(e) => {
                      setNewUser({ ...newUser, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent`}
                  />
                  {formErrors.name && <p className="text-red-500 text-[10px] mt-1 font-medium">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    placeholder="user@garageos.com"
                    value={newUser.email}
                    onChange={(e) => {
                      setNewUser({ ...newUser, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent`}
                  />
                  {formErrors.email && <p className="text-red-500 text-[10px] mt-1 font-medium">{formErrors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">ROLE *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => {
                      setNewUser({ ...newUser, role: e.target.value });
                      if (formErrors.role) setFormErrors({ ...formErrors, role: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.role ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent`}
                  >
                    <option value="">Select role</option>
                    <option value="Branch Admin">Branch Admin</option>
                    <option value="Regional Manager">Regional Manager</option>
                    <option value="Service Manager">Service Manager</option>
                  </select>
                  {formErrors.role && <p className="text-red-500 text-[10px] mt-1 font-medium">{formErrors.role}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">ACCOUNT VALIDITY *</label>
                  <select
                    value={newUser.accountValidity}
                    onChange={(e) => setNewUser({ ...newUser, accountValidity: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">365 days</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  {editingUser ? 'RESET PASSWORD (OPTIONAL)' : 'TEMPORARY PASSWORD *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={editingUser ? "Leave blank to keep current password" : "••••••••"}
                    value={newUser.password}
                    onChange={(e) => {
                      setNewUser({ ...newUser, password: e.target.value });
                      if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent`}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showPassword"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <label htmlFor="showPassword" className="text-xs text-gray-600 cursor-pointer font-medium select-none">
                      Show Password
                    </label>
                  </div>
                </div>
                {formErrors.password ? (
                  <p className="text-red-500 text-[10px] mt-1 font-medium">{formErrors.password}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    {editingUser ? 'Only fill this if you want to change the user\'s password' : 'Must include: 8+ characters, uppercase, lowercase, and special character'}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUser.mfaEnabled}
                    onChange={(e) => {
                      setNewUser({ ...newUser, mfaEnabled: e.target.checked });
                      if (formErrors.mfa) setFormErrors({ ...formErrors, mfa: '' });
                    }}
                    className={`w-4 h-4 rounded ${formErrors.mfa ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <span className="text-sm text-gray-700 font-medium">Enforce Multi-Factor Authentication (MFA) *</span>
                </label>
                {formErrors.mfa && <p className="text-red-500 text-[10px] mt-1 font-medium">{formErrors.mfa}</p>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingUser(null);
                  setNewUser({
                    name: '',
                    email: '',
                    role: '',
                    password: '',
                    accountValidity: 365,
                    mfaEnabled: false
                  });
                  setFormErrors({});
                  setShowPassword(false);
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] transition-colors"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}