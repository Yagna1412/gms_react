import { useState, useMemo } from "react";
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdFileDownload,
  MdPeople,
  MdTrendingUp,
} from "react-icons/md";

import StatsCard from "../components/StatsCard";
import EmployeeTable from "../components/EmployeeTable";
import AddEmployeeModal from "../components/AddEmployeeModal";

export default function EmployeeManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit | view
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [employees, setEmployees] = useState([
    {
      name: "Arjun Patel",
      role: "Senior Technician",
      branch: "Mumbai Central",
      email: "arjun@manthatech.com",
      phone: "+91 98765 43210",
      productivity: 94,
      status: "Active",
    },
    {
      name: "Sneha Rao",
      role: "Service Advisor",
      branch: "Mumbai Central",
      email: "sneha@manthatech.com",
      phone: "+91 98765 43211",
      productivity: 89,
      status: "Active",
    },
    {
      name: "Rahul Mehta",
      role: "Technician",
      branch: "Delhi NCR",
      email: "rahul@manthatech.com",
      phone: "+91 98765 43212",
      productivity: 96,
      status: "Active",
    },
    {
      name: "Neha Singh",
      role: "Manager",
      branch: "Bangalore Tech",
      email: "neha@manthatech.com",
      phone: "+91 98765 43213",
      productivity: 93,
      status: "Active",
    },
  ]);

  // 🔹 FILTER
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (e) =>
        (e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.branch.toLowerCase().includes(search.toLowerCase())) &&
        (filter === "All" || e.status === filter)
    );
  }, [employees, search, filter]);

  // 🔹 STATS
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === "Active").length;
  const avgProductivity =
    employees.length === 0
      ? 0
      : Math.round(
          employees.reduce((sum, e) => sum + e.productivity, 0) /
            employees.length
        );

  // 🔹 EXPORT
  const handleExport = () => {
    const headers = [
      "Name",
      "Role",
      "Branch",
      "Email",
      "Phone",
      "Productivity",
      "Status",
    ];

    const rows = filteredEmployees.map(e => [
      e.name,
      e.role,
      e.branch,
      e.email,
      e.phone,
      e.productivity + "%",
      e.status,
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employees_export.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <p className="text-gray-500">
            Create/update employees, assign to branches, and monitor productivity
          </p>
        </div>

        <button
          onClick={() => {
            setMode("add");
            setSelectedEmployee(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          <MdAdd /> Add Employee
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6">
        <StatsCard
          title="Total Employees"
          value={totalEmployees}
          icon={<MdPeople />}
          bg="bg-purple-100 text-purple-600"
        />
        <StatsCard
          title="Active Employees"
          value={activeEmployees}
          icon={<MdPeople />}
          bg="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Avg Productivity"
          value={`${avgProductivity}%`}
          icon={<MdTrendingUp />}
          bg="bg-blue-100 text-blue-600"
        />
      </div>

      {/* SEARCH / FILTER / EXPORT */}
      <div className="bg-white p-4 rounded-2xl flex justify-between border">
        <div className="relative w-96">
          <MdSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 w-full border rounded-xl"
            placeholder="Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 border px-4 py-2 rounded-xl">
            <MdFilterList />
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 border px-4 py-2 rounded-xl"
          >
            <MdFileDownload /> Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <EmployeeTable
        employees={filteredEmployees}
        onView={(emp, i) => {
          setMode("view");
          setSelectedEmployee(emp);
          setSelectedIndex(i);
          setOpenModal(true);
        }}
        onEdit={(emp, i) => {
          setMode("edit");
          setSelectedEmployee(emp);
          setSelectedIndex(i);
          setOpenModal(true);
        }}
        onDelete={(i) =>
          setEmployees(prev => prev.filter((_, index) => index !== i))
        }
      />

      {/* MODAL */}
      <AddEmployeeModal
        open={openModal}
        mode={mode}
        data={selectedEmployee}
        onClose={() => setOpenModal(false)}
        onAdd={(emp) => setEmployees(prev => [...prev, emp])}
        onUpdate={(emp) =>
          setEmployees(prev =>
            prev.map((e, i) => (i === selectedIndex ? emp : e))
          )
        }
      />
    </div>
  );
}
