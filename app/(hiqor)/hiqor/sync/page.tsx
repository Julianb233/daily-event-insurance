'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Activity,
  AlertCircle,
  Zap,
  TrendingUp,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Webhook,
  Calendar,
  BarChart3,
  Shield,
  PlayCircle,
  AlertTriangle,
} from 'lucide-react';

// Types
interface SyncLog {
  id: string;
  timestamp: string;
  type: 'Full Sync' | 'Incremental' | 'Policies Only' | 'Claims Only';
  status: 'Success' | 'Failed' | 'Partial';
  recordsProcessed: number;
  duration: string;
  errorMessage?: string;
}

interface ConnectionStatus {
  connected: boolean;
  endpoint: string;
  lastConnected: string;
  latency: number;
}

interface SyncStats {
  lastSyncTime: string;
  recordsSynced: number;
  successRate: number;
  averageDuration: string;
  nextScheduledSync: string;
}

interface WebhookEvent {
  id: string;
  timestamp: string;
  event: string;
  status: 'Success' | 'Failed';
  responseCode: number;
}

type SyncType = 'Full Sync' | 'Incremental' | 'Policies Only' | 'Claims Only';
type SyncFrequency = '15m' | '30m' | '1h' | '6h' | '12h' | '24h';

export default function HiqorSyncPage() {
  // State management
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [selectedSyncType, setSelectedSyncType] = useState<SyncType>('Full Sync');
  const [currentPage, setCurrentPage] = useState(1);
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState<SyncFrequency>('30m');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [webhookCopied, setWebhookCopied] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  const itemsPerPage = 5;

  // Mock connection status
  const [connectionStatus] = useState<ConnectionStatus>({
    connected: true,
    endpoint: 'https://api.hiqor.com/v2/sync',
    lastConnected: '2026-01-13 15:42:18',
    latency: 45,
  });

  // Mock sync statistics
  const [syncStats, setSyncStats] = useState<SyncStats>({
    lastSyncTime: '2026-01-13 15:42:18',
    recordsSynced: 1247,
    successRate: 98.5,
    averageDuration: '2.4s',
    nextScheduledSync: '2026-01-13 16:12:18',
  });

  // Mock sync logs with 15+ entries
  const [syncLogs] = useState<SyncLog[]>([
    {
      id: '15',
      timestamp: '2026-01-13 15:42:18',
      type: 'Full Sync',
      status: 'Success',
      recordsProcessed: 1247,
      duration: '4.8s',
    },
    {
      id: '14',
      timestamp: '2026-01-13 15:12:05',
      type: 'Incremental',
      status: 'Success',
      recordsProcessed: 89,
      duration: '1.2s',
    },
    {
      id: '13',
      timestamp: '2026-01-13 14:42:33',
      type: 'Policies Only',
      status: 'Success',
      recordsProcessed: 456,
      duration: '2.6s',
    },
    {
      id: '12',
      timestamp: '2026-01-13 14:12:17',
      type: 'Claims Only',
      status: 'Partial',
      recordsProcessed: 123,
      duration: '1.9s',
      errorMessage: 'Network timeout on batch 3 of 5',
    },
    {
      id: '11',
      timestamp: '2026-01-13 13:42:44',
      type: 'Full Sync',
      status: 'Success',
      recordsProcessed: 1198,
      duration: '4.5s',
    },
    {
      id: '10',
      timestamp: '2026-01-13 13:12:09',
      type: 'Incremental',
      status: 'Success',
      recordsProcessed: 67,
      duration: '1.1s',
    },
    {
      id: '9',
      timestamp: '2026-01-13 12:42:55',
      type: 'Policies Only',
      status: 'Failed',
      recordsProcessed: 0,
      duration: '0.3s',
      errorMessage: 'API rate limit exceeded',
    },
    {
      id: '8',
      timestamp: '2026-01-13 12:12:28',
      type: 'Full Sync',
      status: 'Success',
      recordsProcessed: 1215,
      duration: '4.7s',
    },
    {
      id: '7',
      timestamp: '2026-01-13 11:42:11',
      type: 'Incremental',
      status: 'Success',
      recordsProcessed: 94,
      duration: '1.4s',
    },
    {
      id: '6',
      timestamp: '2026-01-13 11:12:37',
      type: 'Claims Only',
      status: 'Success',
      recordsProcessed: 234,
      duration: '2.1s',
    },
    {
      id: '5',
      timestamp: '2026-01-13 10:42:03',
      type: 'Full Sync',
      status: 'Success',
      recordsProcessed: 1189,
      duration: '4.4s',
    },
    {
      id: '4',
      timestamp: '2026-01-13 10:12:49',
      type: 'Incremental',
      status: 'Success',
      recordsProcessed: 72,
      duration: '1.2s',
    },
    {
      id: '3',
      timestamp: '2026-01-13 09:42:22',
      type: 'Policies Only',
      status: 'Partial',
      recordsProcessed: 387,
      duration: '2.8s',
      errorMessage: 'Validation error on 3 records',
    },
    {
      id: '2',
      timestamp: '2026-01-13 09:12:15',
      type: 'Full Sync',
      status: 'Success',
      recordsProcessed: 1201,
      duration: '4.6s',
    },
    {
      id: '1',
      timestamp: '2026-01-13 08:42:08',
      type: 'Incremental',
      status: 'Success',
      recordsProcessed: 58,
      duration: '1.0s',
    },
  ]);

  // Mock webhook events
  const [webhookEvents] = useState<WebhookEvent[]>([
    {
      id: '1',
      timestamp: '2026-01-13 15:41:55',
      event: 'policy.created',
      status: 'Success',
      responseCode: 200,
    },
    {
      id: '2',
      timestamp: '2026-01-13 15:38:22',
      event: 'claim.updated',
      status: 'Success',
      responseCode: 200,
    },
    {
      id: '3',
      timestamp: '2026-01-13 15:35:11',
      event: 'policy.updated',
      status: 'Failed',
      responseCode: 500,
    },
    {
      id: '4',
      timestamp: '2026-01-13 15:30:45',
      event: 'claim.created',
      status: 'Success',
      responseCode: 200,
    },
  ]);

  const webhookUrl = 'https://daily-event-insurance.vercel.app/api/webhooks/hiqor';
  const webhookSecret = 'whsec_7k8m9n0p1q2r3s4t5u6v7w8x9y0z';

  // Pagination
  const totalPages = Math.ceil(syncLogs.length / itemsPerPage);
  const paginatedLogs = syncLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);

    const progressInterval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncProgress(0);
      setSyncStats((prev) => ({
        ...prev,
        lastSyncTime: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).replace(',', ''),
        recordsSynced: Math.floor(Math.random() * 500) + 1000,
      }));
      showToastMessage('Sync completed successfully!', 'success');
    }, 3500);
  };

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      showToastMessage('Connection test successful!', 'success');
    }, 1500);
  };

  const handleTestWebhook = () => {
    setTestingWebhook(true);
    setTimeout(() => {
      setTestingWebhook(false);
      showToastMessage('Webhook test event sent successfully!', 'success');
    }, 1500);
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setWebhookCopied(true);
    setTimeout(() => setWebhookCopied(false), 2000);
  };

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Partial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Success':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'Failed':
        return `${baseClasses} bg-red-100 text-red-700`;
      case 'Partial':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      default:
        return baseClasses;
    }
  };

  const getFrequencyLabel = (freq: SyncFrequency) => {
    const labels = {
      '15m': 'Every 15 minutes',
      '30m': 'Every 30 minutes',
      '1h': 'Every hour',
      '6h': 'Every 6 hours',
      '12h': 'Every 12 hours',
      '24h': 'Every 24 hours',
    };
    return labels[freq];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-indigo-900 mb-2">
                HIQOR Sync Management
              </h1>
              <p className="text-indigo-600">
                Monitor and manage data synchronization with HIQOR API
              </p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">System Active</span>
            </div>
          </div>
        </motion.div>

        {/* Connection Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-indigo-600" />
              Connection Status
            </h2>
            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              <PlayCircle className={`w-4 h-4 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>{testingConnection ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 mb-2">Status</span>
              <div className="flex items-center space-x-2">
                {connectionStatus.connected ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-xl font-bold text-green-600">Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <span className="text-xl font-bold text-red-600">Disconnected</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-600 mb-2">API Endpoint</span>
              <code className="text-sm bg-indigo-50 px-3 py-2 rounded text-indigo-900 font-mono truncate">
                {connectionStatus.endpoint}
              </code>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-600 mb-2">Last Connected</span>
              <span className="text-sm font-medium text-indigo-900">
                {connectionStatus.lastConnected}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-600 mb-2">Latency</span>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-xl font-bold text-indigo-900">
                  {connectionStatus.latency}ms
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sync Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Last Sync Time</p>
            <p className="text-lg font-bold text-indigo-900">
              {syncStats.lastSyncTime}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Records Synced</p>
            <p className="text-2xl font-bold text-indigo-900">
              {syncStats.recordsSynced.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-indigo-900">{syncStats.successRate}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg Duration</p>
            <p className="text-2xl font-bold text-indigo-900">
              {syncStats.averageDuration}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Next Scheduled</p>
            <p className="text-sm font-bold text-indigo-900">
              {syncStats.nextScheduledSync}
            </p>
          </motion.div>
        </div>

        {/* Manual Sync Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
              <RefreshCw className="w-6 h-6 mr-2 text-indigo-600" />
              Manual Sync
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sync Type
              </label>
              <select
                value={selectedSyncType}
                onChange={(e) => setSelectedSyncType(e.target.value as SyncType)}
                disabled={isSyncing}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="Full Sync">Full Sync - All Data</option>
                <option value="Incremental">Incremental - Changes Only</option>
                <option value="Policies Only">Policies Only</option>
                <option value="Claims Only">Claims Only</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed font-medium"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`}
                />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <AnimatePresence>
            {isSyncing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-indigo-900">
                      Syncing {selectedSyncType}...
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      {syncProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${syncProgress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              disabled={isSyncing}
              className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Database className="w-5 h-5 text-indigo-600 mb-2" />
              <h3 className="font-semibold text-indigo-900 text-sm mb-1">
                Sync Policies
              </h3>
              <p className="text-xs text-gray-600">Update policy records</p>
            </button>

            <button
              disabled={isSyncing}
              className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AlertCircle className="w-5 h-5 text-indigo-600 mb-2" />
              <h3 className="font-semibold text-indigo-900 text-sm mb-1">
                Sync Claims
              </h3>
              <p className="text-xs text-gray-600">Update claim records</p>
            </button>

            <button
              disabled={isSyncing}
              className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BarChart3 className="w-5 h-5 text-indigo-600 mb-2" />
              <h3 className="font-semibold text-indigo-900 text-sm mb-1">
                Sync Analytics
              </h3>
              <p className="text-xs text-gray-600">Update statistics</p>
            </button>

            <button
              disabled={isSyncing}
              className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-5 h-5 text-indigo-600 mb-2" />
              <h3 className="font-semibold text-indigo-900 text-sm mb-1">
                Force Refresh
              </h3>
              <p className="text-xs text-gray-600">Clear cache & sync</p>
            </button>
          </div>
        </motion.div>

        {/* Sync Schedule Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 mb-6"
        >
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-indigo-600" />
            Sync Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Auto-sync Enabled
                </span>
                <button
                  onClick={() => setAutoSync(!autoSync)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoSync ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoSync ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sync Frequency
              </label>
              <select
                value={syncFrequency}
                onChange={(e) => setSyncFrequency(e.target.value as SyncFrequency)}
                disabled={!autoSync}
                className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="15m">Every 15 minutes</option>
                <option value="30m">Every 30 minutes</option>
                <option value="1h">Every hour</option>
                <option value="6h">Every 6 hours</option>
                <option value="12h">Every 12 hours</option>
                <option value="24h">Every 24 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Scheduled Sync
              </label>
              <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">
                  {autoSync ? syncStats.nextScheduledSync : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {autoSync && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Auto-sync is enabled
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Full sync will run automatically {getFrequencyLabel(syncFrequency).toLowerCase()}.
                    You can still trigger manual syncs at any time.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Webhook Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 mb-6"
        >
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
            <Webhook className="w-6 h-6 mr-2 text-indigo-600" />
            Webhook Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <div className="flex space-x-2">
                <code className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm font-mono text-gray-900 truncate">
                  {webhookUrl}
                </code>
                <button
                  onClick={copyWebhookUrl}
                  className="px-4 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  {webhookCopied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook Secret
              </label>
              <code className="block px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm font-mono text-gray-900">
                {'•'.repeat(24)}
                {webhookSecret.slice(-8)}
              </code>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Recent Webhook Events
              </h3>
              <p className="text-sm text-gray-600">
                Last 4 webhook deliveries
              </p>
            </div>
            <button
              onClick={handleTestWebhook}
              disabled={testingWebhook}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <PlayCircle className={`w-4 h-4 ${testingWebhook ? 'animate-spin' : ''}`} />
              <span>{testingWebhook ? 'Testing...' : 'Test Webhook'}</span>
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {webhookEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {event.status === 'Success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {event.event}
                    </p>
                    <p className="text-xs text-gray-600">{event.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'Success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {event.responseCode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sync Logs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-indigo-900">Sync Logs</h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete history of synchronization events
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Sync Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + index * 0.05 }}
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-indigo-900">
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(log.status)}
                        <span className={getStatusBadge(log.status)}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.recordsProcessed.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">View Details</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Error Messages */}
          {paginatedLogs.some((log) => log.errorMessage) && (
            <div className="px-6 py-4 bg-red-50 border-t border-red-100">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 mb-2">
                    Recent Errors
                  </h3>
                  {paginatedLogs
                    .filter((log) => log.errorMessage)
                    .map((log) => (
                      <div key={log.id} className="mb-2 last:mb-0">
                        <p className="text-xs text-red-800">
                          <span className="font-medium">{log.timestamp}:</span>{' '}
                          {log.errorMessage}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, syncLogs.length)}
              </span>{' '}
              of <span className="font-medium">{syncLogs.length}</span> results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-8 left-1/2 transform z-50"
            >
              <div
                className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-xl ${
                  toastType === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {toastType === 'success' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
                <span className="font-medium">{toastMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
