"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Users,
  DollarSign,
  Info,
  Download,
} from "lucide-react"
import { formatCurrency } from "@/lib/commission-tiers"

interface Quote {
  id: string
  quote_number: string
  event_type: string
  event_date: Date | string
  participants: number
  coverage_type: string
  premium: number
  commission: number
  status: string
  customer_email: string | null
  customer_name: string | null
  created_at: Date | string
  expires_at?: Date | string
  metadata?: {
    riskMultiplier?: number
    requiresReview?: boolean
    reviewReasons?: string[]
    validationWarnings?: Array<{ message: string }>
  }
}

interface Policy {
  id: string
  policy_number: string
  quote_id: string
  status: string
  effective_date: string
  expiration_date: string
}

interface QuoteToPolicyConverterProps {
  quote: Quote
  onConverted?: (policy: Policy) => void
}

export function QuoteToPolicyConverter({ quote, onConverted }: QuoteToPolicyConverterProps) {
  const [isConverting, setIsConverting] = useState(false)
  const [convertedPolicy, setConvertedPolicy] = useState<Policy | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const isExpired = quote.expires_at && new Date(quote.expires_at) < new Date()
  const canConvert = quote.status === "pending" && !isExpired

  const handleConvert = async () => {
    if (!canConvert) return

    setIsConverting(true)
    setError(null)

    try {
      const response = await fetch(`/api/partner/quotes/${quote.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "accept",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to convert quote to policy")
      }

      const result = await response.json()
      const policy = result.data.policy

      setConvertedPolicy(policy)
      setShowConfirmation(false)

      if (onConverted) {
        onConverted(policy)
      }
    } catch (err) {
      console.error("Error converting quote:", err)
      setError(err instanceof Error ? err.message : "Failed to convert quote")
    } finally {
      setIsConverting(false)
    }
  }

  if (convertedPolicy) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 shadow-lg border-2 border-green-200"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">Policy Created Successfully!</h3>
          <p className="text-green-700">
            Quote {quote.quote_number} has been converted to an active policy
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Policy Number</p>
              <p className="text-lg font-bold text-slate-900">{convertedPolicy.policy_number}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Status</p>
              <p className="text-lg font-bold text-green-600 capitalize">{convertedPolicy.status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Effective Date</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Date(convertedPolicy.effective_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Expiration Date</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Date(convertedPolicy.expiration_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.href = "/partner/policies"}
            className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            View All Policies
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Print Policy
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quote Summary */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Quote {quote.quote_number}</h3>
            <p className="text-slate-600">{quote.event_type}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              canConvert
                ? "bg-green-100 text-green-700"
                : isExpired
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {isExpired ? "Expired" : quote.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-600">Event Date</p>
              <p className="text-sm font-semibold text-slate-900">
                {new Date(quote.event_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-600">Participants</p>
              <p className="text-sm font-semibold text-slate-900">{quote.participants}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-600">Premium</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatCurrency(Number(quote.premium))}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-600">Coverage</p>
              <p className="text-sm font-semibold text-slate-900 capitalize">{quote.coverage_type}</p>
            </div>
          </div>
        </div>

        {quote.customer_name && (
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm text-slate-600">Customer: {quote.customer_name}</p>
            {quote.customer_email && (
              <p className="text-sm text-slate-600">{quote.customer_email}</p>
            )}
          </div>
        )}
      </div>

      {/* Warnings */}
      {quote.metadata?.requiresReview && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-xl p-4 border border-amber-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-2">Manual Review Required</h4>
              {quote.metadata.reviewReasons && quote.metadata.reviewReasons.length > 0 && (
                <ul className="space-y-1">
                  {quote.metadata.reviewReasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-amber-800">
                      • {reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {quote.metadata?.validationWarnings && quote.metadata.validationWarnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">Notes</h4>
              <ul className="space-y-1">
                {quote.metadata.validationWarnings.map((warning, idx) => (
                  <li key={idx} className="text-sm text-blue-800">
                    • {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 rounded-xl p-4 border border-red-200"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Conversion Failed</h4>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Convert Button or Disabled State */}
      {canConvert ? (
        <>
          {!showConfirmation ? (
            <button
              onClick={() => setShowConfirmation(true)}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <FileText className="w-5 h-5" />
              Convert to Policy
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200"
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Confirm Policy Conversion</h4>
                  <p className="text-sm text-amber-800 mb-2">
                    This will create an active insurance policy from this quote. The policy will be
                    effective immediately and the quote will be marked as accepted.
                  </p>
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <p className="text-sm text-slate-600 mb-1">You will earn:</p>
                    <p className="text-2xl font-bold text-teal-600">
                      {formatCurrency(Number(quote.commission))}
                    </p>
                  </div>
                  <p className="text-xs text-amber-700">
                    This action cannot be undone. Please verify all quote details are correct.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isConverting}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="flex-1 px-4 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConverting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isConverting ? "Converting..." : "Confirm Conversion"}
                </button>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 text-slate-600">
            <Info className="w-5 h-5" />
            <p className="font-medium">
              {isExpired
                ? "This quote has expired and cannot be converted to a policy"
                : "This quote cannot be converted (status: " + quote.status + ")"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
