"use client"

import { useState, useEffect, useCallback } from "react"
import { Video, Shield, X, Check, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScreenRecordingConsentProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
  onClose: () => void
  partnerName?: string
}

const CONSENT_STORAGE_KEY = "dei_recording_consent"
const CONSENT_SHOWN_KEY = "dei_recording_consent_shown"

export function ScreenRecordingConsent({
  isOpen,
  onAccept,
  onDecline,
  onClose,
  partnerName,
}: ScreenRecordingConsentProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Slight delay for animation
      const timer = setTimeout(() => setIsVisible(true), 10)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleAccept = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CONSENT_STORAGE_KEY, "true")
      localStorage.setItem(CONSENT_SHOWN_KEY, "true")
    }
    onAccept()
    onClose()
  }, [onAccept, onClose])

  const handleDecline = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CONSENT_STORAGE_KEY, "false")
      localStorage.setItem(CONSENT_SHOWN_KEY, "true")
    }
    onDecline()
    onClose()
  }, [onDecline, onClose])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl transform transition-all duration-200",
          isVisible ? "scale-100" : "scale-95"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <Video className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2
                id="consent-title"
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Session Recording
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Help us improve your experience
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {partnerName ? `Hi ${partnerName}! ` : ""}We&apos;d like to record your onboarding session
            to provide better support if you run into any issues.
          </p>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Get faster, more accurate support when you have questions
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                We can see exactly what happened if something goes wrong
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Helps us improve the onboarding experience for everyone
              </p>
            </div>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <Shield className="w-5 h-5 text-zinc-500 dark:text-zinc-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              <p className="font-medium text-zinc-600 dark:text-zinc-300 mb-1">
                Your privacy is protected
              </p>
              <p>
                Sensitive data like passwords and form inputs are automatically masked.
                Recordings are only used for support purposes and are automatically deleted after 90 days.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
          >
            No thanks
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
          >
            Allow recording
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook to manage consent modal display
export function useRecordingConsentModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenShown, setHasBeenShown] = useState(true) // Default true to prevent flash

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shown = localStorage.getItem(CONSENT_SHOWN_KEY)
      setHasBeenShown(shown === "true")
    }
  }, [])

  const showConsentModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const hideConsentModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const checkAndShowConsent = useCallback(() => {
    if (typeof window !== "undefined") {
      const shown = localStorage.getItem(CONSENT_SHOWN_KEY)
      if (shown !== "true") {
        setIsOpen(true)
      }
    }
  }, [])

  const getConsent = useCallback((): boolean | null => {
    if (typeof window === "undefined") return null
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (consent === "true") return true
    if (consent === "false") return false
    return null
  }, [])

  const resetConsent = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CONSENT_STORAGE_KEY)
      localStorage.removeItem(CONSENT_SHOWN_KEY)
      setHasBeenShown(false)
    }
  }, [])

  return {
    isOpen,
    hasBeenShown,
    showConsentModal,
    hideConsentModal,
    checkAndShowConsent,
    getConsent,
    resetConsent,
  }
}

// Optional tooltip component for recording info
export function RecordingInfoTooltip() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        aria-label="Recording information"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900 dark:bg-zinc-800 text-white text-xs rounded-lg shadow-lg z-50">
            <p className="mb-2 font-medium">About session recording</p>
            <p className="text-zinc-300">
              Recording helps our support team assist you better. Passwords and sensitive inputs are automatically hidden.
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-800" />
          </div>
        </>
      )}
    </div>
  )
}
