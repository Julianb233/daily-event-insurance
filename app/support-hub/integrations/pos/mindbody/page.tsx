"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { CodeBlock } from "@/components/support-hub/CodeBlock"
import {
  CheckCircle2,
  AlertCircle,
  Settings,
  Heart,
  Calendar,
  Users,
  Shield
} from "lucide-react"

const setupSteps = [
  {
    title: "Enable API Access",
    description: "Activate API access in your Mindbody account settings",
    icon: Settings
  },
  {
    title: "Get Credentials",
    description: "Obtain your API key and site ID from Mindbody",
    icon: Shield
  },
  {
    title: "Configure DEI",
    description: "Enter credentials in Daily Event Insurance dashboard",
    icon: Settings
  },
  {
    title: "Map Services",
    description: "Select which classes and events trigger insurance",
    icon: Calendar
  }
]

const features = [
  {
    title: "Class Integration",
    description: "Offer insurance for workshops, seminars, and special classes automatically"
  },
  {
    title: "Member Management",
    description: "Track insurance coverage status in Mindbody member profiles"
  },
  {
    title: "Workshop Coverage",
    description: "Automatically generate quotes for workshops and events"
  },
  {
    title: "Payment Processing",
    description: "Insurance premiums process seamlessly through Mindbody checkout"
  },
  {
    title: "Enrollment Sync",
    description: "Insurance status syncs with class enrollments in real-time"
  },
  {
    title: "Multi-Location",
    description: "Support for businesses with multiple studio locations"
  }
]

const configExample = `{
  "mindbody_integration": {
    "enabled": true,
    "site_id": "12345",
    "api_key": "mb_api_key_abc123",
    "environment": "production",
    "auto_quote": {
      "enabled": true,
      "class_types": [
        "workshop",
        "event",
        "seminar",
        "retreat",
        "special_class"
      ],
      "minimum_price": 300,
      "minimum_duration": 120
    },
    "member_sync": {
      "enabled": true,
      "sync_on_enrollment": true,
      "fields": ["name", "email", "phone", "emergency_contact"]
    },
    "coverage_rules": {
      "workshops": {
        "default_coverage": 50000,
        "liability_included": true
      },
      "retreats": {
        "default_coverage": 100000,
        "liability_included": true,
        "cancellation_included": true
      }
    }
  }
}`

const apiExample = `// Mindbody Integration Handler
const mindbodyConfig = {
  siteId: process.env.MINDBODY_SITE_ID,
  apiKey: process.env.MINDBODY_API_KEY,
  webhookUrl: "https://api.dailyeventinsurance.com/webhooks/mindbody"
}

// Handle class enrollment
mindbody.on('class.enrolled', async (enrollment) => {
  const classInfo = await mindbody.getClass(enrollment.class_id)

  // Check if this class type requires insurance
  if (shouldOfferInsurance(classInfo)) {
    const quote = await dailyEventInsurance.createQuote({
      clientId: enrollment.client_id,
      eventType: classInfo.type,
      eventDate: classInfo.start_datetime,
      participants: classInfo.max_capacity,
      eventName: classInfo.name,
      coverageAmount: getCoverageAmount(classInfo.type)
    })

    // Add insurance offer to enrollment
    await mindbody.addClientNote(enrollment.client_id, {
      note: \`Insurance available for \${classInfo.name}: $\${quote.premium}\`,
      quoteId: quote.id,
      expiresAt: classInfo.start_datetime
    })
  }
})

// Determine if insurance should be offered
function shouldOfferInsurance(classInfo) {
  const insurableTypes = ['workshop', 'event', 'seminar', 'retreat']
  return insurableTypes.includes(classInfo.type) &&
         classInfo.price >= 300 &&
         classInfo.duration >= 120
}

// Get coverage amount based on event type
function getCoverageAmount(eventType) {
  const coverageMap = {
    'workshop': 50000,
    'retreat': 100000,
    'seminar': 50000,
    'event': 75000
  }
  return coverageMap[eventType] || 50000
}`

const webhookExample = `{
  "event_type": "class.enrolled",
  "site_id": "12345",
  "timestamp": "2026-06-15T14:30:00Z",
  "data": {
    "enrollment_id": "enroll_789",
    "class_id": "class_456",
    "class_name": "Wellness Workshop",
    "class_type": "workshop",
    "start_datetime": "2026-07-01T09:00:00Z",
    "duration_minutes": 180,
    "price": 450.00,
    "client": {
      "id": "client_123",
      "name": "Sarah Johnson",
      "email": "sarah@example.com",
      "phone": "+1-555-0123"
    },
    "location": {
      "id": "loc_001",
      "name": "Downtown Studio"
    }
  }
}`

export default function MindbodyIntegrationPage() {
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
              { label: "Mindbody" }
            ]}
          />

          <div className="mt-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-white font-bold text-2xl">
                M
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Mindbody Integration
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  Setup time: 20 minutes • Difficulty: Moderate
                </p>
              </div>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl">
              Offer insurance coverage for wellness events and classes
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
                  1. Enable API Access in Mindbody
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Log in to Mindbody Business as the site owner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Navigate to Settings → Business → API Credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Enable "API Access" if not already enabled</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Note your Site ID (found in business info)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  2. Generate API Key
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Click "Create API Key" in the API Credentials section</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Name it "Daily Event Insurance Integration"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Select all necessary permissions (Classes, Clients, Sales)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Copy and securely store the generated API key</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  3. Connect to Daily Event Insurance
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Log in to your Daily Event Insurance dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Navigate to Settings → Integrations → Mindbody</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Enter your Mindbody Site ID and API Key</span>
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
                  4. Configure Integration Settings
                </h3>
                <p className="text-slate-600 mb-4">
                  Customize which Mindbody classes trigger insurance quotes:
                </p>
                <CodeBlock
                  language="json"
                  filename="mindbody-config.json"
                  code={configExample}
                />
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
              Example code for handling Mindbody webhooks and creating insurance quotes:
            </p>
            <CodeBlock
              language="javascript"
              filename="mindbody-integration.js"
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
              Mindbody Webhook Payload
            </h2>
            <p className="text-slate-600 mb-6">
              Example webhook data received from Mindbody when a client enrolls in a class:
            </p>
            <CodeBlock
              language="json"
              filename="mindbody-webhook.json"
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
                    <span>API access requires Mindbody Ultimate or higher subscription</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Insurance options appear as notes in client profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Staff can view insurance status in Mindbody client details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Multi-location support requires configuration per location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Client data respects Mindbody privacy and consent settings</span>
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
            <Heart className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Need Help with Mindbody Integration?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our team has extensive experience with wellness industry integrations
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
