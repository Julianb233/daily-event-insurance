"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import {
  Clock,
  Shield,
  Layers,
  Building2,
  Users,
  Zap,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  Scale,
  Lock,
  Globe,
  Rocket,
  BarChart3,
  DollarSign,
  Calendar,
  Award,
  Network,
  Cpu,
  Briefcase,
  LineChart,
  PieChart,
  Landmark,
  Crown,
  Star,
  BadgeCheck,
  CircleDollarSign,
  Banknote,
  Percent
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

// Animated counter component
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {value.toLocaleString()}
      </motion.span>
      {suffix}
    </motion.span>
  )
}

// Agreement Structure Data
const agreementTerms = [
  {
    icon: Scale,
    title: "Revenue Share Model",
    description: "Tiered commission structure based on policy volume and conversion rates",
    details: [
      "Base commission: 15-25% of gross premium",
      "Performance bonuses at volume thresholds",
      "Quarterly reconciliation and payouts",
      "Transparent real-time reporting dashboard"
    ]
  },
  {
    icon: Lock,
    title: "Exclusivity Terms",
    description: "Partnership protection and market positioning",
    details: [
      "Territory-based exclusivity options available",
      "Category exclusivity for specific event types",
      "Minimum volume commitments for exclusivity",
      "Annual review and renewal provisions"
    ]
  },
  {
    icon: FileText,
    title: "Compliance Framework",
    description: "Full regulatory compliance across all jurisdictions",
    details: [
      "Licensed in all 50 states + DC",
      "AM Best A-rated carrier partnerships",
      "SOC 2 Type II certified infrastructure",
      "GDPR and CCPA compliant data handling"
    ]
  },
  {
    icon: Shield,
    title: "Liability & Insurance",
    description: "Comprehensive coverage and indemnification",
    details: [
      "E&O insurance coverage maintained",
      "Cyber liability protection",
      "Mutual indemnification clauses",
      "Claims handling SLA guarantees"
    ]
  }
]

// Compliance highlights
const complianceItems = [
  { icon: BadgeCheck, label: "50-State Licensed", value: "MGA Authority" },
  { icon: Award, label: "AM Best Rating", value: "A (Excellent)" },
  { icon: Lock, label: "Security Standard", value: "SOC 2 Type II" },
  { icon: Shield, label: "Data Protection", value: "GDPR/CCPA" }
]

// 6-Month Plan
const sixMonthPlan = {
  title: "Foundation Phase",
  subtitle: "Building the Infrastructure",
  goals: [
    {
      icon: Rocket,
      title: "Platform Launch",
      items: [
        "Complete API integration with HIQOR OS",
        "Launch white-label insurance widget",
        "Deploy real-time policy issuance system",
        "Establish claims processing workflow"
      ]
    },
    {
      icon: Users,
      title: "Partner Acquisition",
      items: [
        "Onboard 50+ event generators",
        "Sign 3 major gym chain partnerships",
        "Launch 2 race event integrations",
        "Establish adventure sports vertical"
      ]
    },
    {
      icon: BarChart3,
      title: "Revenue Targets",
      items: [
        "500+ policies per month run rate",
        "$50K monthly gross premium",
        "15% conversion rate baseline",
        "Break-even on operational costs"
      ]
    }
  ],
  metrics: [
    { label: "Partners Onboarded", target: "50+", icon: Building2 },
    { label: "Monthly Policies", target: "500+", icon: FileText },
    { label: "Gross Premium", target: "$50K/mo", icon: DollarSign },
    { label: "Conversion Rate", target: "15%", icon: Percent }
  ]
}

// 1-Year Plan
const oneYearPlan = {
  title: "Growth Phase",
  subtitle: "Scaling the Business",
  goals: [
    {
      icon: Globe,
      title: "Market Expansion",
      items: [
        "Expand to all 50 states",
        "Launch Canadian market pilot",
        "Establish regional sales teams",
        "Build enterprise sales function"
      ]
    },
    {
      icon: Cpu,
      title: "Technology Enhancement",
      items: [
        "AI-powered risk assessment launch",
        "Mobile SDK for native apps",
        "Advanced analytics dashboard",
        "Automated underwriting engine"
      ]
    },
    {
      icon: CircleDollarSign,
      title: "Financial Milestones",
      items: [
        "5,000+ policies per month",
        "$500K monthly gross premium",
        "Series A funding secured",
        "Path to profitability defined"
      ]
    }
  ],
  metrics: [
    { label: "Partners", target: "500+", icon: Building2 },
    { label: "Monthly Policies", target: "5,000+", icon: FileText },
    { label: "Gross Premium", target: "$500K/mo", icon: DollarSign },
    { label: "Team Size", target: "25+", icon: Users }
  ]
}

// 3-Year Plan
const threeYearPlan = {
  title: "Scale Phase",
  subtitle: "Market Leadership",
  goals: [
    {
      icon: Crown,
      title: "Market Position",
      items: [
        "Top 3 events-based insurance provider",
        "Category leader in fitness & adventure",
        "Strategic carrier partnerships (3+)",
        "Industry thought leadership"
      ]
    },
    {
      icon: Network,
      title: "Platform Evolution",
      items: [
        "Full HIQOR OS ecosystem launch",
        "Multi-carrier integration",
        "International expansion (EU, UK, AU)",
        "Embedded insurance API marketplace"
      ]
    },
    {
      icon: Banknote,
      title: "Financial Scale",
      items: [
        "$50M+ annual gross premium",
        "Profitable operations",
        "Series B/C funding or strategic exit",
        "100+ employee organization"
      ]
    }
  ],
  metrics: [
    { label: "Partners", target: "5,000+", icon: Building2 },
    { label: "Annual Premium", target: "$50M+", icon: DollarSign },
    { label: "Markets", target: "5 Countries", icon: Globe },
    { label: "Team Size", target: "100+", icon: Users }
  ]
}

// 5-Year Plan
const fiveYearPlan = {
  title: "Dominance Phase",
  subtitle: "Industry Transformation",
  goals: [
    {
      icon: Star,
      title: "Vision Realized",
      items: [
        "#1 events-based insurance platform globally",
        "IPO or strategic acquisition",
        "Insurance innovation awards",
        "Industry standard setter"
      ]
    },
    {
      icon: Landmark,
      title: "Enterprise Scale",
      items: [
        "10+ carrier partnerships",
        "Full-stack insurance capabilities",
        "B2B2C ecosystem dominance",
        "Adjacent product expansion"
      ]
    },
    {
      icon: LineChart,
      title: "Financial Vision",
      items: [
        "$200M+ annual gross premium",
        "$1B+ valuation milestone",
        "20%+ profit margins",
        "Self-sustaining growth engine"
      ]
    }
  ],
  metrics: [
    { label: "Partners", target: "25,000+", icon: Building2 },
    { label: "Annual Premium", target: "$200M+", icon: DollarSign },
    { label: "Valuation", target: "$1B+", icon: TrendingUp },
    { label: "Team Size", target: "300+", icon: Users }
  ]
}

// Timeline milestone component
function TimelineMilestone({
  plan,
  index,
  accentColor = "teal"
}: {
  plan: typeof sixMonthPlan;
  index: number;
  accentColor?: string;
}) {
  const gradients = {
    teal: "from-teal-500 to-emerald-500",
    purple: "from-purple-500 to-indigo-500",
    orange: "from-orange-500 to-amber-500",
    blue: "from-blue-500 to-cyan-500"
  }

  const bgGradients = {
    teal: "from-teal-500/20 to-emerald-500/10",
    purple: "from-purple-500/20 to-indigo-500/10",
    orange: "from-orange-500/20 to-amber-500/10",
    blue: "from-blue-500/20 to-cyan-500/10"
  }

  const gradient = gradients[accentColor as keyof typeof gradients] || gradients.teal
  const bgGradient = bgGradients[accentColor as keyof typeof bgGradients] || bgGradients.teal

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-sm bg-gradient-to-r ${bgGradient} rounded-full border border-white/20 mb-4`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-semibold">{plan.title}</span>
        </motion.div>
        <h3 className="text-2xl md:text-3xl font-bold mb-2">{plan.subtitle}</h3>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plan.goals.map((goal, goalIndex) => (
          <motion.div
            key={goal.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: goalIndex * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative"
          >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300`} />
            <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all h-full">
              <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4`}>
                <goal.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white mb-3">{goal.title}</h4>
              <ul className="space-y-2">
                {goal.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Metrics Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {plan.metrics.map((metric, metricIndex) => (
          <motion.div
            key={metric.label}
            whileHover={{ scale: 1.05 }}
            className={`relative backdrop-blur-xl bg-gradient-to-br ${bgGradient} rounded-xl p-4 border border-white/10 text-center`}
          >
            <metric.icon className="w-6 h-6 mx-auto mb-2 text-white/80" />
            <div className="text-2xl font-bold text-white">{metric.target}</div>
            <div className="text-xs text-slate-400">{metric.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default function HiqorPresentationPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -30])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9])

  return (
    <main ref={containerRef} className="relative overflow-x-hidden max-w-full bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Animated background orbs */}
        <FloatingOrb
          className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-teal-500/40 to-emerald-500/20 rounded-full blur-[100px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-gradient-to-br from-purple-500/30 to-teal-500/20 rounded-full blur-[120px]"
          delay={2}
        />
        <FloatingOrb
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full blur-[150px]"
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
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                <Image
                  src="/images/logo-color.png"
                  alt="Daily Event Insurance"
                  width={200}
                  height={50}
                  className="h-auto w-auto"
                />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-8 shadow-lg"
            >
              <Briefcase className="w-4 h-4 text-teal-400" />
              <span className="text-teal-300 font-medium text-sm">Strategic Partnership Presentation</span>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight"
            >
              HIQOR Partnership
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
                Vision & Roadmap
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Building the future of events-based insurance together.
              <br />
              <span className="text-teal-400">From foundation to market dominance.</span>
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {[
                { label: "5-Year Target", value: "$200M+", sublabel: "Annual Premium" },
                { label: "Partner Network", value: "25,000+", sublabel: "Event Generators" },
                { label: "Market Position", value: "#1", sublabel: "Global Platform" },
                { label: "Target Valuation", value: "$1B+", sublabel: "Enterprise Value" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-teal-400">{stat.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{stat.sublabel}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Agreement Structure Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-100/50 to-transparent rounded-full blur-3xl" />

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
              <FileText className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Partnership Framework</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Agreement{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Structure
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A comprehensive partnership built on transparency, compliance, and mutual success.
            </p>
          </motion.div>

          {/* Compliance Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {complianceItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                <div className="relative backdrop-blur-sm bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 shadow-lg text-center transition-all">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:from-teal-500 group-hover:to-emerald-500 transition-all">
                    <item.icon className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">{item.value}</div>
                  <div className="text-sm text-slate-500">{item.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Agreement Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agreementTerms.map((term, index) => (
              <motion.div
                key={term.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  rotateX: 2,
                  rotateY: -2,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group relative"
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/50 to-emerald-500/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500" />

                <div className="relative h-full backdrop-blur-sm bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-teal-300 transition-all duration-500">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      className="w-14 h-14 relative flex-shrink-0"
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl" />
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <term.icon className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{term.title}</h3>
                      <p className="text-slate-600 text-sm">{term.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mt-4">
                    {term.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detailIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + detailIndex * 0.05 }}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6-Month Plan Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
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
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Strategic{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Roadmap
              </span>
            </h2>
            <p className="text-xl text-slate-300">Our journey from foundation to market leadership</p>
          </motion.div>

          <TimelineMilestone plan={sixMonthPlan} index={0} accentColor="teal" />
        </div>
      </section>

      {/* 1-Year Plan Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
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
          <div className="text-slate-900">
            <TimelineMilestone plan={oneYearPlan} index={1} accentColor="purple" />
          </div>
        </div>
      </section>

      {/* 3-Year Plan Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingOrb
          className="absolute top-10 left-[10%] w-48 h-48 bg-gradient-to-br from-orange-500/30 to-amber-500/20 rounded-full blur-[60px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-10 right-[15%] w-64 h-64 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-full blur-[80px]"
          delay={1}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <TimelineMilestone plan={threeYearPlan} index={2} accentColor="orange" />
        </div>
      </section>

      {/* 5-Year Plan Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-slate-900">
            <TimelineMilestone plan={fiveYearPlan} index={3} accentColor="blue" />
          </div>
        </div>
      </section>

      {/* Revenue Projections */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingOrb
          className="absolute top-20 left-[20%] w-64 h-64 bg-gradient-to-br from-emerald-500/30 to-teal-500/20 rounded-full blur-[80px]"
          delay={0.5}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-6"
            >
              <PieChart className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-teal-300">Financial Projections</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Revenue{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Growth Trajectory
              </span>
            </h2>
          </motion.div>

          {/* Revenue Chart Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10"
          >
            <div className="grid grid-cols-5 gap-4 items-end h-64">
              {[
                { year: "6 Mo", value: 0.6, premium: "$600K", label: "Foundation" },
                { year: "Year 1", value: 6, premium: "$6M", label: "Growth" },
                { year: "Year 2", value: 20, premium: "$20M", label: "Scale" },
                { year: "Year 3", value: 50, premium: "$50M", label: "Leadership" },
                { year: "Year 5", value: 200, premium: "$200M", label: "Dominance" }
              ].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(item.value / 200) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-t from-teal-500 to-emerald-500 rounded-t-xl blur opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="relative h-full bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-xl flex items-end justify-center pb-2">
                    <span className="text-xs font-bold text-white/90 rotate-0">{item.premium}</span>
                  </div>
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center">
                    <div className="text-sm font-bold text-white">{item.year}</div>
                    <div className="text-xs text-slate-400">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Avg. Policy Value", value: "$15" },
                { label: "Conversion Rate", value: "20%+" },
                { label: "Partner Commission", value: "15-25%" },
                { label: "Gross Margin", value: "35%+" }
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="text-2xl font-bold text-teal-400">{metric.value}</div>
                  <div className="text-xs text-slate-400">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-3xl blur-2xl" />
              <div className="relative backdrop-blur-sm bg-white/80 rounded-3xl p-12 border border-slate-200 shadow-2xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-50 rounded-full border border-teal-200 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-semibold text-teal-700">Let&apos;s Build Together</span>
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Ready to Transform Events-Based Insurance?
                </h2>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  Partner with HIQOR to capture the massive opportunity in events-based insurance.
                  Together, we&apos;ll build the #1 platform in the industry.
                </p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.a
                    href="/#apply"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg rounded-2xl hover:from-teal-400 hover:to-emerald-400 transition-all shadow-2xl shadow-teal-500/30"
                  >
                    Start Partnership Discussion
                    <ArrowRight className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="/about/hiqor"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 text-slate-900 font-bold text-lg rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    Learn More About HIQOR
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
