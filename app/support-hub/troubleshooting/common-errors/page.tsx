"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { AlertTriangle, CheckCircle, XCircle, Search, Clock } from "lucide-react"

const commonErrors = [
  {
    error: "invalid_activity_type",
    message: "The specified activity type is not supported",
    quickFix: "< 2 min",
    causes: ["Activity type not in approved list", "Typo in activity name", "Coverage not available in state"],
    solutions: [
      "Check supported activity types in API docs",
      "Verify exact spelling (case-sensitive)",
      "Confirm coverage available in member's state",
      "Use activity_type from GET /activities endpoint"
    ]
  },
  {
    error: "policy_creation_failed",
    message: "Unable to create policy with provided data",
    quickFix: "< 5 min",
    causes: ["Missing required fields", "Invalid date range", "Coverage limits exceeded", "Member ineligible"],
    solutions: [
      "Verify all required fields present",
      "Check event date is in future",
      "Confirm coverage amount within limits",
      "Validate member age and eligibility",
      "Review error details in response"
    ]
  },
  {
    error: "member_not_found",
    message: "No member exists with provided ID",
    quickFix: "< 1 min",
    causes: ["Incorrect member ID", "Member deleted", "Wrong environment", "ID from different account"],
    solutions: [
      "Verify member ID is correct",
      "Check member exists in current environment",
      "Search by email if ID unknown",
      "Create member if doesn't exist"
    ]
  },
  {
    error: "coverage_not_available",
    message: "Requested coverage not available for this activity/location",
    quickFix: "< 3 min",
    causes: ["State not licensed", "Activity excluded", "Temporary unavailability", "Account restrictions"],
    solutions: [
      "Check state licensing status",
      "Review excluded activities list",
      "Verify account has feature enabled",
      "Contact support for state expansion"
    ]
  },
  {
    error: "duplicate_policy",
    message: "Policy already exists for this member and event",
    quickFix: "< 1 min",
    causes: ["Double submission", "Retry without idempotency key", "Existing active policy"],
    solutions: [
      "Check for existing policy first",
      "Use idempotency keys for retries",
      "Query policies by member and date",
      "Update existing policy if needed"
    ]
  },
  {
    error: "validation_error",
    message: "One or more fields failed validation",
    quickFix: "< 5 min",
    causes: ["Invalid email format", "Date in past", "Negative amount", "Text too long"],
    solutions: [
      "Review field requirements in docs",
      "Validate data before sending",
      "Check string length limits",
      "Ensure proper date formats (ISO 8601)"
    ]
  },
  {
    error: "claim_submission_failed",
    message: "Unable to submit claim with provided information",
    quickFix: "< 10 min",
    causes: ["Missing documentation", "Claim window expired", "Policy not found", "Invalid claim type"],
    solutions: [
      "Provide all required documents",
      "Submit within 30 days of incident",
      "Verify policy ID is correct",
      "Match claim type to policy coverage"
    ]
  },
  {
    error: "refund_not_eligible",
    message: "Policy or member not eligible for refund",
    quickFix: "< 5 min",
    causes: ["Outside refund window", "Event already occurred", "Cancellation not covered", "Partial refund only"],
    solutions: [
      "Check refund policy terms",
      "Verify cancellation reason is covered",
      "Review event date vs. refund request date",
      "Provide required documentation"
    ]
  }
]

const errorCategories = [
  { category: "Validation Errors", count: "35%", color: "yellow" },
  { category: "Not Found Errors", count: "25%", color: "orange" },
  { category: "Business Logic Errors", count: "20%", color: "red" },
  { category: "Permission Errors", count: "10%", color: "purple" },
  { category: "System Errors", count: "10%", color: "blue" }
]

export default function CommonErrorsPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs items={[{ label: "Troubleshooting", href: "/support-hub/troubleshooting" }, { label: "Common Errors" }]} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-600 font-semibold text-sm mb-6">
          <AlertTriangle className="w-4 h-4" />
          Error Reference
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Common Errors
          <span className="block mt-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Quick Solutions</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Most frequently encountered errors and how to resolve them quickly
        </p>
      </motion.div>

      <section>
        <GlassCard>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Error Distribution</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {errorCategories.map((cat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-white/50 rounded-xl"
                >
                  <div className={`text-3xl font-bold mb-2 text-${cat.color}-600`}>{cat.count}</div>
                  <div className="text-sm text-slate-600">{cat.category}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="space-y-6">
        {commonErrors.map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
            <GlassCard>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="px-3 py-1 bg-red-100 text-red-700 rounded font-mono text-sm font-semibold">
                        {item.error}
                      </code>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.quickFix}
                      </span>
                    </div>
                    <p className="text-slate-600 italic mb-4">"{item.message}"</p>
                  </div>
                </div>

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
            <Search className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-bold text-slate-900">Error Prevention Tips</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Always validate data before sending to API",
              "Use TypeScript for type safety and auto-completion",
              "Implement proper error handling and user feedback",
              "Test with invalid data to catch edge cases",
              "Log errors with context for easier debugging",
              "Use idempotency keys for retry-safe operations",
              "Cache responses to reduce API calls",
              "Monitor error rates in your dashboard"
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 bg-white/50 rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{tip}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
