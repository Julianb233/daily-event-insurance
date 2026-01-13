'use client';

import { useState, useRef } from 'react';
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
  Eye,
  EyeOff,
  RefreshCw,
  User,
  Building2,
  Phone,
  Globe,
  Webhook,
  Clock,
  RotateCcw,
  Palette,
  Upload,
  Sun,
  Moon,
  Lock,
  Smartphone,
  Activity,
  AlertTriangle,
  LogOut,
  XCircle,
  Trash2,
  CheckCircle2,
  BarChart3,
  MessageSquare,
} from 'lucide-react';

// Types
interface ProfileData {
  organizationName: string;
  adminName: string;
  email: string;
  phone: string;
}

interface ApiConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  webhookSecret: string;
}

interface NotificationSettings {
  newPolicies: boolean;
  claims: boolean;
  dailySummary: boolean;
  weeklyAnalytics: boolean;
  criticalAlerts: boolean;
  criticalAlertsSMS: boolean;
  notificationEmail: string;
}

interface SyncSettings {
  autoSync: boolean;
  syncFrequency: string;
  syncWindowStart: string;
  syncWindowEnd: string;
  retryAttempts: string;
}

interface BrandingSettings {
  primaryColor: string;
  logoUrl: string;
  portalTheme: 'light' | 'dark';
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  apiAccessLevel: string;
  activeSessions: Array<{
    id: string;
    device: string;
    location: string;
    lastActive: string;
  }>;
}

interface ToastMessage {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export default function HiqorSettingsPage() {
  // State management
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    organizationName: 'HIQOR Insurance Inc.',
    adminName: 'John Smith',
    email: 'john.smith@hiqor.com',
    phone: '+1 (555) 123-4567',
  });

  // API Configuration state
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    apiKey: 'hiq_live_1234567890abcdef1234567890abcdef',
    apiSecret: 'hiq_secret_abcdef1234567890abcdef1234567890',
    baseUrl: 'https://api.hiqor.com/v1',
    webhookSecret: 'whsec_1234567890abcdef1234567890abcdef',
  });

  // Notification settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newPolicies: true,
    claims: true,
    dailySummary: false,
    weeklyAnalytics: true,
    criticalAlerts: true,
    criticalAlertsSMS: false,
    notificationEmail: 'john.smith@hiqor.com',
  });

  // Sync settings state
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    autoSync: true,
    syncFrequency: 'hourly',
    syncWindowStart: '06:00',
    syncWindowEnd: '22:00',
    retryAttempts: '3',
  });

  // Branding settings state
  const [branding, setBranding] = useState<BrandingSettings>({
    primaryColor: '#4F46E5',
    logoUrl: '',
    portalTheme: 'light',
  });

  // Security settings state
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    apiAccessLevel: 'Full Access',
    activeSessions: [
      {
        id: '1',
        device: 'Chrome on MacOS',
        location: 'San Francisco, CA',
        lastActive: '2 minutes ago',
      },
      {
        id: '2',
        device: 'Safari on iPhone',
        location: 'San Francisco, CA',
        lastActive: '1 hour ago',
      },
    ],
  });

  // Toast notification helper
  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Form validation
  const validateProfile = (): boolean => {
    if (!profile.organizationName.trim()) {
      showToast('error', 'Organization name is required');
      return false;
    }
    if (!profile.adminName.trim()) {
      showToast('error', 'Admin name is required');
      return false;
    }
    if (!profile.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showToast('error', 'Valid email is required');
      return false;
    }
    return true;
  };

  const validateApiConfig = (): boolean => {
    if (!apiConfig.apiKey.trim()) {
      showToast('error', 'API Key is required');
      return false;
    }
    if (!apiConfig.baseUrl.match(/^https?:\/\/.+/)) {
      showToast('error', 'Valid Base URL is required');
      return false;
    }
    return true;
  };

  // Handlers
  const handleSave = async () => {
    if (!validateProfile() || !validateApiConfig()) {
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
    setIsTestingConnection(true);
    try {
      // Simulate API connection test
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast('success', 'Connection successful! API is responding correctly.');
    } catch (error) {
      showToast('error', 'Connection failed. Please check your credentials.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('error', 'File size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding({ ...branding, logoUrl: reader.result as string });
        showToast('success', 'Logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDisconnect = () => {
    showToast('warning', 'Integration disconnected. You can reconnect anytime.');
    setShowDisconnectModal(false);
  };

  const handleRevokeAccess = () => {
    showToast('warning', 'API access revoked. Generate new credentials to reconnect.');
    setShowRevokeModal(false);
  };

  const handleLogoutSession = (sessionId: string) => {
    setSecurity({
      ...security,
      activeSessions: security.activeSessions.filter((s) => s.id !== sessionId),
    });
    showToast('success', 'Session terminated successfully');
  };

  // Toggle component
  const ToggleSwitch = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }) => (
    <label className="relative inline-flex items-center cursor-pointer" aria-label={label}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Settings</h1>
          <p className="text-indigo-600">
            Configure your HIQOR integration preferences
          </p>
        </motion.div>

        {/* Toast Notifications */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 z-50 max-w-md"
            >
              <div
                className={`p-4 rounded-lg shadow-lg border flex items-center space-x-3 ${
                  toast.type === 'success'
                    ? 'bg-green-50 border-green-200'
                    : toast.type === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                {toast.type === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
                {toast.type === 'error' && (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                {toast.type === 'warning' && (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                )}
                <p
                  className={`font-medium ${
                    toast.type === 'success'
                      ? 'text-green-800'
                      : toast.type === 'error'
                      ? 'text-red-800'
                      : 'text-yellow-800'
                  }`}
                >
                  {toast.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-indigo-900">Profile</h2>
                  <p className="text-sm text-indigo-600">
                    Organization and contact information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter organization name"
                  />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter admin name"
                  />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="admin@example.com"
                  />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* API Configuration Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-indigo-900">
                    API Configuration
                  </h2>
                  <p className="text-sm text-indigo-600">
                    Configure connection settings for HIQOR API
                  </p>
                </div>
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
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
                    placeholder="hiq_live_••••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Keep your API key secure and never share it publicly
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
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
                    placeholder="hiq_secret_••••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showApiSecret ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Used for secure API authentication
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4" />
                  <span>Base URL</span>
                </label>
                <input
                  type="url"
                  value={apiConfig.baseUrl}
                  onChange={(e) =>
                    setApiConfig({ ...apiConfig, baseUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="https://api.hiqor.com/v1"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Webhook className="w-4 h-4" />
                  <span>Webhook Secret</span>
                </label>
                <input
                  type="text"
                  value={apiConfig.webhookSecret}
                  onChange={(e) =>
                    setApiConfig({ ...apiConfig, webhookSecret: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
                  placeholder="whsec_••••••••••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Used to verify webhook payloads from HIQOR
                </p>
              </div>

              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed font-medium"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isTestingConnection ? 'animate-spin' : ''}`}
                />
                <span>
                  {isTestingConnection ? 'Testing Connection...' : 'Test Connection'}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Notification Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-indigo-900">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-indigo-600">
                    Control how and when you receive notifications
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">New Policies</p>
                    <p className="text-sm text-gray-600">
                      Get notified when new policies are created
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.newPolicies}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, newPolicies: checked })
                  }
                  label="Toggle new policies notifications"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-gray-900">Claims</p>
                    <p className="text-sm text-gray-600">
                      Receive notifications for new claims
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.claims}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, claims: checked })
                  }
                  label="Toggle claims notifications"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">Daily Summary</p>
                    <p className="text-sm text-gray-600">
                      Daily summary of activity and metrics
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.dailySummary}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, dailySummary: checked })
                  }
                  label="Toggle daily summary"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">Weekly Analytics</p>
                    <p className="text-sm text-gray-600">
                      Weekly analytics report every Monday
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.weeklyAnalytics}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, weeklyAnalytics: checked })
                  }
                  label="Toggle weekly analytics"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Critical Alerts</p>
                    <p className="text-sm text-gray-600">
                      Immediate notification for critical issues
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.criticalAlerts}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, criticalAlerts: checked })
                  }
                  label="Toggle critical alerts"
                />
              </div>

              {notifications.criticalAlerts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between p-4 ml-8 bg-indigo-50 rounded-lg border border-indigo-200"
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-900">SMS Alerts</p>
                      <p className="text-sm text-gray-600">
                        Also send critical alerts via SMS
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notifications.criticalAlertsSMS}
                    onChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        criticalAlertsSMS: checked,
                      })
                    }
                    label="Toggle SMS alerts"
                  />
                </motion.div>
              )}

              <div className="pt-4 border-t border-gray-200">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="notifications@example.com"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email address where notifications will be sent
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sync Settings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-indigo-900">
                    Sync Settings
                  </h2>
                  <p className="text-sm text-indigo-600">
                    Configure automatic synchronization
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">Auto-Sync</p>
                    <p className="text-sm text-gray-600">
                      Automatically sync data with HIQOR
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={syncSettings.autoSync}
                  onChange={(checked) =>
                    setSyncSettings({ ...syncSettings, autoSync: checked })
                  }
                  label="Toggle auto-sync"
                />
              </div>

              {syncSettings.autoSync && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>Sync Frequency</span>
                    </label>
                    <select
                      value={syncSettings.syncFrequency}
                      onChange={(e) =>
                        setSyncSettings({
                          ...syncSettings,
                          syncFrequency: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="15min">Every 15 minutes</option>
                      <option value="30min">Every 30 minutes</option>
                      <option value="hourly">Every hour</option>
                      <option value="2hours">Every 2 hours</option>
                      <option value="4hours">Every 4 hours</option>
                      <option value="daily">Daily</option>
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
                        value={syncSettings.syncWindowStart}
                        onChange={(e) =>
                          setSyncSettings({
                            ...syncSettings,
                            syncWindowStart: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Start time for sync operations
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>Sync Window End</span>
                      </label>
                      <input
                        type="time"
                        value={syncSettings.syncWindowEnd}
                        onChange={(e) =>
                          setSyncSettings({
                            ...syncSettings,
                            syncWindowEnd: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        End time for sync operations
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>Retry Attempts</span>
                    </label>
                    <input
                      type="number"
                      value={syncSettings.retryAttempts}
                      onChange={(e) =>
                        setSyncSettings({
                          ...syncSettings,
                          retryAttempts: e.target.value,
                        })
                      }
                      min="0"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Number of retry attempts for failed sync operations
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Branding Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-indigo-900">Branding</h2>
                  <p className="text-sm text-indigo-600">
                    Customize the look and feel of your portal
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono"
                    placeholder="#4F46E5"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Main color used throughout the portal
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4" />
                  <span>Logo</span>
                </label>
                <div className="flex items-center space-x-4">
                  {branding.logoUrl ? (
                    <div className="relative">
                      <img
                        src={branding.logoUrl}
                        alt="Logo preview"
                        className="h-16 w-auto rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => setBranding({ ...branding, logoUrl: '' })}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                    >
                      Upload Logo
                    </button>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG or SVG (max 2MB)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                  <Sun className="w-4 h-4" />
                  <span>Portal Theme</span>
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setBranding({ ...branding, portalTheme: 'light' })}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      branding.portalTheme === 'light'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sun
                      className={`w-6 h-6 mx-auto mb-2 ${
                        branding.portalTheme === 'light'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        branding.portalTheme === 'light'
                          ? 'text-indigo-900'
                          : 'text-gray-600'
                      }`}
                    >
                      Light
                    </p>
                  </button>
                  <button
                    onClick={() => setBranding({ ...branding, portalTheme: 'dark' })}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      branding.portalTheme === 'dark'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Moon
                      className={`w-6 h-6 mx-auto mb-2 ${
                        branding.portalTheme === 'dark'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        branding.portalTheme === 'dark'
                          ? 'text-indigo-900'
                          : 'text-gray-600'
                      }`}
                    >
                      Dark
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-indigo-900">Security</h2>
                  <p className="text-sm text-indigo-600">
                    Manage security settings and authentication
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={security.twoFactorEnabled}
                  onChange={(checked) =>
                    setSecurity({ ...security, twoFactorEnabled: checked })
                  }
                  label="Toggle two-factor authentication"
                />
              </div>

              <div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  <Key className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">API Access Level</p>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {security.apiAccessLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Current API access permissions for this integration
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Active Sessions</h3>
                <div className="space-y-3">
                  {security.activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Activity className="w-4 h-4 text-indigo-600" />
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
                        onClick={() => handleLogoutSession(session.id)}
                        className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone Section */}
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
                    Immediately revoke all API access and invalidate credentials
                  </p>
                </div>
                <button
                  onClick={() => setShowRevokeModal(true)}
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
                    Permanently disconnect from HIQOR and remove all data
                  </p>
                </div>
                <button
                  onClick={() => setShowDisconnectModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-end space-x-4 pb-8"
          >
            <button className="px-6 py-3 border-2 border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed font-medium"
            >
              <Save className={`w-5 h-5 ${isSaving ? 'animate-pulse' : ''}`} />
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Change Password Modal */}
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Lock className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Change Password
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    showToast('success', 'Password changed successfully!');
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Disconnect Confirmation Modal */}
        {showDisconnectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDisconnectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Disconnect Integration
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to disconnect from HIQOR? This will remove
                all synced data and you will need to reconfigure the integration
                to connect again.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDisconnectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisconnect}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Disconnect
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Revoke Access Confirmation Modal */}
        {showRevokeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRevokeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Revoke API Access
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                This will immediately invalidate all API credentials. Any
                applications using these credentials will stop working. You will
                need to generate new credentials to restore access.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRevokeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevokeAccess}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Revoke Access
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
