import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../../component/context/InventoryContext';
import { toast } from 'sonner';
import {
  DollarSign,
  Package,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ShoppingCart,
  FileText,
  Users,
  ClipboardCheck,
  ArrowRight,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  BarChart3,
  PieChart,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart
} from 'recharts';

export default function InventoryDashboard({ onNavigate }) {
  const { items, purchaseOrders } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [lastUpdated] = useState(new Date());
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pendingActionsRef = useRef(null);
  const quickActionsRef = useRef(null);

  // Statistics
  const totalInventoryValue = items.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
  const totalActiveItems = items.filter(item => item.status === 'Active').length;
  const lowStockItems = items.filter(item => item.currentStock <= item.minLevel && item.currentStock > 0);
  const outOfStockItems = items.filter(item => item.currentStock === 0);
  const overstockItems = items.filter(item => item.currentStock > item.maxLevel);
  const pendingPOs = purchaseOrders.filter(po => po.status === 'Pending' || po.status === 'Pending Approval').length;
  const pendingApprovals = purchaseOrders.filter(po => po.status === 'Pending Approval').length;
  const optimalStock = items.filter(item => item.currentStock > item.minLevel && item.currentStock <= item.maxLevel).length;

  // Charts data
  const inventoryByCategory = items.reduce((acc, item) => {
    const category = item.category || 'Others';
    const value = item.currentStock * item.costPrice;
    const existing = acc.find(c => c.category === category);
    if (existing) existing.value += value;
    else acc.push({ category, value });
    return acc;
  }, []);

  const stockStatusData = [
    { name: 'Optimal', value: optimalStock },
    { name: 'Low Stock', value: lowStockItems.length },
    { name: 'Critical', value: outOfStockItems.length },
    { name: 'Overstock', value: overstockItems.length },
  ];
  const COLORS = ['#34D399', '#FBBF24', '#EF4444', '#F97316'];

  // Get unique categories and statuses
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
  const statuses = [...new Set(items.map(item => item.status).filter(Boolean))];

  // Advanced filtering and sorting
  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name': aValue = a.name.toLowerCase(); bValue = b.name.toLowerCase(); break;
        case 'sku': aValue = a.sku.toLowerCase(); bValue = b.sku.toLowerCase(); break;
        case 'stock': aValue = a.currentStock; bValue = b.currentStock; break;
        case 'price': aValue = a.costPrice; bValue = b.costPrice; break;
        case 'value': aValue = a.currentStock * a.costPrice; bValue = b.currentStock * b.costPrice; break;
        default: return 0;
      }
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedPending = pendingActionsRef.current && pendingActionsRef.current.contains(event.target);
      const clickedQuick = quickActionsRef.current && quickActionsRef.current.contains(event.target);
      if (!clickedPending && !clickedQuick) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bulk operations
  const handleSelectAll = () => {
    if (selectedItems.length === filteredAndSortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedItems.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkReorder = () => {
    const selectedItemObjects = items.filter(item => selectedItems.includes(item.id));
    toast.success(`Bulk reorder initiated for ${selectedItemObjects.length} items`);
    if (onNavigate) onNavigate('purchase-orders');
  };

  const handleBulkExport = () => {
    const selectedItemObjects = items.filter(item => selectedItems.includes(item.id));
    const csvContent = [
      ['Name', 'SKU', 'Category', 'Current Stock', 'Min Level', 'Max Level', 'Cost Price', 'Status'],
      ...selectedItemObjects.map(item => [
        item.name, item.sku, item.category, item.currentStock, item.minLevel, item.maxLevel, item.costPrice, item.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Inventory data exported successfully');
  };

  // Enhanced chart data
  const inventoryTrendsData = [
    { month: 'Jan', value: totalInventoryValue * 0.8 },
    { month: 'Feb', value: totalInventoryValue * 0.85 },
    { month: 'Mar', value: totalInventoryValue * 0.9 },
    { month: 'Apr', value: totalInventoryValue * 0.95 },
    { month: 'May', value: totalInventoryValue * 1.0 },
    { month: 'Jun', value: totalInventoryValue * 1.05 },
  ];

  // Handlers
  const handleCreatePO = (item) => {
    toast.success(`Creating PO for ${item.name}...`);
    if (onNavigate) onNavigate('purchase-orders');
  };
  const handleUrgentReorder = (item) => {
    toast.success(`Urgent reorder initiated for ${item.name}`);
    if (onNavigate) onNavigate('purchase-orders');
  };
  const handleEditItem = (item) => {
    toast.info(`Opening item details for ${item.name}`);
    if (onNavigate) onNavigate('items');
  };
  const handleQuickAction = (action) => {
    setActiveDropdown(null);
    switch (action) {
      case 'create-po':
        toast.success('Opening Purchase Orders');
        if (onNavigate) onNavigate('purchase-orders');
        break;
      case 'stock-adjustment':
        toast.success('Opening Stock Management');
        if (onNavigate) onNavigate('stock');
        break;
      case 'stock-audit':
        toast.info('Opening reports for stock audit review');
        if (onNavigate) onNavigate('reports');
        break;
      case 'generate-report':
        toast.success('Opening Valuation & Reports');
        if (onNavigate) onNavigate('reports');
        break;
      case 'import-data':
        toast.info('Opening Items for data import');
        if (onNavigate) onNavigate('items');
        break;
      case 'analytics':
        toast.info('Opening analytics reports');
        if (onNavigate) onNavigate('reports');
        break;
      default: break;
    }
  };
  const handlePendingAction = (action) => {
    setActiveDropdown(null);
    switch (action) {
      case 'purchase-orders':
        if (onNavigate) onNavigate('purchase-orders');
        break;
      case 'approvals':
        toast.info('Opening pending purchase approvals');
        if (onNavigate) onNavigate('purchase-orders');
        break;
      case 'invoices':
        toast.info('Opening vendor billing view');
        if (onNavigate) onNavigate('vendors');
        break;
      case 'audits':
        toast.info('Opening stock audit reports');
        if (onNavigate) onNavigate('reports');
        break;
      default: break;
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStockStatusColor = (item) => {
    if (item.currentStock === 0) return 'bg-red-500';
    if (item.currentStock <= item.minLevel) return 'bg-yellow-500';
    if (item.currentStock > item.maxLevel) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStockStatusText = (item) => {
    if (item.currentStock === 0) return 'Out of Stock';
    if (item.currentStock <= item.minLevel) return 'Low Stock';
    if (item.currentStock > item.maxLevel) return 'Overstock';
    return 'Optimal';
  };

  return (
    <div className="space-y-6 max-w-[100vw] overflow-x-hidden">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Monitor and manage your inventory • Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none" ref={pendingActionsRef}>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'pending' ? null : 'pending')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors font-medium text-sm"
            >
              <Clock size={16} />
              Pending Actions
            </button>
            {activeDropdown === 'pending' && (
              <div className="absolute right-0 left-0 lg:left-auto mt-2 w-full lg:w-[320px] max-w-[calc(100vw-2rem)] bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 border border-yellow-200 rounded-2xl shadow-xl z-20 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handlePendingAction('purchase-orders')}
                    className="h-16 rounded-2xl bg-white text-amber-700 font-semibold hover:bg-yellow-50 transition-colors px-3 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={16} className="shrink-0" />
                      <div className="truncate">
                        <div className="truncate">Purchase Orders</div>
                        <div className="text-xs text-amber-600">{pendingPOs} pending</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handlePendingAction('approvals')}
                    className="h-16 rounded-2xl bg-white/70 text-amber-800 font-semibold hover:bg-white/90 transition-colors px-3 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="shrink-0" />
                      <div className="truncate">
                        <div className="truncate">PO Approvals</div>
                        <div className="text-xs text-amber-700">{pendingApprovals} pending</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handlePendingAction('invoices')}
                    className="h-16 rounded-2xl bg-white/70 text-amber-800 font-semibold hover:bg-white/90 transition-colors px-3 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Users size={16} className="shrink-0" />
                      <div className="truncate">
                        <div className="truncate">Vendor Invoices</div>
                        <div className="text-xs text-amber-700">3 pending</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handlePendingAction('audits')}
                    className="h-16 rounded-2xl bg-white/70 text-amber-800 font-semibold hover:bg-white/90 transition-colors px-3 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardCheck size={16} className="shrink-0" />
                      <div className="truncate">
                        <div className="truncate">Stock Audits</div>
                        <div className="text-xs text-amber-700">1 due</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex-1 lg:flex-none" ref={quickActionsRef}>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'quick' ? null : 'quick')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Zap size={16} />
              Quick Actions
            </button>
            {activeDropdown === 'quick' && (
              <div className="absolute right-0 left-0 lg:left-auto mt-2 w-full lg:w-[320px] max-w-[calc(100vw-2rem)] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl z-20 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQuickAction('create-po')}
                    className="h-16 rounded-2xl bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Create PO
                  </button>
                  <button
                    onClick={() => handleQuickAction('stock-adjustment')}
                    className="h-16 rounded-2xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={16} />
                    Stock Adjustment
                  </button>
                  <button
                    onClick={() => handleQuickAction('stock-audit')}
                    className="h-16 rounded-2xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <ClipboardCheck size={16} />
                    Stock Audit
                  </button>
                  <button
                    onClick={() => handleQuickAction('generate-report')}
                    className="h-16 rounded-2xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText size={16} />
                    Reports
                  </button>
                  <button
                    onClick={() => handleQuickAction('import-data')}
                    className="h-16 rounded-2xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Import Data
                  </button>
                  <button
                    onClick={() => handleQuickAction('analytics')}
                    className="h-16 rounded-2xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <BarChart3 size={16} />
                    Analytics
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">₹{(totalInventoryValue / 1000).toFixed(1)}K</div>
          <div className="text-sm text-gray-600 mt-1">Total Inventory Value</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="text-green-600" size={24} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalActiveItems}</div>
          <div className="text-sm text-gray-600 mt-1">Total Active Items</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{lowStockItems.length}</div>
          <div className="text-sm text-gray-600 mt-1">Low Stock Alerts</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{outOfStockItems.length}</div>
          <div className="text-sm text-gray-600 mt-1">Out of Stock Items</div>
        </div>
      </div>

      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Value by Category */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Value by Category</h2>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setChartType('bar')}
                className={`p-1.5 rounded-md transition-colors ${chartType === 'bar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <BarChart3 size={16} />
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`p-1.5 rounded-md transition-colors ${chartType === 'pie' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <PieChart size={16} />
              </button>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={inventoryByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(val) => `₹${val / 1000}k`} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              ) : (
                <RechartsPieChart>
                  <Pie
                    data={inventoryByCategory}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                  >
                    {inventoryByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </RechartsPieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Status Distribution */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={stockStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  label={({ name, percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                  labelLine={false}
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Trends */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Value Trends</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => `₹${val / 1000}k`} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enhanced Inventory Items Management */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header and Controls */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold text-gray-900">Inventory Items</h2>
            <div className="flex flex-wrap items-center gap-2">
               {selectedItems.length > 0 && (
                <>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{selectedItems.length} Selected</span>
                  <button onClick={handleBulkReorder} className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                    Bulk Reorder
                  </button>
                  <button onClick={handleBulkExport} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition" title="Export Selected">
                    <Download size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search items by name or SKU..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
             </div>
             <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                <Filter size={16} /> Filters
             </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="all">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Status</label>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="all">All Statuses</option>
                  {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Sort By</label>
                <div className="flex gap-2">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option value="name">Name</option>
                    <option value="stock">Stock Level</option>
                    <option value="value">Total Value</option>
                  </select>
                  <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                    {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Responsive Items List */}
        <div className="flex-1 overflow-y-auto max-h-[500px] p-4 sm:p-6 bg-gray-50/50">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center gap-4 p-3 bg-gray-100 rounded-lg font-semibold text-gray-600 text-xs uppercase tracking-wider mb-3">
            <button onClick={handleSelectAll} className="w-5 flex justify-center text-gray-500 hover:text-gray-800">
              {selectedItems.length === filteredAndSortedItems.length && filteredAndSortedItems.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
            </button>
            <div className="flex-1">Item Details</div>
            <div className="w-32 text-center">Stock Level</div>
            <div className="w-24 text-center">Status</div>
            <div className="w-28 text-right">Value</div>
            <div className="w-32 text-center">Actions</div>
          </div>

          <div className="space-y-3">
            {filteredAndSortedItems.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                
                {/* Mobile Top / Desktop Left - Info */}
                <div className="flex items-start md:items-center gap-3 w-full md:w-auto md:flex-1">
                  <button onClick={() => handleSelectItem(item.id)} className="mt-1 md:mt-0 text-gray-400 hover:text-blue-600 shrink-0">
                    {selectedItems.includes(item.id) ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} />}
                  </button>
                  <img src={item.image} alt={item.name} className="w-14 h-14 md:w-12 md:h-12 rounded-lg object-cover shrink-0 border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm md:text-base truncate pr-2">{item.name}</div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">{item.sku} • {item.category}</div>
                  </div>
                  {/* Mobile-only status badge */}
                  <div className="md:hidden shrink-0 ml-auto">
                     <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(item).replace('bg-', 'text-').replace('500', '700')} ${getStockStatusColor(item).replace('500', '100')}`}>
                        {getStockStatusText(item)}
                     </span>
                  </div>
                </div>

                {/* Mobile Bottom Grid / Desktop Right Columns */}
                <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-none border-gray-100">
                  
                  {/* Stock */}
                  <div className="md:w-32 flex flex-col justify-center">
                    <div className="text-sm font-bold text-gray-900 flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-medium text-xs uppercase">Stock:</span>
                      <span className="md:text-center block">{item.currentStock}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                      <div className={`h-1.5 rounded-full ${getStockStatusColor(item)}`} style={{ width: `${Math.min((item.currentStock / item.maxLevel) * 100, 100)}%` }} />
                    </div>
                  </div>

                  {/* Desktop Status */}
                  <div className="hidden md:flex md:w-24 justify-center">
                    <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStockStatusColor(item).replace('bg-', 'text-').replace('500', '700')} ${getStockStatusColor(item).replace('500', '100')}`}>
                      {getStockStatusText(item)}
                    </span>
                  </div>

                  {/* Value */}
                  <div className="md:w-28 flex flex-col justify-center text-right">
                    <div className="text-sm font-bold text-gray-900 flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-medium text-xs uppercase">Value:</span>
                      <span>₹{(item.currentStock * item.costPrice).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500 hidden md:block mt-0.5">₹{item.costPrice}/unit</div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 md:col-span-1 md:w-32 flex gap-2 mt-1 md:mt-0">
                    <button onClick={() => handleCreatePO(item)} className="flex-1 px-3 py-2 md:py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors">
                      Reorder
                    </button>
                    <button onClick={() => handleEditItem(item)} className="flex-1 px-3 py-2 md:py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                      Edit
                    </button>
                  </div>

                </div>
              </div>
            ))}
            {filteredAndSortedItems.length === 0 && (
              <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                <Package className="mx-auto text-gray-300 mb-3" size={40} />
                <h3 className="text-base font-bold text-gray-900">No items found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stock Status & Low / Out of Stock Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Low Stock Container */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                 <AlertTriangle size={20} className="text-yellow-500" /> Low Stock Alerts
              </h2>
              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-bold rounded-full">{lowStockItems.length} Items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lowStockItems.slice(0, 4).map((item) => (
                <div key={item.id} className="flex flex-col justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-md transition-shadow gap-4">
                  <div className="flex items-start gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-white border border-gray-200" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm leading-tight">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">{item.sku}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <div className="text-sm font-black text-red-600">{item.currentStock} <span className="text-xs font-medium text-gray-500">/ {item.minLevel} min</span></div>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm" onClick={() => handleCreatePO(item)}>
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {lowStockItems.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No low stock items currently.</p>}
          </div>

          {/* Out of Stock Container */}
          {outOfStockItems.length > 0 && (
            <div className="bg-red-50 rounded-2xl p-4 sm:p-6 border border-red-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
                  <XCircle size={20} className="text-red-500" /> Critical: Out of Stock
                </h2>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">{outOfStockItems.length} Items</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {outOfStockItems.map((item) => (
                  <div key={item.id} className="flex flex-col justify-between p-4 bg-white border border-red-100 rounded-xl shadow-sm gap-4">
                    <div className="flex items-start gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                      <div>
                        <div className="font-bold text-gray-900 text-sm leading-tight">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-1 font-mono">{item.sku}</div>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm" onClick={() => handleUrgentReorder(item)}>
                      Urgent Reorder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Performance & Actions */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Performance Metrics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-green-100 rounded-lg flex items-center justify-center shadow-sm">
                    <TrendingUpIcon className="text-green-600" size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">Stock Accuracy</div>
                    <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">Last 30 days</div>
                  </div>
                </div>
                <div className="text-lg font-black text-green-600">98.5%</div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-blue-100 rounded-lg flex items-center justify-center shadow-sm">
                    <Clock className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">Reorder Time</div>
                    <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">This month</div>
                  </div>
                </div>
                <div className="text-lg font-black text-blue-600">2.3d</div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-purple-100 rounded-lg flex items-center justify-center shadow-sm">
                    <Zap className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">Turnover Ratio</div>
                    <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">Annualized</div>
                  </div>
                </div>
                <div className="text-lg font-black text-purple-600">4.2x</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}