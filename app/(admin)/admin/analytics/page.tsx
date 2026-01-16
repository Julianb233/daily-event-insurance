"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Phone, DollarSign, BarChart3 } from "lucide-react"

interface FunnelData {
  leads: number
  contacted: number
  qualified: number
  demo_scheduled: number
  proposal_sent: number
  converted: number
}

interface ConversionRates {
  lead_to_contacted: number
  contacted_to_qualified: number
  qualified_to_demo: number
  demo_to_proposal: number
  proposal_to_converted: number
}

export default function AnalyticsPage() {
  const [funnel, setFunnel] = useState<FunnelData | null>(null)
  const [rates, setRates] = useState<ConversionRates | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  async function fetchAnalytics() {
    setLoading(true)
    try {
      const endDate = new Date().toISOString()
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

      const res = await fetch(`/api/admin/analytics/conversions?startDate=${startDate}&endDate=${endDate}`)
      const data = await res.json()

      if (data.success) {
        setFunnel(data.data.funnel)
        setRates(data.data.conversionRates)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const funnelStages = funnel ? [
    { name: "Leads", value: funnel.leads, icon: Users, color: "bg-blue-500" },
    { name: "Contacted", value: funnel.contacted, icon: Phone, color: "bg-indigo-500" },
    { name: "Qualified", value: funnel.qualified, icon: TrendingUp, color: "bg-purple-500" },
    { name: "Demo Scheduled", value: funnel.demo_scheduled, icon: BarChart3, color: "bg-pink-500" },
    { name: "Proposal Sent", value: funnel.proposal_sent, icon: DollarSign, color: "bg-orange-500" },
    { name: "Converted", value: funnel.converted, icon: DollarSign, color: "bg-green-500" },
  ] : []

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Conversion Analytics</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Funnel Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {funnelStages.map((stage, i) => (
              <Card key={stage.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stage.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stage.value.toLocaleString()}</div>
                  {i > 0 && rates && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {(Object.values(rates)[i-1] * 100).toFixed(1)}% from prev
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Conversion Rates */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Conversion Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rates && Object.entries(rates).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-4">
                    <span className="w-48 text-sm text-muted-foreground">
                      {key.replace(/_/g, " → ").replace(/to/g, "")}
                    </span>
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                    <span className="w-16 text-right font-medium">
                      {(value * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
