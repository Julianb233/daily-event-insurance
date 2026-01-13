"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
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
  Pause
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
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              selectedMetric === metric
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
            }`}
          >
            {metricLabels[metric]}
          </motion.button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative h-72 flex items-end justify-around gap-4 px-4">
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
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap z-20 shadow-xl border border-white/20"
            >
              <div className="font-bold text-teal-400">{item.display}</div>
              <div className="text-xs text-slate-400">{metricLabels[selectedMetric]}</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800 border-r border-b border-white/20" />
            </motion.div>

            {/* Bar */}
            <div className={`absolute inset-0 bg-gradient-to-t ${item.color} rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity`} />
            <div className={`absolute inset-0 bg-gradient-to-t ${item.color} rounded-t-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`} />

            {/* Value on bar */}
            <div className="absolute top-2 left-0 right-0 text-center">
              <span className="text-xs font-bold text-white/90">{item.display}</span>
            </div>

            {/* Label */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
              <div className="text-sm font-semibold text-white">{item.period}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom spacing for labels */}
      <div className="h-8" />
    </div>
  )
}

// Platform Screenshots Carousel
function PlatformShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const screenshots = [
    {
      title: "Partner Dashboard",
      description: "Real-time analytics, policy tracking, and revenue insights all in one place",
      icon: LayoutDashboard,
      features: ["Live conversion metrics", "Revenue tracking", "Policy management", "Customer insights"]
    },
    {
      title: "Insurance Widget Builder",
      description: "Customizable widgets that integrate seamlessly with any platform",
      icon: Layers,
      features: ["Drag-and-drop builder", "Brand customization", "Mobile responsive", "Instant deployment"]
    },
    {
      title: "Claims Management",
      description: "Streamlined claims processing with automated workflows",
      icon: FileText,
      features: ["Automated claim intake", "Status tracking", "Document management", "Fast resolution"]
    },
    {
      title: "API Integration Hub",
      description: "Powerful APIs for deep platform integration",
      icon: Server,
      features: ["RESTful endpoints", "Webhook events", "SDK libraries", "Sandbox testing"]
    },
    {
      title: "Reporting & Analytics",
      description: "Comprehensive reporting for data-driven decisions",
      icon: BarChart3,
      features: ["Custom reports", "Export capabilities", "Trend analysis", "Performance metrics"]
    },
    {
      title: "Partner Portal",
      description: "Self-service tools for partners to manage their business",
      icon: Settings,
      features: ["Account management", "Resource library", "Support tickets", "Training modules"]
    }
  ]

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % screenshots.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length)

  return (
    <div className="relative">
      {/* Main Display */}
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 overflow-hidden"
      >
        {/* Mock Screen Header */}
        <div className="bg-slate-800/80 px-4 py-3 flex items-center gap-2 border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-slate-900/50 rounded-lg text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              partner.dailyeventinsurance.com
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30 mb-4">
                  {(() => {
                    const IconComponent = screenshots[currentSlide].icon
                    return <IconComponent className="w-4 h-4 text-teal-400" />
                  })()}
                  <span className="text-sm text-teal-300 font-medium">Platform Feature</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {screenshots[currentSlide].title}
                </h3>
                <p className="text-slate-300 text-lg mb-6">
                  {screenshots[currentSlide].description}
                </p>
                <ul className="space-y-3">
                  {screenshots[currentSlide].features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Right: Mock UI */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-2xl blur-2xl" />
              <div className="relative bg-slate-900/80 rounded-2xl p-6 border border-white/10">
                {/* Mock Dashboard UI */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-32 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-white/10 rounded-lg" />
                      <div className="h-8 w-8 bg-white/10 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="h-2 w-12 bg-slate-600 rounded mb-2" />
                        <div className="h-6 w-16 bg-gradient-to-r from-teal-500/50 to-emerald-500/50 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex gap-2 mb-4">
                      {[60, 80, 45, 90, 70, 85, 55].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-teal-500 to-emerald-500 rounded-t"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                        <span key={i} className="text-[10px] text-slate-500">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>

        {/* Dots */}
        <div className="flex gap-2">
          {screenshots.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === idx
                  ? 'bg-teal-500 w-8'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/10"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
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

// Agreement Structure Data - Updated
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

// 6-Month Plan - Updated
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

// 1-Year Plan - Updated
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

// 3-Year Plan - Updated
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

// 5-Year Plan - Updated
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

      {/* Hero Section - LIGHTER & UPDATED */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-white via-teal-50/30 to-emerald-50/40 text-slate-900 relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Subtle animated background orbs */}
        <FloatingOrb
          className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-teal-200/50 to-emerald-200/30 rounded-full blur-[100px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-teal-200/30 rounded-full blur-[120px]"
          delay={2}
        />
        <FloatingOrb
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/30 to-teal-100/20 rounded-full blur-[150px]"
          delay={1}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)`,
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
            {/* Logos Side by Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center items-center gap-6 mb-8"
            >
              <div className="backdrop-blur-xl bg-white/80 rounded-2xl p-5 border border-slate-200 shadow-xl">
                <Image
                  src="/images/logo-color.png"
                  alt="Daily Event Insurance"
                  width={180}
                  height={45}
                  className="h-auto w-auto"
                />
              </div>
              <div className="text-3xl font-bold text-teal-500">+</div>
              <div className="backdrop-blur-xl bg-white/80 rounded-2xl p-5 border border-slate-200 shadow-xl">
                <span className="text-2xl font-bold text-slate-800">HIQOR</span>
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-teal-50 rounded-full border border-teal-200 mb-8 shadow-sm"
            >
              <Briefcase className="w-4 h-4 text-teal-600" />
              <span className="text-teal-700 font-medium text-sm">Strategic Partnership Roadmap</span>
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight"
            >
              Daily Event Insurance
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500">
                + HIQOR Partnership
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              A strategic partnership to bring events-based insurance
              <br />
              <span className="text-teal-600 font-semibold">to the HIQOR ecosystem.</span>
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {[
                { label: "Revenue Share", value: "70/30", sublabel: "HIQOR / DEI" },
                { label: "Microsite Cost", value: "$600", sublabel: "Per Month" },
                { label: "Support", value: "Full", sublabel: "Included" },
                { label: "Partnership", value: "Win-Win", sublabel: "Aligned Goals" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="backdrop-blur-xl bg-white/70 rounded-2xl p-4 border border-slate-200 shadow-lg"
                >
                  <div className="text-2xl md:text-3xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-xs text-teal-600 font-medium">{stat.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.sublabel}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* What DEI Provides Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
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
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">What We Provide</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              The Daily Event Insurance{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Advantage
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything HIQOR needs to launch and scale events-based insurance, fully managed by our team.
            </p>
          </motion.div>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deiValueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/50 to-emerald-500/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500" />

                <div className="relative h-full backdrop-blur-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-teal-300 transition-all duration-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:from-teal-500 group-hover:to-emerald-500 transition-all">
                      <prop.icon className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">{prop.title}</h3>
                      <span className="inline-block mt-1 px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                        {prop.pricing}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-4">{prop.description}</p>

                  <ul className="space-y-2">
                    {prop.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agreement Structure Section - Updated */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingOrb
          className="absolute top-20 right-[20%] w-64 h-64 bg-gradient-to-br from-teal-500/30 to-emerald-500/20 rounded-full blur-[80px]"
          delay={0.5}
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
              <FileText className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-teal-300">Partnership Terms</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Agreement{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Structure
              </span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Clear, transparent terms designed for a successful long-term partnership.
            </p>
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
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/50 to-emerald-500/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500" />

                <div className="relative h-full backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 hover:border-teal-500/50 transition-all duration-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <term.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{term.title}</h3>
                      <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 text-sm font-semibold rounded-full border border-teal-500/30">
                        {term.highlight}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4">{term.description}</p>

                  <ul className="space-y-2">
                    {term.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <FloatingOrb
          className="absolute bottom-20 left-[15%] w-80 h-80 bg-gradient-to-br from-purple-500/20 to-teal-500/20 rounded-full blur-[100px]"
          delay={1.5}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-6"
            >
              <Monitor className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-teal-300">Platform Preview</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              The Platform{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                You&apos;ll Get
              </span>
            </h2>
            <p className="text-xl text-slate-300">Explore the features we&apos;ve built for partners like HIQOR</p>
          </motion.div>

          <PlatformShowcase />
        </div>
      </section>

      {/* Interactive Revenue Chart Section */}
      <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white relative overflow-hidden">
        <FloatingOrb
          className="absolute top-20 left-[20%] w-64 h-64 bg-gradient-to-br from-emerald-500/30 to-teal-500/20 rounded-full blur-[80px]"
          delay={0.5}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-6"
            >
              <PieChart className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-teal-300">Growth Projections</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Revenue{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Growth Trajectory
              </span>
            </h2>
            <p className="text-xl text-slate-300">Interactive projections - click to explore different metrics</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10"
          >
            <InteractiveRevenueChart />

            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Avg. Policy Value", value: "$15" },
                { label: "Conversion Rate", value: "15-20%" },
                { label: "DEI Revenue Share", value: "30%" },
                { label: "HIQOR Retention", value: "70%" }
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

      {/* 6-Month Plan Section */}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Strategic{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Roadmap
              </span>
            </h2>
            <p className="text-xl text-slate-600">Our journey from foundation to market leadership</p>
          </motion.div>

          <div className="text-slate-900">
            <TimelineMilestone plan={sixMonthPlan} index={0} accentColor="teal" />
          </div>
        </div>
      </section>

      {/* 1-Year Plan Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingOrb
          className="absolute top-20 right-[20%] w-64 h-64 bg-gradient-to-br from-purple-500/30 to-indigo-500/20 rounded-full blur-[80px]"
          delay={0.5}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <TimelineMilestone plan={oneYearPlan} index={1} accentColor="purple" />
        </div>
      </section>

      {/* 3-Year Plan Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-slate-900">
            <TimelineMilestone plan={threeYearPlan} index={2} accentColor="orange" />
          </div>
        </div>
      </section>

      {/* 5-Year Plan Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingOrb
          className="absolute bottom-10 right-[15%] w-64 h-64 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 rounded-full blur-[80px]"
          delay={1}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <TimelineMilestone plan={fiveYearPlan} index={3} accentColor="blue" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-b from-white to-teal-50/50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-3xl blur-2xl" />
              <div className="relative backdrop-blur-sm bg-white/90 rounded-3xl p-12 border border-slate-200 shadow-2xl">
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
                  Ready to Partner?
                </h2>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  Daily Event Insurance is excited to bring events-based insurance to the HIQOR ecosystem.
                  Together, we&apos;ll create value for your partners and their customers.
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
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 text-slate-900 font-bold text-lg rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    Learn More About Daily Event Insurance
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
