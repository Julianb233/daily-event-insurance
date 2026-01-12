"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Shield,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
  TrendingUp,
  Activity,
} from "lucide-react"
import {
  calculatePricing,
  validateQuote,
  type PricingResult,
  type ValidationResult,
} from "@/lib/pricing"
import { formatCurrency } from "@/lib/commission-tiers"

// Quote request schema matching backend validation
const quoteRequestSchema = z.object({
  eventType: z.string().min(2, "Event type must be at least 2 characters").max(100),
  eventDate: z.string().refine((date) => {
    const eventDate = new Date(date)
    const now = new Date()
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000)
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    return eventDate >= fourHoursFromNow && eventDate <= oneYearFromNow
  }, "Event must be 4 hours to 365 days in advance"),
  participants: z.number().min(1, "At least 1 participant required").max(10000),
  coverageType: z.enum(["liability", "equipment", "cancellation"]),
  duration: z.number().min(0.5, "Minimum 0.5 hours").max(24, "Maximum 24 hours").optional(),
  location: z.string().optional(),
  customerEmail: z.string().email("Valid email required").optional(),
  customerName: z.string().min(2, "Name must be at least 2 characters").optional(),
  eventDescription: z.string().optional(),
})

type QuoteFormData = z.infer<typeof quoteRequestSchema>

interface QuoteRequestFormProps {
  onQuoteCreated?: (quote: any) => void
  partnerId?: string
}

export function QuoteRequestForm({ onQuoteCreated, partnerId }: QuoteRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pricingPreview, setPricingPreview] = useState<PricingResult | null>(null)
  const [validationWarnings, setValidationWarnings] = useState<ValidationResult | null>(null)
  const [showPricing, setShowPricing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      coverageType: "liability",
      participants: 25,
      duration: 2,
    },
  })

  // Watch form values for live pricing preview
  const formValues = watch()

  // Calculate pricing preview whenever relevant fields change
  const updatePricingPreview = () => {
    if (!formValues.eventType || !formValues.eventDate || !formValues.participants) {
      setPricingPreview(null)
      return
    }

    try {
      // Validate the quote first
      const validation = validateQuote({
        eventType: formValues.eventType,
        eventDate: new Date(formValues.eventDate),
        participants: formValues.participants,
        coverageType: formValues.coverageType,
        duration: formValues.duration,
        location: formValues.location,
        customerEmail: formValues.customerEmail,
        customerName: formValues.customerName,
      })

      setValidationWarnings(validation)

      if (validation.valid || validation.errors.length === 0) {
        const pricing = calculatePricing({
          eventType: formValues.eventType,
          coverageType: formValues.coverageType,
          participants: formValues.participants,
          eventDate: new Date(formValues.eventDate),
          duration: formValues.duration,
          location: formValues.location,
        })

        setPricingPreview(pricing)
        setShowPricing(true)
      }
    } catch (error) {
      console.error("Error calculating pricing preview:", error)
      setPricingPreview(null)
    }
  }

  // Update pricing on form value changes
  useState(() => {
    const subscription = watch(() => {
      updatePricingPreview()
    })
    return () => subscription.unsubscribe()
  })

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/partner/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: data.eventType,
          eventDate: new Date(data.eventDate).toISOString(),
          participants: data.participants,
          coverageType: data.coverageType,
          eventDetails: {
            duration: data.duration,
            location: data.location,
            description: data.eventDescription,
          },
          customerEmail: data.customerEmail,
          customerName: data.customerName,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || "Failed to create quote")
      }

      const result = await response.json()

      // Reset form and notify parent
      reset()
      setPricingPreview(null)
      setShowPricing(false)
      setValidationWarnings(null)

      if (onQuoteCreated) {
        onQuoteCreated(result.data)
      }
    } catch (error) {
      console.error("Error creating quote:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to create quote")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRiskLevelColor = (multiplier: number) => {
    if (multiplier <= 0.9) return "text-green-600"
    if (multiplier <= 1.1) return "text-blue-600"
    if (multiplier <= 1.4) return "text-amber-600"
    return "text-red-600"
  }

  const getRiskLevelBg = (multiplier: number) => {
    if (multiplier <= 0.9) return "bg-green-100"
    if (multiplier <= 1.1) return "bg-blue-100"
    if (multiplier <= 1.4) return "bg-amber-100"
    return "bg-red-100"
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Event Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Type *
              </label>
              <input
                {...register("eventType")}
                type="text"
                placeholder="e.g., 5K Race, Rock Climbing, Yoga Class"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {errors.eventType && (
                <p className="text-red-600 text-sm mt-1">{errors.eventType.message}</p>
              )}
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Event Date *
              </label>
              <input
                {...register("eventDate")}
                type="datetime-local"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {errors.eventDate && (
                <p className="text-red-600 text-sm mt-1">{errors.eventDate.message}</p>
              )}
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants *
              </label>
              <input
                {...register("participants", { valueAsNumber: true })}
                type="number"
                min="1"
                max="10000"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {errors.participants && (
                <p className="text-red-600 text-sm mt-1">{errors.participants.message}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration (hours)
              </label>
              <input
                {...register("duration", { valueAsNumber: true })}
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                placeholder="2"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {errors.duration && (
                <p className="text-red-600 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <input
                {...register("location")}
                type="text"
                placeholder="e.g., Indoor Gym, Mountain Trail"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Coverage Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Coverage Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: "liability", label: "Liability", price: "$4.99/person" },
                  { value: "equipment", label: "Equipment", price: "$9.99/person" },
                  { value: "cancellation", label: "Cancellation", price: "$14.99/person" },
                ].map((coverage) => (
                  <label
                    key={coverage.value}
                    className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formValues.coverageType === coverage.value
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <input
                      {...register("coverageType")}
                      type="radio"
                      value={coverage.value}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{coverage.label}</p>
                      <p className="text-sm text-slate-600">Base {coverage.price}</p>
                    </div>
                    {formValues.coverageType === coverage.value && (
                      <CheckCircle2 className="w-5 h-5 text-teal-600 absolute top-2 right-2" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Event Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Description (optional)
              </label>
              <textarea
                {...register("eventDescription")}
                rows={3}
                placeholder="Additional details about your event..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Customer Information (optional)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer Name
              </label>
              <input
                {...register("customerName")}
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {errors.customerName && (
                <p className="text-red-600 text-sm mt-1">{errors.customerName.message}</p>
              )}
            </div>

            {/* Customer Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer Email
              </label>
              <input
                {...register("customerEmail")}
                type="email"
                placeholder="customer@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              {errors.customerEmail && (
                <p className="text-red-600 text-sm mt-1">{errors.customerEmail.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Validation Warnings */}
        <AnimatePresence>
          {validationWarnings && validationWarnings.warnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-amber-50 rounded-xl p-4 border border-amber-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-2">Warnings</h4>
                  <ul className="space-y-1">
                    {validationWarnings.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-amber-800">
                        {warning.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Preview */}
        <AnimatePresence>
          {showPricing && pricingPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 shadow-lg border border-teal-100"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" />
                Pricing Preview
              </h3>

              {/* Main Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Total Premium</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(pricingPreview.premium)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatCurrency(pricingPreview.perParticipant)} per participant
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Your Commission</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {formatCurrency(pricingPreview.commission)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(pricingPreview.commissionRate * 100).toFixed(0)}% commission rate
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Risk Multiplier</p>
                  <p className={`text-2xl font-bold ${getRiskLevelColor(pricingPreview.riskMultiplier)}`}>
                    {pricingPreview.riskMultiplier}x
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {pricingPreview.riskMultiplier <= 0.9 ? "Low risk" :
                     pricingPreview.riskMultiplier <= 1.1 ? "Standard risk" :
                     pricingPreview.riskMultiplier <= 1.4 ? "Medium risk" : "High risk"}
                  </p>
                </div>
              </div>

              {/* Risk Factors Breakdown */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Risk Factors
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(pricingPreview.riskFactors).map(([key, value]) => {
                    if (key === "baseRisk") return null
                    const label = key
                      .replace("Risk", "")
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                    return (
                      <div
                        key={key}
                        className={`px-3 py-2 rounded-lg ${getRiskLevelBg(value as number)}`}
                      >
                        <p className="text-xs text-slate-600 capitalize">{label}</p>
                        <p className={`font-bold ${getRiskLevelColor(value as number)}`}>
                          {(value as number).toFixed(2)}x
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-white rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-slate-900 mb-3">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Premium</span>
                    <span className="font-medium">
                      {formatCurrency(pricingPreview.breakdown.basePremium)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Risk Adjustment</span>
                    <span className={`font-medium ${pricingPreview.breakdown.riskAdjustment >= 0 ? "text-red-600" : "text-green-600"}`}>
                      {pricingPreview.breakdown.riskAdjustment >= 0 ? "+" : ""}
                      {formatCurrency(pricingPreview.breakdown.riskAdjustment)}
                    </span>
                  </div>
                  {pricingPreview.breakdown.volumeDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Volume Discount</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(pricingPreview.breakdown.volumeDiscount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-900">Final Premium</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(pricingPreview.breakdown.finalPremium)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Error */}
        {submitError && (
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Creating Quote..." : "Create Quote"}
          </button>
        </div>
      </form>
    </div>
  )
}
