import { useEffect, useState } from "react";

export default function CreateInvoiceModal({
  open,
  onClose,
  onAdd,
  data,
}) {
  const [form, setForm] = useState({
    customer: "",
    amount: 0,
    branch: "",
    date: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setForm(data);
    } else {
      setForm({
        customer: "",
        amount: 0,
        branch: "",
        date: "",
      });
    }
  }, [data, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.customer || !form.amount || !form.branch || !form.date) {
      setError("Please fill all fields");
      return;
    }

    onAdd(form);
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
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-6">
          Create Invoice
        </h2>

        {/* FORM GRID */}
        <div className="grid grid-cols-2 gap-6">
          {/* CUSTOMER */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Customer
            </label>
            <input
              className="mt-2 w-full border rounded-xl px-4 py-3"
              value={form.customer}
              onChange={(e) =>
                setForm({ ...form, customer: e.target.value })
              }
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Amount (₹)
            </label>
            <input
              type="number"
              className="mt-2 w-full border rounded-xl px-4 py-3"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
          </div>

          {/* BRANCH */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Branch
            </label>
            <input
              className="mt-2 w-full border rounded-xl px-4 py-3"
              value={form.branch}
              onChange={(e) =>
                setForm({ ...form, branch: e.target.value })
              }
            />
          </div>

          {/* DATE */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Date
            </label>
            <input
              type="date"
              className="mt-2 w-full border rounded-xl px-4 py-3"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 mt-4 text-sm">
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

          {/* ✅ BLUE BUTTON (UPDATED) */}
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
