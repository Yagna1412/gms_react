import React, { useState } from 'react';
import { useInventory } from '../../component/context/InventoryContext';
import { toast } from 'sonner';
import { Users, Plus, Search, Eye, Edit2, Trash2, X, Star, TrendingUp, Award } from 'lucide-react';

export default function VendorManagement() {
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
        <div className="space-y-4 sm:space-y-6">
            {/*Page Header*/}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vendor Management</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage your vendors and their details</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-sm"
                >
                    <Plus size={18} />
                    Add Vendor
                </button>
            </div>

            {/*Statistics Cards*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <Users size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Vendors</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{vendors.length}</h2>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                            <Award size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Platinum</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{vendors.filter(v => v.tier === 'Platinum').length}</h2>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                            <Award size={20} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Gold</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{vendors.filter(v => v.tier === 'Gold').length}</h2>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            <Award size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Silver</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{vendors.filter(v => v.tier === 'Silver').length}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/*Search and filter section*/}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search vendors by name, contact, or email..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <select
                            value={filterTier}
                            onChange={(e) => setFilterTier(e.target.value)}
                            className="w-full sm:w-40 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">All Tiers</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                        </select>
                    </div>
                </div>
            </div>

            {/*Vendor List Table*/}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Vendor Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">On-Time %</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Rating</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Total POs</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Tier</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {vendors.filter(vendor =>
                                (filterTier === 'All' || filterTier === '' || vendor.tier === filterTier) &&
                                (vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    vendor.email.toLowerCase().includes(searchQuery.toLowerCase()))
                            ).map(vendor => (
                                <tr key={vendor.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">{vendor.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{vendor.contactPerson}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{vendor.onTimeDelivery}%</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            {vendor.qualityRating} <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">15</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{vendor.tier}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${vendor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                title="View Details"
                                                onClick={() => { handleViewDetails(vendor); }}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                title="Edit Vendor"
                                                onClick={() => { setSelectedVendor(vendor); setFormData(vendor); setShowAddModal(true); }}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                title="Delete Vendor"
                                                onClick={() => { deleteVendor(vendor.id); toast.success('Vendor deleted successfully!'); }}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/*Add and Edit Modals*/}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                        <div className="shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{selectedVendor ? 'Edit Vendor' : 'Add Vendor'}</h2>
                            <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 text-gray-500 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vendor Name* (Min. 3 chars)</label>
                                    <input type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${formData.name && formData.name.trim().length >= 3 ? 'border-green-500' :
                                            formData.name && formData.name.trim().length < 3 ? 'border-red-500' :
                                                'border-gray-300'
                                            }`}
                                        placeholder="Enter vendor name" />
                                    {formData.name && formData.name.trim().length < 3 && (
                                        <p className="text-red-500 text-xs mt-1.5 font-medium">Name must be at least 3 characters</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact* (10 digits)</label>
                                    <input type="text"
                                        value={formData.contactPerson}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setFormData({ ...formData, contactPerson: value });
                                        }}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${formData.contactPerson && formData.contactPerson.length === 10 ? 'border-green-500' :
                                            formData.contactPerson && formData.contactPerson.length !== 10 ? 'border-red-500' :
                                                'border-gray-300'
                                            }`}
                                        placeholder="10 digit number"
                                        maxLength="10" />
                                    {formData.contactPerson && formData.contactPerson.length !== 10 && (
                                        <p className="text-red-500 text-xs mt-1.5 font-medium">Must be exactly 10 digits</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email* (@gmail.com)</label>
                                    <input type="text"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${formData.email && formData.email.endsWith('@gmail.com') ? 'border-green-500' :
                                            formData.email && !formData.email.endsWith('@gmail.com') ? 'border-red-500' :
                                                'border-gray-300'
                                            }`}
                                        placeholder="example@gmail.com" />
                                    {formData.email && !formData.email.endsWith('@gmail.com') && (
                                        <p className="text-red-500 text-xs mt-1.5 font-medium">Must end with @gmail.com</p>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address* (Min. 5 chars)</label>
                                    <input type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${formData.address && formData.address.trim().length >= 5 ? 'border-green-500' :
                                            formData.address && formData.address.trim().length < 5 ? 'border-red-500' :
                                                'border-gray-300'
                                            }`}
                                        placeholder="Complete address" />
                                    {formData.address && formData.address.trim().length < 5 && (
                                        <p className="text-red-500 text-xs mt-1.5 font-medium">Address must be at least 5 characters</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">GST Number (15 chars)</label>
                                    <input type="text"
                                        value={formData.gst}
                                        onChange={(e) => {
                                            const value = e.target.value.toUpperCase().slice(0, 15);
                                            setFormData({ ...formData, gst: value });
                                        }}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${formData.gst && /^[A-Z0-9]{15}$/.test(formData.gst) ? 'border-green-500' :
                                            formData.gst && !/^[A-Z0-9]{15}$/.test(formData.gst) ? 'border-red-500' :
                                                'border-gray-300'
                                            }`}
                                        placeholder="18AABCS1234H1Z0"
                                        maxLength="15" />
                                    {formData.gst && !/^[A-Z0-9]{15}$/.test(formData.gst) && (
                                        <p className="text-red-500 text-xs mt-1.5 font-medium">Must be 15 alphanumeric chars</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Terms*</label>
                                    <select name="paymentTerms" id="paymentTerms"
                                        value={formData.paymentTerms}
                                        onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-white ${formData.paymentTerms ? 'border-green-500' : 'border-gray-300'
                                            }`}>
                                        <option value="">Select Payment Terms</option>
                                        <option value="Net 30">Net 30</option>
                                        <option value="Net 60">Net 60</option>
                                        <option value="Cash on Delivery">Cash on Delivery</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tier*</label>
                                    <select name="tier" id="tier"
                                        value={formData.tier}
                                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-white ${formData.tier ? 'border-green-500' : 'border-gray-300'
                                            }`}>
                                        <option value="">Select Tier</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Platinum">Platinum</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                                    <select name="status" id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-white">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 rounded-b-2xl">
                            <button
                                onClick={() => { setShowAddModal(false); resetForm(); }}
                                className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                                Cancel
                            </button>
                            <button
                                onClick={handleAddVendor}
                                className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                                {selectedVendor ? 'Update Vendor' : 'Add Vendor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Vendor Details Modal */}
            {showDetailModal && selectedVendor && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                        <div className="shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Vendor Details</h2>
                            <button onClick={() => { setShowDetailModal(false); setSelectedVendor(null); }} className="p-2 hover:bg-gray-100 text-gray-500 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Vendor Name</p>
                                    <p className="text-base font-bold text-gray-900">{selectedVendor.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact Person</p>
                                    <p className="text-base font-semibold text-gray-900">{selectedVendor.contactPerson}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-base font-medium text-blue-600 break-all">{selectedVendor.email}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</p>
                                    <p className="text-base font-medium text-gray-900">{selectedVendor.address}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">GST Number</p>
                                    <p className="text-base font-mono font-medium text-gray-900">{selectedVendor.gst || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Payment Terms</p>
                                    <p className="text-base font-semibold text-gray-900">{selectedVendor.paymentTerms}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tier</p>
                                    <p className="text-base font-bold text-gray-900">{selectedVendor.tier}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                    <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold ${selectedVendor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {selectedVendor.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">On-Time Delivery</p>
                                    <p className="text-base font-bold text-gray-900">{selectedVendor.onTimeDelivery}%</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Quality Rating</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-base font-bold text-gray-900">{selectedVendor.qualityRating}</span>
                                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end rounded-b-2xl">
                            <button
                                onClick={() => { setShowDetailModal(false); setSelectedVendor(null); }}
                                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                                Close
                            </button>
                            <button
                                onClick={() => { setFormData(selectedVendor); setShowDetailModal(false); setShowAddModal(true); }}
                                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                                <Edit2 size={16} /> Edit Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}