import React, { useState } from 'react';
import { useServiceAdvisor } from '../context/Serviceadvisorcontext';
import { toast } from 'sonner';
import { Calendar, Plus, Clock, CheckCircle } from 'lucide-react';

export default function AppointmentBooking() {
  const { appointments, customers, addAppointment, updateAppointment } = useServiceAdvisor();
  const [showModal, setShowModal] = useState(false);
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    vehicle: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    serviceType: '',
    technician: '',
    duration: '2 hours'
  });

  const filteredAppointments = appointments.filter(a => a.date === viewDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.date || !formData.time || !formData.serviceType) {
      toast.error('Please fill all required fields');
      return;
    }
    addAppointment(formData);
    toast.success(`Appointment booked for ${formData.customerName}`);
    setShowModal(false);
  };

  const getStatusColor = (status) => ({
    Scheduled: 'bg-blue-50 text-blue-700',
    'In-Progress': 'bg-green-50 text-green-700',
    Completed: 'bg-gray-50 text-gray-700',
    Cancelled: 'bg-red-50 text-red-700'
  }[status] || 'bg-gray-50 text-gray-700');

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-bold text-lg sm:text-xl">Appointment Booking</h1>
          <p className="text-gray-600 text-sm">Manage customer appointments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ['Total Today', filteredAppointments.length, Calendar],
          ['Scheduled', filteredAppointments.filter(a => a.status === 'Scheduled').length, Clock],
          ['In Progress', filteredAppointments.filter(a => a.status === 'In-Progress').length, CheckCircle],
          ['Completed', filteredAppointments.filter(a => a.status === 'Completed').length, CheckCircle]
        ].map(([label, value, Icon], i) => (
          <div key={i} className="bg-white rounded-xl p-5 border shadow-sm">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{label}</span>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl p-4 border shadow-sm mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <Calendar className="w-4 h-4 text-gray-600" />
        <input
          type="date"
          value={viewDate}
          onChange={e => setViewDate(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm w-full sm:w-auto"
        />
        <span className="text-sm text-gray-600">
          {filteredAppointments.length} appointment(s)
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="min-w-[900px] w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              {['Time', 'Customer', 'Vehicle', 'Service', 'Technician', 'Duration', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredAppointments.map(apt => (
              <tr key={apt.id}>
                <td className="px-4 py-3 font-semibold">{apt.time}</td>
                <td className="px-4 py-3">{apt.customerName}</td>
                <td className="px-4 py-3">{apt.vehicle}</td>
                <td className="px-4 py-3">{apt.serviceType}</td>
                <td className="px-4 py-3">{apt.technician}</td>
                <td className="px-4 py-3">{apt.duration}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl">
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <h2 className="font-bold text-lg">Book Appointment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="date" value={formData.date} className="border p-2 rounded" />
                <input type="time" className="border p-2 rounded" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
