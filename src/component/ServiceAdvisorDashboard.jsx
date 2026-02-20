import React, { useState } from "react";
import { ServiceAdvisorProvider } from "../component/context/Serviceadvisorcontext";

import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Activity,
  MessageSquare,
  CreditCard,
  AlertCircle,
  Power,
  Search,
  Bell,
  Menu,
  X,
  User
} from "lucide-react";

import ServiceAdvisorHome from "../component/Serviceadvisor/Serviceadvisorhome";
import Customermanagement from "../component/Serviceadvisor/Customermanagement";
import AppointmentBooking from "../component/Serviceadvisor/Appointmentbooking";
import JobCardCreation from "../component/Serviceadvisor/Jobcardcreation";
import ServiceEstimation from "../component/Serviceadvisor/Serviceestimation";
import JobProgressTracking from "../component/Serviceadvisor/Jobprogresstracking";
import CustomerCommunication from "../component/Serviceadvisor/Customercommunication";
import BillingDelivery from "../component/Serviceadvisor/Billinganddeliverey";
import ComplaintManagement from "../component/Serviceadvisor/Complaintmanagement";

function DashboardContent({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications] = useState(8);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "customers", label: "Customers", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "jobcards", label: "Job Cards", icon: ClipboardList },
    { id: "estimations", label: "Estimations", icon: FileText },
    { id: "tracking", label: "Job Tracking", icon: Activity },
    { id: "communication", label: "Communication", icon: MessageSquare },
    { id: "delivery", label: "Billing & Delivery", icon: CreditCard },
    { id: "complaints", label: "Complaints", icon: AlertCircle }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "customers": return <Customermanagement />;
      case "appointments": return <AppointmentBooking />;
      case "jobcards": return <JobCardCreation />;
      case "estimations": return <ServiceEstimation />;
      case "tracking": return <JobProgressTracking />;
      case "communication": return <CustomerCommunication />;
      case "delivery": return <BillingDelivery />;
      case "complaints": return <ComplaintManagement />;
      default: return <ServiceAdvisorHome onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full w-[280px]
        bg-[#EBF3FF] border-r border-[#D1E3FF]
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <div className="font-bold text-[#1E293B]">Mantha Tech</div>
            <div className="text-xs text-gray-500">Service Advisor</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all
                  ${active
                    ? "bg-blue-600 text-white font-semibold shadow"
                    : "text-gray-600 hover:bg-blue-100"}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Logout (Desktop only) */}
        <div className="p-4 border-t hidden lg:block">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
            text-gray-600 hover:bg-white border"
          >
            <Power className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="h-[64px] bg-white border-b flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu />
            </button>

            {/* Search hidden on mobile */}
            <div className="hidden sm:block relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border rounded-lg text-sm"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white
                text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {notifications}
              </span>
            </button>

            {/* Profile (ALWAYS visible) */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <div className="w-9 h-9 bg-blue-600 text-white rounded-full
                  flex items-center justify-center font-bold text-sm">
                  SA
                </div>

                {/* Text hidden only on mobile */}
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold">Service Advisor</div>
                  <div className="text-xs text-gray-500">Mumbai Main</div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border
                  rounded-xl shadow-lg z-50">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2
                    text-sm hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2
                    text-sm text-red-600 hover:bg-red-50"
                  >
                    <Power className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
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
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="font-bold text-lg mb-2">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
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
