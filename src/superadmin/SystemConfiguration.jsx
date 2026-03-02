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
import { toast } from 'sonner';



export default function SystemConfiguration() {

    const { systemConfig, updateSystemConfig } = useDashboard();
    const [config, setConfig] = useState(systemConfig);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [errors, setErrors] = useState({});


    const handleSave = () => {
        if (validate()) {
            updateSystemConfig(config);
            setHasChanges(false);
            toast.success('System configuration saved successfully');
        }
    }

    const handleReset = () => {
        setConfig(systemConfig);
        setHasChanges(false);
        toast.success('System configuration reset successfully');
    }






    const tabs = [
        { id: 'general', label: 'General Settings', icon: Settings },
        { id: 'email', label: 'Email & SMS', icon: Mail },
        { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
        { id: 'security', label: 'Security Policies', icon: Shield },
        { id: 'backup', label: 'Backup & Recovery', icon: Database },
        { id: 'approval', label: 'Approval Workflows', icon: GitBranch }
    ]

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // General
        if (!config.systemName?.trim()) newErrors.systemName = 'System name is required';
        if (!config.supportEmail?.trim()) {
            newErrors.supportEmail = 'Support email is required';
        } else if (!emailRegex.test(config.supportEmail)) {
            newErrors.supportEmail = 'Please enter a valid email address';
        }
        if (!config.dataRetention || config.dataRetention < 7) newErrors.dataRetention = 'Minimum retention is 7 years';

        // Email
        if (!config.smtpHost?.trim()) newErrors.smtpHost = 'SMTP Host is required';
        if (!config.smtpPort) {
            newErrors.smtpPort = 'SMTP Port is required';
        } else if (config.smtpPort < 1 || config.smtpPort > 65535) {
            newErrors.smtpPort = 'Invalid port number';
        }

        if (!config.smtpUsername?.trim()) {
            newErrors.smtpUsername = 'Username is required';
        } else if (config.smtpUsername.includes('@') && !emailRegex.test(config.smtpUsername)) {
            newErrors.smtpUsername = 'Please enter a valid email address';
        }

        if (!config.smtpPassword?.trim() && !systemConfig.smtpPassword) {
            newErrors.smtpPassword = 'Password is required';
        } else if (config.smtpPassword?.trim() && config.smtpPassword !== systemConfig.smtpPassword) {
            if (config.smtpPassword.length < 8) {
                newErrors.smtpPassword = 'Password must be at least 8 characters';
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(config.smtpPassword)) {
                newErrors.smtpPassword = 'Password must include uppercase, lowercase, and a number';
            }
        }

        // SMS
        if (!config.smsApiKey?.trim() && !systemConfig.smsApiKey) newErrors.smsApiKey = 'API Key is required';

        // Payment
        if (config.paymentGateway === 'razorpay') {
            if (!config.razorpayApiKey?.trim()) newErrors.razorpayApiKey = 'Razorpay API Key is required';
            if (!config.razorpayApiSecret?.trim() && !systemConfig.razorpayApiSecret) newErrors.razorpayApiSecret = 'Razorpay API Secret is required';
        } else if (config.paymentGateway === 'payu') {
            if (!config.payuMerchantKey?.trim()) newErrors.payuMerchantKey = 'PayU Merchant Key is required';
            if (!config.payuMerchantSalt?.trim() && !systemConfig.payuMerchantSalt) newErrors.payuMerchantSalt = 'PayU Merchant Salt is required';
        }

        // Security
        if (!config.sessionTimeout || config.sessionTimeout <= 0) newErrors.sessionTimeout = 'Invalid timeout';
        if (!config.maxSessions || config.maxSessions <= 0) newErrors.maxSessions = 'Invalid session count';
        if (!config.failedLoginAttempts || config.failedLoginAttempts <= 0) newErrors.failedLoginAttempts = 'Invalid attempt count';
        if (!config.passwordExpiry || config.passwordExpiry <= 0) newErrors.passwordExpiry = 'Invalid expiry days';
        if (!config.minPasswordLength || config.minPasswordLength < 6) newErrors.minPasswordLength = 'Minimum length must be at least 6';

        // Backup
        if (!config.backupRetentionPeriod || config.backupRetentionPeriod <= 0) newErrors.backupRetentionPeriod = 'Invalid retention days';

        // Approval
        if (!config.highPrioritySLA || config.highPrioritySLA <= 0) newErrors.highPrioritySLA = 'Invalid hours';
        if (!config.mediumPrioritySLA || config.mediumPrioritySLA <= 0) newErrors.mediumPrioritySLA = 'Invalid hours';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Find which tab the first error belongs to and switch to it
            const errorFields = Object.keys(newErrors);
            if (errorFields.some(f => ['systemName', 'supportEmail', 'dataRetention'].includes(f))) setActiveTab('general');
            else if (errorFields.some(f => ['smtpHost', 'smtpPort', 'smtpUsername', 'smtpPassword', 'smsApiKey'].includes(f))) setActiveTab('email');
            else if (errorFields.some(f => ['razorpayApiKey', 'razorpayApiSecret', 'payuMerchantKey', 'payuMerchantSalt'].includes(f))) setActiveTab('payment');
            else if (errorFields.some(f => ['sessionTimeout', 'maxSessions', 'failedLoginAttempts', 'passwordExpiry', 'minPasswordLength'].includes(f))) setActiveTab('security');
            else if (errorFields.some(f => ['backupRetentionPeriod'].includes(f))) setActiveTab('backup');
            else if (errorFields.some(f => ['highPrioritySLA', 'mediumPrioritySLA'].includes(f))) setActiveTab('approval');
            return false;
        }
        return true;
    };

    const handleChange = (field, value) => {
        setConfig({ ...config, [field]: value });
        setHasChanges(true);
        if (errors[field]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[field];
                return newErrs;
            });
        }
    }

    const ErrorMessage = ({ message }) => {
        if (!message) return null;
        return <p className="text-red-500 text-[10px] mt-1 font-medium">{message}</p>;
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-8">
                        <div>
                            {/* Grouping these two as requested to remove unwanted gap */}
                            <div>
                                <h3 className="font-bold text-black mb-4 text-base sm:text-lg">System Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                            <span style={{ fontSize: '12px' }}>SYSTEM NAME</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={config.systemName || ''}
                                            onChange={(e) => handleChange('systemName', e.target.value)}
                                            className={`w-full px-4 py-3 bg-gray-50 border ${errors.systemName ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                        />
                                        <ErrorMessage message={errors.systemName} />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                            <span style={{ fontSize: '12px' }}>SUPPORT EMAIL</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={config.supportEmail || ''}
                                            onChange={(e) => handleChange('supportEmail', e.target.value)}
                                            className={`w-full px-4 py-3 bg-gray-50 border ${errors.supportEmail ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                        />
                                        <ErrorMessage message={errors.supportEmail} />
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
                                        value={config.dataRetention || 7}
                                        min="7"
                                        onChange={(e) => handleChange('dataRetention', Number(e.target.value))}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.dataRetention ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    <ErrorMessage message={errors.dataRetention} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-black mb-4">System Maintenance</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={config.enableAutoUpdates} className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('enableAutoUpdates', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Enable automatic system updates</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={config.sendMaintenanceNotifications} className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('sendMaintenanceNotifications', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Send maintenance notifications</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={config.enableDebugMode} className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('enableDebugMode', e.target.checked)} />
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
                            <h3 className="font-bold text-black mb-4 text-base sm:text-lg">Email Gateway Configuration</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>SMTP HOST</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={config.smtpHost || ''}
                                        onChange={(e) => handleChange('smtpHost', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.smtpHost ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    <ErrorMessage message={errors.smtpHost} />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>SMTP PORT</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={config.smtpPort || ''}
                                        onChange={(e) => handleChange('smtpPort', Number(e.target.value))}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.smtpPort ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    <ErrorMessage message={errors.smtpPort} />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>USERNAME</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={config.smtpUsername || ''}
                                        onChange={(e) => handleChange('smtpUsername', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.smtpUsername ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    <ErrorMessage message={errors.smtpUsername} />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>PASSWORD</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={config.smtpPassword || ''}
                                        onChange={(e) => handleChange('smtpPassword', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.smtpPassword ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                        placeholder="••••••••••"
                                    />
                                    <ErrorMessage message={errors.smtpPassword} />
                                </div>
                            </div>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                                Test Email Connection
                            </button>
                        </div>

                        <div>
                            <h3 className="font-bold text-black mb-4 text-base sm:text-lg">SMS Gateway Configuration</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold uppercase">
                                        <span style={{ fontSize: '12px' }}>PROVIDER</span>
                                    </label>
                                    <select
                                        value={config.smsProvider}
                                        onChange={(e) => handleChange('smsProvider', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                        value={config.smsApiKey || ''}
                                        onChange={(e) => handleChange('smsApiKey', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.smsApiKey ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                        placeholder="••••••••••••••••"
                                    />
                                    <ErrorMessage message={errors.smsApiKey} />
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
                                <label className={`flex items-start gap-3 p-4 border-2 ${config.paymentGateway === 'razorpay' ? 'border-primary' : 'border-gray-200'} rounded-lg cursor-pointer hover:border-primary transition-colors`}>
                                    <input type="radio" name="gateway" checked={config.paymentGateway === 'razorpay'} className="mt-1" onChange={(e) => handleChange('paymentGateway', 'razorpay')} />
                                    <div className="flex-1">
                                        <div className="font-semibold text-black mb-1">Razorpay</div>
                                        <div className="text-sm text-gray-600">Indian payment gateway with UPI, cards, and net banking</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="API Key"
                                                    value={config.razorpayApiKey || ''}
                                                    onChange={(e) => handleChange('razorpayApiKey', e.target.value)}
                                                    className={`w-full px-3 py-2 bg-gray-50 border ${errors.razorpayApiKey ? 'border-red-500' : 'border-gray-200'} rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                                                />
                                                <ErrorMessage message={errors.razorpayApiKey} />
                                            </div>
                                            <div>
                                                <input
                                                    type="password"
                                                    placeholder="API Secret"
                                                    value={config.razorpayApiSecret || ''}
                                                    onChange={(e) => handleChange('razorpayApiSecret', e.target.value)}
                                                    className={`w-full px-3 py-2 bg-gray-50 border ${errors.razorpayApiSecret ? 'border-red-500' : 'border-gray-200'} rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                                                />
                                                <ErrorMessage message={errors.razorpayApiSecret} />
                                            </div>
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-start gap-3 p-4 border-2 ${config.paymentGateway === 'payu' ? 'border-primary' : 'border-gray-200'} rounded-lg cursor-pointer hover:border-primary transition-colors`}>
                                    <input type="radio" name="gateway" checked={config.paymentGateway === 'payu'} className="mt-1" onChange={(e) => handleChange('paymentGateway', 'payu')} />
                                    <div className="flex-1">
                                        <div className="font-semibold text-black mb-1">PayU</div>
                                        <div className="text-sm text-gray-600">Comprehensive payment solution for Indian businesses</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Merchant Key"
                                                    value={config.payuMerchantKey || ''}
                                                    onChange={(e) => handleChange('payuMerchantKey', e.target.value)}
                                                    className={`w-full px-3 py-2 bg-gray-50 border ${errors.payuMerchantKey ? 'border-red-500' : 'border-gray-200'} rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                                                />
                                                <ErrorMessage message={errors.payuMerchantKey} />
                                            </div>
                                            <div>
                                                <input
                                                    type="password"
                                                    placeholder="Merchant Salt"
                                                    value={config.payuMerchantSalt || ''}
                                                    onChange={(e) => handleChange('payuMerchantSalt', e.target.value)}
                                                    className={`w-full px-3 py-2 bg-gray-50 border ${errors.payuMerchantSalt ? 'border-red-500' : 'border-gray-200'} rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                                                />
                                                <ErrorMessage message={errors.payuMerchantSalt} />
                                            </div>
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
                                        value={config.sessionTimeout}
                                        onChange={(e) => handleChange('sessionTimeout', Number(e.target.value))}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.sessionTimeout ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    <ErrorMessage message={errors.sessionTimeout} />
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>MAX CONCURRENT SESSIONS</span></label>
                                    <input
                                        type="number"
                                        value={config.maxSessions}
                                        onChange={(e) => handleChange('maxSessions', Number(e.target.value))}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.maxSessions ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    <ErrorMessage message={errors.maxSessions} />
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>FAILED LOGIN ATTEMPTS (before lockout)</span></label>
                                    <input
                                        type="number"
                                        value={config.failedLoginAttempts}
                                        onChange={(e) => handleChange('failedLoginAttempts', Number(e.target.value))}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.failedLoginAttempts ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    <ErrorMessage message={errors.failedLoginAttempts} />
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
                                        value={config.passwordExpiry}
                                        onChange={(e) => handleChange('passwordExpiry', Number(e.target.value))}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.passwordExpiry ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    <ErrorMessage message={errors.passwordExpiry} />
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>MINIMUM PASSWORD LENGTH</span></label>
                                    <input
                                        type="number"
                                        value={config.minPasswordLength}
                                        onChange={(e) => handleChange('minPasswordLength', Number(e.target.value))}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.minPasswordLength ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    <ErrorMessage message={errors.minPasswordLength} />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={config.requireUppercase} className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('requireUppercase', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Require uppercase letters</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={config.requireNumbers} className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('requireNumbers', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Require numbers</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={config.requireSpecialChars} className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('requireSpecialChars', e.target.checked)} />
                                    <span className="text-sm text-gray-700">Require special characters</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={config.preventPasswordReuse} className="w-4 h-4 rounded border-gray-300" onChange={(e) => handleChange('preventPasswordReuse', e.target.checked)} />
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
                                        value={config.backupFrequency}
                                        onChange={(e) => handleChange('backupFrequency', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="hourly">Every Hour</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>BACKUP TIME</span></label>
                                    <input
                                        type="time"
                                        value={config.backupTime}
                                        onChange={(e) => handleChange('backupTime', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>RETENTION PERIOD (days)</span></label>
                                    <input
                                        type="number"
                                        value={config.backupRetentionPeriod}
                                        onChange={(e) => handleChange('backupRetentionPeriod', Number(e.target.value))}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.backupRetentionPeriod ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    <ErrorMessage message={errors.backupRetentionPeriod} />
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
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-black mb-4">Approval Hierarchy</h3>
                            <p className="text-sm text-gray-600 mb-4">Define multi-level approval workflows for different request types</p>

                            <div className="space-y-4">
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="font-semibold text-black mb-3">Capital Expense (&gt;₹1L)</div>
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">Branch Manager</span>
                                        <span className="hidden sm:inline">→</span>
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">Regional Manager</span>
                                        <span className="hidden sm:inline">→</span>
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">Finance Head</span>
                                        <span className="hidden sm:inline">→</span>
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">Super Admin</span>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="font-semibold text-black mb-3">Discount Approval (&gt;10%)</div>
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">Branch Manager</span>
                                        <span className="hidden sm:inline">→</span>
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">Regional Manager</span>
                                        <span className="hidden sm:inline">→</span>
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">Super Admin</span>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="font-semibold text-black mb-3">New Hire</div>
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">Branch Manager</span>
                                        <span className="hidden sm:inline">→</span>
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">HR Head</span>
                                        <span className="hidden sm:inline">→</span>
                                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">Super Admin</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div>
                            <h3 className="font-bold text-black mb-4 text-base sm:text-lg">SLA Settings</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>HIGH PRIPORITY (hours)</span></label>
                                    <input
                                        type="number"
                                        value={config.highPrioritySLA}
                                        onChange={(e) => handleChange('highPrioritySLA', Number(e.target.value))}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.highPrioritySLA ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} />
                                    <ErrorMessage message={errors.highPrioritySLA} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2"><span style={{ fontSize: '12px' }}>MEDIUM PRIPORITY (hours)</span></label>
                                    <input
                                        type="number"
                                        value={config.mediumPrioritySLA}
                                        onChange={(e) => handleChange('mediumPrioritySLA', Number(e.target.value))}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.mediumPrioritySLA ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} />
                                    <ErrorMessage message={errors.mediumPrioritySLA} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default:
                return null;
        }

    }



    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-black mb-1 sm:mb-2">System Configuration</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage system-wide settings and integrations</p>
                </div>
                {hasChanges && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleReset}
                            className="w-full sm:w-auto px-5 py-2.5 bg-red-500 border border-gray-300 rounded-lg font-medium text-white hover:bg-red-600 transition-colors text-sm sm:text-base">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm sm:text-base"
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
                <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 sm:flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${isActive
                                    ? 'border-primary bg-gray-50 text-black'
                                    : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
                                    }`}>
                                <Icon className="w-4 h-4" />
                                <span className="hidden xs:inline">{tab.label}</span>
                                <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
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

