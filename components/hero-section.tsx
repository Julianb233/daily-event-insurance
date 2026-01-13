"use client"

import { motion } from "framer-motion"
import { ArrowRight, PlayCircle, MessageCircle } from "lucide-react"
import { UrgencyBanner } from "./urgency-banner"
import { useVoiceAgent } from "@/lib/voice/voice-context"

export default function HeroSection() {
  const { openVoiceAgent } = useVoiceAgent()
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(20 184 166) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight tracking-tight"
            >
              Daily Event{" "}
              <span className="text-teal-600 relative inline-block">
                Insurance
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500/30 origin-left"
                />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-700"
            >
              Get Paid to Protect Your Business
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Your members need protection. You deserve a new revenue stream. We make both happen—instantly.
              <span className="block mt-2 font-medium text-slate-700">
                Zero setup cost. No inventory. Pure profit margin.
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {/* Primary CTA - Opens Voice Chat */}
              <motion.button
                onClick={openVoiceAgent}
                whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -12px rgba(20, 184, 166, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-teal-600 rounded-xl shadow-lg hover:bg-teal-700 transition-all duration-300"
              >
                <span>Get Started Today</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.button>

              {/* Secondary CTA - Talk to Specialist Opens Voice Chat */}
              <motion.button
                onClick={openVoiceAgent}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-teal-700 bg-white border-2 border-teal-600 rounded-xl hover:bg-teal-50 transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Talk to a Specialist</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators with Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="space-y-4 pt-4"
            >
              {/* Primary Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">5-Min Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Avg. 42% Revenue Boost</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Full Legal Protection</span>
                </div>
              </div>

              {/* Urgency Banner - Compact */}
              <div className="max-w-xl mx-auto lg:mx-0">
                <UrgencyBanner variant="social-proof" compact />
              </div>
            </motion.div>
          </motion.div>

          {/* Illustration/Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative lg:block hidden"
          >
            {/* Main Visual Container */}
            <div className="relative aspect-square max-w-xl mx-auto">
              {/* Background Gradient Circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-br from-teal-100 via-teal-50 to-sky-100 rounded-full blur-3xl opacity-60"
              />

              {/* Floating Card Elements */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Center Card - Insurance Policy */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                  whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(20, 184, 166, 0.25)" }}
                  className="relative z-30 bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 w-80"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">ACTIVE</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Day Pass Insurance</h3>
                  <p className="text-sm text-slate-600 mb-4">Full coverage for today&apos;s activities</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-slate-900">$5</span>
                    <span className="text-sm text-slate-500">/day</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                      <span>Liability protection up to $1M</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                      <span>Instant digital certificate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                      <span>Same-day activation</span>
                    </div>
                  </div>
                </motion.div>

                {/* Top Left - Stats Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
                  className="absolute top-8 -left-8 z-20 bg-white rounded-xl shadow-lg p-4 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">+42%</div>
                      <div className="text-xs text-slate-500">Revenue Increase</div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Right - Users Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                  className="absolute bottom-8 -right-8 z-20 bg-white rounded-xl shadow-lg p-4 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-teal-200 border-2 border-white" />
                      <div className="w-8 h-8 rounded-full bg-sky-200 border-2 border-white" />
                      <div className="w-8 h-8 rounded-full bg-teal-300 border-2 border-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900">1,247</div>
                      <div className="text-xs text-slate-500">Happy Members</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-20 right-0 w-16 h-16 bg-teal-200 rounded-full opacity-20 blur-xl"
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute bottom-20 left-0 w-20 h-20 bg-sky-200 rounded-full opacity-20 blur-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Divider (Optional) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        <svg
          className="w-full h-full text-white"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C300,80 900,80 1200,0 L1200,120 L0,120 Z"
            fill="currentColor"
            opacity="0.1"
          />
        </svg>
      </div>
    </section>
  )
}
