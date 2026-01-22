import React, { useState } from 'react';
import { useMechanic } from '../contexts/MechanicContext';
import { Package, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PartsRequest() {
  const { jobs, partsRequests, requestParts, acknowledgePartsReceipt } = useMechanic();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    jobCardId: '',
    partName: '',
    quantity: 1,
    reason: ''
  });

const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.jobCardId || !formData.partName) {
      toast.error('Please fill all required fields');
      return;
    }

    const newRequest = requestParts(
      formData.jobCardId,
      [{ name: formData.partName, qty: formData.quantity }],
      'Additional'
    );
    toast.success(`Parts request ${newRequest.id} submitted for approval`);
    setShowModal(false);
    setFormData({ jobCardId: '', partName: '', quantity: 1, reason: '' });
  };

  const handleAcknowledge = (requestId) => {
    acknowledgePartsReceipt(requestId);
    toast.success('Parts received and acknowledged');
  };

  const activeJobs = jobs.filter(j => j.status === 'Assigned' || j.status === 'In-Progress');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-black mb-2">Parts Request Management</h1>
          <p className="text-gray-600 text-sm">Request and track parts for your jobs</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-semibold">
          <Plus className="w-5 h-5" />
          Request Parts
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Pending Requests</span>
          <div className="text-3xl font-bold text-black mt-2">{partsRequests.filter(r => r.status === 'Pending').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Approved</span>
          <div className="text-3xl font-bold text-black mt-2">{partsRequests.filter(r => r.status === 'Approved').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Received</span>
          <div className="text-3xl font-bold text-black mt-2">{partsRequests.filter(r => r.status === 'Received').length}</div>
        </div>
      </div>

         {/* Parts Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Request ID</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Job Card</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Parts</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Requested At</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partsRequests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="py-4 px-6"><span className="text-sm font-mono text-black">{req.id}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{req.jobCardId}</span></td>
                <td className="py-4 px-6">
                  {req.parts.map((part, idx) => (
                    <div key={idx} className="text-sm text-gray-700">{part.name} (x{part.qty})</div>
                  ))}
                </td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{req.type}</span></td>
                <td className="py-4 px-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    req.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                    req.status === 'Approved' ? 'bg-blue-50 text-blue-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="py-4 px-6"><span className="text-xs text-gray-600">{new Date(req.requestedAt).toLocaleString()}</span></td>
                <td className="py-4 px-6">
                  {req.status === 'Approved' && (
                    <button onClick={() => handleAcknowledge(req.id)} className="text-xs text-green-600 hover:text-green-700 font-medium">
                      Acknowledge Receipt
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            
    {/* Allocated Parts for Active Jobs */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-bold text-black mb-4">Allocated Parts (Active Jobs)</h2>
        <div className="space-y-4">
          {activeJobs.map(job => (
            <div key={job.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-black mb-2">{job.id}</div>
              <div className="space-y-2">
                {job.parts.map((part, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{part.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">Qty: {part.qty}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        part.status === 'Issued' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {part.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
            {/* Request Parts Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-black">Request Additional Parts</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">JOB CARD *</label>
                  <select
                    value={formData.jobCardId}
                    onChange={(e) => setFormData({...formData, jobCardId: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="">Select job card</option>
                    {activeJobs.map(job => (
                      <option key={job.id} value={job.id}>{job.id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">PART NAME *</label>
                  <input
                    type="text"
                    value={formData.partName}
                    onChange={(e) => setFormData({...formData, partName: e.target.value})}
                    placeholder="e.g., Brake Fluid"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">QUANTITY</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">REASON</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Why is this additional part needed?"
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8]">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
     
    </div>

  );
}