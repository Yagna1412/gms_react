import {
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import {
  MdSearch,
  MdSettings,
  MdLogout,
  MdNotifications,
} from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import NotificationsContext from "../contexts/NotificationsContext";

/* ------------------ NOTIFICATION BELL ------------------ */

function Bell() {
  const { notifications, markRead, unreadCount } =
    useContext(NotificationsContext);

  const [openBell, setOpenBell] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setOpenBell(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () =>
      document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setOpenBell((p) => !p)}
        className="relative"
      >
        <MdNotifications size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {openBell && (
        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b text-sm font-semibold">
            Notifications
          </div>

          <div className="max-h-64 overflow-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-sm text-slate-500">
                No notifications
              </div>
            )}

            {notifications.slice(0, 8).map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full mt-1"
                  style={{
                    background:
                      n.status === "Unread"
                        ? "#F59E0B"
                        : "#CBD5E1",
                  }}
                />

                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-700">
                    {n.type} - {n.customer}
                  </div>
                  <div className="text-sm text-slate-500">
                    {n.message}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {n.date}
                  </div>
                </div>

                <div className="text-sm text-blue-600 font-medium">
                  {n.status === "Unread" ? (
                    <button
                      onClick={() => markRead(n.id)}
                      className="hover:underline"
                    >
                      Mark Read
                    </button>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-3 text-right">
            <Link
              to="/notifications"
              className="text-sm text-blue-600 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------ HEADER ------------------ */

export default function Header({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        
        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <FiMenu size={22} />
        </button>

        {/* SEARCH */}
        <div className="relative w-[420px] hidden sm:block">
          <MdSearch
            className="absolute left-3 top-3 text-gray-400"
            size={20}
          />
          <input
            className="pl-10 pr-4 py-2 w-full border rounded-xl"
            placeholder="Search branches, employees, customers..."
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-5">
        
        {/* NOTIFICATION BELL */}
        <Bell />

        {/* ADMIN DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() =>
              setOpen((prev) => !prev)
            }
            className="flex items-center gap-3 bg-white p-3 rounded-xl border cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              AD
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                Admin
              </p>
              <p className="text-xs text-slate-500">
                admin@manthatech.com
              </p>
            </div>
          </div>

          {open && (
            <div className="absolute right-0 mt-3 w-44 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50">
                <MdSettings size={18} />
                Settings
              </button>

              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50">
                <MdLogout size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}