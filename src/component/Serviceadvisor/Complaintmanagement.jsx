import React, { useState } from 'react';
import { useServiceAdvisor } from '../context/Serviceadvisorcontext';
import { toast } from 'sonner';
import { AlertCircle, Plus, TrendingUp } from 'lucide-react';

export default function ComplaintManagement() {
  const { complaints, addComplaint, updateComplaint } = useServiceAdvisor();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    jobCardId: '',
    category: 'Service Quality',
    severity: 'Low',
    description: '',
    department: 'Operations'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }
    addComplaint(formData);
    toast.success('Complaint registered successfully');
    setShowModal(false);
    setFormData({ customerId: '', customerName: '', jobCardId: '', category: 'Service Quality', severity: 'Low', description: '', department: 'Operations' });
  };

  const handleEscalate = (id) => {
    updateComplaint(id, { status: 'Escalated' });
    toast.success('Complaint escalated to management');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-50 text-red-700';
      case 'Medium': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-blue-50 text-blue-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-black mb-2">Complaint Management</h1>
          <p className="text-gray-600 text-sm">Register and track customer complaints</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold">
          <Plus className="w-5 h-5" />
          Register Complaint
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Total Complaints</span>
          <div className="text-3xl font-bold text-black mt-2">{complaints.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Pending</span>
          <div className="text-3xl font-bold text-black mt-2">{complaints.filter(c => c.status === 'Pending').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Under Review</span>
          <div className="text-3xl font-bold text-black mt-2">{complaints.filter(c => c.status === 'Under Review').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Resolved</span>
          <div className="text-3xl font-bold text-black mt-2">{complaints.filter(c => c.status === 'Resolved').length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Complaint ID</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Severity</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Filed On</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {complaints.map((comp) => (
              <tr key={comp.id} className="hover:bg-gray-50">
                <td className="py-4 px-6"><span className="text-sm font-mono text-black">{comp.id}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{comp.customerName}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{comp.category}</span></td>
                <td className="py-4 px-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(comp.severity)}`}>
                    {comp.severity}
                  </span>
                </td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{comp.status}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{comp.filedDate}</span></td>
                <td className="py-4 px-6">
                  {comp.status === 'Pending' && (
                    <button onClick={() => handleEscalate(comp.id)} className="text-xs text-red-600 hover:text-red-700 font-medium">
                      Escalate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-bold text-black">Register Complaint</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">CUSTOMER ID *</label>
                    <input
                      type="text"
                      value={formData.customerId}
                      onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                      placeholder="e.g., CUST/MUM/2024/0001"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">CUSTOMER NAME *</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      placeholder="e.g., Rahul Sharma"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">CATEGORY</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    >
                      <option value="Service Quality">Service Quality</option>
                      <option value="Billing Issue">Billing Issue</option>
                      <option value="Staff Behavior">Staff Behavior</option>
                      <option value="Delay">Delay</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">SEVERITY</label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({...formData, severity: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">DESCRIPTION *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the complaint..."
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-900">
                  Register Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
