'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  PhoneIncoming,
  PhoneOff,
  Settings,
  BarChart3,
  Clock,
  Users,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Play,
  Pause,
  SkipForward,
} from 'lucide-react'

// Mock data for analytics
const mockAnalytics = {
  totalCalls: 1247,
  completedCalls: 1189,
  missedCalls: 58,
  avgDuration: '4:32',
  avgWaitTime: '12s',
  escalationRate: '8.2%',
  satisfactionScore: 4.6,
  peakHours: '10am - 2pm',
}

const mockRecentCalls = [
  {
    id: '1',
    callerName: 'John Smith',
    callerType: 'Partner',
    duration: '5:23',
    status: 'completed',
    sentiment: 'positive',
    topics: ['commission', 'integration'],
    timestamp: '2 min ago',
  },
  {
    id: '2',
    callerName: 'Sarah Johnson',
    callerType: 'Prospect',
    duration: '3:45',
    status: 'completed',
    sentiment: 'neutral',
    topics: ['pricing', 'coverage'],
    timestamp: '15 min ago',
  },
  {
    id: '3',
    callerName: 'Mike Davis',
    callerType: 'Partner',
    duration: '8:12',
    status: 'escalated',
    sentiment: 'negative',
    topics: ['technical', 'api'],
    timestamp: '32 min ago',
  },
]

const mockKnowledgeBase = [
  { category: 'Partnership', items: 12, lastUpdated: '2 days ago' },
  { category: 'Pricing', items: 8, lastUpdated: '1 week ago' },
  { category: 'Technical', items: 15, lastUpdated: '3 days ago' },
  { category: 'Claims', items: 6, lastUpdated: '5 days ago' },
]

export default function VoiceAgentPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'knowledge' | 'settings' | 'call-history'>('overview')
  const [isAgentActive, setIsAgentActive] = useState(true)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Voice Agent</h1>
                <p className="text-gray-500">24/7 automated customer support</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isAgentActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                <span className={`w-2 h-2 rounded-full ${isAgentActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                {isAgentActive ? 'Agent Active' : 'Agent Paused'}
              </div>
              <button
                onClick={() => setIsAgentActive(!isAgentActive)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isAgentActive
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isAgentActive ? 'Pause Agent' : 'Activate Agent'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'call-history', label: 'Call History', icon: Clock },
              { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-green-600 text-sm font-medium">+12%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalCalls}</p>
                <p className="text-gray-500 text-sm">Total Calls</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-green-600 text-sm font-medium">95.3%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.completedCalls}</p>
                <p className="text-gray-500 text-sm">Completed</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.avgDuration}</p>
                <p className="text-gray-500 text-sm">Avg Duration</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.escalationRate}</p>
                <p className="text-gray-500 text-sm">Escalation Rate</p>
              </motion.div>
            </div>

            {/* Recent Calls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Calls</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {mockRecentCalls.map((call) => (
                  <div key={call.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          call.status === 'completed' ? 'bg-green-100' :
                          call.status === 'escalated' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          {call.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : call.status === 'escalated' ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <Phone className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{call.callerName}</p>
                          <p className="text-sm text-gray-500">{call.callerType} - {call.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{call.duration}</p>
                          <div className="flex gap-1 mt-1">
                            {call.topics.map((topic) => (
                              <span key={topic} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          call.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          call.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {call.sentiment}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Call Section */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Test the Voice Agent</h2>
                  <p className="text-teal-100">Start a test call to experience the AI voice agent firsthand.</p>
                </div>
                <button className="px-6 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Start Test Call
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Call Analytics</h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Analytics charts will be displayed here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'call-history' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Call History</h2>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">Full call history with transcripts and recordings</p>
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Knowledge Base</h2>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Add Topic
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockKnowledgeBase.map((category) => (
                <div key={category.category} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{category.category}</h3>
                    <span className="text-sm text-gray-500">{category.items} items</span>
                  </div>
                  <p className="text-sm text-gray-500">Last updated: {category.lastUpdated}</p>
                  <button className="mt-4 text-teal-600 text-sm font-medium hover:text-teal-700">
                    Edit Category →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Voice Agent Settings</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                <p className="text-gray-500 text-sm mb-4">Configure when the voice agent is active</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                    <input type="time" defaultValue="09:00" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Time</label>
                    <input type="time" defaultValue="18:00" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Escalation Rules</label>
                <p className="text-gray-500 text-sm mb-4">Define when calls should be transferred to human agents</p>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded" />
                    <span className="text-sm text-gray-700">Escalate when customer requests human agent</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded" />
                    <span className="text-sm text-gray-700">Escalate on negative sentiment detection</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" />
                    <span className="text-sm text-gray-700">Escalate after 3 failed query attempts</span>
                  </label>
                </div>
              </div>
              <div className="pt-4">
                <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
