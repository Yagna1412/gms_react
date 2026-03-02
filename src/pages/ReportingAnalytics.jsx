import { useState } from "react";
import {
  MdBarChart,
  MdTrendingUp,
  MdShowChart,
  MdTimeline,
  MdDownload,
} from "react-icons/md";

import StatsCard from "../components/StatsCard";

export default function ReportingAnalytics() {
  /* ---------------- FILTER STATE ---------------- */
  const [monthRange, setMonthRange] = useState("6");
  const [branch, setBranch] = useState("All");

  /* ---------------- SAMPLE DATA ---------------- */
  const revenueData = [
    { month: "Jan", value: 3.2 },
    { month: "Feb", value: 2.8 },
    { month: "Mar", value: 3.5 },
    { month: "Apr", value: 3.1 },
    { month: "May", value: 3.9 },
    { month: "Jun", value: 4.2 },
  ];

  const productivity = [
    { branch: "Mumbai Central", value: 92, color: "bg-blue-500" },
    { branch: "Delhi NCR", value: 88, color: "bg-yellow-500" },
    { branch: "Bangalore Tech", value: 95, color: "bg-green-500" },
    { branch: "Chennai Marina", value: 85, color: "bg-yellow-500" },
  ];

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredRevenue = revenueData.slice(
    revenueData.length - Number(monthRange)
  );

  const filteredProductivity =
    branch === "All"
      ? productivity
      : productivity.filter((b) => b.branch === branch);

  /* ---------------- KPI CALCULATIONS ---------------- */
  const peakRevenue = Math.max(...filteredRevenue.map((r) => r.value));
  const growthRate = "+15%"; // static for now
  const bestBranch =
    filteredProductivity.reduce((a, b) => (b.value > a.value ? b : a))
      ?.branch || "-";

  /* ---------------- EXPORT ---------------- */
  const handleExport = () => {
    const csv =
      "Metric,Value\n" +
      `Peak Revenue,₹${peakRevenue}L\n` +
      `Growth Rate,${growthRate}\n` +
      `Best Branch,${bestBranch}\n`;

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reporting_export.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reporting & Analytics</h1>
          <p className="text-gray-500">
            Revenue analysis, productivity reports, and trends
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          <MdDownload /> Export Report
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4 bg-white border rounded-xl p-4">
        <select
          value={monthRange}
          onChange={(e) => setMonthRange(e.target.value)}
          className="border px-4 py-2 rounded-xl"
        >
          <option value="3">Last 3 Months</option>
          <option value="6">Last 6 Months</option>
          <option value="12">Last 12 Months</option>
        </select>

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="border px-4 py-2 rounded-xl"
        >
          <option value="All">All Branches</option>
          <option>Mumbai Central</option>
          <option>Delhi NCR</option>
          <option>Bangalore Tech</option>
          <option>Chennai Marina</option>
        </select>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard
          title="Peak Revenue"
          value={`₹${peakRevenue}L`}
          icon={<MdBarChart />}
          bg="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Growth Rate"
          value={growthRate}
          icon={<MdTrendingUp />}
          bg="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Best Branch"
          value="95%"
          icon={<MdShowChart />}
          bg="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Months Tracked"
          value={monthRange}
          icon={<MdTimeline />}
          bg="bg-purple-100 text-purple-600"
        />
      </div>

      {/* REVENUE ANALYSIS */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="text-lg font-semibold mb-4">
          Revenue Analysis ({monthRange} Months)
        </h2>

        {filteredRevenue.map((r) => (
          <div key={r.month} className="flex items-center gap-4 mb-4">
            <div className="w-12">{r.month}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs flex items-center justify-end pr-3"
                style={{ width: `${(r.value / peakRevenue) * 100}%` }}
              >
                ₹{r.value}L
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCTIVITY */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="text-lg font-semibold mb-4">
          Productivity by Branch
        </h2>

        {filteredProductivity.map((b) => (
          <div key={b.branch} className="flex items-center gap-4 mb-4">
            <div className="w-40">{b.branch}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className={`${b.color} h-full text-white text-xs flex items-center justify-end pr-3`}
                style={{ width: `${b.value}%` }}
              >
                {b.value}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
