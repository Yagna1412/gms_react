import { useState, useContext } from "react";
import StatsCard from "../components/StatsCard";
import SendNotificationModal from "../components/SendNotificationsModal";
import { FiBell, FiSend, FiMessageSquare } from "react-icons/fi";
import NotificationsContext from "../contexts/NotificationsContext";

function TypePill({ type }) {
  const base = "px-3 py-1 rounded-full text-sm font-medium";
  const map = {
    "Service Reminder": "bg-blue-50 text-blue-600",
    "Follow-up": "bg-green-50 text-green-600",
    Update: "bg-purple-50 text-purple-600",
  };
  return <span className={`${base} ${map[type] || "bg-gray-50 text-gray-600"}`}>{type}</span>;
}

function StatusPill({ status }) {
  const base = "px-3 py-1 rounded-full text-sm font-medium";
  const map = {
    Unread: "bg-yellow-50 text-yellow-700",
    Sent: "bg-green-50 text-green-700",
    Read: "bg-gray-50 text-gray-600",
  };
  return <span className={`${base} ${map[status] || "bg-gray-50 text-gray-600"}`}>{status}</span>;
}

export default function Notifications() {
  const { notifications: data, addNotification, markRead } = useContext(NotificationsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNotification = (newNotification) => {
    addNotification(newNotification);
  };

  const handleMarkRead = (id) => {
    markRead(id);
  };

  const total = data.length;
  const sent = data.filter((d) => d.status === "Sent").length;
  const unread = data.filter((d) => d.status === "Unread").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-slate-500">Service reminders, follow-ups, and updates</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow hover:opacity-95 flex items-center gap-2"
        >
          <span className="text-lg font-bold">+</span>
          <span>Send Notification</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Notifications"
          value={total}
          icon={<FiBell size={20} />}
          bg="bg-teal-50 text-teal-600"
        />

        <StatsCard
          title="Sent"
          value={sent}
          icon={<FiSend size={20} />}
          bg="bg-blue-50 text-blue-600"
        />

        <StatsCard
          title="Unread"
          value={unread}
          icon={<FiMessageSquare size={20} />}
          bg="bg-green-50 text-green-600"
        />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white border-b">
            <tr className="text-sm text-slate-500">
              <th className="px-6 py-4">TYPE</th>
              <th className="px-6 py-4">CUSTOMER</th>
              <th className="px-6 py-4">MESSAGE</th>
              <th className="px-6 py-4">DATE</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b last:border-b-0">
                <td className="px-6 py-4">
                  <TypePill type={row.type} />
                </td>
                <td className="px-6 py-4 text-slate-700">{row.customer}</td>
                <td className="px-6 py-4 text-slate-600">{row.message}</td>
                <td className="px-6 py-4 text-slate-500">{row.date}</td>
                <td className="px-6 py-4">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-6 py-4 text-blue-600 font-medium">
                  {row.status === "Unread" ? (
                    <button
                      onClick={() => handleMarkRead(row.id)}
                      className="hover:underline"
                    >
                      Mark Read
                    </button>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SendNotificationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={handleAddNotification}
      />
    </div>
  );
}