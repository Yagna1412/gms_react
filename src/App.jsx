import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { NotificationsProvider } from "./contexts/NotificationsContext";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import BranchManagement from "./pages/BranchManagement";
import EmployeeManagement from "./pages/EmployeeManagement";
import CustomerAppointments from "./pages/CustomerAppointments";
import ServiceJobCards from "./pages/ServiceJobCards";
import InventoryParts from "./pages/InventoryParts";
import FinanceAndBilling from "./pages/FinanceAndBilling";
import Notifications from "./pages/Notifications";
import ReportingAnalytics from "./pages/ReportingAnalytics";
import SecurityControl from "./pages/SecurityControl";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
    <NotificationsProvider>
      <div className="flex h-screen bg-[#EFF6FF] overflow-hidden">
        
        {/* SIDEBAR */}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* HEADER */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* SCROLLABLE CONTENT ONLY */}
          <div className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<BranchManagement />} />
              <Route path="/branches" element={<BranchManagement />} />
              <Route path="/employees" element={<EmployeeManagement />} />
              <Route path="/customers" element={<CustomerAppointments />} />
              <Route path="/jobs" element={<ServiceJobCards />} />
              <Route path="/inventory" element={<InventoryParts />} />
              <Route path="/finance" element={<FinanceAndBilling />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/reports" element={<ReportingAnalytics />} />
              <Route path="/security" element={<SecurityControl />} />
            </Routes>
          </div>

        </div>
      </div>
      </NotificationsProvider>
    </BrowserRouter>
  );
}
