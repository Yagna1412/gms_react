import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { toast } from 'sonner';
import { Users, Plus, Search, Eye, Edit2, Trash2, X, Star, TrendingUp, Award } from 'lucide-react';

export default function VendorManagement1() {
    const { vendors, addVendor, updateVendor, deleteVendor } = useInventory();
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterTier, setFilterTier] = useState('All');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        email: '',
        address: '',
        gst: '',
        paymentTerms: '',
        tier: 'Silver',
        status: 'Active',
        onTimeDelivery: 90,
        qualityRating: 4.0
    });

    const resetForm = () => {
        setFormData({
            name: '',
            contactPerson: '',
            email: '',
            address: '',
            gst: '',
            paymentTerms: '',
            tier: 'Silver',
            status: 'Active',
            onTimeDelivery: 90,
            qualityRating: 4.0
        });
        setSelectedVendor(null);
    };

    const handleAddVendor = () => {
        if (!formData.name || !formData.contactPerson || !formData.email || !formData.address) {
            toast.error('Please fill all mandatory fields');
            return;
        }

        // Validate vendor name: minimum 3 characters
        if (formData.name.trim().length < 3) {
            toast.error('Vendor name must be at least 3 characters');
            return;
        }

        // Validate contact: only numbers and exactly 10 digits
        const contactRegex = /^\d{10}$/;
        if (!contactRegex.test(formData.contactPerson)) {
            toast.error('Contact must be exactly 10 digits and contain only numbers');
            return;
        }

        // Validate email: must end with @gmail.com
        if (!formData.email.endsWith('@gmail.com')) {
            toast.error('Email must end with @gmail.com');
            return;
        }

        // Validate address: minimum 5 characters
        if (formData.address.trim().length < 5) {
            toast.error('Address must be at least 5 characters');
            return;
        }

        // Validate GST if provided: 15 alphanumeric characters
        if (formData.gst && !/^[A-Z0-9]{15}$/.test(formData.gst)) {
            toast.error('GST number must be exactly 15 alphanumeric characters (e.g., 18AABCS1234H1Z0)');
            return;
        }

        // Validate payment terms: must be selected
        if (!formData.paymentTerms) {
            toast.error('Please select payment terms');
            return;
        }

        // Validate tier: must be selected
        if (!formData.tier) {
            toast.error('Please select vendor tier');
            return;
        }

        if (selectedVendor) {
            updateVendor(selectedVendor.id, formData);
            toast.success('Vendor updated successfully!');
        } else {
            addVendor(formData);
            toast.success('Vendor added successfully!');
        }
        setShowAddModal(false);
        setShowEditModal(false);
        resetForm();
    };

    const handleViewDetails = (vendor) => {
        setSelectedVendor(vendor);
        setShowDetailModal(true);
        toast.info('Viewing details for ' + vendor.name);
    };

    return (
        <div className="space-y-6">
            {/*Page Header*/}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
                    <p className="text-gray-600 mt-1">Manage your vendors and their details</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Vendor
                </button>
            </div>

            {/*Statistics Cards*/}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Vendors</p>
                            <h2 className="text-3xl font-bold text-gray-900">{vendors.length}</h2>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Award size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Platinum</p>
                            <h2 className="text-3xl font-bold text-gray-900">{vendors.filter(v => v.tier === 'Platinum').length}</h2>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Award size={20} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Gold</p>
                            <h2 className="text-3xl font-bold text-gray-900">{vendors.filter(v => v.tier === 'Gold').length}</h2>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Award size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Silver</p>
                            <h2 className="text-3xl font-bold text-gray-900">{vendors.filter(v => v.tier === 'Silver').length}</h2>
                        </div>
                    </div>
                </div>
            </div>
            {/*Add and Edit Modals - To be implemented*/}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">{selectedVendor ? 'Edit Vendor' : 'Add Vendor'}</h2>
                            <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vendor Name* (Min. 3 chars)</label>
                                    <input type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.name && formData.name.trim().length >= 3 ? 'border-green-500' :
                                            formData.name && formData.name.trim().length < 3 ? 'border-red-500' :
                                                'border-gray-300'
                                            }`}
                                        placeholder="Enter vendor name" />
                                    {formData.name && formData.name.trim().length < 3 && (
                                        <p className="text-red-500 text-xs mt-1">Name must be at least 3 characters</p>
                                    )}
                                    {formData.name && formData.name.trim().length >= 3 && (
                                        <p className="text-green-500 text-xs mt-1">✓ Valid name</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact* (10 digits)</label>
                                    <input type="text"
                                        value={formData.contactPerson}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setFormData({ ...formData, contactPerson: value });
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.contactPerson && formData.contactPerson.length === 10 ? 'border-green-500' :
                                            formData.contactPerson && formData.contactPerson.length !== 10 ? 'border-red-500' :
                                                'border-gray-300'
                                            }`}
                                        placeholder="Enter 10 digit contact number"
                                        maxLength="10" />
                                    {formData.contactPerson && formData.contactPerson.length !== 10 && (
                                        <p className="text-red-500 text-xs mt-1">Contact must be exactly 10 digits</p>
                                    )}
                                    {formData.contactPerson && formData.contactPerson.length === 10 && (
                                        <p className="text-green-500 text-xs mt-1">✓ Valid contact</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email* (@gmail.com)</label>
                                    <input type="text"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.email && formData.email.endsWith('@gmail.com') ? 'border-green-500' :
                                            formData.email && !formData.email.endsWith('@gmail.com') ? 'border-red-500' :
                                                'border-gray-300'
                                            }`}
                                        placeholder="example@gmail.com" />
                                    {formData.email && !formData.email.endsWith('@gmail.com') && (
                                        <p className="text-red-500 text-xs mt-1">Email must end with @gmail.com</p>
                                    )}
                                    {formData.email && formData.email.endsWith('@gmail.com') && (
                                        <p className="text-green-500 text-xs mt-1">✓ Valid email</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address* (Min. 5 chars)</label>
                                    <input type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.address && formData.address.trim().length >= 5 ? 'border-green-500' :
                                            formData.address && formData.address.trim().length < 5 ? 'border-red-500' :
                                                'border-gray-300'
                                            }`}
                                        placeholder="Enter address" />
                                    {formData.address && formData.address.trim().length < 5 && (
                                        <p className="text-red-500 text-xs mt-1">Address must be at least 5 characters</p>
                                    )}
                                    {formData.address && formData.address.trim().length >= 5 && (
                                        <p className="text-green-500 text-xs mt-1">✓ Valid address</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number (15 chars)</label>
                                    <input type="text"
                                        value={formData.gst}
                                        onChange={(e) => {
                                            const value = e.target.value.toUpperCase().slice(0, 15);
                                            setFormData({ ...formData, gst: value });
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.gst && /^[A-Z0-9]{15}$/.test(formData.gst) ? 'border-green-500' :
                                            formData.gst && !/^[A-Z0-9]{15}$/.test(formData.gst) ? 'border-red-500' :
                                                'border-gray-300'
                                            }`}
                                        placeholder="e.g., 18AABCS1234H1Z0"
                                        maxLength="15" />
                                    {formData.gst && !/^[A-Z0-9]{15}$/.test(formData.gst) && (
                                        <p className="text-red-500 text-xs mt-1">GST must be exactly 15 alphanumeric characters</p>
                                    )}
                                    {formData.gst && /^[A-Z0-9]{15}$/.test(formData.gst) && (
                                        <p className="text-green-500 text-xs mt-1">✓ Valid GST</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Terms*</label>
                                    <select name="paymentTerms" id="paymentTerms"
                                        value={formData.paymentTerms}
                                        onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.paymentTerms ? 'border-green-500' :
                                            'border-gray-300'
                                            }`}>
                                        <option value="">Select Payment Terms</option>
                                        <option value="Net 30">Net 30</option>
                                        <option value="Net 60">Net 60</option>
                                        <option value="Cash on Delivery">Cash on Delivery</option>
                                    </select>
                                    {!formData.paymentTerms && (
                                        <p className="text-gray-500 text-xs mt-1">Please select payment terms</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tier*</label>
                                    <select name="tier" id="tier"
                                        value={formData.tier}
                                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.tier ? 'border-green-500' :
                                            'border-gray-300'
                                            }`}>
                                        <option value="">Select Tier</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Platinum">Platinum</option>
                                    </select>
                                    {!formData.tier && (
                                        <p className="text-gray-500 text-xs mt-1">Please select vendor tier</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                    <select name="status" id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => { setShowAddModal(false); resetForm(); }}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddVendor}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                                    {selectedVendor ? 'Update Vendor' : 'Add Vendor'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/*Search and filter section to be implemented*/}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search vendors..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={filterTier}
                            onChange={(e) => setFilterTier(e.target.value)}
                            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Tiers</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                        </select>
                    </div>
                </div>
            </div>
            {/*Vendor List Table to be implemented*/}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full ">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Vendor Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">On-Time %</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Rating</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total POs</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tier</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.filter(vendor =>
                                (filterTier === 'All' || filterTier === '' || vendor.tier === filterTier) &&
                                (vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    vendor.email.toLowerCase().includes(searchQuery.toLowerCase()))
                            ).map(vendor => (
                                <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{vendor.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{vendor.contactPerson}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{vendor.onTimeDelivery}%</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{vendor.qualityRating} <Star size={14} className="inline-block text-yellow-500 ml-1" /></td>
                                    <td className="px-6 py-4 text-sm text-gray-900">15</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{vendor.tier}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vendor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right space-x-2">
                                        <button
                                            title="View Details"
                                            onClick={() => { handleViewDetails(vendor); }}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            title="Edit Vendor"
                                            onClick={() => { setSelectedVendor(vendor); setFormData(vendor); setShowAddModal(true); }}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            title="Delete Vendor"
                                            onClick={() => { deleteVendor(vendor.id); toast.success('Vendor deleted successfully!'); }}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Vendor Details Modal */}
            {showDetailModal && selectedVendor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Vendor Details</h2>
                            <button onClick={() => { setShowDetailModal(false); setSelectedVendor(null); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vendor Name</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{selectedVendor.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Person</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{selectedVendor.contactPerson}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{selectedVendor.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{selectedVendor.address}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">GST Number</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{selectedVendor.gst || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment Terms</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{selectedVendor.paymentTerms}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tier</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{selectedVendor.tier}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</p>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${selectedVendor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {selectedVendor.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">On-Time Delivery</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">{selectedVendor.onTimeDelivery}%</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quality Rating</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2 flex items-center gap-2">
                                        {selectedVendor.qualityRating}
                                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => { setShowDetailModal(false); setSelectedVendor(null); }}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                                    Close
                                </button>
                                <button
                                    onClick={() => { setFormData(selectedVendor); setShowDetailModal(false); setShowAddModal(true); }}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                                    Edit Vendor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}