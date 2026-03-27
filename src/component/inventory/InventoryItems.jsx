import React, { useState, useRef } from 'react';
import { useInventory } from '../../component/context/InventoryContext';
import { toast } from 'sonner';
import {
    Package,
    Plus,
    Search,
    Download,
    Edit2,
    Trash2,
    Eye,
    X,
    Upload,
    BarChart3
} from 'lucide-react';

export default function InventoryItems() {
    const { items, addItem, updateItem, deleteItem } = useInventory();
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);
    const [barcodeItem, setBarcodeItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        category: '',
        currentStock: 0,
        minLevel: 0,
        maxLevel: 0,
        reorderPoint: 0,
        costPrice: 0,
        sellingPrice: 0,
        status: 'Active',
        image: '',
        description: '',
        markup: 0
    });

    const resetForm = () => {
        setFormData({
            sku: '',
            name: '',
            category: '',
            currentStock: 0,
            minLevel: 0,
            maxLevel: 0,
            reorderPoint: 0,
            costPrice: 0,
            sellingPrice: 0,
            status: 'Active',
            image: '',
            description: '',
            markup: 0
        });
        setSelectedItem(null);
        setCurrentStep(1);
    };

    // Calculate statistics
    const totalItems = items?.length || 0;
    const activeItems = items?.filter(item => item.status === 'Active').length || 0;
    const lowStockItems = items?.filter(item => item.currentStock <= item.minLevel && item.currentStock > 0).length || 0;
    const outOfStockItems = items?.filter(item => item.currentStock === 0).length || 0;

    // Get unique categories
    const categories = ['All', ...new Set(items?.map(item => item.category) || [])];

    // Filter items
    const filteredItems = items?.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    }) || [];

    const calculateMarkup = (cost, selling) => {
        if (!cost || cost === 0) return 0;
        return (((selling - cost) / cost) * 100).toFixed(2);
    };

    const getStockStatus = (item) => {
        if (item.currentStock === 0) return { label: 'Out of Stock', color: 'red' };
        if (item.currentStock <= item.minLevel) return { label: 'Low Stock', color: 'yellow' };
        if (item.currentStock <= item.reorderPoint) return { label: 'Reorder Soon', color: 'orange' };
        return { label: 'In Stock', color: 'green' };
    };

    const getStockPercentage = (item) => {
        if (!item.maxLevel) return 0;
        return Math.min((item.currentStock / item.maxLevel) * 100, 100);
    };

    const handleAddItem = () => {
        if (!formData.sku || !formData.name || !formData.category) {
            toast.error('Please fill all required fields');
            return;
        }
        addItem(formData);
        toast.success('Item added successfully!');
        setShowAddModal(false);
        resetForm();
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setFormData({ ...item });
        setCurrentStep(1);
        setShowAddModal(true);
    };

    const handleUpdateItem = () => {
        if (!formData.sku || !formData.name || !formData.category) {
            toast.error('Please fill all required fields');
            return;
        }
        updateItem(selectedItem.id, formData);
        toast.success('Item updated successfully!');
        setShowAddModal(false);
        resetForm();
    };

    const handleDeleteItem = (id, name) => {
        if (window.confirm(`Confirm to delete item? This action cannot be undone.`)) {
            deleteItem(id);
            toast.success('Item deleted successfully!');
            setShowDetailModal(false);
        }
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setShowDetailModal(true);
    };

    const exportToCSV = () => {
        if (!filteredItems || filteredItems.length === 0) {
            toast.error('No items to export');
            return;
        }
        const cols = ['id', 'sku', 'name', 'category', 'currentStock', 'minLevel', 'maxLevel', 'reorderPoint', 'costPrice', 'sellingPrice', 'markup', 'status', 'description', 'image'];
        const escape = (val) => {
            if (val === null || val === undefined) return '';
            return `"${String(val).replace(/"/g, '""')}"`;
        };
        const header = cols.map(c => c.toUpperCase()).join(',');
        const lines = filteredItems.map(r => cols.map(c => escape(r[c])).join(','));
        const csv = [header, ...lines].join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success('Inventory exported as CSV');
    };

    const handleImportCSV = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csv = event.target?.result;
                const lines = csv.split('\n').filter((line) => line.trim());
                if (lines.length < 2) {
                    toast.error('CSV file is empty or invalid');
                    return;
                }

                const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
                let importedCount = 0;
                let skippedCount = 0;

                for (let i = 1; i < lines.length; i++) {
                    try {
                        const values = lines[i].match(/("([^"]*)"|[^,]+)/g)?.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"')) || [];
                        if (values.length === 0) continue;

                        const row = {};
                        headers.forEach((header, idx) => {
                            row[header] = values[idx] || '';
                        });

                        if (!row.sku || !row.name || !row.category) {
                            skippedCount++;
                            continue;
                        }

                        const newItem = {
                            sku: row.sku,
                            name: row.name,
                            category: row.category,
                            currentStock: parseInt(row.currentstock) || 0,
                            minLevel: parseInt(row.minlevel) || 0,
                            maxLevel: parseInt(row.maxlevel) || 0,
                            reorderPoint: parseInt(row.reorderpoint) || 0,
                            costPrice: parseFloat(row.costprice) || 0,
                            sellingPrice: parseFloat(row.sellingprice) || 0,
                            status: row.status || 'Active',
                            description: row.description || '',
                            image: row.image || 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=100',
                            markup: parseFloat(row.markup) || 0
                        };

                        addItem(newItem);
                        importedCount++;
                    } catch (error) {
                        skippedCount++;
                    }
                }

                if (importedCount > 0) {
                    toast.success(`Imported ${importedCount} items${skippedCount > 0 ? `, skipped ${skippedCount}` : ''}`);
                } else {
                    toast.error('No valid items found to import');
                }
            } catch (error) {
                toast.error('Error parsing CSV file');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const generateBarcode = (item) => {
        setBarcodeItem(item);
        setShowBarcodeModal(true);
    };

    const downloadBarcode = () => {
        if (!barcodeItem) return;
        const canvas = document.getElementById('barcode-canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `barcode-${barcodeItem.sku}.png`;
            link.click();
            toast.success('Barcode downloaded');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData({ ...formData, image: event.target?.result });
            toast.success('Image uploaded successfully');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Items</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage your product catalog.</p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 md:gap-4">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto flex-1 md:flex-none justify-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Upload size={18} />
                        <span className="hidden sm:inline">Bulk Import</span>
                        <span className="sm:hidden">Import</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleImportCSV}
                        className="hidden"
                    />
                    <button
                        onClick={exportToCSV}
                        className="w-full sm:w-auto flex-1 md:flex-none justify-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Download size={18} />
                        Export
                    </button>
                    <button onClick={() => { resetForm(); setShowAddModal(true); }}
                        className="w-full sm:w-auto justify-center flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm">
                        <Plus size={18} />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Total Items', value: totalItems, icon: Package, color: 'blue' },
                    { label: 'Active Stock', value: activeItems, icon: Package, color: 'green' },
                    { label: 'Low Stock', value: lowStockItems, icon: Package, color: 'yellow' },
                    { label: 'Out of Stock', value: outOfStockItems, icon: Package, color: 'red' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100 shrink-0`}>
                                <stat.icon size={22} className={`text-${stat.color}-600`} />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{stat.value}</div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row flex-wrap gap-4">
                    <div className="w-full md:flex-1">
                        <div className="relative">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                placeholder="Search by name or SKU..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full sm:w-48 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full sm:w-40 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Inventory Items Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left border-collapse">
                        <thead className="bg-gray-50/80 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">SKU</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Item Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Stock</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Min Level</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Cost</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Selling</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900 whitespace-nowrap">{item.sku}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-200" />
                                            {item.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{item.category}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <span className={`font-bold px-2 py-1 rounded-md ${
                                            item.currentStock === 0 ? 'bg-red-50 text-red-700' :
                                            item.currentStock <= item.minLevel ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                                        }`}>
                                            {item.currentStock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{item.minLevel}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">₹{item.costPrice}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">₹{item.sellingPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg ${
                                            item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View" onClick={() => handleViewDetails(item)}>
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit" onClick={() => handleEditItem(item)}>
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={() => handleDeleteItem(item.id, item.name)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredItems.length === 0 && (
                    <div className="text-center py-16 px-4">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No items found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="bg-white border-b border-gray-200 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedItem ? 'Edit Item' : 'Add New Item'}
                            </h2>
                            <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Step Indicators */}
                        <div className="px-5 sm:px-6 py-4 bg-gray-50/50 border-b border-gray-200 overflow-x-auto shrink-0">
                            <div className="flex min-w-max items-center">
                                {['Basic Info', 'Images', 'Pricing', 'Stock Levels'].map((step, index) => (
                                    <div key={step} className="flex items-center">
                                        <div className={`flex items-center gap-2 ${index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                                                index + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-500'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <span className="text-sm font-semibold mr-2 sm:mr-0">{step}</span>
                                        </div>
                                        {index < 3 && (
                                            <div className={`w-6 sm:w-10 h-1 mx-2 sm:mx-4 rounded-full ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                            {currentStep === 1 && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">SKU <span className="text-red-500">*</span></label>
                                            <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., OIL-5W30-001" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Item Name <span className="text-red-500">*</span></label>
                                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., 5W30 Synthetic Oil" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                                                <option value="">Select Category</option>
                                                <option value="Oils & Lubricants">Oils & Lubricants</option>
                                                <option value="Brake Parts">Brake Parts</option>
                                                <option value="Filters">Filters</option>
                                                <option value="Electrical">Electrical</option>
                                                <option value="Batteries">Batteries</option>
                                                <option value="Suspension">Suspension</option>
                                                <option value="Engine Parts">Engine Parts</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Enter item description..." rows={4}></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-5">
                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors" onClick={() => imageInputRef.current?.click()}>
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                            <Upload className="text-blue-500" size={32} />
                                        </div>
                                        <p className="text-base font-bold text-gray-900 mb-1">Click to upload product image</p>
                                        <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                                    </div>
                                    <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    {formData.image && (
                                        <div className="mt-6 flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                            <p className="text-sm font-bold text-gray-700 mb-3 self-start">Image Preview</p>
                                            <img src={formData.image} alt="Preview" className="w-48 h-48 rounded-xl object-cover border border-gray-300 shadow-sm" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Cost Price (₹) <span className="text-red-500">*</span></label>
                                            <input type="number" value={formData.costPrice} onChange={(e) => {
                                                const cost = parseFloat(e.target.value) || 0;
                                                setFormData({ ...formData, costPrice: cost, markup: calculateMarkup(cost, formData.sellingPrice) });
                                            }} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="0.00" min="0" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Selling Price (₹) <span className="text-red-500">*</span></label>
                                            <input type="number" value={formData.sellingPrice} onChange={(e) => {
                                                const selling = parseFloat(e.target.value) || 0;
                                                setFormData({ ...formData, sellingPrice: selling, markup: calculateMarkup(formData.costPrice, selling) });
                                            }} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="0.00" min="0" />
                                        </div>
                                    </div>
                                    <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-bold text-blue-900 uppercase tracking-wide">Profit Margin</span>
                                            <span className="text-3xl font-black text-blue-600">{formData.markup}%</span>
                                        </div>
                                        <p className="text-sm text-blue-800 font-medium">Estimated profit per unit: ₹{Math.max(0, formData.sellingPrice - formData.costPrice).toFixed(2)}</p>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Current Stock <span className="text-red-500">*</span></label>
                                            <input type="number" value={formData.currentStock} onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" min="0" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Minimum Level <span className="text-red-500">*</span></label>
                                            <input type="number" value={formData.minLevel} onChange={(e) => setFormData({ ...formData, minLevel: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" min="0" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Maximum Level <span className="text-red-500">*</span></label>
                                            <input type="number" value={formData.maxLevel} onChange={(e) => setFormData({ ...formData, maxLevel: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" min="0" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Reorder Level <span className="text-red-500">*</span></label>
                                            <input type="number" value={formData.reorderPoint} onChange={(e) => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" min="0" />
                                        </div>
                                    </div>
                                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                                        <h3 className="text-sm font-bold text-gray-900 mb-4">Stock Level Indicators Guide</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-gray-700">
                                            <div className="flex items-center gap-3"><div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div> Optimal Range</div>
                                            <div className="flex items-center gap-3"><div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div> Low Stock Warning</div>
                                            <div className="flex items-center gap-3"><div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div> Critical / Out of Stock</div>
                                            <div className="flex items-center gap-3"><div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div> Overstock Warning</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer/Navigation */}
                        <div className="bg-gray-50 border-t border-gray-200 px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                            <button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1} className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm order-2 sm:order-1">
                                Back
                            </button>
                            <div className="text-sm font-bold text-gray-500 order-1 sm:order-2">Step {currentStep} of 4</div>
                            {currentStep < 4 ? (
                                <button onClick={() => setCurrentStep(currentStep + 1)} className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm order-3">
                                    Next Step
                                </button>
                            ) : (
                                <button onClick={selectedItem ? handleUpdateItem : handleAddItem} className="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm order-3">
                                    {selectedItem ? 'Update Item' : 'Save Item'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailModal && selectedItem && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="bg-white border-b border-gray-200 px-5 sm:px-8 py-5 flex items-center justify-between shrink-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Item Overview</h2>
                            <button onClick={() => setShowDetailModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                {/* Left Col - Info */}
                                <div className="space-y-6">
                                    <div className="aspect-video w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={selectedItem.image || 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400'} alt={selectedItem.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">SKU</p>
                                            <p className="text-base sm:text-lg font-mono font-bold text-gray-900">{selectedItem.sku}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-lg ${getStockStatus(selectedItem).color === 'red' ? 'bg-red-100 text-red-700' : getStockStatus(selectedItem).color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : getStockStatus(selectedItem).color === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                {getStockStatus(selectedItem).label}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Item Name</p>
                                            <p className="text-lg sm:text-xl font-bold text-gray-900">{selectedItem.name}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</p>
                                            <p className="text-base font-semibold text-gray-700">{selectedItem.category}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                                            <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                                                {selectedItem.description || "No description provided."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right Col - Metrics */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                        <h3 className="font-bold text-gray-900 mb-5 text-lg flex items-center gap-2"><Package size={20}/> Stock Metrics</h3>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex justify-between items-center pb-3 border-b border-gray-200"><span className="text-gray-600 font-bold">Current Stock</span><span className="font-black text-lg text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">{selectedItem.currentStock}</span></div>
                                            <div className="flex justify-between items-center"><span className="text-gray-600 font-semibold">Minimum Level</span><span className="font-bold text-gray-900">{selectedItem.minLevel}</span></div>
                                            <div className="flex justify-between items-center"><span className="text-gray-600 font-semibold">Maximum Level</span><span className="font-bold text-gray-900">{selectedItem.maxLevel}</span></div>
                                            <div className="flex justify-between items-center"><span className="text-gray-600 font-semibold">Reorder Point</span><span className="font-bold text-gray-900">{selectedItem.reorderPoint}</span></div>
                                            <div className="pt-2">
                                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                    <div className={`h-full transition-all duration-500 ${getStockStatus(selectedItem).color === 'red' ? 'bg-red-500' : getStockStatus(selectedItem).color === 'yellow' ? 'bg-yellow-500' : getStockStatus(selectedItem).color === 'orange' ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${getStockPercentage(selectedItem)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                                        <h3 className="font-bold text-blue-900 mb-5 text-lg flex items-center gap-2"><BarChart3 size={20}/> Pricing Structure</h3>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex justify-between items-center"><span className="text-blue-800 font-semibold">Cost Price</span><span className="font-bold text-lg text-gray-900">₹{selectedItem.costPrice.toLocaleString()}</span></div>
                                            <div className="flex justify-between items-center"><span className="text-blue-800 font-semibold">Selling Price</span><span className="font-bold text-lg text-gray-900">₹{selectedItem.sellingPrice.toLocaleString()}</span></div>
                                            <div className="flex justify-between items-center pt-4 border-t border-blue-200/60"><span className="text-blue-900 font-bold uppercase tracking-wide">Profit Margin</span><span className="font-black text-xl text-green-600">{selectedItem.markup}%</span></div>
                                        </div>
                                    </div>

                                    {/* Action Buttons wrapped for mobile */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                                        <button onClick={() => { setShowDetailModal(false); handleEditItem(selectedItem); }} className="w-full sm:w-auto flex-1 px-4 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm">
                                            Edit Details
                                        </button>
                                        <button onClick={() => generateBarcode(selectedItem)} className="w-full sm:w-auto px-4 py-3.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm text-sm">
                                            <BarChart3 size={18} /> Barcode
                                        </button>
                                        <button onClick={() => handleDeleteItem(selectedItem.id, selectedItem.name)} className="w-full sm:w-auto px-4 py-3.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center shadow-sm text-sm" title="Delete Item">
                                            <Trash2 size={18} />
                                            <span className="sm:hidden ml-2">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Barcode Modal */}
            {showBarcodeModal && barcodeItem && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Generate Barcode</h2>
                            <button onClick={() => setShowBarcodeModal(false)} className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl flex justify-center items-center mb-6 overflow-x-auto border border-gray-200 shadow-inner">
                            <canvas
                                id="barcode-canvas"
                                ref={(canvas) => {
                                    if (canvas && barcodeItem) {
                                        const ctx = canvas.getContext('2d');
                                        const barWidth = 2;
                                        const barHeight = 80;
                                        const padding = 20;

                                        canvas.width = (barcodeItem.sku.length * barWidth * 12) + (padding * 2);
                                        canvas.height = barHeight + padding * 3;

                                        if (ctx) {
                                            ctx.fillStyle = '#ffffff';
                                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                                            ctx.fillStyle = '#111827';
                                            ctx.font = 'bold 16px Inter, sans-serif';
                                            ctx.textAlign = 'center';
                                            ctx.fillText(barcodeItem.sku, canvas.width / 2, canvas.height - 5);

                                            let xPosition = padding;
                                            for (let i = 0; i < barcodeItem.sku.length; i++) {
                                                const charCode = barcodeItem.sku.charCodeAt(i);
                                                for (let j = 0; j < 12; j++) {
                                                    if ((charCode >> j) & 1) ctx.fillRect(xPosition, padding, barWidth, barHeight);
                                                    xPosition += barWidth;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
                                <p className="text-sm font-bold text-blue-900 truncate">{barcodeItem.name}</p>
                                <p className="text-xs text-blue-700 font-mono mt-1">SKU: {barcodeItem.sku}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button onClick={downloadBarcode} className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                    <Download size={18} /> Download Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}