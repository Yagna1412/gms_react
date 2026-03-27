import React, { useState, useEffect } from 'react';
import { useInventory } from '../../component/context/InventoryContext';
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

export default function StockManagement() {
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
            case 'Outward': 
                return 'bg-red-100 text-red-700'; // Fixed missing case from original code
            case 'Adjustment':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stock Management</h1>
                    <p className="text-sm text-gray-600 mt-1">Track and manage stock movements</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 w-full md:w-auto">
                    <button
                        onClick={() => {
                            resetForm();
                            setFormData({ ...formData, movementType: 'Inward' });
                            setShowGRNModal(true);
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                        <ArrowDownCircle size={18} />
                        <span className="hidden sm:inline">GRN / Inward</span>
                        <span className="sm:hidden">Inward</span>
                    </button>
                    <button
                        onClick={() => { setShowIssueModal(true); resetForm(); setFormData({ ...formData, movementType: 'Outward' }); }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                    >
                        <ArrowUpCircle size={18} />
                        <span className="hidden sm:inline">Issue Parts</span>
                        <span className="sm:hidden">Outward</span>
                    </button>
                    <button
                        onClick={() => { setShowAdjustmentModal(true); resetForm(); setFormData({ ...formData, movementType: 'Adjustment' }); }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition"
                    >
                        <RefreshCw size={18} />
                        Adjustments
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TrendingUp size={18} className="text-blue-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Total</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stockMovements.length}</div>
                </div>
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <ArrowDownCircle size={18} className="text-green-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Inwards</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-700">{inwardMovements.length}</div>
                </div>
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <ArrowUpCircle size={18} className="text-red-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Outwards</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-red-700">{outwardMovements.length}</div>
                </div>
                <div 
                    className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 cursor-pointer hover:shadow-md hover:border-yellow-300 transition-all shadow-sm" 
                    onClick={() => setShowApprovalRequests(!showApprovalRequests)}
                >
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <RefreshCw size={18} className="text-yellow-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Adjustments</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-700">{adjustmentMovements.length}</div>
                </div>
            </div>

            {/* Approval Requests Section - All Statuses */}
            {approvalRequests.length > 0 && showApprovalRequests && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Clock size={20} className="text-gray-600 hidden sm:block" />
                                <h2 className="text-base sm:text-lg font-bold text-gray-900">Adjustment Requests</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                    Pending: {approvalRequests.filter(r => r.status === 'Pending').length}
                                </span>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                    Approved: {approvalRequests.filter(r => r.status === 'Approved').length}
                                </span>
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-semibold">
                                    Rejected: {approvalRequests.filter(r => r.status === 'Rejected').length}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead className="bg-gray-50/50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Requested By</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {approvalRequests.map((request) => (
                                    <tr key={request.id} className={`hover:bg-gray-50/80 transition-colors ${
                                        request.status === 'Approved' ? 'bg-green-50/30' :
                                        request.status === 'Rejected' ? 'bg-red-50/30' : 'bg-white'
                                    }`}>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 text-sm">{request.itemName}</div>
                                            <div className="text-xs font-mono text-gray-500 mt-0.5">{request.itemSku}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-base text-gray-900">{request.quantity}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate" title={request.reason}>
                                            {request.reason}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.requestedBy}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{request.requestedAt}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                {request.requiresApproval ? (
                                                    <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                        Needs Admin
                                                    </span>
                                                ) : (
                                                    <span className="bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                        Auto
                                                    </span>
                                                )}
                                                
                                                {request.status === 'Pending' && (
                                                    <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-semibold">Pending</span>
                                                )}
                                                {request.status === 'Approved' && (
                                                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        <Check size={12} /> Approved
                                                    </span>
                                                )}
                                                {request.status === 'Rejected' && (
                                                    <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        <XCircle size={12} /> Rejected
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {request.status === 'Pending' && (
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => handleApproveRequest(request.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-semibold text-xs"
                                                    >
                                                        <Check size={14} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectRequest(request.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold text-xs"
                                                    >
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                </div>
                                            )}
                                            {request.status === 'Approved' && (
                                                <span className="text-green-600 font-bold text-xs">✓ Recorded</span>
                                            )}
                                            {request.status === 'Rejected' && (
                                                <span className="text-red-600 font-bold text-xs">✗ Cancelled</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                    <div className="w-full sm:flex-1">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by item name, SKU, or ref..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                            />
                        </div>
                    </div>
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full sm:w-40 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium transition-colors"
                    >
                        <option value="All">All Types</option>
                        <option value="Inward">Inward</option>
                        <option value="Outward">Outward</option>
                        <option value="Adjustment">Adjustment</option>
                    </select>
                    <button
                        onClick={exportToCSV}
                        className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Stock Movements Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-gray-50/80 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reference #</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredMovements.map((movement) => (
                                <tr key={movement.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{movement.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900 text-sm">{movement.itemName}</div>
                                        <div className="text-xs font-mono text-gray-500 mt-0.5">{movement.itemSku}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getMovementIcon(movement.movementType)}
                                            <span className="font-bold text-gray-900 text-base">{movement.quantity}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg ${getMovementBadge(movement.movementType)}`}>
                                            {movement.movementType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{movement.reference || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{movement.createdBy || 'System'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate" title={movement.notes}>
                                        {movement.notes || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredMovements.length === 0 && (
                    <div className="text-center py-12 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No movements found</h3>
                        <p className="text-sm text-gray-500">Adjust your search or filters to see results.</p>
                    </div>
                )}
            </div>

            {/* Modals for GRN, Issue, Adjustment */}
            {(showGRNModal || showIssueModal || showAdjustmentModal) && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                {showGRNModal && 'Inward / Goods Receipt'}
                                {showIssueModal && 'Outward / Issue Parts'}
                                {showAdjustmentModal && 'Stock Adjustment'}
                            </h2>
                            <button onClick={() => {
                                setShowGRNModal(false);
                                setShowIssueModal(false);
                                setShowAdjustmentModal(false);
                                resetForm();
                            }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-5 flex-1">
                            {/* Select Item */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Item <span className="text-red-500">*</span></label>
                                <select
                                    value={formData.itemId}
                                    onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                                >
                                    <option value="">-- Choose an item --</option>
                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} | SKU: {item.sku} (Stock: {item.currentStock})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                                        placeholder="e.g. 50"
                                        min={showAdjustmentModal ? undefined : "1"}
                                    />
                                    {showAdjustmentModal && <p className="text-[11px] text-gray-500 mt-1">Use negative values to reduce stock.</p>}
                                </div>
                                {/* Reference */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reference #</label>
                                    <input
                                        type="text"
                                        value={formData.reference}
                                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                                        placeholder="PO, Bill, or Ticket no."
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Notes {showAdjustmentModal && <span className="text-red-500">* (Reason)</span>}
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                                    placeholder={showAdjustmentModal ? 'Required: Enter reason (e.g. Damage, Expiry, Audit Correction)' : 'Optional details...'}
                                    rows="3"
                                />
                            </div>

                            {/* Approval Notes for Adjustments */}
                            {showAdjustmentModal && formData.quantity && Math.abs(parseInt(formData.quantity)) > 10 && (
                                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3 mt-2">
                                    <CheckCircle size={20} className="text-orange-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-orange-900 leading-tight">Admin Approval Required</p>
                                        <p className="text-xs text-orange-700 mt-1">Changes exceeding 10 units must be authorized by an administrator.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3 shrink-0">
                            <button
                                onClick={() => {
                                    setShowGRNModal(false);
                                    setShowIssueModal(false);
                                    setShowAdjustmentModal(false);
                                    resetForm();
                                }}
                                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStockMovement}
                                className={`w-full sm:flex-1 px-5 py-2.5 text-white rounded-xl font-bold shadow-sm transition-colors ${
                                    showGRNModal ? 'bg-green-600 hover:bg-green-700' :
                                    showIssueModal ? 'bg-red-600 hover:bg-red-700' :
                                    'bg-yellow-600 hover:bg-yellow-700'
                                }`}
                            >
                                {showAdjustmentModal ? 'Submit for Approval' : 'Record Movement'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}