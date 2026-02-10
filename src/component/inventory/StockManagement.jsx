import React, { useState, useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { toast } from 'sonner';
import {
    TrendingUp,
    TrendingDown,
    Plus,
    Search,
    Filter,
    Download,
    X,
    ArrowUpCircle,
    ArrowDownCircle,
    RefreshCw,
    CheckCircle,
    Clock,
    Check,
    XCircle
} from 'lucide-react';
export default function StockManagement1() {
    const { items, stockMovements, addStockMovement } = useInventory();
    const [showGRNModal, setShowGRNModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [approvalRequests, setApprovalRequests] = useState(() => {
        const saved = localStorage.getItem('approvalRequests');
        return saved ? JSON.parse(saved) : [];
    });
    const [showApprovalRequests, setShowApprovalRequests] = useState(() => {
        const saved = localStorage.getItem('showApprovalRequests');
        return saved ? JSON.parse(saved) : false;
    });
    const [formData, setFormData] = useState({
        itemId: '',
        quantity: '',
        movementType: '',
        reference: '',
        notes: ''
    });

    // Save approvalRequests to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('approvalRequests', JSON.stringify(approvalRequests));
    }, [approvalRequests]);

    // Save showApprovalRequests to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('showApprovalRequests', JSON.stringify(showApprovalRequests));
    }, [showApprovalRequests]);
    const resetForm = () => {
        setFormData({
            itemId: '',
            quantity: '',
            movementType: '',
            reference: '',
            notes: ''
        });
    };

    const filteredMovements = stockMovements.filter(movement => {
        const matchesSearch = movement.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movement.itemSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movement.reference.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'All' || movement.movementType === filterType;
        return matchesSearch && matchesType;
    });

    const handleStockMovement = () => {
        // Logic to add stock movement
        if (!formData.itemId || !formData.quantity || !formData.movementType) {
            toast.error('Please fill all mandatory fields.');
            return;
        }
        if (formData.movementType === 'Adjustment' && !formData.notes) {
            toast.error('Reason for adjustment is mandatory.');
            return;
        }
        const numericItemId = parseInt(formData.itemId);
        const item = items.find(i => i.id === numericItemId);
        if (!item) {
            toast.error('Selected item not found.');
            return;
        }

        // For Adjustments, create an approval request
        if (formData.movementType === 'Adjustment') {
            const newApprovalRequest = {
                id: Date.now(),
                itemId: numericItemId,
                itemSku: item.sku,
                itemName: item.name,
                quantity: parseInt(formData.quantity),
                reason: formData.notes,
                reference: formData.reference,
                requestedBy: 'Current User',
                requestedAt: new Date().toLocaleString(),
                status: 'Pending',
                requiresApproval: Math.abs(parseInt(formData.quantity)) > 10
            };
            setApprovalRequests([...approvalRequests, newApprovalRequest]);
            toast.success('Approval request sent to admin!');
        } else {
            // For Inward and Outward, add directly
            addStockMovement({
                ...formData,
                itemSku: item.sku,
                itemName: item.name,
                quantity: parseInt(formData.quantity)
            });
            toast.success('Stock movement recorded successfully!');
        }
        setShowGRNModal(false);
        setShowIssueModal(false);
        setShowAdjustmentModal(false);
        resetForm();
    };

    const handleApproveRequest = (requestId) => {
        const request = approvalRequests.find(r => r.id === requestId);
        if (!request) return;

        addStockMovement({
            itemId: request.itemId,
            itemSku: request.itemSku,
            itemName: request.itemName,
            quantity: request.quantity,
            movementType: 'Adjustment',
            reference: request.reference,
            notes: `${request.reason} (Approved)`
        });

        setApprovalRequests(approvalRequests.map(r =>
            r.id === requestId ? { ...r, status: 'Approved' } : r
        ));
        toast.success('Adjustment approved and recorded!');
    };

    const exportToCSV = () => {
        if (filteredMovements.length === 0) {
            toast.error('No data to export.');
            return;
        }
        const csvContent = [
            ['Item Name', 'SKU', 'Movement Type', 'Quantity', 'Reference', 'Notes'],
            ...filteredMovements.map(movement => [
                movement.itemName,
                movement.itemSku,
                movement.movementType,
                movement.quantity,
                movement.reference,
                movement.notes
            ])
        ].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'stock_movements.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRejectRequest = (requestId) => {
        setApprovalRequests(approvalRequests.map(r =>
            r.id === requestId ? { ...r, status: 'Rejected' } : r
        ));
        toast.error('Adjustment request rejected!');
    };

    const inwardMovements = stockMovements.filter(movement => movement.movementType === 'Inward');
    const outwardMovements = stockMovements.filter(movement => movement.movementType === 'Outward');
    const adjustmentMovements = stockMovements.filter(movement => movement.movementType === 'Adjustment');

    const getMovementIcon = (type) => {
        switch (type) {
            case 'Inward':
                return <ArrowDownCircle className="text-green-600" size={20} />;
            case 'Outward':
                return <ArrowUpCircle className="text-red-600" size={20} />;
            case 'Adjustment':
                return <RefreshCw className="text-yellow-600" size={20} />;
            default:
                return null;
        }
    };

    const getMovementBadge = (type) => {
        switch (type) {
            case 'Inward':
                return 'bg-green-100 text-green-700';
                return 'bg-red-100 text-red-700';
            case 'Adjustment':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/*Page Header*/}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
                    <p className="text-gray-600 mt-2">Track and manage stock movements</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            resetForm();
                            setFormData({ ...formData, movementType: 'Inward' });
                            setShowGRNModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        <ArrowDownCircle size={20} />
                        GRN / Inward
                    </button>
                    <button
                        onClick={() => { setShowIssueModal(true); resetForm(); setFormData({ ...formData, movementType: 'Outward' }); }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        <ArrowUpCircle size={20} />
                        Issue Parts
                    </button>
                    <button
                        onClick={() => { setShowAdjustmentModal(true); resetForm(); setFormData({ ...formData, movementType: 'Adjustment' }); }}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-900 transition"
                    >
                        <RefreshCw size={20} />
                        Adjustments
                    </button>
                </div>
            </div>
            {/*Stock Movements Modal Components - GRN, Issue, Adjustment*/}
            {(showGRNModal || showIssueModal || showAdjustmentModal) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {showGRNModal && 'Goods Receipt Note (GRN)'}
                                {showIssueModal && 'Issue Parts'}
                                {showAdjustmentModal && 'Stock Adjustment'}
                            </h2>
                            <button onClick={() => {
                                setShowGRNModal(false);
                                setShowIssueModal(false);
                                setShowAdjustmentModal(false);
                            }} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-6 p-6">
                            {/*Select Item*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Item</label>
                                <select
                                    value={formData.itemId}
                                    onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select an item</option>
                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.sku} - {item.name} (Current Stock: {item.currentStock})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/*Quantity*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter quantity"
                                />
                            </div>
                            {/*Reference*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                                <input
                                    type="text"
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter reference (e.g., PO number)"
                                />
                            </div>
                            {/*Notes*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes {showAdjustmentModal && '(Reason - Mandatory)'}</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={showAdjustmentModal ? 'Enter reason for adjustment (Damage / Loss / Expiry / Correction)' : 'Additional notes (optional)'}
                                />
                            </div>
                            {/*Approval Notes for Adjustments*/}
                            {showAdjustmentModal && formData.quantity && Math.abs(parseInt(formData.quantity)) > 10 && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle size={24} className="text-yellow-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-yellow-900">Requires Admin Approval</p>
                                            <p className="text-xs text-yellow-700 mt-1">Adjustments over 10 units require Admin or Super Admin approval.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/*Action Buttons*/}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowGRNModal(false);
                                        setShowIssueModal(false);
                                        setShowAdjustmentModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStockMovement}
                                    className={`flex-1 px-4 py-2.5 text-white rounded-xl font-semibold transition-colors ${showGRNModal ? 'bg-green-600 hover:bg-green-700' :
                                        showIssueModal ? 'bg-red-600 hover:bg-red-700' :
                                            'bg-yellow-600 hover:bg-yellow-900'
                                        }`}
                                >
                                    {showAdjustmentModal ? 'Send for Approval' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/*Statistics Cards*/}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TrendingUp size={20} className="text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600">Total Movements</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stockMovements.length}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <ArrowDownCircle size={20} className="text-green-600" />
                        </div>
                        <span className="text-sm text-gray-600">Inwards</span>
                    </div>
                    <div className="text-3xl font-bold text-green-900">{inwardMovements.length}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <ArrowUpCircle size={20} className="text-red-600" />
                        </div>
                        <span className="text-sm text-gray-600">Outwards</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{outwardMovements.length}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg hover:border-yellow-300 transition-all" onClick={() => setShowApprovalRequests(!showApprovalRequests)}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <RefreshCw size={20} className="text-yellow-600" />
                        </div>
                        <span className="text-sm text-gray-600">Adjustments</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{adjustmentMovements.length}</div>
                </div>
            </div>
            {/*Approval Requests Section - All Statuses*/}
            {approvalRequests.length > 0 && showApprovalRequests && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-in fade-in duration-300">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-gray-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Adjustment Approval Requests</h2>
                                <div className="flex gap-2">
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-sm font-semibold">
                                        Pending: {approvalRequests.filter(r => r.status === 'Pending').length}
                                    </span>
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-semibold">
                                        Approved: {approvalRequests.filter(r => r.status === 'Approved').length}
                                    </span>
                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-sm font-semibold">
                                        Rejected: {approvalRequests.filter(r => r.status === 'Rejected').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Item</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Reason</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Requested By</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Approval Level</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {approvalRequests.map((request) => (
                                    <tr key={request.id} className={`hover:bg-gray-50 transition-colors ${request.status === 'Approved' ? 'bg-green-50' :
                                        request.status === 'Rejected' ? 'bg-red-50' :
                                            'bg-white'
                                        }`}>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">{request.itemName}</div>
                                                <div className="text-sm text-gray-600">{request.itemSku}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-lg text-gray-900">{request.quantity}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{request.reason}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.requestedBy}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.requestedAt}</td>
                                        <td className="px-6 py-4">
                                            {request.requiresApproval ? (
                                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold">
                                                    Admin Approval
                                                </span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold">
                                                    Auto-Approve
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {request.status === 'Pending' && (
                                                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs font-semibold">
                                                    Pending
                                                </span>
                                            )}
                                            {request.status === 'Approved' && (
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 w-fit">
                                                    <Check size={14} />
                                                    Approved
                                                </span>
                                            )}
                                            {request.status === 'Rejected' && (
                                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 w-fit">
                                                    <XCircle size={14} />
                                                    Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {request.status === 'Pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApproveRequest(request.id)}
                                                        className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-semibold text-sm"
                                                    >
                                                        <Check size={16} />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectRequest(request.id)}
                                                        className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold text-sm"
                                                    >
                                                        <XCircle size={16} />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {request.status === 'Approved' && (
                                                <span className="text-green-700 font-semibold text-sm">✓ Recorded</span>
                                            )}
                                            {request.status === 'Rejected' && (
                                                <span className="text-red-700 font-semibold text-sm">✗ Cancelled</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/*Search and Filter Bar*/}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search movements..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <select value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="All">All Types</option>
                        <option value="Inward">Inward</option>
                        <option value="Outward">Outward</option>
                        <option value="Adjustment">Adjustment</option>
                    </select>
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>
            {/*Stock Movements Table - To be implemented*/}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div>
                    <table>
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Item SKU</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Item Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Movement Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Reference #</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Created By</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredMovements.map((movement) => (
                                <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">{movement.date}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{movement.itemSku}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{movement.itemName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getMovementIcon(movement.movementType)}
                                            <span className="font-bold text-gray-900">{movement.quantity}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${getMovementBadge(movement.movementType)}`}>
                                            {movement.movementType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-blue-600">{movement.reference}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{movement.createdBy}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{movement.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredMovements.length === 0 && (
                    <div className="text-center py-12">
                        <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">No stock movements found</p>
                    </div>
                )}
            </div>
        </div>
    );
}