'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Mail,
  Key,
  Save,
  AlertCircle,
  CheckCircle,
  Settings,
  Database,
  Shield,
  User,
  Building2,
  Phone,
  Eye,
  EyeOff,
  Link2,
  RefreshCw,
  Clock,
  Palette,
  Upload,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Users,
  AlertTriangle,
  Trash2,
  LogOut,
  TestTube,
  Loader2,
  X,
} from 'lucide-react';

// TypeScript interfaces
interface ProfileData {
  organizationName: string;
  adminName: string;
  email: string;
  phone: string;
}

interface APIConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  webhookSecret: string;
}

interface NotificationPreferences {
  newPolicies: boolean;
  claims: boolean;
  dailySummary: boolean;
  weeklyAnalytics: boolean;
  criticalAlerts: boolean;
  smsAlerts: boolean;
  notificationEmail: string;
}

interface SyncSettings {
  autoSync: boolean;
  frequency: string;
  windowStart: string;
  windowEnd: string;
  retryAttempts: number;
}

interface BrandingSettings {
  primaryColor: string;
  logoUrl: string;
  portalTheme: 'light' | 'dark';
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  apiAccessLevel: string;
  activeSessions: ActiveSession[];
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
}

interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function SuresSettingsPage() {
  // State management
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Form data
  const [profile, setProfile] = useState<ProfileData>({
    organizationName: 'Sures Insurance Corp',
    adminName: 'John Smith',
    email: 'admin@sures.com',
    phone: '+1 (555) 123-4567',
  });

  const [apiConfig, setApiConfig] = useState<APIConfig>({
    apiKey: 'sur_live_abc123def456ghi789jkl',
    apiSecret: 'sursec_xyz987wvu654tsr321',
    baseUrl: 'https://api.sures.com/v1',
    webhookSecret: 'whsec_abc123xyz789',
  });

  const [notifications, setNotifications] = useState<NotificationPreferences>({
    newPolicies: true,
    claims: true,
    dailySummary: false,
    weeklyAnalytics: true,
    criticalAlerts: true,
    smsAlerts: false,
    notificationEmail: 'alerts@sures.com',
  });

  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    autoSync: true,
    frequency: 'hourly',
    windowStart: '08:00',
    windowEnd: '20:00',
    retryAttempts: 3,
  });

  const [branding, setBranding] = useState<BrandingSettings>({
    primaryColor: '#10b981',
    logoUrl: '/sures-logo.png',
    portalTheme: 'light',
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    apiAccessLevel: 'Full Access',
    activeSessions: [
      {
        id: '1',
        device: 'Chrome on Windows',
        location: 'New York, US',
        lastActive: '2 minutes ago',
      },
      {
        id: '2',
        device: 'Safari on iPhone',
        location: 'New York, US',
        lastActive: '1 hour ago',
      },
    ],
  });

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Profile validation
    if (!profile.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    if (!profile.adminName.trim()) {
      newErrors.adminName = 'Admin name is required';
    }
    if (!profile.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email format';
    }
    if (!profile.phone.match(/^\+?[\d\s()-]+$/)) {
      newErrors.phone = 'Invalid phone format';
    }

    // API validation
    if (!apiConfig.apiKey.trim()) {
      newErrors.apiKey = 'API key is required';
    }
    if (!apiConfig.apiSecret.trim()) {
      newErrors.apiSecret = 'API secret is required';
    }
    if (!apiConfig.baseUrl.match(/^https?:\/\/.+/)) {
      newErrors.baseUrl = 'Invalid URL format';
    }

    // Notification email validation
    if (
      notifications.notificationEmail &&
      !notifications.notificationEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      newErrors.notificationEmail = 'Invalid notification email';
    }

    // Sync settings validation
    if (syncSettings.retryAttempts < 0 || syncSettings.retryAttempts > 10) {
      newErrors.retryAttempts = 'Retry attempts must be between 0 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const showToast = (type: ToastMessage['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('error', 'Please fix validation errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast('success', 'Settings saved successfully!');
    } catch (error) {
      showToast('error', 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // Simulate API test
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast('success', 'Connection test successful!');
    } catch (error) {
      showToast('error', 'Connection test failed. Please check your credentials.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleRevokeAccess = () => {
    showToast('info', 'API access revoked successfully');
  };

  const handleDisconnect = () => {
    setShowDisconnectModal(false);
    showToast('success', 'Integration disconnected successfully');
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setBranding({ ...branding, logoUrl: URL.createObjectURL(file) });
      showToast('success', 'Logo uploaded successfully!');
    } catch (error) {
      showToast('error', 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveSession = (sessionId: string) => {
    setSecurity({
      ...security,
      activeSessions: security.activeSessions.filter((s) => s.id !== sessionId),
    });
    showToast('success', 'Session removed successfully');
  };

  // Components
  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-emerald-900 mb-2">
            Sures Settings
          </h1>
          <p className="text-emerald-600">
            Configure your Sures integration and preferences
          </p>
        </motion.div>

        {/* Toast Notifications */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[320px] ${
                toast.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : toast.type === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              {toast.type === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              {toast.type === 'info' && (
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              )}
              <p
                className={`font-medium flex-1 ${
                  toast.type === 'success'
                    ? 'text-green-800'
                    : toast.type === 'error'
                    ? 'text-red-800'
                    : 'text-blue-800'
                }`}
              >
                {toast.message}
              </p>
              <button
                onClick={() => setToast(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-emerald-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-900">
                    Profile Information
                  </h2>
                  <p className="text-sm text-emerald-600">
                    Organization and administrator details
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  <span>Organization Name</span>
                </label>
                <input
                  type="text"
                  value={profile.organizationName}
                  onChange={(e) =>
                    setProfile({ ...profile, organizationName: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.organizationName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter organization name"
                />
                {errors.organizationName && (
                  <p className="mt-1 text-xs text-red-600">{errors.organizationName}</p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  <span>Admin Name</span>
                </label>
                <input
                  type="text"
                  value={profile.adminName}
                  onChange={(e) =>
                    setProfile({ ...profile, adminName: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.adminName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter admin name"
                />
                {errors.adminName && (
                  <p className="mt-1 text-xs text-red-600">{errors.adminName}</p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="admin@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* API Configuration Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-600 rounded-lg">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-emerald-900">
                      API Configuration
                    </h2>
                    <p className="text-sm text-emerald-600">
                      Sures API credentials and connection settings
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-300 text-sm font-medium"
                >
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4" />
                  )}
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Key className="w-4 h-4" />
                  <span>API Key</span>
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiConfig.apiKey}
                    onChange={(e) =>
                      setApiConfig({ ...apiConfig, apiKey: e.target.value })
                    }
                    className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.apiKey ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="sur_live_..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.apiKey && (
                  <p className="mt-1 text-xs text-red-600">{errors.apiKey}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Your Sures API key for authentication
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Key className="w-4 h-4" />
                  <span>API Secret</span>
                </label>
                <div className="relative">
                  <input
                    type={showApiSecret ? 'text' : 'password'}
                    value={apiConfig.apiSecret}
                    onChange={(e) =>
                      setApiConfig({ ...apiConfig, apiSecret: e.target.value })
                    }
                    className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.apiSecret ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="sursec_..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiSecret ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.apiSecret && (
                  <p className="mt-1 text-xs text-red-600">{errors.apiSecret}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Secret key for secure API requests
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Link2 className="w-4 h-4" />
                  <span>Base URL</span>
                </label>
                <input
                  type="url"
                  value={apiConfig.baseUrl}
                  onChange={(e) =>
                    setApiConfig({ ...apiConfig, baseUrl: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.baseUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://api.sures.com/v1"
                />
                {errors.baseUrl && (
                  <p className="mt-1 text-xs text-red-600">{errors.baseUrl}</p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Webhook Secret</span>
                </label>
                <input
                  type="password"
                  value={apiConfig.webhookSecret}
                  onChange={(e) =>
                    setApiConfig({ ...apiConfig, webhookSecret: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="whsec_..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Secret for verifying webhook signatures
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-900">
                      Security Notice
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">
                      All API communications are encrypted using TLS 1.3. Your
                      credentials are stored securely and never logged.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-emerald-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-900">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-emerald-600">
                    Control how and when you receive notifications
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">New Policies</p>
                    <p className="text-sm text-gray-600">
                      Email notifications for newly created policies
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={notifications.newPolicies}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, newPolicies: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Claims</p>
                    <p className="text-sm text-gray-600">
                      Notifications for new and updated claims
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={notifications.claims}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, claims: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">Daily Summary Report</p>
                    <p className="text-sm text-gray-600">
                      Daily summary of activity and metrics
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={notifications.dailySummary}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, dailySummary: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Weekly Analytics Report
                    </p>
                    <p className="text-sm text-gray-600">
                      Comprehensive weekly analytics sent every Monday
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={notifications.weeklyAnalytics}
                  onChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      weeklyAnalytics: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Critical Alerts</p>
                    <p className="text-sm text-gray-600">
                      Immediate notifications for critical issues
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={notifications.criticalAlerts}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, criticalAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">SMS Alerts</p>
                    <p className="text-sm text-gray-600">
                      Receive critical alerts via SMS
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={notifications.smsAlerts}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, smsAlerts: checked })
                  }
                />
              </div>

              <div className="pt-4 border-t">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>Notification Email Address</span>
                </label>
                <input
                  type="email"
                  value={notifications.notificationEmail}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      notificationEmail: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.notificationEmail
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="alerts@example.com"
                />
                {errors.notificationEmail && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.notificationEmail}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Override default email for notifications
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sync Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-emerald-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-900">
                    Sync Settings
                  </h2>
                  <p className="text-sm text-emerald-600">
                    Configure data synchronization behavior
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">Auto-Sync</p>
                    <p className="text-sm text-gray-600">
                      Automatically sync data at scheduled intervals
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={syncSettings.autoSync}
                  onChange={(checked) =>
                    setSyncSettings({ ...syncSettings, autoSync: checked })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sync Frequency
                </label>
                <select
                  value={syncSettings.frequency}
                  onChange={(e) =>
                    setSyncSettings({ ...syncSettings, frequency: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={!syncSettings.autoSync}
                >
                  <option value="15min">Every 15 minutes</option>
                  <option value="30min">Every 30 minutes</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="manual">Manual only</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Sync Window Start</span>
                  </label>
                  <input
                    type="time"
                    value={syncSettings.windowStart}
                    onChange={(e) =>
                      setSyncSettings({
                        ...syncSettings,
                        windowStart: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    disabled={!syncSettings.autoSync}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Start time for sync window
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Sync Window End</span>
                  </label>
                  <input
                    type="time"
                    value={syncSettings.windowEnd}
                    onChange={(e) =>
                      setSyncSettings({
                        ...syncSettings,
                        windowEnd: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    disabled={!syncSettings.autoSync}
                  />
                  <p className="mt-1 text-xs text-gray-500">End time for sync window</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retry Attempts
                </label>
                <input
                  type="number"
                  value={syncSettings.retryAttempts}
                  onChange={(e) =>
                    setSyncSettings({
                      ...syncSettings,
                      retryAttempts: parseInt(e.target.value),
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.retryAttempts ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="0"
                  max="10"
                />
                {errors.retryAttempts && (
                  <p className="mt-1 text-xs text-red-600">{errors.retryAttempts}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Number of retry attempts on sync failure (0-10)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Branding Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-emerald-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-900">Branding</h2>
                  <p className="text-sm text-emerald-600">
                    Customize your portal appearance
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Palette className="w-4 h-4" />
                  <span>Primary Color</span>
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) =>
                      setBranding({ ...branding, primaryColor: e.target.value })
                    }
                    className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) =>
                      setBranding({ ...branding, primaryColor: e.target.value })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                    placeholder="#10b981"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Brand color for buttons, links, and accents
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4" />
                  <span>Logo</span>
                </label>
                <div className="flex items-center space-x-4">
                  {branding.logoUrl && (
                    <div className="w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                      <img
                        src={branding.logoUrl}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                      {uploadingLogo ? (
                        <>
                          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                          <span className="text-gray-600">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">
                            Upload new logo (PNG, JPG, SVG)
                          </span>
                        </>
                      )}
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended size: 200x200px, max 2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {branding.portalTheme === 'light' ? (
                    <Sun className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <Moon className="w-5 h-5 text-indigo-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Portal Theme</p>
                    <p className="text-sm text-gray-600">
                      {branding.portalTheme === 'light'
                        ? 'Light theme enabled'
                        : 'Dark theme enabled'}
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={branding.portalTheme === 'dark'}
                  onChange={(checked) =>
                    setBranding({
                      ...branding,
                      portalTheme: checked ? 'dark' : 'light',
                    })
                  }
                />
              </div>
            </div>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-emerald-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-900">Security</h2>
                  <p className="text-sm text-emerald-600">
                    Manage security settings and access
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </button>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={security.twoFactorEnabled}
                  onChange={(checked) =>
                    setSecurity({ ...security, twoFactorEnabled: checked })
                  }
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Key className="w-5 h-5 text-emerald-600" />
                  <p className="font-medium text-gray-900">API Access Level</p>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  {security.apiAccessLevel}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <p className="font-medium text-gray-900">Active Sessions</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {security.activeSessions.length} active
                  </span>
                </div>
                <div className="space-y-3">
                  {security.activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.device}
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.location} • {session.lastActive}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSession(session.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="Remove session"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg border border-red-200 overflow-hidden"
          >
            <div className="p-6 border-b border-red-200 bg-red-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
                  <p className="text-sm text-red-600">
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Revoke API Access</p>
                  <p className="text-sm text-gray-600">
                    Immediately revoke all API access tokens
                  </p>
                </div>
                <button
                  onClick={handleRevokeAccess}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Revoke Access
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    Disconnect Integration
                  </p>
                  <p className="text-sm text-gray-600">
                    Permanently disconnect Sures integration
                  </p>
                </div>
                <button
                  onClick={() => setShowDisconnectModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-end space-x-4"
          >
            <button className="px-6 py-3 border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-300 disabled:cursor-not-allowed font-medium shadow-lg shadow-emerald-200"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      <AnimatePresence>
        {showDisconnectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowDisconnectModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Disconnect Integration?
                    </h3>
                    <p className="text-sm text-gray-600">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    Disconnecting will permanently remove all Sures integration
                    data, including API credentials, sync history, and
                    configuration. You will need to reconfigure everything if you
                    reconnect later.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDisconnectModal(false)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Yes, Disconnect
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
