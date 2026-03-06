import React from "react";
import { Plus, Eye, ArrowUpRight, Trash2 } from "lucide-react";
import { useComplaintManagement } from "../useComplaintManagement";

export default function ComplaintManagement() {
  const {
    complaints,
    showModal,
    viewComplaint,
    formData,
    getSeverityColor,
    openModal,
    openComplaint,
    closeComplaint,
    updateFormField,
    handleSubmit,
    handleEscalate,
    handleDelete
  } = useComplaintManagement();

  

  return (
    <div className="p-4 sm:p-6 lg:p-8">
     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-bold text-lg sm:text-xl">
            Complaint Management
          </h1>
          <p className="text-sm text-gray-600">
            Register and track customer complaints
          </p>
        </div>

        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Register Complaint
        </button>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Complaints" value={complaints.length} />
        <Stat label="Pending" value={complaints.filter(c => c.status === "Pending").length} />
        <Stat label="Under Review" value={complaints.filter(c => c.status === "Under Review").length} />
        <Stat label="Resolved" value={complaints.filter(c => c.status === "Resolved").length} />
      </div>

      
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              {["ID", "Customer", "Category", "Severity", "Status", "Filed On", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {complaints.map((comp) => (
              <tr key={comp.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{comp.id}</td>
                <td className="px-4 py-3">{comp.customerName}</td>
                <td className="px-4 py-3">{comp.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(comp.severity)}`}>
                    {comp.severity}
                  </span>
                </td>
                <td className="px-4 py-3">{comp.status}</td>
                <td className="px-4 py-3">{comp.filedDate}</td>

                
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openComplaint(comp)}
                      className="p-2 rounded hover:bg-gray-100"
                      title="View"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>

                    {comp.status === "Pending" && (
                      <button
                        onClick={() => handleEscalate(comp.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        Escalate
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(comp.id)}
                      className="p-2 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {viewComplaint && (
        <Modal title="Complaint Details">
          <p><b>ID:</b> {viewComplaint.id}</p>
          <p><b>Customer:</b> {viewComplaint.customerName}</p>
          <p><b>Category:</b> {viewComplaint.category}</p>
          <p><b>Severity:</b> {viewComplaint.severity}</p>
          <p><b>Status:</b> {viewComplaint.status}</p>
          <p className="mt-2 text-sm text-gray-600">{viewComplaint.description}</p>

          <button
            onClick={closeComplaint}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg"
          >
            Close
          </button>
        </Modal>
      )}

      
      {showModal && (
        <Modal title="Register Complaint">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Customer ID *"
              value={formData.customerId}
              onChange={(e) => updateFormField("customerId", e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={(e) => updateFormField("customerName", e.target.value)}
              className="border p-2 rounded w-full"
            />

            <textarea
              rows="4"
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              className="border p-2 rounded w-full"
            />

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Register Complaint
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}



const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl p-5 border shadow-sm">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

const Modal = ({ title, children }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl w-full max-w-md p-4">
      <div className="border-b pb-2 mb-3">
        <h2 className="font-bold">{title}</h2>
      </div>
      {children}
    </div>
  </div>
);
