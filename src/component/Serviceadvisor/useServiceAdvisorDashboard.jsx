import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Activity,
  MessageSquare,
  CreditCard,
  AlertCircle
} from 'lucide-react';

export function useServiceAdvisorDashboard(onLogout) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    setTimeout(() => {
      onLogout();
    }, 500);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'jobcards', label: 'Job Cards', icon: ClipboardList },
    { id: 'estimations', label: 'Estimations', icon: FileText },
    { id: 'tracking', label: 'Job Tracking', icon: Activity },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'delivery', label: 'Billing & Delivery', icon: CreditCard },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle }
  ];

  return {
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
  };
}
