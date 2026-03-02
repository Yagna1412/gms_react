import { downloadInvoicePDF } from "../utils/downloadInvoicePDF";

export default function InvoicesTable({
  invoices,
  onMarkPaid,
  onView,
}) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 uppercase text-xs text-gray-600">
          <tr>
            <th className="p-4 text-left">Invoice ID</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Branch</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv, i) => (
            <tr key={i} className="border-t">
              <td className="p-4 font-semibold">{inv.id}</td>
              <td className="p-4">{inv.customer}</td>
              <td className="p-4">{inv.branch}</td>
              <td className="p-4">₹{inv.amount}</td>
              <td className="p-4">{inv.date}</td>

              <td className="p-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    inv.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {inv.status}
                </span>
              </td>

              <td className="p-4 text-center">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onView(inv)}
                    className="px-3 py-1 border rounded-lg text-xs"
                  >
                    View
                  </button>

                  <button
                    onClick={() => downloadInvoicePDF(inv)}
                    className="px-3 py-1 border rounded-lg text-xs"
                  >
                    Download
                  </button>

                  {inv.status === "Pending" && (
                    <button
                      onClick={() => onMarkPaid(i)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
