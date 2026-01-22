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
  // SAFE navigation handler
  const goToEmployees = () => {
    if (typeof onNavigate === "function") {
      onNavigate("employees");
    }
  };
    const goToAttendance = () => {
      if (typeof onNavigate == "function") {
        onNavigate("attendance");
      }
    };

  return (
    <div className="px-6 pt-20 pb-10">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">HR Dashboard</h2>
        <p className="text-gray-600">
          Welcome back! Here's your HR overview for today
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Total Employees (CLICKABLE) */}
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
          <div className="flex jsutify-between">
            <div className="bg-blue-100 p-2 rounded-lg">
            <CalendarCheck className="text-green-600" />
            </div>
            <span className="text-gray-400"></span>
            </div>

           <h1 className="mt-4 text-2xl font-bold">0.0%</h1>
           <p className="text-gray-600">Today's Attendance</p>

          <div className="mt-2 flex gap-2 text-sm">
            <span className="text-green-600">0 Present</span>
            <span className="text-red-600">0 Absent</span>
            </div>                
        </div>

        {/* Leave Approvals */}
        <div className="bg-white rounded-2xl border p-6">
          <CalendarDays className="text-purple-600" />
          <h1 className="mt-4 text-2xl font-bold">0</h1>
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
        <div className="bg-white rounded-2xl border p-6">
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

        {/* Relieving Employee */}
        <div className="bg-white rounded-2xl border p-6">
          <PersonStanding className="text-black" />
          <h1 className="mt-4 text-2xl font-bold">0</h1>
          <p className="text-gray-600">Relieving Employee</p>
          <span className="text-blue-600 text-sm font-semibold">
            No Records
          </span>
        </div>

      </div>
             {/*stats cards*/}
 <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-4">
    {/*Quick Actions*/}
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-4 hover:shadow-md transition">
      <div className ="flex justify-between">
        <h1 className ="text-xl font-semibold text-black mb-4">Quick Actions</h1>
          <div className ="w-20 h-2 bg-white-100 rounded-2xl flex items-center justify-center">
    
          </div>
      </div>
       {/*Quick Action Cards*/}
       <div className = "grid grid-cols-2 s:grid-cols-4 gap-4 mt-4">
        <div className ="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-4 hover:shadow-sm transition">
          <div className ="flex justify-corner">  
            <h1 className = "text-md font-semibold text-black mb-1">Process Payroll</h1>
            <div className ="w-8 h-2 bg-white-100 rounded-xl flex items-corner justify-corner">
            </div>
             
          </div>
        </div> 
        <div className ="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-4 hover:shadow-sm transition">
          <div className ="flex justify-between">
            <h1 className = "text-md font-semibold text-black mb-1">Approve Leaves</h1>
            <div className ="w-8 h-2 bg-white-100 rounded-xl flex items-center justify-center">
          </div>
        </div>
       </div>
       <div className ="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-4 hover:shadow-sm tarnsition">
        <div className ="flex justify-between">
          <h1 className = "text-md font-semibold text-black mb-1">Create Training</h1>
          <div className ="w-8 h-2 bg-white-100 rounded-xl flex items-center justify center">

          </div>
        </div>
       </div>
       <div className ="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-4 hover:shadow-sm transition">
        <div className ="flex justify-between">
          <h1 className ="text-md font-semibold text-black mb-1">Add Employee</h1>
          <div className ="w-8 h-2 bg-white-100 rounded-xl flex items-center justify-center">

          </div>
        </div>
       </div>
      
       </div>
    </div>
    

      {/*Pending Leave requests*/}
      <div className ="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-4 hover:shadow-md transition">
        <div className ="flex justify-between">
          <h1 className ="text-xl font-semibold text-black mb-4">Pending Leave Requests</h1>
            <div className ="w-20 h-2 bg-white-100 rounded-2xl flex items-center justify-center">

            </div>
            <span className ="text-blue-600">View All</span>
        </div>
         {/*Pending Leaves*/}
         <div className = "grid grid-cols-1 s:grid-cols-2 gap-4 mt-4"></div>
         <div className ="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-4 hover:shadow-md transition">
            <div className ="flex justify-between">
               <span className="text-black-600 fomt-semibold">No records</span>
              <div className ="w-10 h-4 bg-white-100 rounder-xl flex items-center justify-center"> 
                
              </div>  
            </div>   
         </div>
         <div className = "grid grid-cols-1 s:grid-cols-1 gap-4 mt-4"></div>
          <div className ="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-4 hover:shadow-md transition">
            <div className ="flex justify-between">
              <span className="text-black-600 fomt-semibold">No records</span>
              <div className ="w-10 h-4 bg-white-100 rounded-xl flex items-center justify-center">
                 
              </div>
            </div>
          </div>
      </div> 
    </div> 

      {/* HIGH PRIORITY ALERT */}
      <div className="mt-10 bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-4">
        <AlertTriangle className="text-red-600" />
        <div>
          <h3 className="font-bold text-black">
            High Priority Grievances Require Attention
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            1 high severity grievance(s) need immediate action to meet SLA requirements.
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
