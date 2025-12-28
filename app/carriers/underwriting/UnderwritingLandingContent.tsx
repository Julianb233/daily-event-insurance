"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Activity,
  Clock,
  Brain,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  CheckCircle
} from "lucide-react"
import { underwritingTopics } from "@/lib/underwriting-data"

const iconMap: Record<string, React.ElementType> = {
  Activity,
  Clock,
  Brain,
  ShieldCheck
}

const colorClasses = {
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    text: "text-teal-600",
    gradient: "from-teal-500 to-teal-600",
    glow: "group-hover:shadow-teal-500/20"
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-600",
    gradient: "from-orange-500 to-orange-600",
    glow: "group-hover:shadow-orange-500/20"
  },
  sky: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    text: "text-sky-600",
    gradient: "from-sky-500 to-sky-600",
    glow: "group-hover:shadow-sky-500/20"
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
    glow: "group-hover:shadow-purple-500/20"
  }
}

// Floating orb animation component
function FloatingOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  )
}

export default function UnderwritingLandingContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <FloatingOrb className="w-96 h-96 bg-teal-400 -top-20 -right-20" delay={0} />
        <FloatingOrb className="w-80 h-80 bg-purple-400 bottom-0 left-10" delay={2} />
        <FloatingOrb className="w-64 h-64 bg-orange-400 top-1/2 right-1/4" delay={4} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 text-sm font-medium mb-6"
            >
              <BarChart3 className="w-4 h-4" />
              Data Advantages for Carriers
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Underwriting{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-600">
                Intelligence
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Event-triggered coverage generates rich, real-time data that transforms how you
              assess risk and price policies. Access insights traditional carriers simply cannot match.
            </p>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mt-12">
              {[
                { value: "94%", label: "More Accurate Risk Assessment" },
                { value: "87%", label: "Fraud Reduction" },
                { value: "3.2x", label: "Better Claims Prediction" },
                { value: "$11M+", label: "Annual Carrier Savings" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg"
                >
                  <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-600">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Four Data Advantages
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Each advantage represents a fundamental shift in how insurance underwriting works.
              Click to explore the details.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {underwritingTopics.map((topic, index) => {
              const Icon = iconMap[topic.icon]
              const colors = colorClasses[topic.color]

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link href={`/carriers/underwriting/${topic.slug}`}>
                    <motion.div
                      className={`group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10
                                  hover:bg-white/10 transition-all duration-300 cursor-pointer
                                  shadow-xl hover:shadow-2xl ${colors.glow}`}
                      whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
                      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                    >
                      {/* Glow effect */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                      <div className="relative z-10">
                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6 mx-auto md:mx-0`}>
                          {Icon && <Icon className={`w-8 h-8 ${colors.text}`} />}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                          {topic.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed mb-6">
                          {topic.tagline}
                        </p>

                        {/* Stats Preview */}
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <span className="text-sm text-slate-300">
                              <span className={`font-semibold ${colors.text}`}>{topic.marketStats.improvement}</span>
                            </span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className={`flex items-center gap-2 ${colors.text} font-medium group-hover:gap-3 transition-all`}>
                          Explore Details
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Traditional vs{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-600">
                Event-Triggered
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See how event-triggered underwriting compares to traditional methods across key metrics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Metric</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-400">Traditional</th>
                    <th className="px-6 py-4 text-center font-semibold text-teal-400">Event-Triggered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { metric: "Data Source", traditional: "Self-reported", triggered: "Platform-verified" },
                    { metric: "Data Freshness", traditional: "Annual", triggered: "Real-time" },
                    { metric: "Risk Assessment Accuracy", traditional: "~40%", triggered: "~94%" },
                    { metric: "Fraud Rate", traditional: "5-10%", triggered: "<0.5%" },
                    { metric: "Coverage Efficiency", traditional: "~5%", triggered: "100%" },
                    { metric: "Claims Investigation", traditional: "Days-weeks", triggered: "Minutes-hours" },
                    { metric: "Pricing Model", traditional: "Broad categories", triggered: "Individual behavior" },
                  ].map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">{row.metric}</td>
                      <td className="px-6 py-4 text-center text-slate-500">{row.traditional}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 font-medium text-sm">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {row.triggered}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-teal-600 to-sky-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Underwriting?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join the carriers already benefiting from event-triggered coverage data.
              Let us show you how our platform can reduce fraud, improve pricing, and lower CAC.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact?type=carrier"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-5 h-5" />
                Schedule a Demo
              </motion.a>
              <motion.a
                href="/carriers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowRight className="w-5 h-5" />
                Back to Carriers
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
