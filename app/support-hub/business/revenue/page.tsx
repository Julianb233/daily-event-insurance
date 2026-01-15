"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  DollarSign,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle,
  Building2,
  Users,
  Percent,
  Calendar,
  PiggyBank,
  Wallet,
  Star
} from "lucide-react"

const commissionTiers = [
  {
    tier: "Starter",
    rate: "40%",
    requirement: "0-100 policies/month",
    features: ["Basic dashboard", "Monthly payouts", "Email support"],
    color: "slate"
  },
  {
    tier: "Growth",
    rate: "50%",
    requirement: "101-500 policies/month",
    features: ["Advanced analytics", "Priority support", "Custom branding"],
    color: "teal",
    popular: true
  },
  {
    tier: "Enterprise",
    rate: "60%",
    requirement: "500+ policies/month",
    features: ["Dedicated manager", "API access", "Multi-location", "Custom contracts"],
    color: "purple"
  }
]

const revenueStreams = [
  {
    title: "Policy Commissions",
    description: "Earn 40-60% of every insurance policy sold through your platform",
    icon: DollarSign,
    example: "$5 policy × 50% = $2.50 per sale"
  },
  {
    title: "Volume Bonuses",
    description: "Quarterly bonuses for exceeding policy targets",
    icon: Award,
    example: "Hit 500 policies = $500 bonus"
  },
  {
    title: "Referral Revenue",
    description: "Earn 5% of referred partner's commissions for 12 months",
    icon: Users,
    example: "Refer a gym earning $5k/year = $250/year for you"
  }
]

const payoutSchedule = [
  { date: "1st-31st", action: "Policies sold and tracked", status: "active" },
  { date: "1st-5th", action: "Monthly statement generated", status: "processing" },
  { date: "10th", action: "Statement available for review", status: "review" },
  { date: "15th", action: "Payout deposited to your account", status: "complete" }
]

const multiLocationPayouts = [
  {
    scenario: "Single Bank Account",
    description: "All location earnings combined into one monthly payout",
    bestFor: "Owner-operated businesses with shared accounting"
  },
  {
    scenario: "Location-Specific Payouts",
    description: "Each location receives its own separate payout to designated accounts",
    bestFor: "Franchises with independent location owners"
  },
  {
    scenario: "Split Payouts",
    description: "Corporate takes percentage, remainder goes to location managers",
    bestFor: "Enterprise with revenue-sharing arrangements"
  }
]

export default function RevenuePage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Business", href: "/support-hub/business" },
          { label: "Revenue & Commissions" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-teal-600 font-semibold text-sm mb-6">
          <DollarSign className="w-4 h-4" />
          Revenue Guide
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Maximize Your
          <span className="block mt-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Earnings
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Understand exactly how you earn, commission structures, payout schedules, and strategies
          to increase your insurance revenue.
        </p>
      </motion.div>

      {/* Commission Tiers */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Commission Tiers
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Higher volume = higher commissions. Tier upgrades are automatic.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {commissionTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover glow={tier.popular}>
                <div className="p-8 relative">
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs font-bold">
                        <Star className="w-3 h-3" /> Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.tier}</h3>
                    <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {tier.rate}
                    </div>
                    <p className="text-slate-600 mb-6">{tier.requirement}</p>
                    <ul className="space-y-3 text-left">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700">
                          <CheckCircle className="w-5 h-5 text-teal-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Revenue Streams */}
      <section>
        <GlassCard hover={false}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-8 h-8 text-teal-600" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Ways to Earn
                </h2>
                <p className="text-slate-600 mt-1">
                  Multiple revenue streams to maximize your income
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {revenueStreams.map((stream, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                    <stream.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{stream.title}</h3>
                  <p className="text-slate-600 mb-4">{stream.description}</p>
                  <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                    <p className="text-sm font-semibold text-teal-700">{stream.example}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Payout Schedule */}
      <section>
        <GlassCard hover={false}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-8 h-8 text-teal-600" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Payout Schedule
                </h2>
                <p className="text-slate-600 mt-1">
                  Predictable, reliable monthly payments
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-blue-500 hidden md:block" />
              <div className="space-y-6">
                {payoutSchedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-6"
                  >
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-white border-4 border-teal-500 items-center justify-center flex-shrink-0 z-10">
                      <span className="text-lg font-bold text-teal-600">{index + 1}</span>
                    </div>
                    <div className="flex-1 p-6 bg-white/50 rounded-xl border border-white/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-teal-600">{item.date}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === 'complete' ? 'bg-green-100 text-green-700' :
                          item.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          item.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-slate-700">{item.action}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Multi-Location Payouts */}
      <section>
        <GlassCard hover={false}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="w-8 h-8 text-teal-600" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Multi-Location Payout Options
                </h2>
                <p className="text-slate-600 mt-1">
                  Flexible payout routing for enterprise partners
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {multiLocationPayouts.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{option.scenario}</h3>
                  <p className="text-slate-600 mb-4">{option.description}</p>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700">
                      <strong>Best for:</strong> {option.bestFor}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
              <h3 className="font-bold text-slate-900 mb-2">Setting Up Location-Specific Payouts</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                <li>Navigate to <strong>Settings → Payment Configuration</strong> in your dashboard</li>
                <li>Click <strong>"Add Payout Account"</strong> for each location</li>
                <li>Enter the location manager's bank details and assign to specific location</li>
                <li>Set the revenue split percentage (if using split payouts)</li>
                <li>Each location manager can view their earnings in their location-specific dashboard</li>
              </ol>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Revenue Growth Tips */}
      <section>
        <GlassCard hover={false}>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Strategies to Increase Revenue
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Optimize Checkout Placement",
                  description: "Position insurance as a natural part of checkout. Partners who pre-select coverage see 40% higher conversion.",
                  impact: "+40% conversion"
                },
                {
                  title: "Train Your Staff",
                  description: "Staff who understand coverage benefits can answer questions and increase member confidence in purchasing.",
                  impact: "+25% sales"
                },
                {
                  title: "Bundle Coverage",
                  description: "Offer package deals that include insurance with memberships or class packages.",
                  impact: "+60% attachment"
                },
                {
                  title: "Leverage Seasonal Events",
                  description: "Promote coverage heavily during high-risk seasons (winter sports, summer adventure activities).",
                  impact: "+35% revenue"
                },
                {
                  title: "Email Reminders",
                  description: "Send reminder emails to members who booked without coverage. Many add it after reflection.",
                  impact: "+15% recovery"
                },
                {
                  title: "Display Social Proof",
                  description: "Show how many members have purchased coverage or successful claim stories.",
                  impact: "+20% trust"
                }
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-900">{tip.title}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                      {tip.impact}
                    </span>
                  </div>
                  <p className="text-slate-600">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Next Steps */}
      <section>
        <GlassCard hover={false}>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Related Resources
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/support-hub/business/billing">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <Wallet className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Billing & Payments
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Set up payment methods and manage billing
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/enterprise/multi-location">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <Building2 className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Multi-Location Setup
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Configure enterprise with multiple locations
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/business/reporting">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <TrendingUp className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Reports & Analytics
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Track performance and identify opportunities
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    View Reports
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
