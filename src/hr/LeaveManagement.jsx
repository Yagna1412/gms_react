import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react";

/* INITIAL LEAVE DATA  */
const initialLeaves = [
  {
    id: 1,
    name: "Rajesh Kumar",
    empId: "EMP/MUM/2024/0001",
    type: "Casual Leave",
    from: "2024-12-23",
    to: "2024-12-24",
    days: 2,
    reason: "Personal work",
    status: "Pending",
  },
  {
    id: 2,
    name: "Amit Verma",
    empId: "EMP/DEL/2024/0001",
    type: "Earned Leave",
    from: "2024-12-25",
    to: "2024-12-28",
    days: 4,
    reason: "Family vacation",
    status: "Pending",
  },
];

/*  STATUS STYLES */
const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [filter, setFilter] = useState("Pending");

  /*COUNTS */
  const pendingCount = leaves.filter(l => l.status === "Pending").length;
  const approvedCount = leaves.filter(l => l.status === "Approved").length;
  const rejectedCount = leaves.filter(l => l.status === "Rejected").length;

  /*  ACTIONS */
  const approveLeave = (id) => {
    setLeaves(prev =>
      prev.map(l =>
        l.id === id ? { ...l, status: "Approved" } : l
      )
    );
  };

  const rejectLeave = (id) => {
    setLeaves(prev =>
      prev.map(l =>
        l.id === id ? { ...l, status: "Rejected" } : l
      )
    );
  };

  /* EXPORT */
  const exportReport = () => {
    const header = "Employee,Leave Type,From,To,Days,Reason,Status\n";
    const rows = leaves
      .map(
        l =>
          `${l.name},${l.type},${l.from},${l.to},${l.days},${l.reason},${l.status}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leave-report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLeaves =
    filter === "All"
      ? leaves
      : leaves.filter(l => l.status === filter);

  return (
    <div className="px-6 pt-20 pb-10">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-gray-500">
            Approve and manage employee leave requests
          </p>
        </div>

        <button
          onClick={exportReport}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* KPI CARDS  */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-5">
          <Clock className="text-yellow-600" />
          <h2 className="text-2xl font-bold mt-2">{pendingCount}</h2>
          <p className="text-gray-600">Pending</p>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <CheckCircle className="text-green-600" />
          <h2 className="text-2xl font-bold mt-2">{approvedCount}</h2>
          <p className="text-gray-600">Approved</p>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <XCircle className="text-red-600" />
          <h2 className="text-2xl font-bold mt-2">{rejectedCount}</h2>
          <p className="text-gray-600">Rejected</p>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-2xl font-bold mt-6">{leaves.length}</h2>
          <p className="text-gray-600">Total Requests</p>
        </div>
      </div>

      {/*  FILTER  */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>All</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">EMPLOYEE</th>
              <th className="px-6 py-4 text-left">LEAVE TYPE</th>
              <th className="px-6 py-4">FROM</th>
              <th className="px-6 py-4">TO</th>
              <th className="px-6 py-4">DAYS</th>
              <th className="px-6 py-4 text-left">REASON</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeaves.map(l => (
              <tr key={l.id} className="border-t">
                <td className="px-6 py-4">
                  <p className="font-semibold">{l.name}</p>
                  <p className="text-xs text-gray-500">{l.empId}</p>
                </td>

                <td className="px-6 py-4">{l.type}</td>
                <td className="px-6 py-4 text-center">{l.from}</td>
                <td className="px-6 py-4 text-center">{l.to}</td>
                <td className="px-6 py-4 text-center">{l.days}</td>
                <td className="px-6 py-4">{l.reason}</td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[l.status]}`}
                  >
                    {l.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  {l.status === "Pending" && (
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => approveLeave(l.id)}
                        className="bg-green-100 text-green-600 p-2 rounded-lg"
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        onClick={() => rejectLeave(l.id)}
                        className="bg-red-100 text-red-600 p-2 rounded-lg"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default LeaveManagement;
