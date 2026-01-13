"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Shield, Lock, FileCheck, Scale, Globe, Server } from "lucide-react"

export default function CompliancePage() {
    const standards = [
        {
            title: "PCI DSS Compliant",
            description: "We maintain the highest standards of payment security, ensuring all transactions and cardholder data are encrypted and processed securely.",
            icon: Shield,
        },
        {
            title: "GDPR & CCPA Ready",
            description: "Our data handling practices are fully aligned with global privacy regulations, giving you complete control and transparency over your data.",
            icon: Globe,
        },
        {
            title: "SOC 2 Type II",
            description: "We regularly undergo rigorous audits to verify our security, availability, and processing integrity controls meet enterprise requirements.",
            icon: FileCheck,
        },
        {
            title: "State Department of Insurance",
            description: "Licensed and admitted in all active jurisdictions. We maintain strict adherence to state-specific insurance regulations and reporting.",
            icon: Scale,
        },
        {
            title: "256-bit Encryption",
            description: "All data in transit and at rest is protected with banking-grade AES-256 encryption protocols to prevent unauthorized access.",
            icon: Lock,
        },
        {
            title: "Data Sovereignty",
            description: "Your data is hosted in secure, redundant data centers within the US, ensuring compliance with local data residency laws.",
            icon: Server,
        },
    ]

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-slate-50 opacity-50" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
                                Compliance & Standards
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                We operate with an uncompromising commitment to regulatory compliance,
                                data security, and operational integrity.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Standards Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {standards.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 rounded-2xl bg-white border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors">
                                    <item.icon className="w-6 h-6 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Quote */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <blockquote className="text-2xl md:text-3xl font-serif text-slate-800 italic leading-relaxed">
                        "Trust is the currency of our business. We don't just meet standards; we aim to set the benchmark for compliance in the insurtech industry."
                    </blockquote>
                    <div className="mt-8">
                        <div className="font-bold text-slate-900">Julian Bradley</div>
                        <div className="text-teal-600">Founder & CEO</div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
