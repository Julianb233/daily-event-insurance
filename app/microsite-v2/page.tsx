'use client'

import Link from 'next/link'
import { ArrowRight, Mountain, Calendar, MapPin, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MicrositeV2Landing() {
    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Hero Background using standard Tailwind colors matching the recording (Green/Earthy) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-50/90 z-10" />
                {/* Placeholder for the mountain image - using a robust gradient fallback if no image */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center" />
            </div>

            <header className="relative z-20 container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-white/90 backdrop-blur-md p-2 rounded-lg">
                        <Mountain className="w-6 h-6 text-emerald-700" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight drop-shadow-md">HiQor Events</span>
                </div>
                <div className="hidden md:flex items-center gap-4 text-white/90 text-sm font-medium">
                    <span>Powered by Daily Event Insurance</span>
                </div>
            </header>

            <main className="relative z-20 flex-grow flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-100 backdrop-blur-md border border-emerald-400/30 text-sm font-bold uppercase tracking-wider mb-6 shadow-lg">
                        <ShieldCheck className="w-4 h-4" />
                        Official Coverage Partner
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight -ml-1 mb-6 drop-shadow-xl leading-tight">
                        Mountain Trail <br /> Challenge 2026
                    </h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white/90 mb-10 text-lg font-medium">
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                            <Calendar className="w-5 h-5 text-emerald-400" />
                            <span>April 15, 2026</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                            <MapPin className="w-5 h-5 text-emerald-400" />
                            <span>Boulder, CO</span>
                        </div>
                    </div>

                    <Link href="/microsite-v2/wizard">
                        <button className="group relative inline-flex items-center gap-3 px-8 py-5 bg-emerald-500 hover:bg-emerald-400 text-white text-xl font-bold rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1">
                            Activate Coverage
                            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                        </button>
                    </Link>

                    <p className="mt-6 text-white/60 text-sm max-w-md mx-auto leading-relaxed">
                        All participants are required to activate their event coverage at least 24 hours prior to race day.
                    </p>
                </motion.div>
            </main>

            <footer className="relative z-20 py-6 text-center text-white/40 text-xs">
                <p>&copy; 2026 HiQor Events. All rights reserved.</p>
            </footer>
        </div>
    )
}
