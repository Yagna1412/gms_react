import { NavLink } from "react-router-dom";
import {
  FiBriefcase,
  FiUsers,
  FiCalendar,
  FiClipboard,
  FiBox,
  FiDollarSign,
  FiBell,
  FiBarChart2,
  FiShield,
  FiTool,
  FiX,
} from "react-icons/fi";

const baseItem =
  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border border-transparent";

const activeItem =
  "bg-blue-600 text-white shadow border-blue-600";

const inactiveItem =
  "text-slate-700 hover:bg-blue-50 hover:border-blue-200";

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static
          z-50 lg:z-auto
          top-0 left-0
          h-screen w-72
          bg-[#EFF6FF]
          border-r border-blue-100
          flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <FiTool size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg">GMS PRO</h1>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>

          {/* CLOSE BUTTON (mobile only) */}
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <NavLink
            to="/branches"
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <FiBriefcase size={18} />
            Branch Management
          </NavLink>

          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <FiUsers size={18} />
            Employee Management
          </NavLink>

          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <FiCalendar size={18} />
            Customer & Appointments
          </NavLink>

          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <FiClipboard size={18} />
            Service & Job Cards
          </NavLink>

          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <FiBox size={18} />
            Inventory & Parts
          </NavLink>

          <NavLink
            to="/finance"
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <FiDollarSign size={18} />
            Finance & Billing
          </NavLink>

           <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `${baseItem} ${isActive ? activeItem : inactiveItem}`
          }
        >
          <FiBell size={18} />
          Notifications
        </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <FiBarChart2 size={18} />
            Reporting & Analytics
          </NavLink>

        

          <NavLink
            to="/security"
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <FiShield size={18} />
            Security & Control
          </NavLink>
        </nav>
      </div>
    </>
  );
}
