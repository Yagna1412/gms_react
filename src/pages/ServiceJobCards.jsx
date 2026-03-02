import { useState } from "react";
import {
  MdAdd,
  MdBuild,        // 🛠 Total Services
  MdAssignment,  // 📋 Total Job Cards
  MdTrendingUp,  // 📈 In Progress
  MdFactCheck,   // 🧾 Avg Quality
} from "react-icons/md";

import StatsCard from "../components/StatsCard";
import JobCardsTable from "../components/JobCardsTable";
import ServicesTable from "../components/ServicesTable";
import JobCardModal from "../components/JobCardModal";
import ServiceModal from "../components/ServiceModal";

export default function ServiceJobCards() {
  const [activeTab, setActiveTab] = useState("jobcards");

  /* ===================== DATA ===================== */
  const [services, setServices] = useState([
    { name: "General Service", price: 2500, status: "Active" },
    { name: "Oil Change", price: 1200, status: "Active" },
    { name: "Brake Repair", price: 3500, status: "Inactive" },
  ]);

  const [customers] = useState([
    { name: "Rohit Sharma" },
    { name: "Priya Nair" },
    { name: "Karan Mehta" },
  ]);

  const [jobCards, setJobCards] = useState([
    {
      id: "JC001",
      customer: "Rohit Sharma",
      service: "General Service",
      branch: "Mumbai Central",
      technician: "Arjun Patel",
      progress: 65,
      status: "In Progress",
    },
    {
      id: "JC002",
      customer: "Priya Nair",
      service: "Oil Change",
      branch: "Bangalore Tech",
      technician: "Anjali Gupta",
      progress: 0,
      status: "Pending",
    },
  ]);

  /* ===================== MODALS ===================== */
  const [openJobCardModal, setOpenJobCardModal] = useState(false);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [editJobCard, setEditJobCard] = useState(null);
  const [editService, setEditService] = useState(null);

  /* ===================== UI ===================== */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service & Job Cards</h1>
          <p className="text-gray-500">
            Define services, monitor job cards, and track service quality
          </p>
        </div>

        <div className="flex gap-4">
          {/* ADD SERVICE */}
          <button
            onClick={() => {
              setEditService(null);
              setOpenServiceModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            <MdAdd /> Add Service
          </button>

          {/* CREATE JOB CARD */}
          <button
            onClick={() => {
              setEditJobCard(null);
              setOpenJobCardModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            <MdAdd /> Create Job Card
          </button>
        </div>
      </div>

      {/* KPI CARDS (MATCHES DESIGN) */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard
          title="Total Services"
          value={services.length}
          icon={<MdBuild size={22} />}
          bg="bg-yellow-100 text-yellow-600"
        />

        <StatsCard
          title="Total Job Cards"
          value={jobCards.length}
          icon={<MdAssignment size={22} />}
          bg="bg-blue-100 text-blue-600"
        />

        <StatsCard
          title="In Progress"
          value={jobCards.filter(j => j.status === "In Progress").length}
          icon={<MdTrendingUp size={22} />}
          bg="bg-green-100 text-green-600"
        />

        <StatsCard
          title="Avg Quality"
          value="95%"
          icon={<MdFactCheck size={22} />}
          bg="bg-purple-100 text-purple-600"
        />
      </div>

      {/* TABS */}
      <div className="flex gap-4">
        {["jobcards", "services"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-medium border ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {tab === "jobcards" ? "Job Cards" : "Services"}
          </button>
        ))}
      </div>

      {/* TABLES */}
      {activeTab === "jobcards" && (
        <JobCardsTable
          jobCards={jobCards}
          onEdit={(jc) => {
            setEditJobCard(jc);
            setOpenJobCardModal(true);
          }}
          onDelete={(i) =>
            setJobCards(jobCards.filter((_, idx) => idx !== i))
          }
        />
      )}

      {activeTab === "services" && (
        <ServicesTable
          services={services}
          onEdit={(s) => {
            setEditService(s);
            setOpenServiceModal(true);
          }}
          onDelete={(i) =>
            setServices(services.filter((_, idx) => idx !== i))
          }
        />
      )}

      {/* MODALS */}
      <JobCardModal
        open={openJobCardModal}
        data={editJobCard}
        customers={customers}
        services={services}
        onClose={() => setOpenJobCardModal(false)}
        onAdd={(jc) =>
          setJobCards([
            ...jobCards,
            { ...jc, id: `JC00${jobCards.length + 1}` },
          ])
        }
        onUpdate={(updated) =>
          setJobCards(jobCards.map(j => (j === editJobCard ? updated : j)))
        }
      />

      <ServiceModal
        open={openServiceModal}
        data={editService}
        onClose={() => setOpenServiceModal(false)}
        onAdd={(s) => setServices([...services, s])}
        onUpdate={(s) =>
          setServices(services.map(x => (x === editService ? s : x)))
        }
      />
    </div>
  );
}
