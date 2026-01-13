"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import {
    BookOpen, Clock, Users, Zap, CheckCircle, ArrowRight,
    Rocket, FileText, TrendingUp, Shield, Server, Code2
} from "lucide-react"
import Link from "next/link"

export default function SupportDocsPage() {
    const quickStart = [
        {
            title: "1. Create Your Account",
            description: "Sign up in under 2 minutes with just your business email.",
            time: "2 min",
            icon: Users
        },
        {
            title: "2. Connect Your Platform",
            description: "Integrate with RunSignup, BikeReg, MindBody, or use our API.",
            time: "5 min",
            icon: Server
        },
        {
            title: "3. Configure Coverage",
            description: "Set up policy options for your events and participants.",
            time: "3 min",
            icon: Shield
        },
        {
            title: "4. Go Live",
            description: "Start offering insurance to your participants immediately.",
            time: "< 1 min",
            icon: Rocket
        }
    ]

    const integrationGuides = [
        {
            title: "RunSignup Integration",
            description: "Complete guide to integrating with RunSignup for race directors.",
            topics: ["Setup", "Participant Enrollment", "Policy Management", "Reporting"],
            icon: Code2,
            href: "#runsignup"
        },
        {
            title: "BikeReg Integration",
            description: "Step-by-step integration for cycling events on BikeReg.",
            topics: ["API Setup", "Event Configuration", "Automated Enrollment"],
            icon: Code2,
            href: "#bikereg"
        },
        {
            title: "MindBody Integration",
            description: "Connect your gym or fitness center with MindBody integration.",
            topics: ["Plugin Installation", "Member Sync", "Class Coverage"],
            icon: Code2,
            href: "#mindbody"
        },
        {
            title: "Zen Planner Integration",
            description: "Seamless integration for CrossFit and fitness facilities.",
            topics: ["Setup Guide", "Challenge Coverage", "Member Management"],
            icon: Code2,
            href: "#zenplanner"
        },
    ]

    const documentSections = [
        {
            title: "Getting Started",
            icon: Rocket,
            articles: [
                "Platform Overview",
                "Account Setup & Onboarding",
                "First Event Walkthrough",
                "Commission Structure Explained",
                "$0 Setup Fee - How It Works"
            ]
        },
        {
            title: "Policy Management",
            icon: Shield,
            articles: [
                "Understanding Coverage Types",
                "Sector-Specific Policies",
                "Pricing & Premium Calculation",
                "Policy Activation & Status",
                "Certificate of Insurance"
            ]
        },
        {
            title: "Integration & API",
            icon: Server,
            articles: [
                "API Authentication",
                "Webhook Configuration",
                "Platform Integrations",
                "Code Samples & SDKs",
                "Testing & Sandbox Environment"
            ]
        },
        {
            title: "Reporting & Earnings",
            icon: TrendingUp,
            articles: [
                "Dashboard Overview",
                "Commission Calculations",
                "Payout Schedule",
                "Revenue Reports",
                "Tax Documentation"
            ]
        },
        {
            title: "Best Practices",
            icon: CheckCircle,
            articles: [
                "Maximizing Participant Enrollment",
                "Marketing Insurance to Members",
                "Industry-Specific Tips",
                "Seasonal Planning",
                "Customer Support Excellence"
            ]
        },
        {
            title: "Claims & Support",
            icon: FileText,
            articles: [
                "Claims Process Overview",
                "What's Covered (By Sector)",
                "Filing a Claim",
                "Claim Status Tracking",
                "24/7 Emergency Support"
            ]
        }
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
                            <span className="text-slate-900 font-medium">Documentation</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            Product Documentation
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl">
                            Comprehensive guides, integration tutorials, and best practices to help you
                            succeed with Daily Event Insurance.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Quick Start Guide */}
            <section className="py-16 bg-gradient-to-br from-teal-50 to-blue-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Quick Start - Live in 24 Hours
                        </h2>
                        <p className="text-lg text-slate-600">
                            $0 setup fee • $0 cost to your customers • Full integration support
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickStart.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-200 transition-colors relative"
                            >
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
                                    <step.icon className="w-6 h-6 text-teal-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-600 text-sm mb-3">{step.description}</p>
                                <div className="flex items-center gap-1 text-sm text-teal-600 font-medium">
                                    <Clock className="w-4 h-4" />
                                    {step.time}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integration Guides */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Platform Integrations</h2>
                        <p className="text-lg text-slate-600">
                            Step-by-step guides for integrating with your existing platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {integrationGuides.map((guide, index) => (
                            <motion.a
                                key={index}
                                href={guide.href}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-200 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-teal-50 transition-colors flex-shrink-0">
                                        <guide.icon className="w-6 h-6 text-slate-600 group-hover:text-teal-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                                            {guide.title}
                                        </h3>
                                        <p className="text-slate-600 mb-4">{guide.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {guide.topics.map((topic, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Documentation Sections */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Topic</h2>
                        <p className="text-lg text-slate-600">
                            Detailed documentation organized by category
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {documentSections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                                        <section.icon className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
                                </div>
                                <ul className="space-y-2">
                                    {section.articles.map((article, idx) => (
                                        <li key={idx}>
                                            <a
                                                href="#"
                                                className="text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-2 group"
                                            >
                                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                                                {article}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <Zap className="w-12 h-12 text-teal-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-slate-300 mb-8">
                        Join thousands of partners offering participant insurance.
                        $0 setup fee, live in 24 hours, earn commission on every policy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                        >
                            Start Today
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/support/contact"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors font-semibold"
                        >
                            Talk to Our Team
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
