"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Mail, Phone, MessageSquare, Clock, MapPin, Send } from "lucide-react"
import { useState } from "react"
import { useVoiceAgent } from "@/lib/voice/voice-context"

export default function SupportContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
    const { openVoiceAgent } = useVoiceAgent()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        setSubmitStatus("success")
        setIsSubmitting(false)
        setFormData({ name: "", email: "", subject: "", message: "" })
    }

    const contactMethods = [
        {
            icon: MessageSquare,
            title: "Live Chat Support",
            description: "Get instant help from our AI assistant. Available 24/7 for partner questions.",
            action: "Start Chat",
            onClick: openVoiceAgent,
            color: "teal"
        },
        {
            icon: Mail,
            title: "Email Support",
            description: "Send us a detailed message. We typically respond within 4-6 hours during business days.",
            action: "support@dailyeventinsurance.com",
            href: "mailto:support@dailyeventinsurance.com",
            color: "blue"
        },
        {
            icon: Phone,
            title: "Phone Support",
            description: "Talk to our team directly. Available Monday-Friday, 9am-6pm ET.",
            action: "(855) 555-1234",
            href: "tel:+18555551234",
            color: "purple"
        }
    ]

    const supportHours = [
        { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM ET", available: true },
        { day: "Saturday", hours: "10:00 AM - 4:00 PM ET", available: true },
        { day: "Sunday", hours: "Closed", available: false },
        { day: "Emergency Claims", hours: "24/7 Available", available: true, highlight: true }
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
                            <a href="/support" className="text-slate-600 hover:text-teal-600 transition-colors">
                                Support
                            </a>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-900 font-medium">Contact</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl">
                            Have questions? Our dedicated support team is here to help. Live in 24 hours with $0 setup fees.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {contactMethods.map((method, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-200 hover:shadow-lg transition-all"
                            >
                                <div className={`w-12 h-12 rounded-lg bg-${method.color}-50 flex items-center justify-center mb-4`}>
                                    <method.icon className={`w-6 h-6 text-${method.color}-600`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
                                <p className="text-slate-600 text-sm mb-4">{method.description}</p>
                                {method.onClick ? (
                                    <button
                                        onClick={method.onClick}
                                        className="text-teal-600 font-semibold hover:text-teal-700 transition-colors flex items-center gap-2"
                                    >
                                        {method.action}
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <a
                                        href={method.href}
                                        className={`text-${method.color}-600 font-semibold hover:text-${method.color}-700 transition-colors`}
                                    >
                                        {method.action}
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Send Us a Message</h2>
                            <p className="text-slate-600 mb-8">
                                Fill out the form below and we'll get back to you within 4 hours during business days.
                            </p>

                            {submitStatus === "success" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-teal-50 border border-teal-200 rounded-xl p-8 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                    <p className="text-slate-600">We'll get back to you within 4 hours.</p>
                                    <button
                                        onClick={() => setSubmitStatus("idle")}
                                        className="mt-4 text-teal-600 font-semibold hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="John Doe"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="john@example.com"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-2">Subject</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="How can we help?"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-2">Message</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                            rows={6}
                                            placeholder="Tell us how we can help..."
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Support Hours & Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Support Hours</h2>
                                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                                    {supportHours.map((schedule, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 flex items-center justify-between ${schedule.highlight ? "bg-teal-50" : ""
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Clock className={`w-5 h-5 ${schedule.highlight ? "text-teal-600" : "text-slate-400"}`} />
                                                <span className="font-medium text-slate-900">{schedule.day}</span>
                                            </div>
                                            <span className={`text-sm ${schedule.available ? "text-slate-600" : "text-slate-400"}`}>
                                                {schedule.hours}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-100">
                                <MapPin className="w-8 h-8 text-teal-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Headquarters</h3>
                                <p className="text-slate-600 text-sm mb-4">
                                    Daily Event Insurance<br />
                                    123 Insurance Plaza<br />
                                    New York, NY 10001
                                </p>
                                <p className="text-xs text-slate-500">
                                    Note: We operate remotely to serve partners nationwide. All support is provided via phone, email, or live chat.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Facts</h3>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-teal-600 font-bold">•</span>
                                        <span>Average response time: <strong>4 hours</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-teal-600 font-bold">•</span>
                                        <span>Go live in: <strong>24 hours</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-teal-600 font-bold">•</span>
                                        <span>Setup cost: <strong>$0</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-teal-600 font-bold">•</span>
                                        <span>Cost to customers: <strong>$0 (optional add-on)</strong></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
