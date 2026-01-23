import React, { useState } from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import InteractiveDashboardHome from '../superadmin/InteractiveDashboardHome';
import OrganizationManagement from '../superadmin/OrganizationManagement';
import BranchManagement from '../superadmin/BranchManagement';
import UserManagement from '../superadmin/UserManagement';
import ApprovalCenter from '../superadmin/ApprovalCenter';
import SystemConfiguration from '../superadmin/SystemConfiguration';
import AuditLogs from '../superadmin/AuditLogs';
import { Toaster } from 'sonner';
import {
  LayoutDashboard,
  Cog,
  Building2,
  GitBranch,
  Users,
  CheckSquare,
  Settings,
  FileText,
  LogOut,
  Bell,
  Search,
  Plus,
  UserPlus,
  FolderPlus,
  ClipboardCheck,
  Download,
  RefreshCw,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';

export default function SuperAdminDashboard({ onLogout }) {
  return (
    <DashboardProvider>
      <Toaster position="top-right" richColors />
      <DashboardContent onLogout={onLogout} />
    </DashboardProvider>
  );
}

function DashboardContent({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications] = useState(12);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'branches', label: 'Branches', icon: GitBranch },
    { id: 'users', label: 'Users & Access', icon: Users },
    { id: 'approvals', label: 'Approval Center', icon: CheckSquare },
    { id: 'system', label: 'System Config', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: FileText }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <InteractiveDashboardHome onNavigate={setActiveTab} />
      case 'organizations':
        return <OrganizationManagement />
      case 'branches':
        return <BranchManagement />;
      case 'users':
        return <UserManagement />;
      case 'approvals':
        return <ApprovalCenter />;
      case 'system':
        return <SystemConfiguration />;
      case 'audit':
        return <AuditLogs />;
      default:
        return <InteractiveDashboardHome onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-background relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-sm">
              <Cog className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground text-lg">TOP GEAR</span>
              <span className="text-[10px] text-sidebar-foreground/80 font-semibold uppercase">Super Admin View</span>
            </div>
          </div>
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-sidebar-accent/30 hover:text-sidebar-foreground'
                  }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* <div className="flex items-center gap-3">
               <button
                  onClick={onLogout}
                  className="p-2.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-xl transition-all group"
                  title="Logout"
                >
                  <span>Logout</span> <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
                </button>
          </div> */}


        <div className="group p-2">
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-3 px-6 py-4 text-base font-semibold text-muted-foreground 
               hover:text-destructive bg-secondary/20 rounded-2xl transition-all duration-300
               group-hover:scale-105 group-hover:bg-destructive/10 group-hover:shadow-lg group-active:scale-95"
            title="Logout"
          >
            <LogOut className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search organizations, branches, users..."
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Quick Actions */}
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors text-sm font-semibold"
              >
                Quick Actions
              </button>

              <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />

              {/* User Profile & Logout */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden lg:flex">
                  <span className="text-sm font-bold text-foreground leading-none">Super Admin</span>
                  <span className="text-[10px] text-muted-foreground font-medium">admin@manthatech.com</span>
                </div>
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-sm ring-2 ring-background">
                  SA
                </div>
                {/* <button
                  onClick={onLogout}
                  className="p-2.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-xl transition-all group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
                </button> */}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Quick Actions Dropdown */}
      {showQuickActions && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowQuickActions(false)}
          />
          <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-8 w-auto sm:w-80 bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden">
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary to-primary/80">
              <h3 className="font-bold text-primary-foreground">Quick Actions</h3>
              <p className="text-xs text-primary-foreground/80 mt-1">Perform common tasks quickly</p>
            </div>
            <div className="p-3 max-h-96 overflow-y-auto">
              <button
                onClick={() => {
                  setActiveTab('organizations');
                  setShowQuickActions(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left mb-2"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-kpi-value">Create Organization</div>
                  <div className="text-xs text-gray-500">Add new organization</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('branches');
                  setShowQuickActions(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left mb-2"
              >
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <FolderPlus className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-kpi-value">Create Branch</div>
                  <div className="text-xs text-gray-500">Add new branch location</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('users');
                  setShowQuickActions(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left mb-2"
              >
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-kpi-value">Create User</div>
                  <div className="text-xs text-gray-500">Add new admin user</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('approvals');
                  setShowQuickActions(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left mb-2"
              >
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-kpi-value">View Approvals</div>
                  <div className="text-xs text-gray-500">12 pending requests</div>
                </div>
              </button>

              <div className="border-t border-gray-200 my-2" />

              <button
                onClick={() => {
                  setActiveTab('audit');
                  setShowQuickActions(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left mb-2"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-kpi-value">Export Reports</div>
                  <div className="text-xs text-gray-500">Download audit logs</div>
                </div>
              </button>

              <button
                onClick={() => {
                  window.location.reload();
                  setShowQuickActions(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-kpi-value">Refresh Dashboard</div>
                  <div className="text-xs text-gray-500">Reload all data</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-8 w-auto sm:w-96 bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden">
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary to-primary/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-primary-foreground">Notifications</h3>
                  <p className="text-xs text-primary-foreground/80 mt-1">{notifications} unread notifications</p>
                </div>
                <button className="text-xs text-primary-foreground font-semibold hover:underline">
                  Mark all read
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-kpi-value mb-1">High Priority Approval</div>
                    <div className="text-xs text-gray-600 mb-2">Capital expense request for ₹2,50,000 requires immediate attention</div>
                    <div className="text-xs text-gray-400">5 minutes ago</div>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2" />
                </div>
              </div>

              <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-kpi-value mb-1">Branch Activated</div>
                    <div className="text-xs text-gray-600 mb-2">Jaipur Pink City branch is now live and operational</div>
                    <div className="text-xs text-gray-400">1 hour ago</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                </div>
              </div>

              <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-kpi-value mb-1">New User Added</div>
                    <div className="text-xs text-gray-600 mb-2">Amit Sharma has been added as Regional Manager</div>
                    <div className="text-xs text-gray-400">2 hours ago</div>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                </div>
              </div>

              <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-kpi-value mb-1">System Alert</div>
                    <div className="text-xs text-gray-600 mb-2">Database backup scheduled for tonight at 2:00 AM</div>
                    <div className="text-xs text-gray-400">3 hours ago</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-kpi-value mb-1">Organization Updated</div>
                    <div className="text-xs text-gray-600 mb-2">AutoCare India updated their tax information</div>
                    <div className="text-xs text-gray-400">5 hours ago</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button className="w-full text-center text-sm font-semibold text-kpi-value hover:text-foreground transition-colors">
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}


    </div>
  );
}