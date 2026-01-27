import React, { useState } from 'react';
import {
    Save,
    Settings,
    Mail,
    CreditCard,
    Shield,
    Database,
    GitBranch
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext.jsx';



export default function SystemConfiguration() {

    const { systemConfig, updateSystemConfig } = useDashboard();
    const [config, setConfig] = useState(systemConfig);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General Settings', icon: Settings },
        { id: 'email', label: 'Email & SMS', icon: Mail },
        { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
        { id: 'security', label: 'Security Policies', icon: Shield },
        { id: 'backup', label: 'Backup & Recovery', icon: Database },
        { id: 'approval', label: 'Approval Workflows', icon: GitBranch }
    ]

    const handleChange = (field, value) => {
        setConfig({ ...config, [field]: value });
        setHasChanges(true);
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-8">
                        <div>
                            {/* Grouping these two as requested to remove unwanted gap */}
                            <div>
                                <h3 className="font-bold text-black mb-4">System Information</h3>
                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                            <span style={{ fontSize: '12px' }}>SYSTEM NAME</span>
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={config.systemName}
                                            onChange={(e) => handleChange('systemName', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                            <span style={{ fontSize: '12px' }}>SUPPORT EMAIL</span>
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue={config.supportEmail}
                                            onChange={(e) => handleChange('supportEmail', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                            <span style={{ fontSize: '12px' }}>TIME ZONE</span>
                                        </label>
                                        <select
                                            value={config.timeZone}
                                            onChange={(e) => handleChange('timeZone', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="IST">IST (UTC+5:30)</option>
                                            <option value="UTC">UTC</option>
                                            <option value="EST">EST (UTC-5)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                            <span style={{ fontSize: '12px' }}>DATE FORMAT</span>
                                        </label>
                                        <select
                                            value={config.dateFormat}
                                            onChange={(e) => handleChange('dateFormat', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-black mb-4">Data Retention</h3>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ <strong>Compliance Requirement:</strong> Minimum 7 years data retention for audit and tax purposes
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>DATA RETENTION PERIOD (years)</span>
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue={config.dataRetention}
                                        min="7"
                                        onChange={(e) => handleChange('dataRetention', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-black mb-4">System Maintenance</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked={config.enableAutoUpdates} className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('enableAutoUpdates', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Enable automatic system updates</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked={config.sendMaintenanceNotifications} className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('sendMaintenanceNotifications', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Send maintenance notifications</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked={config.enableDebugMode} className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('enableDebugMode', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Enable debug mode (for troubleshooting)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'email':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-black mb-4">Email Gateway Configuration</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>SMTP HOST</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="smtp.example.com"
                                        onChange={(e) => handleChange('smtpHost', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>SMTP PORT</span>
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue="587"
                                        onChange={(e) => handleChange('smtpPort', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>USERNAME</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="noreply@garageos.com"
                                        onChange={(e) => handleChange('smtpUsername', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>PASSWORD</span>
                                    </label>
                                    <input
                                        type="password"
                                        defaultValue="••••••••••"
                                        onChange={(e) => handleChange('smtpPassword', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D] focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                                Test Email Connection
                            </button>
                        </div>

                        <div>
                            <h3 className="font-bold text-black mb-4">SMS Gateway Configuration</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>PROVIDER</span>
                                    </label>
                                    <select
                                        onChange={(e) => handleChange('smsProvider', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D] focus:border-transparent"
                                    >
                                        <option value="twilio">Twilio</option>
                                        <option value="aws">AWS SNS</option>
                                        <option value="msg91">MSG91</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>API KEY</span>
                                    </label>
                                    <input
                                        type="password"
                                        defaultValue="••••••••••••••••"
                                        onChange={(e) => handleChange('smsApiKey', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C5FF4D] focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                                Test SMS Connection
                            </button>
                        </div>
                    </div>
                );
            case 'payment':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-black mb-4">Payment Gateway Settings</h3>
                            <div className="space-y-4">
                                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                    <input type="radio" name="gateway" defaultChecked className="mt-1" onChange={(e) => handleChange('paymentGateway', 'razorpay')} />
                                    <div className="flex-1">
                                        <div className="font-semibold text-black mb-1">Razorpay</div>
                                        <div className="text-sm text-gray-600">Indian payment gateway with UPI, cards, and net banking</div>
                                        <div className="grid grid-cols-2 gap-4 mt-3">
                                            <input
                                                type="text"
                                                placeholder="API Key"
                                                onChange={(e) => handleChange('razorpayApiKey', e.target.value)}
                                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <input
                                                type="password"
                                                placeholder="API Secret"
                                                onChange={(e) => handleChange('razorpayApiSecret', e.target.value)}
                                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                    <input type="radio" name="gateway" className="mt-1" onChange={(e) => handleChange('paymentGateway', 'payu')} />
                                    <div className="flex-1">
                                        <div className="font-semibold text-black mb-1">PayU</div>
                                        <div className="text-sm text-gray-600">Comprehensive payment solution for Indian businesses</div>
                                        <div className="grid grid-cols-2 gap-4 mt-3">
                                            <input
                                                type="text"
                                                placeholder="Merchant Key"
                                                onChange={(e) => handleChange('payuMerchantKey', e.target.value)}
                                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Merchant Salt"
                                                onChange={(e) => handleChange('payuMerchantSalt', e.target.value)}
                                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'security':

                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-black mb-4">Authentication Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block  font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>SESSION TIMEOUT (minutes)</span></label>
                                    <input
                                        type="number"
                                        defaultValue="30"
                                        onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>MAX CONCURRENT SESSIONS</span></label>
                                    <input
                                        type="number"
                                        defaultValue="2"
                                        onChange={(e) => handleChange('maxConcurrentSessions', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>FAILED LOGIN ATTEMPTS (before lockout)</span></label>
                                    <input
                                        type="number"
                                        defaultValue="5"
                                        onChange={(e) => handleChange('failedLoginAttempts', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-black mb-4">Password Policy</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>PASSWORD EXPIRY (days)</span></label>
                                    <input
                                        type="number"
                                        defaultValue="90"
                                        onChange={(e) => handleChange('passwordExpiry', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('requireUppercase', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Require uppercase letters</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('requireNumbers', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Require numbers</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('requireSpecialChars', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Require special characters</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('preventPasswordReuse', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Prevent password reuse (last 5 passwords)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-black mb-4">Encryption</h3>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-800">
                                    ✓ <strong>AES-256 Encryption</strong> is enabled for all sensitive data
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'backup':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-black mb-4">Automated Backup Schedule</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>BACKUP FREQUENCY</span></label>
                                    <select
                                        onChange={(e) => handleChange('backupFrequency', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="hourly">Every Hour</option>
                                        <option value="daily" selected>Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>BACKUP TIME</span></label>
                                    <input
                                        type="time"
                                        defaultValue="02:00"
                                        onChange={(e) => handleChange('backupTime', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>RETENTION PERIOD (days)</span></label>
                                    <input
                                        type="number"
                                        defaultValue="30"
                                        onChange={(e) => handleChange('backupRetentionPeriod', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-black mb-4">Backup Status</h3>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-700">Last Backup:</span>
                                    <span className="text-sm font-semibold text-black">Today, 02:00 AM</span>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-700">Status:</span>
                                    <span className="text-sm font-semibold text-green-600">✓ Success</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Size:</span>
                                    <span className="text-sm font-semibold text-black">2.4 GB</span>
                                </div>
                            </div>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                                Trigger Manual Backup
                            </button>
                        </div>
                    </div>
                );
            case 'approval':
                return <div>Approval Settings</div>;
            default:
                return null;
        }

    }



    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-bold text-black mb-2">System Configuration</h1>
                    <p>Manage system-wide settings and integrations</p>
                </div>
                {hasChanges && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setConfig(systemConfig);
                                setHasChanges(false);
                            }}
                            className="px-5 py-2.5 bg-red-500 border border-gray-300 rounded-lg font-medium text-white hover:bg-red-600 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                updateSystemConfig(config);
                                setHasChanges(false);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                )}
            </div>


            {/* Warning Banner */}

            <div className="bg-yellow-50 border boder-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                    ⚠️ <strong>Important:</strong> Configuration changes require admin credentials and will generate audit logs. All changes are version-controlled.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${isActive
                                    ? 'border-primary bg-gray-50 text-black'
                                    : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
                                    }`}>
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {renderTabContent()}
                </div>

            </div>

        </div>
    );
};

