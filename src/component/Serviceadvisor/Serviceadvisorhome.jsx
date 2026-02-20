import React from 'react';
import { useServiceAdvisor } from '../context/Serviceadvisorcontext';
import { 
  Calendar, FileText, Activity, Truck, AlertCircle, Users,
  ClipboardList, ArrowRight, Clock, CheckCircle, TrendingUp
} from 'lucide-react';

export default function ServiceAdvisorHome({ onNavigate }) {
  const { appointments, estimations, jobCards, complaints, currentBranch } = useServiceAdvisor();

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today);
  const scheduledToday = todayAppointments.filter(apt => apt.status === 'Scheduled').length;
  const inProgressToday = todayAppointments.filter(apt => apt.status === 'In-Progress').length;

  const pendingEstimations = estimations.filter(est => est.status === 'Pending').length;
  const jobsInProgress = jobCards.filter(jc => jc.status === 'In-Progress').length;
  const pendingDeliveries = jobCards.filter(jc =>
    jc.status === 'Quality Check' || jc.status === 'Ready for Delivery'
  ).length;
  const activeComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-black mb-1">
          Service Advisor Dashboard
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm">
          Welcome back! • Branch: {currentBranch}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Today's Appointments", value: scheduledToday, icon: Calendar, color: "blue", total: todayAppointments.length, active: inProgressToday, nav: 'appointments' },
          { title: "Pending Estimations", value: pendingEstimations, icon: FileText, color: "purple", nav: 'estimations' },
          { title: "Jobs in Progress", value: jobsInProgress, icon: Activity, color: "green", nav: 'tracking' },
          { title: "Pending Deliveries", value: pendingDeliveries, icon: Truck, color: "orange", nav: 'delivery' }
        ].map((card, i) => (
          <div
            key={i}
            onClick={() => onNavigate(card.nav)}
            className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="flex justify-between mb-3">
              <div className={`w-11 h-11 bg-${card.color}-100 rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 text-${card.color}-600`} />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm text-gray-600">{card.title}</div>
            {card.total !== undefined && (
              <div className="text-xs mt-1 text-gray-500">
                {card.total} total • {card.active} active
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <h2 className="font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "New Appointment", icon: Calendar, nav: 'appointments', color: "blue" },
              { label: "New Customer", icon: Users, nav: 'customers', color: "green" },
              { label: "Create Job Card", icon: ClipboardList, nav: 'jobcards', color: "purple" },
              { label: "New Estimation", icon: FileText, nav: 'estimations', color: "yellow" }
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => onNavigate(btn.nav)}
                className="flex gap-3 p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className={`w-9 h-9 bg-${btn.color}-100 rounded-lg flex items-center justify-center`}>
                  <btn.icon className={`w-4 h-4 text-${btn.color}-600`} />
                </div>
                <span className="text-sm font-semibold">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <h2 className="font-bold mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {todayAppointments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No appointments today
              </p>
            )}
            {todayAppointments.slice(0, 3).map(apt => (
              <div key={apt.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600 mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{apt.time}</span>
                    <span className="text-xs">{apt.status}</span>
                  </div>
                  <div className="text-xs text-gray-600">{apt.customerName}</div>
                  <div className="text-xs text-gray-500">{apt.vehicle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Job Cards", value: jobCards.length, icon: ClipboardList },
          { label: "Estimation Value", value: `₹${(estimations.reduce((s, e) => s + e.totalAmount, 0) / 1000).toFixed(0)}K`, icon: TrendingUp },
          { label: "Completion Rate", value: "87%", icon: CheckCircle }
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border shadow-sm">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{item.label}</span>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
