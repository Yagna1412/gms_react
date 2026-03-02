import { useEffect, useState } from "react";

export default function AddBranchModal({
  open,
  onClose,
  onAdd,
  onUpdate,
  mode = "add",
  data,
}) {
  const [form, setForm] = useState({
    name: "",
    supervisor: "",
    location: "",
    employees: "",
    revenue: "",
    performance: "",
    status: "Active",
  });

  const [error, setError] = useState("");

  //  Fill form for edit/view
  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        revenue: data.revenue.replace("₹", "").replace("L", ""),
      });
    } else {
      setForm({
        name: "",
        supervisor: "",
        location: "",
        employees: "",
        revenue: "",
        performance: "",
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
      !form.supervisor ||
      !form.location ||
      form.employees === "" ||
      form.revenue === "" ||
      form.performance === ""
    ) {
      setError("Please fill all the details");
      return;
    }

    const payload = {
      ...form,
      employees: Number(form.employees),
      performance: Number(form.performance),
      revenue: `₹${form.revenue}L`,
    };

    isEdit ? onUpdate(payload) : onAdd(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {isEdit ? "Edit Branch" : isView ? "View Branch" : "Add New Branch"}
          </h2>
          <p className="text-gray-500">Fill in the branch details</p>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-6">
          {[
            ["name", "Branch Name"],
            ["supervisor", "Supervisor"],
            ["location", "Location", true],
            ["employees", "Employees"],
            ["revenue", "Monthly Revenue (₹)"],
            ["performance", "Performance (%)"],
          ].map(([key, label, full]) => (
            <div key={key} className={full ? "col-span-2" : ""}>
              <label className="text-xs font-semibold text-gray-500 uppercase">
                {label}
              </label>
              <input
                name={key}
                value={form[key]}
                onChange={handleChange}
                disabled={isView}
                className={`mt-2 w-full border rounded-xl px-4 py-3 ${
                  isView && "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
          ))}

          {/* STATUS */}
          <div>
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

        {/*  ERROR MESSAGE */}
        {error && (
          <p className="mt-4 text-sm text-red-600 font-medium">
            {error}
          </p>
        )}

        {/* FOOTER */}
        <div className="mt-8 flex justify-end gap-4">
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
              {isEdit ? "Update Branch" : "Add Branch"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
