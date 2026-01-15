"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { CodeBlock } from "@/components/support-hub/CodeBlock"
import {
  CheckCircle2,
  AlertCircle,
  Settings,
  Zap,
  Shield,
  Link as LinkIcon,
  PlayCircle
} from "lucide-react"

const setupSteps = [
  {
    title: "Install Square Plugin",
    description: "Add the Daily Event Insurance plugin from Square App Marketplace",
    icon: PlayCircle
  },
  {
    title: "Connect Account",
    description: "Authorize the integration using your Daily Event Insurance credentials",
    icon: LinkIcon
  },
  {
    title: "Configure Settings",
    description: "Set up quote triggers and coverage options",
    icon: Settings
  },
  {
    title: "Test & Launch",
    description: "Process a test transaction to verify the integration",
    icon: Zap
  }
]

const features = [
  {
    title: "Automatic Quote Generation",
    description: "Insurance quotes are generated automatically based on transaction details"
  },
  {
    title: "Single Checkout Flow",
    description: "Customers can purchase insurance without leaving Square checkout"
  },
  {
    title: "Real-time Sync",
    description: "Transaction data syncs instantly with your insurance dashboard"
  },
  {
    title: "Custom Coverage Rules",
    description: "Set up rules to offer specific coverage based on event type or amount"
  },
  {
    title: "Payment Processing",
    description: "Insurance premiums are collected as part of the Square transaction"
  },
  {
    title: "Instant Policy Issuance",
    description: "Policies are issued immediately upon successful payment"
  }
]

const webhookExample = `{
  "event": "transaction.completed",
  "data": {
    "transaction_id": "sq_trans_abc123",
    "amount": 2500,
    "customer_email": "customer@example.com",
    "event_details": {
      "type": "wedding_reception",
      "date": "2026-06-15",
      "guests": 150,
      "venue": "Downtown Event Center"
    },
    "insurance_quote": {
      "quote_id": "DEI_QUOTE_789",
      "premium": 125.00,
      "coverage_amount": 100000,
      "selected": true
    }
  }
}`

const configExample = `{
  "square_integration": {
    "enabled": true,
    "environment": "production",
    "application_id": "sq_app_abc123",
    "location_id": "L1234567890",
    "auto_quote": {
      "enabled": true,
      "minimum_transaction": 500,
      "event_types": ["wedding", "reception", "party", "corporate"],
      "default_coverage": 100000
    },
    "checkout_display": {
      "show_as_addon": true,
      "position": "before_payment",
      "label": "Event Insurance Protection"
    },
    "webhook_url": "https://api.dailyeventinsurance.com/webhooks/square"
  }
}`

export default function SquareIntegrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs
            items={[
              { label: "Integrations", href: "/support-hub/integrations" },
              { label: "POS Systems", href: "/support-hub/integrations/pos" },
              { label: "Square" }
            ]}
          />

          <div className="mt-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-white font-bold text-2xl">
                S
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Square Integration
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  Setup time: 15 minutes • Difficulty: Easy
                </p>
              </div>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl">
              Seamlessly add event insurance to your Square checkout flow
            </p>
          </div>
        </motion.div>

        {/* Setup Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Quick Setup
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {setupSteps.map((step, index) => (
              <GlassCard key={step.title} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-sky-500 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <step.icon className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {step.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Detailed Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard variant="elevated" className="p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Step-by-Step Instructions
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  1. Install from Square App Marketplace
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Log in to your Square Dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Navigate to Apps → App Marketplace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Search for "Daily Event Insurance"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Click "Add to Square" and follow the installation prompts</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  2. Connect Your Daily Event Insurance Account
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>After installation, click "Connect Account"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Log in with your Daily Event Insurance credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Authorize Square to access your insurance account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Select the Square locations to enable insurance for</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  3. Configure Integration Settings
                </h3>
                <p className="text-slate-600 mb-4">
                  Set up your configuration using the Square app settings:
                </p>
                <CodeBlock
                  language="json"
                  filename="square-config.json"
                  code={configExample}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  4. Test the Integration
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Enable test mode in the app settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Process a test transaction using Square's test cards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Verify that insurance quote appears at checkout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Complete the test purchase and check your insurance dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Disable test mode when ready to go live</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Features & Capabilities
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
              <GlassCard key={feature.title} className="p-6">
                <CheckCircle2 className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Webhook Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard variant="elevated" className="p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Webhook Payload Example
            </h2>
            <p className="text-slate-600 mb-6">
              When a transaction with insurance is completed, Square sends this data:
            </p>
            <CodeBlock
              language="json"
              filename="webhook-payload.json"
              code={webhookExample}
            />
          </GlassCard>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard variant="featured" className="p-8 mb-12">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Important Notes
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Insurance premiums are collected as part of the Square transaction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Commission is automatically deposited to your account monthly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Customers receive policy documents via email immediately after purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Refunds must be processed through the Daily Event Insurance dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Multi-location businesses can configure settings per location</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GlassCard variant="elevated" className="p-8 text-center">
            <Shield className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Need Help with Setup?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our support team can help you configure your Square integration
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
              Contact Support
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
