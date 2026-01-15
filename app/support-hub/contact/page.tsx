"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Ticket,
  ExternalLink,
  Send
} from "lucide-react"
import { useVoiceAgent } from "@/lib/voice/voice-context"
import { TicketCategory, TicketPriority } from "@/lib/support/ticket-types"

interface TicketResponse {
  ticket: {
    id: string
    ticketNumber: string
    subject: string
    status: string
    priority: string
    category: string
    createdAt: string
  }
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: TicketCategory.GENERAL as string,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [ticketNumber, setTicketNumber] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { openVoiceAgent } = useVoiceAgent()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          category: formData.category,
          priority: TicketPriority.MEDIUM,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit ticket")
      }

      const ticketData = data.data as TicketResponse
      setTicketNumber(ticketData.ticket.ticketNumber)
      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "", category: TicketCategory.GENERAL })
    } catch (error: any) {
      console.error("Error submitting ticket:", error)
      setErrorMessage(error.message || "Failed to submit ticket. Please try again.")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
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
    <div className="space-y-12">
      {/* Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-5xl font-bold text-slate-900">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600">
            Have questions? Our dedicated support team is here to help. Live in 24 hours with $0 setup fees.
          </p>
        </motion.div>
      </div>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-3 gap-6">
        {contactMethods.map((method, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hoverEffect>
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${method.color}-500 to-${method.color}-600 flex items-center justify-center mb-4`}>
                  <method.icon className="w-6 h-6 text-white" />
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
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Contact Form and Info */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <GlassCard>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Send Us a Message</h2>
            <p className="text-slate-600 mb-6">
              Fill out the form below and we'll get back to you within 4 hours during business days.
            </p>

            {submitStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ticket Created!</h3>
                {ticketNumber && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-500 mb-1">Your ticket number:</p>
                    <p className="text-2xl font-mono font-bold text-teal-600">{ticketNumber}</p>
                  </div>
                )}
                <p className="text-slate-600 mb-4">We'll respond within 4 hours during business days.</p>
                <p className="text-sm text-slate-500 mb-6">
                  Save your ticket number to track your request status.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href={`/support-hub/tickets?email=${encodeURIComponent(formData.email || "")}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                    View My Tickets
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setSubmitStatus("idle")
                      setTicketNumber(null)
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              </motion.div>
            ) : submitStatus === "error" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Submission Failed</h3>
                <p className="text-slate-600 mb-4">{errorMessage || "Something went wrong. Please try again."}</p>
                <button
                  onClick={() => {
                    setSubmitStatus("idle")
                    setErrorMessage(null)
                  }}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Try Again
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    placeholder="john@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    disabled={isSubmitting}
                  >
                    <option value={TicketCategory.GENERAL}>General Inquiry</option>
                    <option value={TicketCategory.BILLING}>Billing Question</option>
                    <option value={TicketCategory.TECHNICAL}>Technical Support</option>
                    <option value={TicketCategory.INTEGRATION}>Integration Help</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none bg-white"
                    rows={6}
                    placeholder="Tell us how we can help..."
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Creating Ticket..."
                  ) : (
                    <>
                      Submit Ticket
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </GlassCard>

        {/* Support Hours & Info */}
        <div className="space-y-6">
          <GlassCard>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Support Hours</h2>
              <div className="space-y-3">
                {supportHours.map((schedule, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg flex items-center justify-between ${
                      schedule.highlight ? "bg-teal-50" : "bg-white/50"
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
          </GlassCard>

          <GlassCard>
            <div className="p-8">
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
          </GlassCard>

          <GlassCard>
            <div className="p-8">
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
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
