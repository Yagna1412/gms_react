import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [selectedOrgForBranch, setSelectedOrgForBranch] = useState(null);

  // Organizations State
  const [organizations, setOrganizations] = useState([
    {
      id: 'ORG-001',
      name: 'AutoCare India Pvt Ltd',
      uuid: 'ac8f3e2b-9d4c-4a1e-8f7b-6c5d4e3f2a1b',
      address: 'Andheri West, Mumbai, Maharashtra',
      taxId: 'GST22AAAAA0000A1Z5',
      financialYear: 'Apr-Mar',
      branches: 24,
      employees: 342,
      revenue: 1250000000,
      status: 'Active',
      createdAt: '2023-01-15'
    },
    {
      id: 'ORG-002',
      name: 'Speedway Motors Ltd',
      uuid: '7b6c5d4e-3f2a-1b0c-9d8e-7f6a5b4c3d2e',
      address: 'Connaught Place, New Delhi',
      taxId: 'GST07BBBBB1111B2Y6',
      financialYear: 'Jan-Dec',
      branches: 18,
      employees: 256,
      revenue: 890000000,
      status: 'Active',
      createdAt: '2023-03-20'
    },
    {
      id: 'ORG-003',
      name: 'MechPro Services',
      uuid: '5c4d3e2f-1a0b-9c8d-7e6f-5a4b3c2d1e0f',
      address: 'Whitefield, Bangalore, Karnataka',
      taxId: 'GST29CCCCC2222C3X7',
      financialYear: 'Apr-Mar',
      branches: 12,
      employees: 189,
      revenue: 520000000,
      status: 'Active',
      createdAt: '2023-06-10'
    }
  ]);

  // Branches State
  const [branches, setBranches] = useState(() => {
    // Try to load from local storage first
    const savedBranches = localStorage.getItem('dashboard_branches');
    if (savedBranches) {
      return JSON.parse(savedBranches);
    }
    // Default initial state
    return [
      {
        id: 'BR-001',
        code: 'MUM-MAIN-01',
        name: 'Mumbai Main Branch',
        category: 'Main Branch',
        location: 'Andheri West, Mumbai, Maharashtra',
        supervisor: 'Rajesh Kumar',
        status: 'Active',
        performance: 4.8,
        activeJobs: 23,
        revenue: 850000,
        employees: 24,
        phone: '+91 98765 43210',
        email: 'mumbai.main@garageos.com',
        orgId: 'ORG-001',
        createdAt: '2023-02-01'
      },
      {
        id: 'BR-002',
        code: 'DEL-CENT-01',
        name: 'Delhi Central',
        category: 'Main Branch',
        location: 'Connaught Place, New Delhi',
        supervisor: 'Priya Sharma',
        status: 'Active',
        performance: 4.6,
        activeJobs: 18,
        revenue: 720000,
        employees: 20,
        phone: '+91 98765 43211',
        email: 'delhi.central@garageos.com',
        orgId: 'ORG-002',
        createdAt: '2023-03-25'
      }
    ];
  });

  // Persist branches to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboard_branches', JSON.stringify(branches));
  }, [branches]);

  // Users State
  const [users, setUsers] = useState([
    {
      id: 'USR-001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@garageos.com',
      role: 'Branch Admin',
      status: 'Active',
      branches: ['BR-001', 'BR-003'],
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      mfaEnabled: true,
      accountValidity: 365,
      avatar: 'RK',
      createdAt: '2023-02-05'
    },
    {
      id: 'USR-002',
      name: 'Priya Sharma',
      email: 'priya.sharma@garageos.com',
      role: 'Regional Manager',
      status: 'Active',
      branches: ['BR-002', 'BR-004', 'BR-005'],
      lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      mfaEnabled: true,
      accountValidity: 365,
      avatar: 'PS',
      createdAt: '2023-03-15'
    }
  ]);

  // Approvals State
  const [approvals, setApprovals] = useState([
    {
      id: 'AP-2025-001',
      type: 'Capital Expense',
      requester: 'Rajesh Kumar',
      requesterId: 'USR-001',
      branch: 'Mumbai Main',
      branchId: 'BR-001',
      amount: 250000,
      description: 'Purchase of hydraulic lift system for bay expansion',
      priority: 'High',
      sla: 135,
      submittedOn: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      documents: 3,
      status: 'Pending',
      approvalChain: ['Branch Manager ✓', 'Regional Manager ✓', 'Finance Head ✓', 'Super Admin'],
      justification: 'Current equipment is 8 years old and showing significant wear. New system will improve efficiency by 40%.'
    },
    {
      id: 'AP-2025-002',
      type: 'Discount Approval',
      requester: 'Priya Sharma',
      requesterId: 'USR-002',
      branch: 'Delhi Central',
      branchId: 'BR-002',
      amount: 75000,
      description: 'Special discount for corporate client - 25% off annual service contract',
      priority: 'Medium',
      sla: 340,
      submittedOn: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      documents: 2,
      status: 'Pending',
      approvalChain: ['Branch Manager ✓', 'Regional Manager ✓', 'Super Admin'],
      justification: 'Long-term client with 50+ vehicles. Discount will secure 2-year contract worth ₹12L total.'
    }
  ]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'LOG-2025-1234',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      userId: 'USR-001',
      userName: 'Super Admin',
      action: 'Approve',
      entity: 'Approval Request',
      entityId: 'AP-2025-001',
      description: 'Approved capital expense request for ₹2,50,000',
      ipAddress: '192.168.1.105',
      deviceInfo: 'Chrome 120.0 / Windows 11',
      result: 'Success',
      beforeValue: '{"status": "pending", "approver": null}',
      afterValue: '{"status": "approved", "approver": "USR-001", "approvedAt": "2025-01-15T14:30:25Z"}',
      branchId: 'BR-001',
      branchName: 'Mumbai Main'
    }
  ]);

  // System Config State
  const [systemConfig, setSystemConfig] = useState({
    systemName: 'GarageOS by Mantha Tech',
    supportEmail: 'support@garageos.com',
    timeZone: 'IST',
    dateFormat: 'DD/MM/YYYY',
    dataRetention: 7,
    sessionTimeout: 30,
    maxSessions: 2,
    failedLoginAttempts: 5,
    passwordExpiry: 90,
    minPasswordLength: 8,
    backupFrequency: 'daily',
    backupTime: '02:00',
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'noreply@garageos.com',
    smtpPassword: '',
    smsProvider: 'twilio',
    smsApiKey: '',
    paymentGateway: 'razorpay',
    razorpayApiKey: '',
    razorpayApiSecret: '',
    payuMerchantKey: '',
    payuMerchantSalt: '',
    enableAutoUpdates: true,
    sendMaintenanceNotifications: true,
    enableDebugMode: false,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventPasswordReuse: true,
    backupRetentionPeriod: 30,
    highPrioritySLA: 4,
    mediumPrioritySLA: 24
  });

  // Add audit log helper
  const addAuditLog = (action, entity, entityId, description, beforeValue = null, afterValue = null) => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'USR-001',
      userName: 'Super Admin',
      action,
      entity,
      entityId,
      description,
      ipAddress: '192.168.1.105',
      deviceInfo: 'Chrome 120.0 / Windows 11',
      result: 'Success',
      beforeValue: beforeValue ? JSON.stringify(beforeValue) : null,
      afterValue: afterValue ? JSON.stringify(afterValue) : null,
      branchId: null,
      branchName: 'System Wide'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Organization Functions
  const addOrganization = (org) => {
    const newOrg = {
      ...org,
      id: `ORG-${String(organizations.length + 1).padStart(3, '0')}`,
      uuid: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      branches: 0,
      employees: 0,
      revenue: 0
    };
    setOrganizations(prev => [newOrg, ...prev]);
    addAuditLog('Create', 'Organization', newOrg.id, `Created organization: ${newOrg.name}`, null, newOrg);
    return newOrg;
  };

  const updateOrganization = (id, updates) => {
    const oldOrg = organizations.find(o => o.id === id);
    setOrganizations(prev => prev.map(org => org.id === id ? { ...org, ...updates } : org));
    addAuditLog('Update', 'Organization', id, `Updated organization: ${oldOrg.name}`, oldOrg, { ...oldOrg, ...updates });
  };

  const deleteOrganization = (id) => {
    const org = organizations.find(o => o.id === id);
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, status: 'Deleted' } : o));
    addAuditLog('Delete', 'Organization', id, `Soft deleted organization: ${org.name}`, org, { ...org, status: 'Deleted' });
  };

  // Branch Functions
  const addBranch = (branch) => {
    const newBranch = {
      ...branch,
      id: `BR-${String(branches.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      activeJobs: 0,
      revenue: 0,
      performance: 0
    };
    setBranches(prev => [...prev, newBranch]);
    addAuditLog('Create', 'Branch', newBranch.id, `Created branch: ${newBranch.name}`, null, newBranch);
    return newBranch;
  };

  const updateBranch = (id, updates) => {
    const oldBranch = branches.find(b => b.id === id);
    setBranches(prev => prev.map(branch => branch.id === id ? { ...branch, ...updates } : branch));
    addAuditLog('Update', 'Branch', id, `Updated branch: ${oldBranch.name}`, oldBranch, { ...oldBranch, ...updates });
  };

  const deleteBranch = (id) => {
    const branch = branches.find(b => b.id === id);
    setBranches(prev => prev.map(b => b.id === id ? { ...b, status: 'Deleted' } : b));
    addAuditLog('Delete', 'Branch', id, `Soft deleted branch: ${branch.name}`, branch, { ...branch, status: 'Deleted' });
  };

  // User Functions
  const addUser = (user) => {
    const newUser = {
      ...user,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    };
    setUsers(prev => [...prev, newUser]);
    addAuditLog('Create', 'User', newUser.id, `Created user: ${newUser.name} (${newUser.email})`, null, newUser);
    return newUser;
  };

  const updateUser = (id, updates) => {
    const oldUser = users.find(u => u.id === id);
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
    addAuditLog('Update', 'User', id, `Updated user: ${oldUser.name}`, oldUser, { ...oldUser, ...updates });
  };

  const deleteUser = (id) => {
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Deleted' } : u));
    addAuditLog('Delete', 'User', id, `Deactivated user: ${user.name}`, user, { ...user, status: 'Deleted' });
  };

  const resetUserPassword = (id) => {
    const user = users.find(u => u.id === id);
    addAuditLog('Update', 'User', id, `Reset password for user: ${user.email}`,
      { passwordLastChanged: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
      { passwordLastChanged: new Date().toISOString(), passwordResetBy: 'USR-001' }
    );
  };

  const toggleUserLock = (id) => {
    const user = users.find(u => u.id === id);
    const newStatus = user.status === 'Locked' ? 'Active' : 'Locked';
    updateUser(id, { status: newStatus });
  };

  // Approval Functions
  const approveRequest = (id, reason = '') => {
    const approval = approvals.find(a => a.id === id);
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    addAuditLog('Approve', 'Approval Request', id,
      `Approved ${approval.type}: ${approval.description}`,
      { status: 'Pending' },
      { status: 'Approved', approvedBy: 'USR-001', approvedAt: new Date().toISOString(), reason }
    );
  };

  const rejectRequest = (id, reason) => {
    const approval = approvals.find(a => a.id === id);
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
    addAuditLog('Reject', 'Approval Request', id,
      `Rejected ${approval.type}: ${approval.description}`,
      { status: 'Pending' },
      { status: 'Rejected', rejectedBy: 'USR-001', rejectedAt: new Date().toISOString(), reason }
    );
  };

  // System Config Functions
  const updateSystemConfig = (updates) => {
    const oldConfig = { ...systemConfig };
    setSystemConfig(prev => ({ ...prev, ...updates }));
    addAuditLog('Update', 'System Configuration', 'CONFIG-SYSTEM',
      'Updated system configuration',
      oldConfig,
      { ...oldConfig, ...updates }
    );
  };

  // Stats calculations
  const stats = {
    totalOrganizations: organizations.filter(o => o.status !== 'Deleted').length,
    totalBranches: branches.filter(b => b.status !== 'Deleted').length,
    activeBranches: branches.filter(b => b.status === 'Active').length,
    totalEmployees: branches.reduce((sum, b) => sum + (b.employees || 0), 0),
    totalCustomers: 12567,
    activeJobs: branches.reduce((sum, b) => sum + (b.activeJobs || 0), 0),
    mtdRevenue: branches.reduce((sum, b) => sum + (b.revenue || 0), 0),
    pendingApprovals: approvals.filter(a => a.status === 'Pending').length,
    systemHealth: 99.8
  };

  const value = {
    // State
    organizations,
    branches,
    users,
    approvals,
    auditLogs,
    systemConfig,
    stats,
    selectedOrgForBranch,
    setSelectedOrgForBranch,
    // Organization functions
    addOrganization,
    updateOrganization,
    deleteOrganization,
    // Branch functions
    addBranch,
    updateBranch,
    deleteBranch,
    // User functions
    addUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    toggleUserLock,
    // Approval functions
    approveRequest,
    rejectRequest,
    // Config functions
    updateSystemConfig,
    // Audit
    addAuditLog
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
