"use client"

import { Shield, Lock, Activity, FileCheck, Server, Globe, CheckCircle2, FileJson } from "lucide-react"
import Link from "next/link"

export default function TrustCenterPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                            <Shield className="w-4 h-4" />
                            <span>Enterprise-Grade Security</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Built for Trust. <br />
                            <span className="text-blue-500">Secured for Scale.</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                            We protect your data with bank-grade encryption, immutable audit logging, and strict access controls.
                            Our platform is designed to meet the rigorous compliance standards of modern insurance enterprises.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link
                                href="/contact"
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all hover:scale-105"
                            >
                                Contact Security Team
                            </Link>
                            <Link
                                href="/legal/privacy"
                                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all backdrop-blur-sm"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Encryption */}
                    <div className="md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">AES-256 Field-Level Encryption</h3>
                            <p className="text-slate-600 max-w-xl">
                                We don't just encrypt your data in transit. Sensitive Personally Identifiable Information (PII) is encrypted
                                at the field level in our database using <strong>AES-256-GCM</strong> authenticated encryption.
                                This ensures that even in the event of a database compromise, your customer data remains unreadable.
                            </p>
                        </div>
                        {/* Abstract visual decor */}
                        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
                    </div>

                    {/* Audit Logs */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                            <FileJson className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Immutable Audit Logs</h3>
                        <p className="text-slate-600 mb-4">
                            Every critical action—from login attempts to policy changes—is recorded in a tamper-proof audit log.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-slate-500">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> Granular Action Tracking
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-500">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> IP & User Agent Recording
                            </li>
                        </ul>
                    </div>

                    {/* Kiosk Security (New) */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Kiosk Mode</h3>
                        <p className="text-slate-600 mb-4">
                            Designed for high-traffic environments (gym front desks), our microsites feature automated session management.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-slate-500">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> Auto-Privacy Reset (5s)
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-500">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> Idle Session Timeout
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-500">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> Input Masking & Cleaning
                            </li>
                        </ul>
                    </div>

                    {/* Compliance */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">SOC 2 Readiness</h3>
                        <p className="text-slate-600">
                            Our infrastructure and internal processes are designed in alignment with SOC 2 Type II standards.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">Access Control</span>
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">Change Mgmt</span>
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">Monitoring</span>
                        </div>
                    </div>

                    {/* Infrastructure */}
                    <div className="md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-lg transition-shadow relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                                    <Server className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Resilient Infrastructure</h3>
                                <p className="text-slate-600 mb-6">
                                    Hosted on Vercel's global edge network with Supabase (PostgreSQL) persistence.
                                    Our architecture guarantees 99.9% uptime with automated failover and daily point-in-time backups.
                                </p>
                                <Link href="/status" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-1">
                                    View System Status <Activity className="w-4 h-4" />
                                </Link>
                            </div>

                            {/* Stats Panel */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full md:w-64">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                                    <span className="text-sm font-medium text-slate-500">Uptime (30d)</span>
                                    <span className="text-green-600 font-bold">100%</span>
                                </div>
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                                    <span className="text-sm font-medium text-slate-500">APIs Secured</span>
                                    <span className="text-green-600 font-bold">All</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">Backup Policy</span>
                                    <span className="text-slate-900 font-bold">Daily</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* FAQ / Badges */}
            <div className="border-t border-slate-100 bg-slate-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Powered by Secure Technologies</h2>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple text representations or placeholders for badges */}
                        <div className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Globe className="w-6 h-6" /> Vercel Enterprise</div>
                        <div className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Shield className="w-6 h-6" /> Supabase</div>
                        <div className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Lock className="w-6 h-6" /> Stripe Secure</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
