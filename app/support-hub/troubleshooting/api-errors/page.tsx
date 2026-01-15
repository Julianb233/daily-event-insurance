"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { Code, AlertTriangle, CheckCircle } from "lucide-react"

const errorCodes = [
  {
    code: "400",
    name: "Bad Request",
    description: "The request was malformed or missing required parameters",
    commonCauses: ["Missing required fields", "Invalid data format", "Incorrect data types", "Invalid enum values"],
    solutions: ["Verify all required fields are present", "Check JSON structure is valid", "Validate data types match API spec", "Review API documentation for field requirements"]
  },
  {
    code: "401",
    name: "Unauthorized",
    description: "Authentication failed or API key is invalid",
    commonCauses: ["Missing API key", "Invalid API key", "Expired credentials", "Wrong environment key"],
    solutions: ["Include Authorization header with Bearer token", "Generate new API key from dashboard", "Use correct key for environment (test/prod)", "Verify key is active"]
  },
  {
    code: "403",
    name: "Forbidden",
    description: "Valid credentials but insufficient permissions",
    commonCauses: ["Account suspended", "Feature not enabled", "IP not whitelisted", "Scope restrictions"],
    solutions: ["Contact support to verify account status", "Check feature flags in dashboard", "Add IP to whitelist", "Request additional API scopes"]
  },
  {
    code: "404",
    name: "Not Found",
    description: "The requested resource doesn't exist",
    commonCauses: ["Invalid resource ID", "Resource deleted", "Incorrect endpoint URL", "Typo in path"],
    solutions: ["Verify resource ID is correct", "Check if resource was deleted", "Confirm endpoint URL matches docs", "Review API version in URL"]
  },
  {
    code: "422",
    name: "Unprocessable Entity",
    description: "Request understood but cannot be processed due to validation errors",
    commonCauses: ["Business logic validation failed", "Duplicate resource", "Invalid state transition", "Constraint violation"],
    solutions: ["Review validation errors in response", "Check business rule requirements", "Verify no duplicate entries", "Ensure valid state transitions"]
  },
  {
    code: "429",
    name: "Too Many Requests",
    description: "Rate limit exceeded",
    commonCauses: ["Too many requests in time window", "Concurrent request limit hit", "No exponential backoff"],
    solutions: ["Implement rate limiting in your code", "Add exponential backoff retry logic", "Cache responses where possible", "Contact support for higher limits"]
  },
  {
    code: "500",
    name: "Internal Server Error",
    description: "Something went wrong on our servers",
    commonCauses: ["Server-side bug", "Database issue", "Third-party service down", "Temporary glitch"],
    solutions: ["Retry request after brief delay", "Check status page for incidents", "Contact support with request ID", "Implement retry logic with backoff"]
  },
  {
    code: "503",
    name: "Service Unavailable",
    description: "Service temporarily unavailable",
    commonCauses: ["Scheduled maintenance", "System overload", "Deployment in progress"],
    solutions: ["Check status page", "Wait and retry", "Implement graceful degradation", "Subscribe to status updates"]
  }
]

export default function APIErrorsPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs items={[{ label: "Troubleshooting", href: "/support-hub/troubleshooting" }, { label: "API Errors" }]} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 text-red-600 font-semibold text-sm mb-6">
          <Code className="w-4 h-4" />
          Error Reference
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          API Error Codes
          <span className="block mt-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Complete Reference Guide</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Understand HTTP status codes and how to resolve common API errors
        </p>
      </motion.div>

      <section className="space-y-6">
        {errorCodes.map((error, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
            <GlassCard>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-bold text-red-600">{error.code}</span>
                      <h3 className="text-2xl font-bold text-slate-900">{error.name}</h3>
                    </div>
                    <p className="text-slate-600">{error.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <h4 className="flex items-center gap-2 font-bold text-red-800 mb-3">
                      <AlertTriangle className="w-5 h-5" />Common Causes
                    </h4>
                    <ul className="space-y-2">
                      {error.commonCauses.map((cause, i) => (
                        <li key={i} className="flex items-start gap-2 text-red-700 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />{cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                    <h4 className="flex items-center gap-2 font-bold text-green-800 mb-3">
                      <CheckCircle className="w-5 h-5" />How to Fix
                    </h4>
                    <ul className="space-y-2">
                      {error.solutions.map((solution, i) => (
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
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Error Response Format</h2>
          <pre className="p-4 bg-slate-900 text-green-400 rounded-xl overflow-x-auto text-sm">
            <code>{`{
  "error": {
    "code": "invalid_request",
    "message": "Missing required field: activity_type",
    "type": "validation_error",
    "param": "activity_type",
    "request_id": "req_abc123"
  }
}`}</code>
          </pre>
        </div>
      </GlassCard>
    </div>
  )
}
