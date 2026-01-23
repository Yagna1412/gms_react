import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Download,
  Calendar,
  X,
} from "lucide-react";

/* INITIAL ATTENDANCE DATA*/
const initialAttendance = [
  {
    id: 1,
    initials: "RK",
    name: "Rajesh Kumar",
    checkIn: "09:15 AM",
    checkOut: "06:10 PM",
    status: "Present",
    overtime: "00:30",
  },
  {
    id: 2,
    initials: "PS",
    name: "Priya Singh",
    checkIn: "09:45 AM",
    checkOut: "06:00 PM",
    status: "Late",
    overtime: "00:00",
  },
  {
    id: 3,
    initials: "AV",
    name: "Amit Verma",
    checkIn: "-",
    checkOut: "-",
    status: "Absent",
    overtime: "00:00",
  },
  {
    id: 4,
    initials: "ND",
    name: "Neha Desai",
    checkIn: "-",
    checkOut: "-",
    status: "Present",
    overtime: "00:00",
  },
  {
    id: 5,
    initials: "VM",
    name: "Vikram Malhotra",
    checkIn: "-",
    checkOut: "-",
    status: "Present",
    overtime: "00:30",
   
  },
];

/*STATUS STYLES*/
const statusStyle = {
  Present: "bg-green-100 text-green-700",
  Late: "bg-yellow-100 text-yellow-700",
  Absent: "bg-red-100 text-red-700",
};

/*VIEW MODAL*/
const ViewModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-xl p-6 relative">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X />
        </button>

        <h2 className="text-lg font-bold mb-4">Attendance Details</h2>

        <div className="space-y-2 text-sm">
          <p><b>Name:</b> {employee.name}</p>
          <p><b>Check In:</b> {employee.checkIn}</p>
          <p><b>Check Out:</b> {employee.checkOut}</p>
          <p><b>Status:</b> {employee.status}</p>
          <p><b>Overtime:</b> {employee.overtime}</p>
        </div>
      </div>
    </div>
  );
};

/*EDIT MODAL*/
const EditModal = ({ employee, onSave, onClose }) => {
  const [form, setForm] = useState({ ...employee });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl p-6 relative">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X />
        </button>

        <h2 className="text-lg font-bold mb-4">Edit Attendance</h2>

        <div className="space-y-3">
          <input
            className="border rounded-lg p-2 w-full"
            value={form.checkIn}
            onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            placeholder="Check In"
          />
          <input
            className="border rounded-lg p-2 w-full"
            value={form.checkOut}
            onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
            placeholder="Check Out"
          />
          <select
            className="border rounded-lg p-2 w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Present</option>
            <option>Late</option>
            <option>Absent</option>
          </select>
          <input
            className="border rounded-lg p-2 w-full"
            value={form.overtime}
            onChange={(e) => setForm({ ...form, overtime: e.target.value })}
            placeholder="Overtime"
          />
        </div>

        <button
          className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg"
          onClick={() => {
            onSave(form);
            onClose();
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

/*   MAIN ATTENDANCE MANAGEMENT*/
const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [viewEmp, setViewEmp] = useState(null);
  const [editEmp, setEditEmp] = useState(null);

  const total = attendance.length;
  const present = attendance.filter((e) => e.status === "Present").length;
  const absent = attendance.filter((e) => e.status === "Absent").length;
  const late = attendance.filter((e) => e.status === "Late").length;
  const attendancePercent = total ? Math.round((present / total) * 100) : 0;

  /* EXPORT CSV */
  const exportReport = () => {
    const rows = [
      ["Name", "Check In", "Check Out", "Status", "Overtime"],
      ...attendance.map((e) => [
        e.name,
        e.checkIn,
        e.checkOut,
        e.status,
        e.overtime,
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-6 pt-20 pb-10">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-gray-500">Track and manage employee attendance</p>
        </div>

        <button
          onClick={exportReport}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat title="Attendance %" value={`${attendancePercent}%`} sub="Today" />
        <Stat title="Present" value={present} sub="Employees" icon={<CheckCircle className="text-green-500" />} />
        <Stat title="Absent" value={absent} sub="Employees" icon={<XCircle className="text-red-500" />} />
        <Stat title="Late Arrivals" value={late} sub="Today" icon={<Clock className="text-orange-500" />} />
      </div>

      {/* DATE */}
      <div className="bg-white border rounded-xl p-4 mb-6 flex items-center gap-3">
        <Calendar className="text-gray-400" />
        <input type="date" className="border rounded-lg p-2" />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">EMPLOYEE</th>
              <th className="px-6 py-4 text-left">CHECK IN</th>
              <th className="px-6 py-4 text-left">CHECK OUT</th>
              <th className="px-6 py-4 text-left">STATUS</th>
              <th className="px-6 py-4 text-left">OVERTIME</th>
              <th className="px-6 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="px-6 py-4 flex gap-3 items-center">
                  <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {emp.initials}
                  </div>
                  {emp.name}
                </td>
                <td className="px-6 py-4">{emp.checkIn}</td>
                <td className="px-6 py-4">{emp.checkOut}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[emp.status]}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4">{emp.overtime}</td>
                <td className="px-6 py-4 flex justify-end gap-4">
                  <Eye className="cursor-pointer" onClick={() => setViewEmp(emp)} />
                  <Edit className="cursor-pointer" onClick={() => setEditEmp(emp)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {viewEmp && <ViewModal employee={viewEmp} onClose={() => setViewEmp(null)} />}
      {editEmp && (
        <EditModal
          employee={editEmp}
          onClose={() => setEditEmp(null)}
          onSave={(updated) =>
            setAttendance((prev) =>
              prev.map((e) => (e.id === updated.id ? updated : e))
            )
          }
        />
      )}
    </div>
  );
};

/*   SMALL STAT CARD */
const Stat = ({ title, value, sub, icon }) => (
  <div className="bg-white border rounded-xl p-5 flex justify-between">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      <p className="text-sm text-gray-500">{sub}</p>
    </div>
    {icon}
  </div>
);

export default AttendanceManagement;
