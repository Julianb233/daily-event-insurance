"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  DollarSign,
  TrendingUp,
  Percent,
  Calculator,
  CheckCircle,
  Calendar,
  Shield,
  Home,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Users,
  BarChart3
} from "lucide-react"

const pricingTiers = [
  {
    coverage: "Event Insurance",
    icon: Calendar,
    color: "teal",
    tiers: [
      { name: "Basic", premium: "$3-5", coverage: "$25,000", commission: "30%" },
      { name: "Standard", premium: "$6-10", coverage: "$50,000", commission: "35%" },
      { name: "Premium", premium: "$11-15", coverage: "$100,000", commission: "40%" }
    ]
  },
  {
    coverage: "Liability",
    icon: AlertTriangle,
    color: "orange",
    tiers: [
      { name: "General", premium: "$5-8", coverage: "$100,000", commission: "25%" },
      { name: "Standard", premium: "$10-15", coverage: "$500,000", commission: "30%" },
      { name: "Aggregate", premium: "$15-20", coverage: "$1,000,000", commission: "35%" }
    ]
  },
  {
    coverage: "Property",
    icon: Home,
    color: "blue",
    tiers: [
      { name: "Basic", premium: "$2-4", coverage: "$1,000", commission: "25%" },
      { name: "Standard", premium: "$5-8", coverage: "$5,000", commission: "30%" },
      { name: "Premium", premium: "$9-12", coverage: "$10,000+", commission: "35%" }
    ]
  },
  {
    coverage: "Cancellation",
    icon: XCircle,
    color: "purple",
    tiers: [
      { name: "Basic", premium: "$1-2", coverage: "50% refund", commission: "20%" },
      { name: "Standard", premium: "$3-4", coverage: "75% refund", commission: "25%" },
      { name: "Full", premium: "$5-7", coverage: "100% refund", commission: "30%" }
    ]
  }
]

const revenueCalculator = [
  {
    scenario: "Small Fitness Studio",
    activities: "500 classes/month",
    avgPremium: "$5",
    commission: "30%",
    monthlyRevenue: "$750",
    annualRevenue: "$9,000"
  },
  {
    scenario: "Medium Gym Chain",
    activities: "2,000 bookings/month",
    avgPremium: "$7",
    commission: "32%",
    monthlyRevenue: "$4,480",
    annualRevenue: "$53,760"
  },
  {
    scenario: "Large Adventure Company",
    activities: "5,000 activities/month",
    avgPremium: "$12",
    commission: "35%",
    monthlyRevenue: "$21,000",
    annualRevenue: "$252,000"
  },
  {
    scenario: "Equipment Rental Business",
    activities: "1,500 rentals/month",
    avgPremium: "$6",
    commission: "28%",
    monthlyRevenue: "$2,520",
    annualRevenue: "$30,240"
  }
]

const commissionStructure = [
  {
    volume: "0-500",
    rate: "25%",
    perks: ["Basic support", "Standard reporting"]
  },
  {
    volume: "501-2,000",
    rate: "30%",
    perks: ["Priority support", "Advanced analytics", "Custom branding"],
    popular: true
  },
  {
    volume: "2,001-5,000",
    rate: "35%",
    perks: ["Dedicated account manager", "API priority", "Revenue insights", "Co-marketing"]
  },
  {
    volume: "5,001+",
    rate: "40%",
    perks: ["Enterprise support", "Custom pricing", "White-label options", "Premium features"]
  }
]

const pricingFactors = [
  {
    factor: "Activity Risk Level",
    impact: "High",
    description: "Higher-risk activities (climbing, contact sports) cost more than low-risk (yoga, walking)"
  },
  {
    factor: "Coverage Amount",
    impact: "High",
    description: "Higher coverage limits increase premium costs proportionally"
  },
  {
    factor: "Participant Age",
    impact: "Medium",
    description: "Participants over 65 may have slightly higher premiums"
  },
  {
    factor: "Location",
    impact: "Medium",
    description: "State regulations and risk profiles affect pricing"
  },
  {
    factor: "Claims History",
    impact: "Low",
    description: "Your business claims history may affect future pricing"
  },
  {
    factor: "Volume Discounts",
    impact: "High",
    description: "Higher monthly volumes unlock better commission rates"
  }
]

const paymentTerms = [
  {
    term: "Payment Timing",
    details: "Premiums collected at booking time, held in escrow until event completion"
  },
  {
    term: "Commission Payout",
    details: "Monthly payout on 15th of following month for previous month's policies"
  },
  {
    term: "Minimum Payout",
    details: "No minimum - payouts processed for any amount over $10"
  },
  {
    term: "Payment Method",
    details: "Direct deposit (ACH) or wire transfer to business bank account"
  },
  {
    term: "Refund Handling",
    details: "Refunded premiums deducted from next commission payment"
  },
  {
    term: "Reporting",
    details: "Real-time dashboard with daily updates and monthly statements"
  }
]

export default function PricingPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/support-hub/products" },
          { label: "Pricing & Revenue" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-green-600 font-semibold text-sm mb-6">
          <DollarSign className="w-4 h-4" />
          Revenue Model
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Pricing & Commission
          <span className="block mt-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Structure
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Transparent pricing with generous commission rates. The more you grow, the more you earn.
          Build a new revenue stream while protecting your members.
        </p>
      </motion.div>

      {/* Pricing by Coverage Type */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Premium Pricing by Coverage Type
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            What members pay and what you earn on each policy type
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {pricingTiers.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${product.color}-500 to-${product.color}-600 flex items-center justify-center`}>
                      <product.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {product.coverage}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {product.tiers.map((tier, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white/50 rounded-xl border border-white/40"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-slate-900">{tier.name}</span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            {tier.commission} Commission
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-slate-600 mb-1">Member Pays</div>
                            <div className="text-lg font-bold text-slate-900">{tier.premium}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600 mb-1">Coverage</div>
                            <div className="text-lg font-bold text-slate-900">{tier.coverage}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Revenue Calculator */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-slate-900">
                  Revenue Potential Calculator
                </h2>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Real examples of revenue potential based on business size
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {revenueCalculator.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {example.scenario}
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Monthly Volume</span>
                      <span className="font-semibold text-slate-900">{example.activities}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Avg Premium</span>
                      <span className="font-semibold text-slate-900">{example.avgPremium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Commission Rate</span>
                      <span className="font-semibold text-slate-900">{example.commission}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Monthly Revenue</span>
                      <span className="text-xl font-bold text-green-600">{example.monthlyRevenue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Annual Revenue</span>
                      <span className="text-2xl font-bold text-green-600">{example.annualRevenue}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Commission Structure */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Volume-Based Commission Tiers
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Earn higher commission rates as your monthly policy volume grows
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {commissionStructure.map((tier, index) => (
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
                <div className="p-6">
                  {tier.popular && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold mb-4">
                      <TrendingUp className="w-4 h-4" />
                      Popular
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="text-sm text-slate-600 mb-1">Monthly Policies</div>
                    <div className="text-2xl font-bold text-slate-900">{tier.volume}</div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-slate-600 mb-1">Commission Rate</div>
                    <div className="text-4xl font-bold text-green-600">{tier.rate}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-600 mb-3">Perks Included</div>
                    <ul className="space-y-2">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{perk}</span>
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

      {/* Pricing Factors */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                What Affects Premium Pricing
              </h2>
            </div>

            <div className="space-y-4">
              {pricingFactors.map((factor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-900">{factor.factor}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          factor.impact === "High" ? "bg-red-100 text-red-700" :
                          factor.impact === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {factor.impact} Impact
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{factor.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Payment Terms */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                Payment Terms & Conditions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {paymentTerms.map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/50 rounded-xl border border-white/40"
                >
                  <h3 className="font-bold text-slate-900 mb-2">{term.term}</h3>
                  <p className="text-sm text-slate-600">{term.details}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* CTA Section */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses generating revenue with insurance commissions
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link href="/support-hub/integrations">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                </motion.button>
              </Link>

              <Link href="/support-hub/business/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl border-2 border-green-500 hover:bg-green-50 transition-all"
                >
                  View Dashboard
                </motion.button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-white/30 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">25-40%</div>
                <div className="text-sm text-slate-600">Commission Range</div>
              </div>
              <div className="p-4 bg-white/30 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">$0</div>
                <div className="text-sm text-slate-600">Setup Fees</div>
              </div>
              <div className="p-4 bg-white/30 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">Monthly</div>
                <div className="text-sm text-slate-600">Payouts</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
