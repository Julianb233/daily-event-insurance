"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
    TrendingUp,
    BarChart3,
    DollarSign,
    ArrowRight,
    ChevronLeft,
    Sparkles
} from "lucide-react"

// Floating orb component for background decoration (Light Theme Compatible)
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.05, 1],
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
            }}
        />
    )
}

// Interactive Revenue Chart Component (Light Theme)
function InteractiveRevenueChart() {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null)
    const [selectedMetric, setSelectedMetric] = useState<'premium' | 'policies' | 'partners'>('premium')

    const data = {
        premium: [
            { period: "6 Mo", value: 50, display: "$50K", color: "from-teal-400 to-emerald-400" },
            { period: "Year 1", value: 500, display: "$500K", color: "from-teal-500 to-emerald-500" },
            { period: "Year 2", value: 2000, display: "$2M", color: "from-emerald-500 to-green-500" },
            { period: "Year 3", value: 8000, display: "$8M", color: "from-green-500 to-teal-500" },
            { period: "Year 5", value: 25000, display: "$25M", color: "from-teal-600 to-cyan-500" }
        ],
        policies: [
            { period: "6 Mo", value: 500, display: "500", color: "from-purple-400 to-indigo-400" },
            { period: "Year 1", value: 5000, display: "5,000", color: "from-purple-500 to-indigo-500" },
            { period: "Year 2", value: 25000, display: "25K", color: "from-indigo-500 to-purple-500" },
            { period: "Year 3", value: 75000, display: "75K", color: "from-purple-600 to-pink-500" },
            { period: "Year 5", value: 200000, display: "200K", color: "from-pink-500 to-purple-600" }
        ],
        partners: [
            { period: "6 Mo", value: 1000, display: "1,000", color: "from-orange-400 to-amber-400" },
            { period: "Year 1", value: 500, display: "500", color: "from-orange-500 to-amber-500" },
            { period: "Year 2", value: 2000, display: "2K", color: "from-amber-500 to-orange-500" },
            { period: "Year 3", value: 5000, display: "5K", color: "from-orange-600 to-red-500" },
            { period: "Year 5", value: 15000, display: "15K", color: "from-red-500 to-orange-600" }
        ]
    }

    const currentData = data[selectedMetric]
    const maxValue = Math.max(...currentData.map(d => d.value))

    const metricLabels = {
        premium: 'Gross Premium',
        policies: 'Monthly Policies',
        partners: 'Partner Network'
    }

    return (
        <div className="space-y-6">
            {/* Metric Selector */}
            <div className="flex justify-center gap-2">
                {(['premium', 'policies', 'partners'] as const).map((metric) => (
                    <motion.button
                        key={metric}
                        onClick={() => setSelectedMetric(metric)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${selectedMetric === metric
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {metricLabels[metric]}
                    </motion.button>
                ))}
            </div>

            {/* Chart */}
            <div className="relative h-72 flex items-end justify-around gap-4 px-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                {currentData.map((item, index) => (
                    <motion.div
                        key={`${selectedMetric}-${item.period}`}
                        className="relative flex-1 max-w-[100px] group cursor-pointer"
                        onMouseEnter={() => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.value / maxValue) * 100}%` }}
                        transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
                    >
                        {/* Tooltip */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: hoveredBar === index ? 1 : 0, y: hoveredBar === index ? 0 : 10 }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap z-20 shadow-xl"
                        >
                            <div className="font-bold text-teal-400">{item.display}</div>
                            <div className="text-xs text-slate-400">{metricLabels[selectedMetric]}</div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900" />
                        </motion.div>

                        {/* Bar */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${item.color} rounded-t-xl opacity-90 group-hover:opacity-100 transition-opacity`} />

                        {/* Value on bar */}
                        <div className="absolute top-2 left-0 right-0 text-center">
                            <span className="text-[10px] md:text-xs font-bold text-white drop-shadow-md">{item.display}</span>
                        </div>

                        {/* Label */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                            <div className="text-xs md:text-sm font-semibold text-slate-600">{item.period}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default function DealStructurePage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-teal-100">
            {/* Background Elements (Light Theme) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <FloatingOrb
                    className="absolute top-[10%] left-[10%] w-96 h-96 bg-teal-500/5 rounded-full blur-[100px]"
                    delay={0}
                />
                <FloatingOrb
                    className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]"
                    delay={2}
                />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
                        backgroundSize: `40px 40px`,
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Navigation */}
                <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center gap-3">
                                <a href="/about/hiqor/presentation" className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                    <span className="font-medium">Back to Presentation</span>
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/images/logo-color.png"
                                    alt="Daily Event Insurance"
                                    width={140}
                                    height={35}
                                    className="h-8 w-auto opacity-80"
                                />
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Financial Projections Content - Migrated from Presentation Page */}
                <section id="financials" className="py-24 relative overflow-hidden bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                                    <TrendingUp className="w-3 h-3" />
                                    Revenue Growth
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                                    Predictable, Scalable Revenue Models
                                </h1>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    Our partnership model is designed for mutual success, with
                                    transparent revenue sharing and clear growth trajectories
                                    based on conservative market penetration estimates.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                                            70%
                                        </div>
                                        <div>
                                            <div className="text-slate-900 font-bold">Partner Revenue Share</div>
                                            <div className="text-slate-500 text-sm">Majority of margin goes to HIQOR</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                            30d
                                        </div>
                                        <div>
                                            <div className="text-slate-900 font-bold">Fast Payouts</div>
                                            <div className="text-slate-500 text-sm">Monthly ACH deposits with reporting</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-1 border border-slate-200 shadow-xl">
                                <div className="bg-slate-50 rounded-[22px] p-8 border border-white/50">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Projected Metrics</h3>
                                    <InteractiveRevenueChart />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 relative overflow-hidden bg-slate-900">
                    {/* Dark background for CTA to make it pop */}
                    <div className="absolute inset-0 bg-[url('/images/curve-lines-texture.svg')] opacity-10" />
                    <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                            Analyze the Full structure
                        </h2>
                        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                            Download the detailed spreadsheet for a granular breakdown of the deal terms.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/25 transition-all">
                                Download Financial Model
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 py-12">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <Image src="/images/logo-color.png" width={120} height={30} alt="DEI" className="opacity-80 hover:opacity-100 transition-all" />
                        </div>
                        <div className="text-slate-500 text-sm">
                            &copy; 2024 Daily Event Insurance. Confidential & Proprietary.
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
