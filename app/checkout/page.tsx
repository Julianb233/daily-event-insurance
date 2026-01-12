/**
 * Checkout Page
 *
 * Handles the checkout flow - retrieves quote details and redirects to Stripe Checkout
 */

"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CreditCard, Shield, CheckCircle2, AlertCircle } from "lucide-react"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quoteId = searchParams.get("quote_id")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quote, setQuote] = useState<any>(null)

  useEffect(() => {
    if (!quoteId) {
      setError("No quote ID provided")
      setLoading(false)
      return
    }

    // Auto-redirect to Stripe Checkout
    createCheckoutSession()
  }, [quoteId])

  async function createCheckoutSession() {
    try {
      setLoading(true)
      setError(null)

      // Create checkout session
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || errorData.error || "Failed to create checkout session")
      }

      const data = await response.json()

      // Store quote data before redirect
      setQuote(data.quote)

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (err) {
      console.error("[Checkout] Error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Checkout Error
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          {/* Loading Spinner */}
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Redirecting to Checkout
          </h1>
          <p className="text-gray-600 mb-8">
            Please wait while we securely redirect you to complete your purchase...
          </p>

          {/* Quote Details Preview */}
          {quote && (
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <Shield className="w-5 h-5 text-teal-600 mt-0.5" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {quote.coverageType.charAt(0).toUpperCase() + quote.coverageType.slice(1)} Insurance
                  </div>
                  <div className="text-xs text-gray-500">
                    Quote #{quote.quoteNumber}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    ${parseFloat(quote.premium).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Total Amount
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Secured by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
