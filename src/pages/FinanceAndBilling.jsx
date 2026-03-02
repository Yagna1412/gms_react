import { useState } from "react";
import {
  MdAttachMoney,
  MdTrendingUp,
  MdPendingActions,
  MdReceiptLong,
} from "react-icons/md";

import StatsCard from "../components/StatsCard";
import InvoicesTable from "../components/InvoicesTable";
import InvoicePreviewModal from "../components/InvoicePreviewModal";
import CreateInvoiceModal from "../components/CreateInvoiceModal"; //  ADD THIS

export default function FinanceBilling() {
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  //  NEW MODAL STATE
  const [openCreate, setOpenCreate] = useState(false);

  const [invoices, setInvoices] = useState([
    {
      id: "INV-001",
      customer: "Rohit Sharma",
      branch: "Mumbai Central",
      amount: 2500,
      date: "2024-12-15",
      status: "Paid",
    },
    {
      id: "INV-002",
      customer: "Priya Nair",
      branch: "Bangalore Tech",
      amount: 1500,
      date: "2024-12-10",
      status: "Paid",
    },
    {
      id: "INV-003",
      customer: "Karan Mehta",
      branch: "Delhi NCR",
      amount: 4500,
      date: "2024-12-18",
      status: "Pending",
    },
  ]);

  /*  KPI CALCULATIONS */
  const totalRevenue = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const monthlyRevenue = 380000;
  const pendingPayments = invoices
    .filter((i) => i.status === "Pending")
    .reduce((sum, i) => sum + i.amount, 0);

  const taxCollected = 68000;
  const profit = 260000;

  //  ADD INVOICE FUNCTION
  const handleAddInvoice = (form) => {
    const newInvoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      ...form,
      amount: Number(form.amount),
      status: "Pending",
    };

    setInvoices([...invoices, newInvoice]);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Finance & Billing</h1>
          <p className="text-gray-500">
            Invoices/payments, tax compliance, and revenue tracking
          </p>
        </div>

        {/*  OPEN MODAL BUTTON */}
        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-xl"
        >
          + Create Invoice
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-5 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
          icon={<MdAttachMoney />}
          bg="bg-green-100 text-green-600"
        />

        <StatsCard
          title="Monthly Revenue"
          value={`₹${(monthlyRevenue / 100000).toFixed(1)}L`}
          icon={<MdTrendingUp />}
          bg="bg-blue-100 text-blue-600"
        />

        <StatsCard
          title="Pending Payments"
          value={`₹${pendingPayments / 1000}K`}
          icon={<MdPendingActions />}
          bg="bg-red-100 text-red-600"
        />

        <StatsCard
          title="Tax Collected"
          value={`₹${taxCollected / 1000}K`}
          icon={<MdReceiptLong />}
          bg="bg-purple-100 text-purple-600"
        />

        <StatsCard
          title="Profit"
          value={`₹${(profit / 100000).toFixed(1)}L`}
          icon={<MdTrendingUp />}
          bg="bg-green-100 text-green-600"
        />
      </div>

      {/* INVOICE TABLE */}
      <InvoicesTable
        invoices={invoices}
        onMarkPaid={(i) =>
          setInvoices(
            invoices.map((inv, idx) =>
              idx === i ? { ...inv, status: "Paid" } : inv
            )
          )
        }
        onView={(inv) => {
          setSelectedInvoice(inv);
          setOpenPreview(true);
        }}
      />

      {/* PREVIEW MODAL */}
      <InvoicePreviewModal
        open={openPreview}
        invoice={selectedInvoice}
        onClose={() => setOpenPreview(false)}
      />

      {/*  CREATE INVOICE MODAL */}
      <CreateInvoiceModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onAdd={handleAddInvoice}
      />
    </div>
  );
}
