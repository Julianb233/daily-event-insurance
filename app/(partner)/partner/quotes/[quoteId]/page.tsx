"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  FileText,
  Calendar,
  Users,
  Clock,
  MapPin,
  Shield,
  DollarSign,
  Loader2,
  Activity,
} from "lucide-react"
import { QuoteToPolicyConverter } from "@/components/partner/QuoteToPolicyConverter"
import { RiskAssessmentCard } from "@/components/partner/RiskAssessmentCard"
import { formatCurrency } from "@/lib/commission-tiers"
import type { RiskAssessment } from "@/lib/pricing"

interface QuoteDetails {
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
  event_details?: {
    duration?: number
    location?: string
    description?: string
  }
  metadata?: {
    riskMultiplier?: number
    riskFactors?: any
    requiresReview?: boolean
    reviewReasons?: string[]
    validationWarnings?: Array<{ message: string }>
    riskAssessment?: RiskAssessment
  }
}

export default function QuoteDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const quoteId = params?.quoteId as string

  const [quote, setQuote] = useState<QuoteDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (quoteId) {
      fetchQuoteDetails()
    }
  }, [quoteId])

  const fetchQuoteDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/partner/quotes/${quoteId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch quote details")
      }

      const data = await response.json()
      setQuote(data.data)
    } catch (err) {
      console.error("Error fetching quote:", err)
      setError(err instanceof Error ? err.message : "Failed to load quote")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePolicyConverted = () => {
    // Refresh quote details to show updated status
    fetchQuoteDetails()
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading quote details...</p>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 rounded-xl p-8 border border-red-200">
            <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Quote</h2>
            <p className="text-red-700 mb-4">{error || "Quote not found"}</p>
            <button
              onClick={() => router.push("/partner/quotes")}
              className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
            >
              Back to Quotes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/partner/quotes")}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quotes
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-teal-600" />
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Quote {quote.quote_number}
              </h1>
              <p className="text-slate-600 mt-1">{quote.event_type}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Event Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Event Date</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(quote.event_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Participants</p>
                  <p className="font-semibold text-slate-900">{quote.participants} people</p>
                </div>
              </div>

              {quote.event_details?.duration && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Duration</p>
                    <p className="font-semibold text-slate-900">
                      {quote.event_details.duration} hours
                    </p>
                  </div>
                </div>
              )}

              {quote.event_details?.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Location</p>
                    <p className="font-semibold text-slate-900">{quote.event_details.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Coverage Type</p>
                  <p className="font-semibold text-slate-900 capitalize">{quote.coverage_type}</p>
                </div>
              </div>
            </div>

            {quote.event_details?.description && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-2">Description</p>
                <p className="text-slate-900">{quote.event_details.description}</p>
              </div>
            )}
          </div>

          {/* Risk Assessment */}
          {quote.metadata?.riskAssessment && (
            <RiskAssessmentCard assessment={quote.metadata.riskAssessment} />
          )}

          {/* Conversion Component */}
          <QuoteToPolicyConverter quote={quote} onConverted={handlePolicyConverted} />
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 shadow-lg border border-teal-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-600" />
              Pricing
            </h3>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Total Premium</p>
                <p className="text-3xl font-bold text-slate-900">
                  {formatCurrency(Number(quote.premium))}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatCurrency(Number(quote.premium) / quote.participants)} per participant
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Your Commission</p>
                <p className="text-3xl font-bold text-teal-600">
                  {formatCurrency(Number(quote.commission))}
                </p>
                <p className="text-xs text-slate-500 mt-1">50% commission rate</p>
              </div>

              {quote.metadata?.riskMultiplier && (
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Risk Multiplier</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {quote.metadata.riskMultiplier}x
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {quote.metadata.riskMultiplier <= 0.9
                      ? "Low risk event"
                      : quote.metadata.riskMultiplier <= 1.1
                      ? "Standard risk"
                      : quote.metadata.riskMultiplier <= 1.4
                      ? "Medium risk event"
                      : "High risk event"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quote Info */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quote Information</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-600">Status</p>
                <p className="font-semibold text-slate-900 capitalize">{quote.status}</p>
              </div>

              <div>
                <p className="text-slate-600">Created</p>
                <p className="font-semibold text-slate-900">
                  {new Date(quote.created_at).toLocaleDateString()}
                </p>
              </div>

              {quote.expires_at && (
                <div>
                  <p className="text-slate-600">Expires</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(quote.expires_at).toLocaleDateString()}
                  </p>
                </div>
              )}

              {quote.customer_name && (
                <>
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-slate-600">Customer Name</p>
                    <p className="font-semibold text-slate-900">{quote.customer_name}</p>
                  </div>
                  {quote.customer_email && (
                    <div>
                      <p className="text-slate-600">Customer Email</p>
                      <p className="font-semibold text-slate-900">{quote.customer_email}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
