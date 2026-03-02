import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Clock, Filter, Search, FileText, Eye } from 'lucide-react';

export default function ApprovalCenter() {
  const { approvals, approveRequest, rejectRequest } = useDashboard();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');

  const filteredRequests = pendingApprovals.filter(req => {
    const matchesPriority = filterPriority === 'all' || req.priority === filterPriority;
    const matchesType = filterType === 'all' || req.type === filterType;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = String(req.requester).toLowerCase().includes(searchLower) ||
      String(req.id).toLowerCase().includes(searchLower) ||
      String(req.branch).toLowerCase().includes(searchLower);

    return matchesPriority && matchesType && matchesSearch;
  });

  const handleApprove = (id) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      approveRequest(id);
      toast.success('Request approved successfully');
      setSelectedRequest(null);
    }
  };

  const handleReject = (id) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectRequest(id, rejectReason);
    toast.success('Request rejected');
    setShowRejectModal(null);
    setRejectReason('');
    setSelectedRequest(null);
  };

  const formatTimeSLA = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins} mins ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
      }
    } catch (e) {
      return isoString;
    }
  };

  const priorityColors = {
    'High': 'bg-red-50 text-red-700 border-red-200',
    'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Low': 'bg-gray-50 text-gray-700 border-gray-200'
  };

  const typeIcons = {
    'Capital Expense': '💰',
    'Discount Approval': '🏷️',
    'Refund Request': '↩️',
    'Vendor Payment': '🧾',
    'New Hire': '👤'
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-bold text-black mb-2">Approval Center</h1>
        <p className="text-gray-600 text-sm">Review and process pending approval requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Approvals</span>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-black">{pendingApprovals.length}</div>
          <div className="text-xs text-orange-600 mt-1">Requires action</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Urgent Requests</span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-black">{pendingApprovals.filter(r => r.priority === 'High').length}</div>
          <div className="text-xs text-red-600 mt-1">High priority</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Approval Time</span>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-black">4.2 hours</div>
          <div className="text-xs text-gray-600 mt-1">This week</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Today Approved</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-black">12</div>
          <div className="text-xs text-green-600 mt-1">+3 from yesterday</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, requester, or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary/50 transition-all"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent hover:border-[#2563EB]/50 transition-all"
          >
            <option value="all">All Types</option>
            <option value="Capital Expense">Capital Expense</option>
            <option value="Discount Approval">Discount Approval</option>
            <option value="Refund Request">Refund Request</option>
            <option value="Vendor Payment">Vendor Payment</option>
            <option value="New Hire">New Hire</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent hover:border-[#2563EB]/50 transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Approval Requests */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
                <div className="flex items-start gap-4 flex-1 w-full">
                  <div className="text-4xl">{typeIcons[request.type]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-black">{request.description}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${priorityColors[request.priority]}`}>
                        {request.priority} Priority
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                      <span><strong>ID:</strong> {request.id}</span>
                      <span><strong>Type:</strong> {request.type}</span>
                      <span><strong>Branch:</strong> {request.branch}</span>
                      <span><strong>Requester:</strong> {request.requester}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{request.justification}</p>

                    {/* Approval Chain */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">Approval Chain:</span>
                      <div className="flex items-center gap-2">
                        {request.approvalChain.map((step, idx) => (
                          <div key={idx} className="contents">
                            <span className={`text-xs px-2 py-1 rounded ${step.includes('✓') ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700 font-semibold'
                              }`}>
                              {step}
                            </span>
                            {idx < request.approvalChain.length - 1 && (
                              <span className="text-gray-400">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <span className="text-xs text-gray-500 block mb-2 font-semibold uppercase tracking-wider">
                        Attached Documents ({request.documents || 0})
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[...Array(request.documents || 0)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded group-hover:bg-white transition-colors">
                                <FileText className="w-4 h-4 text-gray-600 group-hover:text-[#2563EB]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">document_0{i + 1}.pdf</p>
                                <p className="text-[10px] text-gray-500">2.4 MB • PDF File</p>
                              </div>
                            </div>
                            <Eye className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB]" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Submitted: {formatDate(request.submittedOn)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {request.documents} documents attached
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-1 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
                  <div className="text-2xl font-bold text-black">₹{request.amount.toLocaleString('en-IN')}</div>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${request.sla < 180 ? 'text-red-600' : 'text-orange-600'
                    }`}>
                    <Clock className="w-3 h-3" />
                    SLA: {formatTimeSLA(request.sla)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRejectModal(request.id)}
                    className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-black mb-1">No Results Found</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              We couldn't find any approval requests matching "{searchTerm}". Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterPriority('all');
              }}
              className="mt-6 text-primary font-semibold text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-black">{selectedRequest.description}</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedRequest.id}</p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Amount</span>
                  <span className="text-2xl font-bold text-black">₹{selectedRequest.amount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Priority</span>
                  <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold border ${priorityColors[selectedRequest.priority]}`}>
                    {selectedRequest.priority}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Requester</span>
                  <span className="text-sm font-medium text-black">{selectedRequest.requester}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Branch</span>
                  <span className="text-sm font-medium text-black">{selectedRequest.branch}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500 block mb-2">Justification</span>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedRequest.justification}</p>
              </div>

              <div>
                <span className="text-xs text-gray-500 block mb-2">Approval Chain</span>
                <div className="space-y-2">
                  {selectedRequest.approvalChain.map((step, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${step.includes('✓') ? 'bg-green-50' : 'bg-yellow-50'
                      }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.includes('✓') ? 'bg-green-500' : 'bg-yellow-500'
                        }`}>
                        {step.includes('✓') ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Clock className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(selectedRequest.id); // Open the Reason Modal
                  setSelectedRequest(null); // Close the Details Modal so they don't overlap
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-black">Reject Request</h2>
                  <p className="text-sm text-gray-600 mt-1">{showRejectModal}</p>
                </div>
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <span className="text-xs text-gray-500 block mb-2">Reason for Rejection</span>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent hover:border-[#2563EB]/50 transition-all"
                  placeholder="Enter the reason for rejection..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button
                onClick={() => setShowRejectModal(null)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}