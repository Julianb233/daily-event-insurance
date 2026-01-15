"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { StepByStep } from "@/components/support-hub/StepByStep"
import {
  XCircle,
  CheckCircle,
  Cloud,
  Heart,
  AlertTriangle,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  Shield,
  FileText
} from "lucide-react"

const coveragePlans = [
  {
    name: "Basic Refund",
    price: "$1-2",
    refund: "50%",
    best: "Low-cost events",
    features: [
      "Weather cancellations",
      "Emergency illness",
      "50% refund",
      "7-day processing"
    ]
  },
  {
    name: "Standard Refund",
    price: "$3-4",
    refund: "75%",
    best: "Most bookings",
    features: [
      "Everything in Basic",
      "Family emergencies",
      "Work conflicts",
      "75% refund",
      "3-day processing"
    ],
    popular: true
  },
  {
    name: "Full Protection",
    price: "$5-7",
    refund: "100%",
    best: "Premium events",
    features: [
      "Everything in Standard",
      "Any covered reason",
      "100% refund",
      "Same-day processing",
      "Cancel anytime protection",
      "Travel issues covered"
    ]
  }
]

const coveredReasons = [
  {
    category: "Weather Events",
    icon: Cloud,
    color: "blue",
    reasons: [
      "Severe storms or hurricanes",
      "Heavy snow or ice",
      "Extreme temperatures",
      "Flooding or natural disasters",
      "Official weather warnings"
    ]
  },
  {
    category: "Medical Emergencies",
    icon: Heart,
    color: "red",
    reasons: [
      "Sudden illness or injury",
      "Hospitalization required",
      "Doctor-ordered bed rest",
      "COVID-19 diagnosis",
      "Family member emergency"
    ]
  },
  {
    category: "Travel Issues",
    icon: AlertTriangle,
    color: "orange",
    reasons: [
      "Flight cancellations",
      "Car breakdown en route",
      "Road closures",
      "Public transit failures",
      "Traffic accidents"
    ]
  },
  {
    category: "Personal Emergencies",
    icon: AlertTriangle,
    color: "purple",
    reasons: [
      "Death in family",
      "Home emergency (fire, flood)",
      "Jury duty summons",
      "Work emergency (mandatory)",
      "Childcare emergency"
    ]
  }
]

const cancellationProcess = [
  {
    title: "Review Policy Terms",
    description: "Before canceling, review what's covered under your specific plan. Different plans have different covered reasons and refund percentages.",
    icon: FileText
  },
  {
    title: "Submit Cancellation Request",
    description: "Cancel through your booking portal or app. Select the reason for cancellation and provide any required documentation (medical notes, weather alerts, etc.).",
    icon: XCircle
  },
  {
    title: "Provide Supporting Documentation",
    description: "Upload proof of the covered reason - doctor's notes, weather warnings, flight cancellations, emergency notifications. Clear documentation speeds up processing.",
    icon: FileText
  },
  {
    title: "Receive Refund",
    description: "Once approved, refund is processed based on your coverage level. Refunds appear in original payment method within 3-7 business days.",
    icon: DollarSign
  }
]

const realScenarios = [
  {
    event: "Outdoor Yoga Retreat",
    cost: "$150",
    coverage: "Standard Refund",
    reason: "Hurricane warning issued 24 hours before event",
    documentation: "National Weather Service alert",
    outcome: "Approved within 2 hours",
    refund: "$112.50 (75%)"
  },
  {
    event: "Marathon Registration",
    cost: "$200",
    coverage: "Full Protection",
    reason: "Member diagnosed with COVID-19 two days before race",
    documentation: "Positive COVID test and doctor's note",
    outcome: "Approved same day",
    refund: "$200 (100%)"
  },
  {
    event: "Ski Trip Package",
    cost: "$500",
    coverage: "Full Protection",
    reason: "Flight cancelled due to snowstorm",
    documentation: "Airline cancellation notice",
    outcome: "Approved within 4 hours",
    refund: "$500 (100%)"
  },
  {
    event: "CrossFit Competition",
    cost: "$75",
    coverage: "Basic Refund",
    reason: "Ankle injury week before competition",
    documentation: "Doctor's note and x-ray report",
    outcome: "Approved in 5 days",
    refund: "$37.50 (50%)"
  }
]

const notCoveredReasons = [
  "Change of mind or lost interest",
  "Found a better event or deal",
  "Scheduling conflict (non-emergency)",
  "Financial hardship",
  "Forgot about the booking",
  "Transportation preference change",
  "Friend can't attend",
  "Weather you don't like (but not severe)",
  "Pre-existing conditions (for medical)",
  "Voluntary work commitment"
]

export default function CancellationPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/support-hub/products" },
          { label: "Cancellation Coverage" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 font-semibold text-sm mb-6">
          <XCircle className="w-4 h-4" />
          Refund Protection
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Cancellation Coverage
          <span className="block mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Peace of Mind Guarantee
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Life happens. Protect your members from unexpected cancellations with flexible refund options.
          Weather, illness, emergencies - we've got them covered.
        </p>
      </motion.div>

      {/* Coverage Plans */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Refund Protection Plans
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the refund percentage that fits your event pricing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {coveragePlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                variant={plan.popular ? "featured" : "default"}
                className="h-full"
              >
                <div className="p-8">
                  {plan.popular && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold mb-4">
                      <TrendingUp className="w-4 h-4" />
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-purple-600">
                      {plan.price}
                    </span>
                    <span className="text-slate-600">per booking</span>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl mb-6">
                    <div className="text-sm text-purple-700 font-semibold mb-1">
                      Refund Amount
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {plan.refund}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-slate-600 mb-2">
                      Best For
                    </div>
                    <div className="text-slate-900 font-medium">
                      {plan.best}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Covered Reasons */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What's Covered
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Covered reasons for cancellation by category
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {coveredReasons.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 bg-${category.color}-50/50 rounded-xl border border-${category.color}-100`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${category.color}-500 to-${category.color}-600 flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {category.category}
                    </h3>
                  </div>

                  <ul className="space-y-2">
                    {category.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle className={`w-4 h-4 text-${category.color}-600 flex-shrink-0 mt-0.5`} />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Cancellation Process */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            How to File a Cancellation Claim
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Simple process from cancellation to refund
          </p>
        </motion.div>

        <StepByStep steps={cancellationProcess} />
      </section>

      {/* Real Scenarios */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Real Cancellation Examples
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See how members were protected with cancellation coverage
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {realScenarios.map((scenario, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {scenario.event}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{scenario.cost} booking</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      {scenario.coverage}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-1">
                        Cancellation Reason
                      </div>
                      <p className="text-sm text-slate-700">
                        {scenario.reason}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-1">
                        Documentation Provided
                      </div>
                      <p className="text-sm text-slate-700">
                        {scenario.documentation}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Processing Time</span>
                      <span className="text-sm font-bold text-green-600">
                        {scenario.outcome}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Refund Amount</span>
                      <span className="text-lg font-bold text-purple-600">
                        {scenario.refund}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Not Covered */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-8 h-8 text-red-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                What's NOT Covered
              </h2>
            </div>

            <p className="text-lg text-slate-600 mb-6">
              These reasons do not qualify for refunds under any plan
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {notCoveredReasons.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl border border-red-100"
                >
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{reason}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-yellow-900 mb-1">Important Note</h4>
                  <p className="text-sm text-yellow-800">
                    All cancellation reasons must be documented with proof. Claims without proper
                    documentation may be denied or require additional review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* CTA Section */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Offer Flexible Cancellation Protection
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Increase bookings and customer satisfaction with cancellation coverage
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/support-hub/integrations">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-purple-300 transition-all group"
                >
                  <Shield className="w-10 h-10 text-purple-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    Add to Bookings
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Integrate cancellation coverage
                  </p>
                  <div className="flex items-center justify-center text-purple-600 font-semibold">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/products/pricing">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-purple-300 transition-all group"
                >
                  <DollarSign className="w-10 h-10 text-purple-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    View Pricing
                  </h3>
                  <p className="text-slate-600 mb-4">
                    See costs and commissions
                  </p>
                  <div className="flex items-center justify-center text-purple-600 font-semibold">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/products/claims">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-purple-300 transition-all group"
                >
                  <FileText className="w-10 h-10 text-purple-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    Claims Guide
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Help members file claims
                  </p>
                  <div className="flex items-center justify-center text-purple-600 font-semibold">
                    Read Guide
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
