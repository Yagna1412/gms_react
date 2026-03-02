import { MdSearch, MdFileDownload, MdDelete, MdEdit } from "react-icons/md";

export default function CustomersTable({
  customers,
  search,
  setSearch,
  onExport,
  onDelete,
  onEdit,
}) {
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border rounded-2xl p-4">
      {/* SEARCH + EXPORT */}
      <div className="flex justify-between mb-4">
        <div className="relative w-[520px]">
          <MdSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 w-full border rounded-xl"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-2 border px-5 py-2 rounded-xl"
        >
          <MdFileDownload /> Export
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm border rounded-xl overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Vehicle</th>
            <th className="p-4 text-left">Contact</th>
            <th className="p-4 text-center">Appointments</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="p-4 font-medium">{c.name}</td>
              <td className="p-4">{c.vehicle}</td>
              <td className="p-4">
                {c.phone}
                <div className="text-xs text-gray-500">{c.email}</div>
              </td>
              <td className="p-4 text-center">{c.appointments}</td>
              <td className="p-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    c.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {c.status}
                </span>
              </td>

              {/* ACTIONS */}
              <td className="p-4 text-center">
                <div className="flex justify-center gap-4">
                  <MdEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => onEdit(c, i)}
                  />
                  <MdDelete
                    className="text-red-600 cursor-pointer"
                    onClick={() => onDelete(i)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
