import React from "react";
import { Eye, Truck } from "lucide-react";
import { useBillingDelivery } from "../useBillingDelivery";

export default function BillingDelivery() {
  const {
    invoices,
    readyForDelivery,
    viewInvoice,
    handleViewInvoice,
    closeInvoice,
    handleDelivery
  } = useBillingDelivery();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
     
      <div className="mb-6">
        <h1 className="text-xl font-bold text-black">Billing & Delivery</h1>
        <p className="text-sm text-gray-600">
          View invoices and coordinate deliveries
        </p>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Stat label="Ready for Delivery" value={readyForDelivery.length} />
        <Stat label="Delivered Today" value={5} />
        <Stat label="Pending Payment" value={2} />
      </div>

    
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
        <p className="text-sm text-blue-700">
          ℹ️ Invoice generation is restricted to Admin.
        </p>
      </div>

     
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Invoice ID</th>
              <th className="px-4 py-3 text-left">Job Card</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{inv.id}</td>
                <td className="px-4 py-3">{inv.jobCardId}</td>
                <td className="px-4 py-3">{inv.customerName}</td>
                <td className="px-4 py-3 font-semibold">
                  ₹{inv.total.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewInvoice(inv)}
                      className="p-2 rounded hover:bg-gray-100"
                      title="View Invoice"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>

                    {inv.status === "Paid" && (
                      <button
                        onClick={() => handleDelivery(inv)}
                        className="flex items-center gap-1 text-xs text-green-600 font-semibold hover:text-green-700"
                      >
                        <Truck className="w-4 h-4" />
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      {viewInvoice && (
        <Modal title="Invoice Details">
          <p><b>Invoice ID:</b> {viewInvoice.id}</p>
          <p><b>Customer:</b> {viewInvoice.customerName}</p>
          <p><b>Job Card:</b> {viewInvoice.jobCardId}</p>
          <p><b>Total:</b> ₹{viewInvoice.total.toLocaleString()}</p>
          <p><b>Status:</b> {viewInvoice.status}</p>

          <button
            onClick={closeInvoice}
            className="mt-5 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}



const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl p-5 border shadow-sm">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

const Modal = ({ title, children }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl w-full max-w-md p-5">
      <div className="border-b pb-2 mb-4">
        <h2 className="font-bold">{title}</h2>
      </div>
      {children}
    </div>
  </div>
);
