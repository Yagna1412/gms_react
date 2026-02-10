import React, { useState,useRef,useEffect } from 'react';
import { InventoryProvider } from '../contexts/InventoryContext';
import { Toaster } from 'sonner';
import { 
  LayoutDashboard,
  Package,
  BarChart3,
  ShoppingCart,
  Users,
  FileBarChart,
  LogOut,
  Search,
  Bell
} from 'lucide-react';

import StockManagement from './inventory/StockManagement';
import InventoryItems from './inventory/InventoryItems';
import PurchaseOrders from './inventory/PurchaseOrders';
import VendorManagement from './inventory/VendorManagement';
import ValuationReports from './inventory/ValuationReports';
import InventoryDashboard from './inventory/InventoryDashboard';


function DashboardContent1({ onLogout }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifications] = useState(14);
    const [searchQuery, setSearchQuery] = useState('');
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <InventoryDashboard onNavigate={setActiveTab} searchQuery={globalSearchQuery} />;
            case 'items':
                return <InventoryItems searchQuery={globalSearchQuery} />;
            case 'stock':
                return <StockManagement searchQuery={globalSearchQuery} />;
            case 'purchase-orders':
                return <PurchaseOrders searchQuery={globalSearchQuery} />;
            case 'vendors':
                return <VendorManagement searchQuery={globalSearchQuery} />;
            case 'reports':
                return <ValuationReports searchQuery={globalSearchQuery} />;
            default:
                return <InventoryDashboard onNavigate={setActiveTab} />;
        }
    };
    const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Inventory Dashboard', color: 'blue' },
    { id: 'items', icon: Package, label: 'Items', color: 'green' },
    { id: 'stock', icon: BarChart3, label: 'Stock Management', color: 'purple' },
    { id: 'purchase-orders', icon: ShoppingCart, label: 'Purchase Orders', color: 'yellow' },
    { id: 'vendors', icon: Users, label: 'Vendors', color: 'pink' },
    { id: 'reports', icon: FileBarChart, label: 'Valuation & Reports', color: 'cyan' }
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
        <aside className="w-72 bg-[#EBF3FF] text-[#1E293B] border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www/w3/org/2000/svg " className="text-white">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="currentColor"/>
                    </svg>
                </div>
                <div>
                    <div className="font-bold tracking-tight">Mantha Tech</div>
                    <div className="text-xs text-gray-500">Inventory Management</div>
                </div>

            </div>
        </div>
        {/*Navigation Tabs */}
        <nav className="flex-1 p-1 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all group ${
                            isActive ? 'bg-[#2563EB] text-white' : 'text-[#1E293B] hover:bg-[#1D4ED8] hover:text-white'
                        }`}
                    >
                        <Icon size={20} className={isActive ? 'text-white' : 'text-[#1E293B] group-hover:text-white'} />
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                );
            })}
        </nav>

        {/* Logout */}
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </button>
        </aside>

        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-1">
                <div className="flex items-center justify-between">
      
                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <Search
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                            type="text"
                            value={globalSearchQuery}
                            onChange={(e) => setGlobalSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right Side - Notifications */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell size={20} className="text-gray-600" />
                            {notifications > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                            {notifications}
                            </span>
                        )}
                        </button>
                        {/*Profile*/}
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors relative" onClick={() => setProfileOpen(!profileOpen)}>
                            {/*Avatar*/}
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">IM
                            </div>
                            Inventory Manager
                            {/*Profile Dropdown*/}
                            <div className={`absolute right-0 mt-30 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 ${profileOpen ? 'block' : 'hidden'}`}>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </header>

            {/*Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {renderContent()}
            </main>

            {/* Toast Notifications */}
            <Toaster position="top-right" richColors />

        </div>

    </div>
  );
}
export default function InventoryManagerDashboard1({ onLogout }) {
  return (
    <InventoryProvider>
      <DashboardContent1 onLogout={onLogout} />
      <Toaster position="top-right" richColors />
    </InventoryProvider>
  );
}