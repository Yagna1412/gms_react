import { MdEdit, MdDelete } from "react-icons/md";

export default function JobCardsTable({ jobCards, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase">
          <tr>
            <th className="p-4 text-left">Job Card ID</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Service</th>
            <th className="p-4 text-left">Branch</th>
            <th className="p-4 text-left">Technician</th>
            <th className="p-4 text-left">Progress</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobCards.map((jc, i) => (
            <tr key={i} className="border-t">
              <td className="p-4 font-semibold">{jc.id}</td>
              <td className="p-4">{jc.customer}</td>
              <td className="p-4">{jc.service}</td>
              <td className="p-4">{jc.branch}</td>
              <td className="p-4">{jc.technician}</td>

              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        jc.status === "Cancelled"
                          ? "bg-red-500"
                          : jc.progress === 100
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${jc.progress}%` }}
                    />
                  </div>
                  <span>{jc.progress}%</span>
                </div>
              </td>

              <td className="p-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    jc.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : jc.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : jc.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {jc.status}
                </span>
              </td>

              <td className="p-4 text-center">
                <div className="flex justify-center gap-4">
                  <MdEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => onEdit(jc)}
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
