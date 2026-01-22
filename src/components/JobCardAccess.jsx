
import React, { useState } from 'react'
import { useMechanic } from '../contexts/MechanicContext'
import { ClipboardList, Eye, X, Car, Wrench } from 'lucide-react'


export default function JobCardAccess() {

  const { jobs,currentMechanic } = useMechanic();
  const [viewingJob, setViewingJob] = useState(null);



  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'VIP': return 'bg-purple-50 text-purple-700';
      case 'Urgent': return 'bg-red-50 text-red-700';
      case 'High': return 'bg-orange-50 text-orange-700';
      default: return 'bg-blue-50 text-blue-700';
    }
  };


  
  return (
    <div className='p-8'>
      <div className='mb-8'>
        <h1 className='font-bold text-black mb-2'>My Job Cards</h1>
          <p className="text-gray-600 text-sm">Viewing jobs assigned to {currentMechanic.name}</p>
      </div>

       {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Total Assigned</span>
          <div className="text-3xl font-bold text-black mt-2">{jobs.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">In Progress</span>
          <div className="text-3xl font-bold text-black mt-2">{jobs.filter(j => j.status === 'In-Progress').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Completed</span>
          <div className="text-3xl font-bold text-black mt-2">{jobs.filter(j => j.status === 'Completed').length}</div>
        </div>
    </div>

        {/* Job Cards Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Job Card</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Service Type</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Priority</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Progress</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="py-4 px-6"><span className="text-sm font-mono text-black">{job.id}</span></td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm font-semibold text-black">{job.vehicleDetails.make} {job.vehicleDetails.model}</div>
                    <div className="text-xs text-gray-600">{job.vehicleDetails.regNo}</div>
                  </div>
                </td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{job.serviceRequirements[0]}</span></td>
                <td className="py-4 px-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(job.priority)}`}>
                    {job.priority}
                  </span>
                </td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{job.status}</span></td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${job.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-black">{job.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <button onClick={() => setViewingJob(job)} className="p-1.5 hover:bg-gray-100 rounded">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Job Modal */}
      {viewingJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-black">{viewingJob.id}</h2>
                <p className="text-sm text-gray-600">Assigned on {viewingJob.assignedDate}</p>
              </div>
              <button onClick={() => setViewingJob(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Vehicle Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Vehicle Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600">Make & Model</div>
                    <div className="text-sm font-semibold text-black">{viewingJob.vehicleDetails.make} {viewingJob.vehicleDetails.model}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600">Registration</div>
                    <div className="text-sm font-semibold text-black">{viewingJob.vehicleDetails.regNo}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600">Odometer</div>
                    <div className="text-sm font-semibold text-black">{viewingJob.vehicleDetails.odometer.toLocaleString()} km</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600">Priority</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(viewingJob.priority)}`}>
                      {viewingJob.priority}
                    </span>
                  </div>
                </div>
              </div>

           {/* Customer Complaints */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer Complaints (Read-Only)</h3>
                <div className="space-y-2">
                  {viewingJob.complaints.map((complaint, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                      <span className="text-sm text-red-900">{complaint}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Requirements */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Service Requirements
                </h3>
                <div className="space-y-2">
                  {viewingJob.serviceRequirements.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="text-sm text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allocated Parts */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Allocated Parts</h3>
                <div className="space-y-2">
                  {viewingJob.parts.map((part, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{part.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600">Qty: {part.qty}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          part.status === 'Issued' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {part.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Time Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-gray-600">Expected Time</div>
                    <div className="text-sm font-semibold text-black">{viewingJob.estimatedTime}</div>
                  </div>
                  {viewingJob.actualTime && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-xs text-gray-600">Actual Time</div>
                      <div className="text-sm font-semibold text-black">{viewingJob.actualTime}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  🔒 Customer contact information and pricing details are hidden for privacy and security.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200">
              <button onClick={() => setViewingJob(null)} className="w-full px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-900">
                Close
              </button>
            </div>  

    </div>
        </div>
      )}
    </div>
  );
}