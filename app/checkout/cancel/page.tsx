/**
 * Checkout Cancel Page
 *
 * Displays when user cancels/abandons the checkout process
 */

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { XCircle, ArrowLeft, RotateCcw, Home } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function CheckoutCancelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quoteId = searchParams.get("quote_id")

  function handleRetry() {
    if (quoteId) {
      router.push(`/checkout?quote_id=${quoteId}`)
    } else {
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Checkout Cancelled
            </h1>
            <p className="text-lg text-gray-600">
              Your payment was not processed
            </p>
          </div>

          {/* Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-yellow-900 mb-2">What happened?</h2>
            <p className="text-sm text-yellow-800">
              You've cancelled the checkout process or navigated away from the payment page.
              No charges were made to your payment method.
            </p>
          </div>

          {/* Quote Status */}
          {quoteId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-blue-900 mb-2">Your Quote is Still Valid</h2>
              <p className="text-sm text-blue-800 mb-3">
                Your insurance quote is saved and ready whenever you're ready to proceed.
                Quotes are typically valid for 30 days.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-700">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Quote ID: {quoteId}</span>
              </div>
            </div>
          )}

          {/* Reasons Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Common reasons for cancellation
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Need more time to review the policy details</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Want to compare coverage options or pricing</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Experiencing technical issues with payment</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Need to update payment information</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleRetry}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>

            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          {/* Need Help */}
          <div className="text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-2">
              Having trouble? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
              <a
                href="mailto:support@dailyeventinsurance.com"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                support@dailyeventinsurance.com
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <span className="text-gray-600">Available Monday-Friday, 9am-5pm EST</span>
            </div>
          </div>
        </div>

        {/* Additional Help Card */}
        <div className="mt-6 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Questions about coverage?
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            Our team can help you understand your insurance options and find the right
            coverage for your event.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Contact Us
            <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    }>
      <CheckoutCancelContent />
    </Suspense>
  )
}
