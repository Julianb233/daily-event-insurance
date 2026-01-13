"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import {
  Building2,
  Users,
  Handshake,
  DollarSign,
  TrendingUp,
  Shield,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Globe,
  Award,
  BarChart3,
  Clock,
  Zap,
  Sparkles
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

const partnershipTypes = [
  {
    icon: Building2,
    title: "Strategic Partner",
    subtitle: "For Insurance Carriers & Enterprise",
    description: "Partner with HIQOR to access our event-based insurance distribution network. Integrate your products into our platform and reach millions of active participants.",
    benefits: [
      "White-label integration options",
      "Real-time underwriting data",
      "Dedicated account management",
      "Custom product development",
      "Priority support & SLAs"
    ],
    cta: "Contact Enterprise Sales",
    href: "/carriers",
    gradient: "from-teal-500 to-emerald-500"
  },
  {
    icon: Briefcase,
    title: "Business Representative",
    subtitle: "For Sales Professionals",
    description: "Become an authorized HIQOR representative and earn recurring commission on every partner you onboard. Access our partner portal with real-time analytics.",
    benefits: [
      "Competitive commission structure",
      "Partner portal access",
      "Sales materials & training",
      "Monthly performance bonuses",
      "Dedicated rep support"
    ],
    cta: "Apply as Business Rep",
    href: "#apply",
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    icon: Handshake,
    title: "Referral Partner",
    subtitle: "For Industry Connectors",
    description: "Know businesses that could benefit from HIQOR? Refer them and earn a referral bonus for every successful onboarding. No sales experience required.",
    benefits: [
      "Simple referral process",
      "Referral bonus per signup",
      "No minimum requirements",
      "Easy tracking dashboard",
      "Quarterly payouts"
    ],
    cta: "Join Referral Program",
    href: "#apply",
    gradient: "from-orange-500 to-rose-500"
  }
]

const portalFeatures = [
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track your earnings, referrals, and partner performance" },
  { icon: DollarSign, title: "Commission Tracking", desc: "View projected and earned commissions by month" },
  { icon: Users, title: "Partner Management", desc: "Manage your referred partners and their status" },
  { icon: Award, title: "Performance Tiers", desc: "Unlock higher commission rates as you grow" }
]

const stats = [
  { value: "$10-15", label: "Per Participant" },
  { value: "37.5%", label: "Top Commission Tier" },
  { value: "48hrs", label: "Partner Setup Time" },
  { value: "Monthly", label: "Payouts" }
]

export default function WorkWithUsPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden min-h-[60vh] flex items-center">
        <FloatingOrb
          className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-teal-500/40 to-emerald-500/20 rounded-full blur-[100px]"
          delay={0}
        />
        <FloatingOrb
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-gradient-to-br from-purple-400/30 to-teal-500/20 rounded-full blur-[120px]"
          delay={2}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 rounded-full border border-white/20 mb-8 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-teal-300 font-medium text-sm">Partnership Opportunities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight"
            >
              Work With{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
                Us
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Join the HIQOR network and earn recurring revenue by connecting event businesses with the insurance coverage they need.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <div className="text-2xl md:text-3xl font-bold text-teal-400">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Partnership Types */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-50 rounded-full border border-teal-200 mb-6"
            >
              <Users className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Partnership Types</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Path
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Whether you&apos;re an enterprise carrier, sales professional, or industry connector, we have a partnership model for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {partnershipTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${type.gradient} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-all duration-300`} />
                <div className="relative h-full bg-white rounded-3xl p-8 border border-slate-200 hover:border-teal-300 shadow-xl hover:shadow-2xl transition-all">
                  <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center`}>
                    <type.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{type.title}</h3>
                  <p className="text-sm font-medium text-teal-600 mb-4">{type.subtitle}</p>
                  <p className="text-slate-600 mb-6 leading-relaxed">{type.description}</p>

                  <ul className="space-y-3 mb-8">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.a
                    href={type.href}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${type.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all`}
                  >
                    {type.cta}
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Portal Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingOrb
          className="absolute top-20 right-[20%] w-64 h-64 bg-gradient-to-br from-teal-500/30 to-emerald-500/20 rounded-full blur-[80px]"
          delay={0.5}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              <Globe className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-teal-300">Partner Portal</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Portal
              </span>
              {" "}Awaits
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Once approved, access your personalized partner portal with everything you need to succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {portalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                <div className="relative flex items-start gap-4 p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 hover:border-teal-500/50 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <motion.a
              href="/sign-in"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 backdrop-blur-xl bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/30 hover:bg-white/20 transition-all"
            >
              Access Partner Portal
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-50 rounded-full border border-teal-200 mb-6"
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
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, icon: Clock, title: "Apply", desc: "Submit your application with your business details and partnership interest" },
              { step: 2, icon: Shield, title: "Get Approved", desc: "Our team reviews your application and sets up your partner account within 48 hours" },
              { step: 3, icon: TrendingUp, title: "Start Earning", desc: "Access your portal, start referring partners, and track your recurring commissions" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-teal-300 to-transparent" />
                )}
                <div className="relative text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 bg-white rounded-full border-2 border-teal-500 flex items-center justify-center text-teal-600 font-bold text-sm shadow">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Section */}
      <section id="apply" className="py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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
              Ready to Partner With Us?
            </motion.h2>
            <motion.p
              className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join the HIQOR network and start earning recurring commission on event-based insurance.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-5 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.a
                href="/#apply"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg rounded-2xl hover:from-teal-400 hover:to-emerald-400 transition-all shadow-2xl shadow-teal-500/30"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="/carriers"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 backdrop-blur-xl bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/30 hover:bg-white/20 transition-all"
              >
                Enterprise Partners
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
