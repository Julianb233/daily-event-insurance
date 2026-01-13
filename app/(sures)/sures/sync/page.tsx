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
  TrendingUp,
  Zap,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Webhook,
  Calendar,
  BarChart3,
  Server,
  Link as LinkIcon,
  Shield,
  PlayCircle,
} from 'lucide-react';

// Types
interface SyncLog {
  id: string;
  timestamp: string;
  type: 'full' | 'incremental' | 'policies' | 'claims';
  status: 'success' | 'failed' | 'partial';
  records: number;
  duration: string;
  errorMessage?: string;
}

interface SyncStats {
  lastSyncTime: string;
  recordsSynced: number;
  successRate: number;
  avgDuration: number;
  nextScheduledSync: string;
}

interface WebhookEvent {
  id: string;
  timestamp: string;
  event: string;
  status: 'success' | 'failed';
  payload: string;
}

type SyncType = 'full' | 'incremental' | 'policies' | 'claims';
type ConnectionStatus = 'connected' | 'disconnected' | 'error';
type SyncFrequency = '15m' | '30m' | '1h' | '6h' | '12h' | '24h';

export default function SuresSyncPage() {
  // State
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [selectedSyncType, setSelectedSyncType] = useState<SyncType>('full');
  const [currentPage, setCurrentPage] = useState(1);
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState<SyncFrequency>('30m');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [copied, setCopied] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState<string | null>(null);

  // Mock data
  const [stats, setStats] = useState<SyncStats>({
    lastSyncTime: '2026-01-13 14:35:22',
    recordsSynced: 1207,
    successRate: 99.2,
    avgDuration: 2.8,
    nextScheduledSync: '2026-01-13 15:05:00',
  });

  const mockSyncLogs: SyncLog[] = [
    {
      id: '1',
      timestamp: '2026-01-13 14:35:22',
      type: 'full',
      status: 'success',
      records: 1207,
      duration: '4.2s',
    },
    {
      id: '2',
      timestamp: '2026-01-13 14:05:18',
      type: 'incremental',
      status: 'success',
      records: 312,
      duration: '2.8s',
    },
    {
      id: '3',
      timestamp: '2026-01-13 13:35:45',
      type: 'policies',
      status: 'success',
      records: 568,
      duration: '3.1s',
    },
    {
      id: '4',
      timestamp: '2026-01-13 13:05:30',
      type: 'claims',
      status: 'success',
      records: 124,
      duration: '1.5s',
    },
    {
      id: '5',
      timestamp: '2026-01-13 12:35:12',
      type: 'full',
      status: 'partial',
      records: 892,
      duration: '5.8s',
      errorMessage: 'Some records skipped due to validation errors',
    },
    {
      id: '6',
      timestamp: '2026-01-13 12:05:03',
      type: 'incremental',
      status: 'success',
      records: 203,
      duration: '2.4s',
    },
    {
      id: '7',
      timestamp: '2026-01-13 11:35:47',
      type: 'policies',
      status: 'success',
      records: 445,
      duration: '2.9s',
    },
    {
      id: '8',
      timestamp: '2026-01-13 11:05:21',
      type: 'claims',
      status: 'failed',
      records: 0,
      duration: '0.3s',
      errorMessage: 'API timeout - connection lost after 30s',
    },
    {
      id: '9',
      timestamp: '2026-01-13 10:35:55',
      type: 'full',
      status: 'success',
      records: 1156,
      duration: '4.5s',
    },
    {
      id: '10',
      timestamp: '2026-01-13 10:05:38',
      type: 'incremental',
      status: 'success',
      records: 267,
      duration: '2.1s',
    },
    {
      id: '11',
      timestamp: '2026-01-13 09:35:14',
      type: 'policies',
      status: 'success',
      records: 521,
      duration: '3.3s',
    },
    {
      id: '12',
      timestamp: '2026-01-13 09:05:42',
      type: 'claims',
      status: 'success',
      records: 189,
      duration: '1.8s',
    },
  ];

  const webhookEvents: WebhookEvent[] = [
    {
      id: '1',
      timestamp: '2026-01-13 14:35:22',
      event: 'policy.created',
      status: 'success',
      payload: '{"policy_id": "POL-2026-001", "status": "active"}',
    },
    {
      id: '2',
      timestamp: '2026-01-13 14:32:15',
      event: 'claim.updated',
      status: 'success',
      payload: '{"claim_id": "CLM-2026-045", "status": "approved"}',
    },
    {
      id: '3',
      timestamp: '2026-01-13 14:28:03',
      event: 'policy.updated',
      status: 'success',
      payload: '{"policy_id": "POL-2026-000", "status": "renewed"}',
    },
    {
      id: '4',
      timestamp: '2026-01-13 14:25:47',
      event: 'payment.received',
      status: 'failed',
      payload: '{"payment_id": "PAY-2026-123", "amount": 299.99}',
    },
  ];

  const apiEndpoint = 'https://api.sures.com/v1/sync';
  const webhookUrl = 'https://daily-event-insurance.com/api/webhooks/sures';
  const webhookSecret = 'wh_sec_3kP9mN7xQ2vL5tR8wE4nY1zF6jK0hC';

  const logsPerPage = 5;
  const totalPages = Math.ceil(mockSyncLogs.length / logsPerPage);
  const paginatedLogs = mockSyncLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  // Simulate sync progress
  useEffect(() => {
    if (isSyncing) {
      const interval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      setSyncProgress(0);
    }
  }, [isSyncing]);

  // Handlers
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync
    setTimeout(() => {
      setIsSyncing(false);
      setSyncProgress(100);
      setStats({
        ...stats,
        lastSyncTime: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
        recordsSynced: Math.floor(Math.random() * 500) + 800,
      });
      showSuccessToast('Sync completed successfully!');
    }, 4000);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      setConnectionStatus('connected');
      showSuccessToast('Connection test successful!');
    }, 2000);
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setTimeout(() => {
      setTestingWebhook(false);
      showSuccessToast('Webhook test event sent successfully!');
    }, 2000);
  };

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Helper functions
  const getStatusIcon = (status: 'success' | 'failed' | 'partial') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: 'success' | 'failed' | 'partial') => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide';
    switch (status) {
      case 'success':
        return `${baseClasses} bg-emerald-100 text-emerald-700`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-700`;
      case 'partial':
        return `${baseClasses} bg-amber-100 text-amber-700`;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'emerald';
      case 'disconnected':
        return 'gray';
      case 'error':
        return 'red';
    }
  };

  const formatFrequency = (freq: SyncFrequency) => {
    const map = {
      '15m': 'Every 15 minutes',
      '30m': 'Every 30 minutes',
      '1h': 'Every hour',
      '6h': 'Every 6 hours',
      '12h': 'Every 12 hours',
      '24h': 'Every 24 hours',
    };
    return map[freq];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-emerald-900 mb-2 flex items-center gap-3">
            <Database className="w-10 h-10" />
            Sures API Sync Center
          </h1>
          <p className="text-emerald-600 text-lg">
            Real-time synchronization management for policies, claims, and customer data
          </p>
        </motion.div>

        {/* Connection Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
              <Server className="w-6 h-6" />
              Connection Status
            </h2>
            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-300"
            >
              <PlayCircle className={`w-4 h-4 ${testingConnection ? 'animate-pulse' : ''}`} />
              {testingConnection ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full bg-${getConnectionStatusColor()}-100`}>
                {connectionStatus === 'connected' && (
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                )}
                {connectionStatus === 'disconnected' && (
                  <XCircle className="w-8 h-8 text-gray-600" />
                )}
                {connectionStatus === 'error' && (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className={`text-xl font-bold capitalize text-${getConnectionStatusColor()}-700`}>
                  {connectionStatus}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">API Endpoint</p>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-mono text-emerald-900 truncate">{apiEndpoint}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Last Connected</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-900">{stats.lastSyncTime}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Response Time</p>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-900">142ms avg</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sync Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Last Sync</p>
            <p className="text-lg font-bold text-emerald-900 mb-2">{stats.lastSyncTime}</p>
            <p className="text-xs text-emerald-600">Real-time sync active</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Records Synced</p>
            <p className="text-lg font-bold text-emerald-900 mb-2">
              {stats.recordsSynced.toLocaleString()}
            </p>
            <p className="text-xs text-blue-600">Last 24 hours</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Success Rate</p>
            <p className="text-lg font-bold text-emerald-900 mb-2">{stats.successRate}%</p>
            <p className="text-xs text-green-600">+2.1% from last week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Avg Duration</p>
            <p className="text-lg font-bold text-emerald-900 mb-2">{stats.avgDuration}s</p>
            <p className="text-xs text-purple-600">Optimal performance</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Next Sync</p>
            <p className="text-lg font-bold text-emerald-900 mb-2">
              {stats.nextScheduledSync.split(' ')[1]}
            </p>
            <p className="text-xs text-amber-600">In 29 minutes</p>
          </motion.div>
        </div>

        {/* Manual Sync Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
              <RefreshCw className="w-6 h-6" />
              Manual Synchronization
            </h2>
          </div>

          {/* Sync Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Sync Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(['full', 'incremental', 'policies', 'claims'] as SyncType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedSyncType(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSyncType === type
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedSyncType === type
                          ? 'border-emerald-600 bg-emerald-600'
                          : 'border-gray-300'
                      }`}
                    />
                    <span className="font-semibold capitalize">{type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-300 disabled:cursor-not-allowed text-lg font-semibold"
          >
            <RefreshCw className={`w-6 h-6 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : 'Start Sync Now'}</span>
          </button>

          {/* Progress Bar */}
          <AnimatePresence>
            {isSyncing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-emerald-900">Sync Progress</p>
                  <p className="text-sm text-emerald-600">{Math.round(syncProgress)}%</p>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${syncProgress}%` }}
                    className="h-full bg-emerald-600 rounded-full"
                  />
                </div>
                <p className="text-sm text-emerald-600 mt-2">
                  Fetching latest {selectedSyncType} data from Sures API...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sync Schedule Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100"
          >
            <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Sync Schedule
            </h2>

            {/* Auto-sync Toggle */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg mb-4">
              <div>
                <p className="font-semibold text-emerald-900">Automatic Sync</p>
                <p className="text-sm text-emerald-600">Enable scheduled synchronization</p>
              </div>
              <button
                onClick={() => setAutoSync(!autoSync)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  autoSync ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  animate={{ x: autoSync ? 28 : 2 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full"
                />
              </button>
            </div>

            {/* Frequency Selector */}
            {autoSync && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sync Frequency
                </label>
                <select
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value as SyncFrequency)}
                  className="w-full p-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-600 focus:outline-none text-emerald-900 font-medium"
                >
                  <option value="15m">Every 15 minutes</option>
                  <option value="30m">Every 30 minutes</option>
                  <option value="1h">Every hour</option>
                  <option value="6h">Every 6 hours</option>
                  <option value="12h">Every 12 hours</option>
                  <option value="24h">Every 24 hours</option>
                </select>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Next Scheduled Sync</p>
                      <p className="text-sm text-blue-600">{stats.nextScheduledSync}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Webhook Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100"
          >
            <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
              <Webhook className="w-6 h-6" />
              Webhook Configuration
            </h2>

            {/* Webhook URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="flex-1 p-3 border-2 border-emerald-200 rounded-lg bg-gray-50 text-emerald-900 font-mono text-sm"
                />
                <button
                  onClick={handleCopyWebhookUrl}
                  className="p-3 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Webhook Secret */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook Secret
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 border-2 border-emerald-200 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono text-sm text-emerald-900">
                      {'•'.repeat(20)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Webhook Button */}
            <button
              onClick={handleTestWebhook}
              disabled={testingWebhook}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-300 font-semibold"
            >
              <PlayCircle className={`w-5 h-5 ${testingWebhook ? 'animate-pulse' : ''}`} />
              {testingWebhook ? 'Testing Webhook...' : 'Test Webhook'}
            </button>

            {/* Recent Events */}
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm font-medium text-emerald-900 mb-2">Recent Events</p>
              <div className="space-y-2">
                {webhookEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{event.event}</span>
                    <span className="text-gray-500">{event.timestamp.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sync Logs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Sync Logs
                </h2>
                <p className="text-sm text-gray-600 mt-1">Recent synchronization activity</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * logsPerPage + 1}-
                  {Math.min(currentPage * logsPerPage, mockSyncLogs.length)} of{' '}
                  {mockSyncLogs.length}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Sync Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
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
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className="hover:bg-emerald-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold capitalize">
                        <Database className="w-3 h-3" />
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className={getStatusBadge(log.status)}>{log.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {log.records.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {log.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          setSelectedLogDetails(
                            selectedLogDetails === log.id ? null : log.id
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Error Details */}
          <AnimatePresence>
            {paginatedLogs.map(
              (log) =>
                selectedLogDetails === log.id &&
                log.errorMessage && (
                  <motion.div
                    key={`detail-${log.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 py-4 bg-red-50 border-t border-red-200"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-900 mb-1">Error Details</p>
                        <p className="text-sm text-red-700">{log.errorMessage}</p>
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-emerald-700 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-emerald-700 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 max-w-md"
            >
              <div
                className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl ${
                  toastType === 'success'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {toastType === 'success' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
                <p className="font-semibold">{toastMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
