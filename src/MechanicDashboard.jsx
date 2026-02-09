import React, { useState } from 'react';
import { MechanicProvider } from './contexts/MechanicContext';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

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

// Components
import MechanicHome from './components/MechanicHome';
import JobCardAccess from './components/JobCardAccess';
import JobExecution from './components/JobExecution';
import PartsRequest from './components/PartsRequest';
import ProgressUpdates from './components/ProgressUpdates';
import QcSubmission from './components/QcSubmission';
import Performance from './components/Performance';
import Training from './components/Training';


function DashboardContent({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    setTimeout(() => {
      onLogout();
    }, 500);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobcards', label: 'My Job Cards', icon: ClipboardList },
    { path: '/execution', label: 'Job Execution', icon: Wrench },
    { path: '/parts', label: 'Parts Request', icon: Package },
    { path: '/progress', label: 'Progress Updates', icon: MessageSquare },
    { path: '/qc', label: 'QC Submission', icon: CheckCircle },
    { path: '/performance', label: 'Performance', icon: TrendingUp },
    { path: '/training', label: 'Training', icon: GraduationCap }
  ];

  return (
    <div className="flex h-screen bg-[#F5F7FA]">

      {/* Sidebar */}
      <aside className="w-[280px] bg-[#EBF3FF] text-[#1E293B] border-r border-[#D1E3FF] flex flex-col">

        {/* Logo */}
        <div className="p-6 border-b border-[#D1E3FF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="text-white" />
            </div>
            <div>
              <div className="font-bold">GMS</div>
              <div className="text-xs text-gray-500">Mechanic Portal</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
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

        {/* Routed Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<MechanicHome />} />
            <Route path="/jobcards" element={<JobCardAccess />} />
            <Route path="/execution" element={<JobExecution />} />
            <Route path="/parts" element={<PartsRequest />} />
            <Route path="/progress" element={<ProgressUpdates />} />
            <Route path="/qc" element={<QcSubmission />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/training" element={<Training />} />
          </Routes>
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
      <DashboardContent onLogout={onLogout} />
    </MechanicProvider>
  );
}
