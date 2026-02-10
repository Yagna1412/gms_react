import React, { useState, useRef } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { toast } from 'sonner';
import {
    Package,
    Plus,
    Search,
    Filter,
    Download,
    Edit2,
    Trash2,
    Eye,
    X,
    Upload,
    BarChart3
} from 'lucide-react';
export default function InventoryItems1() {

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
    const [selectedItem, setSelectedItem] = useState(null); // For edit functionality
    const [currentStep, setCurrentStep] = useState(1); // For multi-step form
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
        description: ''
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
            description: ''
        });
        setSelectedItem(null);
        setCurrentStep(1);
    }

    // Calculate statistics from actual data
    const totalItems = items.length;
    const activeItems = items.filter(item => item.status === 'Active').length;
    const lowStockItems = items.filter(item => item.currentStock <= item.minLevel && item.currentStock > 0).length;
    const outOfStockItems = items.filter(item => item.currentStock === 0).length;

    // Get unique categories
    const categories = ['All', ...new Set(items.map(item => item.category))];

    // Filter items based on current filters
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const calculateMarkup = (cost, selling) => {
        if (cost === 0) return 0;
        return (((selling - cost) / cost) * 100).toFixed(2);
    };

    const getStockStatus = (item) => {
        if (item.currentStock === 0) {
            return { label: 'Out of Stock', color: 'red' };
        } else if (item.currentStock <= item.minLevel) {
            return { label: 'Low Stock', color: 'yellow' };
        } else if (item.currentStock <= item.reorderPoint) {
            return { label: 'Reorder Soon', color: 'orange' };
        } else {
            return { label: 'In Stock', color: 'green' };
        }
    };

    const getStockPercentage = (item) => {
        return Math.min((item.currentStock / item.maxLevel) * 100, 100);
    };

    const handleAddItem = () => {
        if (!formData.sku || !formData.name || !formData.category) {
            toast.error('Please fill all required fields');
            return;
        }
        // Validation can be added here
        addItem(formData);
        toast.success('Item added successfully!');
        setShowAddModal(false);
        resetForm();
    };

    const handleEditItem = () => {
        setSelectedItem(item);
        setFormData(item);
        setCurrentStep(1);
        setShowAddModal(true);
    };

    const handleUpdateItem = () => {
        if (!formData.sku || !formData.name || !formData.category) {
            toast.error('Please fill all required fields');
            return;
        }
        // Validation can be added here
        updateItem(selectedItem.id, formData);
        toast.success('Item updated successfully!');
        setShowAddModal(false);
        resetForm();
    };

    const handleDeleteItem = (id, name) => {
        if (window.confirm(`Confirm to delete item "${name}"? This action cannot be undone.`))
            deleteItem(id);
        // Confirmation can be added here
        toast.success('Item deleted successfully!');
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setShowDetailModal(true);
        toast.info('Viewing item details');
    };

    // Export to CSV
    const exportToCSV = () => {
        if (!filteredItems || filteredItems.length === 0) {
            toast.error('No items to export');
            return;
        }
        const cols = ['id', 'sku', 'name', 'category', 'currentStock', 'minLevel', 'maxLevel', 'reorderPoint', 'costPrice', 'sellingPrice', 'markup', 'status', 'description', 'image'];
        const escape = (val) => {
            if (val === null || val === undefined) return '';
            const s = String(val);
            return `"${s.replace(/"/g, '""')}"`;
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

    // Import from CSV
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

                        // Validate required fields
                        if (!row.sku || !row.name || !row.category) {
                            skippedCount++;
                            continue;
                        }

                        // Create item object
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

    // Generate Barcode
    const generateBarcode = (item) => {
        setBarcodeItem(item);
        setShowBarcodeModal(true);
    };

    // Download Barcode as Image
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

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Image = event.target?.result;
            setFormData({
                ...formData,
                image: base64Image
            });
            toast.success('Image uploaded successfully');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    return (
        <div className="space-y-6">
            {/*Page Header*/}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Inventory Items</h1>
                    <p className="text-gray-600">Manage your inventory items here.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <Upload size={16} />
                        Bulk Import
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
                        className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <Download size={16} />
                        Export
                    </button>
                    <button onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                    }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        <Plus size={16} />
                        Add Item
                    </button>
                </div>
            </div>
            {/*Statistics Cards*/}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600">Total Items</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 ">{totalItems}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-green-600" />
                        </div>
                        <span className="text-sm text-gray-600">Active Stock</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 ">{activeItems}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-yellow-600" />
                        </div>
                        <span className="text-sm text-gray-600">Low Stock</span>
                    </div>
                    <div className="text-2xl font-bold">{lowStockItems}</div>
                    {/* <div className="text-gray-600">Low Stock</div> */}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-red-600" />
                        </div>
                        <span className="text-sm text-gray-600">Out of Stock</span>
                    </div>
                    <div className="text-2xl font-bold">{outOfStockItems}</div>
                    {/* <div className="text-gray-600">Out of Stock</div> */}
                </div>
            </div>
            {/*Filter and Search Bar*/}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search items..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    {/* <button className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <Download size={16} />
                    Export
                </button> */}
                </div>
            </div>
            {/*Inventory Items Table*/}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Item Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Current Stock</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Min Level</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Cost Price</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Selling Price</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.sku}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <span className={`font-semibold ${item.currentStock === 0 ? 'text-red-600' :
                                            item.currentStock <= item.minLevel ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                            {item.currentStock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.minLevel}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">₹{item.costPrice}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">₹{item.sellingPrice}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View"
                                                onClick={() => {
                                                    handleViewDetails(item);
                                                }}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                title="Edit"
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setFormData({
                                                        sku: item.sku,
                                                        name: item.name,
                                                        category: item.category,
                                                        currentStock: item.currentStock,
                                                        minLevel: item.minLevel,
                                                        maxLevel: item.maxLevel,
                                                        reorderPoint: item.reorderPoint,
                                                        costPrice: item.costPrice,
                                                        sellingPrice: item.sellingPrice,
                                                        status: item.status,
                                                        image: item.image,
                                                        description: item.description
                                                    });
                                                    setShowAddModal(true);
                                                }}
                                            >
                                                <Edit2 size={16} className="text-blue-600" />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-red-100 rounded transition-colors"
                                                title="Delete"
                                                onClick={() => handleDeleteItem(item.id)}
                                            >
                                                <Trash2 size={16} className="text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <Package size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                        <p className="text-gray-600">Try adjusting your filters or add new items.</p>
                    </div>
                )}
            </div>
            {/*Add/Edit Item Modal - To be implemented*/}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedItem ? 'Edit Item' : 'Add New Item'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/*Step Indicators*/}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex ">
                                {['Basic Info', 'Images & Specs', 'Pricing', 'Stock Levels'].map((step, index) => (
                                    <div key={step} className="flex items-center">
                                        <div className={`flex items-center gap-2 ${index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${index + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <span className="text-sm font-medium hidden md:block">{step}</span>
                                        </div>
                                        {index < 3 && (
                                            <div className={`w-12 h-1 mx-2 ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Step 1: Basic Info */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                                            <input
                                                type="text"
                                                value={formData.sku}
                                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., OIL-5W30-001"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., 5W30 Synthetic Oil"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                            <select name="category" id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter item description"
                                                rows={4}
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/*Images & Specs - To be implemented*/}
                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    {formData.image && (
                                        <div className="mt-4">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Image Preview:</p>
                                            <img src={formData.image} alt="Preview" className="w-32 h-32 rounded-lg object-cover border border-gray-200" />
                                        </div>
                                    )}
                                    <div
                                        className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => imageInputRef.current?.click()}
                                    >
                                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                        <button
                                            type="button"
                                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            Browse Files
                                        </button>
                                    </div>
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            )}

                            {/*Step 3: Pricing */}
                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cost Price (₹) *</label>
                                            <input
                                                type="number"
                                                value={formData.costPrice}
                                                onChange={(e) => {
                                                    const cost = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        costPrice: cost,
                                                        markup: calculateMarkup(cost, formData.sellingPrice)
                                                    });
                                                }}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Selling Price (₹) *</label>
                                            <input
                                                type="number"
                                                value={formData.sellingPrice}
                                                onChange={(e) => {
                                                    const selling = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        sellingPrice: selling,
                                                        markup: calculateMarkup(formData.costPrice, selling)
                                                    });
                                                }}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-700">Markup Percentage</span>
                                            <span className="text-2xl font-bold text-blue-600">{formData.markup}%</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">Profit: ₹{(formData.sellingPrice - formData.costPrice).toFixed(2)}</p>
                                    </div>
                                </div>
                            )}

                            {/*Step 4: Stock Levels */}
                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Stock *</label>
                                            <input
                                                type="number"
                                                value={formData.currentStock}
                                                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Level *</label>
                                            <input
                                                type="number"
                                                value={formData.minLevel}
                                                onChange={(e) => setFormData({ ...formData, minLevel: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Level *</label>
                                            <input
                                                type="number"
                                                value={formData.maxLevel}
                                                onChange={(e) => setFormData({ ...formData, maxLevel: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Level *</label>
                                            <input
                                                type="number"
                                                value={formData.reorderLevel}
                                                onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Stock Level Guidelines</h3>
                                            <ul className="space-y-2 text-xs text-gray-600">
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span>Optimal: Between minimum and maximum levels</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    <span>Low Stock: At or below minimum level</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    <span>Critical: Out of stock</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                    <span>Overstock: Above maximum level</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/*Navigation Buttons*/}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                    disabled={currentStep === 1}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <div className="text-sm text-gray-600">
                                    Step {currentStep} of 4
                                </div>

                                {currentStep < 4 ? (
                                    <button
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={selectedItem ? handleUpdateItem : handleAddItem}
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        {selectedItem ? 'Update Item' : 'Add Item'}
                                    </button>
                                )}
                            </div>

                        </div>

                    </div>
                </div>
            )}

            {/*Items Details Modal - To be implemented*/}
            {showDetailModal && selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Item Details</h2>
                            <button
                                onClick={() => { setShowDetailModal(false); }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/*Left Column*/}
                                <div className="space-y-6">
                                    <img src={selectedItem.image} alt={selectedItem.name}
                                        className="w-full h-64 rounded-2xl object-cover border border-gray-200"
                                    />
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">SKU</label>
                                            <p className="text-lg font-mono font-bold text-gray-900 mt-1">{selectedItem.sku}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Item Name</label>
                                            <p className="text-lg font-semibold">{selectedItem.name}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                                            <p className="text-lg font-semibold">{selectedItem.category}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                                            <p className="text-gray-700 mt-1 whitespace-pre-line">{selectedItem.description}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                                            <div className="mt-2">
                                                <span className={`px-3 py-1 text-sm font-semibold rounded-lg ${getStockStatus(selectedItem).color === 'red' ? 'bg-red-100 text-red-700' :
                                                    getStockStatus(selectedItem).color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                                        getStockStatus(selectedItem).color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {getStockStatus(selectedItem).label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*Right Column*/}
                                <div className="space-y-6">
                                    {/*Stock Information*/}
                                    <div className="bg-gray-50 p-4 rounded-2xl px-6">
                                        <h3 className="font-bold text-gray-900 mb-4">Stock Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Current Stock</span>
                                                <span className="font-semibold">{selectedItem.currentStock}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Minimum Level</span>
                                                <span className="font-semibold">{selectedItem.minLevel}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Maximum Level</span>
                                                <span className="font-semibold">{selectedItem.maxLevel}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Reorder Level</span>
                                                <span className="font-semibold">{selectedItem.reorderPoint}</span>
                                            </div>

                                            <div className="pt-4 border-t border-gray-200">
                                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${getStockStatus(selectedItem).color === 'red' ? 'bg-red-500' :
                                                            getStockStatus(selectedItem).color === 'yellow' ? 'bg-yellow-500' :
                                                                getStockStatus(selectedItem).color === 'orange' ? 'bg-orange-500' :
                                                                    'bg-green-500'
                                                            }`}
                                                        style={{ width: `${getStockPercentage(selectedItem)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*Pricing Information*/}
                                    <div className="bg-blue-50 rounded-2xl p-6">
                                        <h3 className="font-bold text-gray-900 mb-4">Pricing Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Cost Price</span>
                                                <span className="font-bold text-gray-900">₹{selectedItem.costPrice}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Selling Price</span>
                                                <span className="font-bold text-gray-900">₹{selectedItem.sellingPrice}</span>
                                            </div>
                                            <div className="flex justify-between pt-4 border-t border-blue-200">
                                                <span className="text-gray-600">Markup</span>
                                                <span className="text-xl font-bold text-green-600">{selectedItem.markup}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Profit per Unit</span>
                                                <span className="font-bold text-green-600">
                                                    ₹{(selectedItem.sellingPrice - selectedItem.costPrice).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/*Additional Information*/}
                                    <div className="bg-gray-50 rounded-2xl p-6">
                                        <h3 className="font-bold text-gray-900 mb-4">Additional Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Date Added</span>
                                                <span className="font-semibold text-gray-900">{new Date(selectedItem.dateAdded).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Last Updated</span>
                                                <span className="font-semibold text-gray-900">{new Date(selectedItem.lastUpdated).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Stock Value</span>
                                                <span className="font-bold text-gray-900">₹{(selectedItem.currentStock * selectedItem.costPrice).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/*Action Buttons*/}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                setShowDetailModal(false);
                                                handleEditItem(selectedItem);
                                            }}
                                            className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            Edit Item
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDetailModal(false);
                                                handleDeleteItem(selectedItem.id);
                                            }}
                                            className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                                        >
                                            Delete Item
                                        </button>
                                        <button className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                                            onClick={() => generateBarcode(selectedItem)}
                                        >
                                            <BarChart3 size={16} />
                                            Barcode
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Barcode: {barcodeItem.sku}</h2>
                            <button
                                onClick={() => setShowBarcodeModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-lg flex justify-center mb-6">
                            <canvas
                                id="barcode-canvas"
                                ref={(canvas) => {
                                    if (canvas && barcodeItem) {
                                        const ctx = canvas.getContext('2d');
                                        const barWidth = 2;
                                        const barHeight = 100;
                                        const padding = 10;

                                        canvas.width = (barcodeItem.sku.length * barWidth * 12) + (padding * 2);
                                        canvas.height = barHeight + padding * 3;

                                        if (ctx) {
                                            ctx.fillStyle = '#ffffff';
                                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                                            ctx.fillStyle = '#000000';
                                            ctx.font = '14px Arial';
                                            ctx.textAlign = 'center';
                                            ctx.fillText(barcodeItem.sku, canvas.width / 2, canvas.height - 5);

                                            let xPosition = padding;
                                            for (let i = 0; i < barcodeItem.sku.length; i++) {
                                                const charCode = barcodeItem.sku.charCodeAt(i);
                                                for (let j = 0; j < 12; j++) {
                                                    if ((charCode >> j) & 1) {
                                                        ctx.fillRect(xPosition, padding, barWidth, barHeight);
                                                    }
                                                    xPosition += barWidth;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600"><strong>Item:</strong> {barcodeItem.name}</p>
                                <p className="text-sm text-gray-600"><strong>SKU:</strong> {barcodeItem.sku}</p>
                                <p className="text-sm text-gray-600"><strong>Category:</strong> {barcodeItem.category}</p>
                            </div>
                            <button
                                onClick={downloadBarcode}
                                className="w-full px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                Download Barcode
                            </button>
                            <button
                                onClick={() => setShowBarcodeModal(false)}
                                className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}