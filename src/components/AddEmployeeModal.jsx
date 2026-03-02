import { useEffect, useState } from "react";

export default function AddEmployeeModal({
  open,
  onClose,
  onAdd,
  onUpdate,
  mode,
  data,
}) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    branch: "",
    email: "",
    phone: "",
    productivity: 0,
    status: "Active",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setForm(data);
    } else {
      setForm({
        name: "",
        role: "",
        branch: "",
        email: "",
        phone: "",
        productivity: 0,
        status: "Active",
      });
    }
    setError("");
  }, [data, open]);

  if (!open) return null;

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleChange = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = () => {
    //  VALIDATION
    if (
      !form.name ||
      !form.role ||
      !form.branch ||
      !form.email ||
      !form.phone ||
      form.productivity === "" ||
      form.productivity === null
    ) {
      setError("Please fill all the details");
      return;
    }

    const payload = {
      ...form,
      productivity: Number(form.productivity),
    };

    isEdit ? onUpdate(payload) : onAdd(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* CARD */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-6">
          {isEdit
            ? "Edit Employee"
            : isView
            ? "View Employee"
            : "Add New Employee"}
        </h2>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-6">
          {/* NAME */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isView}
              className={`mt-2 w-full border rounded-xl px-4 py-3 ${
                isView && "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Role
            </label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={isView}
              className={`mt-2 w-full border rounded-xl px-4 py-3 ${
                isView && "bg-gray-100 cursor-not-allowed"
              }`}
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
              disabled={isView}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            >
              <option value="">Select Branch</option>
              <option>Mumbai Central</option>
              <option>Delhi NCR</option>
              <option>Bangalore Tech</option>
              <option>Chennai Marina</option>
            </select>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={isView}
              className={`mt-2 w-full border rounded-xl px-4 py-3 ${
                isView && "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={isView}
              className={`mt-2 w-full border rounded-xl px-4 py-3 ${
                isView && "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          {/* PRODUCTIVITY */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Productivity (%)
            </label>
            <input
              type="number"
              name="productivity"
              value={form.productivity}
              onChange={handleChange}
              disabled={isView}
              className={`mt-2 w-full border rounded-xl px-4 py-3 ${
                isView && "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          {/* STATUS */}
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={isView}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="mt-4 text-sm text-red-600 font-medium">
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

          {!isView && (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium"
            >
              {isEdit ? "Update Employee" : "Add Employee"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
