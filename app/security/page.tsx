"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Lock, ShieldCheck, Eye, Fingerprint, Database, Key } from "lucide-react"

export default function SecurityPage() {
    const securityFeatures = [
        {
            title: "Bank-Grade Encryption",
            description: "All sensitive data is encrypted using AES-256 protocols both in transit and at rest, ensuring your information remains secure.",
            icon: Lock,
        },
        {
            title: "Real-Time Monitoring",
            description: "Our systems are monitored 24/7 for suspicious activity, with automated threat detection and immediate response protocols.",
            icon: Eye,
        },
        {
            title: "Access Control",
            description: "Strict role-based access control (RBAC) ensures that only authorized personnel have access to specific data required for their role.",
            icon: Fingerprint,
        },
        {
            title: "Secure Infrastructure",
            description: "Hosted on AWS with multi-zone redundancy, our infrastructure provides industry-leading reliability and physical security.",
            icon: Database,
        },
        {
            title: "Regular Audits",
            description: "We conduct regular third-party security audits and penetration testing to identify and address potential vulnerabilities.",
            icon: ShieldCheck,
        },
        {
            title: "Two-Factor Authentication",
            description: "We enforce multi-factor authentication for all administrative access and sensitive partner operations.",
            icon: Key, // Using generic key icon if available, or fallback
        },
    ]

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[50%] -left-[20%] w-[1000px] h-[1000px] rounded-full bg-teal-900/20 blur-3xl" />
                    <div className="absolute -bottom-[50%] -right-[20%] w-[800px] h-[800px] rounded-full bg-sky-900/20 blur-3xl" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/50 border border-teal-500/30 text-teal-400 text-sm font-medium mb-6">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Enterprise Grade Security</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display tracking-tight">
                                Your Data Security is<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">Our Top Priority</span>
                            </h1>
                            <p className="text-xl text-slate-300 leading-relaxed">
                                We employ state-of-the-art security measures to protect your business
                                and your members' information at every step.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {securityFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-teal-100 shadow-premium hover:shadow-premium-teal transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#F0FDFA] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-7 h-7 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Statement */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4 font-display">
                                    Rigorous Data Practices
                                </h2>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Security isn't just a feature; it's embedded in our culture. From data encryption to employee training, every aspect of our operation is designed to keep your data safe.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                                        GDPR Compliant
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                                        CCPA Ready
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                                        SOC 2 Aligned
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="relative w-48 h-48">
                                    <div className="absolute inset-0 bg-teal-500/10 rounded-full animate-pulse" />
                                    <div className="absolute inset-4 bg-teal-500/20 rounded-full animate-pulse delay-75" />
                                    <div className="absolute inset-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                                        <Lock className="w-16 h-16 text-teal-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
