import { useState } from "react";
import {
  MdAdd,
  MdCalendarToday,
  MdPeople,
  MdEventAvailable,
  MdCheckCircle,
} from "react-icons/md";

import StatsCard from "../components/StatsCard";
import CustomersTable from "../components/CustomersTable";
import AppointmentsTable from "../components/AppointmentsTable";
import CustomerModal from "../components/CustomerModal";
import AppointmentsModal from "../components/AppointmentModal";

export default function CustomerAppointments() {
  const [activeTab, setActiveTab] = useState("customers");
  const [search, setSearch] = useState("");

  // 🔹 CUSTOMER STATE
  const [customers, setCustomers] = useState([
    {
      name: "Rohit Sharma",
      vehicle: "Honda City",
      phone: "+91 98765 11111",
      email: "rohit@example.com",
      appointments: 12,
      lastVisit: "2024-12-15",
      status: "Active",
    },
    {
      name: "Rahul",
      vehicle: "BMW 330LI",
      phone: "+91 9848264113",
      email: "rahul@example.com",
      appointments: 10,
      lastVisit: "2024-12-20",
      status: "Active",
    },
    {
      name: "Snehith",
      vehicle: "Honda Amaze",
      phone: "+91 7671924568",
      email: "snehith@example.com",
      appointments: 14,
      lastVisit: "2024-12-18",
      status: "Inactive",
    },
  ]);

  // 🔹 APPOINTMENT STATE
  const [appointments, setAppointments] = useState([
    {
      customer: "Rohit Sharma",
      service: "Car Service",
      branch: "Mumbai Central",
      date: "2024-12-20",
      time: "10:30 AM",
      status: "Scheduled",
    },
    {
      customer: "Rahul",
      service: "General Service",
      branch: "Chennai Central",
      date: "2024-12-22",
      time: "9:30 AM",
      status: "Scheduled",
    },
    {
      customer: "Snehith",
      service: "Oil Change",
      branch: "Hyderabad Central",
      date: "2024-12-27",
      time: "10:00 AM",
      status: "Scheduled",
    },
  ]);

  // 🔹 MODAL STATES
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);

  // 📤 EXPORT CSV
  const handleExport = () => {
    const data = activeTab === "customers" ? customers : appointments;
    if (!data.length) return;

    const csv =
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row) => Object.values(row).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      activeTab === "customers"
        ? "customers_export.csv"
        : "appointments_export.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer & Appointments</h1>
          <p className="text-gray-500">
            Customer database, multi-branch booking, send notifications
          </p>
        </div>

        <div className="flex gap-4">
          {/* ADD CUSTOMER */}
          <button
            onClick={() => {
              setEditCustomer(null);
              setOpenCustomerModal(true);
            }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 transition-colors duration-200 text-white px-5 py-3 rounded-xl"
          >
            <MdAdd /> Add Customer
          </button>

          {/* BOOK APPOINTMENT */}
          <button
            onClick={() => {
              setEditAppointment(null);
              setOpenAppointmentModal(true);
            }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 transition-colors duration-200 text-white px-5 py-3 rounded-xl"
          >
            <MdCalendarToday /> Book Appointment
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard
          title="Total Customers"
          value={customers.length}
          icon={<MdPeople />}
          bg="bg-pink-100 text-pink-600"
        />
        <StatsCard
          title="Total Appointments"
          value={appointments.length}
          icon={<MdCalendarToday />}
          bg="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Scheduled"
          value={appointments.filter((a) => a.status === "Scheduled").length}
          icon={<MdEventAvailable />}
          bg="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Completed"
          value={appointments.filter((a) => a.status === "Completed").length}
          icon={<MdCheckCircle />}
          bg="bg-purple-100 text-purple-600"
        />
      </div>

      {/* TABS */}
      <div className="flex gap-4">
        {["customers", "appointments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-medium border ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLES */}
      {activeTab === "customers" && (
        <CustomersTable
          customers={customers}
          search={search}
          setSearch={setSearch}
          onExport={handleExport}
          onDelete={(i) =>
            setCustomers(customers.filter((_, idx) => idx !== i))
          }
          onEdit={(c) => {
            setEditCustomer(c);
            setOpenCustomerModal(true);
          }}
        />
      )}

      {activeTab === "appointments" && (
        <AppointmentsTable
          appointments={appointments}
          search={search}
          setSearch={setSearch}
          onExport={handleExport}
          onEdit={(a) => {
            setEditAppointment(a);
            setOpenAppointmentModal(true);
          }}
          onDelete={(i) =>
            setAppointments(appointments.filter((_, idx) => idx !== i))
          }
        />
      )}

      {/* CUSTOMER MODAL (ADD + EDIT) */}
      <CustomerModal
        open={openCustomerModal}
        data={editCustomer}
        onClose={() => {
          setEditCustomer(null);
          setOpenCustomerModal(false);
        }}
        onAdd={(c) => setCustomers([...customers, c])}
        onUpdate={(updated) =>
          setCustomers(
            customers.map((c) => (c === editCustomer ? updated : c))
          )
        }
      />

      {/* APPOINTMENT MODAL */}
      <AppointmentsModal
        open={openAppointmentModal}
        data={editAppointment}
        customers={customers}
        onClose={() => setOpenAppointmentModal(false)}
        onAdd={(a) => setAppointments([...appointments, a])}
        onUpdate={(a) =>
          setAppointments(
            appointments.map((x) => (x === editAppointment ? a : x))
          )
        }
      />
    </div>
  );
}
