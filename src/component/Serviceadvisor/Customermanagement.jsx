import React, { useState } from 'react';
import { useServiceAdvisor } from '../context/Serviceadvisorcontext';
import { toast } from 'sonner';
import {
  Users, Plus, Search, Eye, Edit, Trash2, Car, Award,
  Phone, Mail, MapPin, X, History
} from 'lucide-react';

export default function CustomerManagement() {
  const {
    customers, addCustomer, updateCustomer, deleteCustomer,
    addVehicleToCustomer, currentBranch
  } = useServiceAdvisor();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', address: '', type: 'Regular'
  });

  const [vehicleData, setVehicleData] = useState({
    make: '', model: '', year: '', regNo: '', vin: ''
  });

  const filteredCustomers = customers.filter(c =>
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (typeFilter === 'all' || c.type === typeFilter) &&
    c.branch === currentBranch
  );

  const getTypeColor = type =>
    type === 'VIP' ? 'bg-purple-50 text-purple-700'
      : type === 'Premium' ? 'bg-blue-50 text-blue-700'
        : 'bg-gray-50 text-gray-700';

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-bold text-lg sm:text-xl">Customer Management</h1>
          <p className="text-sm text-gray-600">Manage customers for {currentBranch}</p>
        </div>
        <button
          onClick={() => { setIsEditing(false); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Register Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ['Total Customers', filteredCustomers.length, Users],
          ['VIP', filteredCustomers.filter(c => c.type === 'VIP').length, Award],
          ['Premium', filteredCustomers.filter(c => c.type === 'Premium').length, Award],
          ['Regular', filteredCustomers.filter(c => c.type === 'Regular').length, Users]
        ].map(([label, value, Icon]) => (
          <div key={label} className="bg-white rounded-xl p-5 border shadow-sm">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{label}</span>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm"
            placeholder="Search name, phone, email"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 border rounded-lg text-sm w-full sm:w-auto"
        >
          <option value="all">All Types</option>
          <option value="VIP">VIP</option>
          <option value="Premium">Premium</option>
          <option value="Regular">Regular</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="min-w-[1100px] w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              {['ID', 'Name', 'Contact', 'Type', 'Points', 'Vehicles', 'Actions']
                .map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCustomers.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{c.id}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.email}</div>
                </td>
                <td className="px-4 py-3 flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" /> {c.phone}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(c.type)}`}>
                    {c.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{c.loyaltyPoints}</td>
                <td className="px-4 py-3">
                  {c.vehicles.length}{' '}
                  <button
                    onClick={() => { setSelectedCustomer(c); setShowVehicleModal(true); }}
                    className="text-xs text-blue-600"
                  >
                    + Add
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Eye onClick={() => setViewingCustomer(c)} className="w-4 h-4 cursor-pointer" />
                    <Edit onClick={() => { setIsEditing(true); setEditingId(c.id); setFormData(c); setShowModal(true); }} className="w-4 h-4 cursor-pointer" />
                    <Trash2 onClick={() => deleteCustomer(c.id)} className="w-4 h-4 text-red-500 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
    </div>
  );
}
