"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getMonthName, formatCurrency } from "@/lib/commission-tiers"

interface EarningsChartProps {
  data: Array<{
    month: string
    participants: number
    optedIn: number
    earnings: number
  }>
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      month: string
      participants: number
      optedIn: number
      earnings: number
    }
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const [year, month] = data.month.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    return (
      <div className="bg-white/95 backdrop-blur-sm border border-teal-200 rounded-xl shadow-xl p-4 min-w-[180px]">
        <p className="text-sm font-semibold text-slate-700 mb-2">{monthName}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Participants</span>
            <span className="font-medium text-slate-700">{data.participants.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Opted In</span>
            <span className="font-medium text-slate-700">{data.optedIn.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm pt-1.5 border-t border-slate-200">
            <span className="text-slate-600 font-medium">Earnings</span>
            <span className="font-bold text-teal-600">{formatCurrency(data.earnings)}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function EarningsChart({ data }: EarningsChartProps) {
  // Format month labels for X-axis
  const formatMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short' })
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="earningsGradientDashboard" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.05}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={formatMonth}
            stroke="#cbd5e1"
          />

          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            stroke="#cbd5e1"
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#14B8A6', strokeWidth: 2, strokeDasharray: '5 5' }}
          />

          <Area
            type="monotone"
            dataKey="earnings"
            stroke="#14B8A6"
            strokeWidth={3}
            fill="url(#earningsGradientDashboard)"
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
