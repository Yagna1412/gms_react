import React from 'react';
import { useServiceAdvisor } from '../context/Serviceadvisorcontext';
import { CreditCard, Eye, CheckCircle, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function BillingDelivery() {
  const { invoices, jobCards } = useServiceAdvisor();
  const readyForDelivery = jobCards.filter(jc => jc.status === 'Quality Check' || jc.status === 'Ready for Delivery');

  const handleDelivery = (jobCard) => {
    toast.success(`Delivery completed for ${jobCard.id}. Feedback form sent to customer.`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-black mb-2">Billing & Delivery</h1>
        <p className="text-gray-600 text-sm">View invoices and coordinate deliveries (Read-only)</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Ready for Delivery</span>
          <div className="text-3xl font-bold text-black mt-2">{readyForDelivery.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Delivered Today</span>
          <div className="text-3xl font-bold text-black mt-2">5</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Pending Payment</span>
          <div className="text-3xl font-bold text-black mt-2">2</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <p className="text-sm text-blue-700">
            ℹ️ Invoice generation is restricted to Admin. You can view invoices and coordinate delivery.
          </p>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Invoice ID</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Job Card</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Payment Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="py-4 px-6"><span className="text-sm font-mono text-black">{inv.id}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{inv.jobCardId}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{inv.customerName}</span></td>
                <td className="py-4 px-6"><span className="text-sm font-semibold text-black">₹{inv.total.toLocaleString()}</span></td>
                <td className="py-4 px-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                    {inv.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="View Invoice">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    {inv.status === 'Paid' && (
                      <button onClick={() => handleDelivery({ id: inv.jobCardId })} className="text-xs text-green-600 hover:text-green-700 font-medium">
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
    </div>
  );
}
