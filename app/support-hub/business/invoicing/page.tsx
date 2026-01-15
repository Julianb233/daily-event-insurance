"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Receipt
} from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";
import { StepByStep } from "@/components/support-hub/StepByStep";

export default function InvoicingPage() {
  const invoiceBreakdown = [
    { label: "Total Premiums Collected", amount: "$12,450.00", change: "+15%" },
    { label: "Your Commission (25%)", amount: "$3,112.50", change: "+15%" },
    { label: "Processing Fees", amount: "-$62.25", change: "-" },
    { label: "Net Payout", amount: "$3,050.25", change: "+14%" }
  ];

  const taxDocuments = [
    {
      name: "Form 1099-MISC",
      description: "Annual earnings statement for tax filing",
      availability: "January (for previous year)",
      format: "PDF"
    },
    {
      name: "Monthly Statements",
      description: "Detailed transaction records",
      availability: "1st of each month",
      format: "PDF, CSV"
    },
    {
      name: "Year-End Summary",
      description: "Complete annual revenue report",
      availability: "Early January",
      format: "PDF"
    }
  ];

  const downloadSteps = [
    {
      title: "Access Invoice Center",
      description: "Navigate to Dashboard → Billing → Invoices"
    },
    {
      title: "Select Time Period",
      description: "Use the date picker to select month, quarter, or custom range"
    },
    {
      title: "Apply Filters (Optional)",
      description: "Filter by location, payment status, or transaction type"
    },
    {
      title: "Preview Invoice",
      description: "Click 'View Details' to preview before downloading"
    },
    {
      title: "Download",
      description: "Choose format (PDF for records, CSV for accounting software) and click Download"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { label: "Support Hub", href: "/support-hub" },
            { label: "Business", href: "/support-hub/business" },
            { label: "Invoicing" }
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Invoicing System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access monthly statements, download invoices, and manage tax documentation
          </p>
        </motion.div>

        {/* Monthly Statements Overview */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Receipt className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Monthly Statements</h2>
              <p className="text-gray-600 mt-1">Comprehensive breakdown of your revenue and payouts</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">December 2025 Statement</h3>
                  <p className="text-sm text-gray-600">Statement Period: Dec 1-31, 2025</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {invoiceBreakdown.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{item.amount}</p>
                      </div>
                      {item.change !== "-" && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          item.change.startsWith("+") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          <TrendingUp className="w-3 h-3" />
                          {item.change}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900">Paid on Jan 3, 2026</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium text-gray-900 mt-1">ACH - Bank ****4532</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Available</p>
                <p className="text-sm text-gray-600 mt-1">1st of each month</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Email Notification</p>
                <p className="text-sm text-gray-600 mt-1">Sent automatically</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Retention</p>
                <p className="text-sm text-gray-600 mt-1">7 years accessible</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Invoice Breakdown Details */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Understanding Your Invoice</h2>
              <p className="text-gray-600 mt-1">Detailed breakdown of charges and calculations</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Transaction Type</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Count</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Total Amount</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Your Commission</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">Event Coverage</p>
                        <p className="text-sm text-gray-600">Single-day policies</p>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">127</td>
                    <td className="text-right py-4 px-4 font-medium text-gray-900">$6,350.00</td>
                    <td className="text-right py-4 px-4 font-medium text-green-600">$1,587.50</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">Monthly Memberships</p>
                        <p className="text-sm text-gray-600">Recurring coverage</p>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">84</td>
                    <td className="text-right py-4 px-4 font-medium text-gray-900">$4,200.00</td>
                    <td className="text-right py-4 px-4 font-medium text-green-600">$1,050.00</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">Annual Plans</p>
                        <p className="text-sm text-gray-600">Full-year coverage</p>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700">19</td>
                    <td className="text-right py-4 px-4 font-medium text-gray-900">$1,900.00</td>
                    <td className="text-right py-4 px-4 font-medium text-green-600">$475.00</td>
                  </tr>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-4 px-4">Total</td>
                    <td className="text-right py-4 px-4">230</td>
                    <td className="text-right py-4 px-4 text-gray-900">$12,450.00</td>
                    <td className="text-right py-4 px-4 text-green-600">$3,112.50</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-4">Commission Structure</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Event Coverage</span>
                    <span className="font-semibold text-green-600">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Monthly Memberships</span>
                    <span className="font-semibold text-green-600">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Annual Plans</span>
                    <span className="font-semibold text-green-600">25%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4">Processing Fees</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Credit Card (2.9% + $0.30)</span>
                    <span className="font-semibold text-gray-900">$45.75</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">ACH ($0.50 per transaction)</span>
                    <span className="font-semibold text-gray-900">$16.50</span>
                  </div>
                  <div className="pt-3 border-t border-blue-300 flex justify-between items-center">
                    <span className="text-gray-700">Total Fees</span>
                    <span className="font-semibold text-red-600">$62.25</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Downloading Invoices */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Download className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Downloading Invoices</h2>
              <p className="text-gray-600 mt-1">Access and export your financial records</p>
            </div>
          </div>

          <StepByStep steps={downloadSteps} />

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4">PDF Format</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Professional formatting for records</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Includes company branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Easy to share with accountant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Suitable for tax filing</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4">CSV Format</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Import into QuickBooks, Xero, etc.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Line-by-line transaction detail</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Custom analysis in Excel</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Automated reconciliation</span>
                </li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Tax Documentation */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <FileText className="w-6 h-6 text-orange-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tax Documentation</h2>
              <p className="text-gray-600 mt-1">Annual tax forms and reporting</p>
            </div>
          </div>

          <div className="space-y-4">
            {taxDocuments.map((doc, index) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-white to-orange-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    <div className="flex gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-gray-500">Available: </span>
                        <span className="font-medium text-gray-900">{doc.availability}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Format: </span>
                        <span className="font-medium text-gray-900">{doc.format}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Tax Filing Reminder</p>
                <p className="text-sm text-yellow-800 mt-1">
                  Form 1099-MISC is issued if you earned $600 or more during the calendar year.
                  Keep all monthly statements for your records even if you don't receive a 1099.
                  Consult with your tax professional for specific filing requirements.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Invoice Management Tips */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-6">
            <Search className="w-6 h-6 text-teal-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Invoice Management Best Practices</h2>
              <p className="text-gray-600 mt-1">Tips for organized financial record-keeping</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
              <Filter className="w-8 h-8 text-teal-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-3">Organize by Location</h3>
              <p className="text-sm text-gray-700 mb-4">
                If you have multiple locations, download separate invoices for each
                to simplify accounting and track individual location performance.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Use location filters when downloading</li>
                <li>• Create separate folders per location</li>
                <li>• Track location-specific expenses</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <Calendar className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-3">Set Download Reminders</h3>
              <p className="text-sm text-gray-700 mb-4">
                Download invoices monthly even if you receive email notifications.
                Create a consistent filing system for easy access during tax season.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Set calendar reminder for 5th of month</li>
                <li>• Use consistent naming convention</li>
                <li>• Store backups in cloud storage</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <DollarSign className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-3">Reconcile Regularly</h3>
              <p className="text-sm text-gray-700 mb-4">
                Compare invoices against your bank deposits monthly to catch any
                discrepancies early and maintain accurate financial records.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Match invoice totals to deposits</li>
                <li>• Note any timing differences</li>
                <li>• Contact support for discrepancies</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <Mail className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-3">Share with Accountant</h3>
              <p className="text-sm text-gray-700 mb-4">
                Grant your accountant read-only access to your invoice portal, or
                set up automatic email forwarding for seamless tax preparation.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Add accountant as team member</li>
                <li>• Forward monthly email notifications</li>
                <li>• Provide year-end summary in January</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/support-hub/business/billing" className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">Payment Settings</p>
                  <p className="text-sm text-gray-600 mt-1">Manage payout methods</p>
                </div>
                <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            <a href="/support-hub/business/reporting" className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">View Reports</p>
                  <p className="text-sm text-gray-600 mt-1">Analytics & insights</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
