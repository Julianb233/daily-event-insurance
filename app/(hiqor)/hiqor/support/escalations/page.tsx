"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Users,
  ArrowLeft,
  RefreshCw,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { EscalationQueue } from "@/components/admin/EscalationQueue"
import type { EscalatedConversation } from "@/components/admin/EscalationQueue"
import type { ConversationPriority } from "@/lib/support/types"
import { AnimatedNumber } from "@/components/shared/AnimatedNumber"

interface EscalationStats {
  total: number
  urgent: number
  high: number
  avgResolutionTime: number // in minutes
  resolvedToday: number
}

// Mock data for development
function generateMockEscalations(): EscalatedConversation[] {
  const topics = ["onboarding", "widget_install", "api_integration", "pos_setup", "troubleshooting"] as const
  const priorities: ConversationPriority[] = ["urgent", "high", "normal", "low"]
  const names = [
    "Fitness Plus", "Yoga Studio", "CrossFit Box", "Spin Cycle", "Martial Arts Academy",
    "Dance Studio", "Climbing Gym", "Wellness Center", "Personal Training Co", "Sports Complex"
  ]
  const reasons = [
    "API integration failing with 500 errors during webhook configuration",
    "Widget not rendering properly on mobile devices",
    "POS sync failing to connect to Mindbody API",
    "Partner unable to complete onboarding - stuck on API key step",
    "Multiple policies failing to process through quote engine",
    "CORS errors preventing widget from loading",
    "Partner reports data mismatch between dashboard and POS",
    "SSL certificate issues blocking API connections",
  ]

  const now = Date.now()
  const hour = 60 * 60 * 1000

  return Array.from({ length: 12 }, (_, i) => ({
    id: `esc-${i + 1}`,
    partnerId: `partner-${i + 100}`,
    partnerEmail: `${names[i % names.length].toLowerCase().replace(/\s+/g, "")}@example.com`,
    partnerName: names[i % names.length],
    sessionId: `session-${Math.random().toString(36).slice(2, 10)}`,
    topic: topics[i % topics.length],
    techStack: {
      framework: ["react", "vue", "nextjs", "vanilla"][i % 4] as "react" | "vue" | "nextjs" | "vanilla",
      language: i % 2 === 0 ? "typescript" : "javascript",
      pos: ["mindbody", "pike13", "clubready", "square"][i % 4] as "mindbody" | "pike13" | "clubready" | "square",
    },
    priority: priorities[i % 4],
    escalatedAt: new Date(now - (i * 3 + 1) * hour), // Staggered times
    escalatedTo: i % 3 === 0 ? "dev-team" : null,
    escalationReason: reasons[i % reasons.length],
    status: "escalated",
    lastMessage: "I've tried everything but it's still not working. Please help!",
    lastMessageAt: new Date(now - i * hour / 2),
    messageCount: Math.floor(Math.random() * 15) + 5,
    createdAt: new Date(now - (i * 5 + 2) * hour),
  }))
}

function generateMockStats(conversations: EscalatedConversation[]): EscalationStats {
  return {
    total: conversations.length,
    urgent: conversations.filter((c) => c.priority === "urgent").length,
    high: conversations.filter((c) => c.priority === "high").length,
    avgResolutionTime: 45, // minutes
    resolvedToday: 8,
  }
}

export default function EscalationsPage() {
  const [conversations, setConversations] = useState<EscalatedConversation[]>([])
  const [stats, setStats] = useState<EscalationStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchEscalations = useCallback(async () => {
    setIsLoading(true)
    try {
      // In production, fetch from API
      // const response = await fetch("/api/support/escalations")
      // const data = await response.json()

      // For now, use mock data
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockData = generateMockEscalations()
      setConversations(mockData)
      setStats(generateMockStats(mockData))
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Failed to fetch escalations:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEscalations()

    // Set up polling for real-time updates
    const interval = setInterval(fetchEscalations, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [fetchEscalations])

  const handleViewDetails = useCallback((id: string) => {
    // Navigate to conversation detail view
    window.location.href = `/hiqor/support/conversations/${id}`
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/hiqor/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                Escalation Queue
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Handle escalated support conversations requiring dev team attention
              </p>
            </div>

            <div className="flex items-center gap-3">
              {lastRefresh && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchEscalations}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Queue</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  <AnimatedNumber value={stats?.total || 0} format="number" />
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Urgent</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  <AnimatedNumber value={stats?.urgent || 0} format="number" />
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-orange-200 dark:border-orange-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">High Priority</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  <AnimatedNumber value={stats?.high || 0} format="number" />
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Avg Resolution</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  <AnimatedNumber value={stats?.avgResolutionTime || 0} format="number" />
                  <span className="text-sm font-normal text-slate-500 ml-1">min</span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Resolved Today</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  <AnimatedNumber value={stats?.resolvedToday || 0} format="number" />
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Escalation Queue */}
        <EscalationQueue
          initialData={conversations}
          onRefresh={fetchEscalations}
          showHeader={false}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  )
}
