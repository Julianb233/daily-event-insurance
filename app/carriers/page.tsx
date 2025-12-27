"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
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
  Database
} from "lucide-react"

const heroStats = [
  { value: "68%", label: "Average Opt-In Rate" },
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
    title: "Participants Opt Into Coverage",
    description: "During checkout or registration, participants see your coverage offer. One click to add protection. 68% average opt-in rate.",
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
    description: "Know when participants are active, what they're doing, and how often"
  },
  {
    icon: LineChart,
    title: "Risk Window Precision",
    description: "Coverage aligned to actual exposure windows, not estimated time periods"
  },
  {
    icon: PieChart,
    title: "Behavioral Underwriting",
    description: "Participant history, frequency, and activity type inform risk profiles"
  },
  {
    icon: Shield,
    title: "Verified Participation",
    description: "Biometric check-ins and event triggers eliminate fraud and false claims"
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

const partnerLogos = [
  "Mutual of Omaha",
  "Your Carrier Here",
]

export default function CarriersPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30 mb-6">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span className="text-teal-300 font-medium text-sm">For Insurance Carriers</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Acquire Customers Where<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300">
                They're Already Active
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
              HIQOR delivers pre-qualified, intent-rich customers through embedded distribution—
              at a fraction of traditional acquisition costs. No cold leads. No wasted ad spend.
              Just warm participants ready for coverage.
            </p>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white font-bold text-lg rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/25"
            >
              Schedule a Partnership Call
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">Carrier Benefits</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why Carriers Partner With HIQOR
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500 transition-colors">
                    <item.icon className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6">
              <Zap className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">The Process</span>
            </div>

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
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <span className="text-2xl font-bold text-white">{item.step}</span>
                      </div>
                    </div>
                    <div>
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

      {/* Data Advantage Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30 mb-6">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-medium text-teal-300">Data Advantage</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Underwriting Intelligence<br />
              <span className="text-teal-400">Traditional Carriers Can't Access</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Event-triggered coverage generates rich, real-time data that transforms
              how you assess risk and price policies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataAdvantages.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-teal-500/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Metric</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-500">Traditional</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-teal-600">With HIQOR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {comparisonData.map((row, index) => (
                    <tr key={row.metric} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.metric}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-500">{row.traditional}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          {row.hiqor}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coverage Types Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Coverage Categories We Support
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              HIQOR activates coverage across diverse event types—each with unique risk profiles and data opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Fitness & Gyms", icon: "🏋️" },
              { name: "Running & Races", icon: "🏃" },
              { name: "Climbing", icon: "🧗" },
              { name: "Winter Sports", icon: "⛷️" },
              { name: "Water Sports", icon: "🏄" },
              { name: "Equipment Rentals", icon: "🚴" },
              { name: "Adventure Tours", icon: "🏔️" },
              { name: "Wellness & MedSpa", icon: "💆" },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 text-center border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <div className="text-sm font-medium text-slate-700">{category.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Distribution?
            </h2>
            <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
              Join forward-thinking carriers who are acquiring customers through embedded,
              event-triggered distribution. Let's build the future of insurance together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:partners@dailyeventinsurance.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-xl hover:bg-teal-50 transition-all shadow-lg"
              >
                Contact Partnerships Team
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-500/20 text-white font-bold text-lg rounded-xl border border-white/20 hover:bg-teal-500/30 transition-all"
              >
                Learn About HIQOR
              </a>
            </div>

            <p className="text-sm text-teal-200 mt-8">
              Currently partnered with leading carriers including Mutual of Omaha
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
