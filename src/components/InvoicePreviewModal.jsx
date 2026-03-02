export default function InvoicePreviewModal({ open, invoice, onClose }) {
  if (!open || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[600px] p-8">
        <h2 className="text-xl font-bold mb-4">Invoice Preview</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Invoice ID</span>
            <span className="font-medium">{invoice.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Customer</span>
            <span>{invoice.customer}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Branch</span>
            <span>{invoice.branch}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span>{invoice.date}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount</span>
            <span>₹{invoice.amount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                invoice.status === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
