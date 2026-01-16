"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
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
  Percent,
  Headphones,
  GraduationCap,
  Wrench,
  Handshake,
  Monitor,
  Server,
  Database,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Waves
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

// Interactive Revenue Chart Component
function InteractiveRevenueChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'premium' | 'policies' | 'partners'>('premium')

  const data = {
    premium: [
      { period: "6 Mo", value: 50, display: "$50K", color: "from-teal-400 to-emerald-400" },
      { period: "Year 1", value: 500, display: "$500K", color: "from-teal-500 to-emerald-500" },
      { period: "Year 2", value: 2000, display: "$2M", color: "from-emerald-500 to-green-500" },
      { period: "Year 3", value: 8000, display: "$8M", color: "from-green-500 to-teal-500" },
      { period: "Year 5", value: 25000, display: "$25M", color: "from-teal-600 to-cyan-500" }
    ],
    policies: [
      { period: "6 Mo", value: 500, display: "500", color: "from-purple-400 to-indigo-400" },
      { period: "Year 1", value: 5000, display: "5,000", color: "from-purple-500 to-indigo-500" },
      { period: "Year 2", value: 25000, display: "25K", color: "from-indigo-500 to-purple-500" },
      { period: "Year 3", value: 75000, display: "75K", color: "from-purple-600 to-pink-500" },
      { period: "Year 5", value: 200000, display: "200K", color: "from-pink-500 to-purple-600" }
    ],
    partners: [
      { period: "6 Mo", value: 50, display: "50", color: "from-orange-400 to-amber-400" },
      { period: "Year 1", value: 500, display: "500", color: "from-orange-500 to-amber-500" },
      { period: "Year 2", value: 2000, display: "2K", color: "from-amber-500 to-orange-500" },
      { period: "Year 3", value: 5000, display: "5K", color: "from-orange-600 to-red-500" },
      { period: "Year 5", value: 15000, display: "15K", color: "from-red-500 to-orange-600" }
    ]
  }

  const currentData = data[selectedMetric]
  const maxValue = Math.max(...currentData.map(d => d.value))

  const metricLabels = {
    premium: 'Gross Premium',
    policies: 'Monthly Policies',
    partners: 'Partner Network'
  }

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="flex justify-center gap-2">
        {(['premium', 'policies', 'partners'] as const).map((metric) => (
          <motion.button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${selectedMetric === metric
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
          >
            {metricLabels[metric]}
          </motion.button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative h-72 flex items-end justify-around gap-4 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        {currentData.map((item, index) => (
          <motion.div
            key={`${selectedMetric}-${item.period}`}
            className="relative flex-1 max-w-[100px] group cursor-pointer"
            onMouseEnter={() => setHoveredBar(index)}
            onMouseLeave={() => setHoveredBar(null)}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 100}%` }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
          >
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: hoveredBar === index ? 1 : 0, y: hoveredBar === index ? 0 : 10 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap z-20 shadow-xl border border-slate-700"
            >
              <div className="font-bold text-teal-400">{item.display}</div>
              <div className="text-xs text-slate-400">{metricLabels[selectedMetric]}</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800 border-r border-b border-slate-700" />
            </motion.div>

            {/* Bar */}
            <div className={`absolute inset-0 bg-gradient-to-t ${item.color} rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity`} />
            <div className={`absolute inset-0 bg-gradient-to-t ${item.color} rounded-t-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`} />

            {/* Value on bar */}
            <div className="absolute top-2 left-0 right-0 text-center">
              <span className="text-[10px] md:text-xs font-bold text-white/90 drop-shadow-md">{item.display}</span>
            </div>

            {/* Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
              <div className="text-xs md:text-sm font-semibold text-slate-300">{item.period}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Rewritten Platform Showcase to use Actual Images/Layout from Gym Demo
function PlatformShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      title: "Comprehensive Partner Dashboard",
      description: "A centralized hub to track policies, monitor revenue, and manage customer interactions in real-time.",
      icon: LayoutDashboard,
      color: "from-teal-500 to-emerald-600"
    },
    {
      title: "Instant Widget Generation",
      description: "Create and deploy branded insurance widgets to your site with zero coding required.",
      icon: Layers,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Automated Claims Processing",
      description: "AI-driven workflows that handle 80% of claims automatically, reducing overhead.",
      icon: FileText,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Seamless API Integration",
      description: "Robust REST APIs to integrate insurance products directly into your existing checkout flow.",
      icon: Server,
      color: "from-orange-500 to-amber-600"
    }
  ]

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Left: Feature List */}
      <div className="lg:col-span-4 space-y-4">
        {features.map((feature, index) => (
          <motion.button
            key={feature.title}
            onClick={() => setActiveFeature(index)}
            className={`w-full text-left p-5 rounded-xl border transition-all ${activeFeature === index
                ? 'bg-slate-800 border-teal-500 shadow-lg shadow-teal-500/10'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold text-sm mb-1 ${activeFeature === index ? 'text-white' : 'text-slate-300'}`}>
                  {feature.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Right: Actual Dashboard Image Preview */}
      <div className="lg:col-span-8">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          {/* Browser Chrome */}
          <div className="bg-slate-800 px-4 py-3 flex items-center gap-3 border-b border-slate-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 bg-slate-950 rounded-md px-4 py-1.5 flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-3 h-3" />
              <span>dashboard.dailyeventinsurance.com</span>
            </div>
          </div>

          {/* Actual Dashboard Image */}
          <div className="relative aspect-video bg-slate-950">
            <Image
              src="/images/hero-desktop.png"
              alt="Daily Event Insurance Dashboard"
              fill
              className="object-cover object-top opacity-90"
            />

            {/* Feature Overlay */}
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl flex items-center gap-4 shadow-2xl"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${features[activeFeature].color} flex items-center justify-center flex-shrink-0`}>
                {(() => {
                  const Icon = features[activeFeature].icon
                  return <Icon className="w-6 h-6 text-white" />
                })()}
              </div>
              <div>
                <h4 className="text-white font-bold">{features[activeFeature].title}</h4>
                <p className="text-slate-400 text-sm">Active Module Preview</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// What DEI Provides Section
const deiValueProps = [
  {
    icon: Monitor,
    title: "Microsite Development",
    description: "Custom-branded insurance microsites built specifically for your business",
    details: [
      "Fully managed hosting & maintenance",
      "Custom domain setup",
      "Mobile-optimized design",
      "Continuous updates & improvements"
    ],
    pricing: "$600/month per microsite"
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Dedicated support team handling all customer inquiries and issues",
    details: [
      "Email & chat support",
      "Claims assistance",
      "Policy questions",
      "Escalation management"
    ],
    pricing: "Included"
  },
  {
    icon: GraduationCap,
    title: "Onboarding & Training",
    description: "Comprehensive onboarding to get your team up and running quickly",
    details: [
      "Platform walkthrough sessions",
      "Staff training materials",
      "Best practices guides",
      "Ongoing education"
    ],
    pricing: "Included"
  },
  {
    icon: Wrench,
    title: "Sales Resources & Tools",
    description: "Everything your team needs to sell and promote insurance effectively",
    details: [
      "Marketing collateral",
      "Sales scripts & talking points",
      "Promotional materials",
      "Conversion optimization tips"
    ],
    pricing: "Included"
  },
  {
    icon: Handshake,
    title: "Strategic Partnerships",
    description: "Introductions to key relationships that accelerate your growth",
    details: [
      "Partner network access",
      "Industry connections",
      "Co-marketing opportunities",
      "Deal flow introductions"
    ],
    pricing: "Included"
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Real-time insights into your insurance program performance",
    details: [
      "Revenue dashboards",
      "Conversion tracking",
      "Customer analytics",
      "Monthly performance reports"
    ],
    pricing: "Included"
  }
]

// Agreement Structure Data
const agreementTerms = [
  {
    icon: CircleDollarSign,
    title: "Revenue Share Model",
    description: "Transparent commission structure aligned with mutual success",
    highlight: "30% to Daily Event Insurance",
    details: [
      "30% revenue share to Daily Event Insurance",
      "70% retained by HIQOR",
      "Monthly payouts via ACH",
      "Real-time revenue tracking dashboard"
    ]
  },
  {
    icon: Monitor,
    title: "Microsite Services",
    description: "Fully managed insurance microsites for your platform",
    highlight: "$600/month per site",
    details: [
      "$600/month per microsite",
      "Custom branding & design",
      "Full hosting & maintenance",
      "Ongoing support included"
    ]
  },
  {
    icon: Headphones,
    title: "Support & Resources",
    description: "Everything you need to succeed with events-based insurance",
    highlight: "Full-Service Support",
    details: [
      "Dedicated customer support",
      "Complete onboarding program",
      "Sales tools & resources",
      "Strategic partner introductions"
    ]
  },
  {
    icon: Shield,
    title: "Technology & Security",
    description: "Enterprise-grade platform with robust security",
    highlight: "SOC 2 Compliant",
    details: [
      "SOC 2 Type II certified",
      "GDPR/CCPA compliant",
      "99.9% uptime SLA",
      "Encrypted data handling"
    ]
  }
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
        "Deploy HIQOR-branded microsites",
        "Launch white-label insurance widget",
        "Integrate with HIQOR OS platform",
        "Establish claims processing workflow"
      ]
    },
    {
      icon: Users,
      title: "Initial Rollout",
      items: [
        "Onboard first wave of partners",
        "Train HIQOR staff on platform",
        "Launch marketing campaigns",
        "Gather early feedback & iterate"
      ]
    },
    {
      icon: BarChart3,
      title: "Revenue Targets",
      items: [
        "500+ policies per month",
        "$50K monthly gross premium",
        "15% conversion rate",
        "Establish baseline metrics"
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
        "Expand partner network significantly",
        "Launch additional verticals",
        "Build enterprise sales function",
        "Establish regional presence"
      ]
    },
    {
      icon: Cpu,
      title: "Technology Enhancement",
      items: [
        "AI-powered risk assessment",
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
        "Profitability pathway defined",
        "Reinvestment in growth"
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
        "Leading events-based insurance provider",
        "Category leader in fitness & adventure",
        "Multiple carrier partnerships",
        "Industry thought leadership"
      ]
    },
    {
      icon: Network,
      title: "Platform Evolution",
      items: [
        "Full ecosystem integration",
        "Multi-carrier capabilities",
        "International expansion consideration",
        "Embedded insurance marketplace"
      ]
    },
    {
      icon: Banknote,
      title: "Financial Scale",
      items: [
        "$8M+ annual gross premium",
        "Strong profit margins",
        "Sustainable growth model",
        "Expanded service offerings"
      ]
    }
  ],
  metrics: [
    { label: "Partners", target: "5,000+", icon: Building2 },
    { label: "Annual Premium", target: "$8M+", icon: DollarSign },
    { label: "Markets", target: "Multiple", icon: Globe },
    { label: "Team Size", target: "50+", icon: Users }
  ]
}

// 5-Year Plan
const fiveYearPlan = {
  title: "Leadership Phase",
  subtitle: "Industry Transformation",
  goals: [
    {
      icon: Star,
      title: "Vision Realized",
      items: [
        "Premier events-based insurance platform",
        "Industry recognition & awards",
        "Standard setter for the category",
        "Trusted brand name"
      ]
    },
    {
      icon: Landmark,
      title: "Enterprise Scale",
      items: [
        "Multiple carrier partnerships",
        "Full-stack insurance capabilities",
        "B2B2C ecosystem leadership",
        "Adjacent product expansion"
      ]
    },
    {
      icon: LineChart,
      title: "Financial Vision",
      items: [
        "$25M+ annual gross premium",
        "Strong enterprise value",
        "Healthy profit margins",
        "Self-sustaining growth"
      ]
    }
  ],
  metrics: [
    { label: "Partners", target: "15,000+", icon: Building2 },
    { label: "Annual Premium", target: "$25M+", icon: DollarSign },
    { label: "Growth Rate", target: "40%+ YoY", icon: TrendingUp },
    { label: "Team Size", target: "100+", icon: Users }
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
          className={`inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-sm bg-gradient-to-r ${bgGradient} rounded-full border border-teal-500/20 mb-4`}
        >
          <Calendar className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-semibold text-teal-300">{plan.title}</span>
        </motion.div>
        <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">{plan.subtitle}</h3>
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
            <div className="relative bg-slate-900/50 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-all h-full">
              <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4`}>
                <goal.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white mb-3">{goal.title}</h4>
              <ul className="space-y-2">
                {goal.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
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
            className="relative bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-center group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-xl`} />
            <div className={`w-10 h-10 mx-auto bg-slate-900 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-800 transition-colors`}>
              <metric.icon className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.target}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{metric.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default function HiqorPresentationPage() {
  // Fix for "scroll to bottom on load" issue
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-teal-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <FloatingOrb
          className="absolute top-[10%] left-[10%] w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"
          delay={2}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)`,
            backgroundSize: `40px 40px`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logo-color.png"
                  alt="Daily Event Insurance"
                  width={140}
                  height={35}
                  className="h-8 w-auto"
                />
                <span className="text-slate-600">|</span>
                <span className="text-sm font-medium text-slate-300">Investor Relations</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a href="#vision" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Vision</a>
                <a href="#roadmap" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Roadmap</a>
                <a href="#financials" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Financials</a>
                <a href="#team" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Team</a>
                <button className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-teal-500/20">
                  Download Deck
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 relative text-center">

            {/* Logos & Partner Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center mb-10"
            >
              {/* Logos Side by Side - STRICTLY SIZED */}
              <div className="flex items-center justify-center gap-8 mb-8">
                {/* DEI Container */}
                <div className="h-20 w-52 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center p-4">
                  <Image
                    src="/images/logo-color.png"
                    alt="Daily Event Insurance"
                    width={160}
                    height={40}
                    className="w-auto h-8 object-contain"
                  />
                </div>

                {/* Plus Symbol */}
                <div className="text-2xl text-slate-600 font-light">+</div>

                {/* HiQor Container */}
                <div className="h-20 w-52 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center p-4">
                  <span className="text-3xl font-extrabold text-white tracking-tight">HIQOR</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Strategic Partnership Proposal</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
            >
              Revolutionizing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Events-Based Insurance
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              A strategic alliance to integrate comprehensive insurance solutions
              directly into the HIQOR ecosystem, unlocking new revenue streams
              and value for partners.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-bold text-lg shadow-xl shadow-teal-500/20 transition-all hover:scale-105 active:scale-95">
                View Proposal
              </button>
              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg border border-slate-700 transition-all hover:scale-105 active:scale-95">
                Read Case Study
              </button>
            </motion.div>
          </div>
        </section>

        {/* Platform Showcase Section */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Powered by Intelligent Technology
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Our platform delivers an end-to-end insurance experience,
                from instant quotes to automated claims processing.
              </p>
            </div>

            <PlatformShowcase />
          </div>
        </section>

        {/* Value Proposition Grid */}
        <section className="py-24 bg-slate-950 border-y border-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Complete Ecosystem Value
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                We provide everything needed to launch, scale, and manage
                a profitable insurance vertical.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deiValueProps.map((prop, index) => (
                <motion.div
                  key={prop.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-900/50 rounded-xl p-8 border border-slate-800 hover:border-slate-700 transition-colors group"
                >
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-800">
                    <prop.icon className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{prop.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {prop.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {prop.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-500">
                        <CheckCircle2 className="w-4 h-4 text-teal-500/50 flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pricing</span>
                    <span className={`text-sm font-bold ${prop.pricing === 'Included' ? 'text-emerald-400' : 'text-white'}`}>
                      {prop.pricing}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Financial Projections */}
        <section id="financials" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                  <TrendingUp className="w-3 h-3" />
                  Revenue Growth
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Predictable, Scalable Revenue Models
                </h2>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  Our partnership model is designed for mutual success, with
                  transparent revenue sharing and clear growth trajectories
                  based on conservative market penetration estimates.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
                      70%
                    </div>
                    <div>
                      <div className="text-white font-bold">Partner Revenue Share</div>
                      <div className="text-slate-500 text-sm">Majority of margin goes to HIQOR</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl">
                      30d
                    </div>
                    <div>
                      <div className="text-white font-bold">Fast Payouts</div>
                      <div className="text-slate-500 text-sm">Monthly ACH deposits with reporting</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-3xl p-1 border border-slate-800 shadow-2xl">
                <div className="bg-slate-900 rounded-[22px] p-8 border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-6">Projected Metrics</h3>
                  <InteractiveRevenueChart />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Timeline */}
        <section id="roadmap" className="py-24 bg-slate-950 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Strategic Roadmap
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                A phased approach to building market dominance in the events insurance sector.
              </p>
            </div>

            <div className="space-y-24 relative">
              {/* Connector Line */}
              <div className="absolute left-1/2 top-24 bottom-24 w-px bg-gradient-to-b from-teal-500/50 via-purple-500/50 to-orange-500/50 hidden md:block" />

              <TimelineMilestone plan={sixMonthPlan} index={0} accentColor="teal" />
              <TimelineMilestone plan={oneYearPlan} index={1} accentColor="purple" />
              <TimelineMilestone plan={threeYearPlan} index={2} accentColor="blue" />
              <TimelineMilestone plan={fiveYearPlan} index={3} accentColor="orange" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-teal-950/20" />
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Transform the Market?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Join us in building the future of events-based insurance.
              The infrastructure is ready, the market is waiting.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/25 transition-all">
                Initialize Partnership
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 text-white rounded-xl font-bold text-lg border border-white/10 transition-all">
                Schedule Executive Briefing
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-900 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image src="/images/logo-color.png" width={120} height={30} alt="DEI" className="opacity-50 grayscale hover:grayscale-0 transition-all" />
            </div>
            <div className="text-slate-600 text-sm">
              &copy; 2024 Daily Event Insurance. Confidential & Proprietary.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
