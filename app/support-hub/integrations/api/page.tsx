"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { CodeBlock } from "@/components/support-hub/CodeBlock"
import {
  Code,
  Key,
  Zap,
  Shield,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Lock
} from "lucide-react"

const endpoints = [
  {
    method: "POST",
    endpoint: "/api/v1/quotes",
    description: "Create a new insurance quote",
    badge: "Essential"
  },
  {
    method: "GET",
    endpoint: "/api/v1/quotes/:id",
    description: "Retrieve quote details",
    badge: "Common"
  },
  {
    method: "POST",
    endpoint: "/api/v1/policies",
    description: "Purchase insurance policy",
    badge: "Essential"
  },
  {
    method: "GET",
    endpoint: "/api/v1/policies/:id",
    description: "Get policy details",
    badge: "Common"
  },
  {
    method: "PATCH",
    endpoint: "/api/v1/policies/:id",
    description: "Update policy information",
    badge: "Common"
  },
  {
    method: "DELETE",
    endpoint: "/api/v1/policies/:id/cancel",
    description: "Cancel an active policy",
    badge: "Important"
  },
  {
    method: "GET",
    endpoint: "/api/v1/coverage-types",
    description: "List available coverage types",
    badge: "Reference"
  },
  {
    method: "POST",
    endpoint: "/api/v1/claims",
    description: "Submit an insurance claim",
    badge: "Important"
  }
]

const authExample = `// Authentication with API Key
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}

// Example: Get API key from environment
const apiKey = process.env.DAILY_EVENT_INSURANCE_API_KEY

fetch('https://api.dailyeventinsurance.com/api/v1/quotes', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(quoteData)
})`

const quoteExample = `// Create Quote Request
POST /api/v1/quotes
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "event_type": "wedding_reception",
  "event_date": "2026-08-15",
  "event_time": "18:00",
  "duration_hours": 6,
  "venue": {
    "name": "Grand Ballroom",
    "address": "123 Main St, City, ST 12345",
    "type": "indoor"
  },
  "guests": 150,
  "coverage": {
    "general_liability": 1000000,
    "property_damage": 50000,
    "liquor_liability": true,
    "cancellation": true
  },
  "contact": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1-555-0123"
  }
}

// Create Quote Response
{
  "id": "quote_abc123xyz",
  "status": "active",
  "premium": 245.00,
  "coverage_details": {
    "general_liability": {
      "amount": 1000000,
      "cost": 150.00
    },
    "property_damage": {
      "amount": 50000,
      "cost": 45.00
    },
    "liquor_liability": {
      "included": true,
      "cost": 30.00
    },
    "cancellation": {
      "included": true,
      "cost": 20.00
    }
  },
  "expires_at": "2026-06-22T23:59:59Z",
  "created_at": "2026-06-15T14:30:00Z"
}`

const policyExample = `// Purchase Policy Request
POST /api/v1/policies
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "quote_id": "quote_abc123xyz",
  "payment": {
    "method": "card",
    "token": "tok_visa_4242424242424242"
  },
  "insured": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1-555-0123",
    "address": {
      "street": "456 Oak Ave",
      "city": "Springfield",
      "state": "IL",
      "zip": "62701"
    }
  }
}

// Purchase Policy Response
{
  "id": "pol_xyz789abc",
  "policy_number": "DEI-2026-08-001234",
  "status": "active",
  "quote_id": "quote_abc123xyz",
  "premium": 245.00,
  "coverage_start": "2026-08-15T00:00:00Z",
  "coverage_end": "2026-08-16T05:59:59Z",
  "documents": {
    "certificate": "https://docs.dailyeventinsurance.com/cert/pol_xyz789abc.pdf",
    "policy": "https://docs.dailyeventinsurance.com/policy/pol_xyz789abc.pdf"
  },
  "created_at": "2026-06-15T14:35:00Z"
}`

const errorExample = `// Error Response Format
{
  "error": {
    "code": "invalid_request",
    "message": "Event date must be at least 24 hours in the future",
    "field": "event_date",
    "type": "validation_error"
  }
}

// Common Error Codes
- invalid_request: Request validation failed
- authentication_failed: Invalid API key
- rate_limit_exceeded: Too many requests
- resource_not_found: Quote or policy not found
- payment_failed: Payment processing error
- coverage_unavailable: Coverage not available for event type`

const rateLimits = [
  {
    tier: "Sandbox",
    requests: "100 / hour",
    burst: "10 / minute"
  },
  {
    tier: "Production",
    requests: "1,000 / hour",
    burst: "50 / minute"
  },
  {
    tier: "Enterprise",
    requests: "10,000 / hour",
    burst: "500 / minute"
  }
]

export default function APIIntegrationPage() {
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
              { label: "API Reference" }
            ]}
          />

          <div className="mt-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 text-white">
                <Code className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  API Reference
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  REST API • Version 1.0 • Production Ready
                </p>
              </div>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl">
              Build custom integrations with our comprehensive REST API
            </p>
          </div>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <GlassCard className="p-6">
              <Key className="w-8 h-8 text-teal-600 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">
                API Authentication
              </h3>
              <p className="text-sm text-slate-600">
                Secure API key authentication with bearer token format
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <Zap className="w-8 h-8 text-teal-600 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">
                Real-time Processing
              </h3>
              <p className="text-sm text-slate-600">
                Instant quote generation and policy issuance in milliseconds
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <Shield className="w-8 h-8 text-teal-600 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">
                Production Grade
              </h3>
              <p className="text-sm text-slate-600">
                99.9% uptime SLA with automatic failover and redundancy
              </p>
            </GlassCard>
          </div>
        </motion.div>

        {/* Base URL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard variant="elevated" className="p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Base URL
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Production</p>
                <code className="block px-4 py-3 bg-slate-900 text-teal-400 rounded-lg font-mono text-sm">
                  https://api.dailyeventinsurance.com
                </code>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Sandbox</p>
                <code className="block px-4 py-3 bg-slate-900 text-amber-400 rounded-lg font-mono text-sm">
                  https://sandbox.dailyeventinsurance.com
                </code>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Authentication
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <div className="flex items-start gap-4 mb-6">
              <Lock className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  API Key Authentication
                </h3>
                <p className="text-slate-600 mb-4">
                  Include your API key in the Authorization header as a Bearer token
                </p>
              </div>
            </div>

            <CodeBlock
              language="javascript"
              filename="authentication.js"
              code={authExample}
            />

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <strong>Keep your API key secure!</strong> Never expose it in client-side code or public repositories.
                  Use environment variables for production deployments.
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            API Endpoints
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.endpoint}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded ${
                      endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                      endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                      endpoint.method === 'PATCH' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-slate-900 font-mono text-sm">
                      {endpoint.endpoint}
                    </code>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-slate-600 hidden lg:block">
                      {endpoint.description}
                    </p>
                    <span className="px-2 py-1 text-xs text-teal-700 bg-teal-100 rounded">
                      {endpoint.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Create Quote Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Create Quote Example
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <CodeBlock
              language="json"
              filename="create-quote.json"
              code={quoteExample}
            />
          </GlassCard>
        </motion.div>

        {/* Purchase Policy Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Purchase Policy Example
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <CodeBlock
              language="json"
              filename="purchase-policy.json"
              code={policyExample}
            />
          </GlassCard>
        </motion.div>

        {/* Error Handling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Error Handling
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <p className="text-slate-600 mb-6">
              All errors follow a consistent format with descriptive messages and error codes:
            </p>
            <CodeBlock
              language="json"
              filename="error-response.json"
              code={errorExample}
            />
          </GlassCard>
        </motion.div>

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Rate Limits
          </h2>

          <GlassCard variant="featured" className="p-8 mb-12">
            <div className="flex items-start gap-4 mb-6">
              <TrendingUp className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Request Limits by Tier
                </h3>
                <p className="text-slate-600">
                  Rate limits are enforced per API key to ensure fair usage and system stability
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {rateLimits.map((limit) => (
                <div key={limit.tier} className="p-6 bg-white/60 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-4">
                    {limit.tier}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Hourly Limit</p>
                      <p className="text-2xl font-bold text-teal-600">
                        {limit.requests}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Burst Limit</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {limit.burst}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  Rate limit headers are included in every response: <code className="px-2 py-0.5 bg-blue-100 rounded">X-RateLimit-Limit</code>,{' '}
                  <code className="px-2 py-0.5 bg-blue-100 rounded">X-RateLimit-Remaining</code>,{' '}
                  <code className="px-2 py-0.5 bg-blue-100 rounded">X-RateLimit-Reset</code>
                </div>
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
            <BookOpen className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Need More Documentation?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Access our complete API documentation with interactive examples and SDKs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                Full API Docs
              </button>
              <button className="px-6 py-3 bg-white/80 text-slate-900 rounded-xl font-medium border border-slate-200 hover:border-teal-300 transition-colors">
                Download SDKs
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
