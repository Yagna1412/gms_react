import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { toast } from 'sonner';
import { ShoppingCart, Plus, Search, Download, Eye, Edit2, Trash2, X, Lock, Send, Printer, CheckCircle } from 'lucide-react';

export default function PurchaseOrders1() {
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
  const approvalPos = purchaseOrders.filter(po => po.status === "Approval").length;
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
    if (filteredPOs.length == 0) {
      toast.error('no data to export.');
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
        return 'bg-orange-100 text-orange-700'
      case "Approval":
        return 'bg-blue-100 text-blue-700';
      case "Received":
        return 'bg-green-100 text-green-700';
      case "Cancelled":
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  //  print po function 

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
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #111;
          }
          h1 {
            margin-bottom: 10px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
          }
          .label {
            color: #666;
            font-size: 12px;
          }
          .value {
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border-bottom: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background: #f5f5f5;
            font-size: 13px;
          }
          .total {
            text-align: right;
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
          }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600 mt-1">Manage your purchase orders</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add PO
        </button>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Purchase Order</h2>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900">PO Number</p>
                <p className="text-xl font-bold text-blue-700 mt-1">{formData.poNumber || generatePONumber()}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Vendor*</label>
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.name}>
                      {vendor.name}-Rating: {vendor.qualityRating}★ - Tier: {vendor.tier}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order Date*</label>
                <input
                  type="date"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Delivery Date*</label>
                <input
                  type="date"
                  name="expectedDelivery"
                  value={formData.expectedDelivery}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Add Items</label>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2">
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
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Items</option>
                        {items.map(i => (
                          <option key={i.id} value={i.id}>{i.name}- ₹{i.costPrice}</option>
                        ))}

                      </select>
                      <input
                        type="number"
                        placeholder="qty"
                        value={item.qty}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[index].qty = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, items: newItems });
                        }}
                        className="w-24 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newItems = formData.items.filter((_, i) => i !== index);
                          setFormData({ ...formData, items: newItems });
                        }}
                        className="px-3 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100">
                        <X size={20} />
                      </button>
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
                  className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100"
                >
                  +Add Item
                </button>
              </div>
              {formData.items.length > 0 &&
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0).toLocaleString()}
                    </span>
                  </div>
                  {formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0) > 50000 && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-700">
                        <Lock size={20} />
                        <span className="text-sm font-semibold">Requires Admin / Super Admin Approval</span>
                      </div>
                    </div>
                  )}
                </div>
              }
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setShowAddModal(false), resetForm(); }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleAddPO}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Create PO
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
              <ShoppingCart className="text-blue-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Total POs</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalPOs}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-yellow-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{pendingPOs}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-blue-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Approved</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{approvalPos}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Received</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{receivedPOs}</div>
        </div>
      </div>

      {/*Search and Filter*/}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 m-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search by PO number or vendor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Received">Received</option>
          </select>
          <button className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
            onClick={exportToCSV}
          >
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/*PO Table*/}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">PO Number </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Order Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Expected Delivery</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPOs.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-blue-600">{po.poNumber}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{po.vendor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{po.orderDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{po.expectedDelivery}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{po.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${getStatusBadge(po.status)}`}>
                        {po.status}
                      </span>
                      {po.requiresApproval && po.status === 'Pending Approval' && (
                        <span className="flex items-center gap-1 text-xs text-orange-600">
                          <Lock size={20} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedPO(po);
                          setShowViewModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details">
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePO(po.id, po.poNumber)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* PO Detail Modal */}
      {showViewModal && selectedPO && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Purchase Order Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">PO Number</label>
                  <p className="text-lg font-mono font-bold text-blue-600 mt-1">{selectedPO.poNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-lg ${getStatusBadge(selectedPO.status)}`}>
                      {selectedPO.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Vendor</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPO.vendor}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Total Amount</label>
                  <p className="text-lg font-bold text-gray-900 mt-1">₹{selectedPO.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3">Line Items</h3>
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-600 pb-2">Item</th>
                      <th className="text-right text-xs font-semibold text-gray-600 pb-2">Qty</th>
                      <th className="text-right text-xs font-semibold text-gray-600 pb-2">Price</th>
                      <th className="text-right text-xs font-semibold text-gray-600 pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedPO.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 text-sm text-gray-900">{item.itemName}</td>
                        <td className="py-2 text-sm text-right text-gray-900">{item.qty}</td>
                        <td className="py-2 text-sm text-right text-gray-900">₹{item.price}</td>
                        <td className="py-2 text-sm text-right font-semibold text-gray-900">₹{(item.qty * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <button onClick={() => handlePrintVendorPO()} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Printer size={18} />
                  Print PO
                </button>
                <button
                  onClick={() => { handleSendToVendor(selectedPO.id) }}
                  className="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2">
                  <Send size={18} />
                  Send to Vendor
                </button>
                {selectedPO.status === 'Approved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedPO.id, 'Received')}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Mark as Received
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}