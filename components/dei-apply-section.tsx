"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const PORTRAIT_URL = "/images/hiqor-logo.png"

// Business types for insurance partners
const businessTypes = [
  {
    id: "gym-fitness",
    label: "Gym or Fitness Center",
    description: "Traditional gyms, CrossFit boxes, boutique fitness studios, and training facilities",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "climbing-adventure",
    label: "Climbing or Adventure Sports",
    description: "Rock climbing gyms, ropes courses, adventure parks, and outdoor recreation facilities",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    id: "rental-equipment",
    label: "Equipment Rental Business",
    description: "Ski rentals, bike rentals, sports equipment, and recreational gear providers",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const options = [
  {
    id: "demo",
    title: "Request a Demo",
    description: "See how embedded insurance can increase revenue for your facility",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    id: "partner",
    title: "Become a Partner",
    description: "Join 200+ facilities earning commissions with Daily Event Insurance",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    id: "pricing",
    title: "Get Pricing Info",
    description: "Learn about our commission structure and revenue sharing",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: "support",
    title: "Technical Support",
    description: "Get help with integration, implementation, or technical questions",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function ApplySection() {
  const [selectedOption, setSelectedOption] = useState<string>("demo")
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("gym-fitness")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    const webhookUrl = process.env.NEXT_PUBLIC_FORM_WEBHOOK_URL

    const payload = {
      selectedOption,
      optionTitle: options.find((o) => o.id === selectedOption)?.title,
      selectedBusinessType: businessTypes.find(b => b.id === selectedBusinessType)?.label,
      ...formData,
      submittedAt: new Date().toISOString(),
      source: "daily-event-insurance-website",
    }

    try {
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error("Failed to submit form")
        }
      } else {
        // Fallback: log to console if no webhook configured
        console.log("Form submitted (no webhook configured):", payload)
      }

      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", business: "", message: "" })
      setSelectedBusinessType("gym-fitness")
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
      setErrorMessage("Something went wrong. Please try again or email directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitStatus("idle")
    setErrorMessage("")
  }

  return (
    <section
      id="apply"
      ref={containerRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      }}
    >
      {/* Background elements - Updated to teal palette */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-teal-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-teal-600/30 rounded-full blur-[100px]" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Header - Updated to teal accent */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-teal-400 text-sm font-semibold tracking-[0.3em] uppercase mb-2 block">
            Ready to Get Started?
          </span>
          <h2 className="font-[family-name:var(--font-oswald)] text-4xl md:text-6xl font-bold uppercase text-white tracking-tighter mb-4">
            PARTNER WITH US
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Join 200+ facilities earning commissions with embedded insurance. Increase revenue while protecting your customers.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Options */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-6">What are you interested in?</h3>
            {options.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedOption(option.id)}
                className={`w-full p-5 rounded-xl text-left transition-all flex items-start gap-4 group ${
                  selectedOption === option.id
                    ? "bg-gradient-to-r from-teal-500/20 to-teal-600/20 border-2 border-teal-400"
                    : "bg-white/5 border-2 border-transparent hover:border-white/20"
                }`}
              >
                <div
                  className={`${selectedOption === option.id ? "text-teal-400" : "text-white/50 group-hover:text-white/80"} transition-colors`}
                >
                  {option.icon}
                </div>
                <div>
                  <h4
                    className={`font-semibold mb-1 ${selectedOption === option.id ? "text-teal-400" : "text-white"}`}
                  >
                    {option.title}
                  </h4>
                  <p className="text-white/60 text-sm">{option.description}</p>
                </div>
                {selectedOption === option.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                    <svg className="w-6 h-6 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}

            {/* Testimonial Quote - Insurance Context */}
            <div className="pt-6 border-t border-white/10 mt-8">
              <div className="bg-white/5 rounded-lg p-6 border border-teal-500/20">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/80 text-sm italic mb-3">
                  "We've been offering Daily Event Insurance for 6 months and our members love it. Easy to implement and we earn extra revenue on every policy sold."
                </p>
                <p className="text-teal-400 text-sm font-semibold">— Peak Climbing Gym, Denver CO</p>
              </div>
            </div>
          </div>

          {/* Right side - Dynamic Content based on selection */}
          <motion.div
            key={selectedOption}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-8 border border-teal-400/20"
          >
            {/* Support Option */}
            {selectedOption === "support" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Technical Support</h3>
                <p className="text-white/60 mb-8">
                  Get help with integration, API documentation, widget customization, or any technical questions.
                </p>
                <div className="space-y-4">
                  <a
                    href="mailto:support@dailyeventinsurance.com"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all w-full justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Support Team
                  </a>
                  <a
                    href="/docs"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-teal-400 font-bold rounded-lg transition-all w-full justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    View Documentation
                  </a>
                </div>
              </div>
            )}

            {/* Pricing Option */}
            {selectedOption === "pricing" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Simple, Transparent Pricing</h3>
                <p className="text-white/60 mb-8">
                  Earn commissions on every policy sold through your facility. No setup fees, no monthly costs.
                </p>

                <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-xl p-6 mb-6 border border-teal-400/30">
                  <div className="text-4xl font-bold text-teal-400 mb-2">15-25%</div>
                  <div className="text-white/80 text-sm">Commission on each policy</div>
                </div>

                <div className="space-y-3 text-left mb-8">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80 text-sm">No setup fees or integration costs</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80 text-sm">Monthly commission payouts</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80 text-sm">Full support and marketing materials</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOption("demo")}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all"
                >
                  Request a Demo
                </button>
              </div>
            )}

            {/* Partner Option - Newsletter/Interest Signup */}
            {selectedOption === "partner" && (
              <>
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Application Received!</h3>
                    <p className="text-white/60 mb-6">
                      We'll review your application and get back to you within 24 hours with next steps.
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-teal-400 font-semibold hover:underline"
                    >
                      Submit another application
                    </button>
                  </motion.div>
                ) : (
                  <div className="py-4">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Become a Partner</h3>
                      <p className="text-white/60">
                        Join the Daily Event Insurance partner network and start earning commissions today.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Your Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                          placeholder="John Doe"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Email Address *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                          placeholder="john@example.com"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Business Name *</label>
                        <input
                          type="text"
                          value={formData.business}
                          onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                          placeholder="Your gym, facility, or business name"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Tell us about your business (Optional)</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors resize-none"
                          rows={3}
                          placeholder="Number of members, current offerings, etc."
                          disabled={isSubmitting}
                        />
                      </div>

                      {submitStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                        >
                          <p className="text-red-400 text-sm">{errorMessage}</p>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ boxShadow: "0 0 20px rgba(20, 184, 166, 0.3)" }}
                        whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 0 30px rgba(20, 184, 166, 0.5)" } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          "Apply to Partner Program"
                        )}
                      </motion.button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-white/50 text-sm text-center">
                        You'll receive partnership details and onboarding information within 24 hours.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Demo Option - Full Contact Form */}
            {selectedOption === "demo" && (
              <>
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Demo Requested!</h3>
                    <p className="text-white/60 mb-6">
                      We'll contact you within 24 hours to schedule your personalized demo.
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-teal-400 font-semibold hover:underline"
                    >
                      Request another demo
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-teal-400 bg-slate-800 flex items-center justify-center">
                        <svg className="w-10 h-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Daily Event Insurance</h3>
                        <p className="text-white/60 text-sm">Usually responds within 24 hours</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                            placeholder="John Doe"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                            placeholder="(555) 123-4567"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Email Address *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                            placeholder="john@example.com"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Business Name *</label>
                          <input
                            type="text"
                            value={formData.business}
                            onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                            placeholder="Your gym or facility name"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      {/* Business Type Selection */}
                      <div>
                        <label className="block text-white/70 text-sm mb-3">What type of business do you have? *</label>
                        <div className="space-y-3">
                          {businessTypes.map((type) => (
                            <motion.button
                              key={type.id}
                              type="button"
                              onClick={() => setSelectedBusinessType(type.id)}
                              disabled={isSubmitting}
                              className={`w-full p-4 rounded-lg text-left transition-all flex items-start gap-4 ${
                                selectedBusinessType === type.id
                                  ? "bg-gradient-to-r from-teal-500/20 to-teal-600/20 border-2 border-teal-400"
                                  : "bg-white/5 border-2 border-transparent hover:border-white/20"
                              }`}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${
                                selectedBusinessType === type.id
                                  ? "border-teal-400 bg-teal-500/20"
                                  : "border-white/30"
                              }`}>
                                {selectedBusinessType === type.id && (
                                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`${selectedBusinessType === type.id ? "text-teal-400" : "text-white/50"}`}>
                                    {type.icon}
                                  </div>
                                  <p className={`font-semibold ${selectedBusinessType === type.id ? "text-teal-400" : "text-white"}`}>
                                    {type.label}
                                  </p>
                                </div>
                                <p className="text-white/60 text-sm">{type.description}</p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm mb-2">What would you like to know? *</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors resize-none"
                          rows={4}
                          placeholder="Tell us about your facility and what you'd like to learn about our insurance offerings..."
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {submitStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                        >
                          <p className="text-red-400 text-sm">{errorMessage}</p>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ boxShadow: "0 0 20px rgba(20, 184, 166, 0.3)" }}
                        whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 0 30px rgba(20, 184, 166, 0.5)" } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          "Request Demo"
                        )}
                      </motion.button>
                    </form>
                  </>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
