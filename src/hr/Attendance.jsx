import { useState } from "react";
import {
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white border rounded-xl p-5 flex justify-between items-center">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{value}</h2>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
    {icon}
  </div>
);

const Attendance = () => {
  const [date, setDate] = useState("2026-01-20");

  return (
    <div className="px-6 pt-20 pb-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-gray-500">
            Track and manage employee attendance
          </p>
        </div>

        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Attendance %" value="0.0%" subtitle="Today" icon={<CheckCircle className="text-green-600" />} />
        <StatCard title="Present" value="0" subtitle="Employees" icon={<CheckCircle className="text-green-600" />} />
        <StatCard title="Absent" value="0" subtitle="Employees" icon={<XCircle className="text-red-600" />} />
        <StatCard title="Late Arrivals" value="0" subtitle="Today" icon={<Clock className="text-orange-600" />} />
      </div>

      <div className="bg-white border rounded-xl p-4 mb-6 flex items-center gap-4">
        <Calendar className="text-gray-400" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm"
        />
      </div>

      <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
        No attendance records available for selected date
      </div>
    </div>
  );
};

export default Attendance;
