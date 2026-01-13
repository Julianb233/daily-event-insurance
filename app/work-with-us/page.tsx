"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Handshake,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  DollarSign,
  Briefcase,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Headphones,
  FileText,
  LayoutDashboard,
  PiggyBank,
  Award,
  Clock,
  Globe
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

const partnerBenefits = [
  {
    icon: DollarSign,
    title: "Competitive Commissions",
    description: "Earn 25-35% commission on every policy sold through your network"
  },
  {
    icon: LayoutDashboard,
    title: "Partner Portal",
    description: "Get your own dashboard to track earnings, policies, and performance in real-time"
  },
  {
    icon: FileText,
    title: "Marketing Materials",
    description: "Access premium co-branded marketing assets, sales scripts, and collateral"
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Work with a dedicated partner success manager to maximize your results"
  }
]

const partnerTypes = [
  {
    icon: Building2,
    title: "Venue Operators",
    description: "Gyms, climbing centers, adventure parks, and recreational facilities",
    examples: ["Fitness centers", "Rock climbing gyms", "Trampoline parks", "Water parks"]
  },
  {
    icon: Users,
    title: "Event Organizers",
    description: "Race directors, league coordinators, and event management companies",
    examples: ["Marathon organizers", "Sports leagues", "Tournament hosts", "Outdoor events"]
  },
  {
    icon: Globe,
    title: "Equipment Rentals",
    description: "Ski resorts, bike rentals, watersports, and outdoor gear providers",
    examples: ["Ski & snowboard rentals", "Bike shops", "Kayak/paddle rentals", "Scooter services"]
  },
  {
    icon: Briefcase,
    title: "Insurance Brokers",
    description: "Licensed insurance professionals looking to expand their product offerings",
    examples: ["Independent agents", "Broker networks", "MGA/MGU partners", "Wholesalers"]
  }
]

const howItWorksSteps = [
  {
    step: "01",
    title: "Apply to Partner",
    description: "Fill out our simple application form. We'll review your business and get back to you within 24-48 hours."
  },
  {
    step: "02",
    title: "Get Your Portal",
    description: "Once approved, you'll receive access to your personalized partner dashboard with tracking, materials, and support."
  },
  {
    step: "03",
    title: "Start Earning",
    description: "Integrate our insurance offering into your customer journey and start earning commissions immediately."
  }
]

const portalFeatures = [
  { icon: BarChart3, text: "Real-time earnings dashboard" },
  { icon: TrendingUp, text: "Performance analytics & reports" },
  { icon: Shield, text: "Policy tracking & management" },
  { icon: FileText, text: "Co-branded marketing materials" },
  { icon: PiggyBank, text: "Automated payout tracking" },
  { icon: Award, text: "Commission tier progression" }
]

export default function WorkWithUsPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden min-h-[70vh] flex items-center">
        {/* Animated background orbs */}
        <FloatingOrb
          className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-teal-500/40 to-emerald-500/20 rounded-full blur-[100px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-gradient-to-br from-teal-400/30 to-cyan-500/20 rounded-full blur-[120px]"
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
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-8 shadow-lg"
            >
              <Handshake className="w-4 h-4 text-teal-400" />
              <span className="text-teal-300 font-medium text-sm">Strategic Partnership</span>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight"
            >
              Work With Us
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
                Become a Strategic Partner
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Join our network of business partners and unlock new revenue streams by offering event-activated insurance to your customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg rounded-2xl hover:from-teal-400 hover:to-emerald-400 transition-all shadow-2xl shadow-teal-500/30 border border-teal-400/30"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-3 px-8 py-4 backdrop-blur-xl bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/30 hover:bg-white/20 transition-all"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Partner Benefits Section */}
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
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Partner Benefits</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why Partner{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                With Us
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Unlock new revenue opportunities while providing valuable protection to your customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/50 to-emerald-500/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500" />

                <div className="relative h-full backdrop-blur-sm bg-white/80 rounded-3xl p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl hover:border-teal-300/50 transition-all duration-500 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <benefit.icon className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types Section */}
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
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-6"
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-teal-300">Partner Types</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Who Can{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Partner
              </span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              We work with a variety of businesses in the events, recreation, and adventure industries
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 hover:border-teal-500/50 transition-all text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center">
                    <type.icon className="w-8 h-8 text-teal-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{type.title}</h3>
                  <p className="text-slate-300 mb-4">{type.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {type.examples.map((example) => (
                      <span
                        key={example}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm text-teal-300 border border-white/10"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/50 to-transparent rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              <Zap className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Getting Started</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              How It{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Works
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Becoming a partner is simple. Here&apos;s how to get started:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-teal-300 to-emerald-300" />
                )}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative z-10 w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/20"
                >
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </motion.div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Portal Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-sm bg-teal-50 rounded-full border border-teal-200 mb-6 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-700">Partner Portal</span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                  Dashboard
                </span>{" "}
                Awaits
              </h2>

              <p className="text-lg text-slate-600 mb-8">
                As a partner, you&apos;ll get access to your own personalized portal where you can track everything from earnings to policy performance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portalFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Portal Preview Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-3xl blur-2xl" />
              <div className="relative backdrop-blur-sm bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Partner Dashboard</h4>
                    <p className="text-sm text-slate-500">Your command center</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">This Month&apos;s Earnings</span>
                    <span className="text-2xl font-bold text-teal-600">$4,250</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Active Policies</span>
                    <span className="text-2xl font-bold text-slate-900">127</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">Commission Tier</span>
                    <span className="text-lg font-bold text-emerald-600 flex items-center gap-1">
                      <Award className="w-5 h-5" /> Gold
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                  <p className="text-sm text-slate-500">Sample dashboard preview</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Partner{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Requirements
              </span>
            </h2>
            <p className="text-lg text-slate-600">
              We look for partners who share our commitment to customer protection
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
            <div className="relative backdrop-blur-sm bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: Building2, text: "Established business in events, recreation, or fitness" },
                  { icon: Users, text: "Active customer base seeking participant protection" },
                  { icon: Clock, text: "Commitment to providing quality customer experiences" },
                  { icon: CheckCircle2, text: "Ability to integrate insurance into your customer journey" }
                ].map((req, index) => (
                  <motion.div
                    key={req.text}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <req.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-slate-700 pt-2">{req.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <FloatingOrb
          className="absolute top-10 left-[10%] w-48 h-48 bg-gradient-to-br from-teal-500/30 to-emerald-500/20 rounded-full blur-[60px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-10 right-[15%] w-64 h-64 bg-gradient-to-br from-purple-500/20 to-teal-500/20 rounded-full blur-[80px]"
          delay={1}
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
              Ready to Start{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Earning
              </span>
              ?
            </motion.h2>
            <motion.p
              className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join our partner network today and unlock new revenue opportunities while providing valuable protection to your customers.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-5 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg rounded-2xl hover:from-teal-400 hover:to-emerald-400 transition-all shadow-2xl shadow-teal-500/30"
                >
                  Apply to Partner
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/about/hiqor"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 backdrop-blur-xl bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/30 hover:bg-white/20 transition-all"
                >
                  Learn About HiQor
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
