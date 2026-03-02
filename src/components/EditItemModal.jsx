import { useEffect, useState } from "react";

export default function EditItemModal({
  open,
  data,
  onClose,
  onUpdate,
}) {
  const [stockChange, setStockChange] = useState(0);
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setStockChange(0);
      setBranch(data.branch);
      setError("");
    }
  }, [data]);

  if (!open || !data) return null;

  const handleSubmit = () => {
    if (!branch) {
      setError("Please select a branch");
      return;
    }

    const updatedStock = data.stock + Number(stockChange);

    if (updatedStock < 0) {
      setError("Stock cannot be negative");
      return;
    }

    onUpdate({
      ...data,
      stock: updatedStock,
      branch,
    });

    onClose();
  };

  const status =
    data.stock + stockChange < data.minStock
      ? "Low Stock"
      : "In Stock";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Edit Inventory Item</h2>

        {/* ITEM INFO */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Item Name
            </label>
            <input
              value={data.name}
              disabled
              className="mt-2 w-full border rounded-xl px-4 py-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">
              Category
            </label>
            <input
              value={data.category}
              disabled
              className="mt-2 w-full border rounded-xl px-4 py-3 bg-gray-100"
            />
          </div>

          {/* CURRENT STOCK */}
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Current Stock
            </label>
            <input
              value={data.stock}
              disabled
              className="mt-2 w-full border rounded-xl px-4 py-3 bg-gray-100"
            />
          </div>

          {/* STOCK ADJUSTMENT */}
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Allocate / Reduce Stock
            </label>
            <input
              type="number"
              value={stockChange}
              onChange={(e) => setStockChange(Number(e.target.value))}
              className="mt-2 w-full border rounded-xl px-4 py-3"
              placeholder="+10 / -5"
            />
          </div>

          {/* BRANCH */}
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-500">
              Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            >
              <option value="">Select Branch</option>
              <option>Central Warehouse</option>
              <option>Mumbai Central</option>
              <option>Delhi NCR</option>
            </select>
          </div>
        </div>

        {/* STATUS */}
        <div className="mt-4">
          <span
            className={`px-4 py-1 rounded-full text-xs font-semibold ${
              status === "Low Stock"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status}
          </span>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}

        {/* FOOTER */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-black text-white rounded-xl"
          >
            Update Stock
          </button>
        </div>
      </div>
    </div>
  );
}
