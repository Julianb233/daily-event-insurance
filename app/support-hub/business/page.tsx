"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  DollarSign,
  CreditCard,
  FileText,
  BarChart3,
  LayoutDashboard,
  Users,
  TrendingUp,
  ArrowRight,
  Wallet,
  PiggyBank,
  Calendar,
  CheckCircle,
  Sparkles
} from "lucide-react"

const businessCategories = [
  {
    title: "Revenue & Commissions",
    description: "Understand how you earn money and commission structures",
    icon: DollarSign,
    href: "/support-hub/business/revenue",
    highlight: true
  },
  {
    title: "Billing & Payments",
    description: "Payment processing, schedules, and payout methods",
    icon: CreditCard,
    href: "/support-hub/business/billing"
  },
  {
    title: "Invoicing",
    description: "Generate, manage, and understand your invoices",
    icon: FileText,
    href: "/support-hub/business/invoicing"
  },
  {
    title: "Reports & Analytics",
    description: "Track performance, sales, and member engagement",
    icon: BarChart3,
    href: "/support-hub/business/reporting"
  },
  {
    title: "Partner Dashboard",
    description: "Navigate and use your partner dashboard effectively",
    icon: LayoutDashboard,
    href: "/support-hub/business/dashboard"
  },
  {
    title: "Team Management",
    description: "Add users, set permissions, and manage your team",
    icon: Users,
    href: "/support-hub/business/team"
  },
  {
    title: "Performance Metrics",
    description: "KPIs, benchmarks, and growth opportunities",
    icon: TrendingUp,
    href: "/support-hub/business/metrics"
  }
]

const revenueHighlights = [
  {
    metric: "Commission Rate",
    value: "40-60%",
    description: "Of every policy sold",
    icon: PiggyBank
  },
  {
    metric: "Payment Cycle",
    value: "Monthly",
    description: "Direct deposit on the 15th",
    icon: Calendar
  },
  {
    metric: "Min. Payout",
    value: "$50",
    description: "No maximum limit",
    icon: Wallet
  },
  {
    metric: "Partner Avg. Revenue",
    value: "$8,500/yr",
    description: "Mid-size facilities",
    icon: TrendingUp
  }
]

const howPaymentWorks = [
  {
    step: "1",
    title: "Member Purchases Coverage",
    description: "A member adds insurance at checkout. Payment is processed immediately."
  },
  {
    step: "2",
    title: "Commission Calculated",
    description: "Your share (40-60%) is calculated based on your tier and policy type."
  },
  {
    step: "3",
    title: "Earnings Accumulate",
    description: "All commissions are tracked in your dashboard throughout the month."
  },
  {
    step: "4",
    title: "Monthly Payout",
    description: "On the 15th, your total earnings are deposited to your bank account."
  }
]

const revenueExample = {
  monthlyMembers: 500,
  conversionRate: 0.30,
  avgPolicyPrice: 5.00,
  commissionRate: 0.50,
  policiesSold: 150,
  grossRevenue: 750,
  yourCommission: 375,
  annualProjection: 4500
}

export default function BusinessPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs items={[{ label: "Business Operations" }]} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-teal-600 font-semibold text-sm mb-6">
          <DollarSign className="w-4 h-4" />
          Business Operations
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          How You Get
          <span className="block mt-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Paid
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Transparent revenue sharing, predictable payments, and powerful tools to grow your
          insurance revenue. Learn how our partnership drives your business success.
        </p>
      </motion.div>

      {/* Revenue Highlights */}
      <div className="grid md:grid-cols-4 gap-6">
        {revenueHighlights.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover glow>
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-1">
                  {item.value}
                </div>
                <div className="font-bold text-slate-900 mb-1">{item.metric}</div>
                <div className="text-sm text-slate-600">{item.description}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* How Payment Works */}
      <section>
        <GlassCard hover={false}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Wallet className="w-8 h-8 text-teal-600" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  How You Get Paid
                </h2>
                <p className="text-slate-600 mt-1">
                  Simple, transparent payment process
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {howPaymentWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-teal-500 to-transparent z-0" />
                  )}
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Revenue Calculator Example */}
      <section>
        <GlassCard hover={false}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-8 h-8 text-teal-600" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Revenue Example
                </h2>
                <p className="text-slate-600 mt-1">
                  See how earnings add up for a typical partner
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="p-6 bg-slate-50 rounded-xl">
                <h3 className="font-bold text-slate-900 mb-4">Monthly Assumptions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Active Members</span>
                    <span className="font-semibold text-slate-900">{revenueExample.monthlyMembers}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Conversion Rate</span>
                    <span className="font-semibold text-slate-900">{(revenueExample.conversionRate * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Avg Policy Price</span>
                    <span className="font-semibold text-slate-900">${revenueExample.avgPolicyPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Your Commission Rate</span>
                    <span className="font-semibold text-slate-900">{(revenueExample.commissionRate * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border border-teal-100">
                <h3 className="font-bold text-slate-900 mb-4">Your Earnings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-teal-200">
                    <span className="text-slate-600">Policies Sold/Month</span>
                    <span className="font-semibold text-slate-900">{revenueExample.policiesSold}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-teal-200">
                    <span className="text-slate-600">Gross Revenue</span>
                    <span className="font-semibold text-slate-900">${revenueExample.grossRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-teal-200">
                    <span className="font-bold text-slate-900">Monthly Commission</span>
                    <span className="font-bold text-2xl text-teal-600">${revenueExample.yourCommission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-bold text-slate-900">Annual Projection</span>
                    <span className="font-bold text-3xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                      ${revenueExample.annualProjection.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a conservative example. Many partners see higher conversion rates (40-50%)
                as members recognize the value of coverage. Top-performing partners earn $15,000+ annually.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Business Categories */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Explore Business Resources
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to manage your partnership and maximize revenue
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessCategories.map((category, index) => (
            <Link key={index} href={category.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <GlassCard hover glow={category.highlight}>
                  <div className="p-6 group">
                    {category.highlight && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold mb-3">
                        <Sparkles className="w-3 h-3" />
                        Most Viewed
                      </div>
                    )}
                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-teal-600 font-semibold">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Facts */}
      <section>
        <GlassCard hover={false}>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Payment Quick Facts
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { q: "When do I get paid?", a: "Payments are processed on the 15th of each month for the previous month's earnings." },
                { q: "What payment methods are available?", a: "ACH direct deposit (US), wire transfer (international), or PayPal." },
                { q: "Is there a minimum payout?", a: "Yes, $50. If your balance is below this, it rolls over to the next month." },
                { q: "How do I track my earnings?", a: "Real-time tracking in your partner dashboard with detailed transaction history." },
                { q: "Can I increase my commission rate?", a: "Yes! Higher volume = higher tiers. Top partners earn 60% commission." },
                { q: "Are there any fees?", a: "No fees on your end. We handle all payment processing costs." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{item.q}</h3>
                      <p className="text-sm text-slate-600">{item.a}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* CTA */}
      <section>
        <GlassCard hover={false}>
          <div className="p-12 text-center bg-gradient-to-br from-teal-50/50 to-blue-50/50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <DollarSign className="w-16 h-16 mx-auto mb-6 text-teal-600" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Start Earning Today
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Join 1,200+ partners already generating passive income with Daily Event Insurance.
                Zero upfront costs, instant setup.
              </p>
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300"
              >
                Become a Partner
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
