"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  TrendingUp,
  Users,
  Zap,
  Shield,
  BarChart3,
  Target,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Building2,
  Activity,
  LineChart,
  Layers,
  PieChart,
  UserCheck,
  Bell,
  Database,
  Sparkles,
  Dumbbell,
  Trophy,
  Mountain
} from "lucide-react"
import { carrierCategories, carrierCategoryIconMap } from "@/lib/carrier-category-data"

const heroStats = [
  { value: "100%", label: "Coverage Rate" },
  { value: "4x", label: "Lower CAC vs Traditional" },
  { value: "$0", label: "Upfront Integration Cost" },
]

const whyPartner = [
  {
    icon: Target,
    title: "Pre-Qualified, Intent-Rich Leads",
    description: "Every lead comes from someone actively participating in a covered activity. No cold lists—just warm, verified participants who've already shown buying intent."
  },
  {
    icon: DollarSign,
    title: "Dramatically Lower CAC",
    description: "Skip the expensive ad spend. Our embedded distribution model delivers customers at a fraction of traditional acquisition costs—often 70-80% less."
  },
  {
    icon: TrendingUp,
    title: "Recurring Revenue Stream",
    description: "Event-based coverage creates natural renewal cycles. Active participants become repeat customers through gym memberships, race seasons, and adventure schedules."
  },
  {
    icon: BarChart3,
    title: "Superior Risk Data",
    description: "Access real-time activity data, health signals, and event participation patterns that improve underwriting accuracy and reduce claims volatility."
  },
  {
    icon: Users,
    title: "Younger Demographics",
    description: "Reach the 25-45 active lifestyle segment that's historically hard to acquire—through the activities they're already engaged in."
  },
  {
    icon: Zap,
    title: "Instant Activation",
    description: "Coverage activates automatically at event start and deactivates at event end. No manual processing, no paperwork, no friction."
  }
]

const howItWorks = [
  {
    step: "01",
    title: "We Integrate With Event Platforms",
    description: "HIQOR embeds seamlessly into gyms, race platforms, rental services, and adventure operators. Coverage is offered at the moment of purchase or check-in.",
    icon: Layers
  },
  {
    step: "02",
    title: "Participants Receive Coverage",
    description: "During checkout or registration, participants receive comprehensive coverage. One-click activation with instant protection.",
    icon: UserCheck
  },
  {
    step: "03",
    title: "Coverage Activates Automatically",
    description: "When the event starts—race gun fires, gym check-in, rental begins—coverage goes live. When it ends, coverage deactivates.",
    icon: Bell
  },
  {
    step: "04",
    title: "Rich Data Flows to You",
    description: "Activity type, duration, frequency, health signals, and demographic data enhance your underwriting models and customer profiles.",
    icon: Database
  }
]

const dataAdvantages = [
  {
    icon: Activity,
    title: "Real-Time Activity Signals",
    description: "Know when participants are active, what they're doing, and how often",
    slug: "real-time-activity-signals"
  },
  {
    icon: LineChart,
    title: "Risk Window Precision",
    description: "Coverage aligned to actual exposure windows, not estimated time periods",
    slug: "risk-window-precision"
  },
  {
    icon: PieChart,
    title: "Behavioral Underwriting",
    description: "Participant history, frequency, and activity type inform risk profiles",
    slug: "behavioral-underwriting"
  },
  {
    icon: Shield,
    title: "Verified Participation",
    description: "Biometric check-ins and event triggers eliminate fraud and false claims",
    slug: "verified-participation"
  }
]

const comparisonData = [
  { metric: "Customer Acquisition Cost", traditional: "$150-400", hiqor: "$25-60" },
  { metric: "Time to First Policy", traditional: "Days to weeks", hiqor: "Seconds" },
  { metric: "Lead Quality", traditional: "Cold/Unknown", hiqor: "Warm/Verified" },
  { metric: "Risk Data Available", traditional: "Self-reported", hiqor: "Real-time verified" },
  { metric: "Renewal Friction", traditional: "High", hiqor: "Automatic" },
  { metric: "Distribution Cost", traditional: "Agent commissions", hiqor: "Platform fee only" },
]

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

// 3D Card component with glassmorphism
function Glass3DCard({
  children,
  className = "",
  glowColor = "teal"
}: {
  children: React.ReactNode
  className?: string
  glowColor?: "teal" | "purple" | "blue"
}) {
  const glowColors = {
    teal: "group-hover:shadow-teal-500/25",
    purple: "group-hover:shadow-purple-500/25",
    blue: "group-hover:shadow-blue-500/25",
  }

  return (
    <motion.div
      className={`group relative ${className}`}
      whileHover={{
        rotateX: 5,
        rotateY: 5,
        z: 50,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

      {/* Card content */}
      <div className={`relative h-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 shadow-xl ${glowColors[glowColor]} transition-all duration-500`}>
        {children}
      </div>
    </motion.div>
  )
}

export default function CarriersPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.8])

  // Carousel state for hero background images
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-cycle through category images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carrierCategories.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <main ref={containerRef} className="relative overflow-x-hidden max-w-full bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section with Glassmorphism and Image Carousel */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={carrierCategories[currentImageIndex].heroImage}
                alt={carrierCategories[currentImageIndex].title}
                fill
                className="object-cover"
                priority
              />
              {/* Dark overlay gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {carrierCategories.map((cat, index) => (
            <button
              key={cat.slug}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-teal-400 w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`View ${cat.title}`}
            />
          ))}
        </div>

        {/* Current category label */}
        <motion.div
          key={`label-${currentImageIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute bottom-8 right-8 z-20"
        >
          <span className="px-4 py-2 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 text-sm font-medium text-white/80">
            {carrierCategories[currentImageIndex].title}
          </span>
        </motion.div>

        {/* Animated background orbs - now on top of image for subtle effect */}
        <FloatingOrb
          className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-teal-500/30 to-emerald-500/15 rounded-full blur-[100px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-500/15 rounded-full blur-[120px]"
          delay={2}
        />
        <FloatingOrb
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-teal-500/10 rounded-full blur-[150px]"
          delay={1}
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

        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            {/* Glassmorphism badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-8 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-teal-300 font-medium text-sm">For Insurance Carriers</span>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight"
            >
              Acquire Customers Where
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 animate-gradient">
                They&apos;re Already Active
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              HIQOR delivers pre-qualified, intent-rich customers through embedded distribution—
              at a fraction of traditional acquisition costs.
            </motion.p>

            {/* Glassmorphism Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="group relative"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Glass card */}
                  <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl hover:border-teal-500/50 transition-all duration-300">
                    <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg rounded-2xl hover:from-teal-400 hover:to-emerald-400 transition-all shadow-2xl shadow-teal-500/30 border border-teal-400/30"
            >
              Schedule a Partnership Call
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Why Partner Section with 3D Cards */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/50 to-transparent rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-sm bg-teal-50 rounded-full border border-teal-200 mb-6 shadow-sm"
            >
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Carrier Benefits</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why Carriers Partner With{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                HIQOR
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Traditional distribution is broken—expensive, slow, and full of unqualified leads.
              HIQOR fixes that with embedded, event-triggered distribution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyPartner.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  rotateX: 5,
                  rotateY: -5,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group relative"
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/50 to-emerald-500/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500" />

                {/* Glass card */}
                <div className="relative h-full backdrop-blur-sm bg-white/80 rounded-3xl p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl hover:border-teal-300/50 transition-all duration-500 text-center">
                  {/* Icon with 3D effect */}
                  <motion.div
                    className="w-16 h-16 mx-auto mb-6 relative"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with Floating Cards */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Animated background lines */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-sm bg-teal-50 rounded-full border border-teal-200 mb-6"
            >
              <Zap className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">The Process</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              How It Works For Carriers
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              We handle the distribution infrastructure. You provide the coverage.
              Together, we create a new category of insurance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group relative"
              >
                {/* Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-all duration-500" />

                <div className="relative backdrop-blur-sm bg-white/90 rounded-3xl p-8 shadow-lg border border-slate-100 hover:border-teal-200 transition-all duration-300 h-full">
                  <div className="flex items-start gap-6">
                    {/* Step number with 3D effect */}
                    <motion.div
                      className="flex-shrink-0 relative"
                      whileHover={{ rotateY: 15, rotateX: -15 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="w-18 h-18 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/30 p-4">
                        <span className="text-2xl font-bold text-white">{item.step}</span>
                      </div>
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <item.icon className="w-5 h-5 text-teal-600" />
                        <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Flow CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-slate-100 to-teal-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/30 to-purple-500/30 rounded-3xl blur-xl" />
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-teal-200 shadow-xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                    <Database className="w-4 h-4" />
                    Lead Generation Intelligence
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                    Race Day Coverage Lead Flow
                  </h3>
                  <p className="text-slate-600 max-w-xl">
                    Discover how our embedded platform delivers biometrically-enhanced leads with TCPA consent,
                    health signals, and verified participation data from race event partners.
                  </p>
                </div>
                <Link
                  href="/carriers/lead-flow"
                  className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold text-lg rounded-2xl hover:from-purple-700 hover:to-teal-700 transition-all shadow-xl shadow-purple-500/30 group"
                >
                  View Lead Flow Diagram
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Data Advantage Section with Glassmorphism */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Animated orbs */}
        <FloatingOrb
          className="absolute top-20 right-[20%] w-64 h-64 bg-gradient-to-br from-teal-500/30 to-emerald-500/20 rounded-full blur-[80px]"
          delay={0.5}
        />
        <FloatingOrb
          className="absolute bottom-20 left-[15%] w-80 h-80 bg-gradient-to-br from-purple-500/20 to-teal-500/20 rounded-full blur-[100px]"
          delay={1.5}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-6"
            >
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-teal-300">Data Advantage</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Underwriting Intelligence
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Traditional Carriers Can&apos;t Access
              </span>
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Event-triggered coverage generates rich, real-time data that transforms
              how you assess risk and price policies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataAdvantages.map((item, index) => (
              <Link key={item.title} href={`/carriers/underwriting/${item.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    rotateX: 5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="group relative cursor-pointer h-full"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                  {/* Glass card */}
                  <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-teal-500/50 transition-all duration-500 text-center h-full">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:from-teal-500/50 group-hover:to-emerald-500/50 transition-all duration-300">
                      <item.icon className="w-7 h-7 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 mb-4">{item.description}</p>
                    <div className="flex items-center justify-center gap-2 text-teal-400 font-medium text-sm group-hover:gap-3 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Explore All Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              href="/carriers/underwriting"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 font-semibold rounded-xl border border-teal-500/30 hover:border-teal-500/50 transition-all"
            >
              Explore All Data Advantages
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table Section with Glass Effect */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              HIQOR vs Traditional Distribution
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See how embedded, event-triggered distribution outperforms legacy channels.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-3xl blur-xl" />

            <div className="relative backdrop-blur-sm bg-white/80 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                      <th className="px-8 py-5 text-left text-sm font-bold text-slate-900">Metric</th>
                      <th className="px-8 py-5 text-center text-sm font-bold text-slate-500">Traditional</th>
                      <th className="px-8 py-5 text-center text-sm font-bold text-teal-600">With HIQOR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comparisonData.map((row, index) => (
                      <motion.tr
                        key={row.metric}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-teal-50/30 transition-colors`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="px-8 py-5 text-sm font-medium text-slate-900">{row.metric}</td>
                        <td className="px-8 py-5 text-center text-sm text-slate-500">{row.traditional}</td>
                        <td className="px-8 py-5 text-center">
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 rounded-full text-sm font-semibold shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            {row.hiqor}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coverage Types Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-teal-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-100/40 to-transparent rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-sm bg-teal-50 rounded-full border border-teal-200 mb-6"
            >
              <Shield className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Coverage Verticals</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Coverage Categories{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                We Support
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              HIQOR activates coverage across diverse event types—each with unique risk profiles and premium opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {carrierCategories.map((category, index) => {
              const colorConfig = {
                teal: { gradient: "from-teal-500 to-emerald-500", overlay: "from-teal-900/80 via-teal-900/60 to-transparent", textDark: "text-teal-600", badge: "bg-teal-500/20 text-teal-300 border-teal-400/30" },
                sky: { gradient: "from-sky-500 to-blue-500", overlay: "from-sky-900/80 via-sky-900/60 to-transparent", textDark: "text-sky-600", badge: "bg-sky-500/20 text-sky-300 border-sky-400/30" },
                purple: { gradient: "from-purple-500 to-violet-500", overlay: "from-purple-900/80 via-purple-900/60 to-transparent", textDark: "text-purple-600", badge: "bg-purple-500/20 text-purple-300 border-purple-400/30" },
                orange: { gradient: "from-orange-500 to-amber-500", overlay: "from-orange-900/80 via-orange-900/60 to-transparent", textDark: "text-orange-600", badge: "bg-orange-500/20 text-orange-300 border-orange-400/30" },
              }
              const colors = colorConfig[category.color]

              return (
                <Link key={category.slug} href={`/carriers/${category.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    className="group relative h-full"
                    style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                  >
                    {/* Glow effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500`} />

                    {/* Card */}
                    <div className="relative h-full rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200/50">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={category.heroImage}
                          alt={category.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${colors.overlay}`} />

                        {/* Market size badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${colors.badge} backdrop-blur-sm border`}>
                            {category.marketStats.marketSize} Market
                          </span>
                        </div>

                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                          <p className="text-white/80 text-sm line-clamp-2">{category.tagline}</p>
                        </div>
                      </div>

                      {/* Bottom stats bar */}
                      <div className="bg-white p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-6">
                            <div>
                              <div className={`text-lg font-bold ${colors.textDark}`}>
                                100%
                              </div>
                              <div className="text-xs text-slate-500">Coverage Rate</div>
                            </div>
                            <div>
                              <div className={`text-lg font-bold ${colors.textDark}`}>
                                {category.marketStats.avgPremium}
                              </div>
                              <div className="text-xs text-slate-500">Avg Premium</div>
                            </div>
                          </div>

                          <motion.div
                            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${colors.gradient} text-white text-sm font-semibold shadow-lg`}
                            whileHover={{ scale: 1.05 }}
                          >
                            Explore
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section with Full Glassmorphism */}
      <section id="contact" className="py-28 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 relative overflow-hidden">
        {/* Animated background */}
        <FloatingOrb
          className="absolute top-10 left-[10%] w-48 h-48 bg-white/10 rounded-full blur-[60px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-10 right-[15%] w-64 h-64 bg-white/10 rounded-full blur-[80px]"
          delay={1}
        />
        <FloatingOrb
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-[100px]"
          delay={0.5}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Ready to Transform Your Distribution?
            </motion.h2>
            <motion.p
              className="text-xl text-teal-100 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join forward-thinking carriers who are acquiring customers through embedded,
              event-triggered distribution. Let&apos;s build the future of insurance together.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-5 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.a
                href="mailto:partners@dailyeventinsurance.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-2xl hover:bg-teal-50 transition-all shadow-2xl"
              >
                Contact Partnerships Team
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="/about/hiqor"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 backdrop-blur-xl bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/30 hover:bg-white/20 transition-all"
              >
                Learn About HiQor
              </motion.a>
            </motion.div>

            <motion.p
              className="text-sm text-teal-200 mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Currently partnered with leading carriers including Mutual of Omaha
            </motion.p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
