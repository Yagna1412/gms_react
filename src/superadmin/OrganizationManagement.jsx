import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from 'sonner';
import { Building2, Plus, Search, Eye, Edit, Settings, MapPin, Calendar, IndianRupee, Trash2, Download, GitBranch } from 'lucide-react';

export default function OrganizationManagement({ onNavigate }) {
  const { organizations, addOrganization, updateOrganization, deleteOrganization, stats, setSelectedOrgForBranch } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [viewingOrg, setViewingOrg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    address: '',
    financialYear: '2024-2025',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Organization name is required";
    if (!formData.taxId.trim()) {
      newErrors.taxId = "Tax ID (GST) is required";
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.taxId.trim())) {
      newErrors.taxId = "Invalid GST format (e.g., 27AABCU9603R1ZM)";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filteredOrgs = organizations.filter(org => {
    if (org.status === 'Deleted') return false;
    return org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete organization: ${name}?`)) {
      deleteOrganization(id);
      toast.success(`Organization ${name} deleted successfully`);
    }
  };

  const handleViewDetails = (org) => {
    setViewingOrg(org);
  };

  const handleEdit = (org) => {
    setEditingOrg(org);
  };

  const handleSettings = (org) => {
    toast.info(`Opening settings for ${org.name}`);
    // Future: Open settings modal
  };

  const handleExport = () => {
    const headers = ['Org ID', 'Name', 'UUID', 'Tax ID', 'Address', 'Financial Year', 'Branches', 'Employees', 'Revenue', 'Status'];

    const rows = filteredOrgs.map(o => [
      o.id || '',
      o.name || '',
      o.uuid || '',
      o.taxId || '',
      o.address || '',
      o.financialYear || '',
      o.branches || 0,
      o.employees || 0,
      o.revenue || 0,
      o.status || ''
    ]);

    const csvContent = [
      headers,
      ...rows
    ].map(row =>
      row.map(value => {
        const strValue = String(value === null || value === undefined ? '' : value)
          .replace(/\r?\n|\r/g, ' ')
          .trim();
        return `"${strValue.replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `organizations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Organizations exported successfully');
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Organization Management</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage all organizations in the system</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-semibold text-sm"
          >
            <Download className="w-5 h-5" />
            Export Organizations
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-semibold text-sm"
          >
            <Plus className="w-5 h-5" />
            Add Organization
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Organizations</span>
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-kpi-value">{stats.totalOrganizations}</div>
          <div className="text-xs text-green-600 mt-1 font-bold">Active across system</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Branches</span>
            <MapPin className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-kpi-value">{stats.totalBranches}</div>
          <div className="text-xs text-muted-foreground mt-1 font-bold">Across all orgs</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
            <IndianRupee className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-kpi-value">₹{(stats.mtdRevenue / 10000000).toFixed(1)}Cr</div>
          <div className="text-xs text-green-600 mt-1 font-bold">MTD Performance</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Compliance Rate</span>
            <Calendar className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-kpi-value">{stats.systemHealth}%</div>
          <div className="text-xs text-green-600 mt-1 font-bold">Uptime SLA</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search organizations by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Organization Cards */}
      <div className="space-y-4 pb-20">
        {filteredOrgs.length > 0 ? (
          filteredOrgs.map((org, index) => (
            <div key={index} className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{org.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 font-mono uppercase tracking-tight">{org.id}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-muted-foreground/60" />
                      <span className="line-clamp-1">{org.address}</span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full self-start">
                  {org.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6 py-4 border-y border-gray-50">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1 uppercase font-bold">UUID</span>
                  <span className="text-sm font-mono text-muted-foreground">{org.uuid.slice(0, 8)}...</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1 uppercase font-bold">Tax ID</span>
                  <span className="text-sm font-medium text-foreground">{org.taxId}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1 uppercase font-bold">Fin. Year</span>
                  <span className="text-sm font-medium text-foreground">{org.financialYear}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1 uppercase font-bold">Branches</span>
                  <span className="text-sm font-bold text-foreground">{org.branches}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1 uppercase font-bold">Employees</span>
                  <span className="text-sm font-bold text-foreground">{org.employees}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Revenue: </span>
                  <span className="font-bold text-foreground">{org.revenue}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors text-xs font-bold"
                    onClick={() => {
                      setSelectedOrgForBranch(org);
                      onNavigate('branches');
                    }}
                  >
                    <GitBranch className="w-4 h-4" />
                    Add Branch
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs font-bold text-muted-foreground" onClick={() => handleViewDetails(org)}>
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs font-bold text-muted-foreground" onClick={() => handleEdit(org)}>
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs font-bold text-muted-foreground" onClick={() => handleSettings(org)}>
                    <Settings className="w-4 h-4" />
                    Config
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs font-bold" onClick={() => handleDelete(org.id, org.name)}>
                    <Trash2 className="w-4 h-4" />
                    Delete
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
            <h3 className="text-lg font-bold text-black mb-1">No Organizations Found</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              We couldn't find any organizations matching "{searchTerm}". Try adjusting your search term.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 text-primary font-semibold text-sm hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>



      {/* View Details Modal */}
      {viewingOrg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 rounded-t-2xl shrink-0">
              <h2 className="font-bold text-foreground">Organization Details</h2>
              <p className="text-sm text-muted-foreground mt-1">Viewing details for {viewingOrg.name}</p>
            </div>
            <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Organization ID</label>
                  <p className="text-sm font-medium text-foreground bg-muted/30 p-2 rounded-lg break-words">{viewingOrg.id}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">UUID</label>
                  <p className="text-sm font-mono text-muted-foreground bg-muted/30 p-2 rounded-lg break-all">{viewingOrg.uuid}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Organization Name</label>
                  <p className="text-sm font-bold text-foreground break-words">{viewingOrg.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Tax ID (GST)</label>
                  <p className="text-sm font-bold text-foreground break-words">{viewingOrg.taxId}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Address</label>
                  <p className="text-sm text-foreground break-words leading-relaxed">{viewingOrg.address}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Financial Year</label>
                  <p className="text-sm font-bold text-foreground">{viewingOrg.financialYear}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</label>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${viewingOrg.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {viewingOrg.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-foreground">{viewingOrg.branches}</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Branches</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-foreground">{viewingOrg.employees}</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Employees</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-foreground">₹{(viewingOrg.revenue / 10000000).toFixed(1)}Cr</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Revenue</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setViewingOrg(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all shadow-sm shadow-primary/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingOrg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 rounded-t-2xl shrink-0">
              <h2 className="font-bold text-foreground">Edit Organization</h2>
              <p className="text-sm text-muted-foreground mt-1">Update organization details</p>
            </div>
            <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Organization Name *</label>
                  <input
                    type="text"
                    defaultValue={editingOrg.name}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Tax ID (GST) *</label>
                  <input
                    type="text"
                    defaultValue={editingOrg.taxId}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Address *</label>
                <textarea
                  defaultValue={editingOrg.address}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Financial Year *</label>
                  <select
                    defaultValue={editingOrg.financialYear}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Apr-Mar">April - March</option>
                    <option value="Jan-Dec">January - December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Status *</label>
                  <select
                    defaultValue={editingOrg.status}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setEditingOrg(null)}
                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-lg font-bold text-muted-foreground hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateOrganization(editingOrg.id, { lastModified: new Date().toISOString() });
                  toast.success('Organization updated successfully');
                  setEditingOrg(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col scrollbar-hide">
            <div className="p-6 border-b border-gray-200 rounded-t-2xl shrink-0">
              <h2 className="font-bold text-foreground">Add New Organization</h2>
              <p className="text-sm text-muted-foreground mt-1">Create a new organization in the system</p>
            </div>
            <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Organization Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Mantha Auto Services"
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${errors.name
                      ? 'border-red-500 bg-red-50 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                      }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Tax ID (GST) *</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    placeholder="e.g., 27AABCU9603R1ZM"
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${errors.taxId
                      ? 'border-red-500 bg-red-50 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                      }`}
                  />
                  {errors.taxId && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.taxId}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  rows="3"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${errors.address
                    ? 'border-red-500 bg-red-50 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                    }`}
                />
                {errors.address && <p className="text-[10px] text-red-500 mt-1 font-medium ml-1">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Financial Year *</label>
                  <select
                    value={formData.financialYear}
                    onChange={(e) => handleInputChange('financialYear', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="2024-2025">2024-2025 (Apr - Mar)</option>
                    <option value="2023-2024">2023-2024 (Apr - Mar)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ name: '', taxId: '', address: '', financialYear: '2024-2025', status: 'Active' });
                  setErrors({});
                }}
                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-lg font-bold text-muted-foreground hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (validateForm()) {
                    addOrganization(formData);
                    setSearchTerm('');
                    toast.success(`Organization "${formData.name}" created successfully`);
                    setShowCreateModal(false);
                    setFormData({ name: '', taxId: '', address: '', financialYear: '2024-2025', status: 'Active' });
                    setErrors({});
                  } else {
                    toast.error('Please fix the errors in the form');
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Create Organization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}