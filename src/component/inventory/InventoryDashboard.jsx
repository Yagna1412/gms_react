import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
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
  RefreshCw,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  Settings,
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
  const [alertThresholds, setAlertThresholds] = useState({ low: 10, critical: 0 });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showSettings, setShowSettings] = useState(false);

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

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastUpdated(new Date());
        toast.info('Dashboard refreshed');
      }, 30000); // 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

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

  const stockLevelData = items.map(item => ({
    name: item.name,
    current: item.currentStock,
    min: item.minLevel,
    max: item.maxLevel,
    percentage: Math.min((item.currentStock / item.maxLevel) * 100, 100)
  }));

  // Handlers
  const handleCreatePO = (item) => {
    toast.success(`Creating PO for ${item.name}...`);
    if (onNavigate) onNavigate('purchase-orders');
  };
  const handleUrgentReorder = (item) => {
    toast.success(`Urgent reorder initiated for ${item.name}`);
    if (onNavigate) onNavigate('purchase-orders');
  };
  const handleQuickAction = (action) => {
    switch (action) {
      case 'create-po': if (onNavigate) onNavigate('purchase-orders'); break;
      case 'stock-adjustment': if (onNavigate) onNavigate('stock'); break;
      case 'stock-audit': toast.info('Stock Audit - Coming soon'); break;
      case 'generate-report': if (onNavigate) onNavigate('reports'); break;
      default: break;
    }
  };
  const handlePendingAction = (action) => {
    switch (action) {
      case 'purchase-orders': if (onNavigate) onNavigate('purchase-orders'); break;
      case 'approvals': toast.info('PO Approvals require Admin access'); break;
      case 'invoices': toast.info('Vendor Invoices - Coming soon'); break;
      case 'audits': toast.info('Stock Audits - Coming soon'); break;
      default: break;
    }
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
    toast.success('Dashboard refreshed successfully');
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
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage your inventory • Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert Threshold</label>
              <input
                type="number"
                value={alertThresholds.low}
                onChange={(e) => setAlertThresholds(prev => ({ ...prev, low: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Critical Stock Alert Threshold</label>
              <input
                type="number"
                value={alertThresholds.critical}
                onChange={(e) => setAlertThresholds(prev => ({ ...prev, critical: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Auto-refresh (30s)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">₹{(totalInventoryValue / 1000).toFixed(1)}K</div>
          <div className="text-sm text-gray-600 mt-1">Total Inventory Value</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="text-green-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalActiveItems}</div>
          <div className="text-sm text-gray-600 mt-1">Total Active Items</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{lowStockItems.length}</div>
          <div className="text-sm text-gray-600 mt-1">Low Stock Alerts</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{outOfStockItems.length}</div>
          <div className="text-sm text-gray-600 mt-1">Out of Stock Items</div>
        </div>
      </div>


      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Value by Category */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Inventory Value by Category</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <BarChart3 size={16} />
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`p-2 rounded ${chartType === 'pie' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <PieChart size={16} />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            {chartType === 'bar' ? (
              <BarChart data={inventoryByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            ) : (
              <RechartsPieChart>
                <Pie
                  data={inventoryByCategory}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </RechartsPieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Stock Status Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Stock Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={stockStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                label
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Trends */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Inventory Value Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={inventoryTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Inventory Items Management */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900">Inventory Items ({filteredAndSortedItems.length})</h2>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{selectedItems.length} selected</span>
              <button
                onClick={handleBulkReorder}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Bulk Reorder
              </button>
              <button
                onClick={handleBulkExport}
                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} className="inline mr-2" />
                Export Selected
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search items by name, SKU, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Filter size={16} />
            Filters
            {showFilters ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="sku">SKU</option>
                <option value="stock">Stock Level</option>
                <option value="price">Price</option>
                <option value="value">Total Value</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => handleSort(sortBy)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>
        )}

        {/* Items List with Enhanced Features */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {/* Header with Select All */}
          <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg font-semibold text-gray-700">
            <button onClick={handleSelectAll} className="text-gray-600 hover:text-gray-800">
              {selectedItems.length === filteredAndSortedItems.length && filteredAndSortedItems.length > 0 ?
                <CheckSquare size={20} /> : <Square size={20} />}
            </button>
            <span className="flex-1">Item Details</span>
            <span className="w-24 text-center">Stock Level</span>
            <span className="w-20 text-center">Status</span>
            <span className="w-24 text-right">Value</span>
            <span className="w-32 text-center">Actions</span>
          </div>

          {filteredAndSortedItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <button
                onClick={() => handleSelectItem(item.id)}
                className="text-gray-600 hover:text-gray-800"
              >
                {selectedItems.includes(item.id) ? <CheckSquare size={20} /> : <Square size={20} />}
              </button>

              <div className="flex items-center gap-3 flex-1">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-600">{item.sku} • {item.category}</div>
                </div>
              </div>

              <div className="w-24">
                <div className="text-sm font-semibold text-gray-900">{item.currentStock}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${getStockStatusColor(item)}`}
                    style={{ width: `${Math.min((item.currentStock / item.maxLevel) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Min: {item.minLevel}</div>
              </div>

              <div className="w-20 text-center">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${item.currentStock === 0 ? 'bg-red-100 text-red-700' :
                  item.currentStock <= item.minLevel ? 'bg-yellow-100 text-yellow-700' :
                    item.currentStock > item.maxLevel ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                  }`}>
                  {item.currentStock === 0 ? <XCircle size={12} /> :
                    item.currentStock <= item.minLevel ? <AlertTriangle size={12} /> :
                      item.currentStock > item.maxLevel ? <TrendingUp size={12} /> :
                        <CheckCircle size={12} />}
                  {getStockStatusText(item)}
                </span>
              </div>

              <div className="w-24 text-right">
                <div className="text-sm font-semibold text-gray-900">₹{(item.currentStock * item.costPrice).toLocaleString()}</div>
                <div className="text-xs text-gray-600">₹{item.costPrice}</div>
              </div>

              <div className="w-32 flex gap-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
                  onClick={() => handleCreatePO(item)}
                >
                  Reorder
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded hover:bg-gray-700 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Status & Low / Out of Stock Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Low Stock */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Low Stock Alerts</h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg">{lowStockItems.length} Items</span>
            </div>
            <div className="space-y-3">
              {lowStockItems.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-600">{item.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{item.currentStock} / {item.minLevel}</div>
                    <div className="text-xs text-yellow-600">Reorder: {item.reorderPoint}</div>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors" onClick={() => handleCreatePO(item)}>Create PO</button>
                </div>
              ))}
            </div>
          </div>

          {/* Out of Stock */}
          {outOfStockItems.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Out of Stock - Critical</h2>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg">{outOfStockItems.length} Items</span>
              </div>
              <div className="space-y-3">
                {outOfStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-600">{item.sku}</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors" onClick={() => handleUrgentReorder(item)}>Urgent Reorder</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Performance & Quick Actions */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUpIcon className="text-green-600" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Stock Accuracy</div>
                    <div className="text-xs text-gray-600">Last 30 days</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">98.5%</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Avg. Reorder Time</div>
                    <div className="text-xs text-gray-600">This month</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">2.3 days</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Turnover Ratio</div>
                    <div className="text-xs text-gray-600">Annual</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">4.2x</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left" onClick={() => handlePendingAction('purchase-orders')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Purchase Orders</div>
                    <div className="text-xs text-gray-600">{pendingPOs} pending</div>
                  </div>
                </div>
                <ArrowRight className="text-blue-600" size={20} />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors text-left" onClick={() => handlePendingAction('approvals')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-yellow-600" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">PO Approvals</div>
                    <div className="text-xs text-gray-600">{pendingApprovals} pending</div>
                  </div>
                </div>
                <ArrowRight className="text-yellow-600" size={20} />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left" onClick={() => handlePendingAction('invoices')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Vendor Invoices</div>
                    <div className="text-xs text-gray-600">3 pending</div>
                  </div>
                </div>
                <ArrowRight className="text-purple-600" size={20} />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left" onClick={() => handlePendingAction('audits')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ClipboardCheck className="text-green-600" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Stock Audits</div>
                    <div className="text-xs text-gray-600">1 due</div>
                  </div>
                </div>
                <ArrowRight className="text-green-600" size={20} />
              </button>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-blue">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full px-4 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm" onClick={() => handleQuickAction('create-po')}>
                <ShoppingCart className="inline mr-2" size={16} />
                Create PO
              </button>
              <button className="w-full px-4 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors text-sm" onClick={() => handleQuickAction('stock-adjustment')}>
                <TrendingUp className="inline mr-2" size={16} />
                Stock Adjust
              </button>
              <button className="w-full px-4 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors text-sm" onClick={() => handleQuickAction('stock-audit')}>
                <ClipboardCheck className="inline mr-2" size={16} />
                Stock Audit
              </button>
              <button className="w-full px-4 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors text-sm" onClick={() => handleQuickAction('generate-report')}>
                <FileText className="inline mr-2" size={16} />
                Reports
              </button>
              <button className="w-full px-4 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors text-sm" onClick={() => toast.info('Bulk import coming soon')}>
                <Download className="inline mr-2" size={16} />
                Import Data
              </button>
              <button className="w-full px-4 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors text-sm" onClick={() => toast.info('Analytics dashboard coming soon')}>
                <BarChart3 className="inline mr-2" size={16} />
                Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
