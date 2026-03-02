import { useEffect, useState } from "react";

export default function AddItemModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: 0,
    minStock: 0,
    branch: "",
    price: 0,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        category: "",
        stock: 0,
        minStock: 0,
        branch: "",
        price: 0,
      });
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.category ||
      !form.branch ||
      form.stock <= 0 ||
      form.minStock < 0 ||
      form.price <= 0
    ) {
      setError("Please fill all details correctly");
      return;
    }

    onAdd({
      ...form,
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      price: Number(form.price),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* CARD */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-6">
          Add Inventory Item
        </h2>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-6">
          {/* ITEM NAME */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Item Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            >
              <option value="">Select Category</option>
              <option>Lubricants</option>
              <option>Parts</option>
              <option>Filters</option>
              <option>Accessories</option>
            </select>
          </div>

          {/* STOCK */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* MIN STOCK */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Min Stock
            </label>
            <input
              type="number"
              name="minStock"
              value={form.minStock}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* BRANCH */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Branch
            </label>
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            >
              <option value="">Select Branch</option>
              <option>Central Warehouse</option>
              <option>Mumbai Central</option>
              <option>Delhi NCR</option>
              <option>Bangalore Tech</option>
            </select>
          </div>

          {/* PRICE */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mt-4">
            {error}
          </p>
        )}

        {/* FOOTER */}
        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}
