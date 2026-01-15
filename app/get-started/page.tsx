"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Shield, Clock, Headphones } from "lucide-react"

const businessTypes = [
  { id: "gym-fitness", label: "Gym or Fitness Center" },
  { id: "climbing-adventure", label: "Climbing or Adventure Sports" },
  { id: "rental-equipment", label: "Equipment Rental Business" },
  { id: "yoga-pilates", label: "Yoga or Pilates Studio" },
  { id: "martial-arts", label: "Martial Arts School" },
  { id: "other", label: "Other" },
]

export default function GetStartedPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    yourName: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    const webhookUrl = process.env.NEXT_PUBLIC_FORM_WEBHOOK_URL

    const payload = {
      ...formData,
      submittedAt: new Date().toISOString(),
      source: "get-started-page",
      formType: "partner-signup",
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
        console.log("Form submitted (no webhook configured):", payload)
      }

      setSubmitStatus("success")
      setFormData({
        businessName: "",
        yourName: "",
        email: "",
        phone: "",
        businessType: "",
        message: "",
      })
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
      setErrorMessage("Something went wrong. Please try again or email support@dailyeventinsurance.com directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(20,184,166,0.15) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 md:py-20">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Image
            src="/images/logo-color.png"
            alt="Daily Event Insurance"
            width={280}
            height={112}
            className="mx-auto h-auto"
            priority
          />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-10"
        >
          <h1 className="font-oswald text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            START EARNING <span className="text-teal-500">TODAY</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto">
            Zero cost to you. We pay for the insurance AND we pay you for every participant.
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          <div className="flex items-center gap-2 text-slate-600">
            <Shield className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-medium">A-Rated Carriers</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-medium">Live in 24 Hours</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Headphones className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-medium">24/7 Support</span>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8"
        >
          {submitStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">You're All Set!</h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                We'll review your application and contact you within 24 hours with next steps. Get ready to start earning!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
              >
                Return Home
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                  placeholder="Your gym, facility, or business name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Your Name */}
              <div>
                <label htmlFor="yourName" className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="yourName"
                  value={formData.yourName}
                  onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                  placeholder="you@yourbusiness.com"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone (Optional) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                  placeholder="(555) 123-4567"
                  disabled={isSubmitting}
                />
              </div>

              {/* Business Type Dropdown */}
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-slate-700 mb-2">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all appearance-none cursor-pointer"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select your business type</option>
                  {businessTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message (Optional) */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Tell us about your business <span className="text-slate-400">(Optional)</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Number of members, current offerings, questions you have..."
                  disabled={isSubmitting}
                />
              </div>

              {/* Error Message */}
              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm">{errorMessage}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50"
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.99 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Start Earning Now"
                )}
              </motion.button>

              {/* Fine Print */}
              <p className="text-center text-sm text-slate-500">
                No commitments. No setup fees. Cancel anytime.
              </p>
            </form>
          )}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 grid grid-cols-3 gap-4 text-center"
        >
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200">
            <div className="text-2xl md:text-3xl font-bold text-teal-600">247+</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">Partner Facilities</div>
          </div>
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200">
            <div className="text-2xl md:text-3xl font-bold text-teal-600">$0</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">Cost to You</div>
          </div>
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200">
            <div className="text-2xl md:text-3xl font-bold text-teal-600">24hr</div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">Go Live</div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
