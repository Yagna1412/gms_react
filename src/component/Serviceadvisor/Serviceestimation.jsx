import React, { useState } from "react";
import { useServiceAdvisor } from "../context/Serviceadvisorcontext";
import { toast } from "sonner";
import { Plus, Eye, Send, AlertCircle } from "lucide-react";

export default function ServiceEstimation() {
  const { estimations, addEstimation, updateEstimation, jobCards, customers } =
    useServiceAdvisor();

  const [showModal, setShowModal] = useState(false);
  const [viewEstimation, setViewEstimation] = useState(null);

  const [formData, setFormData] = useState({
    jobCardId: "",
    customerId: "",
    customerName: "",
    laborCharges: 0,
    discount: 0,
  });

  /* ---------------- ACTION HANDLERS ---------------- */

  const handleApprove = (id) => {
    updateEstimation(id, { status: "Approved" });
    toast.success("Estimation approved");
  };

  const handleSend = (est) => {
    toast.success(`Estimation sent to ${est.customerName}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.jobCardId || !formData.customerId) {
      toast.error("Please select job card and customer");
      return;
    }

    const subtotal = 3000 + 1000 + Number(formData.laborCharges || 0);
    const discountAmount = (subtotal * Number(formData.discount || 0)) / 100;
    const afterDiscount = subtotal - discountAmount;
    const tax = (afterDiscount * 18) / 100;

    addEstimation({
      ...formData,
      services: [{ name: "General Service", price: 3000, qty: 1 }],
      parts: [{ name: "Engine Oil", price: 500, qty: 2 }],
      laborCharges: Number(formData.laborCharges) || 1000,
      discount: Number(formData.discount) || 0,
      discountApproved: Number(formData.discount) <= 15,
      tax: 18,
      totalAmount: afterDiscount + tax,
      status: "Pending",
    });

    toast.success("Estimation created successfully");
    setShowModal(false);
    setFormData({
      jobCardId: "",
      customerId: "",
      customerName: "",
      laborCharges: 0,
      discount: 0,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-black">Service Estimation</h1>
          <p className="text-sm text-gray-600">
            Create and manage service estimates
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Estimation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Pending"
          value={estimations.filter((e) => e.status === "Pending").length}
        />
        <StatCard
          label="Approved"
          value={estimations.filter((e) => e.status === "Approved").length}
        />
        <StatCard
          label="Total Value"
          value={`₹${(
            estimations.reduce((s, e) => s + e.totalAmount, 0) / 1000
          ).toFixed(0)}K`}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Estimation ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Job Card</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Discount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {estimations.map((est) => (
              <tr key={est.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{est.id}</td>
                <td className="px-4 py-3">{est.customerName}</td>
                <td className="px-4 py-3">{est.jobCardId}</td>
                <td className="px-4 py-3 font-semibold">
                  ₹{est.totalAmount.toLocaleString()}
                </td>
                <td className="px-4 py-3 flex items-center gap-1">
                  {est.discount}%
                  {est.discount > 15 && !est.discountApproved && (
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      est.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {est.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <IconBtn
                      icon={<Eye className="w-4 h-4" />}
                      onClick={() => setViewEstimation(est)}
                    />
                    <IconBtn
                      icon={<Send className="w-4 h-4" />}
                      onClick={() => handleSend(est)}
                    />
                    {est.status === "Pending" && (
                      <button
                        onClick={() => handleApprove(est.id)}
                        className="text-xs text-green-600 font-semibold"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <Modal title="New Estimation">
          <form onSubmit={handleSubmit} className="space-y-4">
            <SelectField
              label="Job Card"
              value={formData.jobCardId}
              onChange={(e) =>
                setFormData({ ...formData, jobCardId: e.target.value })
              }
              options={jobCards.map((j) => ({ value: j.id, label: j.id }))}
            />

            <SelectField
              label="Customer"
              value={formData.customerId}
              onChange={(e) => {
                const c = customers.find((x) => x.id === e.target.value);
                setFormData({
                  ...formData,
                  customerId: e.target.value,
                  customerName: c?.name || "",
                });
              }}
              options={customers.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />

            <InputField
              label="Labor Charges"
              type="number"
              value={formData.laborCharges}
              onChange={(e) =>
                setFormData({ ...formData, laborCharges: e.target.value })
              }
            />

            <InputField
              label="Discount (%)"
              type="number"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
            />

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Create Estimation
            </button>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-2 border rounded-lg text-gray-700"
            >
              Close
            </button>
          </form>
        </Modal>
      )}

      {/* VIEW MODAL */}
      {viewEstimation && (
        <Modal title="Estimation Details">
          <div className="space-y-2 text-sm">
            <p><b>ID:</b> {viewEstimation.id}</p>
            <p><b>Customer:</b> {viewEstimation.customerName}</p>
            <p><b>Job Card:</b> {viewEstimation.jobCardId}</p>
            <p><b>Total:</b> ₹{viewEstimation.totalAmount.toLocaleString()}</p>
            <p><b>Discount:</b> {viewEstimation.discount}%</p>
            <p><b>Status:</b> {viewEstimation.status}</p>

            <button
              onClick={() => setViewEstimation(null)}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

const Modal = ({ title, children }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl w-full max-w-md">
      <div className="p-4 border-b">
        <h2 className="font-bold">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl border shadow-sm">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-2xl font-bold text-black">{value}</p>
  </div>
);

const IconBtn = ({ icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="p-2 rounded hover:bg-gray-100 text-gray-600"
  >
    {icon}
  </button>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);
