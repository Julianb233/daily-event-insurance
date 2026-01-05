"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/providers/session-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  CheckCircle2,
  Building2,
  Code2,
  Settings,
  Rocket,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Copy,
  Check,
  Download,
  ExternalLink,
  Phone,
  CreditCard,
  DollarSign,
  Users,
  Sparkles,
  TrendingUp,
  BookOpen,
  Mail,
  Loader2,
  AlertCircle,
  Wand2,
  MessageCircle,
  Bot
} from "lucide-react"
import { RevenueCalculator } from "@/components/revenue-calculator"
import { IntegrationAssistant } from "@/components/onboarding/IntegrationAssistant"

// Validation helpers
const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return "Please enter a valid email address"
  return null
}

const validatePhone = (phone: string): string | null => {
  if (!phone) return "Phone number is required"
  const digitsOnly = phone.replace(/\D/g, "")
  if (digitsOnly.length < 10) return "Please enter a valid phone number"
  return null
}

const validateUrl = (url: string): string | null => {
  if (!url) return null // Optional field
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`)
    return null
  } catch {
    return "Please enter a valid website URL"
  }
}

// Smart defaults based on business type
const businessDefaults: Record<string, {
  products: string[],
  estimatedParticipants: number,
  optInRate: number
}> = {
  gym: { products: ["liability", "equipment"], estimatedParticipants: 500, optInRate: 65 },
  climbing: { products: ["liability", "equipment", "cancellation"], estimatedParticipants: 300, optInRate: 70 },
  yoga: { products: ["liability"], estimatedParticipants: 200, optInRate: 60 },
  rental: { products: ["liability", "equipment"], estimatedParticipants: 400, optInRate: 75 },
  other: { products: ["liability"], estimatedParticipants: 300, optInRate: 65 },
}

// Shared form data interface
interface OnboardingFormData {
  // Step 1: Business Info
  businessName: string
  businessType: string
  address: string
  contactName: string
  email: string
  phone: string
  estimatedCustomers: string
  websiteUrl: string
  directContactName: string
  directContactEmail: string
  directContactPhone: string
  estimatedMonthlyParticipants: string
  estimatedAnnualParticipants: string
  // Step 2: Integration
  integrationType: string
  // Step 3: Customize
  selectedProducts: string[]
  pricing: {
    liability: number
    equipment: number
    cancellation: number
  }
  primaryColor: string
}

interface StepperProps {
  currentStep: number
  totalSteps: number
  formData?: OnboardingFormData
}

function Stepper({ currentStep, totalSteps, formData }: StepperProps) {
  const steps = [
    { number: 1, title: "Customize", icon: Settings },
    { number: 2, title: "Business Info", icon: Building2 },
    { number: 3, title: "Integration", icon: Code2 },
  ]

  // Calculate completion percentage based on filled fields
  const calculateProgress = () => {
    if (!formData) return ((currentStep - 1) / (totalSteps - 1)) * 100

    let filledFields = 0
    let totalFields = 12 // Core required fields

    // Step 1 fields (customize)
    if (formData.selectedProducts.length > 0) filledFields++
    if (formData.primaryColor) filledFields++

    // Step 2 fields (business info) - 6 essential fields
    if (formData.businessName) filledFields++
    if (formData.businessType) filledFields++
    if (formData.contactName) filledFields++
    if (formData.email) filledFields++
    if (formData.phone) filledFields++
    if (formData.websiteUrl) filledFields++

    // Step 3 fields (integration)
    if (formData.integrationType) filledFields++

    // Bonus for optional fields
    if (formData.address) filledFields++
    if (formData.estimatedMonthlyParticipants) filledFields++
    if (formData.estimatedCustomers) filledFields++

    return Math.min(100, (filledFields / totalFields) * 100)
  }

  const progress = calculateProgress()
  const timeRemaining = Math.max(1, Math.ceil((100 - progress) / 25)) // Roughly 1 min per 25%

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {/* Progress Summary */}
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps} • About {timeRemaining} minute{timeRemaining > 1 ? 's' : ''} remaining
        </p>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden max-w-md mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#14B8A6] to-[#0D9488]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% Complete</p>
      </div>

      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#14B8A6] to-[#0D9488]"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between items-start">
          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.number
            const isCurrent = currentStep === step.number

            return (
              <div key={step.number} className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted
                    ? "bg-[#14B8A6] text-white"
                    : isCurrent
                      ? "bg-[#14B8A6] text-white ring-4 ring-[#14B8A6]/20"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                    }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step.number * 0.1 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </motion.div>
                <span className={`text-xs font-medium hidden sm:block ${isCurrent ? "text-[#14B8A6]" : "text-gray-500"
                  }`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Sticky Earnings Preview Banner
function EarningsPreview({ formData }: { formData: OnboardingFormData }) {
  // Calculate estimated monthly earnings based on selections
  const calculateEarnings = () => {
    const monthlyParticipants = parseInt(formData.estimatedMonthlyParticipants) || 500
    const optInRate = formData.businessType
      ? businessDefaults[formData.businessType]?.optInRate || 65
      : 65
    const avgPolicyValue = 4.99
    const commissionRate = 0.40

    const estimatedPolicies = Math.round(monthlyParticipants * (optInRate / 100))
    const estimatedEarnings = estimatedPolicies * avgPolicyValue * commissionRate

    return {
      policies: estimatedPolicies,
      earnings: estimatedEarnings.toFixed(0),
      optInRate,
    }
  }

  const { policies, earnings, optInRate } = calculateEarnings()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto mb-6"
    >
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-teal-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Estimated Monthly Earnings</p>
              <p className="text-xs text-gray-500">
                ~{policies} policies @ {optInRate}% opt-in rate
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#14B8A6]">${earnings}</p>
            <p className="text-xs text-gray-500">passive income</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface Step1Props {
  formData: OnboardingFormData
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>
  onNext: () => void
  onBack: () => void
}

// Inline validation error component
function FieldError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1 text-sm text-red-500 flex items-center gap-1"
    >
      <AlertCircle className="w-3.5 h-3.5" />
      {message}
    </motion.p>
  )
}

function Step1BusinessInfo({ formData, setFormData, onNext, onBack }: Step1Props) {
  const [showOptional, setShowOptional] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isAutoFilling, setIsAutoFilling] = useState(false)

  // Track which fields have been touched (for showing validation)
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // Validation errors (only show for touched fields)
  const errors = {
    businessName: touched.businessName && !formData.businessName ? "Business name is required" : null,
    businessType: touched.businessType && !formData.businessType ? "Please select a business type" : null,
    contactName: touched.contactName && !formData.contactName ? "Contact name is required" : null,
    email: touched.email ? validateEmail(formData.email) : null,
    phone: touched.phone ? validatePhone(formData.phone) : null,
    websiteUrl: touched.websiteUrl ? validateUrl(formData.websiteUrl) : null,
  }

  // Check if essential fields are valid for continue button
  const canContinue =
    formData.businessName &&
    formData.businessType &&
    formData.contactName &&
    formData.email &&
    !validateEmail(formData.email) &&
    formData.phone &&
    !validatePhone(formData.phone)

  // Auto-fill from website (simulated - would call FireCrawl API)
  const handleWebsiteAutoFill = async () => {
    if (!formData.websiteUrl || validateUrl(formData.websiteUrl)) return

    setIsAutoFilling(true)
    try {
      // Call FireCrawl API to extract business info
      const response = await fetch("/api/onboarding/scrape-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.websiteUrl }),
      })

      if (response.ok) {
        const data = await response.json()
        // Auto-populate fields from scraped data
        setFormData(prev => ({
          ...prev,
          businessName: data.businessName || prev.businessName,
          primaryColor: data.primaryColor || prev.primaryColor,
          // Don't overwrite already-filled fields
        }))
      }
    } catch (error) {
      console.error("Auto-fill failed:", error)
    } finally {
      setIsAutoFilling(false)
    }
  }

  // Apply smart defaults when business type changes
  useEffect(() => {
    if (formData.businessType && businessDefaults[formData.businessType]) {
      const defaults = businessDefaults[formData.businessType]
      setFormData(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.length === 1 && prev.selectedProducts[0] === "liability"
          ? defaults.products
          : prev.selectedProducts,
        estimatedMonthlyParticipants: prev.estimatedMonthlyParticipants || String(defaults.estimatedParticipants),
      }))
    }
  }, [formData.businessType, setFormData])

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
            <p className="text-sm text-gray-600">Just 6 quick fields to get started</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Essential Fields - Only 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                onBlur={() => handleBlur("businessName")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all ${errors.businessName ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                placeholder="Peak Performance Gym"
                aria-required="true"
                autoComplete="organization"
              />
              <FieldError message={errors.businessName} />
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-semibold text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                id="businessType"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                onBlur={() => handleBlur("businessType")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all ${errors.businessType ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                aria-required="true"
              >
                <option value="">Select type</option>
                <option value="gym">Gym / Fitness Center</option>
                <option value="climbing">Climbing Facility</option>
                <option value="yoga">Yoga / Pilates Studio</option>
                <option value="rental">Equipment Rental</option>
                <option value="other">Other</option>
              </select>
              <FieldError message={errors.businessType} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                id="contactName"
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                onBlur={() => handleBlur("contactName")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all ${errors.contactName ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                placeholder="John Smith"
                aria-required="true"
                autoComplete="name"
              />
              <FieldError message={errors.contactName} />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => handleBlur("email")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                placeholder="john@example.com"
                aria-required="true"
                autoComplete="email"
              />
              <FieldError message={errors.email} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onBlur={() => handleBlur("phone")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                placeholder="(555) 123-4567"
                aria-required="true"
                autoComplete="tel"
              />
              <FieldError message={errors.phone} />
            </div>

            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                Website URL
              </label>
              <div className="relative">
                <input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  onBlur={() => {
                    handleBlur("websiteUrl")
                    handleWebsiteAutoFill()
                  }}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all ${errors.websiteUrl ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  placeholder="https://yourcompany.com"
                  autoComplete="url"
                />
                {formData.websiteUrl && !errors.websiteUrl && (
                  <button
                    type="button"
                    onClick={handleWebsiteAutoFill}
                    disabled={isAutoFilling}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#14B8A6] transition-colors"
                    title="Auto-fill from website"
                  >
                    {isAutoFilling ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Wand2 className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              <FieldError message={errors.websiteUrl} />
              <p className="text-xs text-gray-500 mt-1">We&apos;ll use this to auto-customize your branding</p>
            </div>
          </div>

          {/* Collapsible Optional Section */}
          <div className="border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors w-full"
            >
              <motion.div
                animate={{ rotate: showOptional ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
              More Details (Optional)
              <span className="text-xs text-gray-400 font-normal ml-2">
                Address, team size, secondary contact
              </span>
            </button>

            <AnimatePresence>
              {showOptional && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 space-y-6">
                    {/* Address */}
                    <div>
                      <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Address
                      </label>
                      <input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all"
                        placeholder="123 Main St, City, State ZIP"
                        autoComplete="street-address"
                      />
                    </div>

                    {/* Business Volume */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="estimatedCustomers" className="block text-sm font-semibold text-gray-700 mb-2">
                          Daily Customers
                        </label>
                        <select
                          id="estimatedCustomers"
                          value={formData.estimatedCustomers}
                          onChange={(e) => setFormData({ ...formData, estimatedCustomers: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all"
                        >
                          <option value="">Select range</option>
                          <option value="1-50">1-50 customers/day</option>
                          <option value="51-100">51-100 customers/day</option>
                          <option value="101-250">101-250 customers/day</option>
                          <option value="250+">250+ customers/day</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="estimatedMonthlyParticipants" className="block text-sm font-semibold text-gray-700 mb-2">
                          Monthly Participants
                        </label>
                        <input
                          id="estimatedMonthlyParticipants"
                          type="number"
                          min="0"
                          value={formData.estimatedMonthlyParticipants}
                          onChange={(e) => setFormData({ ...formData, estimatedMonthlyParticipants: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all"
                          placeholder="1000"
                        />
                        <p className="text-xs text-gray-500 mt-1">Used for revenue estimates</p>
                      </div>
                    </div>

                    {/* Secondary Contact */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Secondary Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={formData.directContactName}
                          onChange={(e) => setFormData({ ...formData, directContactName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all text-sm"
                          placeholder="Name"
                          autoComplete="name"
                        />
                        <input
                          type="email"
                          value={formData.directContactEmail}
                          onChange={(e) => setFormData({ ...formData, directContactEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all text-sm"
                          placeholder="Email"
                          autoComplete="email"
                        />
                        <input
                          type="tel"
                          value={formData.directContactPhone}
                          onChange={(e) => setFormData({ ...formData, directContactPhone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none transition-all text-sm"
                          placeholder="Phone"
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            aria-label="Go back to customize coverage"
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: canContinue ? 1.02 : 1 }}
            whileTap={{ scale: canContinue ? 0.98 : 1 }}
            onClick={() => {
              // Touch all fields to show validation
              setTouched({
                businessName: true,
                businessType: true,
                contactName: true,
                email: true,
                phone: true,
                websiteUrl: true,
              })
              if (canContinue) onNext()
            }}
            aria-label="Continue to integration selection"
            className={`flex items-center gap-2 px-8 py-3 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 ${canContinue
              ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white hover:shadow-lg"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            Continue
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

interface Step2Props {
  formData: OnboardingFormData
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>
  onNext: () => void
  onBack: () => void
  isSubmitting?: boolean
}

function Step2Integration({ formData, setFormData, onNext, onBack, isSubmitting }: Step2Props) {
  const [copied, setCopied] = useState(false)
  const selectedIntegration = formData.integrationType
  const setSelectedIntegration = (value: string) => setFormData(prev => ({ ...prev, integrationType: value }))

  const widgetCode = `<script src="https://cdn.dailyeventinsurance.com/widget.js"></script>
<div id="dei-widget" data-partner-id="YOUR_ID"></div>`

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const integrationOptions = [
    {
      id: "widget",
      name: "Widget Embed",
      description: "Simple copy-paste widget for your website",
      difficulty: "Easiest",
      time: "5 minutes",
      recommended: true,
    },
    {
      id: "api",
      name: "API Integration",
      description: "Full control with RESTful API",
      difficulty: "Advanced",
      time: "1-2 hours",
      recommended: false,
    },
    {
      id: "manual",
      name: "Manual Portal",
      description: "Use our partner dashboard to process claims",
      difficulty: "No code",
      time: "Instant",
      recommended: false,
    },
  ]

  const posIntegrations = [
    { name: "Mindbody", logo: "💪" },
    { name: "Zen Planner", logo: "🧘" },
    { name: "ClimbingGym Pro", logo: "🧗" },
    { name: "Square", logo: "⬜" },
    { name: "Custom API", logo: "⚙️" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Integration</h2>
            <p className="text-sm text-gray-600">Select how you want to connect with us</p>
          </div>
        </div>

        <div
          className="space-y-4 mb-8"
          role="radiogroup"
          aria-label="Integration method selection"
          aria-describedby="integration-hint"
        >
          <span id="integration-hint" className="sr-only">
            Use arrow keys to navigate between options, Enter or Space to select
          </span>
          {integrationOptions.map((option, index) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedIntegration(option.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setSelectedIntegration(option.id)
                } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                  e.preventDefault()
                  const nextIndex = (index + 1) % integrationOptions.length
                  const nextElement = document.getElementById(`integration-${integrationOptions[nextIndex].id}`)
                  nextElement?.focus()
                } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                  e.preventDefault()
                  const prevIndex = (index - 1 + integrationOptions.length) % integrationOptions.length
                  const prevElement = document.getElementById(`integration-${integrationOptions[prevIndex].id}`)
                  prevElement?.focus()
                }
              }}
              id={`integration-${option.id}`}
              role="radio"
              aria-checked={selectedIntegration === option.id}
              tabIndex={selectedIntegration === option.id ? 0 : -1}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 ${selectedIntegration === option.id
                ? "border-[#14B8A6] bg-[#14B8A6]/5"
                : "border-gray-200 hover:border-[#14B8A6]/50"
                }`}
            >
              {option.recommended && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white text-xs font-bold rounded-full">
                  Recommended
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{option.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-gray-500">
                      Difficulty: <span className="font-semibold text-[#14B8A6]">{option.difficulty}</span>
                    </span>
                    <span className="text-gray-500">
                      Setup Time: <span className="font-semibold text-[#14B8A6]">{option.time}</span>
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedIntegration === option.id
                    ? "border-[#14B8A6] bg-[#14B8A6]"
                    : "border-gray-300"
                    }`}
                  aria-hidden="true"
                >
                  {selectedIntegration === option.id && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedIntegration === "widget" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
          >
            <h3 className="text-sm font-bold text-gray-900 mb-3">Widget Code Snippet</h3>
            <div className="relative">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                <code>{widgetCode}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </motion.div>
        )}

        {selectedIntegration === "api" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
          >
            <h3 className="text-sm font-bold text-gray-900 mb-3">API Documentation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Access our comprehensive API docs to build custom integrations.
            </p>
            <a
              href="/docs/api"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              View API Docs
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        )}

        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Compatible POS Systems</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {posIntegrations.map((pos) => (
              <div
                key={pos.name}
                className="p-4 border border-gray-200 rounded-lg text-center hover:border-[#14B8A6] hover:bg-[#14B8A6]/5 transition-all"
              >
                <div className="text-2xl mb-1">{pos.logo}</div>
                <div className="text-xs font-medium text-gray-700">{pos.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            aria-label="Go back to business information"
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            disabled={!selectedIntegration}
            aria-label="Continue to customize coverage"
            aria-disabled={!selectedIntegration}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2"
          >
            Continue
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

interface Step3Props {
  formData: OnboardingFormData
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>
  onNext: () => void
  onBack: () => void
  isFirstStep?: boolean
}

function Step3Customize({ formData, setFormData, onNext, onBack, isFirstStep }: Step3Props) {
  const selectedProducts = formData.selectedProducts
  const setSelectedProducts = (updater: (prev: string[]) => string[]) => {
    setFormData(prev => ({ ...prev, selectedProducts: updater(prev.selectedProducts) }))
  }
  const pricing = formData.pricing
  const setPricing = (newPricing: typeof formData.pricing) => {
    setFormData(prev => ({ ...prev, pricing: newPricing }))
  }

  const products = [
    {
      id: "liability",
      name: "Liability Coverage",
      description: "Protection against accidents and injuries",
      basePrice: 25,
      commission: 40,
    },
    {
      id: "equipment",
      name: "Equipment Protection",
      description: "Coverage for damaged or lost rental equipment",
      basePrice: 15,
      commission: 35,
    },
    {
      id: "cancellation",
      name: "Event Cancellation",
      description: "Refund protection for cancelled events",
      basePrice: 20,
      commission: 30,
    },
  ]

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const calculateCommission = (basePrice: number, commissionRate: number) => {
    return (basePrice * (commissionRate / 100)).toFixed(2)
  }

  const totalMonthlyRevenue = selectedProducts.reduce((total, productId) => {
    const product = products.find(p => p.id === productId)
    if (!product) return total
    return total + (Number(calculateCommission(pricing[productId as keyof typeof pricing], product.commission)) * 30)
  }, 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customize Your Coverage</h2>
            <p className="text-sm text-gray-600">Select products and set your pricing</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {products.map((product) => {
            const isSelected = selectedProducts.includes(product.id)
            const commission = calculateCommission(pricing[product.id as keyof typeof pricing], product.commission)

            return (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.01 }}
                className={`p-6 border-2 rounded-xl transition-all ${isSelected
                  ? "border-[#14B8A6] bg-[#14B8A6]/5"
                  : "border-gray-200"
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleProduct(product.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      aria-label={`${isSelected ? "Deselect" : "Select"} ${product.name}`}
                      className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 ${isSelected
                        ? "border-[#14B8A6] bg-[#14B8A6]"
                        : "border-gray-300"
                        }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" aria-hidden="true" />}
                    </button>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-9 space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`price-${product.id}`}
                          className="block text-xs font-semibold text-gray-700 mb-2"
                        >
                          Customer Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true">$</span>
                          <input
                            id={`price-${product.id}`}
                            type="number"
                            value={pricing[product.id as keyof typeof pricing]}
                            onChange={(e) => setPricing({ ...pricing, [product.id]: Number(e.target.value) })}
                            aria-label={`Customer price for ${product.name} in dollars`}
                            min="0"
                            step="1"
                            className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-gray-700 mb-2">
                          Your Commission ({product.commission}%)
                        </span>
                        <div
                          className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 font-bold"
                          role="status"
                          aria-label={`Your commission for ${product.name}: ${commission} dollars`}
                        >
                          ${commission}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="mb-8 p-6 bg-gradient-to-br from-[#14B8A6]/10 to-[#0D9488]/10 rounded-xl border border-[#14B8A6]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Estimated Monthly Revenue</h3>
              <p className="text-xs text-gray-600">Based on 30 sales per product/month</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#14B8A6]">
                ${totalMonthlyRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Passive income potential</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Brand Customization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="primaryColor" className="block text-xs font-semibold text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  id="primaryColorPicker"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  aria-label="Select brand primary color"
                  className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2"
                />
                <input
                  id="primaryColor"
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  aria-label="Enter brand primary color hex code"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="logoUpload" className="block text-xs font-semibold text-gray-700 mb-2">
                Upload Logo
              </label>
              <button
                id="logoUpload"
                type="button"
                aria-label="Upload your business logo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-gray-600 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2"
              >
                <span>Choose file...</span>
                <Download className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className={`flex ${isFirstStep ? 'justify-end' : 'justify-between'}`}>
          {!isFirstStep && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              aria-label="Go back to previous step"
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              Back
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            aria-label="Continue to business information"
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-lg hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2"
          >
            Continue
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

interface Step4Props {
  formData: OnboardingFormData
  onBack: () => void
  onComplete: () => Promise<void>
  isSubmitting: boolean
}

function Step4GoLive({ formData, onBack, onComplete, isSubmitting }: Step4Props) {
  const [checklist, setChecklist] = useState({
    testTransaction: false,
    staffTraining: false,
    marketingMaterials: false,
    supportContact: false,
  })

  const checklistItems = [
    {
      id: "testTransaction",
      title: "Complete Test Transaction",
      description: "Process a test insurance purchase to verify integration",
      icon: CreditCard,
      action: "Start Test",
    },
    {
      id: "staffTraining",
      title: "Staff Training Resources",
      description: "Access training videos and documentation for your team",
      icon: BookOpen,
      action: "View Training",
    },
    {
      id: "marketingMaterials",
      title: "Download Marketing Materials",
      description: "Get posters, email templates, and social media content",
      icon: Download,
      action: "Download Kit",
    },
    {
      id: "supportContact",
      title: "Save Support Contact",
      description: "Add our support team to your contacts for quick help",
      icon: Phone,
      action: "Add Contact",
    },
  ]

  const allCompleted = Object.values(checklist).every(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Go Live Checklist</h2>
            <p className="text-sm text-gray-600">Complete these steps to start earning</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {checklistItems.map((item) => {
            const Icon = item.icon
            const isCompleted = checklist[item.id as keyof typeof checklist]

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className={`p-6 border-2 rounded-xl transition-all ${isCompleted
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isCompleted ? "bg-green-500" : "bg-gray-100"
                    }`}>
                    <Icon className={`w-6 h-6 ${isCompleted ? "text-white" : "text-gray-600"
                      }`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>

                      <button
                        onClick={() => setChecklist({ ...checklist, [item.id]: !isCompleted })}
                        role="checkbox"
                        aria-checked={isCompleted}
                        aria-label={`Mark ${item.title} as ${isCompleted ? "incomplete" : "complete"}`}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isCompleted
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                          }`}
                      >
                        {isCompleted && <Check className="w-4 h-4 text-white" aria-hidden="true" />}
                      </button>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => setChecklist({ ...checklist, [item.id]: true })}
                        aria-label={`${item.action} for ${item.title}`}
                        className="mt-3 px-4 py-2 bg-[#14B8A6] text-white text-sm font-semibold rounded-lg hover:bg-[#0D9488] transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2"
                      >
                        {item.action}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="text-sm font-bold text-blue-900 mb-1">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Our support team is here to help you get started.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:support@dailyeventinsurance.com"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  support@dailyeventinsurance.com
                </a>
                <span className="text-blue-400">•</span>
                <a
                  href="tel:1-800-123-4567"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  1-800-123-4567
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            onClick={onBack}
            disabled={isSubmitting}
            aria-label="Go back to customize coverage"
            aria-disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: allCompleted && !isSubmitting ? 1.02 : 1 }}
            whileTap={{ scale: allCompleted && !isSubmitting ? 0.98 : 1 }}
            onClick={onComplete}
            disabled={!allCompleted || isSubmitting}
            aria-label={isSubmitting ? "Setting up your partner account" : "Complete setup and go live"}
            aria-disabled={!allCompleted || isSubmitting}
            aria-busy={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                Setting up...
              </>
            ) : (
              <>
                Complete Setup
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-[#14B8A6]" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          You&apos;re Ready to Start Earning!
        </h1>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Congratulations! Your account is set up and you can now start offering insurance to your customers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <DollarSign className="w-8 h-8 mb-3 mx-auto" />
            <div className="text-2xl font-bold mb-1">40%</div>
            <div className="text-sm text-white/80">Commission Rate</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <Users className="w-8 h-8 mb-3 mx-auto" />
            <div className="text-2xl font-bold mb-1">1,000+</div>
            <div className="text-sm text-white/80">Partner Locations</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <TrendingUp className="w-8 h-8 mb-3 mx-auto" />
            <div className="text-2xl font-bold mb-1">$2.5K</div>
            <div className="text-sm text-white/80">Avg Monthly Revenue</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="/partner/dashboard"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-white text-[#14B8A6] font-bold rounded-lg hover:bg-gray-50 transition-all shadow-lg"
          >
            Go to Partner Dashboard
          </motion.a>

          <motion.a
            href="/partner/materials"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/20 transition-all border-2 border-white/20"
          >
            View Materials Library
          </motion.a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-sm text-white/80 mb-2">
            Questions? Our team is here to help
          </p>
          <a
            href="mailto:support@dailyeventinsurance.com"
            className="text-sm font-semibold hover:underline"
          >
            support@dailyeventinsurance.com
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function OnboardingForm() {
  const router = useRouter()
  const { data: session, refresh: updateSession } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null)

  // Shared form data across all steps
  const [formData, setFormData] = useState<OnboardingFormData>({
    businessName: "",
    businessType: "",
    address: "",
    contactName: "",
    email: "",
    phone: "",
    estimatedCustomers: "",
    websiteUrl: "",
    directContactName: "",
    directContactEmail: "",
    directContactPhone: "",
    estimatedMonthlyParticipants: "",
    estimatedAnnualParticipants: "",
    integrationType: "",
    selectedProducts: ["liability"],
    pricing: {
      liability: 25,
      equipment: 15,
      cancellation: 20,
    },
    primaryColor: "#14B8A6",
  })

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Create partner in database via API
      const response = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: formData.businessName,
          business_type: formData.businessType,
          business_address: formData.address,
          contact_name: formData.contactName,
          contact_email: formData.email,
          contact_phone: formData.phone,
          estimated_daily_customers: formData.estimatedCustomers,
          website_url: formData.websiteUrl || undefined,
          direct_contact_name: formData.directContactName || undefined,
          direct_contact_email: formData.directContactEmail || undefined,
          direct_contact_phone: formData.directContactPhone || undefined,
          estimated_monthly_participants: formData.estimatedMonthlyParticipants ? parseInt(formData.estimatedMonthlyParticipants) : undefined,
          estimated_annual_participants: formData.estimatedAnnualParticipants ? parseInt(formData.estimatedAnnualParticipants) : undefined,
          integration_type: formData.integrationType,
          primary_color: formData.primaryColor,
          products: formData.selectedProducts.map(productId => ({
            product_type: productId,
            is_enabled: true,
            customer_price: formData.pricing[productId as keyof typeof formData.pricing],
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create partner account")
      }

      // 2. Refresh session to get updated role (set by api/partner)
      await updateSession()

      // Wait a brief moment for the session to fully propagate
      await new Promise(resolve => setTimeout(resolve, 500))

      // 3. Show success state briefly then redirect
      setIsComplete(true)

      // Redirect to partner dashboard after 2 seconds
      // Session is now guaranteed to have the updated role
      setTimeout(() => {
        router.push("/onboarding/documents")
      }, 2000)

    } catch (err) {
      console.error("Onboarding error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during setup")
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="pt-32 pb-20 px-4">
        {/* Welcome Section */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#14B8A6] to-[#0D9488] bg-clip-text text-transparent">
                Daily Event Insurance
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let&apos;s get you set up in just a few minutes. Complete each step to start offering insurance to your customers.
            </p>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Revenue Calculator - Show on Integration step (step 3) */}
        {!isComplete && currentStep === 3 && <RevenueCalculator />}

        {/* Stepper */}
        {!isComplete && <Stepper currentStep={currentStep} totalSteps={3} formData={formData} />}

        {/* Earnings Preview - Show on steps 2-4 */}
        {!isComplete && currentStep >= 2 && <EarningsPreview formData={formData} />}

        {/* Steps */}
        <AnimatePresence mode="wait">
          {!isComplete && (
            <>
              {/* Step 1: Customize - Show what they can offer first */}
              {currentStep === 1 && (
                <Step3Customize
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={() => { }} // No back on first step
                  isFirstStep={true}
                />
              )}
              {/* Step 2: Business Info */}
              {currentStep === 2 && (
                <Step1BusinessInfo
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {/* Step 3: Integration - with Revenue Calculator */}
              {currentStep === 3 && (
                <Step2Integration
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleComplete}
                  onBack={handleBack}
                  isSubmitting={isSubmitting} // Pass submitting state
                />
              )}
            </>
          )}

          {isComplete && <SuccessState />}
        </AnimatePresence>

        {/* AI Integration Assistant - Show on Integration step */}
        {!isComplete && currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mt-8"
          >
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Need Help With Integration?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our AI assistant can help you integrate with Mindbody, Shopify, Square, Stripe, and more.
                    Get step-by-step guidance and custom code snippets for your platform.
                  </p>
                  <button
                    onClick={() => setShowAIAssistant(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat with AI Assistant
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />

      {/* AI Integration Assistant Chat Widget */}
      <IntegrationAssistant
        partnerId={formData.businessName ? formData.businessName.toLowerCase().replace(/\s+/g, "-") : undefined}
        partnerName={formData.businessName || undefined}
        businessType={formData.businessType || undefined}
        isOpen={showAIAssistant}
        onOpenChange={setShowAIAssistant}
        onPlatformDetected={(platform) => {
          setDetectedPlatform(platform)
          // Auto-select appropriate integration type based on platform
          if (platform === "generic-widget") {
            setFormData(prev => ({ ...prev, integrationType: "widget" }))
          } else if (["mindbody", "zen-planner", "square", "stripe", "shopify", "woocommerce"].includes(platform)) {
            setFormData(prev => ({ ...prev, integrationType: "api" }))
          }
        }}
      />
    </main>
  )
}
