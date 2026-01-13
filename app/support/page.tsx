"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { FAQSection } from "@/components/faq-section"
import { motion } from "framer-motion"
import { LifeBuoy, FileText, MessageSquare, Phone, Mail, BookOpen, Download } from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
    const resources = [
        {
            title: "Partner Guide",
            description: "Complete documentation on how to integrate and maximize your partnership.",
            icon: BookOpen,
            action: "Read Guide",
            href: "#"
        },
        {
            title: "Marketing Assets",
            description: "Logos, banners, and templates to help you promote insurance to your members.",
            icon: Download,
            action: "Download Kit",
            href: "#"
        },
        {
            title: "API Documentation",
            description: "Technical specifications for integrating our insurance engine directly into your platform.",
            icon: FileText,
            action: "View Docs",
            href: "/partners/api-docs" // Placeholder link
        }
    ]

    const contactMethods = [
        {
            icon: Phone,
            title: "Call Us",
            value: "(555) 123-4567",
            href: "tel:+15551234567",
            subtext: "Mon-Fri, 9am-6pm EST"
        },
        {
            icon: Mail,
            title: "Email Support",
            value: "support@dailyeventinsurance.com",
            href: "mailto:support@dailyeventinsurance.com",
            subtext: "Response within 24 hours"
        },
        {
            icon: MessageSquare,
            title: "Live Chat",
            value: "Start a Chat",
            href: "#",
            subtext: "Available 24/7 for tailored support"
        }
    ]

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-white pt-32 pb-20 border-b border-slate-100">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mb-8"
                    >
                        <LifeBuoy className="w-8 h-8" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display"
                    >
                        Partner Support Hub
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        Everything you need to succeed. Find answers, download resources,
                        or get in touch with our dedicated support team.
                    </motion.p>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="py-12 -mt-10 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {contactMethods.map((method, index) => (
                            <motion.a
                                key={index}
                                href={method.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (index * 0.1) }}
                                className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:border-teal-100 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                    <method.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{method.title}</h3>
                                <div className="text-teal-600 font-medium mb-1">{method.value}</div>
                                <div className="text-xs text-slate-500">{method.subtext}</div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Partner Resources</h2>
                        <p className="text-slate-600">Essential tools and guides for your business.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {resources.map((resource, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-teal-200 transition-colors">
                                <resource.icon className="w-10 h-10 text-teal-600 mb-6" />
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{resource.title}</h3>
                                <p className="text-slate-600 mb-6 min-h-[3rem]">{resource.description}</p>
                                <Link href={resource.href} className="text-teal-600 font-semibold hover:text-teal-700 inline-flex items-center gap-2">
                                    {resource.action}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section Reuse */}
            <section className="bg-white py-10">
                <FAQSection />
            </section>

            <Footer />
        </main>
    )
}
