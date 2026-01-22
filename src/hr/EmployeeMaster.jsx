import { useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Power,
  X,
} from "lucide-react";

/* INITIAL EMPLOYEE DATA
    */
const initialEmployees = [
  {
    initials: "RK",
    name: "Rajesh Kumar",
    id: "EMP/MUM/2024/0001",
    role: "Senior Mechanic",
    dept: "Service",
    email: "rajesh.kumar@garageos.com",
    phone: "+91 98765 43210",
    branch: "Mumbai Main",
    status: "Active",
  },
  {
    initials: "PS",
    name: "Priya Singh",
    id: "EMP/MUM/2024/0002",
    role: "Service Advisor",
    dept: "Customer Service",
    email: "priya.singh@garageos.com",
    phone: "+91 98765 43211",
    branch: "Mumbai Main",
    status: "Active",
  },
  {
    initials: "AV",
    name: "Amit Verma",
    id: "EMP/DEL/2024/0001",
    role: "Parts Manager",
    dept: "Inventory",
    email: "amit.verma@garageos.com",
    phone: "+91 98765 43212",
    branch: "Delhi Branch",
    status: "Active",
  },
  {
    initials: "ND",
    name: "Neha Desai",
    id: "EMP/MUM/2024/0003",
    role: "Receptionist",
    dept: "Administration",
    email: "neha.desai@garageos.com",
    phone: "+91 98765 43213",
    branch: "Mumbai Main",
    status: "On Probation",
  },
  {
    initials: "VM",
    name: "Vikram Malhotra",
    id: "EMP/BLR/2023/0015",
    role: "Technician",
    dept: "Service",
    email: "vikram.malhotra@garageos.com",
    phone: "+91 98765 43214",
    branch: "Bangalore Branch",
    status: "Notice Period",
  },
];

/* ============================================================
   STATUS COLORS
   ============================================================ */
const statusStyles = {
  Active: "bg-green-100 text-green-700",
  "On Probation": "bg-yellow-100 text-yellow-700",
  "Notice Period": "bg-orange-100 text-orange-700",
  Inactive: "bg-gray-200 text-gray-700",
};

/* ============================================================
   STAT CARD COMPONENT
   ============================================================ */
const StatCard = ({ title, value, subtitle, icon, color }) => {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    orange: "text-orange-600",
  };

  return (
    <div className="bg-white border rounded-xl p-5 flex justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-black mt-1">{value}</h2>
        <p className="text-sm text-green-600 mt-1">{subtitle}</p>
      </div>
      <div className={colorMap[color]}>{icon}</div>
    </div>
  );
};

/* ============================================================
   VIEW EMPLOYEE MODAL
   ============================================================ */
const ViewEmployeeModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-xl p-6 relative">
        <button className="absolute right-4 top-4" onClick={onClose}>
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Employee Details</h2>

        <div className="space-y-2">
          <p><b>Name:</b> {employee.name}</p>
          <p><b>Email:</b> {employee.email}</p>
          <p><b>Phone:</b> {employee.phone}</p>
          <p><b>Role:</b> {employee.role}</p>
          <p><b>Department:</b> {employee.dept}</p>
          <p><b>Status:</b> {employee.status}</p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   ADD + EDIT EMPLOYEE MODAL (FULL 6 STEPS)
   ============================================================ */
const AddEmployeeModal = ({ onClose, onSubmit, editEmployee }) => {
  const isEditing = !!editEmployee;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(
    editEmployee || {
      fullName: "",
      email: "",
      phone: "",
      emergency: "",
      address: "",
      designation: "",
      department: "",
      branch: "",
      reportingTo: "",
      joiningDate: "",
      salary: "",
      aadhar: "",
      pan: "",
      aadharFile: null,
      panFile: null,
      bankAccount: "",
      ifsc: "",
      chequeFile: null,
      educationalCertificates: null,
      experienceLetters: null,
    }
  );

  const steps = [
    "Basic Info",
    "Employment",
    "Documents",
    "Bank Details",
    "Additional",
    "Review",
  ];

  const nextStep = () => setStep((p) => Math.min(p + 1, 6));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  const handleSubmit = () => {
    onSubmit(formData, isEditing);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] rounded-2xl p-8 relative">

        {/* Header */}
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {isEditing ? "Edit Employee" : "Add New Employee"}
            </h2>
            <p className="text-gray-500 text-sm">
              Complete all steps to onboard employee
            </p>
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-6 mb-8">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${step === i + 1 ? "bg-lime-400" : "bg-gray-200 text-gray-500"}`}
              >
                {i + 1}
              </div>
              <span className={step === i + 1 ? "font-medium" : "text-gray-400"}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ============================================================
            STEP 1 – BASIC INFO
           ============================================================ */}
        {step === 1 && (
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-semibold mb-4">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="border p-3 rounded-lg"
                placeholder="Full Name*"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              <input
                className="border p-3 rounded-lg"
                placeholder="Email*"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                className="border p-3 rounded-lg"
                placeholder="Phone Number*"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                className="border p-3 rounded-lg"
                placeholder="Emergency Contact"
                value={formData.emergency}
                onChange={(e) =>
                  setFormData({ ...formData, emergency: e.target.value })
                }
              />
            </div>

            <textarea
              className="border p-3 rounded-lg w-full mt-4"
              placeholder="Complete Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
        )}

        {/* ============================================================
            STEP 2 – EMPLOYMENT
           ============================================================ */}
        {step === 2 && (
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-semibold mb-6">Employment Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <select
                className="border p-3 rounded-lg"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
              >
                <option value="">Select Designation*</option>
                <option>Senior Mechanic</option>
                <option>Service Advisor</option>
                <option>Technician</option>
                <option>Parts Manager</option>
              </select>

              <select
                className="border p-3 rounded-lg"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                <option value="">Select Department*</option>
                <option>Service</option>
                <option>Customer Service</option>
                <option>Inventory</option>
                <option>Administration</option>
              </select>

              <select
                className="border p-3 rounded-lg"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
              >
                <option value="">Select Branch*</option>
                <option>Mumbai Main</option>
                <option>Delhi Branch</option>
                <option>Bangalore Branch</option>
              </select>

              <input
                className="border p-3 rounded-lg"
                placeholder="Reporting to (e.g., Amit Sharma)"
                value={formData.reportingTo}
                onChange={(e) =>
                  setFormData({ ...formData, reportingTo: e.target.value })
                }
              />

              <input
                type="date"
                className="border p-3 rounded-lg"
                value={formData.joiningDate}
                onChange={(e) =>
                  setFormData({ ...formData, joiningDate: e.target.value })
                }
              />

              <input
                className="border p-3 rounded-lg"
                placeholder="Monthly Salary (₹)"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 3 – DOCUMENT UPLOAD
           ============================================================ */}
        {step === 3 && (
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-4">Document Upload</h3>

            <label className="text-sm font-medium">AADHAAR NUMBER*</label>
            <input
              className="border p-3 rounded-lg w-full mt-1 mb-1"
              placeholder="XXXX-XXXX-XXXX"
              value={formData.aadhar}
              onChange={(e) =>
                setFormData({ ...formData, aadhar: e.target.value })
              }
            />
            <p className="text-xs text-gray-500 mb-4">
              Encrypted and stored securely
            </p>

            <label className="text-sm font-medium">PAN NUMBER*</label>
            <input
              className="border p-3 rounded-lg w-full mt-1 mb-1"
              placeholder="ABCDE1234F"
              value={formData.pan}
              onChange={(e) =>
                setFormData({ ...formData, pan: e.target.value })
              }
            />
            <p className="text-xs text-gray-500 mb-4">
              Encrypted and stored securely
            </p>

            <div className="grid grid-cols-2 gap-6">
              {/* Aadhar upload */}
              <div>
                <p className="text-sm font-medium mb-2">Aadhar Card Upload*</p>

                <label className="border-2 border-dashed rounded-xl w-full h-40 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="application/pdf,image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aadharFile: e.target.files[0],
                      })
                    }
                  />
                  <span className="text-3xl mb-2">⬆️</span>
                  <span className="text-sm">Click to upload or drag & drop</span>
                  <span className="text-xs text-gray-500">
                    PDF or Image (Max 2MB)
                  </span>
                </label>
              </div>

              {/* PAN upload */}
              <div>
                <p className="text-sm font-medium mb-2">PAN Card Upload*</p>

                <label className="border-2 border-dashed rounded-xl w-full h-40 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="application/pdf,image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, panFile: e.target.files[0] })
                    }
                  />
                  <span className="text-3xl mb-2">⬆️</span>
                  <span className="text-sm">Click to upload or drag & drop</span>
                  <span className="text-xs text-gray-500">
                    PDF or Image (Max 2MB)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 4 – BANK DETAILS
           ============================================================ */}
        {step === 4 && (
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-6">Bank Details</h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">
                  BANK ACCOUNT NUMBER
                </label>
                <input
                  type="text"
                  className="border p-3 rounded-lg w-full mt-1"
                  placeholder="e.g., 123456789"
                  value={formData.bankAccount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccount: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">IFSC CODE</label>
                <input
                  type="text"
                  className="border p-3 rounded-lg w-full mt-1"
                  placeholder="e.g., SBIN0001234"
                  value={formData.ifsc}
                  onChange={(e) =>
                    setFormData({ ...formData, ifsc: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="font-medium text-blue-700">
                📄 Cancelled Cheque Upload
              </p>

              <label className="mt-4 border-2 border-dashed border-blue-300 bg-white rounded-xl w-full h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chequeFile: e.target.files[0],
                    })
                  }
                />
                <span className="text-3xl mb-2">⬆️</span>
                <span className="font-medium">Upload Cancelled Cheque</span>
                <span className="text-xs text-gray-500">(Max 2MB)</span>
              </label>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 5 – ADDITIONAL DOCUMENTS
           ============================================================ */}
        {step === 5 && (
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-6">
              Additional Documents
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium">Educational Certificates</p>

                <label className="mt-3 border-2 border-dashed rounded-xl w-full h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                  <input
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        educationalCertificates: e.target.files[0],
                      })
                    }
                  />
                  <span className="text-3xl text-gray-400 mb-2">⬆️</span>
                  <span className="text-gray-700 font-medium">
                    Upload Certificates
                  </span>
                  <span className="text-xs text-gray-500">(PDF Max 5MB)</span>
                </label>
              </div>

              <div>
                <p className="text-sm font-medium">Experience Letters</p>

                <label className="mt-3 border-2 border-dashed rounded-xl w-full h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                  <input
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experienceLetters: e.target.files[0],
                      })
                    }
                  />
                  <span className="text-3xl text-gray-400 mb-2">⬆️</span>
                  <span className="text-gray-700 font-medium">
                    Upload Letters
                  </span>
                  <span className="text-xs text-gray-500">(PDF Max 5MB)</span>
                </label>
              </div>
            </div>

            <div className="mt-8 bg-white border p-4 rounded-xl text-sm text-gray-600">
              All documents are encrypted and stored safely.
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 6 – REVIEW & SUBMIT
           ============================================================ */}
        {step === 6 && (
          <div className="bg-gray-50 p-8 rounded-xl">
            <h3 className="font-semibold text-lg mb-6">Review & Confirm</h3>

            <div className="bg-white rounded-xl p-6 border">
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-sm text-gray-500">Employee Name</p>
                  <p className="text-black font-semibold">
                    {formData.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-black font-semibold">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-black font-semibold">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="text-black font-semibold">
                    {formData.designation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-black font-semibold">
                    {formData.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Branch</p>
                  <p className="text-black font-semibold">{formData.branch}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between mt-6">
          <button
            className="px-5 py-2 border rounded-lg text-gray-600"
            onClick={prevStep}
            disabled={step === 1}
          >
            ← Previous
          </button>

          {step === 6 ? (
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
              onClick={handleSubmit}
            >
              ✔ Create Employee
            </button>
          ) : (
            <button
              className="px-6 py-2 bg-black text-white rounded-lg"
              onClick={nextStep}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN EMPLOYEE MASTER PAGE
   ============================================================ */
const EmployeeMaster = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);

  /* -------- Add or Edit -------- */
  const handleSubmit = (data, isEditing) => {
    if (isEditing) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.email === data.email
            ? { ...emp, ...data, name: data.fullName }
            : emp
        )
      );
      return;
    }

    const newEmployee = {
      initials: data.fullName
        .split(" ")
        .map((x) => x[0])
        .join("")
        .toUpperCase(),
      name: data.fullName,
      id: `EMP/${data.branch.slice(0, 3).toUpperCase()}/2025/${String(
        employees.length + 1
      ).padStart(4, "0")}`,
      role: data.designation,
      dept: data.department,
      email: data.email,
      phone: data.phone,
      branch: data.branch,
      status: "Active",
    };

    setEmployees((prev) => [...prev, newEmployee]);
  };

  /* -------- Delete -------- */
  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  /* -------- Change Status -------- */
  const changeStatus = (id) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status:
                emp.status === "Active"
                  ? "On Probation"
                  : emp.status === "On Probation"
                  ? "Notice Period"
                  : emp.status === "Notice Period"
                  ? "Inactive"
                  : "Active",
            }
          : emp
      )
    );
  };

  return (
    <div className="px-6 pt-20 pb-10">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employee Master</h1>
          <p className="text-gray-500">Manage employee lifecycle and records</p>
        </div>

        <button
          onClick={() => {
            setEditingEmployee(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
        >
          + Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Employees"
          value={employees.length}
          subtitle="Active workforce"
          icon={<Users />}
          color="blue"
        />
        <StatCard
          title="Active"
          value={employees.filter((e) => e.status === "Active").length}
          subtitle="Working Staff"
          icon={<CheckCircle />}
          color="green"
        />
        <StatCard
          title="On Probation"
          value={employees.filter((e) => e.status === "On Probation").length}
          subtitle="New Joiners"
          icon={<Clock />}
          color="yellow"
        />
        <StatCard
          title="Notice Period"
          value={employees.filter((e) => e.status === "Notice Period").length}
          subtitle="Leaving Soon"
          icon={<AlertCircle />}
          color="orange"
        />
      </div>

      {/* Search */}
      <div className="bg-white border rounded-xl p-4 flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search by name, ID, email..."
          />
        </div>

        <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
          <Filter size={16} /> All Status
        </button>

        <button className="border px-4 py-2 rounded-lg flex items-center gap-2">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">EMPLOYEE</th>
              <th className="px-6 py-4 text-left">ROLE & DEPT</th>
              <th className="px-6 py-4 text-left">CONTACT</th>
              <th className="px-6 py-4 text-left">BRANCH</th>
              <th className="px-6 py-4 text-left">STATUS</th>
              <th className="px-6 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, i) => (
              <tr key={i} className="border-t">
                <td className="px-6 py-4 flex gap-3">
                  <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {emp.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{emp.name}</p>
                    <p className="text-xs text-gray-500">ID: {emp.id}</p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="font-semibold">{emp.role}</p>
                  <p className="text-xs text-gray-500">{emp.dept}</p>
                </td>

                <td className="px-6 py-4">
                  <p>{emp.email}</p>
                  <p>{emp.phone}</p>
                </td>

                <td className="px-6 py-4">{emp.branch}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[emp.status]}`}
                  >
                    {emp.status}
                  </span>
                </td>

                <td className="px-6 py-4 flex justify-end gap-4 text-gray-600">
                  <Eye
                    size={18}
                    onClick={() => setViewEmployee(emp)}
                    className="cursor-pointer hover:text-black"
                  />
                  <Edit
                    size={18}
                    onClick={() => {
                      setEditingEmployee(emp);
                      setShowModal(true);
                    }}
                    className="cursor-pointer hover:text-blue-600"
                  />
                  <Power
                    size={18}
                    onClick={() => changeStatus(emp.id)}
                    className="cursor-pointer hover:text-yellow-600"
                  />
                  <X
                    size={18}
                    onClick={() => deleteEmployee(emp.id)}
                    className="cursor-pointer text-red-500 hover:text-red-700"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {showModal && (
        <AddEmployeeModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          editEmployee={editingEmployee}
        />
      )}

      {viewEmployee && (
        <ViewEmployeeModal
          employee={viewEmployee}
          onClose={() => setViewEmployee(null)}
        />
      )}
    </div>
  );
};

export default EmployeeMaster;
