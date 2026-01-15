"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { FAQSection } from "@/components/faq-section"
import { IntegrationChatWidget } from "@/components/support/IntegrationChatWidget"
import { motion } from "framer-motion"
import { MessageSquare, Phone, Mail } from "lucide-react"
import Image from "next/image"

export default function SupportPage() {
    const [isChatOpen, setIsChatOpen] = useState(false)

    const contactMethods = [
        {
            icon: Phone,
            title: "Call Us",
            value: "(555) 123-4567",
            href: "tel:+15551234567",
            subtext: "Mon-Fri, 9am-6pm EST",
            isChat: false
        },
        {
            icon: Mail,
            title: "Email Support",
            value: "support@dailyeventinsurance.com",
            href: "mailto:support@dailyeventinsurance.com",
            subtext: "Response within 24 hours",
            isChat: false
        },
        {
            icon: MessageSquare,
            title: "Live Chat",
            value: "Start a Chat",
            href: "#",
            subtext: "Available 24/7 for tailored support",
            isChat: true
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
                        className="mb-8"
                    >
                        <Image
                            src="/images/logo-color.png"
                            alt="Daily Event Insurance"
                            width={240}
                            height={96}
                            className="mx-auto h-auto"
                            priority
                        />
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
                        {contactMethods.map((method, index) => {
                            const cardClasses = "bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:border-teal-100 transition-all duration-300 group cursor-pointer"
                            const content = (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                        <method.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1">{method.title}</h3>
                                    <div className="text-teal-600 font-medium mb-1">{method.value}</div>
                                    <div className="text-xs text-slate-500">{method.subtext}</div>
                                </>
                            )

                            if (method.isChat) {
                                return (
                                    <motion.button
                                        key={index}
                                        onClick={() => setIsChatOpen(true)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + (index * 0.1) }}
                                        className={cardClasses}
                                    >
                                        {content}
                                    </motion.button>
                                )
                            }

                            return (
                                <motion.a
                                    key={index}
                                    href={method.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                    className={cardClasses}
                                >
                                    {content}
                                </motion.a>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section Reuse */}
            <section className="bg-white py-10">
                <FAQSection />
            </section>

            <Footer />

            {/* Live Chat Widget */}
            {isChatOpen && (
                <IntegrationChatWidget
                    topic="troubleshooting"
                    pageUrl="/support"
                    position="bottom-right"
                    defaultOpen={true}
                    onClose={() => setIsChatOpen(false)}
                />
            )}
        </main>
    )
}
