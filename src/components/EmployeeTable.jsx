import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";

export default function EmployeeTable({ employees, onEdit, onView, onDelete }) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Branch</th>
            <th className="p-4 text-left">Contact</th>
            <th className="p-4 text-center">Productivity</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((e, i) => {
            const barColor =
              e.productivity >= 90 ? "bg-green-500" : "bg-blue-500";

            return (
              <tr key={i} className="border-t">
                <td className="p-4 font-medium">{e.name}</td>
                <td className="p-4">{e.role}</td>
                <td className="p-4">{e.branch}</td>
                <td className="p-4 text-sm text-gray-600">
                  {e.email}
                  <br />
                  {e.phone}
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${barColor}`}
                        style={{ width: `${e.productivity}%` }}
                      />
                    </div>
                    <span className="font-medium">{e.productivity}%</span>
                  </div>
                </td>

                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {e.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <div className="flex justify-center gap-4">
                    <MdVisibility
                      className="text-blue-600 cursor-pointer"
                      size={18}
                      onClick={() => onView(e, i)}
                    />
                    <MdEdit
                      className="text-green-600 cursor-pointer"
                      size={18}
                      onClick={() => onEdit(e, i)}
                    />
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
    </div>
  );
}
