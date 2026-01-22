import React, { useState } from 'react';
import { MechanicProvider } from './contexts/MechanicContext';

//  COMMENTED SONNER (ONLY CHANGE)
// import { Toaster } from 'sonner';
// import { toast } from 'sonner';

import { 
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Package,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  GraduationCap,
  Power,
  Search,
  Bell
} from 'lucide-react';



// Import all Mechanic module components
import MechanicHome from './components/MechanicHome';
import JobCardAccess from './components/JobCardAccess';
import JobExecution from './components/JobExecution'; 
import PartsRequest from './components/PartsRequest';
import ProgressUpdates from './components/ProgressUpdates';
import QcSubmission from './components/QcSubmission';
import Performance from './components/Performance';
import Training from './components/Training';



function DashboardContent({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications] = useState();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // ❌ toast.success('Logging out...');
    setTimeout(() => {
      onLogout();
    }, 500);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobcards', label: 'My Job Cards', icon: ClipboardList },
    { id: 'execution', label: 'Job Execution', icon: Wrench },
    { id: 'parts', label: 'Parts Request', icon: Package },
    { id: 'progress', label: 'Progress Updates', icon: MessageSquare },
    { id: 'qc', label: 'QC Submission', icon: CheckCircle },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'training', label: 'Training', icon: GraduationCap }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MechanicHome onNavigate={setActiveTab} />;
      case 'jobcards':
        return <JobCardAccess />;
      case 'execution':
        return <JobExecution />;
      case 'parts':
        return <PartsRequest />;
      case 'progress':
        return <ProgressUpdates />;
      case 'qc':
        return <QcSubmission />;
      case 'performance':
        return <Performance />;
      case 'training':
        return <Training />;
      default:
        return <MechanicHome onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#EBF3FF] text-[#1E293B] border-r border-[#D1E3FF] flex flex-col">

        {/* Logo */}
        <div className="p-6 border-b border-[#D1E3FF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight">GMS</span>
              <span className="text-xs text-[#64748B]">Mechanic Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white font-semibold shadow-lg'
                      : 'text-[#64748B] hover:bg-[#DDE9FF] hover:text-[#1E293B]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#D1E3FF]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#64748B] hover:bg-white hover:text-[#1E293B] border border-[#D1E3FF]"
          >
            <Power className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder="Search job cards..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {notifications}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">RK</span>
              </div>
              <div>
                <div className="text-sm font-semibold">Rajesh Kumar</div>
                <div className="text-xs text-gray-500">Mechanic • Mumbai Main</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 text-center">
              <Power className="w-10 h-10 text-red-600 mx-auto mb-3" />
              <h2 className="font-bold mb-2">Confirm Logout</h2>
              <p className="text-sm text-gray-600">
                Are you sure you want to logout?
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white rounded-lg py-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MechanicDashboard({ onLogout }) {
  return (
    <MechanicProvider>
      {/* ❌ Toaster commented */}
      {/* <Toaster position="top-right" richColors /> */}
      <DashboardContent onLogout={onLogout} />
    </MechanicProvider>
  );
}
