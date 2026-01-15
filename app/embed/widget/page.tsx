'use client'

/**
 * Embeddable Insurance Widget
 *
 * This page is loaded in an iframe and provides a complete
 * insurance quote and purchase flow for partner websites.
 */

import { Suspense, useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { format, addDays } from "date-fns"
import {
  Shield,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Loader2,
  CreditCard,
} from "lucide-react"

// ============= Types =============

interface WidgetConfig {
  partnerId: string
  widgetId: string
  primaryColor: string
  mode: "floating" | "inline" | "modal"
  position: "bottom-right" | "bottom-left"
  products: string[]
  locale: string
  testMode: boolean
  testCards: boolean
  theme?: Record<string, string>
}

interface Customer {
  email?: string
  name?: string
  phone?: string
}

interface EventDetails {
  eventType?: string
  eventDate?: string
  participants?: number
  location?: string
  duration?: number
}

interface Quote {
  id: string
  quoteNumber: string
  eventType: string
  eventDate: string
  participants: number
  coverageType: string
  premium: string
  currency: string
  expiresAt: string
  coverageDetails: {
    limit: string
    deductible: string
    description: string
  }
}

interface Policy {
  id: string
  policyNumber: string
  certificateUrl: string
}

type Step = "closed" | "form" | "quote" | "payment" | "success"

// ============= Event Types =============

const EVENT_TYPES = [
  { value: "yoga-class", label: "Yoga Class", icon: "🧘" },
  { value: "fitness-class", label: "Fitness Class", icon: "💪" },
  { value: "dance-class", label: "Dance Class", icon: "💃" },
  { value: "martial-arts", label: "Martial Arts", icon: "🥋" },
  { value: "workshop", label: "Workshop", icon: "🎨" },
  { value: "retreat", label: "Retreat", icon: "🏕️" },
  { value: "sports-event", label: "Sports Event", icon: "⚽" },
  { value: "other", label: "Other", icon: "📋" },
]

// ============= Widget Component =============

// Suspense wrapper for the widget
export default function EmbeddableWidgetPage() {
  return (
    <Suspense fallback={<WidgetLoadingFallback />}>
      <EmbeddableWidget />
    </Suspense>
  )
}

// Loading fallback component
function WidgetLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

// Main widget component
function EmbeddableWidget() {
  const searchParams = useSearchParams()

  // Parse config from URL
  const config = useMemo<WidgetConfig>(() => ({
    partnerId: searchParams.get("partnerId") || "",
    widgetId: searchParams.get("widgetId") || "",
    primaryColor: searchParams.get("primaryColor") || "#14B8A6",
    mode: (searchParams.get("mode") as WidgetConfig["mode"]) || "floating",
    position: (searchParams.get("position") as WidgetConfig["position"]) || "bottom-right",
    products: searchParams.get("products")?.split(",") || ["liability"],
    locale: searchParams.get("locale") || "en",
    testMode: searchParams.get("testMode") === "true",
    testCards: searchParams.get("testCards") === "true",
    theme: searchParams.get("theme") ? JSON.parse(searchParams.get("theme")!) : undefined,
  }), [searchParams])

  // State
  const [step, setStep] = useState<Step>(searchParams.get("autoOpen") === "true" ? "form" : "closed")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Customer & Event state
  const [customer, setCustomer] = useState<Customer>({})
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    eventType: "",
    eventDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    participants: 10,
  })

  // Quote & Policy state
  const [quote, setQuote] = useState<Quote | null>(null)
  const [policy, setPolicy] = useState<Policy | null>(null)

  // Payment state
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [cardName, setCardName] = useState("")

  // ============= PostMessage Communication =============

  const sendMessage = useCallback((type: string, payload: unknown = null) => {
    if (typeof window === "undefined") return
    window.parent.postMessage(
      { type, payload, widgetId: config.widgetId },
      "*"
    )
  }, [config.widgetId])

  // Listen for messages from parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.widgetId !== config.widgetId) return

      switch (event.data.type) {
        case "WIDGET_OPEN":
          setStep("form")
          if (event.data.payload?.customer) {
            setCustomer(event.data.payload.customer)
          }
          if (event.data.payload?.event) {
            setEventDetails(prev => ({ ...prev, ...event.data.payload.event }))
          }
          break
        case "WIDGET_CLOSE":
          setStep("closed")
          break
        case "SET_CUSTOMER":
          setCustomer(event.data.payload)
          break
        case "SET_EVENT_DETAILS":
          setEventDetails(prev => ({ ...prev, ...event.data.payload }))
          break
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [config.widgetId])

  // Notify parent when ready
  useEffect(() => {
    sendMessage("WIDGET_READY")
  }, [sendMessage])

  // ============= Handlers =============

  const handleOpen = useCallback(() => {
    setStep("form")
    sendMessage("WIDGET_OPEN")
  }, [sendMessage])

  const handleClose = useCallback(() => {
    setStep("closed")
    setError(null)
    sendMessage("WIDGET_CLOSE")
  }, [sendMessage])

  const handleGetQuote = useCallback(async () => {
    if (!eventDetails.eventType || !eventDetails.eventDate || !eventDetails.participants) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setError(null)
    sendMessage("QUOTE_START", { eventDetails })

    try {
      // Call quote API
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId: config.partnerId,
          eventType: eventDetails.eventType,
          eventDate: eventDetails.eventDate,
          participants: eventDetails.participants,
          location: eventDetails.location,
          coverageType: "liability",
          testMode: config.testMode,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get quote")
      }

      const data = await response.json()
      setQuote(data.quote)
      setStep("quote")
      sendMessage("QUOTE_COMPLETE", data.quote)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to get quote"
      setError(errorMsg)
      sendMessage("QUOTE_ERROR", { code: "QUOTE_FAILED", message: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }, [eventDetails, config.partnerId, config.testMode, sendMessage])

  const handlePayment = useCallback(async () => {
    if (!quote) return

    setIsLoading(true)
    setError(null)
    sendMessage("PAYMENT_START", { quoteId: quote.id })

    try {
      // Process payment
      const response = await fetch("/api/policies/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: quote.id,
          customer: {
            ...customer,
            name: cardName || customer.name,
          },
          paymentMethod: config.testMode ? "test" : "stripe",
          testMode: config.testMode,
        }),
      })

      if (!response.ok) {
        throw new Error("Payment failed")
      }

      const data = await response.json()
      setPolicy(data.policy)
      setStep("success")
      sendMessage("POLICY_PURCHASED", data.policy)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Payment failed"
      setError(errorMsg)
      sendMessage("PAYMENT_ERROR", { code: "PAYMENT_FAILED", message: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }, [quote, customer, cardName, config.testMode, sendMessage])

  // ============= Theme Styles =============

  const primaryColor = config.theme?.primaryColor || config.primaryColor
  const themeStyles = {
    "--primary": primaryColor,
    "--primary-hover": config.theme?.primaryHover || adjustColor(primaryColor, -10),
    "--bg": config.theme?.backgroundColor || "#ffffff",
    "--text": config.theme?.textColor || "#1f2937",
    "--text-secondary": config.theme?.secondaryText || "#6b7280",
    "--border": config.theme?.borderColor || "#e5e7eb",
    "--success": config.theme?.successColor || "#10b981",
    "--error": config.theme?.errorColor || "#ef4444",
    "--radius": config.theme?.borderRadius || "12px",
  } as React.CSSProperties

  // ============= Render =============

  // Floating button (closed state)
  if (step === "closed" && config.mode === "floating") {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleOpen}
        className="fixed w-[60px] h-[60px] rounded-full shadow-lg flex items-center justify-center cursor-pointer"
        style={{
          backgroundColor: primaryColor,
          right: config.position === "bottom-right" ? "20px" : "auto",
          left: config.position === "bottom-left" ? "20px" : "auto",
          bottom: "20px",
        }}
      >
        <Shield className="w-6 h-6 text-white" />
      </motion.button>
    )
  }

  return (
    <div
      className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      style={themeStyles}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <span className="font-semibold">Event Insurance</span>
        </div>
        {config.mode === "floating" && (
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Quote Form */}
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900">Get Your Quote</h2>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <select
                  value={eventDetails.eventType}
                  onChange={(e) => setEventDetails(prev => ({ ...prev, eventType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Event Date *
                </label>
                <input
                  type="date"
                  value={eventDetails.eventDate}
                  onChange={(e) => setEventDetails(prev => ({ ...prev, eventDate: e.target.value }))}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="w-4 h-4 inline mr-1" />
                  Number of Participants *
                </label>
                <input
                  type="number"
                  value={eventDetails.participants}
                  onChange={(e) => setEventDetails(prev => ({ ...prev, participants: parseInt(e.target.value) || 0 }))}
                  min={1}
                  max={1000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Location (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={eventDetails.location || ""}
                  onChange={(e) => setEventDetails(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Get Quote Button */}
              <button
                onClick={handleGetQuote}
                disabled={isLoading}
                className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Getting Quote...
                  </>
                ) : (
                  <>
                    Get Quote
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 2: Quote Display */}
          {step === "quote" && quote && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              <button
                onClick={() => setStep("form")}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Quote #{quote.quoteNumber}</span>
                  <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
                    Valid 24 hours
                  </span>
                </div>

                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {quote.currency === "USD" ? "$" : ""}{quote.premium}
                  </div>
                  <div className="text-sm text-gray-600">One-time premium</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Event</span>
                    <span className="font-medium">{quote.eventType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{format(new Date(quote.eventDate), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-medium">{quote.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage</span>
                    <span className="font-medium">{quote.coverageDetails.limit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deductible</span>
                    <span className="font-medium">{quote.coverageDetails.deductible}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Payment
              </button>
            </motion.div>
          )}

          {/* Step 3: Payment Form */}
          {step === "payment" && quote && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              <button
                onClick={() => setStep("quote")}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>

              <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="text-xl font-bold">${quote.premium}</span>
              </div>

              {config.testMode && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                  Test Mode: Use card 4242 4242 4242 4242
                </div>
              )}

              {/* Card Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (for certificate)
                </label>
                <input
                  type="email"
                  value={customer.email || ""}
                  onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5" />
                    Pay ${quote.premium}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Secure payment powered by Stripe
              </p>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === "success" && policy && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>

              <h2 className="text-xl font-semibold text-gray-900">
                You&apos;re Covered!
              </h2>

              <p className="text-gray-600">
                Policy #{policy.policyNumber} has been issued.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                Your certificate has been sent to your email.
              </div>

              {policy.certificateUrl && (
                <a
                  href={policy.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-lg text-white font-semibold transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  Download Certificate
                </a>
              )}

              <button
                onClick={handleClose}
                className="w-full py-2 text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 text-center">
        Protected by Daily Event Insurance
      </div>
    </div>
  )
}

// ============= Utility Functions =============

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + percent))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ""
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    return parts.join(" ")
  } else {
    return value
  }
}

function formatExpiry(value: string): string {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  if (v.length >= 2) {
    return v.substring(0, 2) + "/" + v.substring(2, 4)
  }
  return v
}
