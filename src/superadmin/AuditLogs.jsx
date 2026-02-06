import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from 'sonner';
import { FileText, Search, Filter, Download, Eye, Calendar, User, Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function AuditLogs() {
    const { auditLogs } = useDashboard();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('all');
    const [filterEntity, setFilterEntity] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedLog, setSelectedLog] = useState(null);

    const resultColors = {
        'Success': 'bg-green-50 text-green-700',
        'Failed': 'bg-red-50 text-red-700',
        'Warning': 'bg-yellow-50 text-yellow-700'
    };

    const filteredLogs = auditLogs.filter(log => {
        const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.entityId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = filterAction === 'all' || log.action === filterAction;
        const matchesEntity = filterEntity === 'all' || log.entity === filterEntity;

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const logDate = new Date(log.timestamp);
            const now = new Date();
            const diffHours = (now - logDate) / (1000 * 60 * 60);

            if (dateFilter === '24h' && diffHours > 24) matchesDate = false;
            if (dateFilter === '7d' && diffHours > 168) matchesDate = false;
            if (dateFilter === '30d' && diffHours > 720) matchesDate = false;
        }

        return matchesSearch && matchesAction && matchesEntity && matchesDate;
    });

    const handleExport = () => {
        const csv = [
            ['Timestamp', 'User', 'Action', 'Entity', 'Entity ID', 'Description', 'IP Address', 'Result'],
            ...filteredLogs.map(l => [
                new Date(l.timestamp).toISOString(),
                l.userName,
                l.action,
                l.entity,
                l.entityId,
                l.description,
                l.ipAddress,
                l.result
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success('Audit logs exported successfully');
    };

    const formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'Create': return 'bg-green-50 text-green-700';
            case 'Update': return 'bg-blue-50 text-blue-700';
            case 'Delete': return 'bg-red-50 text-red-700';
            case 'Approve': return 'bg-green-50 text-green-700';
            case 'Reject': return 'bg-red-50 text-red-700';
            default: return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-bold text-black mb-2">Audit Logs</h1>
                    <p className="text-gray-600 text-sm">Complete system activity trail for compliance and security</p>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-semibold">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export Logs</span>
                </button>
            </div>

            {/* Compliance Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                    🔒 <strong>Compliance:</strong> All logs are encrypted with AES-256 and retained for 7+ years. Logs are immutable and version-controlled.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total Actions</span>
                        <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-black">24,567</div>
                    <div className="text-xs text-gray-600 mt-1">Last 30 days</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Failed Actions</span>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-3xl font-bold text-black">45</div>
                    <div className="text-xs text-red-600 mt-1">0.18% failure rate</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Unique Users</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-black">342</div>
                    <div className="text-xs text-gray-600 mt-1">Active in period</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Security Events</span>
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-black">12</div>
                    <div className="text-xs text-orange-600 mt-1">Requires review</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by user, action, or entity..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary/50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent hover:border-[#2563EB]/50 transition-all"
                    >
                        <option value="all">All Actions</option>
                        <option value="Create">Create</option>
                        <option value="Update">Update</option>
                        <option value="Delete">Delete</option>
                        <option value="Approve">Approve</option>
                        <option value="Reject">Reject</option>
                    </select>
                    <select
                        value={filterEntity}
                        onChange={(e) => setFilterEntity(e.target.value)}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent hover:border-[#2563EB]/50 transition-all"
                    >
                        <option value="all">All Entities</option>
                        <option value="Branch">Branch</option>
                        <option value="User">User</option>
                        <option value="System Configuration">System Configuration</option>
                    </select>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent hover:border-[#2563EB]/50 transition-all"
                    >
                        <option value="all">All Dates</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                    <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            {filteredLogs.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">User</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Action</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Entity</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Description</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">IP Address</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Result</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log, index) => {
                                    const ActionIcon = FileText;
                                    return (
                                        <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-700 font-mono">{formatTimestamp(log.timestamp)}</span>
                                                <div className="text-xs text-gray-500">{log.id}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm font-medium text-black">{log.userName}</div>
                                                <div className="text-xs text-gray-500">{log.userId}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getActionColor(log.action)}`}>
                                                    <ActionIcon className="w-4 h-4" />
                                                    <span className="text-xs font-semibold">{log.action}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-black">{log.entity}</div>
                                                <div className="text-xs text-gray-500">{log.entityId}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-700 max-w-xs">{log.description}</div>
                                                <div className="text-xs text-gray-500 mt-1">{log.branchName}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm font-mono text-gray-700">{log.ipAddress}</div>
                                                <div className="text-xs text-gray-500">{log.deviceInfo}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${resultColors[log.result]}`}>
                                                    {log.result}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => setSelectedLog(log)}
                                                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 border border-gray-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-1">No Results Found</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                        We couldn't find any audit logs matching "{searchTerm}". Try adjusting your search or filters.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterAction('all');
                            setFilterEntity('all');
                            setDateFilter('all');
                        }}
                        className="mt-6 text-primary font-semibold text-sm hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-black">Audit Log Details</h2>
                                    <p className="text-sm text-gray-600 mt-1">{selectedLog.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <XCircle className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Timestamp</span>
                                    <span className="text-sm font-medium text-black font-mono">{formatTimestamp(selectedLog.timestamp)}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Result</span>
                                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold ${resultColors[selectedLog.result]}`}>
                                        {selectedLog.result}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">User</span>
                                    <span className="text-sm font-medium text-black">{selectedLog.userName}</span>
                                    <div className="text-xs text-gray-500">{selectedLog.userId}</div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Branch</span>
                                    <span className="text-sm font-medium text-black">{selectedLog.branchName}</span>
                                    <div className="text-xs text-gray-500">{selectedLog.branchId || 'System Wide'}</div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">IP Address</span>
                                    <span className="text-sm font-mono text-black">{selectedLog.ipAddress}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Device Info</span>
                                    <span className="text-sm text-black">{selectedLog.deviceInfo}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-xs text-gray-500 block mb-2">Description</span>
                                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedLog.description}</p>
                            </div>

                            {selectedLog.beforeValue && (
                                <div>
                                    <span className="text-xs text-gray-500 block mb-2">Before Value</span>
                                    <pre className="text-xs text-gray-700 bg-red-50 p-4 rounded-lg overflow-x-auto font-mono">
                                        {JSON.stringify(JSON.parse(selectedLog.beforeValue), null, 2)}
                                    </pre>

                                </div>
                            )}

                            {selectedLog.afterValue && (
                                <div>
                                    <span className="text-xs text-gray-500 block mb-2">After Value</span>
                                    <pre className="text-xs text-gray-700 bg-green-50 p-4 rounded-lg overflow-x-auto font-mono">
                                        {JSON.stringify(JSON.parse(selectedLog.afterValue), null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}