import { useState, useEffect } from "react";
import { MdSend } from "react-icons/md";

export default function SendNotificationModal({ open, onClose, onSend }) {
  const [form, setForm] = useState({
    type: "",
    customer: "",
    message: "",
  });

  const [error, setError] = useState("");

  const typeOptions = [
    "Service Reminder",
    "Follow-up",
    "Update",
    "Alert",
  ];

  useEffect(() => {
    if (open) {
      setForm({ type: "", customer: "", message: "" });
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = () => {
    if (!form.type || !form.message) {
      setError("Please select a type and enter a message");
      return;
    }

    const payload = {
      type: form.type,
      customer: form.customer || "System",
      message: form.message,
      date: new Date().toISOString().split("T")[0],
      status: "Sent",
    };

    onSend(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Send Notification</h2>
        </div>

        {/* FORM */}
        <div className="space-y-6">
          {/* TYPE */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              TYPE
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Type
              </option>
              {typeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* CUSTOMER */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              CUSTOMER (OPTIONAL)
            </label>
            <input
              type="text"
              name="customer"
              value={form.customer}
              onChange={handleChange}
              placeholder="Enter customer name or leave blank for system"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              MESSAGE
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Enter your notification message"
              rows="5"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="text-red-600 text-sm font-medium">{error}</div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 justify-end mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-300 font-medium text-slate-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            <MdSend size={18} />
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}