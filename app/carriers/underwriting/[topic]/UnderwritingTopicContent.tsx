"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Activity,
  Clock,
  Brain,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  CheckCircle,
  Lock,
  Users,
  LineChart
} from "lucide-react"
import { UnderwritingTopicData, underwritingTopics } from "@/lib/underwriting-data"

const iconMap: Record<string, React.ElementType> = {
  Activity,
  Clock,
  Brain,
  ShieldCheck,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  CheckCircle,
  Lock,
  Users,
  LineChart
}

const colorClasses = {
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    text: "text-teal-600",
    gradient: "from-teal-500 to-teal-600",
    gradientDark: "from-teal-600 to-teal-700",
    glow: "shadow-teal-500/20",
    ring: "ring-teal-500/30"
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-600",
    gradient: "from-orange-500 to-orange-600",
    gradientDark: "from-orange-600 to-orange-700",
    glow: "shadow-orange-500/20",
    ring: "ring-orange-500/30"
  },
  sky: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    text: "text-sky-600",
    gradient: "from-sky-500 to-sky-600",
    gradientDark: "from-sky-600 to-sky-700",
    glow: "shadow-sky-500/20",
    ring: "ring-sky-500/30"
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
    gradientDark: "from-purple-600 to-purple-700",
    glow: "shadow-purple-500/20",
    ring: "ring-purple-500/30"
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

interface Props {
  topic: UnderwritingTopicData
}

export default function UnderwritingTopicContent({ topic }: Props) {
  const colors = colorClasses[topic.color]
  const TopicIcon = iconMap[topic.icon]

  // Get other topics for navigation
  const otherTopics = underwritingTopics.filter(t => t.id !== topic.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <FloatingOrb className={`w-96 h-96 bg-${topic.color}-400 -top-20 -right-20`} delay={0} />
        <FloatingOrb className={`w-80 h-80 bg-${topic.color}-400 bottom-0 left-10`} delay={2} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              href="/carriers/underwriting"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Underwriting Intelligence
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
              className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mx-auto mb-8 shadow-2xl ${colors.glow}`}
            >
              {TopicIcon && <TopicIcon className="w-10 h-10 text-white" />}
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              {topic.title}
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              {topic.tagline}
            </p>

            <p className="text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed">
              {topic.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-24 -mt-12 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: "Traditional Method", value: topic.marketStats.traditionalMethod, isNegative: true },
              { label: "Our Method", value: topic.marketStats.ourMethod, isPositive: true },
              { label: "Improvement", value: topic.marketStats.improvement, isPositive: true },
              { label: "Annual Savings", value: topic.marketStats.annualSavings, isPositive: true }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                className={`p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl
                           ${stat.isNegative ? 'border-l-4 border-l-slate-400' : ''}
                           ${stat.isPositive ? `border-l-4 border-l-${topic.color}-500` : ''}`}
              >
                <div className="text-sm font-medium text-slate-500 mb-2">{stat.label}</div>
                <div className={`text-lg md:text-xl font-bold ${stat.isNegative ? 'text-slate-600' : colors.text}`}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Key Benefits
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              How {topic.shortTitle.toLowerCase()} transforms underwriting for carriers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {topic.keyBenefits.map((benefit, index) => {
              const BenefitIcon = iconMap[benefit.icon]
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  className="group p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg
                             hover:shadow-xl hover:bg-white transition-all duration-300"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  <motion.div
                    whileHover={{ rotateX: 2, rotateY: -2, y: -5 }}
                    className="h-full"
                  >
                    {/* Icon - CENTERED */}
                    <div className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6 mx-auto
                                    group-hover:bg-gradient-to-br group-hover:${colors.gradient} transition-all duration-300`}>
                      {BenefitIcon && (
                        <BenefitIcon className={`w-8 h-8 ${colors.text} group-hover:text-white transition-colors`} />
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-center">
                      {benefit.description}
                    </p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Data Points */}
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
              Data Points Captured
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The specific data we collect to power {topic.shortTitle.toLowerCase()}.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topic.dataPoints.map((dataPoint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg
                           hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-4 mx-auto`}>
                  <CheckCircle className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">{dataPoint.title}</h3>
                <p className="text-sm text-slate-600 text-center">{dataPoint.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases by Vertical */}
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
              Use Cases by Vertical
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Real-world applications across our coverage verticals.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {topic.useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10
                           hover:bg-white/10 transition-all duration-300"
              >
                <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${colors.gradient} text-white text-sm font-medium mb-4`}>
                  {useCase.vertical}
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  <span className="font-semibold text-white">Example: </span>
                  {useCase.example}
                </p>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
                  <span className="text-slate-400">
                    <span className="font-semibold text-slate-300">Benefit: </span>
                    {useCase.benefit}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
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
              Traditional vs Event-Triggered
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Side-by-side comparison for {topic.shortTitle.toLowerCase()}.
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
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-400">Traditional</th>
                    <th className={`px-6 py-4 text-center font-semibold ${colors.text}`}>Event-Triggered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {topic.comparisonTable.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-slate-500">{row.traditional}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${colors.bg} ${colors.text} font-medium text-sm`}>
                          <CheckCircle className="w-3.5 h-3.5" />
                          {row.eventTriggered}
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

      {/* Other Topics */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Explore Other Data Advantages
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {otherTopics.map((otherTopic, index) => {
              const OtherIcon = iconMap[otherTopic.icon]
              const otherColors = colorClasses[otherTopic.color]

              return (
                <motion.div
                  key={otherTopic.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/carriers/underwriting/${otherTopic.slug}`}>
                    <motion.div
                      className="group p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg
                                 hover:shadow-xl hover:bg-white transition-all duration-300 cursor-pointer h-full"
                      whileHover={{ y: -5 }}
                    >
                      <div className={`w-12 h-12 rounded-xl ${otherColors.bg} ${otherColors.border} border flex items-center justify-center mb-4 mx-auto`}>
                        {OtherIcon && <OtherIcon className={`w-6 h-6 ${otherColors.text}`} />}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">
                        {otherTopic.shortTitle}
                      </h3>
                      <p className="text-sm text-slate-600 text-center mb-4">
                        {otherTopic.tagline}
                      </p>
                      <div className={`flex items-center justify-center gap-2 ${otherColors.text} font-medium text-sm`}>
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 bg-gradient-to-br ${colors.gradientDark}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Leverage {topic.shortTitle}?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              See how {topic.title.toLowerCase()} can transform your underwriting process.
              Schedule a personalized demo with our carrier partnerships team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact?type=carrier"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-5 h-5" />
                Schedule a Demo
              </motion.a>
              <motion.a
                href="/carriers/underwriting"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-5 h-5" />
                All Data Advantages
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
