"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Home,
  DollarSign,
  ArrowRight,
  HelpCircle,
  Users,
  Bike,
  Mountain,
  Dumbbell
} from "lucide-react"

const coverageTypes = [
  {
    id: "event",
    name: "Event Insurance",
    tagline: "Per-activity coverage for single events",
    icon: Calendar,
    color: "teal",
    priceRange: "$3-15 per event",
    description: "Covers participants for a single day or event. Perfect for classes, workshops, and one-time activities.",
    coverage: [
      "Accidental injury during the event",
      "Medical expenses up to policy limits",
      "Emergency transportation costs",
      "Activity-specific risks"
    ],
    notCovered: [
      "Pre-existing conditions",
      "Intentional self-harm",
      "Activities outside event scope",
      "Equipment damage (separate coverage)"
    ],
    bestFor: ["Fitness classes", "Yoga sessions", "Group workouts", "Single-day workshops"],
    example: "A member takes a spin class. If they're injured during class, their medical expenses are covered up to $50,000."
  },
  {
    id: "liability",
    name: "Liability Coverage",
    tagline: "Protection against third-party claims",
    icon: AlertTriangle,
    color: "orange",
    priceRange: "$5-20 per activity",
    description: "Protects against claims from third parties for bodily injury or property damage caused during activities.",
    coverage: [
      "Third-party bodily injury claims",
      "Property damage liability",
      "Legal defense costs",
      "Settlement payments"
    ],
    notCovered: [
      "Criminal acts",
      "Contractual liability",
      "Professional errors (E&O)",
      "Employment-related claims"
    ],
    bestFor: ["Adventure sports", "Equipment rentals", "Outdoor activities", "High-risk events"],
    example: "A rental bike causes property damage. Liability coverage pays for repairs and legal costs up to $100,000."
  },
  {
    id: "property",
    name: "Property Coverage",
    tagline: "Equipment and asset protection",
    icon: Home,
    color: "blue",
    priceRange: "$2-10 per rental",
    description: "Covers equipment, gear, and assets against damage, theft, or loss during rental or use.",
    coverage: [
      "Accidental damage to equipment",
      "Theft protection",
      "Loss during rental period",
      "Repair or replacement costs"
    ],
    notCovered: [
      "Normal wear and tear",
      "Mechanical breakdown",
      "Damage from misuse",
      "Items left unattended"
    ],
    bestFor: ["Bike rentals", "Ski equipment", "Climbing gear", "Water sports equipment"],
    example: "A rented paddleboard gets damaged. Property coverage pays for repair up to replacement value."
  },
  {
    id: "cancellation",
    name: "Cancellation Coverage",
    tagline: "Refund protection for cancellations",
    icon: XCircle,
    color: "purple",
    priceRange: "$1-5 per booking",
    description: "Reimburses fees when events are cancelled due to covered reasons like weather or illness.",
    coverage: [
      "Weather-related cancellations",
      "Sudden illness or injury",
      "Family emergencies",
      "Venue-forced cancellations"
    ],
    notCovered: [
      "Change of mind",
      "Scheduling conflicts",
      "Foreseeable weather",
      "Business-related cancellations"
    ],
    bestFor: ["Outdoor events", "Adventure tours", "Seasonal activities", "Weather-dependent sports"],
    example: "A hiking trip is cancelled due to a storm warning. Cancellation coverage refunds the booking fee."
  }
]

const activityCoverageMatrix = [
  {
    activity: "Gym & Fitness Classes",
    icon: Dumbbell,
    recommended: ["Event Insurance"],
    optional: ["Liability Coverage"],
    avgPrice: "$3-5/class"
  },
  {
    activity: "Equipment Rentals",
    icon: Bike,
    recommended: ["Property Coverage", "Liability Coverage"],
    optional: ["Event Insurance"],
    avgPrice: "$5-12/rental"
  },
  {
    activity: "Adventure Sports",
    icon: Mountain,
    recommended: ["Event Insurance", "Liability Coverage"],
    optional: ["Cancellation Coverage"],
    avgPrice: "$8-20/activity"
  }
]

const faqs = [
  {
    q: "Can members combine multiple coverage types?",
    a: "Yes! Members can purchase multiple coverage types for comprehensive protection. For example, combining Event Insurance with Cancellation Coverage for an outdoor yoga retreat."
  },
  {
    q: "How quickly does coverage take effect?",
    a: "All coverage is instant. The moment a member completes their purchase, they're protected. No waiting periods or pre-authorization required."
  },
  {
    q: "Are there age restrictions for coverage?",
    a: "Coverage is available for participants 18+. Minors can be covered under a parent/guardian's policy when accompanied during activities."
  },
  {
    q: "What's the claims process like?",
    a: "Claims can be filed online within 30 days of the incident. Most claims are processed within 5-7 business days. We handle all communication with members directly."
  }
]

export default function CoverageTypesPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/support-hub/products" },
          { label: "Coverage Types" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-teal-600 font-semibold text-sm mb-6">
          <Shield className="w-4 h-4" />
          Coverage Comparison
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Understanding Your
          <span className="block mt-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Coverage Options
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Choose the right protection for your members. Each coverage type is designed for specific
          activities and risks. Mix and match for comprehensive protection.
        </p>
      </motion.div>

      {/* Coverage Type Cards */}
      <section className="space-y-8">
        {coverageTypes.map((coverage, index) => (
          <motion.div
            key={coverage.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hoverEffect={false}>
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Header */}
                  <div className="lg:w-1/3">
                    <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-${coverage.color}-500 to-${coverage.color}-600 flex items-center justify-center`}>
                      <coverage.icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                      {coverage.name}
                    </h2>
                    <p className="text-lg text-slate-600 mb-4">{coverage.tagline}</p>
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-bold">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {coverage.priceRange}
                    </div>
                    <p className="text-slate-600 mt-4">{coverage.description}</p>
                  </div>

                  {/* Coverage Details */}
                  <div className="lg:w-2/3 grid md:grid-cols-2 gap-6">
                    {/* What's Covered */}
                    <div className="p-6 bg-green-50/50 rounded-xl border border-green-100">
                      <h3 className="flex items-center gap-2 font-bold text-green-800 mb-4">
                        <CheckCircle className="w-5 h-5" />
                        What's Covered
                      </h3>
                      <ul className="space-y-2">
                        {coverage.coverage.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-green-700">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What's Not Covered */}
                    <div className="p-6 bg-red-50/50 rounded-xl border border-red-100">
                      <h3 className="flex items-center gap-2 font-bold text-red-800 mb-4">
                        <XCircle className="w-5 h-5" />
                        Not Covered
                      </h3>
                      <ul className="space-y-2">
                        {coverage.notCovered.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-red-700">
                            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Best For */}
                    <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                      <h3 className="flex items-center gap-2 font-bold text-blue-800 mb-4">
                        <Users className="w-5 h-5" />
                        Best For
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {coverage.bestFor.map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Real Example */}
                    <div className="p-6 bg-purple-50/50 rounded-xl border border-purple-100">
                      <h3 className="flex items-center gap-2 font-bold text-purple-800 mb-4">
                        <AlertTriangle className="w-5 h-5" />
                        Real Example
                      </h3>
                      <p className="text-purple-700">{coverage.example}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </section>

      {/* Activity Coverage Matrix */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Coverage by Activity Type
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Recommended coverage combinations for common business types
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {activityCoverageMatrix.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hoverEffect>
                <div className="p-6">
                  <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                    <activity.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {activity.activity}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-green-700 mb-2">
                        Recommended Coverage
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activity.recommended.map((cov, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                          >
                            {cov}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-blue-700 mb-2">
                        Optional Add-ons
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activity.optional.map((cov, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                          >
                            {cov}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Typical Price</span>
                        <span className="font-bold text-teal-600">{activity.avgPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section>
        <GlassCard hoverEffect={false}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                Coverage Questions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <h3 className="font-bold text-slate-900 mb-3">{faq.q}</h3>
                  <p className="text-slate-600">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Next Steps */}
      <section>
        <GlassCard hoverEffect={false}>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Explore More
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/support-hub/products/pricing">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <DollarSign className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Pricing & Revenue
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Understand costs and commission structure
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    View Pricing
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/products/claims">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <Shield className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Claims Process
                  </h3>
                  <p className="text-slate-600 mb-4">
                    How to file and manage insurance claims
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/faq">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <HelpCircle className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    More FAQs
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Browse all frequently asked questions
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    View FAQs
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
