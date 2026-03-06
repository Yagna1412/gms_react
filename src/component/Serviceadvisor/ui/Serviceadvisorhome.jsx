import React from 'react';
import {
  Calendar,
  FileText,
  Activity,
  Truck,
  AlertCircle,
  Users,
  ClipboardList,
  ArrowRight,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { useServiceAdvisorHome } from '../useServiceAdvisorHome';

export default function ServiceAdvisorHome({ onNavigate }) {
  const {
    currentBranch,
    jobCards,
    todayAppointments,
    scheduledToday,
    inProgressToday,
    pendingEstimations,
    jobsInProgress,
    pendingDeliveries,
    activeComplaints,
    pendingEstimationItems,
    activeComplaintItems,
    totalEstimationValueK
  } = useServiceAdvisorHome();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-black mb-2">Service Advisor Dashboard</h1>
        <p className="text-gray-600 text-sm">Welcome back! Here's your overview for today • Branch: {currentBranch}</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('appointments')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">{scheduledToday}</div>
          <div className="text-sm text-gray-600 mb-2">Today's Appointments</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-blue-600 font-semibold">{todayAppointments.length} Total</span>
            <span className="text-gray-400">•</span>
            <span className="text-green-600 font-semibold">{inProgressToday} Active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('estimations')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">{pendingEstimations}</div>
          <div className="text-sm text-gray-600 mb-2">Pending Estimations</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-orange-600 font-semibold">Awaiting Approval</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('tracking')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">{jobsInProgress}</div>
          <div className="text-sm text-gray-600 mb-2">Jobs in Progress</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-600 font-semibold">Active Work</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('delivery')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">{pendingDeliveries}</div>
          <div className="text-sm text-gray-600 mb-2">Pending Deliveries</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-orange-600 font-semibold">Ready to Deliver</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-black mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onNavigate('appointments')} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#C5FF4D] hover:bg-gray-50 transition-all">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-black">New Appointment</div>
                <div className="text-xs text-gray-500">Book slot</div>
              </div>
            </button>

            <button onClick={() => onNavigate('customers')} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#C5FF4D] hover:bg-gray-50 transition-all">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-black">New Customer</div>
                <div className="text-xs text-gray-500">Register</div>
              </div>
            </button>

            <button onClick={() => onNavigate('jobcards')} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#C5FF4D] hover:bg-gray-50 transition-all">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-black">Create Job Card</div>
                <div className="text-xs text-gray-500">Walk-in</div>
              </div>
            </button>

            <button onClick={() => onNavigate('estimations')} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#C5FF4D] hover:bg-gray-50 transition-all">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-black">New Estimation</div>
                <div className="text-xs text-gray-500">Quote</div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-black">Today's Schedule</h2>
            <button onClick={() => onNavigate('appointments')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {todayAppointments.slice(0, 3).map((apt) => (
              <div key={apt.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-black">{apt.time}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      apt.status === 'Scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{apt.customerName}</div>
                  <div className="text-xs text-gray-500">{apt.vehicle} • {apt.serviceType}</div>
                </div>
              </div>
            ))}
            {todayAppointments.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">No appointments scheduled for today</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-black">Pending Estimations</h2>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
              {pendingEstimations} Pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingEstimationItems.map((est) => (
              <div key={est.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-black">{est.customerName}</div>
                  <div className="text-xs text-gray-600">{est.id} • ₹{est.totalAmount.toLocaleString()}</div>
                </div>
                <button onClick={() => onNavigate('estimations')} className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                  Review
                </button>
              </div>
            ))}
            {pendingEstimations === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">No pending estimations</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-black">Active Complaints</h2>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
              {activeComplaints} Active
            </span>
          </div>
          <div className="space-y-3">
            {activeComplaintItems.map((comp) => (
              <div key={comp.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-black">{comp.customerName}</div>
                  <div className="text-xs text-gray-600 mb-1">{comp.category}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      comp.severity === 'High' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {comp.severity}
                    </span>
                    <span className="text-xs text-gray-500">{comp.status}</span>
                  </div>
                </div>
              </div>
            ))}
            {activeComplaints === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                No active complaints
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Job Cards</span>
            <ClipboardList className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-black">{jobCards.length}</div>
          <div className="text-xs text-gray-500 mt-1">This month</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Estimation Value</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-black">₹{totalEstimationValueK}K</div>
          <div className="text-xs text-gray-500 mt-1">Total pending</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <CheckCircle className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-black">87%</div>
          <div className="text-xs text-gray-500 mt-1">On-time delivery</div>
        </div>
      </div>
    </div>
  );
}
