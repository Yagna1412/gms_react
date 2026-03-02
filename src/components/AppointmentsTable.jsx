import {
  MdSearch,
  MdFileDownload,
  MdEdit,
  MdDelete,
} from "react-icons/md";

export default function AppointmentsTable({
  appointments,
  search,
  setSearch,
  onExport,
  onEdit,
  onDelete,
}) {
  const filtered = appointments.filter(
    (a) =>
      a.customer.toLowerCase().includes(search.toLowerCase()) ||
      a.branch.toLowerCase().includes(search.toLowerCase()) ||
      a.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border p-4">
      {/* 🔍 SEARCH + EXPORT */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <MdSearch className="absolute left-4 top-3.5 text-gray-400 text-lg" />
          <input
            className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm bg-gray-50"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-2 border px-5 py-3 rounded-xl font-medium"
        >
          <MdFileDownload className="text-lg" />
          Export
        </button>
      </div>

      {/* 📋 TABLE */}
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Branch</th>
              <th className="p-4 text-left">Service</th>
              <th className="p-4 text-left">Date & Time</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a, i) => (
              <tr key={i} className="border-t">
                <td className="p-4 font-medium text-gray-900">
                  {a.customer}
                </td>

                <td className="p-4 text-gray-700">{a.branch}</td>

                <td className="p-4 text-gray-700">{a.service}</td>

                <td className="p-4 text-gray-700">
                  {a.date} at {a.time}
                </td>

                {/* ✅ STATUS BADGE */}
                <td className="p-4 text-center">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-semibold ${
                      a.status === "Scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : a.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : a.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>

                {/* ⚙ ACTIONS */}
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => onEdit(a)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <MdEdit size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(i)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No appointments found
          </p>
        )}
      </div>
    </div>
  );
}
