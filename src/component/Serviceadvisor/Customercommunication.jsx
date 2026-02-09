import React from 'react';
import { useServiceAdvisor } from '../context/Serviceadvisorcontext';
import { MessageSquare, Send, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerCommunication() {
  const { jobCards } = useServiceAdvisor();

  const handleSendMessage = (channel, jobCard) => {
    toast.success(`Message sent to customer via ${channel} for ${jobCard.id}`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-black mb-2">Customer Communication</h1>
        <p className="text-gray-600 text-sm">Send updates and notifications to customers</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">Messages Sent Today</span>
          <div className="text-3xl font-bold text-black mt-2">24</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">WhatsApp</span>
          <div className="text-3xl font-bold text-black mt-2">18</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">SMS/Email</span>
          <div className="text-3xl font-bold text-black mt-2">6</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Job Card</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Last Contact</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobCards.slice(0, 5).map((jc) => (
              <tr key={jc.id} className="hover:bg-gray-50">
                <td className="py-4 px-6"><span className="text-sm font-mono text-black">{jc.id}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{jc.customerName}</span></td>
                <td className="py-4 px-6"><span className="text-sm text-gray-700">{jc.status}</span></td>
                <td className="py-4 px-6"><span className="text-xs text-gray-600">2 hours ago</span></td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleSendMessage('WhatsApp', jc)} className="p-1.5 hover:bg-gray-100 rounded" title="WhatsApp">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </button>
                    <button onClick={() => handleSendMessage('SMS', jc)} className="p-1.5 hover:bg-gray-100 rounded" title="SMS">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </button>
                    <button onClick={() => handleSendMessage('Email', jc)} className="p-1.5 hover:bg-gray-100 rounded" title="Email">
                      <Mail className="w-4 h-4 text-purple-600" />
                    </button>
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
