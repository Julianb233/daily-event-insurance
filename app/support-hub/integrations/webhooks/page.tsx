"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { CodeBlock } from "@/components/support-hub/CodeBlock"
import {
  Webhook,
  Zap,
  Shield,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock
} from "lucide-react"

const webhookEvents = [
  {
    event: "quote.created",
    description: "A new insurance quote has been generated",
    badge: "Common"
  },
  {
    event: "quote.expired",
    description: "A quote has expired without being purchased",
    badge: "Common"
  },
  {
    event: "policy.purchased",
    description: "A new policy has been successfully purchased",
    badge: "Critical"
  },
  {
    event: "policy.activated",
    description: "Policy coverage has become active",
    badge: "Important"
  },
  {
    event: "policy.expired",
    description: "Policy coverage has expired",
    badge: "Important"
  },
  {
    event: "policy.cancelled",
    description: "A policy has been cancelled",
    badge: "Important"
  },
  {
    event: "policy.updated",
    description: "Policy details have been modified",
    badge: "Common"
  },
  {
    event: "claim.submitted",
    description: "A new claim has been submitted",
    badge: "Critical"
  },
  {
    event: "claim.approved",
    description: "A claim has been approved for payment",
    badge: "Critical"
  },
  {
    event: "claim.denied",
    description: "A claim has been denied",
    badge: "Important"
  },
  {
    event: "payment.succeeded",
    description: "Payment has been successfully processed",
    badge: "Critical"
  },
  {
    event: "payment.failed",
    description: "Payment processing has failed",
    badge: "Critical"
  }
]

const setupExample = `// 1. Configure Webhook Endpoint in Dashboard
// Navigate to Settings → Webhooks → Add Endpoint

{
  "url": "https://your-site.com/api/webhooks/insurance",
  "events": [
    "policy.purchased",
    "policy.cancelled",
    "claim.submitted",
    "payment.succeeded"
  ],
  "secret": "whsec_abc123xyz789" // Auto-generated signing secret
}

// 2. Verify webhook signature for security
import crypto from 'crypto'

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// 3. Handle webhook in your API endpoint
export async function POST(request) {
  const payload = await request.text()
  const signature = request.headers.get('x-dei-signature')
  const secret = process.env.WEBHOOK_SECRET

  // Verify signature
  if (!verifyWebhookSignature(payload, signature, secret)) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(payload)

  // Process the event
  switch (event.type) {
    case 'policy.purchased':
      await handlePolicyPurchased(event.data)
      break
    case 'claim.submitted':
      await handleClaimSubmitted(event.data)
      break
    // ... handle other events
  }

  return new Response('Success', { status: 200 })
}`

const payloadExample = `// policy.purchased event payload
{
  "id": "evt_abc123xyz",
  "type": "policy.purchased",
  "created": "2026-06-15T14:35:00Z",
  "livemode": true,
  "data": {
    "policy": {
      "id": "pol_xyz789abc",
      "policy_number": "DEI-2026-08-001234",
      "status": "active",
      "premium": 245.00,
      "coverage_start": "2026-08-15T00:00:00Z",
      "coverage_end": "2026-08-16T05:59:59Z",
      "event": {
        "type": "wedding_reception",
        "date": "2026-08-15",
        "venue": "Grand Ballroom",
        "guests": 150
      },
      "coverage": {
        "general_liability": 1000000,
        "property_damage": 50000,
        "liquor_liability": true,
        "cancellation": true
      },
      "insured": {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1-555-0123"
      },
      "documents": {
        "certificate": "https://docs.dailyeventinsurance.com/cert/pol_xyz789abc.pdf",
        "policy": "https://docs.dailyeventinsurance.com/policy/pol_xyz789abc.pdf"
      }
    }
  }
}`

const claimExample = `// claim.submitted event payload
{
  "id": "evt_def456uvw",
  "type": "claim.submitted",
  "created": "2026-08-20T10:15:00Z",
  "livemode": true,
  "data": {
    "claim": {
      "id": "clm_789xyz123",
      "claim_number": "CLM-2026-001234",
      "status": "submitted",
      "policy_id": "pol_xyz789abc",
      "policy_number": "DEI-2026-08-001234",
      "amount_claimed": 15000.00,
      "incident_date": "2026-08-15",
      "incident_description": "Vendor cancellation due to emergency",
      "category": "cancellation",
      "submitted_by": {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1-555-0123"
      },
      "documents": [
        {
          "type": "receipt",
          "url": "https://claims.dailyeventinsurance.com/doc/abc123.pdf"
        },
        {
          "type": "vendor_cancellation",
          "url": "https://claims.dailyeventinsurance.com/doc/def456.pdf"
        }
      ],
      "submitted_at": "2026-08-20T10:15:00Z"
    }
  }
}`

const expressExample = `// Express.js webhook handler
const express = require('express')
const crypto = require('crypto')
const app = express()

// Use raw body for signature verification
app.post('/api/webhooks/insurance',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['x-dei-signature']
    const payload = req.body.toString()

    // Verify signature
    const expectedSig = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(payload)
      .digest('hex')

    if (signature !== expectedSig) {
      return res.status(401).send('Invalid signature')
    }

    const event = JSON.parse(payload)

    try {
      switch (event.type) {
        case 'policy.purchased':
          // Update your database
          await db.bookings.update({
            where: { id: event.data.policy.metadata.booking_id },
            data: {
              insurancePolicy: event.data.policy.policy_number,
              insuranceStatus: 'active'
            }
          })

          // Send confirmation email
          await sendEmail({
            to: event.data.policy.insured.email,
            subject: 'Insurance Coverage Confirmed',
            template: 'insurance-confirmation',
            data: event.data.policy
          })
          break

        case 'claim.submitted':
          // Notify admin team
          await notifyAdminTeam({
            type: 'new_claim',
            claimNumber: event.data.claim.claim_number,
            amount: event.data.claim.amount_claimed
          })
          break

        case 'payment.failed':
          // Handle failed payment
          await handlePaymentFailure(event.data.payment)
          break
      }

      res.status(200).send('Success')
    } catch (error) {
      console.error('Webhook processing error:', error)
      res.status(500).send('Internal server error')
    }
  }
)

app.listen(3000)`

const nextjsExample = `// Next.js API Route (app/api/webhooks/insurance/route.ts)
import { NextRequest } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const signature = request.headers.get('x-dei-signature')

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex')

  if (signature !== expectedSignature) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(payload)

  // Handle the event
  switch (event.type) {
    case 'policy.purchased':
      await handlePolicyPurchased(event.data.policy)
      break

    case 'claim.submitted':
      await handleClaimSubmitted(event.data.claim)
      break

    default:
      console.log(\`Unhandled event type: \${event.type}\`)
  }

  return new Response('Success', { status: 200 })
}

async function handlePolicyPurchased(policy: any) {
  // Update your database
  const booking = await prisma.booking.update({
    where: { id: policy.metadata.booking_id },
    data: {
      insurancePolicyId: policy.id,
      insurancePolicyNumber: policy.policy_number,
      insuranceStatus: 'active',
      insurancePremium: policy.premium
    }
  })

  // Send notifications
  await sendInsuranceConfirmation(booking, policy)
}

async function handleClaimSubmitted(claim: any) {
  // Create claim record in your system
  await prisma.claim.create({
    data: {
      claimId: claim.id,
      claimNumber: claim.claim_number,
      policyId: claim.policy_id,
      amount: claim.amount_claimed,
      status: claim.status,
      submittedAt: new Date(claim.submitted_at)
    }
  })

  // Notify admins
  await notifyAdminsOfNewClaim(claim)
}`

const retryPolicy = [
  {
    attempt: "1st",
    delay: "Immediate",
    description: "Initial delivery attempt"
  },
  {
    attempt: "2nd",
    delay: "1 minute",
    description: "First retry after failure"
  },
  {
    attempt: "3rd",
    delay: "5 minutes",
    description: "Second retry with backoff"
  },
  {
    attempt: "4th",
    delay: "30 minutes",
    description: "Third retry with longer delay"
  },
  {
    attempt: "5th",
    delay: "2 hours",
    description: "Fourth retry before giving up"
  },
  {
    attempt: "Final",
    delay: "24 hours",
    description: "Last attempt, then marked as failed"
  }
]

export default function WebhooksIntegrationPage() {
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
              { label: "Webhooks" }
            ]}
          />

          <div className="mt-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 text-white">
                <Webhook className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Webhooks
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  Real-time event notifications • Secure & Reliable
                </p>
              </div>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl">
              Receive instant notifications when important events occur in your insurance workflow
            </p>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <GlassCard className="p-6 text-center">
              <Zap className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">
                Real-time
              </h3>
              <p className="text-sm text-slate-600">
                Events delivered within seconds
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <Shield className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">
                Verified
              </h3>
              <p className="text-sm text-slate-600">
                HMAC signature verification
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <RefreshCw className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">
                Automatic Retry
              </h3>
              <p className="text-sm text-slate-600">
                Smart retry with backoff
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <Clock className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">
                Event History
              </h3>
              <p className="text-sm text-slate-600">
                30-day webhook log retention
              </p>
            </GlassCard>
          </div>
        </motion.div>

        {/* Available Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Available Events
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <div className="space-y-3">
              {webhookEvents.map((event) => (
                <div
                  key={event.event}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <code className="px-3 py-1.5 bg-slate-900 text-teal-400 rounded-lg font-mono text-sm">
                      {event.event}
                    </code>
                    <p className="text-sm text-slate-600">
                      {event.description}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    event.badge === 'Critical' ? 'bg-red-100 text-red-700' :
                    event.badge === 'Important' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {event.badge}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Setup Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Setup Guide
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <CodeBlock
              language="javascript"
              filename="webhook-setup.js"
              code={setupExample}
            />
          </GlassCard>
        </motion.div>

        {/* Payload Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Payload Examples
          </h2>

          <div className="space-y-6 mb-12">
            <GlassCard variant="elevated" className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Policy Purchased Event
              </h3>
              <CodeBlock
                language="json"
                filename="policy-purchased.json"
                code={payloadExample}
              />
            </GlassCard>

            <GlassCard variant="elevated" className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Claim Submitted Event
              </h3>
              <CodeBlock
                language="json"
                filename="claim-submitted.json"
                code={claimExample}
              />
            </GlassCard>
          </div>
        </motion.div>

        {/* Implementation Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Implementation Examples
          </h2>

          <div className="space-y-6 mb-12">
            <GlassCard variant="elevated" className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Express.js Handler
              </h3>
              <CodeBlock
                language="javascript"
                filename="express-webhook.js"
                code={expressExample}
              />
            </GlassCard>

            <GlassCard variant="elevated" className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Next.js API Route
              </h3>
              <CodeBlock
                language="typescript"
                filename="route.ts"
                code={nextjsExample}
              />
            </GlassCard>
          </div>
        </motion.div>

        {/* Retry Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Retry Policy
          </h2>

          <GlassCard variant="featured" className="p-8 mb-12">
            <div className="flex items-start gap-4 mb-6">
              <RefreshCw className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Automatic Retry with Exponential Backoff
                </h3>
                <p className="text-slate-600">
                  If your endpoint returns a non-2xx status code, we'll automatically retry with increasing delays
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {retryPolicy.map((retry) => (
                <div
                  key={retry.attempt}
                  className="flex items-center gap-6 p-4 bg-white/60 rounded-xl"
                >
                  <div className="flex-shrink-0 w-16">
                    <span className="text-sm font-semibold text-slate-900">
                      {retry.attempt}
                    </span>
                  </div>
                  <div className="flex-shrink-0 w-24">
                    <code className="text-sm text-teal-600">
                      {retry.delay}
                    </code>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">
                      {retry.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <GlassCard variant="elevated" className="p-8 mb-12">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Security Best Practices
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Always verify the webhook signature before processing events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Use HTTPS endpoints only - HTTP endpoints will be rejected</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Store webhook secrets securely in environment variables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Return 200 status quickly, then process events asynchronously</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Implement idempotency to handle duplicate events gracefully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Log all webhook events for debugging and audit purposes</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Testing Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <GlassCard variant="elevated" className="p-8 mb-12">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Testing Webhooks
                </h3>
                <p className="text-slate-600 mb-4">
                  Use our webhook testing tools in the dashboard to:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Send test events to your endpoint</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>View webhook delivery history and responses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Manually retry failed webhook deliveries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Monitor webhook success rates and latency</span>
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
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <GlassCard variant="elevated" className="p-8 text-center">
            <Webhook className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Need Help with Webhooks?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our technical team can help you set up and troubleshoot webhook integrations
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
              Contact Technical Support
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
