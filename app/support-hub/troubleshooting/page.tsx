"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  Wrench,
  AlertTriangle,
  Code,
  CreditCard,
  Puzzle,
  Bug,
  Search,
  ArrowRight,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MessageSquare
} from "lucide-react"

const troubleshootingCategories = [
  {
    title: "Integration Issues",
    description: "API connection problems, authentication errors, and setup challenges",
    icon: Puzzle,
    color: "blue",
    href: "/support-hub/troubleshooting/integration-issues",
    commonIssues: [
      "API key not working",
      "Webhook delivery failures",
      "CORS errors",
      "Rate limiting"
    ]
  },
  {
    title: "Payment Issues",
    description: "Billing problems, failed transactions, and commission discrepancies",
    icon: CreditCard,
    color: "green",
    href: "/support-hub/troubleshooting/payment-issues",
    commonIssues: [
      "Payment declined",
      "Missing commissions",
      "Refund processing",
      "Billing errors"
    ]
  },
  {
    title: "API Errors",
    description: "Error codes, response issues, and API troubleshooting",
    icon: Code,
    color: "red",
    href: "/support-hub/troubleshooting/api-errors",
    commonIssues: [
      "400 Bad Request",
      "401 Unauthorized",
      "500 Server Error",
      "Timeout errors"
    ]
  },
  {
    title: "Widget Issues",
    description: "Embedded widget problems, display issues, and configuration",
    icon: Bug,
    color: "purple",
    href: "/support-hub/troubleshooting/widget-issues",
    commonIssues: [
      "Widget not loading",
      "Styling conflicts",
      "Mobile display",
      "Browser compatibility"
    ]
  },
  {
    title: "Common Errors",
    description: "Frequently encountered errors and quick fixes",
    icon: AlertTriangle,
    color: "orange",
    href: "/support-hub/troubleshooting/common-errors",
    commonIssues: [
      "Data validation",
      "Policy creation failed",
      "Member lookup errors",
      "Coverage not available"
    ]
  }
]

const quickFixes = [
  {
    problem: "API Key Not Working",
    solution: "Verify key is active, check environment (test vs. production), ensure proper header format",
    time: "< 5 min"
  },
  {
    problem: "Widget Not Displaying",
    solution: "Check script tag placement, verify domain whitelist, clear browser cache",
    time: "< 5 min"
  },
  {
    problem: "Payment Declined",
    solution: "Verify card details, check with member's bank, try alternative payment method",
    time: "< 10 min"
  },
  {
    problem: "Webhook Not Receiving Data",
    solution: "Verify endpoint URL, check SSL certificate, review webhook logs in dashboard",
    time: "< 15 min"
  },
  {
    problem: "Coverage Not Available",
    solution: "Check state licensing, verify activity type is supported, review coverage limits",
    time: "< 10 min"
  },
  {
    problem: "Integration Test Failing",
    solution: "Use test credentials, verify request payload format, check API version",
    time: "< 5 min"
  }
]

const supportChannels = [
  {
    channel: "Live Chat",
    icon: MessageSquare,
    availability: "24/7",
    responseTime: "< 2 minutes",
    bestFor: "Urgent issues, quick questions"
  },
  {
    channel: "Email Support",
    icon: Mail,
    availability: "24/7",
    responseTime: "< 4 hours",
    bestFor: "Detailed issues, documentation requests"
  },
  {
    channel: "Phone Support",
    icon: Phone,
    availability: "Mon-Fri 6am-6pm PT",
    responseTime: "Immediate",
    bestFor: "Critical issues, integration help"
  },
  {
    channel: "Developer Forum",
    icon: Code,
    availability: "24/7",
    responseTime: "< 24 hours",
    bestFor: "Code examples, community help"
  }
]

const troubleshootingTips = [
  "Always check the status page first for known issues",
  "Review API logs in your dashboard before contacting support",
  "Test in sandbox environment before deploying to production",
  "Keep your API client library up to date",
  "Enable debug mode for detailed error messages",
  "Check our GitHub repo for code examples and fixes",
  "Save error messages and request IDs for support tickets",
  "Join our developer Slack channel for community help"
]

export default function TroubleshootingPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Troubleshooting" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-600 font-semibold text-sm mb-6">
          <Wrench className="w-4 h-4" />
          Problem Solving
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Troubleshooting
          <span className="block mt-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Quick Fixes & Solutions
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Find solutions to common issues, error codes, and integration challenges.
          Most problems can be resolved in minutes with our guides.
        </p>
      </motion.div>

      {/* Troubleshooting Categories */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select the type of issue you're experiencing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {troubleshootingCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <GlassCard>
                  <div className="p-6 group hover:bg-white/50 transition-all">
                    <div className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-${category.color}-500 to-${category.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-${category.color}-600 transition-colors">
                      {category.title}
                    </h3>

                    <p className="text-slate-600 mb-4">
                      {category.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {category.commonIssues.map((issue, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-${category.color}-500" />
                          {issue}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-${category.color}-600 font-semibold">
                      View Solutions
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Fixes */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                Quick Fixes
              </h2>
            </div>

            <p className="text-lg text-slate-600 mb-6">
              Common problems with fast solutions
            </p>

            <div className="space-y-4">
              {quickFixes.map((fix, index) => (
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
                      <h3 className="font-bold text-slate-900 mb-2">{fix.problem}</h3>
                      <p className="text-sm text-slate-600">{fix.solution}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                      {fix.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Support Channels */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Need More Help?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our support team is here to help you resolve any issue
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {supportChannels.map((channel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <channel.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {channel.channel}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Availability</span>
                      <span className="text-sm font-semibold text-slate-900">{channel.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Response Time</span>
                      <span className="text-sm font-semibold text-green-600">{channel.responseTime}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <div className="text-xs text-slate-600 mb-1">Best For</div>
                      <div className="text-sm text-slate-900">{channel.bestFor}</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Troubleshooting Tips */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Search className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                Pro Troubleshooting Tips
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {troubleshootingTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-white/50 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{tip}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Status Page CTA */}
      <section>
        <GlassCard>
          <div className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Check System Status
            </h2>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Before troubleshooting, check if there are any known system-wide issues
            </p>
            <Link href="/support-hub/status">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                View Status Page
              </motion.button>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
