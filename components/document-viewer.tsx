"use client"

import { useState, useEffect } from "react"
import { X, FileText, Check, Loader2, Pencil, Type } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { SignaturePad } from "./signing/signature-pad"

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  document: {
    id: string
    type: string
    title: string
    content: string
    version: string
    signedAt?: string
    signedContent?: string
  } | null
  onSign: (documentType: string, signature: string, signatureType?: "text" | "drawn", signatureImage?: string) => Promise<void>
  isSigned?: boolean
  onViewSigned?: () => void
  currentStep?: number
  totalSteps?: number
}

export function DocumentViewer({
  isOpen,
  onClose,
  document,
  onSign,
  isSigned = false,
  onViewSigned,
  currentStep,
  totalSteps,
}: DocumentViewerProps) {
  const [signatureMode, setSignatureMode] = useState<"type" | "draw">("type")
  const [typedSignature, setTypedSignature] = useState("")
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Reset state when document changes
  useEffect(() => {
    if (isOpen) {
      setTypedSignature("")
      setDrawnSignature(null)
      setAgreed(false)
      setError("")
    }
  }, [isOpen, document?.type])

  if (!isOpen || !document) return null

  const hasValidSignature = signatureMode === "type"
    ? typedSignature.trim().length > 0
    : drawnSignature !== null

  const handleSign = async () => {
    if (!hasValidSignature) {
      setError(signatureMode === "type"
        ? "Please enter your full name as signature"
        : "Please draw your signature")
      return
    }
    if (!agreed) {
      setError("Please confirm you have read and agree to the document")
      return
    }

    setError("")
    setSigning(true)

    try {
      const signature = signatureMode === "type" ? typedSignature : "Drawn Signature"
      // Convert internal mode names to API-expected values
      const apiSignatureType = signatureMode === "type" ? "text" : "drawn"
      await onSign(
        document.type,
        signature,
        apiSignatureType,
        signatureMode === "draw" ? drawnSignature! : undefined
      )
      setTypedSignature("")
      setDrawnSignature(null)
      setAgreed(false)
      onClose()
    } catch (err) {
      setError("Failed to sign document. Please try again.")
    } finally {
      setSigning(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Full screen on mobile */}
      <div className={`relative bg-white shadow-2xl flex flex-col ${
        isMobile
          ? "w-full h-full rounded-none"
          : "rounded-xl w-full max-w-3xl max-h-[90vh] m-4"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-900 truncate">{document.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Version {document.version}</span>
                {currentStep !== undefined && totalSteps !== undefined && (
                  <>
                    <span>•</span>
                    <span className="text-teal-600 font-medium">
                      Step {currentStep + 1} of {totalSteps}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
            <ReactMarkdown>{document.content}</ReactMarkdown>
          </div>
        </div>

        {/* Footer - Signature (Sticky on mobile) */}
        <div className={`border-t bg-gray-50 flex-shrink-0 ${
          isMobile ? "rounded-none p-4 pb-safe" : "rounded-b-xl p-4"
        }`}>
          {isSigned ? (
            <div className="flex flex-col items-center gap-3 py-3">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-medium">Document Signed</span>
                {document?.signedAt && (
                  <span className="text-sm text-gray-500 ml-2">
                    on {new Date(document.signedAt).toLocaleString()}
                  </span>
                )}
              </div>
              {onViewSigned && (
                <button
                  onClick={onViewSigned}
                  className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2 min-h-[44px]"
                >
                  <FileText className="w-4 h-4" />
                  View Signed Document
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Signature Mode Toggle */}
              <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setSignatureMode("type")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition min-h-[44px] ${
                    signatureMode === "type"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Type className="w-4 h-4" />
                  Type
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureMode("draw")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition min-h-[44px] ${
                    signatureMode === "draw"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Pencil className="w-4 h-4" />
                  Draw
                </button>
              </div>

              {/* Signature Input Area */}
              {signatureMode === "type" ? (
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Type your full legal name to sign"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base min-h-[44px]"
                />
              ) : (
                <SignaturePad
                  onSignatureChange={setDrawnSignature}
                  disabled={signing}
                />
              )}

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 min-w-[20px]"
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  I have read and understand this document, and I agree to be bound by
                  its terms and conditions.
                </label>
              </div>

              {/* Sign Button */}
              <button
                onClick={handleSign}
                disabled={signing || !hasValidSignature || !agreed}
                className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium min-h-[48px]"
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
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
