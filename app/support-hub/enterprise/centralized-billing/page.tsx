"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  DollarSign,
  FileText,
  CreditCard,
  Building2,
  MapPin,
  TrendingUp,
  Calendar,
  CheckCircle,
  ArrowRight,
  Download,
  Mail,
  AlertCircle,
  PieChart,
  Wallet,
  Split
} from "lucide-react"

const billingFeatures = [
  {
    title: "Single Master Invoice",
    description: "One consolidated invoice for all locations and policies",
    icon: FileText,
    benefits: [
      "Simplified accounting",
      "One payment to track",
      "Combined fees and discounts",
      "Easy reconciliation"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Location-Level Detail",
    description: "Detailed breakdown by location within master invoice",
    icon: MapPin,
    benefits: [
      "Track each location's contribution",
      "Allocate costs internally",
      "Performance by location",
      "Transparent reporting"
    ],
    color: "from-teal-500 to-green-500"
  },
  {
    title: "Flexible Payout Routing",
    description: "Split revenue to locations or keep centralized",
    icon: Split,
    benefits: [
      "Corporate-controlled payouts",
      "Location-specific accounts",
      "Percentage-based splits",
      "Franchise-friendly options"
    ],
    color: "from-purple-500 to-pink-500"
  }
]

const invoiceStructure = [
  {
    section: "Invoice Summary",
    contents: [
      "Total policies sold across all locations",
      "Total premium collected",
      "Your commission (based on tier)",
      "Platform fees (if applicable)",
      "Net payout amount"
    ]
  },
  {
    section: "Location Breakdown",
    contents: [
      "Policies per location",
      "Revenue per location",
      "Commission per location",
      "Individual location performance"
    ]
  },
  {
    section: "Payment Details",
    contents: [
      "Invoice date and period",
      "Payment due date",
      "Payment method on file",
      "Payout routing configuration"
    ]
  }
]

const payoutOptions = [
  {
    name: "Consolidated Payout",
    description: "All earnings deposited to one corporate account",
    icon: Building2,
    example: {
      scenario: "3 locations earning $10,000 total",
      distribution: [
        { to: "Corporate Account", amount: "$10,000", percentage: "100%" }
      ]
    },
    bestFor: "Corporate-owned locations with shared accounting",
    setup: "Default option - one bank account receives all revenue"
  },
  {
    name: "Location-Specific Payouts",
    description: "Each location receives earnings directly",
    icon: MapPin,
    example: {
      scenario: "3 locations earning $10,000 total",
      distribution: [
        { to: "Location A", amount: "$4,000", percentage: "40%" },
        { to: "Location B", amount: "$3,500", percentage: "35%" },
        { to: "Location C", amount: "$2,500", percentage: "25%" }
      ]
    },
    bestFor: "Franchises with independent location owners",
    setup: "Each location manager provides their own bank details"
  },
  {
    name: "Split Payouts",
    description: "Corporate takes percentage, rest to locations",
    icon: PieChart,
    example: {
      scenario: "3 locations earning $10,000 total (20% to corporate)",
      distribution: [
        { to: "Corporate (20%)", amount: "$2,000", percentage: "20%" },
        { to: "Location A (32%)", amount: "$3,200", percentage: "32%" },
        { to: "Location B (28%)", amount: "$2,800", percentage: "28%" },
        { to: "Location C (20%)", amount: "$2,000", percentage: "20%" }
      ]
    },
    bestFor: "Revenue-sharing agreements, franchise fees",
    setup: "Set corporate percentage, remainder auto-distributed to locations"
  }
]

const billingSchedule = [
  {
    period: "1st - Last Day of Month",
    activity: "Policies sold and tracked in real-time",
    status: "active",
    description: "All insurance sales recorded throughout the month"
  },
  {
    period: "1st - 5th of Following Month",
    activity: "Invoice generation and calculation",
    status: "processing",
    description: "System calculates commissions, fees, and allocations"
  },
  {
    period: "5th of Month",
    activity: "Invoice available in dashboard",
    status: "review",
    description: "View and download invoice with location breakdown"
  },
  {
    period: "10th of Month",
    activity: "Payment processing begins",
    status: "payment",
    description: "Payouts initiated to configured accounts"
  },
  {
    period: "15th of Month",
    activity: "Funds deposited",
    status: "complete",
    description: "Revenue deposited to bank accounts (3-5 business days)"
  }
]

const setupSteps = [
  {
    step: 1,
    title: "Choose Payout Structure",
    instruction: "Decide on consolidated, location-specific, or split payouts",
    details: "This can be changed anytime, takes effect next billing cycle"
  },
  {
    step: 2,
    title: "Add Payment Methods",
    instruction: "Settings → Billing → Payment Accounts",
    details: "Add bank account(s) for ACH deposits (recommended for lowest fees)"
  },
  {
    step: 3,
    title: "Assign Accounts to Locations",
    instruction: "Link each location to its payout account (if using location-specific)",
    details: "Corporate account is default for all locations initially"
  },
  {
    step: 4,
    title: "Set Split Percentages",
    instruction: "Define corporate percentage if using split payouts",
    details: "Example: Corporate takes 20%, locations get remaining 80% based on performance"
  },
  {
    step: 5,
    title: "Configure Invoice Delivery",
    instruction: "Choose who receives monthly invoice emails",
    details: "Can send to corporate admin, location managers, or both"
  },
  {
    step: 6,
    title: "Review & Activate",
    instruction: "Confirm settings and activate billing configuration",
    details: "Changes take effect immediately for next billing period"
  }
]

const invoiceExample = {
  period: "November 2025",
  totalPolicies: 1247,
  totalPremiums: "$24,940.00",
  commissionRate: "50%",
  commissionEarned: "$12,470.00",
  platformFee: "$0.00",
  netPayout: "$12,470.00",
  locations: [
    { name: "Downtown Location", policies: 487, premium: "$9,740", commission: "$4,870" },
    { name: "Northside Location", policies: 398, premium: "$7,960", commission: "$3,980" },
    { name: "Westside Location", policies: 362, premium: "$7,240", commission: "$3,620" }
  ]
}

const faqItems = [
  {
    question: "Can I change payout structure mid-month?",
    answer: "Yes, but changes take effect the following billing period. For example, if you change from consolidated to location-specific on Nov 15th, November payouts still use consolidated, December uses the new structure."
  },
  {
    question: "How do I allocate fees between locations?",
    answer: "Platform fees (if any) are deducted from total commission before distribution. In split payouts, you can choose whether corporate absorbs all fees or they're deducted proportionally from each location."
  },
  {
    question: "What if a location's bank account is invalid?",
    answer: "We'll email the location manager to update banking details. The payout is held until corrected. Corporate admin can see pending payouts and resolve issues in the billing dashboard."
  },
  {
    question: "Can different locations have different payout schedules?",
    answer: "No, all locations follow the same monthly schedule (15th of month). However, you can configure immediate transfers for specific locations (Enterprise Custom plan)."
  },
  {
    question: "How are chargebacks handled?",
    answer: "Chargebacks are deducted from the location where the policy was sold. If using location-specific payouts, the chargeback is deducted from that location's next payout. Corporate admin receives chargeback notifications."
  },
  {
    question: "Do I get separate invoices for each location?",
    answer: "No, you receive one master invoice with a detailed breakdown by location. However, you can download location-specific reports that show just that location's activity."
  },
  {
    question: "What payment methods are supported for payouts?",
    answer: "ACH bank transfers (US), wire transfers (for $10k+ monthly volume), PayPal (with 2% fee), and checks (for Enterprise accounts only). ACH is recommended for lowest fees and fastest processing."
  }
]

export default function CentralizedBillingPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Enterprise", href: "/support-hub/enterprise" },
          { label: "Centralized Billing" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 text-green-600 font-semibold text-sm mb-6">
          <DollarSign className="w-4 h-4" />
          Enterprise Billing
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Simplified Billing
          <span className="block mt-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Across All Locations
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          One master invoice with location-level detail. Flexible payout routing to match
          your business structure. Transparent reporting for every stakeholder.
        </p>
      </motion.div>

      {/* Key Features */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Billing Features
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Enterprise billing designed for multi-location organizations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {billingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="h-full">
                <div className="p-8">
                  <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 mb-6">{feature.description}</p>

                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Invoice Structure */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Invoice Structure
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            What's included in your monthly invoice
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {invoiceStructure.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="h-full">
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">{section.section}</h3>
                  <ul className="space-y-3">
                    {section.contents.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Payout Options */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Payout Options
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Three flexible ways to route revenue to your organization
          </p>
        </motion.div>

        <div className="space-y-6">
          {payoutOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated">
                <div className="p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{option.name}</h3>
                      <p className="text-slate-600 mb-4">{option.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          Best for: {option.bestFor}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/50 rounded-xl border border-white/40">
                      <h4 className="font-bold text-slate-900 mb-4">Example Distribution</h4>
                      <p className="text-sm text-slate-600 mb-4">{option.example.scenario}</p>
                      <div className="space-y-3">
                        {option.example.distribution.map((dist, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-teal-50 rounded-lg border border-teal-100">
                            <span className="text-sm font-medium text-teal-900">{dist.to}</span>
                            <div className="text-right">
                              <div className="text-lg font-bold text-teal-700">{dist.amount}</div>
                              <div className="text-xs text-teal-600">{dist.percentage}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-white/50 rounded-xl border border-white/40">
                      <h4 className="font-bold text-slate-900 mb-4">Setup</h4>
                      <p className="text-slate-700">{option.setup}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Billing Schedule */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Monthly Billing Schedule
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Predictable timeline from sales to payout
          </p>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="p-8">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-blue-500 hidden md:block" />

              <div className="space-y-6">
                {billingSchedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-6"
                  >
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-white border-4 border-green-500 items-center justify-center flex-shrink-0 z-10">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>

                    <div className="flex-1 p-6 bg-white/50 rounded-xl border border-white/40">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">{item.period}</h4>
                          <p className="text-teal-600 font-semibold">{item.activity}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'complete' ? 'bg-green-100 text-green-700' :
                          item.status === 'payment' ? 'bg-purple-100 text-purple-700' :
                          item.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                          item.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Setup Steps */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Setting Up Billing
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Configure your enterprise billing in 6 simple steps
          </p>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="p-8">
            <div className="space-y-4">
              {setupSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-1">{step.title}</h4>
                      <p className="text-slate-700 mb-2">{step.instruction}</p>
                      <p className="text-sm text-slate-600 italic">{step.details}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Invoice Example */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Sample Invoice
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Example of your monthly enterprise invoice
          </p>
        </motion.div>

        <GlassCard variant="featured">
          <div className="p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-200">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">Monthly Invoice</h3>
                <p className="text-slate-600">Period: {invoiceExample.period}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            {/* Summary */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-white/50 rounded-lg border border-white/40">
                  <span className="text-slate-600">Total Policies:</span>
                  <span className="font-bold text-slate-900">{invoiceExample.totalPolicies}</span>
                </div>
                <div className="flex justify-between p-4 bg-white/50 rounded-lg border border-white/40">
                  <span className="text-slate-600">Total Premiums:</span>
                  <span className="font-bold text-slate-900">{invoiceExample.totalPremiums}</span>
                </div>
                <div className="flex justify-between p-4 bg-white/50 rounded-lg border border-white/40">
                  <span className="text-slate-600">Commission Rate:</span>
                  <span className="font-bold text-slate-900">{invoiceExample.commissionRate}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-white/50 rounded-lg border border-white/40">
                  <span className="text-slate-600">Commission Earned:</span>
                  <span className="font-bold text-green-600">{invoiceExample.commissionEarned}</span>
                </div>
                <div className="flex justify-between p-4 bg-white/50 rounded-lg border border-white/40">
                  <span className="text-slate-600">Platform Fee:</span>
                  <span className="font-bold text-slate-900">{invoiceExample.platformFee}</span>
                </div>
                <div className="flex justify-between p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border-2 border-teal-300">
                  <span className="text-slate-900 font-bold">Net Payout:</span>
                  <span className="font-bold text-2xl text-teal-600">{invoiceExample.netPayout}</span>
                </div>
              </div>
            </div>

            {/* Location Breakdown */}
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Location Breakdown</h4>
              <div className="space-y-3">
                {invoiceExample.locations.map((location, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-lg border border-white/40"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-teal-600" />
                        <span className="font-semibold text-slate-900">{location.name}</span>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-slate-600">Policies: </span>
                          <span className="font-semibold text-slate-900">{location.policies}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Premium: </span>
                          <span className="font-semibold text-slate-900">{location.premium}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Commission: </span>
                          <span className="font-semibold text-green-600">{location.commission}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* FAQs */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="p-8">
            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-slate-700 pl-7">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Related Resources */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Related Topics
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/support-hub/business/revenue">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <TrendingUp className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Revenue & Commissions
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Learn about commission tiers and rates
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    View Revenue
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
                    Configure locations and payout routing
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    Setup Locations
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/enterprise">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <Wallet className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Enterprise Features
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Explore all enterprise capabilities
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    View All
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
