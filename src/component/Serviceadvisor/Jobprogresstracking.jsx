import React from 'react';
import { useServiceAdvisor } from '../context/Serviceadvisorcontext';
import {  Eye } from 'lucide-react';

export default function JobProgressTracking() {
  const { jobCards } = useServiceAdvisor();
  const activeJobs = jobCards.filter(jc => jc.status === 'In-Progress' || jc.status === 'Quality Check');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-black mb-2">Job Progress Tracking</h1>
        <p className="text-gray-600 text-sm">Monitor real-time job status and updates</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Active Jobs</span>
          <div className="text-3xl font-bold text-black mt-2">{activeJobs.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">In Progress</span>
          <div className="text-3xl font-bold text-black mt-2">{jobCards.filter(j => j.status === 'In-Progress').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Quality Check</span>
          <div className="text-3xl font-bold text-black mt-2">{jobCards.filter(j => j.status === 'Quality Check').length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Job Card</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Technician</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Progress</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activeJobs.map((jc) => (
              <tr key={jc.id} className="hover:bg-gray-50">
                <td className="py-4 px-6"><span className="text-sm font-mono text-black">{jc.id}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{jc.customerName}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{jc.technician}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{jc.status}</span></td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${jc.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-black">{jc.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <button className="p-1.5 hover:bg-gray-100 rounded"><Eye className="w-4 h-4 text-gray-600" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
