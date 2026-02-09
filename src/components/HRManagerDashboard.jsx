import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  Activity,
  AlertCircle,
  GraduationCap,
  IndianRupee,
  Power,
  Search,
  Bell,
  PersonStanding,
} from "lucide-react";

/*IMPORT REAL PAGES */
import HRDashboardHome from "../hr/HRDashboardHome";
import EmployeeMaster from "../hr/EmployeeMaster";
import Attendance from "../hr/Attendance";
import LeaveManagement from "../hr/LeaveManagement";
import PerformanceManagement from "../hr/PerformanceManagement";
import RelievingEmployee from "../hr/RelievingEmployee";

/*  TEMP PLACEHOLDERS (UNCHANGED)  */
const Payroll = () => <div className="p-6">Payroll</div>;
const Training = () => <div className="p-6">Training</div>;
const Grievance = () => <div className="p-6">Grievance</div>;

const HRManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  /* SHARED DATA (SOURCE) */

  const [leaves, setLeaves] = useState([
    { id: 1, name: "Rajesh Kumar", status: "Pending" },
    { id: 2, name: "Amit Verma", status: "Pending" },
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      empId: "EMP/MUM/2024/0001",
      cycle: "Q4 2024",
      date: "2024-12-15",
      score: 4.6,
      reviewer: "Amit Sharma",
      status: "Completed",
    },
    {
      id: 2,
      name: "Priya Singh",
      empId: "EMP/MUM/2024/0002",
      cycle: "Q4 2024",
      date: "2024-12-16",
      score: 4.4,
      reviewer: "Sunita Patel",
      status: "Completed",
    },
    {
      id: 3,
      name: "Neha Desai",
      empId: "EMP/MUM/2024/0003",
      cycle: "Q4 2024",
      date: "Not scheduled",
      score: null,
      reviewer: "Sunita Patel",
      status: "Pending",
    },
  ]);

  /* PAGE RENDERING */
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <HRDashboardHome
            onNavigate={setActiveTab}
            leaves={leaves}
            reviews={reviews}
          />
        );

      case "employees":
        return <EmployeeMaster />;

      case "attendance":
        return <Attendance />;

      case "leaves":
        return (
          <LeaveManagement
            leaves={leaves}
            setLeaves={setLeaves}
          />
        );

      case "performance":
        return (
          <PerformanceManagement
            onNavigate={setActiveTab}
            reviews={reviews}         
            setReviews={setReviews}    
          />
        );

      case "payroll":
        return <Payroll />;

      case "training":
        return <Training />;

      case "grievance":
        return <Grievance />;

      case "relieving":
        return <RelievingEmployee />;

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      {/*  SIDEBAR */}
      <aside className="w-64 bg-[#E0ECFF] border-r border-[#BFDBFE] flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-[#BFDBFE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white">
              🔧
            </div>
            <div>
              <h1 className="font-semibold text-lg">FixMate</h1>
              <p className="text-sm text-gray-600 -mt-1">HR Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            ["dashboard", "Dashboard", LayoutDashboard],
            ["employees", "Employee Master", Users],
            ["attendance", "Attendance", ClipboardList],
            ["leaves", "Leave Management", Calendar],
            ["performance", "Performance", Activity],
            ["payroll", "Payroll", IndianRupee],
            ["training", "Training", GraduationCap],
            ["grievance", "Grievance", AlertCircle],
            ["relieving", "Relieving Employee", PersonStanding],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  activeTab === id
                    ? "bg-[#2563EB] text-white"
                    : "text-[#1E3A8A] hover:bg-[#DBEAFE]"
                }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button className="p-4 flex items-center gap-2 text-red-600 hover:bg-red-100">
          <Power size={18} />
          Logout
        </button>
      </aside>

      {/*  MAIN  */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-50">
          {/* Search */}
          <div className="relative w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search employees, leaves, trainings..."
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell size={22} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center">
                HR
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-sm">HR Manager</p>
                <p className="text-xs text-gray-500">Human Resources</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pt-16">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HRManagerDashboard;
