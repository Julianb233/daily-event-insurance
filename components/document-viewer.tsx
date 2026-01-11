"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  FileText,
  Check,
  Loader2,
  ChevronDown,
  ScrollText,
  PenLine,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  document: {
    id: string
    type: string
    title: string
    content: string
    version: string
  } | null
  onSign: (documentType: string, signature: string) => Promise<void>
  isSigned?: boolean
}

type SigningStep = "review" | "sign" | "complete"

const stepLabels: Record<SigningStep, string> = {
  review: "Review Document",
  sign: "Sign Document",
  complete: "Complete",
}

export function DocumentViewer({
  isOpen,
  onClose,
  document,
  onSign,
  isSigned = false,
}: DocumentViewerProps) {
  const [signature, setSignature] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<SigningStep>("review")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Reset state when document changes or modal opens
  useEffect(() => {
    if (isOpen && document) {
      setSignature("")
      setAgreed(false)
      setError("")
      setScrollProgress(0)
      setHasScrolledToBottom(false)
      setShowConfetti(false)
      setStep(isSigned ? "complete" : "review")
    }
  }, [isOpen, document, isSigned])

  // Track scroll progress
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current
    const progress = scrollHeight <= clientHeight ? 100 : (scrollTop / (scrollHeight - clientHeight)) * 100
    setScrollProgress(Math.min(100, Math.max(0, progress)))

    // Check if user has scrolled to bottom (within 50px)
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setHasScrolledToBottom(true)
    }
  }, [])

  const handleSign = async () => {
    if (!signature.trim()) {
      setError("Please enter your full name as signature")
      return
    }
    if (!agreed) {
      setError("Please confirm you have read and agree to the document")
      return
    }

    setError("")
    setSigning(true)

    try {
      await onSign(document!.type, signature)
      setShowConfetti(true)
      setStep("complete")

      // Close after showing success
      setTimeout(() => {
        setSignature("")
        setAgreed(false)
        setShowConfetti(false)
        onClose()
      }, 2000)
    } catch {
      setError("Failed to sign document. Please try again.")
    } finally {
      setSigning(false)
    }
  }

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  const goToSignStep = () => {
    if (!hasScrolledToBottom && !isSigned) {
      setError("Please scroll through the entire document before signing")
      scrollToBottom()
      return
    }
    setError("")
    setStep("sign")
  }

  if (!document) return null

  const steps: SigningStep[] = ["review", "sign", "complete"]
  const currentStepIndex = steps.indexOf(step)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-4xl h-[90vh] max-h-[900px] p-0 gap-0 flex flex-col overflow-hidden"
        showCloseButton={false}
      >
        {/* Confetti Animation */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 1,
                    y: -20,
                    x: Math.random() * 100 + "%",
                    scale: Math.random() * 0.5 + 0.5,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: 0,
                    y: "100vh",
                    rotate: Math.random() * 720 - 360,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    ease: "easeOut",
                  }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Header with Progress Steps */}
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-gray-50 to-white">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Document title */}
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    {document.title}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500">Version {document.version}</p>
              </div>
            </div>
          </div>

          {/* Step indicator */}
          {!isSigned && (
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between">
                {steps.map((s, index) => {
                  const isActive = index === currentStepIndex
                  const isCompleted = index < currentStepIndex
                  const Icon =
                    s === "review" ? ScrollText : s === "sign" ? PenLine : CheckCircle2

                  return (
                    <div key={s} className="flex items-center flex-1">
                      <div className="flex items-center gap-2">
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30"
                              : isCompleted
                                ? "bg-teal-100 text-teal-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                          animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </motion.div>
                        <span
                          className={`text-sm font-medium hidden sm:block ${
                            isActive
                              ? "text-teal-600"
                              : isCompleted
                                ? "text-gray-600"
                                : "text-gray-400"
                          }`}
                        >
                          {stepLabels[s]}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-4 transition-colors ${
                            isCompleted ? "bg-teal-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Scroll Progress Bar */}
          {step === "review" && !isSigned && (
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 to-teal-600"
                style={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                {/* Document content */}
                <div
                  ref={contentRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-6 scroll-smooth"
                >
                  <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900">
                    <ReactMarkdown>{document.content}</ReactMarkdown>
                  </div>
                </div>

                {/* Scroll indicator */}
                {!hasScrolledToBottom && scrollProgress < 95 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2"
                  >
                    <button
                      onClick={scrollToBottom}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900/90 text-white rounded-full text-sm font-medium shadow-lg hover:bg-gray-800 transition-colors backdrop-blur-sm"
                    >
                      <span>Scroll to continue</span>
                      <ChevronDown className="w-4 h-4 animate-bounce" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === "sign" && (
              <motion.div
                key="sign"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col items-center justify-center p-6"
              >
                <div className="w-full max-w-md space-y-6">
                  {/* Icon */}
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-xl shadow-teal-500/30 mb-4">
                      <PenLine className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Sign {document.title}
                    </h2>
                    <p className="text-gray-500">
                      Type your full legal name below to electronically sign this document.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Agreement checkbox */}
                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-100 cursor-pointer hover:border-teal-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      I have read and understand this document, and I agree to be bound by
                      its terms and conditions.
                    </span>
                  </label>

                  {/* Signature input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Your Signature
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="Type your full legal name"
                        className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-signature italic text-gray-800 placeholder:font-sans placeholder:not-italic placeholder:text-gray-400"
                        style={{
                          fontFamily: signature
                            ? "var(--font-dancing-script), 'Dancing Script', cursive, serif"
                            : "inherit",
                        }}
                      />
                      {signature && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500"
                        >
                          <PenLine className="w-5 h-5" />
                        </motion.div>
                      )}
                    </div>
                    {signature && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-500"
                      >
                        This signature will be legally binding
                      </motion.p>
                    )}
                  </div>

                  {/* Sign button */}
                  <motion.button
                    onClick={handleSign}
                    disabled={signing || !signature.trim() || !agreed}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {signing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Signing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Sign Document
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-2xl shadow-green-500/40 mb-6"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Document Signed!
                    </h2>
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-gray-500">
                    {document.title} has been successfully signed and recorded.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-4">
          {isSigned ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Document Signed</span>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          ) : step === "review" ? (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {hasScrolledToBottom ? (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <Check className="w-4 h-4" />
                    Document reviewed
                  </span>
                ) : (
                  <span>Scroll to review the full document</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={goToSignStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    hasScrolledToBottom
                      ? "bg-teal-600 text-white shadow-md hover:bg-teal-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  Continue to Sign
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          ) : step === "sign" ? (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep("review")}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Review
              </button>
              {error && (
                <span className="text-sm text-red-500">{error}</span>
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
