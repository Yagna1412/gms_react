import React from 'react'

import { useMechanic } from '../contexts/MechanicContext'

import {
  ClipboardList,
  AlertCircle,
  Activity,
  CheckCircle,
  Clock,
  ArrowRight,
  Play,
  Package,
  MessageSquare,
  TrendingUp
} from 'lucide-react'


export default function MechanicHome({ onNavigate }) {
  const { jobs, currentMechanic, partsRequests, performanceMetrics } = useMechanic();

  const todayJobs = jobs.filter(job => job.assignedDate === new Date().toISOString().split('T')[0]);
  const assignedJobs = jobs.filter(job => job.status === 'Assigned').length;
  const inProgressJobs = jobs.filter(job => job.status === 'In-Progress').length;
  const qcPendingJobs = jobs.filter(job => job.qcStatus === 'Pending' || job.qcStatus === 'Submitted').length;
  const urgentJobs = jobs.filter(job => job.priority === 'VIP' || job.priority === 'Urgent');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'VIP': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Urgent': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned': return 'bg-blue-50 text-blue-700';
      case 'In-Progress': return 'bg-green-50 text-green-700';
      case 'Completed': return 'bg-gray-50 text-gray-700';
      case 'QC Pending': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };


  return (

    <div className='p-8'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-black mb-2">Welcome back, {currentMechanic.name}!</h1>
        <p className="text-gray-600 text-sm">Branch: {currentMechanic.branch} • Specialization: {currentMechanic.specialization}</p>
      </div>

    {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('jobcards')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">{assignedJobs}</div>
          <div className="text-sm text-gray-600 mb-2">Assigned Jobs</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-blue-600 font-semibold">Ready to Start</span>
          </div>
        </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('execution')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">{inProgressJobs}</div>
          <div className="text-sm text-gray-600 mb-2">In Progress</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-600 font-semibold">Active Work</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('qc')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">{qcPendingJobs}</div>
          <div className="text-sm text-gray-600 mb-2">Pending QC</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-yellow-600 font-semibold">Awaiting Review</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('parts')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">{partsRequests.filter(r => r.status === 'Pending').length}</div>
          <div className="text-sm text-gray-600 mb-2">Parts Requests</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-purple-600 font-semibold">Pending Approval</span>
          </div>
        </div>
      </div>

       {/* Priority Jobs Alert */}
       {urgentJobs.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
          <div className='flex items-start gap-3'>
            <AlertCircle className='w-5 h-5 text-red-600 mt-0.5'/>
            <div className='flex-1'>
              <h3 className="font-semibold text-red-900 mb-1">Priority Jobs Require Attention</h3>
              <p className="text-sm text-red-700">You have {urgentJobs.length} urgent/VIP job(s) that need immediate attention.</p>
            </div>
          </div>
        </div>
      )}

         {/* Active Job & Job Queue */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Active Job Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-black mb-4">Active Job</h2>
          {inProgressJobs > 0 ? (
            <>
              {jobs.filter(job => job.status === 'In-Progress').slice(0, 1).map(job => (
                <div key={job.id} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-black mb-1">{job.id}</div>
                      <div className="text-sm text-gray-600">{job.vehicleDetails.make} {job.vehicleDetails.model}</div>
                      <div className="text-xs text-gray-500">{job.vehicleDetails.regNo}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(job.priority)}`}>
                      {job.priority}
                    </span>
                  </div>

                   <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-semibold text-black">{job.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${job.progress}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">Service Requirements:</div>
                    {job.serviceRequirements.slice(0, 2).map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {service}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => onNavigate('execution')}
                    className="w-full py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2"
                  >
                    <Activity className="w-5 h-5" />
                    Continue Work
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm">No active job in progress</p>
              <button 
                onClick={() => onNavigate('jobcards')}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
              >
                View Assigned Jobs
              </button>
            </div>
          )}
        </div>

         {/* Job Queue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-black">Job Queue</h2>
            <button 
              onClick={() => onNavigate('jobcards')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {jobs.filter(job => job.status === 'Assigned').slice(0, 3).map(job => (
              <div key={job.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#C5FF4D] transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-black">{job.id}</div>
                    <div className="text-xs text-gray-600">{job.vehicleDetails.make} {job.vehicleDetails.model} • {job.vehicleDetails.regNo}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(job.priority)}`}>
                    {job.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Est. {job.estimatedTime}</span>
                  <span className={`px-2 py-1 rounded-full font-semibold ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
            {assignedJobs === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                No pending assignments
              </div>
            )}
          </div>
        </div>
      </div>
            
             {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => onNavigate('execution')}
          className="p-6 bg-white rounded-2xl border border-gray-200  hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <Play className="w-6 h-6 text-green-600" />
          </div>
          <div className="font-semibold text-black mb-1">Start Job</div>
          <div className="text-xs text-gray-600">Begin work on assigned job</div>
        </button>

        <button 
          onClick={() => onNavigate('parts')}
          className="p-6 bg-white rounded-2xl border border-gray-200  hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <div className="font-semibold text-black mb-1">Request Parts</div>
          <div className="text-xs text-gray-600">Request additional parts</div>
        </button>

        <button 
          onClick={() => onNavigate('progress')}
          className="p-6 bg-white rounded-2xl border border-gray-200  hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div className="font-semibold text-black mb-1">Update Progress</div>
          <div className="text-xs text-gray-600">Add notes and photos</div>
        </button>

        <button 
          onClick={() => onNavigate('qc')}
          className="p-6 bg-white rounded-2xl border border-gray-200  hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="font-semibold text-black mb-1">Submit for QC</div>
          <div className="text-xs text-gray-600">Complete & submit</div>
        </button>
      </div>

            {/* Performance Snapshot */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-black">This Month's Performance</h2>
          <button 
            onClick={() => onNavigate('performance')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Details
          </button>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Jobs Completed</span>
            </div>
            <div className="text-2xl font-bold text-black">{performanceMetrics.thisMonth.jobsCompleted}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Avg Time</span>
            </div>
            <div className="text-2xl font-bold text-black">{performanceMetrics.thisMonth.avgCompletionTime}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600">Quality Rating</span>
            </div>
            <div className="text-2xl font-bold text-black">{performanceMetrics.thisMonth.qualityRating}/5</div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600">First Pass QC</span>
            </div>
            <div className="text-2xl font-bold text-black">{performanceMetrics.thisMonth.firstPassQC}%</div>
          </div>
        </div>
      </div>
        
      </div>
   
  );
}