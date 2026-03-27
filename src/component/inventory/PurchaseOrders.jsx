import React, { useState } from 'react';
import { useInventory } from '../../component/context/InventoryContext';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ShoppingCart, Plus, Search, Download, Eye, Edit2, Trash2, X, Lock, Send, Printer, CheckCircle } from 'lucide-react';

export default function PurchaseOrders() {
    const { purchaseOrders, vendors, items, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } = useInventory();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPO, setSelectedPO] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const [formData, setFormData] = useState({
        poNumber: '',
        vendor: '',
        orderDate: '',
        expectedDelivery: '',
        items: [],
        status: 'Pending',
        totalAmount: 0
    });

    const totalPOs = purchaseOrders.length;
    const pendingPOs = purchaseOrders.filter(po => po.status === "Pending").length;
    const approvalPos = purchaseOrders.filter(po => po.status === "Approval" || po.status === "Approved").length;
    const receivedPOs = purchaseOrders.filter(po => po.status === "Received").length;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const filteredPOs = purchaseOrders.filter(po => {
        const matchesSearch = po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            po.vendor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || po.status === filterStatus;
        return matchesSearch && matchesStatus;
    })

    // Generate PO Number with format: PO-202601-001 (YearMonth + Sequential)
    const generatePONumber = () => {
        const now = new Date();
        const yearMonth = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0');
        const poCount = purchaseOrders.length + 1;
        return `PO-${yearMonth}-${String(poCount).padStart(3, '0')}`;
    };

    const exportToCSV = () => {
        if (filteredPOs.length === 0) {
            toast.error('No data to export.');
            return;
        }

        const csvContent = [
            ['PO Number', 'Vendor', 'Order Date', 'Expected Delivery', 'Total Amount', 'Status'],
            ...filteredPOs.map(po => [
                po.poNumber,
                po.vendor,
                po.orderDate,
                po.expectedDelivery,
                po.totalAmount,
                po.status
            ])
        ].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'Purchase_Orders.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleAddPO = () => {
        // Form Validation
        if (!formData.vendor.trim()) {
            toast.error('Please select a vendor');
            return;
        }
        if (!formData.orderDate) {
            toast.error('Please select order date');
            return;
        }
        if (!formData.expectedDelivery) {
            toast.error('Please select expected delivery date');
            return;
        }
        if (formData.items.length === 0) {
            toast.error('Please add at least one item');
            return;
        }

        // Validate all items have quantity and price
        const invalidItems = formData.items.some(item => !item.itemId || item.qty <= 0 || item.price <= 0);
        if (invalidItems) {
            toast.error('Please fill all item details (item, quantity, price)');
            return;
        }

        // Calculate total amount before submitting
        const calculatedTotal = formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
        const poData = {
            ...formData,
            totalAmount: calculatedTotal
        };

        addPurchaseOrder(poData);
        toast.success('Purchase Order added successfully');
        setShowAddModal(false);
        setFormData({
            poNumber: generatePONumber(),
            vendor: '',
            orderDate: '',
            expectedDelivery: '',
            items: [],
            status: 'Pending',
            totalAmount: 0
        });
    };

    const handleUpdateStatus = (id, newStatus) => {
        updatePurchaseOrder(id, { status: newStatus });
        toast.success(`PO status updated to ${newStatus}`);
        setShowViewModal(false);
    }

    const handleDeletePO = (id, poNumber) => {
        if (window.confirm(`Delete PO ${poNumber}?`)) {
            deletePurchaseOrder(id);
            toast.success('PO deleted successfully');
        }
    };

    const handleSendToVendor = (id) => {
        updatePurchaseOrder(id, { status: 'Sent' });
        toast.success('PO sent to vendor');
    };

    const resetForm = () => {
        setFormData({
            poNumber: generatePONumber(),
            vendor: '',
            orderDate: '',
            expectedDelivery: '',
            items: [],
            status: 'Pending',
            totalAmount: 0
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Pending":
                return 'bg-yellow-100 text-yellow-700';
            case "Pending-Approval":
            case "Pending Approval":
                return 'bg-orange-100 text-orange-700'
            case "Approval":
            case "Approved":
                return 'bg-blue-100 text-blue-700';
            case "Received":
                return 'bg-green-100 text-green-700';
            case "Cancelled":
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    // print po function 
    const handlePrintVendorPO = () => {
        if (!selectedPO) return;

        const printWindow = window.open("", "_blank", "width=900,height=650");

        const rows = (selectedPO.items || [])
            .map(
                item => `
      <tr>
        <td>${item.itemName}</td>
        <td>${item.qty}</td>
        <td>₹${item.price}</td>
        <td style="text-align:right;">₹${(
                        item.qty * item.price
                    ).toLocaleString()}</td>
      </tr>
    `
            )
            .join("");

        printWindow.document.write(`
    <html>
      <head>
        <title>Purchase Order ${selectedPO.poNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #111; }
          h1 { margin-bottom: 10px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 12px; }
          .label { color: #666; font-size: 12px; }
          .value { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border-bottom: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background: #f5f5f5; font-size: 13px; }
          .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Purchase Order</h1>

        <div class="row">
          <div>
            <div class="label">PO NUMBER</div>
            <div class="value">${selectedPO.poNumber}</div>
          </div>
          <div>
            <div class="label">STATUS</div>
            <div class="value">${selectedPO.status}</div>
          </div>
        </div>

        <div class="row">
          <div>
            <div class="label">VENDOR</div>
            <div class="value">${selectedPO.vendor}</div>
          </div>
          <div>
            <div class="label">TOTAL AMOUNT</div>
            <div class="value">₹${selectedPO.totalAmount.toLocaleString()}</div>
          </div>
        </div>

        <h3>Line Items</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="total">
          Grand Total: ₹${selectedPO.totalAmount.toLocaleString()}
        </div>

        <script>
          window.onload = function () {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);

        printWindow.document.close();
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Purchase Orders</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your purchase orders</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                    <Plus size={18} />
                    Add PO
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <ShoppingCart className="text-blue-600" size={20} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Total POs</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{totalPOs}</div>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                            <ShoppingCart className="text-yellow-600" size={20} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Pending</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{pendingPOs}</div>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <CheckCircle className="text-blue-600" size={20} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Approved</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{approvalPos}</div>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Received</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{receivedPOs}</div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by PO number or vendor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full sm:w-40 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Received">Received</option>
                        </select>
                        <button
                            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            onClick={exportToCSV}
                        >
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* PO Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">PO Number</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Vendor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Order Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Expected</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPOs.length > 0 ? filteredPOs.map((po) => (
                                <tr key={po.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono font-semibold text-blue-600 whitespace-nowrap">{po.poNumber}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{po.vendor}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{po.orderDate}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{po.expectedDelivery}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">₹{po.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg ${getStatusBadge(po.status)}`}>
                                                {po.status}
                                            </span>
                                            {(po.requiresApproval || po.status === 'Pending Approval' || po.status === 'Pending-Approval') && (
                                                <span className="flex items-center gap-1 text-[11px] font-medium text-orange-600 mt-1">
                                                    <Lock size={12} /> Needs Auth
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setSelectedPO(po); setShowViewModal(true); }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details">
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePO(po.id, po.poNumber)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                                        No purchase orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create PO Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
                            <h2 className="text-xl font-bold text-gray-900">Create Purchase Order</h2>
                            <button
                                onClick={() => { setShowAddModal(false); resetForm(); }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">PO Number</p>
                                    <p className="text-lg sm:text-xl font-mono font-bold text-blue-700 mt-1">{formData.poNumber || generatePONumber()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Vendor*</label>
                                    <select
                                        name="vendor"
                                        value={formData.vendor}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    >
                                        <option value="">Select Vendor</option>
                                        {vendors.map(vendor => (
                                            <option key={vendor.id} value={vendor.name}>
                                                {vendor.name} - Rating: {vendor.qualityRating}★ (Tier: {vendor.tier})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order Date*</label>
                                    <input
                                        type="date"
                                        name="orderDate"
                                        value={formData.orderDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Expected Delivery Date*</label>
                                    <input
                                        type="date"
                                        name="expectedDelivery"
                                        value={formData.expectedDelivery}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Line Items</label>
                                <div className="space-y-3">
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-3 sm:p-2 sm:bg-transparent rounded-xl border border-gray-200 sm:border-none items-start sm:items-center">
                                            <select
                                                value={item.itemId}
                                                onChange={(e) => {
                                                    const selectedItem = items.find(i => i.id === parseInt(e.target.value));
                                                    const newItems = [...formData.items];
                                                    newItems[index] = {
                                                        ...newItems[index],
                                                        itemId: e.target.value,
                                                        itemName: selectedItem?.name || '',
                                                        price: selectedItem?.costPrice || 0
                                                    };
                                                    setFormData({ ...formData, items: newItems });
                                                }}
                                                className="w-full sm:flex-1 px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            >
                                                <option value="">Select Item</option>
                                                {items.map(i => (
                                                    <option key={i.id} value={i.id}>{i.name} - ₹{i.costPrice}</option>
                                                ))}
                                            </select>
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={item.qty || ''}
                                                    onChange={(e) => {
                                                        const newItems = [...formData.items];
                                                        newItems[index].qty = parseInt(e.target.value) || 0;
                                                        setFormData({ ...formData, items: newItems });
                                                    }}
                                                    className="flex-1 sm:w-24 px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newItems = formData.items.filter((_, i) => i !== index);
                                                        setFormData({ ...formData, items: newItems });
                                                    }}
                                                    className="px-3 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors"
                                                    title="Remove Item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            items: [...formData.items, { itemId: '', itemName: '', qty: 0, price: 0 }]
                                        })
                                    }}
                                    className="mt-3 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1"
                                >
                                    <Plus size={16} /> Add Item
                                </button>
                            </div>

                            {formData.items.length > 0 && (
                                <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-700 uppercase tracking-wide text-sm">Estimated Total</span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            ₹{formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0).toLocaleString()}
                                        </span>
                                    </div>
                                    {formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0) > 50000 && (
                                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2 text-orange-800">
                                            <Lock size={18} className="shrink-0 mt-0.5" />
                                            <span className="text-sm font-medium leading-tight">This PO exceeds ₹50,000 and requires Admin / Super Admin Approval.</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 shrink-0">
                            <button
                                onClick={() => { setShowAddModal(false); resetForm(); }}
                                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-center"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPO}
                                className="w-full sm:w-auto sm:ml-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm text-center"
                            >
                                Create Purchase Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PO Detail Modal */}
            {showViewModal && selectedPO && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
                            <h2 className="text-xl font-bold text-gray-900">Purchase Order Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">PO Number</label>
                                    <p className="text-base font-mono font-bold text-blue-600 mt-1">{selectedPO.poNumber}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                                    <div className="mt-1">
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-lg ${getStatusBadge(selectedPO.status)}`}>
                                            {selectedPO.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</label>
                                    <p className="text-base font-semibold text-gray-900 mt-1">{selectedPO.vendor}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount</label>
                                    <p className="text-lg font-bold text-gray-900 mt-1">₹{selectedPO.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Line Items</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50/50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Item</th>
                                                <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">Qty</th>
                                                <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">Price</th>
                                                <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {selectedPO.items.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50/50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{item.itemName}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-600 whitespace-nowrap">{item.qty}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-600 whitespace-nowrap">₹{item.price.toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">₹{(item.qty * item.price).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50 border-t border-gray-200">
                                            <tr>
                                                <td colSpan="3" className="px-4 py-3 text-right text-sm font-bold text-gray-700 uppercase">Grand Total:</td>
                                                <td className="px-4 py-3 text-right text-base font-bold text-gray-900 whitespace-nowrap">₹{selectedPO.totalAmount.toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 shrink-0 justify-end flex-wrap">
                            <button onClick={() => handlePrintVendorPO()} className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <Printer size={16} /> Print
                            </button>
                            <button
                                onClick={() => { handleSendToVendor(selectedPO.id) }}
                                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Send size={16} /> Send to Vendor
                            </button>
                            {(selectedPO.status === 'Approved' || selectedPO.status === 'Approval') && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedPO.id, 'Received')}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={16} /> Mark as Received
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}