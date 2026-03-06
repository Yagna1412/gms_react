import React from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  User, 
  Car, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useJobCardCreation } from '../useJobCardCreation';

export default function JobCardCreation() {
  const {
    jobCards,
    customers,
    showModal,
    viewingJobCard,
    searchTerm,
    isEditing,
    formData,
    filteredJobCards,
    getPriorityColor,
    setSearchTerm,
    openCreateModal,
    closeModal,
    openJobDetails,
    closeJobDetails,
    updateFormField,
    handleCustomerChange,
    handleEdit,
    handleDelete,
    handleSubmit
  } = useJobCardCreation();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-black mb-2 text-2xl">Job Card Creation</h1>
          <p className="text-gray-600 text-sm">Create and manage active service records</p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Job Card
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Total Job Cards</span>
          <div className="text-3xl font-bold text-black mt-2">{jobCards.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">In Progress</span>
          <div className="text-3xl font-bold text-black mt-2">{jobCards.filter(j => j.status === 'In-Progress').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">VIP Priority</span>
          <div className="text-3xl font-bold text-black mt-2">{jobCards.filter(j => j.priority === 'VIP').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Completed Today</span>
          <div className="text-3xl font-bold text-black mt-2">{jobCards.filter(j => j.status === 'Completed').length}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by Job ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5FF4D] outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Job Card ID</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Priority</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredJobCards.length > 0 ? filteredJobCards.map((jc) => (
              <tr key={jc.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6"><span className="text-sm font-mono font-bold text-blue-600">{jc.id}</span></td>
                <td className="py-4 px-6"><span className="text-sm font-medium text-gray-800">{jc.customerName}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{jc.vehicle}</span></td>
                <td className="py-4 px-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(jc.priority)}`}>
                    {jc.priority}
                  </span>
                </td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{jc.status}</span></td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openJobDetails(jc)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEdit(jc)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(jc.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-500">No job cards found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal (Your existing form) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-xl text-black">{isEditing ? 'Update Job Card' : 'Create Job Card'}</h2>
              <button onClick={closeModal}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Customer *</label>
                    <select
                      required
                      value={formData.customerId}
                      onChange={(e) => handleCustomerChange(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C5FF4D] outline-none"
                    >
                      <option value="">Select customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Odometer Reading</label>
                    <input
                      type="number"
                      value={formData.odometer}
                      onChange={(e) => updateFormField('odometer', e.target.value)}
                      placeholder="e.g., 45000"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C5FF4D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => updateFormField('priority', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C5FF4D] outline-none"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Technician</label>
                    <select
                      value={formData.technician}
                      onChange={(e) => updateFormField('technician', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C5FF4D] outline-none"
                    >
                      <option value="">Auto-assign</option>
                      <option value="Rajesh Kumar">Rajesh Kumar</option>
                      <option value="Vikram Singh">Vikram Singh</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Customer Complaints *</label>
                  <textarea
                    required
                    value={formData.complaints}
                    onChange={(e) => updateFormField('complaints', e.target.value)}
                    placeholder="e.g., Engine noise, Brake check"
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C5FF4D] outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm">
                  {isEditing ? 'Save Changes' : 'Create Job Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATED VIEW DETAILS MODAL - MATCHED TO IMAGE 2 */}
      {viewingJobCard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-8">
            {/* Header Job ID */}
            <div className="mb-4">
              <p className="text-[11px] font-bold text-gray-400 font-mono tracking-widest uppercase">
                {viewingJobCard.id}
              </p>
            </div>

            {/* Customer Information Section */}
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
              <div className="p-3 bg-blue-50 rounded-full">
                <User className="text-blue-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Customer Name
                </p>
                <p className="font-bold text-gray-900 text-lg leading-tight">
                  {viewingJobCard.customerName}
                </p>
              </div>
            </div>

            {/* Vehicle and Odometer Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8 px-1">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-4 h-4 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Vehicle
                  </span>
                </div>
                <p className="text-[13px] font-bold text-gray-800">
                  {viewingJobCard.vehicle}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Odometer
                  </span>
                </div>
                <p className="text-[13px] font-bold text-gray-800">
                  {viewingJobCard.odometer || '0'} KM
                </p>
              </div>
            </div>

            {/* Reported Issues Tags */}
            <div className="mb-10 px-1">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Reported Issues
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(viewingJobCard.complaints) ? (
                  viewingJobCard.complaints.map((c, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-bold rounded-lg uppercase tracking-tight"
                    >
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    {viewingJobCard.complaints}
                  </span>
                )}
              </div>
            </div>

            {/* Blue Action Button */}
            <button 
              onClick={closeJobDetails} 
              className="w-full py-4 bg-[#2563EB] text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
