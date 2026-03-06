import { Calendar, Plus, Clock, CheckCircle } from 'lucide-react';
import { useAppointmentBooking } from '../useAppointmentBooking';

export default function AppointmentBooking() {
  const {
    customers,
    filteredAppointments,
    formData,
    showModal,
    viewDate,
    minDate,
    timeSlots,
    openBookingModal,
    closeBookingModal,
    setViewDate,
    updateFormField,
    handleCustomerChange,
    handleSubmit,
    handleCancel,
    handleReschedule
  } = useAppointmentBooking();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-50 text-blue-700';
      case 'In-Progress': return 'bg-green-50 text-green-700';
      case 'Completed': return 'bg-gray-50 text-gray-700';
      case 'Cancelled': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-black mb-2">Appointment Booking</h1>
          <p className="text-gray-600 text-sm">Manage customer appointments and schedules</p>
        </div>
        <button onClick={openBookingModal} className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB]-900 transition-colors font-semibold">
          <Plus className="w-5 h-5" />
          Book Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Today</span>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-black">{filteredAppointments.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Scheduled</span>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-black">{filteredAppointments.filter(a => a.status === 'Scheduled').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">In Progress</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-black">{filteredAppointments.filter(a => a.status === 'In-Progress').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completed</span>
            <CheckCircle className="w-5 h-5 text-gray-500" />
          </div>
          <div className="text-3xl font-bold text-black">{filteredAppointments.filter(a => a.status === 'Completed').length}</div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <input
            type="date"
            value={viewDate}
            onChange={(e) => setViewDate(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
          />
          <span className="text-sm text-gray-600">{filteredAppointments.length} appointment(s) on this day</span>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Time</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Service</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Technician</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Duration</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAppointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-black">{apt.time}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm font-semibold text-black">{apt.customerName}</div>
                    <div className="text-xs text-gray-600">{apt.id}</div>
                  </div>
                </td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{apt.vehicle}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{apt.serviceType}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{apt.technician}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{apt.duration}</span></td>
                <td className="py-4 px-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {apt.status === 'Scheduled' && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleReschedule(apt)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Reschedule
                      </button>
                      <button onClick={() => handleCancel(apt.id)} className="text-xs text-red-600 hover:text-red-700 font-medium">
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-bold text-black">Book Appointment</h2>
              <p className="text-sm text-gray-600 mt-1">Schedule service appointment</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">SELECT CUSTOMER *</label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => handleCustomerChange(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    >
                      <option value="">Select customer</option>
                      {customers.map(cust => (
                        <option key={cust.id} value={cust.id}>{cust.name} - {cust.phone}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">SERVICE TYPE *</label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => updateFormField('serviceType', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    >
                      <option value="">Select service</option>
                      <option value="General Service">General Service</option>
                      <option value="Oil Change">Oil Change</option>
                      <option value="AC Service">AC Service</option>
                      <option value="Brake Service">Brake Service</option>
                      <option value="Engine Repair">Engine Repair</option>
                      <option value="Wheel Alignment">Wheel Alignment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">DATE *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateFormField('date', e.target.value)}
                      min={minDate}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">TIME SLOT *</label>
                    <select
                      value={formData.time}
                      onChange={(e) => updateFormField('time', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">TECHNICIAN</label>
                    <select
                      value={formData.technician}
                      onChange={(e) => updateFormField('technician', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    >
                      <option value="">Auto-assign</option>
                      <option value="Rajesh Kumar">Rajesh Kumar</option>
                      <option value="Vikram Singh">Vikram Singh</option>
                      <option value="Amit Verma">Amit Verma</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">DURATION</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => updateFormField('duration', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D]"
                    >
                      <option value="1 hour">1 hour</option>
                      <option value="2 hours">2 hours</option>
                      <option value="3 hours">3 hours</option>
                      <option value="4 hours">4 hours</option>
                      <option value="Full day">Full day</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button type="button" onClick={closeBookingModal} className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#2563EB]-900 transition-colors">
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
