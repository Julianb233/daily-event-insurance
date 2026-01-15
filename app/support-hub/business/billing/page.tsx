"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Building2,
  DollarSign,
  Calendar,
  History,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Settings,
  MapPin
} from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";
import { StepByStep } from "@/components/support-hub/StepByStep";

export default function BillingPage() {
  const paymentMethods = [
    {
      icon: Building2,
      name: "ACH Bank Transfer",
      description: "Direct bank transfer (US only)",
      setupTime: "2-3 business days",
      fees: "No fees",
      best: "High volume partners"
    },
    {
      icon: CreditCard,
      name: "Wire Transfer",
      description: "International bank transfer",
      setupTime: "1-2 business days",
      fees: "Bank fees may apply",
      best: "International partners"
    },
    {
      icon: DollarSign,
      name: "PayPal",
      description: "Fast digital payments",
      setupTime: "Instant",
      fees: "2.9% + $0.30 per transaction",
      best: "Quick setup needed"
    }
  ];

  const paymentSchedule = [
    {
      frequency: "Weekly",
      day: "Every Friday",
      cutoff: "Thursday 11:59 PM PST",
      minimum: "$100"
    },
    {
      frequency: "Bi-Weekly",
      day: "1st & 15th",
      cutoff: "Day before 11:59 PM PST",
      minimum: "$250"
    },
    {
      frequency: "Monthly",
      day: "1st of month",
      cutoff: "Last day 11:59 PM PST",
      minimum: "$500"
    }
  ];

  const achSetupSteps = [
    {
      title: "Navigate to Payment Settings",
      description: "Go to Dashboard → Settings → Billing & Payments"
    },
    {
      title: "Add Bank Account",
      description: "Click 'Add Payment Method' → Select 'Bank Account (ACH)'"
    },
    {
      title: "Enter Bank Details",
      description: "Provide routing number, account number, and account type (checking/savings)"
    },
    {
      title: "Verify Account",
      description: "We'll send two micro-deposits (< $1 each) within 1-2 business days"
    },
    {
      title: "Confirm Amounts",
      description: "Return to settings and enter the exact amounts to verify ownership"
    },
    {
      title: "Set as Default",
      description: "Once verified, set as your default payment method"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { label: "Support Hub", href: "/support-hub" },
            { label: "Business", href: "/support-hub/business" },
            { label: "Billing & Payments" }
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Billing & Payments
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage payment methods, schedule payouts, and track your revenue
          </p>
        </motion.div>

        {/* Payment Methods Overview */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
              <p className="text-gray-600 mt-1">Choose how you receive payouts</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all"
              >
                <method.icon className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{method.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Setup Time:</span>
                    <span className="font-medium text-gray-900">{method.setupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fees:</span>
                    <span className="font-medium text-gray-900">{method.fees}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-xs text-green-600 font-medium">Best for: {method.best}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* ACH Setup Guide */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Building2 className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Setting Up ACH Bank Transfer</h2>
              <p className="text-gray-600 mt-1">Recommended for US-based partners</p>
            </div>
          </div>

          <StepByStep steps={achSetupSteps} />

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Verification Tips</p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4 list-disc">
                  <li>Check your bank statement for deposits from "Daily Event Insurance"</li>
                  <li>Amounts are typically between $0.01 and $0.99</li>
                  <li>You have 7 days to verify before needing to restart</li>
                  <li>Contact support if you don't see deposits after 3 business days</li>
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Multi-Location Payout Routing */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <MapPin className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Multi-Location Payout Routing</h2>
              <p className="text-gray-600 mt-1">Configure different payment methods for each location</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Configuration</h3>

              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Downtown Studio</p>
                    <p className="text-sm text-gray-600">123 Main St, New York, NY</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">ACH - Bank ****4532</p>
                    <p className="text-xs text-gray-500">Weekly payouts</p>
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Brooklyn Branch</p>
                    <p className="text-sm text-gray-600">456 Park Ave, Brooklyn, NY</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">ACH - Bank ****7821</p>
                    <p className="text-xs text-gray-500">Bi-weekly payouts</p>
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Online Classes</p>
                    <p className="text-sm text-gray-600">Virtual location</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">PayPal - p***@email.com</p>
                    <p className="text-xs text-gray-500">Weekly payouts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                <p className="font-medium text-gray-900 mb-1">Benefits</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                  <li>Separate accounting per location</li>
                  <li>Independent payout schedules</li>
                  <li>Easier franchise management</li>
                  <li>Clear revenue attribution</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <Settings className="w-5 h-5 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900 mb-1">How to Configure</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                  <li>Go to Settings → Locations</li>
                  <li>Select location → Billing tab</li>
                  <li>Add location-specific payment method</li>
                  <li>Set payout schedule</li>
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Payment Schedule */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Calendar className="w-6 h-6 text-orange-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Schedule Options</h2>
              <p className="text-gray-600 mt-1">Choose your payout frequency</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Frequency</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment Day</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Cutoff Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Minimum Balance</th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedule.map((schedule, index) => (
                  <tr key={schedule.frequency} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{schedule.frequency}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{schedule.day}</td>
                    <td className="py-4 px-4 text-gray-700">{schedule.cutoff}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {schedule.minimum}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Payment Processing Notes</p>
                <ul className="text-sm text-yellow-800 mt-2 space-y-1 ml-4 list-disc">
                  <li>If balance is below minimum, funds roll over to next period</li>
                  <li>ACH transfers typically arrive within 2-3 business days</li>
                  <li>Wire transfers may take 1-2 business days</li>
                  <li>PayPal payments are usually instant</li>
                  <li>Holidays may delay processing by 1 business day</li>
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Transaction History */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <History className="w-6 h-6 text-indigo-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              <p className="text-gray-600 mt-1">Track all payments and transactions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 mb-6">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                All Transactions
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                Payouts
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                Refunds
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                Adjustments
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>

              <div className="space-y-3">
                {[
                  { date: "Jan 12, 2026", type: "Payout", amount: "$2,450.00", status: "Completed", method: "ACH ****4532" },
                  { date: "Jan 10, 2026", type: "Premium", amount: "$185.00", status: "Completed", method: "Member: Sarah J." },
                  { date: "Jan 9, 2026", type: "Premium", amount: "$95.00", status: "Completed", method: "Member: Mike T." },
                  { date: "Jan 8, 2026", type: "Refund", amount: "-$45.00", status: "Processed", method: "Cancelled policy" },
                  { date: "Jan 5, 2026", type: "Payout", amount: "$1,890.00", status: "Completed", method: "ACH ****4532" }
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "Payout" ? "bg-green-100" :
                        transaction.type === "Refund" ? "bg-red-100" : "bg-blue-100"
                      }`}>
                        {transaction.type === "Payout" ? (
                          <ArrowRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <DollarSign className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.type}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === "Refund" ? "text-red-600" : "text-green-600"
                      }`}>
                        {transaction.amount}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.method}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full py-3 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-200 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Export Transaction History
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/support-hub/business/invoicing" className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">View Invoices</p>
                  <p className="text-sm text-gray-600 mt-1">Download monthly statements</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            <a href="/support-hub/business/revenue" className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">Revenue Dashboard</p>
                  <p className="text-sm text-gray-600 mt-1">Track earnings & growth</p>
                </div>
                <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
