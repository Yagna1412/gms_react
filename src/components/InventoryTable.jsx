import { MdEdit, MdDelete } from "react-icons/md";

export default function InventoryTable({ items, onEdit, onDelete }) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">Item</th>
            <th className="p-4">Category</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Min</th>
            <th className="p-4">Branch</th>
            <th className="p-4">Price</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((i, idx) => {
            const low = i.stock < i.minStock;

            return (
              <tr key={idx} className="border-t">
                <td className="p-4 font-medium">{i.name}</td>
                <td className="p-4">{i.category}</td>
                <td className="p-4 font-semibold">{i.stock}</td>
                <td className="p-4">{i.minStock}</td>
                <td className="p-4">{i.branch}</td>
                <td className="p-4 font-semibold">₹{i.price}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      low
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {low ? "Low Stock" : "In Stock"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-4">
                    <MdEdit
                      className="text-blue-600 cursor-pointer"
                      onClick={() => onEdit(i)}
                    />
                    <MdDelete
                      className="text-red-600 cursor-pointer"
                      onClick={() => onDelete(idx)}
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
