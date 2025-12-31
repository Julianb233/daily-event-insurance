"use client"

import { useState } from "react"
import { X, FileText, Check, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

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

  if (!isOpen || !document) return null

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
      await onSign(document.type, signature)
      setSignature("")
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

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] m-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{document.title}</h2>
              <p className="text-sm text-gray-500">Version {document.version}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
            <ReactMarkdown>{document.content}</ReactMarkdown>
          </div>
        </div>

        {/* Footer - Signature */}
        <div className="border-t p-4 bg-gray-50 rounded-b-xl">
          {isSigned ? (
            <div className="flex items-center justify-center gap-2 py-3 text-green-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">Document Signed</span>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  I have read and understand this document, and I agree to be bound by
                  its terms and conditions.
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Type your full legal name to sign"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <button
                  onClick={handleSign}
                  disabled={signing || !signature.trim() || !agreed}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {signing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Sign Document
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
