/**
 * Checkout Success Page
 *
 * Displays confirmation after successful payment
 * Retrieves session details and shows policy information
 */

"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Download, Mail, ArrowRight, Loader2, Home } from "lucide-react"
import Link from "next/link"

interface SessionDetails {
  session: {
    id: string
    status: string
    payment_status: string
    customer_email: string
    amount_total: number
    metadata: {
      quote_number: string
      policy_number?: string
      quote_id: string
      partner_id: string
    }
  }
}

function CheckoutSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided")
      setLoading(false)
      return
    }

    fetchSessionDetails()
  }, [sessionId])

  async function fetchSessionDetails() {
    try {
      setLoading(true)
      const response = await fetch(`/api/stripe/checkout?session_id=${sessionId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to retrieve session details")
      }

      const data = await response.json()
      setSessionDetails(data)
    } catch (err) {
      console.error("[Checkout Success] Error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Details</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Don't worry - your payment was successful! Check your email for confirmation details.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const { session } = sessionDetails || {}

  if (!session || session.payment_status !== "paid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Not Completed</h1>
          <p className="text-gray-600 mb-6">
            Your payment is still processing. Please check your email for updates.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Your insurance policy is now active
            </p>
          </div>

          {/* Order Details */}
          <div className="border-t border-b border-gray-200 py-6 my-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Quote Number</div>
                <div className="text-lg font-semibold text-gray-900">
                  {session.metadata.quote_number}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Amount Paid</div>
                <div className="text-lg font-semibold text-gray-900">
                  ${(session.amount_total / 100).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Confirmation Email</div>
                <div className="text-sm text-gray-900">{session.customer_email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Session ID</div>
                <div className="text-sm text-gray-600 font-mono truncate">
                  {session.id}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">What happens next?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-teal-600">1</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Confirmation Email</div>
                  <div className="text-sm text-gray-600">
                    You'll receive a confirmation email with your policy details and receipt.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-teal-600">2</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Policy Document</div>
                  <div className="text-sm text-gray-600">
                    Your policy document will be generated and sent to your email within 24 hours.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-teal-600">3</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Coverage Begins</div>
                  <div className="text-sm text-gray-600">
                    Your coverage is now active for the event date specified in your quote.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Print Confirmation
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Return Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Support Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Need Help?</h3>
              <p className="text-sm text-blue-800">
                If you have any questions about your policy or need assistance, please contact
                our support team. Your quote number is: <strong>{session.metadata.quote_number}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
