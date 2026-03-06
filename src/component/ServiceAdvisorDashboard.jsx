import React from "react";
import { ServiceAdvisorProvider } from "../component/context/Serviceadvisorcontext";

import {
  Power,
  Search,
  Bell
} from "lucide-react";
import { useServiceAdvisorDashboard } from "./Serviceadvisor/useServiceAdvisorDashboard";

import ServiceAdvisorHome from "../component/Serviceadvisor/ui/Serviceadvisorhome";
import Customermanagement from "../component/Serviceadvisor/ui/Customermanagement";
import AppointmentBooking from "../component/Serviceadvisor/ui/Appointmentbooking";
import JobCardCreation from "../component/Serviceadvisor/ui/Jobcardcreation";
import ServiceEstimation from "../component/Serviceadvisor/ui/Serviceestimation";
import JobProgressTracking from "../component/Serviceadvisor/ui/Jobprogresstracking";
import CustomerCommunication from "../component/Serviceadvisor/ui/Customercommunication";
import BillingDelivery from "../component/Serviceadvisor/ui/Billinganddeliverey";
import ComplaintManagement from "../component/Serviceadvisor/ui/Complaintmanagement";
function DashboardContent({ onLogout }) {
  const {
    activeTab,
    notifications,
    searchQuery,
    showLogoutModal,
    navItems,
    setActiveTab,
    setSearchQuery,
    handleLogout,
    closeLogoutModal,
    confirmLogout
  } = useServiceAdvisorDashboard(onLogout);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ServiceAdvisorHome onNavigate={setActiveTab} />;
      case 'customers':
        return <Customermanagement/>;
      case 'appointments':
        return <AppointmentBooking />;
      case 'jobcards':
        return <JobCardCreation />;
      case 'estimations':
        return <ServiceEstimation />;
      case 'tracking':
        return <JobProgressTracking />;
      case 'communication':
        return <CustomerCommunication />;
      case 'delivery':
        return <BillingDelivery />;
      case 'complaints':
        return <ComplaintManagement />;
      default:
        return <ServiceAdvisorHome onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      <aside className="w-[280px] bg-[#EBF3FF] text-[#1E293B] border-r border-[#D1E3FF] flex flex-col">
        <div className="p-6 border-b border-[#D1E3FF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-[#1E293B]">Mantha Tech</span>
              <span className="text-xs text-[#64748B]">Service Advisor</span>
            </div>
          </div>
        </div>
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
        <div className="p-4 border-t border-[#D1E3FF]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#64748B] hover:bg-white hover:text-[#1E293B] border border-[#D1E3FF] transition-all"
          >
            <Power className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
       
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers, job cards, appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {notifications}
                </span>
              )}
            </button>

            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">SA</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-black">Service Advisor</div>
                <div className="text-xs text-gray-500">Mumbai Main</div>
              </div>
            </div>
          </div>
        </header>

       
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

     
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Power className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="font-bold text-black text-center mb-2">Confirm Logout</h2>
              <p className="text-sm text-gray-600 text-center">
                Are you sure you want to logout? Any unsaved changes will be lost.
              </p>
            </div>
            <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeLogoutModal}
                className="flex-1 px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
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

export default function ServiceAdvisorDashboard({ onLogout }) {
  return (
    <ServiceAdvisorProvider>
      <DashboardContent onLogout={onLogout} />
    </ServiceAdvisorProvider>
  );
}
