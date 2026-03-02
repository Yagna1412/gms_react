import { MdEdit, MdDelete } from "react-icons/md";

export default function ServicesTable({ services, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">Service</th>
            <th className="p-4 text-center">Price</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {services.map((s, i) => (
            <tr key={i} className="border-t">
              <td className="p-4 font-medium">{s.name}</td>
              <td className="p-4 text-center">₹{s.price}</td>
              <td className="p-4 text-center">{s.status}</td>
              <td className="p-4 text-center">
                <div className="flex justify-center gap-4">
                  <MdEdit onClick={() => onEdit(s)} className="text-blue-600 cursor-pointer" />
                  <MdDelete onClick={() => onDelete(i)} className="text-red-600 cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
