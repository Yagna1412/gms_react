import React from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2, 
  Car,
  Award,
  Phone,
  Mail,
  MapPin,
  X,
  History
} from 'lucide-react';
import { useCustomerManagement } from '../useCustomerManagement';

export default function CustomerManagement() {
  const {
    currentBranch,
    searchTerm,
    typeFilter,
    showModal,
    viewingCustomer,
    showVehicleModal,
    selectedCustomer,
    isEditing,
    formData,
    vehicleData,
    filteredCustomers,
    getTypeColor,
    setSearchTerm,
    setTypeFilter,
    openCreateModal,
    closeCustomerModal,
    openViewCustomer,
    closeViewCustomer,
    openVehicleModal,
    closeVehicleModal,
    updateFormField,
    updateVehicleField,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleAddVehicle
  } = useCustomerManagement();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-black mb-2">Customer Management</h1>
          <p className="text-gray-600 text-sm">Manage customers for {currentBranch}</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Register Customer
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Customers</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-black">{filteredCustomers.length}</div>
          <div className="text-xs text-gray-600 mt-1">{currentBranch}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">VIP Customers</span>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-black">{filteredCustomers.filter(c => c.type === 'VIP').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Premium</span>
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-black">{filteredCustomers.filter(c => c.type === 'Premium').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Regular</span>
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <div className="text-3xl font-bold text-black">{filteredCustomers.filter(c => c.type === 'Regular').length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D] focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="VIP">VIP</option>
            <option value="Premium">Premium</option>
            <option value="Regular">Regular</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer ID</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Contact</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Loyalty Points</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Vehicles</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-sm font-mono text-gray-700">{customer.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-semibold text-black">{customer.name}</div>
                      <div className="text-xs text-gray-600">{customer.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-4 h-4" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(customer.type)}`}>
                      {customer.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-black">{customer.loyaltyPoints}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-black">{customer.vehicles.length}</span>
                      <button 
                        onClick={() => openVehicleModal(customer)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        + Add
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openViewCustomer(customer)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleEdit(customer)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(customer.id, customer.name)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors group"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-bold text-black">{isEditing ? 'Edit Customer' : 'Register New Customer'}</h2>
              <p className="text-sm text-gray-600 mt-1">{isEditing ? `Updating ${formData.name}` : `Add customer to ${currentBranch}`}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">FULL NAME *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormField('name', e.target.value)}
                      placeholder="e.g., Rahul Sharma"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">PHONE NUMBER *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormField('phone', e.target.value)}
                      placeholder="e.g., +91 98765 43210"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormField('email', e.target.value)}
                      placeholder="e.g., rahul@example.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">CUSTOMER TYPE</label>
                    <select
                      value={formData.type}
                      onChange={(e) => updateFormField('type', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Premium">Premium</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">ADDRESS</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => updateFormField('address', e.target.value)}
                    placeholder="Complete address"
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button 
                  type="button"
                  onClick={closeCustomerModal}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-black">{viewingCustomer.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{viewingCustomer.id}</p>
              </div>
              <button 
                onClick={closeViewCustomer}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-xs text-gray-600">Phone</div>
                      <div className="text-sm font-medium text-black">{viewingCustomer.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-xs text-gray-600">Email</div>
                      <div className="text-sm font-medium text-black">{viewingCustomer.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg col-span-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-xs text-gray-600">Address</div>
                      <div className="text-sm font-medium text-black">{viewingCustomer.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Type</span>
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-black">{viewingCustomer.type}</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Loyalty Points</span>
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-black">{viewingCustomer.loyaltyPoints}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Registered Vehicles</h3>
                <div className="space-y-2">
                  {viewingCustomer.vehicles.map(vehicle => (
                    <div key={vehicle.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Car className="w-5 h-5 text-gray-600" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-black">{vehicle.make} {vehicle.model} ({vehicle.year})</div>
                        <div className="text-xs text-gray-600">Reg: {vehicle.regNo} • VIN: {vehicle.vin}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Service History</h3>
                {viewingCustomer.serviceHistory && viewingCustomer.serviceHistory.length > 0 ? (
                  <div className="space-y-2">
                    {viewingCustomer.serviceHistory.map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <History className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="text-sm font-semibold text-black">{service.service}</div>
                            <div className="text-xs text-gray-600">{service.jobCard} • {service.date}</div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-black">₹{service.amount.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 text-sm">No service history yet</div>
                )}
              </div>
          
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Preferences</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Preferred Technician</div>
                    <div className="text-sm font-medium text-black">{viewingCustomer.preferences?.technician || 'Not Set'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Time Slot</div>
                    <div className="text-sm font-medium text-black">{viewingCustomer.preferences?.timeSlot || 'Not Set'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Communication</div>
                    <div className="text-sm font-medium text-black">{viewingCustomer.preferences?.communication || 'Not Set'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 flex items-center justify-end">
              <button
                onClick={closeViewCustomer}
                className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showVehicleModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-bold text-black">Add Vehicle</h2>
              <p className="text-sm text-gray-600 mt-1">Add vehicle for {selectedCustomer.name}</p>
            </div>
            <form onSubmit={handleAddVehicle}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">MAKE *</label>
                    <input
                      type="text"
                      value={vehicleData.make}
                      onChange={(e) => updateVehicleField('make', e.target.value)}
                      placeholder="e.g., Maruti Suzuki"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">MODEL *</label>
                    <input
                      type="text"
                      value={vehicleData.model}
                      onChange={(e) => updateVehicleField('model', e.target.value)}
                      placeholder="e.g., Swift"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">YEAR</label>
                    <input
                      type="text"
                      value={vehicleData.year}
                      onChange={(e) => updateVehicleField('year', e.target.value)}
                      placeholder="e.g., 2020"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">REGISTRATION NO *</label>
                    <input
                      type="text"
                      value={vehicleData.regNo}
                      onChange={(e) => updateVehicleField('regNo', e.target.value.toUpperCase())}
                      placeholder="e.g., MH02AB1234"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">VIN / CHASSIS NUMBER</label>
                    <input
                      type="text"
                      value={vehicleData.vin}
                      onChange={(e) => updateVehicleField('vin', e.target.value.toUpperCase())}
                      placeholder="e.g., MA3EW51S000123456"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button 
                  type="button"
                  onClick={closeVehicleModal}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#2563EB]-900 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
