import { useEffect, useState } from "react";

export default function CustomerModal({
  open,
  onClose,
  onAdd,
  onUpdate,
  data,
}) {
  const [form, setForm] = useState({
    name: "",
    vehicle: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (!open) return null;

  const submit = () => {
    if (!form.name || !form.vehicle || !form.phone || !form.email) {
      setError("Please fill all fields");
      return;
    }

    data
      ? onUpdate(form)
      : onAdd({ ...form, appointments: 0, status: "Active" });

    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[520px]">
        <h2 className="text-xl font-bold mb-6">
          {data ? "Edit Customer" : "Add New Customer"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {["name", "vehicle", "phone", "email"].map((f) => (
            <input
              key={f}
              value={form[f]}
              placeholder={f.toUpperCase()}
              className="border rounded-xl px-4 py-3"
              onChange={(e) =>
                setForm({ ...form, [f]: e.target.value })
              }
            />
          ))}
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            {data ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}
