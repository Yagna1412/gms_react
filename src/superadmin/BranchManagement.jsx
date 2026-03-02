import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from 'sonner';
import {
    Plus,
    Search,
    Filter,
    Download,
    Edit,
    Trash2,
    Eye,
    MapPin,
    Phone,
    Mail,
    Star,
    TrendingUp,
    Users,
    Settings,
    ChevronRight,
    ChevronDown,
    Building2
} from 'lucide-react';
import BranchCreationWizard from './BranchCreationWizard';
import BranchDetails from './BranchDetails';

const categoryColors = {
    'Main Branch': 'bg-primary/10 text-primary',
    'Franchise': 'bg-purple-50 text-purple-700',
    'Sub Branch': 'bg-green-50 text-green-700',
    'Department': 'bg-blue-50 text-blue-700'
};

export default function BranchManagement() {
    const { branches, organizations, stats, deleteBranch, selectedOrgForBranch, setSelectedOrgForBranch } = useDashboard();
    // ... existing state ...
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('table'); // table or hierarchy
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Wizard State
    const [wizardOpen, setWizardOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [wizardMode, setWizardMode] = useState('create'); // create, edit, view
    const [expandedOrgs, setExpandedOrgs] = useState({});

    // Toggle Org expansion
    const toggleOrg = (orgId) => {
        setExpandedOrgs(prev => ({
            ...prev,
            [orgId]: !prev[orgId]
        }));
    };

    // Auto-expand all organizations on load
    useEffect(() => {
        const initialExpanded = {};
        organizations.forEach(org => {
            initialExpanded[org.id] = true;
        });
        setExpandedOrgs(initialExpanded);
    }, [organizations]);

    // Auto-open wizard if selectedOrgForBranch is set (create mode)
    useEffect(() => {
        if (selectedOrgForBranch) {
            setWizardMode('create');
            setSelectedBranch(null);
            setWizardOpen(true);
        }
    }, [selectedOrgForBranch]);

    const handleCreate = () => {
        setWizardMode('create');
        setSelectedBranch(null);
        setWizardOpen(true);
    };

    const handleView = (branch) => {
        // Just pass the raw branch object for the details view
        setSelectedBranch(branch);
        setWizardMode('view');
        setWizardOpen(true);
    };

    const handleEdit = (branch) => {
        const wizardData = {
            ...branch,
            branchName: branch.name,
            branchCode: branch.code,
        };
        setSelectedBranch(wizardData);
        setWizardMode('edit');
        setWizardOpen(true);
    };

    // ... (filters and logic) ...

    const filteredBranches = branches.filter(branch => {
        if (branch.status === 'Deleted') return false;
        const matchesSearch = (branch.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (branch.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (branch.location || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || branch.status.toLowerCase() === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBranches = filteredBranches.slice(indexOfFirstItem, indexOfLastItem);

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete branch: ${name}?`)) {
            deleteBranch(id);
            toast.success(`Branch ${name} deleted successfully`);
        }
    };

    // ... (export logic) ...

    const handleExport = () => {
        // Defined headers to match the data mapping below
        const headers = [
            'Branch Code',
            'Name',
            'Category',
            'Location',
            'Supervisor',
            'Phone',
            'Email',
            'Status',
            'Performance',
            'Active Jobs',
            'Revenue'
        ];

        // Map data ensuring we handle missing values and prevent column shifting
        const rows = filteredBranches.map(b => [
            b.code || '',
            b.name || '',
            b.category || '',
            b.location || '',
            b.supervisor || '',
            b.phone || '',
            b.email || '',
            b.status || '',
            b.performance || 0,
            b.activeJobs || 0,
            b.revenue || 0
        ]);

        // Build CSV string with proper escaping and Excel-friendly formatting
        const csvContent = [
            headers,
            ...rows
        ].map(row =>
            row.map(value => {
                // Remove potential newlines within fields that would break the CSV structure
                const strValue = String(value === null || value === undefined ? '' : value)
                    .replace(/\r?\n|\r/g, ' ')
                    .trim();
                // Escape quotes by doubling them and wrapping the entire field in quotes
                return `"${strValue.replace(/"/g, '""')}"`;
            }).join(',')
        ).join('\n');

        // Include Byte Order Mark (BOM) for UTF-8 and use the correct blob settings
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `branches-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success('Branches exported successfully');
    };

    if (wizardOpen) {
        if (wizardMode === 'view') {
            return <BranchDetails
                branch={selectedBranch}
                onEdit={handleEdit}
                onBack={() => {
                    setWizardOpen(false);
                    setSelectedBranch(null);
                    setSelectedOrgForBranch(null);
                }}
            />;
        }

        return <BranchCreationWizard
            onClose={() => {
                setWizardOpen(false);
                setSelectedBranch(null);
                setSelectedOrgForBranch(null);
            }}
            initialData={selectedBranch}
            mode={wizardMode}
        />;
    }

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Branch Management</h1>
                    <p className="text-muted-foreground text-sm">Manage all branches across organizations</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all font-bold text-sm shadow-lg shadow-primary/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Branch</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Total Branches', value: '156', icon: MapPin, color: 'text-primary', sub: '+8 this month', subColor: 'text-green-600' },
                    { label: 'Active Branches', value: '142', icon: TrendingUp, color: 'text-green-500', sub: '91% operational', subColor: 'text-muted-foreground' },
                    { label: 'Total Employees', value: '1,248', icon: Users, color: 'text-purple-500', sub: '+24 new hires', subColor: 'text-green-600' },
                    { label: 'Avg Performance', value: '4.5', icon: Star, color: 'text-yellow-500', sub: '+0.2 vs last month', subColor: 'text-green-600' }
                ].map((stat, i) => (
                    <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-sm transition-all group">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                            <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-kpi-value">{stat.value}</div>
                        <div className={`text-[10px] font-bold ${stat.subColor} uppercase mt-2`}>{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                <div className="flex flex-col lg:flex-row items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by branch name, code, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-muted/30 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 bg-muted/30 border border-border rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        {/* View Mode Toggle */}
                        <div className="flex gap-1 border border-border rounded-xl p-1 bg-muted/20 flex-shrink-0">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${viewMode === 'table' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <span className="hidden sm:inline">Table</span>
                                <span className="sm:hidden">TBL</span>
                            </button>
                            <button
                                onClick={() => setViewMode('hierarchy')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${viewMode === 'hierarchy' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <span className="hidden sm:inline">Hierarchy</span>
                                <span className="sm:hidden">Hier</span>
                            </button>
                        </div>

                        {/* Additional Actions */}
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 border border-border rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground" title="Filter Settings">
                                <Filter className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleExport}
                                className="p-2.5 border border-border rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground"
                                title="Export Data"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Branch Content (Table or Hierarchy) */}
            {filteredBranches.length > 0 ? (
                viewMode === 'table' ? (
                    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full border-collapse min-w-[1000px] lg:min-w-0">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase">Branch Code</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase">Name</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase hidden md:table-cell">Category</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase">Location</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase hidden lg:table-cell">Supervisor</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase">Status</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase hidden sm:table-cell">Perf.</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase hidden xl:table-cell">Active Jobs</th>
                                        <th className="text-left py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase">Revenue</th>
                                        <th className="text-right py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentBranches.map((branch, index) => (
                                        <tr key={index} className="border-t border-border hover:bg-muted/30 transition-colors group">
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-bold text-foreground font-mono">{branch.code}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{branch.name}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium md:hidden">{branch.category}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 hidden md:table-cell">
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${categoryColors[branch.category]}`}>
                                                    {branch.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 max-w-[150px] md:max-w-xs">
                                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />
                                                    <span className="text-xs text-foreground/80 truncate font-medium">{branch.location}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 hidden lg:table-cell">
                                                <span className="text-xs text-foreground/80 font-medium">{branch.supervisor}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase ${branch.status === 'Active'
                                                    ? 'bg-green-500/10 text-green-600'
                                                    : 'bg-muted text-muted-foreground'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${branch.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/40'
                                                        }`} />
                                                    {branch.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 hidden sm:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs font-bold text-foreground">{branch.performance}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 hidden xl:table-cell">
                                                <span className="text-xs font-bold text-foreground">{branch.activeJobs}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-bold text-foreground">{branch.revenue}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleView(branch)}
                                                        className="p-2 hover:bg-primary/10 rounded-xl transition-all text-muted-foreground hover:text-primary" title="View Details">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(branch)}
                                                        className="p-2 hover:bg-amber-500/10 rounded-xl transition-all text-muted-foreground hover:text-amber-600" title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(branch.id, branch.name)}
                                                        className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-muted-foreground hover:text-destructive" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 py-8 max-w-5xl mx-auto px-4">
                        {organizations.map(org => {
                            const orgBranches = currentBranches.filter(b => b.orgId === org.id);
                            if (orgBranches.length === 0) return null;
                            const isExpanded = expandedOrgs[org.id];

                            return (
                                <div key={org.id} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => toggleOrg(org.id)}
                                        className={`w-full flex items-center justify-between p-6 transition-colors ${isExpanded ? 'bg-muted/30' : 'hover:bg-muted/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl transition-all duration-300 ${isExpanded ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110' : 'bg-primary/10 text-primary'}`}>
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                                    {org.name}
                                                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase">{org.id}</span>
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase">
                                                        <Users className="w-3 h-3" />
                                                        {orgBranches.length} Branches
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 uppercase">
                                                        <TrendingUp className="w-3 h-3" />
                                                        ₹{(orgBranches.reduce((sum, b) => {
                                                            const rev = b?.revenue ? (typeof b.revenue === 'string'
                                                                ? parseFloat(b.revenue.replace(/[^0-9.-]+/g, "")) || 0
                                                                : b.revenue) : 0;
                                                            return sum + rev;
                                                        }, 0) / 10000000).toFixed(2)} Cr
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`p-2 rounded-lg bg-muted transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </button>

                                    {/* Accordion Content */}
                                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] border-t border-border opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                        <div className="p-4 space-y-3 bg-muted/5">
                                            {orgBranches.map((branch) => (
                                                <div key={branch.id} className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-card border border-border rounded-xl hover:border-primary/30 transition-all hover:shadow-md">
                                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                                        <div className={`p-2.5 rounded-lg shrink-0 ${categoryColors[branch.category] || 'bg-muted text-muted-foreground'}`}>
                                                            <MapPin className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                                                    {branch.name}
                                                                </h4>
                                                                <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded leading-none shrink-0 border border-border/50">
                                                                    {branch.code}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                                    <span className="font-bold text-foreground/80">{branch.performance}</span>
                                                                </div>
                                                                <div className="w-1 h-1 rounded-full bg-border" />
                                                                <div className="flex items-center gap-1 truncate max-w-[150px]">
                                                                    <Users className="w-3 h-3" />
                                                                    <span className="truncate">{branch.supervisor}</span>
                                                                </div>
                                                                <div className="w-1 h-1 rounded-full bg-border" />
                                                                <div className="font-bold text-foreground/80">
                                                                    {branch.revenue}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-border/50">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${branch.status === 'Active' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                                                            {branch.status}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleView(branch)}
                                                                className="p-2 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(branch)}
                                                                className="p-2 hover:bg-amber-500/10 rounded-lg text-muted-foreground hover:text-amber-600 transition-colors"
                                                                title="Edit Branch"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(branch.id, branch.name)}
                                                                className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                                                                title="Delete Branch"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                <div className="bg-white rounded-2xl p-12 border border-border shadow-sm text-center mb-8">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-1">No Branches Found</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                        We couldn't find any branches matching "{searchTerm}". Try adjusting your search term.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterStatus('all');
                        }}
                        className="mt-6 text-primary font-semibold text-sm hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {/* Pagination (Common for both views) */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-muted/20 gap-4">
                    <div className="text-[11px] font-bold text-muted-foreground uppercase">
                        Showing <span className="text-foreground">{Math.min(indexOfFirstItem + 1, filteredBranches.length)}-{Math.min(indexOfLastItem, filteredBranches.length)}</span> of <span className="text-foreground">{filteredBranches.length}</span> branches
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="flex-1 sm:flex-none px-6 py-2 border border-border rounded-xl text-[10px] font-bold text-muted-foreground hover:bg-card hover:text-foreground transition-all uppercase active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="flex-1 sm:flex-none px-6 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold hover:opacity-90 transition-all uppercase shadow-lg shadow-primary/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}