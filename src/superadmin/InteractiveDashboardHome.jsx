import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from 'sonner';
import {
  Building2,
  GitBranch,
  Users,
  UserCheck,
  ClipboardList,
  IndianRupee,
  AlertCircle,
  TrendingUp,
  Activity,
  Package,
  Clock,
  MapPin,
  ChevronRight,
  Download,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';

export default function InteractiveDashboardHome({ onNavigate }) {
  const { stats, branches, approvals, approveRequest, rejectRequest } = useDashboard();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedKPI, setSelectedKPI] = useState(null);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
      }, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    setLastRefresh(new Date());
    toast.success('Dashboard refreshed', {
      description: `Last updated: ${new Date().toLocaleTimeString()}`
    });
  };

  const handleDownloadRevenue = () => {
    const headers = ['Branch', 'Revenue', 'Status'];
    const rows = revenueData.map(r => [r.branch, r.revenue, r.status]);

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
    a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Revenue report downloaded');
  };

  const handleApprove = (id) => {
    approveRequest(id);
    toast.success('Request approved successfully');
  };

  const handleRejectClick = (id) => {
    setShowRejectModal(id);
    setRejectReason('');
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectRequest(showRejectModal, rejectReason);
    toast.success('Request rejected');
    setShowRejectModal(null);
    setRejectReason('');
  };

  const handleToggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.info(autoRefresh ? 'Auto-refresh disabled' : 'Auto-refresh enabled');
  };

  const handleKPIClick = (kpi) => {
    setSelectedKPI(kpi);
    toast.info(`Viewing ${kpi.label}`, {
      description: 'Click the card again to navigate to detailed view'
    });

    // Navigate to relevant section
    if (kpi.navigationTarget) {
      setTimeout(() => {
        onNavigate?.(kpi.navigationTarget);
      }, 1000);
    }
  };

  const kpiData = [
    {
      label: 'Total Organizations',
      value: stats.totalOrganizations,
      icon: Building2,
      change: '+2',
      color: 'blue',
      navigationTarget: 'organizations',
      details: 'Active organizations across all regions'
    },
    {
      label: 'Total Branches',
      value: stats.totalBranches,
      icon: GitBranch,
      change: '+8',
      color: 'purple',
      subtext: `${stats.activeBranches} Active / ${stats.totalBranches - stats.activeBranches} Inactive`,
      navigationTarget: 'branches',
      details: 'Branch locations worldwide'
    },
    {
      label: 'Total Employees',
      value: stats.totalEmployees.toLocaleString(),
      icon: Users,
      change: '+24',
      color: 'green',
      navigationTarget: 'users',
      details: 'Employees across all branches'
    },
    {
      label: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: UserCheck,
      change: '+234',
      color: 'indigo',
      details: 'Registered customers'
    },
    {
      label: 'Active Job Cards',
      value: stats.activeJobs,
      icon: ClipboardList,
      change: '-5',
      color: 'orange',
      details: 'Currently in progress'
    },
    {
      label: 'MTD Revenue',
      value: `₹${(stats.mtdRevenue / 100000).toFixed(1)}L`,
      icon: IndianRupee,
      change: '+12%',
      color: 'green',
      details: 'Month-to-date revenue'
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: AlertCircle,
      change: '+7',
      color: 'red',
      urgent: stats.pendingApprovals > 0,
      navigationTarget: 'approvals',
      details: 'Requires immediate attention'
    },
    {
      label: 'System Health',
      value: `${stats.systemHealth}%`,
      icon: Activity,
      change: 'Stable',
      color: 'green',
      navigationTarget: 'system',
      details: 'All systems operational'
    }
  ];



  const revenueData = branches
    .filter(b => b.status === 'Active')
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map(branch => ({
      branch: branch.name,
      revenue: branch.revenue,
      status: branch.revenue > 600000 ? 'high' : branch.revenue > 300000 ? 'medium' : 'low'
    }));


  const liveOperations = [
    { label: 'Jobs In Progress', value: '47', color: 'blue', icon: Activity },
    { label: 'Customers Waiting', value: '12', color: 'orange', icon: Clock },
    { label: 'Inventory Alerts', value: '8', color: 'red', icon: Package },
    { label: 'Active Users', value: '324', color: 'green', icon: Users }
  ];

  const alerts = [
    { type: 'critical', message: 'Database backup failed at Chennai Marina branch', time: '5 mins ago', action: 'Investigate' },
    { type: 'warning', message: 'High API latency detected in North Region', time: '12 mins ago', action: 'Monitor' },
    { type: 'info', message: 'New branch registration: Jaipur Pink City', time: '1 hour ago', action: 'Review' }
  ];

  const pendingApprovalsList = approvals
    .filter(a => a.status === 'Pending')
    .slice(0, 5)
    .map(approval => ({
      id: approval.id,
      requester: approval.requester,
      branch: approval.branch,
      amount: `₹${approval.amount.toLocaleString()}`,
      type: approval.type,
      priority: approval.priority,
      sla: approval.sla,
      status: approval.status
    }));



  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <div className="p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-3xl text-foreground mb-1">Super Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleAutoRefresh}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-semibold ${autoRefresh
              ? 'border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400'
              : 'border-border bg-card text-muted-foreground'
              }`}
          >
            <Activity className="w-4 h-4" />
            {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
          </button>
          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all active:scale-95 text-sm font-semibold shadow-sm shadow-primary/20"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Now
          </button>
        </div>
      </div>
      {/* KPI Cards Grid - Now Interactive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = kpi.change.startsWith('+');

          // Map colors to reliable Tailwind classes
          const colorClasses = {
            blue: 'text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/20 shadow-blue-500/5',
            purple: 'text-purple-500 bg-purple-500/10 group-hover:bg-purple-500/20 shadow-purple-500/5',
            green: 'text-green-500 bg-green-500/10 group-hover:bg-green-500/20 shadow-green-500/5',
            indigo: 'text-indigo-500 bg-indigo-500/10 group-hover:bg-indigo-500/20 shadow-indigo-500/5',
            orange: 'text-orange-500 bg-orange-500/10 group-hover:bg-orange-500/20 shadow-orange-500/5',
            red: 'text-red-500 bg-red-500/10 group-hover:bg-red-500/20 shadow-red-500/5'
          };

          const currentColor = colorClasses[kpi.color] || colorClasses.blue;

          return (
            <button
              key={index}
              onClick={() => handleKPIClick(kpi)}
              className={`bg-card rounded-2xl p-6 shadow-sm border text-left flex flex-col h-full ${kpi.urgent ? 'border-destructive/50 ring-2 ring-destructive/10' : 'border-border'
                } hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden min-h-[160px]`}
            >
              {/* Decorative background element */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl group-hover:opacity-20 opacity-10 transition-opacity bg-current ${currentColor.split(' ')[0]}`} />

              <div className="flex items-start justify-between mb-auto relative z-10 w-full pb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${currentColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                    {kpi.change}
                  </span>
                  {kpi.navigationTarget && (
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors mt-1" />
                  )}
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <div className="text-3xl font-bold text-kpi-value mb-1">{kpi.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{kpi.label}</div>

                {/* Reserved space for subtext to maintain alignment */}
                <div className="h-5 mt-2 overflow-hidden">
                  {kpi.subtext ? (
                    <div className="text-[11px] text-muted-foreground/70 font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                      {kpi.subtext}
                    </div>
                  ) : (
                    <div className="text-[11px] text-transparent select-none">Placeholder</div>
                  )}
                </div>

                <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                  <div className="text-xs text-muted-foreground/60 mt-2 pt-2 border-t border-border/50 italic">
                    {kpi.details}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Analytics */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-kpi-value mb-1">Revenue by Branch</h2>
              <p className="text-sm text-muted-foreground">Current month performance</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleManualRefresh}
                className="p-2 hover:bg-muted rounded-lg transition-colors group"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
              <button
                onClick={handleDownloadRevenue}
                className="p-2 hover:bg-muted rounded-lg transition-colors group"
                title="Download report"
              >
                <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {revenueData.map((item, index) => (
              <div key={index} className="group cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-semibold text-foreground truncate">{item.branch}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-bold text-foreground">₹{(item.revenue / 100000).toFixed(1)}L</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.status === 'high' ? 'bg-green-500/10 text-green-600' :
                      item.status === 'medium' ? 'bg-blue-500/10 text-blue-600' :
                        'bg-muted text-muted-foreground'
                      }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${item.status === 'high' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                      item.status === 'medium' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' :
                        'bg-muted-foreground/30'
                      }`}
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate?.('branches')}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg text-foreground/70 hover:bg-muted hover:border-border transition-all font-semibold text-sm"
          >
            View All Branches
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Live Operations */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h2 className="font-bold text-kpi-value mb-1">Live Operations</h2>
          <p className="text-sm text-muted-foreground mb-6">Real-time activity monitoring</p>

          <div className="space-y-4">
            {liveOperations.map((op, index) => {
              const Icon = op.icon;
              return (
                <div key={index} className="p-4 bg-muted/30 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${op.color}-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 text-${op.color}-500`} />
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">{op.label}</div>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{op.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Last Updated</div>
                <div className="text-sm font-semibold text-foreground">{lastRefresh.toLocaleTimeString()}</div>
              </div>
              <Activity className={`w-5 h-5 ${autoRefresh ? 'text-green-500 animate-pulse' : 'text-muted-foreground/30'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-kpi-value mb-1">Quick Approvals</h2>
              <p className="text-sm text-muted-foreground">{pendingApprovalsList.length} pending requests</p>
            </div>
            <button
              onClick={() => onNavigate?.('approvals')}
              className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingApprovalsList.map((approval) => (
              <div key={approval.id} className="p-4 border border-border bg-card rounded-xl hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground text-sm">{approval.requester}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${approval.priority === 'High' ? 'bg-red-500/10 text-red-600' :
                        approval.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                        {approval.priority}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">{approval.branch}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{approval.amount}</div>
                    <div className="text-[10px] text-muted-foreground/60 font-bold uppercase">{approval.type}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={() => handleRejectClick(approval.id)}
                    className="w-full sm:flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-xs font-bold uppercase"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(approval.id)}
                    className="w-full sm:flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors text-xs font-bold uppercase"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>
                </div>
              </div>
            ))}

            {pendingApprovalsList.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No pending approvals</p>
              </div>
            )}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-kpi-value mb-1">System Alerts</h2>
              <p className="text-sm text-muted-foreground">{alerts.length} active alerts</p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-l-4 ${alert.type === 'critical' ? 'bg-destructive/10 border-destructive' :
                  alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500' :
                    'bg-primary/10 border-primary'
                  } hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-foreground mb-1 break-words">{alert.message}</div>
                    <div className="text-xs text-muted-foreground font-medium">{alert.time}</div>
                  </div>
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 ${alert.type === 'critical' ? 'text-destructive' :
                    alert.type === 'warning' ? 'text-yellow-500' :
                      'text-primary'
                    }`} />
                </div>
                <button className={`w-full sm:w-auto text-[10px] font-bold uppercase px-4 py-2 rounded-lg transition-all active:scale-95 ${alert.type === 'critical' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' :
                  alert.type === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                    'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}>
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {
        showRejectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 sm:p-8">
            <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl transform transition-all animate-in slide-in-from-bottom sm:zoom-in overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">Reject Request</h2>
                    <p className="text-sm text-muted-foreground mt-1">Provide a reason for rejection</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="4"
                  placeholder="Enter detailed reason..."
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
                <button
                  onClick={() => {
                    setShowRejectModal(null);
                    setRejectReason('');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 border border-border rounded-lg font-bold text-xs uppercase text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectConfirm}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-destructive text-destructive-foreground rounded-lg font-bold text-xs uppercase hover:bg-destructive/90 shadow-lg shadow-destructive/20 transition-all active:scale-95"
                >
                  <XCircle className="w-4 h-4" />
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
