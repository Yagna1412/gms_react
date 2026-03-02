import { useState, useMemo } from "react";
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdFileDownload,
  MdLocationOn,
  MdPeople,
  MdTrendingUp,
} from "react-icons/md";

import StatsCard from "../components/StatsCard";
import BranchTable from "../components/BranchTable";
import AddBranchModal from "../components/AddBranchModal";

export default function BranchManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [openModal, setOpenModal] = useState(false);

  // ✅ NEW STATE
  const [mode, setMode] = useState("add"); // add | edit | view
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // 🔹 MAIN DATA SOURCE
  const [branches, setBranches] = useState([
    {
      name: "Mumbai Central",
      supervisor: "Rajesh Kumar",
      location: "Mumbai, Maharashtra",
      employees: 24,
      revenue: "₹4.5L",
      performance: 92,
      status: "Active",
    },
    {
      name: "Delhi NCR",
      supervisor: "Amit Sharma",
      location: "Delhi, NCR",
      employees: 18,
      revenue: "₹3.8L",
      performance: 88,
      status: "Active",
    },
    {
      name: "Bangalore Tech",
      supervisor: "Priya Singh",
      location: "Bangalore, Karnataka",
      employees: 31,
      revenue: "₹5.2L",
      performance: 95,
      status: "Active",
    },
    {
      name: "Chennai Marina",
      supervisor: "Suresh Reddy",
      location: "Chennai, Tamil Nadu",
      employees: 15,
      revenue: "₹2.9L",
      performance: 85,
      status: "Active",
    },
  ]);

  // 🔹 FILTERED DATA
  const filteredBranches = useMemo(() => {
    return branches.filter(
      (b) =>
        (b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.location.toLowerCase().includes(search.toLowerCase())) &&
        (filter === "All" || b.status === filter)
    );
  }, [branches, search, filter]);

  // 🔹 ADD BRANCH
  const handleAddBranch = (branch) => {
    setBranches((prev) => [...prev, branch]);
  };

  // 🔹 UPDATE BRANCH
  const handleUpdateBranch = (updatedBranch) => {
    setBranches((prev) =>
      prev.map((b, i) => (i === selectedIndex ? updatedBranch : b))
    );
  };

  // 🔹 DELETE BRANCH
  const handleDeleteBranch = (index) => {
    setBranches((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 EXPORT CSV
  const handleExport = () => {
    if (filteredBranches.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Branch Name",
      "Supervisor",
      "Location",
      "Employees",
      "Revenue",
      "Performance",
      "Status",
    ];

    const rows = filteredBranches.map((b) => [
      b.name,
      b.supervisor,
      b.location,
      b.employees,
      b.revenue,
      b.performance + "%",
      b.status,
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "branches_export.csv";
    link.click();
  };

  // 🔹 STATS
  const totalEmployees = branches.reduce(
    (sum, b) => sum + Number(b.employees),
    0
  );

  const totalRevenue = branches.reduce((sum, b) => {
    const value = Number(b.revenue.replace("₹", "").replace("L", ""));
    return sum + value;
  }, 0);

  const avgPerformance =
    branches.length === 0
      ? 0
      : Math.round(
          branches.reduce((sum, b) => sum + Number(b.performance), 0) /
            branches.length
        );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Branch Management</h1>
          <p className="text-gray-500">
            Add/manage branches, assign supervisors, and track performance
          </p>
        </div>

        {/* ✅ ADD BUTTON */}
        <button
          onClick={() => {
            setMode("add");
            setSelectedBranch(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          <MdAdd /> Add Branch
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard
          title="Total Branches"
          value={branches.length}
          icon={<MdLocationOn />}
          bg="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Total Employees"
          value={totalEmployees}
          icon={<MdPeople />}
          bg="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toFixed(1)}L`}
          icon={<MdTrendingUp />}
          bg="bg-purple-100 text-purple-600"
        />
        <StatsCard
          title="Avg Performance"
          value={`${avgPerformance}%`}
          icon={<MdTrendingUp />}
          bg="bg-orange-100 text-orange-600"
        />
      </div>

      {/* SEARCH + FILTER + EXPORT */}
      <div className="bg-white p-4 rounded-2xl flex justify-between border">
        <div className="relative w-96">
          <MdSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 w-full border rounded-xl"
            placeholder="Search branches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 border px-4 py-2 rounded-xl">
            <MdFilterList />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
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
      <BranchTable
        branches={filteredBranches}
        search={search}
        filter={filter}
        onDelete={handleDeleteBranch}
        onEdit={(branch, index) => {
          setMode("edit");
          setSelectedBranch(branch);
          setSelectedIndex(index);
          setOpenModal(true);
        }}
        onView={(branch, index) => {
          setMode("view");
          setSelectedBranch(branch);
          setSelectedIndex(index);
          setOpenModal(true);
        }}
      />

      {/* MODAL */}
      <AddBranchModal
        open={openModal}
        mode={mode}
        data={selectedBranch}
        onClose={() => setOpenModal(false)}
        onAdd={handleAddBranch}
        onUpdate={handleUpdateBranch}
      />
    </div>
  );
}
