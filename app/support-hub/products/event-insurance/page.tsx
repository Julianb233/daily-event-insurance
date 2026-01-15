"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { StepByStep } from "@/components/support-hub/StepByStep"
import {
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Clock,
  FileText,
  AlertCircle,
  ArrowRight,
  Heart,
  Activity,
  TrendingUp
} from "lucide-react"

const coverageTiers = [
  {
    name: "Basic",
    price: "$3-5",
    coverage: "$25,000",
    best: "Low-risk activities",
    features: [
      "Accidental injury coverage",
      "Emergency medical expenses",
      "Ambulance transportation",
      "24/7 claims support"
    ]
  },
  {
    name: "Standard",
    price: "$6-10",
    coverage: "$50,000",
    best: "Most activities",
    features: [
      "Everything in Basic",
      "Extended medical coverage",
      "Follow-up care visits",
      "Prescription medications",
      "Physical therapy coverage"
    ],
    popular: true
  },
  {
    name: "Premium",
    price: "$11-15",
    coverage: "$100,000",
    best: "High-risk activities",
    features: [
      "Everything in Standard",
      "Emergency surgery coverage",
      "Hospital stays",
      "Specialist consultations",
      "Extended recovery care",
      "Priority claims processing"
    ]
  }
]

const activityRiskLevels = [
  {
    level: "Low Risk",
    color: "green",
    price: "$3-5",
    activities: [
      "Yoga classes",
      "Pilates",
      "Meditation sessions",
      "Walking groups",
      "Stretching classes"
    ]
  },
  {
    level: "Medium Risk",
    color: "yellow",
    price: "$6-10",
    activities: [
      "Spinning classes",
      "CrossFit",
      "Group fitness",
      "Personal training",
      "Boot camps"
    ]
  },
  {
    level: "High Risk",
    color: "red",
    price: "$11-15",
    activities: [
      "Rock climbing",
      "Martial arts",
      "Adventure sports",
      "Contact sports",
      "Extreme workouts"
    ]
  }
]

const purchaseSteps = [
  {
    title: "Member Selects Activity",
    description: "During booking, members see available insurance options for their activity type. Coverage details and pricing are displayed clearly.",
    icon: Calendar
  },
  {
    title: "Choose Coverage Level",
    description: "Members select Basic, Standard, or Premium coverage based on their needs and activity risk level. All terms are transparent.",
    icon: Shield
  },
  {
    title: "Instant Coverage",
    description: "Upon payment, coverage is active immediately. Members receive a digital certificate via email with policy details and claims information.",
    icon: CheckCircle
  }
]

const realScenarios = [
  {
    scenario: "Yoga Class Injury",
    activity: "Hot Yoga Session",
    coverage: "Basic",
    incident: "Member slipped on mat and sprained ankle",
    covered: [
      "ER visit: $800",
      "X-rays: $400",
      "Follow-up visit: $200",
      "Total paid: $1,400"
    ],
    outcome: "Claim approved in 3 days, member reimbursed fully"
  },
  {
    scenario: "CrossFit Accident",
    activity: "CrossFit Class",
    coverage: "Standard",
    incident: "Member dropped weight, fractured foot",
    covered: [
      "ER visit: $1,200",
      "CT scan: $900",
      "Orthopedic specialist: $500",
      "Boot & crutches: $300",
      "3 follow-up visits: $600",
      "Total paid: $3,500"
    ],
    outcome: "Claim approved same day, expedited reimbursement"
  },
  {
    scenario: "Rock Climbing Fall",
    activity: "Indoor Climbing",
    coverage: "Premium",
    incident: "Member fell, multiple injuries requiring surgery",
    covered: [
      "Emergency surgery: $12,000",
      "3-day hospital stay: $8,000",
      "Anesthesia: $2,000",
      "Physical therapy (12 sessions): $1,800",
      "Medications: $400",
      "Total paid: $24,200"
    ],
    outcome: "Priority claim processing, approved within hours"
  }
]

export default function EventInsurancePage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/support-hub/products" },
          { label: "Event Insurance" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-teal-600 font-semibold text-sm mb-6">
          <Calendar className="w-4 h-4" />
          Per-Activity Coverage
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Event Insurance
          <span className="block mt-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Protection Per Activity
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Single-event coverage that protects your members during classes, workouts, and activities.
          Instant activation, zero hassle claims, and peace of mind for every participant.
        </p>
      </motion.div>

      {/* Coverage Tiers */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your Coverage Level
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Three tiers designed for different activity types and risk levels
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {coverageTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                variant={tier.popular ? "featured" : "default"}
                className="h-full"
              >
                <div className="p-8">
                  {tier.popular && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-semibold mb-4">
                      <TrendingUp className="w-4 h-4" />
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-teal-600">
                      {tier.price}
                    </span>
                    <span className="text-slate-600">per event</span>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-xl mb-6">
                    <div className="text-sm text-teal-700 font-semibold mb-1">
                      Coverage Limit
                    </div>
                    <div className="text-2xl font-bold text-teal-900">
                      {tier.coverage}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-slate-600 mb-2">
                      Best For
                    </div>
                    <div className="text-slate-900 font-medium">
                      {tier.best}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
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

      {/* Activity Risk Levels */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Pricing by Activity Risk
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Insurance cost is automatically calculated based on activity type and risk level
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {activityRiskLevels.map((risk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${risk.color}-100 text-${risk.color}-700 text-sm font-semibold mb-4`}>
                    <Activity className="w-4 h-4" />
                    {risk.level}
                  </div>

                  <div className="text-2xl font-bold text-slate-900 mb-4">
                    {risk.price}
                  </div>

                  <h4 className="text-sm font-semibold text-slate-600 mb-3">
                    Example Activities
                  </h4>

                  <ul className="space-y-2">
                    {risk.activities.map((activity, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* How It Works */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            How Members Purchase Coverage
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Seamless integration into your booking flow
          </p>
        </motion.div>

        <StepByStep steps={purchaseSteps} />
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
            Real Coverage Scenarios
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See how different coverage levels protect members in real incidents
          </p>
        </motion.div>

        <div className="space-y-6">
          {realScenarios.map((scenario, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
                        {scenario.coverage} Coverage
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {scenario.scenario}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600 mb-4">
                        <Calendar className="w-4 h-4" />
                        {scenario.activity}
                      </div>
                      <p className="text-slate-700 font-medium mb-6">
                        {scenario.incident}
                      </p>
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex items-center gap-2 text-green-700 font-semibold">
                          <CheckCircle className="w-5 h-5" />
                          {scenario.outcome}
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-2/3">
                      <h4 className="font-bold text-slate-900 mb-4">
                        Coverage Breakdown
                      </h4>
                      <div className="space-y-3">
                        {scenario.covered.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 bg-white/50 rounded-xl"
                          >
                            <span className="text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What's Covered / Not Covered */}
      <section>
        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-slate-900">
                  What's Covered
                </h2>
              </div>

              <ul className="space-y-4">
                {[
                  "Accidental injuries during the event",
                  "Emergency medical treatment",
                  "Ambulance and transportation costs",
                  "Hospital emergency room visits",
                  "X-rays, CT scans, and diagnostic tests",
                  "Prescriptions related to the injury",
                  "Follow-up medical care",
                  "Physical therapy sessions",
                  "Specialist consultations",
                  "Medical equipment (crutches, braces)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl font-bold text-slate-900">
                  Not Covered
                </h2>
              </div>

              <ul className="space-y-4">
                {[
                  "Pre-existing medical conditions",
                  "Injuries from intoxication or drug use",
                  "Intentional self-harm",
                  "Injuries occurring outside event time",
                  "Activities outside the covered event",
                  "Cosmetic procedures",
                  "Routine medical care",
                  "Dental work (unless injury-related)",
                  "Mental health treatment",
                  "Chronic condition management"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Protect Your Members?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Integrate event insurance into your booking flow in minutes
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/support-hub/integrations">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <FileText className="w-10 h-10 text-teal-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Integration Guide
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Add insurance to your platform
                  </p>
                  <div className="flex items-center justify-center text-teal-600 font-semibold">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/products/pricing">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <DollarSign className="w-10 h-10 text-teal-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Pricing Details
                  </h3>
                  <p className="text-slate-600 mb-4">
                    See commission structure
                  </p>
                  <div className="flex items-center justify-center text-teal-600 font-semibold">
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
                  <Shield className="w-10 h-10 text-teal-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Claims Process
                  </h3>
                  <p className="text-slate-600 mb-4">
                    How claims work
                  </p>
                  <div className="flex items-center justify-center text-teal-600 font-semibold">
                    Learn More
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
