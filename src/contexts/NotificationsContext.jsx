import { createContext, useState, useEffect } from "react";

const NotificationsContext = createContext(null);

const initialData = [
  {
    id: 1,
    type: "Service Reminder",
    customer: "Rohit Sharma",
    message: "Service due in 3 days",
    date: "2024-12-18",
    status: "Unread",
  },
  {
    id: 2,
    type: "Follow-up",
    customer: "Priya Nair",
    message: "Follow-up after service",
    date: "2024-12-17",
    status: "Sent",
  },
  {
    id: 3,
    type: "Update",
    customer: "System",
    message: "New inventory arrived",
    date: "2024-12-16",
    status: "Read",
  },
];

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem("notifications_v1");
      return raw ? JSON.parse(raw) : initialData;
    } catch (e) {
      return initialData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("notifications_v1", JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  const addNotification = (payload) => {
    const notification = {
      id: notifications.length ? Math.max(...notifications.map((n) => n.id)) + 1 : 1,
      ...payload,
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: "Read" } : n)));
  };

  const unreadCount = notifications.filter((n) => n.status === "Unread").length;

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, markRead, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export default NotificationsContext;