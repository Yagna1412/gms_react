import { useEffect, useState } from "react";

export default function ServiceModal({
  open,
  onClose,
  onAdd,
  onUpdate,
  data,
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (!open) return null;

  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Service name is required";
    if (!form.price) newErrors.price = "Price is required";
    if (form.price <= 0) newErrors.price = "Price must be greater than 0";

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
      <div className="bg-white p-8 rounded-2xl w-[500px]">
        <h2 className="text-xl font-bold mb-6">
          {data ? "Edit Service" : "Add New Service"}
        </h2>

        <div className="space-y-4">
          {/* SERVICE NAME */}
          <div>
            <input
              placeholder="Service Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded-xl px-4 py-3 w-full"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* PRICE */}
          <div>
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="border rounded-xl px-4 py-3 w-full"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          {/* STATUS */}
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            {data ? "Update Service" : "Add Service"}
          </button>
        </div>
      </div>
    </div>
  );
}
