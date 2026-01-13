'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Headphones,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Monitor,
  MessageSquare,
  Play,
  Pause,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  ScreenShare,
  UserPlus,
  Filter,
  Search,
  MoreVertical,
  ArrowRight,
} from 'lucide-react'

// Mock data
const mockStats = {
  waiting: 3,
  inProgress: 2,
  completedToday: 24,
  avgWaitTime: '2:34',
  avgDuration: '8:45',
}

const mockQueue = [
  {
    id: '1',
    partnerName: 'Acme Fitness Center',
    contactName: 'John Smith',
    email: 'john@acmefitness.com',
    businessType: 'Gym',
    onboardingStep: 'Integration Setup',
    waitTime: '4:23',
    requestReason: 'Need help with API integration',
    urgent: true,
  },
  {
    id: '2',
    partnerName: 'Adventure Tours LLC',
    contactName: 'Sarah Johnson',
    email: 'sarah@adventuretours.com',
    businessType: 'Adventure',
    onboardingStep: 'Customize Coverage',
    waitTime: '2:15',
    requestReason: 'Questions about pricing configuration',
    urgent: false,
  },
  {
    id: '3',
    partnerName: 'Rock Climbing Co',
    contactName: 'Mike Davis',
    email: 'mike@rockclimbing.com',
    businessType: 'Climbing',
    onboardingStep: 'Business Information',
    waitTime: '1:02',
    requestReason: 'Website auto-fill not working',
    urgent: false,
  },
]

const mockActiveSessions = [
  {
    id: 's1',
    partnerName: 'Yoga Studio Plus',
    adminName: 'Emily Chen',
    duration: '12:34',
    type: 'voice',
  },
  {
    id: 's2',
    partnerName: 'Kayak Adventures',
    adminName: 'David Wilson',
    duration: '5:22',
    type: 'screen-share',
  },
]

export default function CustomerServicePage() {
  const [activeTab, setActiveTab] = useState<'queue' | 'active' | 'history'>('queue')
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Service</h1>
                <p className="text-gray-500">Onboarding support dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {mockStats.waiting > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  {mockStats.waiting} waiting
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.waiting}</p>
                <p className="text-xs text-gray-500">Waiting</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.inProgress}</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.completedToday}</p>
                <p className="text-xs text-gray-500">Completed Today</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.avgWaitTime}</p>
                <p className="text-xs text-gray-500">Avg Wait</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.avgDuration}</p>
                <p className="text-xs text-gray-500">Avg Duration</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-t-xl border border-gray-200 border-b-0">
          <nav className="flex gap-6 px-6">
            {[
              { id: 'queue', label: 'Support Queue', count: mockStats.waiting },
              { id: 'active', label: 'Active Sessions', count: mockStats.inProgress },
              { id: 'history', label: 'History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 shadow-sm">
          {activeTab === 'queue' && (
            <div className="divide-y divide-gray-100">
              {mockQueue.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No partners waiting</h3>
                  <p className="text-gray-500">All support requests have been handled</p>
                </div>
              ) : (
                mockQueue.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-6 hover:bg-gray-50 transition-colors ${request.urgent ? 'bg-red-50/50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          request.urgent ? 'bg-red-100' : 'bg-rose-100'
                        }`}>
                          <Users className={`w-6 h-6 ${request.urgent ? 'text-red-600' : 'text-rose-600'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{request.partnerName}</h3>
                            {request.urgent && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                Urgent
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{request.contactName} - {request.email}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {request.businessType}
                            </span>
                            <span className="text-sm text-gray-500">
                              Step: {request.onboardingStep}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-700">{request.requestReason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Waiting: {request.waitTime}</p>
                        </div>
                        <button className="px-4 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Join Session
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'active' && (
            <div className="divide-y divide-gray-100">
              {mockActiveSessions.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Phone className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No active sessions</h3>
                  <p className="text-gray-500">Join a waiting partner to start a session</p>
                </div>
              ) : (
                mockActiveSessions.map((session) => (
                  <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          {session.type === 'screen-share' ? (
                            <Monitor className="w-6 h-6 text-green-600" />
                          ) : (
                            <Phone className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{session.partnerName}</h3>
                          <p className="text-sm text-gray-500">Agent: {session.adminName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-sm font-medium">{session.duration}</span>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          {session.type === 'screen-share' ? 'Screen Share' : 'Voice'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by partner name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
              <div className="text-center py-12">
                <p className="text-gray-500">Session history will be displayed here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
