"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowDown,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Heart,
  FileText,
  Database,
  TrendingUp,
  CheckCircle2,
  Zap,
  BarChart3,
  Users,
  Sparkles,
  Scan,
  ClipboardCheck,
  Building2,
  Trophy,
  Target
} from "lucide-react"

// Floating orb component for background decoration
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  )
}

// Flow connector line component
function FlowConnector({ direction = "down", className = "" }: { direction?: "down" | "right"; className?: string }) {
  if (direction === "right") {
    return (
      <div className={`hidden md:flex items-center justify-center ${className}`}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full h-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full origin-left"
        />
        <ArrowRight className="w-6 h-6 text-emerald-500 -ml-1" />
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center py-4 ${className}`}>
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-1 h-12 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-full origin-top"
      />
      <ArrowDown className="w-6 h-6 text-emerald-500 -mt-1" />
    </div>
  )
}

// Flow node component
function FlowNode({
  icon: Icon,
  title,
  subtitle,
  color = "teal",
  delay = 0,
  size = "default"
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
  color?: "teal" | "purple" | "orange" | "blue"
  delay?: number
  size?: "default" | "large"
}) {
  const colorMap = {
    teal: {
      bg: "bg-gradient-to-br from-teal-500 to-emerald-600",
      glow: "shadow-teal-500/40",
      border: "border-teal-400/30"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-violet-600",
      glow: "shadow-purple-500/40",
      border: "border-purple-400/30"
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-500 to-amber-600",
      glow: "shadow-orange-500/40",
      border: "border-orange-400/30"
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-sky-600",
      glow: "shadow-blue-500/40",
      border: "border-blue-400/30"
    }
  }

  const colors = colorMap[color]
  const sizeClasses = size === "large"
    ? "w-28 h-28 md:w-32 md:h-32"
    : "w-20 h-20 md:w-24 md:h-24"
  const iconSize = size === "large" ? "w-12 h-12 md:w-14 md:h-14" : "w-8 h-8 md:w-10 md:h-10"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="flex flex-col items-center gap-3"
    >
      <div className={`${sizeClasses} ${colors.bg} rounded-2xl flex items-center justify-center shadow-xl ${colors.glow} border ${colors.border}`}>
        <Icon className={`${iconSize} text-white`} />
      </div>
      <div className="text-center">
        <p className="font-bold text-slate-900 text-sm md:text-base">{title}</p>
        {subtitle && <p className="text-xs md:text-sm text-slate-500">{subtitle}</p>}
      </div>
    </motion.div>
  )
}

// Data card component
function DataCard({
  icon: Icon,
  title,
  items,
  color = "teal",
  delay = 0
}: {
  icon: React.ElementType
  title: string
  items: string[]
  color?: "teal" | "purple" | "orange"
  delay?: number
}) {
  const colorMap = {
    teal: {
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      border: "border-teal-200",
      checkColor: "text-teal-500"
    },
    purple: {
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      border: "border-purple-200",
      checkColor: "text-purple-500"
    },
    orange: {
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      border: "border-orange-200",
      checkColor: "text-orange-500"
    }
  }

  const colors = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
      className="group relative"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-${color}-500/50 to-${color}-600/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500`} />

      <div className={`relative bg-white rounded-2xl p-6 border ${colors.border} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${colors.iconColor}`} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>

        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${colors.checkColor} flex-shrink-0`} />
              <span className="text-sm text-slate-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function LeadFlowPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <main ref={containerRef} className="relative overflow-x-hidden max-w-full bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden min-h-[60vh] flex items-center">
        {/* Animated background orbs */}
        <FloatingOrb
          className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-teal-500/30 to-emerald-500/15 rounded-full blur-[100px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-gradient-to-br from-purple-500/20 to-teal-500/15 rounded-full blur-[120px]"
          delay={2}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-8 shadow-lg"
            >
              <Database className="w-4 h-4 text-teal-400" />
              <span className="text-teal-300 font-medium text-sm">Lead Generation Intelligence</span>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight"
            >
              Race Day Coverage
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
                Lead Flow
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Embedded inside race event partners, our platform delivers pre-qualified leads with
              biometric data, TCPA consent, and verified participation—transforming event coverage into
              a powerful acquisition channel.
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Main Flow Diagram Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              The Lead Generation Flow
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From event registration to carrier data delivery—every touchpoint creates value.
            </p>
          </motion.div>

          {/* Flow Diagram */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-white rounded-3xl" />

            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12">

              {/* Row 1: Entry Point */}
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-6"
                >
                  <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-2">
                    Entry Point
                  </span>
                </motion.div>
                <FlowNode
                  icon={Trophy}
                  title="Race Event Partner"
                  subtitle="Spartan, Tough Mudder, etc."
                  color="teal"
                  size="large"
                  delay={0.1}
                />
              </div>

              <FlowConnector />

              {/* Row 2: Registration & Coverage */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
                <FlowNode
                  icon={ClipboardCheck}
                  title="Event Registration"
                  subtitle="Checkout integration"
                  color="blue"
                  delay={0.2}
                />
                <FlowConnector direction="right" className="hidden md:flex px-4" />
                <FlowNode
                  icon={Shield}
                  title="AD&D Coverage Offer"
                  subtitle="One-click opt-in"
                  color="teal"
                  delay={0.3}
                />
                <FlowConnector direction="right" className="hidden md:flex px-4" />
                <FlowNode
                  icon={Scan}
                  title="Biometric Face Scan"
                  subtitle="Optional health data"
                  color="purple"
                  delay={0.4}
                />
              </div>

              <FlowConnector />

              {/* Row 3: Data Collection Hub */}
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-purple-500 rounded-2xl blur opacity-30" />
                  <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl px-8 py-6 text-center">
                    <Database className="w-12 h-12 text-teal-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-white mb-1">HIQOR Data Platform</h3>
                    <p className="text-slate-400 text-sm">Unified lead intelligence hub</p>
                  </div>
                </motion.div>
              </div>

              <FlowConnector />

              {/* Row 4: Three Data Streams */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <DataCard
                  icon={User}
                  title="Contact Data"
                  color="teal"
                  delay={0.6}
                  items={[
                    "Full name",
                    "Phone number",
                    "Email address",
                    "City & State",
                    "Age / Date of Birth",
                    "TCPA marketing consent"
                  ]}
                />
                <DataCard
                  icon={Heart}
                  title="Biometric Data"
                  color="purple"
                  delay={0.7}
                  items={[
                    "Face scan health metrics",
                    "Estimated vitals data",
                    "Wellness indicators",
                    "Risk profile signals",
                    "Future: Cardiogram integration"
                  ]}
                />
                <DataCard
                  icon={Activity}
                  title="Race Event Data"
                  color="orange"
                  delay={0.8}
                  items={[
                    "Event type & distance",
                    "Coverage start/end times",
                    "AD&D policy details",
                    "Participation history",
                    "Performance metrics"
                  ]}
                />
              </div>

              <FlowConnector />

              {/* Row 5: Carrier Output */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                  className="text-center mb-6"
                >
                  <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-2">
                    Delivery
                  </span>
                </motion.div>
                <FlowNode
                  icon={Building2}
                  title="Insurance Carrier"
                  subtitle="Pre-qualified, intent-rich leads"
                  color="teal"
                  size="large"
                  delay={1.0}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingOrb
          className="absolute top-20 right-[20%] w-64 h-64 bg-gradient-to-br from-teal-500/30 to-emerald-500/20 rounded-full blur-[80px]"
          delay={0.5}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Biometrically Enhanced Leads{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Convert Better
              </span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              These aren&apos;t cold leads—they&apos;re verified, active participants who&apos;ve already demonstrated
              interest in protection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: "68%", subtitle: "Average Opt-In Rate", desc: "Intent-rich leads ready to engage" },
              { icon: TrendingUp, title: "4x", subtitle: "Lower CAC", desc: "Vs. traditional acquisition channels" },
              { icon: Users, title: "25-45", subtitle: "Age Demo Sweet Spot", desc: "Hard-to-reach active lifestyle segment" },
              { icon: Zap, title: "Real-Time", subtitle: "Data Delivery", desc: "Leads flow instantly to your systems" }
            ].map((stat, index) => (
              <motion.div
                key={stat.subtitle}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-teal-500/50 transition-all duration-500 text-center h-full">
                  <stat.icon className="w-10 h-10 text-teal-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.title}</div>
                  <div className="text-teal-400 font-semibold text-sm mb-2">{stat.subtitle}</div>
                  <p className="text-slate-400 text-sm">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Quality Comparison */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Data Quality Comparison
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See how event-triggered leads compare to traditional lead sources.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
            <div className="relative backdrop-blur-sm bg-white/80 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Data Point</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-500">Traditional Leads</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-teal-600">Race Day Leads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { metric: "Contact Verification", traditional: "Self-reported", hiqor: "Event-verified" },
                      { metric: "TCPA Consent", traditional: "Unclear/Disputed", hiqor: "Explicit opt-in" },
                      { metric: "Health Signals", traditional: "None", hiqor: "Biometric face scan" },
                      { metric: "Activity Level", traditional: "Unknown", hiqor: "Verified active" },
                      { metric: "Purchase Intent", traditional: "Low/Cold", hiqor: "High/Just purchased coverage" },
                      { metric: "Age Accuracy", traditional: "Often wrong", hiqor: "DOB verified" },
                      { metric: "Engagement Timing", traditional: "Random", hiqor: "Peak interest moment" }
                    ].map((row, index) => (
                      <tr
                        key={row.metric}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-teal-50/30 transition-colors`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.metric}</td>
                        <td className="px-6 py-4 text-center text-sm text-slate-500">{row.traditional}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 rounded-full text-sm font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            {row.hiqor}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-6">
                Seamless Integration
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Connect Your Systems,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                  Start Receiving Leads
                </span>
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Our platform integrates with your existing CRM, lead management, and underwriting
                systems. Leads flow in real-time with full data enrichment.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "REST API for real-time lead delivery",
                  "Webhook notifications for instant updates",
                  "Batch export options for bulk processing",
                  "Custom field mapping to your data schema",
                  "HIPAA-compliant data transfer protocols"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/carriers#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                Discuss Integration
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Code/API Preview Card */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-purple-500 rounded-2xl blur opacity-30" />
                <div className="relative bg-slate-900 rounded-2xl p-6 font-mono text-sm overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-slate-500 text-xs">lead-webhook.json</span>
                  </div>
                  <pre className="text-xs md:text-sm overflow-x-auto">
                    <code className="text-slate-300">
{`{
  "lead_id": "ld_2f8a9c4e",
  "timestamp": "2025-03-15T09:23:45Z",
  "source": "race_event",
  "event_partner": "spartan_race",

  "contact": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1-555-0123",
    "city": "Austin",
    "state": "TX",
    "dob": "1992-08-14",
    "tcpa_consent": true
  },

  "biometrics": {
    "scan_completed": true,
    "wellness_score": 82,
    "risk_tier": "preferred"
  },

  "coverage": {
    "type": "AD&D",
    "event_date": "2025-03-15",
    "premium_paid": 12.99
  }
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 relative overflow-hidden">
        <FloatingOrb
          className="absolute top-10 left-[10%] w-48 h-48 bg-white/10 rounded-full blur-[60px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-10 right-[15%] w-64 h-64 bg-white/10 rounded-full blur-[80px]"
          delay={1}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Access Race Day Leads?
            </h2>
            <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
              Partner with us to receive pre-qualified, biometrically-enhanced leads from
              active event participants. Lower CAC, higher conversion, better data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/carriers#contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-2xl hover:bg-teal-50 transition-all shadow-2xl"
              >
                Contact Partnerships Team
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/carriers"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 backdrop-blur-xl bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/30 hover:bg-white/20 transition-all"
              >
                Learn More About Carrier Benefits
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
