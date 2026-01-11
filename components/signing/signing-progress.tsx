"use client"

import { Check } from "lucide-react"

interface SigningProgressProps {
  documents: Array<{
    type: string
    title: string
    signed: boolean
    required?: boolean
  }>
  currentIndex: number
  onStepClick?: (index: number) => void
}

export function SigningProgress({
  documents,
  currentIndex,
  onStepClick,
}: SigningProgressProps) {
  const requiredDocs = documents.filter(d => d.required !== false)
  const signedCount = requiredDocs.filter(d => d.signed).length
  const totalRequired = requiredDocs.length

  return (
    <div className="w-full">
      {/* Progress summary */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          Document Progress
        </h3>
        <span className="text-sm text-gray-500">
          {signedCount} of {totalRequired} required documents signed
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
          style={{ width: `${(signedCount / totalRequired) * 100}%` }}
        />
      </div>

      {/* Step indicators - horizontal on desktop, vertical on mobile */}
      <div className="hidden sm:flex items-start justify-between relative">
        {/* Connection line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-teal-500 -z-10 transition-all duration-500"
          style={{
            width: `${Math.max(0, ((currentIndex) / (documents.length - 1)) * 100)}%`,
          }}
        />

        {documents.map((doc, index) => {
          const isCompleted = doc.signed
          const isCurrent = index === currentIndex
          const isPast = index < currentIndex

          return (
            <button
              key={doc.type}
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              className={`flex flex-col items-center group ${
                onStepClick ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isCompleted
                    ? "bg-teal-500 text-white"
                    : isCurrent
                    ? "bg-teal-100 text-teal-700 ring-2 ring-teal-500 ring-offset-2"
                    : "bg-gray-200 text-gray-500"
                } ${onStepClick && !isCompleted ? "group-hover:bg-teal-50" : ""}`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-xs text-center max-w-[80px] leading-tight ${
                  isCurrent ? "text-teal-700 font-medium" : "text-gray-500"
                }`}
              >
                {doc.title}
              </span>

              {/* Optional badge */}
              {doc.required === false && (
                <span className="mt-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                  Optional
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Mobile view - vertical list */}
      <div className="sm:hidden space-y-3">
        {documents.map((doc, index) => {
          const isCompleted = doc.signed
          const isCurrent = index === currentIndex

          return (
            <button
              key={doc.type}
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                isCurrent
                  ? "bg-teal-50 border border-teal-200"
                  : "bg-gray-50 border border-transparent"
              } ${onStepClick ? "hover:bg-teal-50/50" : ""}`}
            >
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                  isCompleted
                    ? "bg-teal-500 text-white"
                    : isCurrent
                    ? "bg-teal-100 text-teal-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <span
                  className={`text-sm ${
                    isCurrent ? "text-teal-700 font-medium" : "text-gray-700"
                  }`}
                >
                  {doc.title}
                </span>
                {doc.required === false && (
                  <span className="ml-2 text-xs text-amber-600">Optional</span>
                )}
              </div>

              {/* Status */}
              {isCompleted && (
                <span className="text-xs text-teal-600 font-medium">Signed</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
