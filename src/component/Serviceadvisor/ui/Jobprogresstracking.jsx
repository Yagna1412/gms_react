import React from "react";
import { Eye, Trash2, X } from "lucide-react";
import { useJobProgressTracking } from "../useJobProgressTracking";

export default function JobProgressTracking() {
  const {
    activeJobs,
    viewJob,
    inProgressCount,
    qualityCheckCount,
    openJob,
    closeJob,
    handleDelete
  } = useJobProgressTracking();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
    
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-black">
          Job Progress Tracking
        </h1>
        <p className="text-sm text-gray-600">
          Monitor real-time job status and updates
        </p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Stat label="Active Jobs" value={activeJobs.length} />
        <Stat
          label="In Progress"
          value={inProgressCount}
        />
        <Stat
          label="Quality Check"
          value={qualityCheckCount}
        />
      </div>

     
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Job Card</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Technician</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Progress</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {activeJobs.map((jc) => (
              <tr key={jc.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-blue-600">
                  {jc.id}
                </td>
                <td className="px-4 py-3">{jc.customerName}</td>
                <td className="px-4 py-3">{jc.technician || "-"}</td>
                <td className="px-4 py-3">{jc.status}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${jc.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold">
                      {jc.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <IconBtn
                      icon={<Eye className="w-4 h-4" />}
                      onClick={() => openJob(jc)}
                    />
                    <IconBtn
                      icon={<Trash2 className="w-4 h-4 text-red-500" />}
                      onClick={() => handleDelete(jc.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {activeJobs.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-gray-500"
                >
                  No active jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewJob && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={closeJob}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>

            <h2 className="font-bold text-lg mb-4">Job Details</h2>

            <Detail label="Job ID" value={viewJob.id} />
            <Detail label="Customer" value={viewJob.customerName} />
            <Detail label="Vehicle" value={viewJob.vehicle} />
            <Detail label="Technician" value={viewJob.technician || "-"} />
            <Detail label="Status" value={viewJob.status} />
            <Detail label="Progress" value={`${viewJob.progress}%`} />

            <button
              onClick={closeJob}
              className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



const Stat = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl border">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const IconBtn = ({ icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="p-2 rounded hover:bg-gray-100"
  >
    {icon}
  </button>
);

const Detail = ({ label, value }) => (
  <p className="text-sm mb-2">
    <b>{label}:</b> {value}
  </p>
);
