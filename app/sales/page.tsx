"use client"

import { useState } from "react"
import {
    TrendingUp,
    Users,
    DollarSign,
    Copy,
    CheckCircle2,
    Building2,
    ExternalLink
} from "lucide-react"

export default function SalesPortalPage() {
    const [copied, setCopied] = useState(false)
    const referralCode = "ELITESALES2024"
    const referralLink = `https://dailyeventinsurance.com?ref=${referralCode}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sales Portal</h1>
                    </div>
                    <p className="text-gray-600">
                        Track your referrals, commissions, and performance.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Total Referrals</p>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+5%</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Active Policies</p>
                        <p className="text-2xl font-bold text-gray-900">142</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Lifetime Commission</p>
                        <p className="text-2xl font-bold text-gray-900">$12,450.00</p>
                    </div>
                </div>

                {/* Referral Link Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Your Referral Link</h3>
                            <p className="text-blue-100">Share this link with businesses to earn 10% commission on every policy.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-lg border border-white/20 backdrop-blur-sm">
                            <code className="px-3 py-2 text-sm font-mono">{referralLink}</code>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                                title="Copy to clipboard"
                            >
                                {copied ? <CheckCircle2 className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Referrals */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Recent Referrals</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            View All <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Business</th>
                                <th className="px-6 py-4">Integration</th>
                                <th className="px-6 py-4">Policies</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { name: "Iron Pump Gym", type: "Widget", policies: 45, status: "Active", comm: "$450.00" },
                                { name: "Urban Crossfit", type: "API", policies: 12, status: "Active", comm: "$120.00" },
                                { name: "Yoga Flow Studio", type: "Microsite", policies: 0, status: "Pending", comm: "$0.00" },
                            ].map((partner, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{partner.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{partner.type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{partner.policies}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${partner.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                            }`}>
                                            {partner.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">{partner.comm}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
