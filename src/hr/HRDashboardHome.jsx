import {
  Users,
  CalendarCheck,
  CalendarDays,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  GraduationCap,
  PersonStanding,
} from "lucide-react";

const HRDashboardHome = ({ onNavigate }) => {
  /* SAFE NAVIGATION HANDLERS */

  const goToEmployees = () => {
    if (typeof onNavigate === "function") {
      onNavigate("employees");
    }
  };

  const goToAttendance = () => {
    if (typeof onNavigate === "function") {
      onNavigate("attendance");
    }
  };

  const goToLeaveManagement = () => {
    if (typeof onNavigate === "function") {
      onNavigate("leaves");
    }
  };

  const goToPerformance = () => {
    if (typeof onNavigate === "function") {
      onNavigate("performance");
    }
  };

  return (
    <div className="px-6 pt-20 pb-10">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">HR Dashboard</h2>
        <p className="text-gray-600">
          Welcome back! Here's your HR overview for today
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Total Employees */}
        <div
          onClick={goToEmployees}
          className="bg-white rounded-2xl border p-6 cursor-pointer hover:shadow-md transition"
        >
          <div className="flex justify-between">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="text-blue-600" />
            </div>
            <span className="text-gray-400">➜</span>
          </div>

          <h1 className="mt-4 text-2xl font-bold">5</h1>
          <p className="text-gray-600">Total Employees</p>

          <div className="mt-2 flex gap-2 text-sm">
            <span className="text-green-600 font-semibold">3 Active</span>
            <span className="text-yellow-600 font-semibold">1 Probation</span>
          </div>
        </div>

        {/* Attendance */}
        <div
          onClick={goToAttendance}
          className="bg-white rounded-2xl border p-6 cursor-pointer hover:shadow-md transition"
        >
          <div className="flex justify-between">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CalendarCheck className="text-green-600" />
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold">60%</h1>
          <p className="text-gray-600">Today's Attendance</p>

          <div className="mt-2 flex gap-2 text-sm">
            <span className="text-green-600">3 Present</span>
            <span className="text-red-600">1 Absent</span>
          </div>
        </div>

        {/* Leave Approvals */}
        <div
          onClick={goToLeaveManagement}
          className="bg-white rounded-2xl border p-6 cursor-pointer hover:shadow-md transition"
        >
          <CalendarDays className="text-purple-600" />
          <h1 className="mt-4 text-2xl font-bold">2</h1>
          <p className="text-gray-600">Pending Leave Approvals</p>
          <div className="text-sm mt-2">
            <span className="text-purple-600">0 Approved</span>{" "}
            <span className="text-orange-600">Action Needed</span>
          </div>
        </div>

        {/* Grievances */}
        <div className="bg-white rounded-2xl border p-6">
          <AlertTriangle className="text-red-600" />
          <h1 className="mt-4 text-2xl font-bold">0</h1>
          <p className="text-gray-600">Pending Grievances</p>
          <div className="text-sm mt-2">
            <span className="text-red-600">0 High Severity</span>{" "}
            <span className="text-orange-600">Urgent</span>
          </div>
        </div>

        {/* Payroll */}
        <div className="bg-white rounded-2xl border p-6">
          <IndianRupee className="text-green-600" />
          <h1 className="mt-4 text-2xl font-bold">0</h1>
          <p className="text-gray-600">December 2024</p>
          <span className="text-orange-600 text-sm font-semibold">Pending</span>
        </div>

        {/* Performance */}
        <div
          onClick={goToPerformance}
          className="bg-white rounded-2xl border p-6 cursor-pointer hover:shadow-md transition"
        >
          <TrendingUp className="text-blue-600" />
          <h1 className="mt-4 text-2xl font-bold">0</h1>
          <p className="text-gray-600">Pending Reviews</p>
          <span className="text-green-600 text-sm font-semibold">
            Completed
          </span>
        </div>

        {/* Training */}
        <div className="bg-white rounded-2xl border p-6">
          <GraduationCap className="text-orange-600" />
          <h1 className="mt-4 text-2xl font-bold">0</h1>
          <p className="text-gray-600">Trainees</p>
          <span className="text-yellow-600 text-sm font-semibold">
            No Records
          </span>
        </div>

        {/* Relieving */}
        <div className="bg-white rounded-2xl border p-6">
          <PersonStanding className="text-black" />
          <h1 className="mt-4 text-2xl font-bold">0</h1>
          <p className="text-gray-600">Relieving Employee</p>
          <span className="text-blue-600 text-sm font-semibold">
            No Records
          </span>
        </div>

      </div>

      {/* QUICK ACTIONS + PENDING LEAVES */}
      <div className="grid grid-cols-2 gap-6 mt-4">

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border p-4 hover:shadow-md transition">
          <h1 className="text-xl font-semibold mb-4">Quick Actions</h1>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-xl p-4">Process Payroll</div>

            <div
              onClick={goToLeaveManagement}
              className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50"
            >
              Approve Leaves
            </div>

            <div className="border rounded-xl p-4">Create Training</div>

            <div
              onClick={goToEmployees}
              className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50"
            >
              Add Employee
            </div>
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="bg-white rounded-2xl border p-4 hover:shadow-md transition">
          <div className="flex justify-between mb-4">
            <h1 className="text-xl font-semibold">Pending Leave Requests</h1>
            <span
              onClick={goToLeaveManagement}
              className="text-blue-600 cursor-pointer"
            >
              View All
            </span>
          </div>

          <div className="border rounded-xl p-4 text-gray-600">
            No records
          </div>
        </div>

      </div>

      {/* HIGH PRIORITY ALERT */}
      <div className="mt-10 bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-4">
        <AlertTriangle className="text-red-600" />
        <div>
          <h3 className="font-bold">
            High Priority Grievances Require Attention
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            1 high severity grievance(s) need immediate action.
          </p>
          <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">
            Review Grievances
          </button>
        </div>
      </div>

    </div>
  );
};

export default HRDashboardHome;
