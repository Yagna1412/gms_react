import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";

export default function BranchTable({
  branches,
  search,
  filter,
  onDelete,
  onEdit,
  onView,
}) {
  const filtered = branches.filter(
    (b) =>
      (b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.location.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "All" || b.status === filter)
  );

  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">Branch Name</th>
            <th className="p-4 text-left">Supervisor</th>
            <th className="p-4 text-left">Location</th>
            <th className="p-4 text-center">Employees</th>
            <th className="p-4 text-center">Revenue</th>
            <th className="p-4 text-center">Performance</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((b, i) => {
            const barColor =
              b.performance >= 90 ? "bg-green-500" : "bg-blue-500";

            return (
              <tr key={i} className="border-t">
                <td className="p-4 font-medium">{b.name}</td>
                <td className="p-4">{b.supervisor}</td>
                <td className="p-4">{b.location}</td>
                <td className="p-4 text-center font-semibold">
                  {b.employees}
                </td>
                <td className="p-4 text-center font-semibold">
                  {b.revenue}
                </td>

                {/* PERFORMANCE */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${barColor}`}
                        style={{ width: `${b.performance}%` }}
                      />
                    </div>
                    <span className="font-medium">
                      {b.performance}%
                    </span>
                  </div>
                </td>

                {/* STATUS */}
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      b.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-4">
                    {/* VIEW */}
                    <MdVisibility
                      className="text-blue-600 cursor-pointer"
                      size={18}
                      onClick={() => onView && onView(b, i)}
                    />

                    {/* EDIT */}
                    <MdEdit
                      className="text-green-600 cursor-pointer"
                      size={18}
                      onClick={() => onEdit && onEdit(b, i)}
                    />

                    {/* DELETE */}
                    <MdDelete
                      className="text-red-600 cursor-pointer"
                      size={18}
                      onClick={() => onDelete(i)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p className="p-6 text-center text-gray-500">
          No branches found
        </p>
      )}
    </div>
  );
}
