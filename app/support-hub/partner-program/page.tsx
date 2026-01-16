"use client"

import { motion } from "framer-motion"
import { Building2, Users, GraduationCap, ArrowRight, CheckCircle, Trophy, Briefcase } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PartnerProgramPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-teal-50 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-cyan-50 to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-8"
                        >
                            <Building2 className="w-4 h-4 text-teal-600" />
                            <span className="text-sm font-semibold text-slate-700">HiQor Partner Network</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
                        >
                            Build Your Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">HiQor</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto"
                        >
                            Join the industry's leading event insurance platform. We provide enterprise-grade training, dedicated support, and higher commission tiers for committed partners.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="#apply">
                                <button className="px-8 py-4 bg-teal-600 text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all flex items-center gap-2">
                                    Apply Now
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link href="#training">
                                <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl shadow-md border border-slate-200 hover:bg-slate-50 transition-all">
                                    View Training Details
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Trophy,
                                title: "Premium Commissions",
                                desc: "Unlock our highest commission tiers (up to 47.5%) with recurring revenue models."
                            },
                            {
                                icon: GraduationCap,
                                title: "Enterprise Training",
                                desc: "Access comprehensive sales certification and product knowledge programs."
                            },
                            {
                                icon: Users,
                                title: "Dedicated Success Team",
                                desc: "Direct access to enterprise account managers and priority technical support."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all text-center group"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <item.icon className="w-8 h-8 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Training / Requirements */}
            <section id="training" className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                        <div className="p-10 md:w-2/3">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Partner Requirements</h2>
                            <ul className="space-y-4">
                                {[
                                    "Valid Business Entity & Tax ID",
                                    "Completion of HiQor Product Certification (30 mins)",
                                    "Active Events Industry Presence",
                                    "Commitment to Quality Service Standards"
                                ].map((req, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-teal-500 shrink-0" />
                                        <span className="text-slate-700 font-medium">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-teal-900 p-10 md:w-1/3 flex flex-col justify-center text-white">
                            <Briefcase className="w-12 h-12 mb-6 text-teal-400" />
                            <h3 className="text-xl font-bold mb-2">Ready to Scale?</h3>
                            <p className="text-teal-100 mb-8 text-sm">Join 500+ professionals growing their event insurance revenue.</p>
                            <Link href="#apply">
                                <button className="w-full py-3 bg-white text-teal-900 font-bold rounded-lg hover:bg-teal-50 transition-colors">
                                    Start Application
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Form Placeholder */}
            <section id="apply" className="py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Begin Your Application</h2>
                    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                        <p className="text-slate-600 mb-6">Please contact our partner team to initiate your application.</p>
                        <a href="mailto:partners@daily-event-insurance.com" className="text-2xl font-bold text-teal-600 hover:text-teal-700 underline decoration-2 underline-offset-4">
                            partners@daily-event-insurance.com
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
