"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Phone, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  PhoneCall,
  CalendarClock
} from "lucide-react"

interface DashboardStats {
  totalLeads: number
  newToday: number
  hotLeads: number
  contacted: number
  converted: number
  conversionRate: number
  totalValue: number
  avgResponseTime: number
  callsToday: number
  smsToday: number
}

interface RecentLead {
  id: string
  name: string
  business: string
  status: string
  interestLevel: string
  lastAction: string
  timeAgo: string
}

export default function CallCenterDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newToday: 0,
    hotLeads: 0,
    contacted: 0,
    converted: 0,
    conversionRate: 0,
    totalValue: 0,
    avgResponseTime: 0,
    callsToday: 0,
    smsToday: 0,
  })
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/leads?limit=100")
      const data = await response.json()
      
      if (data.success) {
        const leads = data.data
        const today = new Date().toDateString()
        
        setStats({
          totalLeads: leads.length,
          newToday: leads.filter((l: any) => new Date(l.createdAt).toDateString() === today).length,
          hotLeads: leads.filter((l: any) => l.interestLevel === "hot").length,
          contacted: leads.filter((l: any) => l.status === "contacted").length,
          converted: leads.filter((l: any) => l.status === "converted").length,
          conversionRate: leads.length > 0 
            ? Math.round((leads.filter((l: any) => l.status === "converted").length / leads.length) * 100) 
            : 0,
          totalValue: leads
            .filter((l: any) => l.convertedValue)
            .reduce((sum: number, l: any) => sum + parseFloat(l.convertedValue || "0"), 0),
          avgResponseTime: 12,
          callsToday: leads.filter((l: any) => l.lastContact?.channel === "call").length,
          smsToday: leads.filter((l: any) => l.lastContact?.channel === "sms").length,
        })

        setRecentLeads(
          leads.slice(0, 5).map((l: any) => ({
            id: l.id,
            name: `${l.firstName} ${l.lastName}`,
            business: l.businessName || l.businessType || "Unknown",
            status: l.status,
            interestLevel: l.interestLevel,
            lastAction: l.lastContact?.channel || "Created",
            timeAgo: getTimeAgo(l.lastContact?.createdAt || l.createdAt),
          }))
        )
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Call Center</h1>
          <p className="text-slate-500">Lead conversion dashboard</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/leads/new"
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Add Lead
          </Link>
          <Link 
            href="/admin/leads"
            className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
          >
            View All Leads
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Leads</p>
              <p className="text-3xl font-bold mt-1">{stats.totalLeads}</p>
              <p className="text-sm text-green-600 mt-1">+{stats.newToday} today</p>
            </div>
            <div className="h-12 w-12 bg-violet-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-violet-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Hot Leads</p>
              <p className="text-3xl font-bold mt-1 text-red-600">{stats.hotLeads}</p>
              <p className="text-sm text-slate-500 mt-1">Ready to close</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Converted</p>
              <p className="text-3xl font-bold mt-1 text-green-600">{stats.converted}</p>
              <p className="text-sm text-slate-500 mt-1">{stats.conversionRate}% rate</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Revenue</p>
              <p className="text-3xl font-bold mt-1">${stats.totalValue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">$40 → $100 avg</p>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-100"
        >
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
          </div>
          <div className="p-4 space-y-3">
            {recentLeads.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No leads yet</p>
            ) : (
              recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-8 rounded-full ${
                      lead.status === "converted" ? "bg-green-500" :
                      lead.status === "lost" ? "bg-red-500" : "bg-yellow-500"
                    }`} />
                    <div>
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-500">{lead.business}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.interestLevel === "hot" 
                        ? "bg-red-100 text-red-700" 
                        : lead.interestLevel === "warm"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {lead.interestLevel}
                    </span>
                    <span className="text-sm text-slate-400">{lead.timeAgo}</span>
                    <button className="p-2 rounded-lg hover:bg-slate-100">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </Link>
              ))
            )}
          </div>
          {recentLeads.length > 0 && (
            <div className="p-4 border-t border-slate-100">
              <Link 
                href="/admin/leads"
                className="w-full py-2 text-center text-violet-600 hover:text-violet-700 block"
              >
                View All Leads
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Stats & Actions */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100"
          >
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Today</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-violet-600" />
                  <span className="font-medium">Calls Made</span>
                </div>
                <span className="text-xl font-bold">{stats.callsToday}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">SMS Sent</span>
                </div>
                <span className="text-xl font-bold">{stats.smsToday}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Follow-ups</span>
                </div>
                <span className="text-xl font-bold">3</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100"
          >
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              <Link 
                href="/admin/leads?interestLevel=hot"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 text-left"
              >
                <TrendingUp className="h-4 w-4 text-red-500" />
                Call Hot Leads ({stats.hotLeads})
              </Link>
              <Link 
                href="/admin/leads?status=new"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 text-left"
              >
                <Users className="h-4 w-4 text-blue-500" />
                New Leads ({stats.newToday})
              </Link>
              <Link 
                href="/admin/scripts"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 text-left"
              >
                <MessageSquare className="h-4 w-4 text-violet-500" />
                Manage Scripts
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
