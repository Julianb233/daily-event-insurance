"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { CreditCard, AlertCircle, CheckCircle, XCircle, DollarSign, RefreshCw } from "lucide-react"

const paymentIssues = [
  {
    issue: "Payment Declined",
    causes: ["Insufficient funds", "Card expired", "Incorrect CVV", "Bank blocking transaction"],
    solutions: ["Verify card details are correct", "Try alternative payment method", "Contact bank to authorize transaction", "Use different card"]
  },
  {
    issue: "Missing Commission Payments",
    causes: ["Below minimum payout threshold", "Bank details incorrect", "Payout schedule not met"],
    solutions: ["Check payout threshold ($10 minimum)", "Verify bank account information", "Review payout schedule (15th of month)", "Check dashboard for pending payments"]
  },
  {
    issue: "Refund Not Processing",
    causes: ["Original payment method no longer valid", "Processing delay", "Insufficient policy period"],
    solutions: ["Allow 5-7 business days for refund", "Check refund status in dashboard", "Verify cancellation meets policy terms", "Contact support if over 7 days"]
  },
  {
    issue: "Incorrect Billing Amount",
    causes: ["Tax calculation error", "Promo code not applied", "Currency conversion issue"],
    solutions: ["Review itemized receipt", "Verify tax rates for location", "Check promo code validity", "Contact billing support for adjustment"]
  }
]

export default function PaymentIssuesPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs items={[{ label: "Troubleshooting", href: "/support-hub/troubleshooting" }, { label: "Payment Issues" }]} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-green-600 font-semibold text-sm mb-6">
          <CreditCard className="w-4 h-4" />
          Payment Help
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Payment Issues
          <span className="block mt-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Billing & Transactions</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Resolve payment declines, commission issues, refunds, and billing problems
        </p>
      </motion.div>

      <section className="space-y-6">
        {paymentIssues.map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
            <GlassCard>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">{item.issue}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <h4 className="flex items-center gap-2 font-bold text-red-800 mb-3">
                      <XCircle className="w-5 h-5" />Common Causes
                    </h4>
                    <ul className="space-y-2">
                      {item.causes.map((cause, i) => (
                        <li key={i} className="flex items-start gap-2 text-red-700 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />{cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                    <h4 className="flex items-center gap-2 font-bold text-green-800 mb-3">
                      <CheckCircle className="w-5 h-5" />Solutions
                    </h4>
                    <ul className="space-y-2">
                      {item.solutions.map((solution, i) => (
                        <li key={i} className="flex items-start gap-2 text-green-700 text-sm">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </section>

      <GlassCard variant="featured">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-slate-900">Payment Processing Times</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-white/50 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Instant</div>
              <div className="text-sm text-slate-600">Policy purchase processing</div>
            </div>
            <div className="p-4 bg-white/50 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">5-7 days</div>
              <div className="text-sm text-slate-600">Refund to original payment</div>
            </div>
            <div className="p-4 bg-white/50 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Monthly</div>
              <div className="text-sm text-slate-600">Commission payouts (15th)</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
