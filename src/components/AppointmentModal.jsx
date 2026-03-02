import { useEffect, useState } from "react";

export default function AppointmentsModal({
  open,
  onClose,
  onAdd,
  onUpdate,
  data,
  customers = [],
}) {
  const isEdit = Boolean(data);

  const [form, setForm] = useState({
    customer: "",
    service: "",
    branch: "",
    date: "",
    time: "",
    status: "Scheduled",
  });

  const [errors, setErrors] = useState({});

  // Fill data while editing
  useEffect(() => {
    if (data) {
      setForm(data);
    } else {
      setForm({
        customer: "",
        service: "",
        branch: "",
        date: "",
        time: "",
        status: "Scheduled",
      });
    }
    setErrors({});
  }, [data, open]);

  if (!open) return null;

  //  VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!form.customer) newErrors.customer = "Customer is required";
    if (!form.service) newErrors.service = "Service is required";
    if (!form.branch) newErrors.branch = "Branch is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;

    isEdit ? onUpdate(form) : onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* CARD */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Appointment" : "Book Appointment"}
        </h2>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-6">
          {/* CUSTOMER */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Customer
            </label>
            <select
              name="customer"
              value={form.customer}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            >
              <option value="">Select Customer</option>
              {customers.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.customer && (
              <p className="text-red-500 text-xs mt-1">{errors.customer}</p>
            )}
          </div>

          {/* SERVICE */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Service
            </label>
            <input
              name="service"
              value={form.service}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
              placeholder="e.g. Car Service"
            />
            {errors.service && (
              <p className="text-red-500 text-xs mt-1">{errors.service}</p>
            )}
          </div>

          {/* BRANCH */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Branch
            </label>
            <input
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
              placeholder="e.g. Mumbai Central"
            />
            {errors.branch && (
              <p className="text-red-500 text-xs mt-1">{errors.branch}</p>
            )}
          </div>

          {/* STATUS */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            >
              <option>Scheduled</option>
              <option>Postponed</option>
              <option>Cancelled</option>
              <option>Completed</option>
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          {/* TIME */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            />
            {errors.time && (
              <p className="text-red-500 text-xs mt-1">{errors.time}</p>
            )}
          </div>
        </div>

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
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium"
          >
            {isEdit ? "Update Appointment" : "Book Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
}
