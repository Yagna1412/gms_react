import React from "react";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { useCustomerCommunication } from "../useCustomerCommunication";

export default function CustomerCommunication() {
  const { recentJobCards, handleSendMessage } = useCustomerCommunication();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
   
      <div className="mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-black">
          Customer Communication
        </h1>
        <p className="text-sm text-gray-600">
          Send updates and notifications to customers
        </p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          ["Messages Sent Today", 24],
          ["WhatsApp", 18],
          ["SMS / Email", 6],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white rounded-xl p-5 border shadow-sm"
          >
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      
      <div className="space-y-4 sm:hidden">
        {recentJobCards.map((jc) => (
          <div
            key={jc.id}
            className="bg-white border rounded-xl p-4 shadow-sm"
          >
            <p className="text-xs text-gray-400 font-mono">{jc.id}</p>
            <p className="font-semibold text-gray-900">
              {jc.customerName}
            </p>
            <p className="text-sm text-gray-600">{jc.status}</p>

            <div className="flex gap-3 mt-3">
              <IconBtn
                icon={<MessageSquare className="w-4 h-4 text-green-600" />}
                onClick={() => handleSendMessage("WhatsApp", jc)}
              />
              <IconBtn
                icon={<Phone className="w-4 h-4 text-blue-600" />}
                onClick={() => handleSendMessage("SMS", jc)}
              />
              <IconBtn
                icon={<Mail className="w-4 h-4 text-purple-600" />}
                onClick={() => handleSendMessage("Email", jc)}
              />
            </div>
          </div>
        ))}
      </div>

  
      <div className="hidden sm:block bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="min-w-[800px] w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              {["Job Card", "Customer", "Status", "Last Contact", "Actions"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentJobCards.map((jc) => (
              <tr key={jc.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{jc.id}</td>
                <td className="px-4 py-3 text-sm">{jc.customerName}</td>
                <td className="px-4 py-3 text-sm">{jc.status}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  2 hours ago
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <IconBtn
                      icon={
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      }
                      onClick={() => handleSendMessage("WhatsApp", jc)}
                    />
                    <IconBtn
                      icon={<Phone className="w-4 h-4 text-blue-600" />}
                      onClick={() => handleSendMessage("SMS", jc)}
                    />
                    <IconBtn
                      icon={<Mail className="w-4 h-4 text-purple-600" />}
                      onClick={() => handleSendMessage("Email", jc)}
                    />
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


const IconBtn = ({ icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="p-2 rounded-lg hover:bg-gray-100 transition"
  >
    {icon}
  </button>
);
