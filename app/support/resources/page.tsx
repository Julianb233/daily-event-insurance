"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { BookOpen, Download, FileText, Layout, MessageSquare, Search, ExternalLink, PlayCircle } from "lucide-react"
import Link from "next/link"

export default function SupportResourcesPage() {
    const resourceCategories = [
        {
            title: "Marketing Materials",
            icon: Layout,
            items: [
                { name: "Partner Logo Pack (PNG, SVG)", size: "2.4 MB", type: "ZIP" },
                { name: "Event Flyer Templates", size: "1.8 MB", type: "PDF" },
                { name: "Email Campaign Templates", size: "450 KB", type: "DOCX" },
                { name: "Social Media Graphics Kit", size: "5.2 MB", type: "ZIP" },
                { name: "Branded Presentation Deck", size: "3.1 MB", type: "PPTX" },
            ]
        },
        {
            title: "Technical Resources",
            icon: FileText,
            items: [
                { name: "API Integration Guide", size: "890 KB", type: "PDF" },
                { name: "Webhook Documentation", size: "320 KB", type: "PDF" },
                { name: "SDK Code Samples (JavaScript)", size: "125 KB", type: "ZIP" },
                { name: "SDK Code Samples (Python)", size: "98 KB", type: "ZIP" },
                { name: "Postman Collection", size: "45 KB", type: "JSON" },
            ]
        },
        {
            title: "Training & Guides",
            icon: BookOpen,
            items: [
                { name: "Partner Onboarding Checklist", size: "180 KB", type: "PDF" },
                { name: "RunSignup Integration Guide", size: "420 KB", type: "PDF" },
                { name: "BikeReg Setup Instructions", size: "385 KB", type: "PDF" },
                { name: "MindBody Integration Guide", size: "510 KB", type: "PDF" },
                { name: "Commission Structure Reference", size: "225 KB", type: "PDF" },
            ]
        },
        {
            title: "Video Tutorials",
            icon: PlayCircle,
            items: [
                { name: "Platform Overview (15:32)", size: "Video", type: "WATCH" },
                { name: "Adding Your First Event (8:45)", size: "Video", type: "WATCH" },
                { name: "Managing Participant Policies (12:10)", size: "Video", type: "WATCH" },
                { name: "Viewing Reports & Earnings (7:23)", size: "Video", type: "WATCH" },
                { name: "Claims Process Walkthrough (10:55)", size: "Video", type: "WATCH" },
            ]
        },
        {
            title: "Industry-Specific Guides",
            icon: FileText,
            items: [
                { name: "Running Events Best Practices", size: "670 KB", type: "PDF" },
                { name: "Cycling Event Insurance Guide", size: "540 KB", type: "PDF" },
                { name: "Triathlon Coverage Essentials", size: "780 KB", type: "PDF" },
                { name: "Obstacle Course Race Guide", size: "820 KB", type: "PDF" },
                { name: "Gym & Fitness Center Guide", size: "610 KB", type: "PDF" },
                { name: "Ski Resort Insurance Overview", size: "590 KB", type: "PDF" },
            ]
        },
        {
            title: "Tools & Calculators",
            icon: Download,
            items: [
                { name: "Commission Calculator (Excel)", size: "95 KB", type: "XLSX" },
                { name: "ROI Projection Template", size: "120 KB", type: "XLSX" },
                { name: "Participant Enrollment Tracker", size: "78 KB", type: "XLSX" },
                { name: "Event Planning Timeline", size: "210 KB", type: "PDF" },
            ]
        },
    ]

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-white pt-32 pb-16 border-b border-slate-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Link href="/support" className="text-slate-600 hover:text-teal-600 transition-colors">
                                Support
                            </Link>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-900 font-medium">Resources</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            Partner Resources & Downloads
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl">
                            Everything you need to succeed. Marketing materials, technical documentation,
                            training guides, and tools to maximize your partnership.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search Bar */}
            <section className="bg-white py-8 border-b border-slate-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Resource Categories */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl space-y-12">
                    {resourceCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            id={category.title.toLowerCase().replace(/ /g, '-')}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <category.icon className="w-5 h-5 text-teal-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">{category.title}</h2>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                                {category.items.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                                                {item.type === 'WATCH' ? (
                                                    <PlayCircle className="w-6 h-6 text-slate-600 group-hover:text-teal-600" />
                                                ) : item.type === 'PDF' ? (
                                                    <FileText className="w-6 h-6 text-slate-600 group-hover:text-teal-600" />
                                                ) : (
                                                    <Download className="w-6 h-6 text-slate-600 group-hover:text-teal-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-900 mb-1">{item.name}</h3>
                                                <p className="text-sm text-slate-500">{item.size}</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all flex items-center gap-2 font-medium">
                                            {item.type === 'WATCH' ? (
                                                <>
                                                    Watch <ExternalLink className="w-4 h-4" />
                                                </>
                                            ) : (
                                                <>
                                                    Download <Download className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-teal-50 to-blue-50">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Need Something Custom?
                    </h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Our team can create custom marketing materials, integration guides, or training
                        resources tailored to your specific needs.
                    </p>
                    <Link
                        href="/support/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Contact Support Team
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    )
}
