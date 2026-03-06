import React from 'react';
import { Plus, Eye, Send, AlertCircle, X } from 'lucide-react';
import { useServiceEstimation } from '../useServiceEstimation';

export default function ServiceEstimation() {
  const {
    estimations,
    jobCards,
    customers,
    showModal,
    formData,
    pendingCount,
    approvedCount,
    totalValueText,
    openModal,
    closeModal,
    updateFormField,
    handleCustomerChange,
    handleApprove,
    handleSend,
    handleSubmit
  } = useServiceEstimation();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-black mb-2">Service Estimation</h1>
          <p className="text-gray-600 text-sm">Create and manage service estimates</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB]-900 transition-colors font-semibold"
          onClick={openModal}
        >
          <Plus className="w-5 h-5" />
          New Estimation
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Pending</span>
          <div className="text-3xl font-bold text-black mt-2">{pendingCount}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Approved</span>
          <div className="text-3xl font-bold text-black mt-2">{approvedCount}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Total Value</span>
          <div className="text-3xl font-bold text-black mt-2">₹{totalValueText}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Estimation ID</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Job Card</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Discount</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Valid Till</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {estimations.map((est) => (
              <tr key={est.id} className="hover:bg-gray-50">
                <td className="py-4 px-6"><span className="text-sm font-mono text-black">{est.id}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{est.customerName}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{est.jobCardId}</span></td>
                <td className="py-4 px-6"><span className="text-sm font-semibold text-black">₹{est.totalAmount.toLocaleString()}</span></td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{est.discount}%</span>
                    {est.discount > 15 && !est.discountApproved && (
                      <AlertCircle className="w-4 h-4 text-orange-500" title="Needs Admin Approval" />
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    est.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {est.status}
                  </span>
                </td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{est.validTill}</span></td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded"><Eye className="w-4 h-4 text-gray-600" /></button>
                    <button onClick={() => handleSend(est)} className="p-1.5 hover:bg-gray-100 rounded"><Send className="w-4 h-4 text-blue-600" /></button>
                    {est.status === 'Pending' && (
                      <button onClick={() => handleApprove(est.id)} className="text-xs text-green-600 hover:text-green-700 font-medium">Approve</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-black">Create New Estimation</h2>
              <button className="p-1.5 hover:bg-gray-100 rounded" onClick={closeModal}>
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Job Card</label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.jobCardId}
                  onChange={(e) => updateFormField('jobCardId', e.target.value)}
                >
                  <option value="">Select Job Card</option>
                  {jobCards.map((jobCard) => (
                    <option key={jobCard.id} value={jobCard.id}>{jobCard.id}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Labor Charges</label>
                <input
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.laborCharges}
                  onChange={(e) => updateFormField('laborCharges', e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                <input
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.discount}
                  onChange={(e) => updateFormField('discount', e.target.value)}
                />
              </div>
              <button type="submit" className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB]-900 transition-colors font-semibold">
                <Plus className="w-5 h-5" />
                Create Estimation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
