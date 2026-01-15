"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { CodeBlock } from "@/components/support-hub/CodeBlock"
import {
  CheckCircle2,
  AlertCircle,
  Settings,
  Users,
  Calendar,
  RefreshCw,
  Shield
} from "lucide-react"

const setupSteps = [
  {
    title: "Generate API Token",
    description: "Create an API token in your Pike13 account settings",
    icon: Settings
  },
  {
    title: "Connect to DEI",
    description: "Enter your Pike13 API token in the Daily Event Insurance dashboard",
    icon: Shield
  },
  {
    title: "Map Event Types",
    description: "Configure which Pike13 services trigger insurance quotes",
    icon: Calendar
  },
  {
    title: "Enable Sync",
    description: "Activate automatic client data synchronization",
    icon: RefreshCw
  }
]

const features = [
  {
    title: "Event-Based Triggers",
    description: "Automatically offer insurance when clients book specific events or workshops"
  },
  {
    title: "Client Profile Sync",
    description: "Client information syncs automatically to pre-fill insurance applications"
  },
  {
    title: "Automated Renewals",
    description: "Set up recurring insurance for regular classes or membership events"
  },
  {
    title: "Booking Integration",
    description: "Insurance options appear during the booking checkout process"
  },
  {
    title: "Group Events",
    description: "Handle insurance for group classes and workshops automatically"
  },
  {
    title: "Member Management",
    description: "Track insurance coverage status in Pike13 member profiles"
  }
]

const apiExample = `// Pike13 API Integration
const pike13Config = {
  apiKey: process.env.PIKE13_API_KEY,
  subdomain: "your-business",
  webhookUrl: "https://api.dailyeventinsurance.com/webhooks/pike13"
}

// Event types that trigger insurance quotes
const insurableEvents = [
  "workshop",
  "special_event",
  "private_session",
  "group_class",
  "retreat"
]

// Auto-generate quote when booking is created
pike13.on('booking.created', async (booking) => {
  if (insurableEvents.includes(booking.service_type)) {
    const quote = await dailyEventInsurance.createQuote({
      clientId: booking.client_id,
      eventType: booking.service_type,
      eventDate: booking.start_time,
      participants: booking.attendees,
      eventName: booking.service_name
    })

    // Add insurance option to booking
    await pike13.addBookingNote(booking.id, {
      note: \`Insurance available: $\${quote.premium}\`,
      quoteId: quote.id
    })
  }
})`

const webhookExample = `{
  "event": "visit.completed",
  "webhook_id": "wh_abc123",
  "data": {
    "visit_id": "12345",
    "client_id": "67890",
    "client_name": "Jane Smith",
    "client_email": "jane@example.com",
    "service_name": "Yoga Workshop",
    "service_type": "workshop",
    "start_time": "2026-06-15T10:00:00Z",
    "attendees": 25,
    "price": 1500.00,
    "location": "Studio A"
  }
}`

const configExample = `{
  "pike13_integration": {
    "enabled": true,
    "subdomain": "your-business",
    "api_token": "pike13_token_abc123",
    "auto_quote": {
      "enabled": true,
      "service_types": [
        "workshop",
        "special_event",
        "retreat",
        "private_session"
      ],
      "minimum_price": 500,
      "minimum_attendees": 10
    },
    "client_sync": {
      "enabled": true,
      "sync_on_booking": true,
      "fields": ["name", "email", "phone", "address"]
    },
    "renewals": {
      "enabled": true,
      "renewal_types": ["monthly_membership", "annual_pass"],
      "days_before_expiry": 30
    }
  }
}`

export default function Pike13IntegrationPage() {
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
              { label: "Pike13" }
            ]}
          />

          <div className="mt-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-white font-bold text-2xl">
                P
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Pike13 Integration
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  Setup time: 20 minutes • Difficulty: Easy
                </p>
              </div>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl">
              Add insurance options to your fitness and wellness bookings
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
                  1. Generate Pike13 API Token
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Log in to your Pike13 account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Navigate to Settings → Integrations → API Access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Click "Generate New Token"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Name it "Daily Event Insurance" and enable all permissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Copy and save the token securely</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  2. Connect to Daily Event Insurance
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Log in to your Daily Event Insurance dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Go to Settings → Integrations → Pike13</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Enter your Pike13 API token and subdomain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Click "Test Connection" to verify</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Save the configuration</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  3. Configure Integration Settings
                </h3>
                <p className="text-slate-600 mb-4">
                  Customize which Pike13 services trigger insurance quotes:
                </p>
                <CodeBlock
                  language="json"
                  filename="pike13-config.json"
                  code={configExample}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  4. Map Event Types
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Select which Pike13 service types should offer insurance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Set minimum price or attendee thresholds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Configure default coverage amounts per service type</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Enable automatic renewal for recurring services</span>
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

        {/* API Integration Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard variant="elevated" className="p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              API Integration Example
            </h2>
            <p className="text-slate-600 mb-6">
              Example code for handling Pike13 webhooks and creating insurance quotes:
            </p>
            <CodeBlock
              language="javascript"
              filename="pike13-integration.js"
              code={apiExample}
            />
          </GlassCard>
        </motion.div>

        {/* Webhook Payload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard variant="elevated" className="p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Pike13 Webhook Payload
            </h2>
            <p className="text-slate-600 mb-6">
              Example webhook data received from Pike13 when a visit is completed:
            </p>
            <CodeBlock
              language="json"
              filename="pike13-webhook.json"
              code={webhookExample}
            />
          </GlassCard>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
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
                    <span>Client data syncs automatically but respects Pike13 privacy settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Insurance quotes appear as booking notes in Pike13</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Recurring bookings can automatically renew insurance coverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Staff can view client insurance status in Pike13 profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Multi-location businesses need to configure each location separately</span>
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
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <GlassCard variant="elevated" className="p-8 text-center">
            <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Need Help with Pike13 Integration?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our team specializes in fitness and wellness integrations
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
