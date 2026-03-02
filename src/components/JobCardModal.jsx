import { useEffect, useState } from "react";

export default function JobCardModal({
  open,
  onClose,
  onAdd,
  onUpdate,
  data,
  customers,
  services,
}) {
  const [form, setForm] = useState({
    customer: "",
    service: "",
    branch: "",
    technician: "",
    progress: 0,
    status: "Pending",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (!open) return null;

  const validate = () => {
    let newErrors = {};

    if (!form.customer) newErrors.customer = "Customer is required";
    if (!form.service) newErrors.service = "Service is required";
    if (!form.branch) newErrors.branch = "Branch is required";
    if (!form.technician) newErrors.technician = "Technician name required";
    if (form.progress < 0 || form.progress > 100)
      newErrors.progress = "Progress must be 0–100";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    if (data) onUpdate(form);
    else onAdd(form);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl w-[600px]">
        <h2 className="text-xl font-bold mb-6">
          {data ? "Edit Job Card" : "Create Job Card"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* CUSTOMER */}
          <div>
            <select
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              className="border rounded-xl px-4 py-3 w-full"
            >
              <option value="">Select Customer</option>
              {customers.map((c, i) => (
                <option key={i}>{c.name}</option>
              ))}
            </select>
            {errors.customer && <p className="text-red-500 text-sm">{errors.customer}</p>}
          </div>

          {/* SERVICE */}
          <div>
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="border rounded-xl px-4 py-3 w-full"
            >
              <option value="">Select Service</option>
              {services.map((s, i) => (
                <option key={i}>{s.name}</option>
              ))}
            </select>
            {errors.service && <p className="text-red-500 text-sm">{errors.service}</p>}
          </div>

          {/* BRANCH */}
          <div>
            <input
              placeholder="Branch"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              className="border rounded-xl px-4 py-3 w-full"
            />
            {errors.branch && <p className="text-red-500 text-sm">{errors.branch}</p>}
          </div>

          {/* TECHNICIAN */}
          <div>
            <input
              placeholder="Technician"
              value={form.technician}
              onChange={(e) =>
                setForm({ ...form, technician: e.target.value })
              }
              className="border rounded-xl px-4 py-3 w-full"
            />
            {errors.technician && <p className="text-red-500 text-sm">{errors.technician}</p>}
          </div>

          {/* PROGRESS */}
          <div>
            <input
              type="number"
              placeholder="Progress %"
              value={form.progress}
              onChange={(e) =>
                setForm({ ...form, progress: Number(e.target.value) })
              }
              className="border rounded-xl px-4 py-3 w-full"
            />
            {errors.progress && <p className="text-red-500 text-sm">{errors.progress}</p>}
          </div>

          {/* STATUS */}
          <div>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border rounded-xl px-4 py-3 w-full"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            {data ? "Update Job Card" : "Create Job Card"}
          </button>
        </div>
      </div>
    </div>
  );
}
