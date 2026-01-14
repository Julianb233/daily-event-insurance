"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react"
import { QuoteRequestForm } from "@/components/partner/QuoteRequestForm"
import { IntegrationChatWidget } from "@/components/support/IntegrationChatWidget"

export default function NewQuotePage() {
  const router = useRouter()
  const [createdQuote, setCreatedQuote] = useState<any>(null)

  const handleQuoteCreated = (quote: any) => {
    setCreatedQuote(quote)
    // Redirect to quotes list after 3 seconds
    setTimeout(() => {
      router.push("/partner/quotes")
    }, 3000)
  }

  if (createdQuote) {
    return (
      <div className="p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 shadow-lg border-2 border-green-200 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-green-900 mb-2">Quote Created Successfully!</h2>
            <p className="text-green-700 mb-6">
              Quote {createdQuote.quote_number} has been created and is ready to share with your
              customer.
            </p>

            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Quote Number:</span>
                  <span className="font-bold text-slate-900">{createdQuote.quote_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Event:</span>
                  <span className="font-semibold text-slate-900">{createdQuote.event_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Premium:</span>
                  <span className="font-bold text-teal-600">
                    ${Number(createdQuote.premium).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Your Commission:</span>
                  <span className="font-bold text-green-600">
                    ${Number(createdQuote.commission).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4">Redirecting to quotes page...</p>

            <button
              onClick={() => router.push("/partner/quotes")}
              className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
            >
              View All Quotes
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-teal-600" />
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Create New Quote</h1>
        </div>
        <p className="text-slate-600">
          Generate a new insurance quote for your customer with instant pricing and risk assessment
        </p>
      </div>

      {/* Form */}
      <div className="max-w-5xl">
        <QuoteRequestForm onQuoteCreated={handleQuoteCreated} />
      </div>

      {/* Help Text */}
      <div className="max-w-5xl mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Fill in the event details to see live pricing preview</li>
          <li>• Risk assessment is calculated automatically based on event characteristics</li>
          <li>• Customer information is optional but recommended for record keeping</li>
          <li>• Quotes are valid for 30 days by default</li>
          <li>• You can convert accepted quotes to active policies from the quotes page</li>
        </ul>
      </div>

      <IntegrationChatWidget topic="troubleshooting" />
    </div>
  )
}
