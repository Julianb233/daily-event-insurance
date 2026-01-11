"use client"

import { useState } from "react"
import { Check, Download, Mail, X, Loader2, PartyPopper } from "lucide-react"

interface SigningConfirmationProps {
  isOpen: boolean
  onClose: () => void
  signedDocuments: Array<{
    type: string
    title: string
    signedAt: string
  }>
  partnerEmail: string
  partnerId: string
  onContinue?: () => void
}

export function SigningConfirmation({
  isOpen,
  onClose,
  signedDocuments,
  partnerEmail,
  partnerId,
  onContinue,
}: SigningConfirmationProps) {
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [pdfDownloaded, setPdfDownloaded] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true)
    setError("")

    try {
      const response = await fetch("/api/documents/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId,
          documentTypes: signedDocuments.map(d => d.type),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `signed-documents-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setPdfDownloaded(true)
    } catch (err) {
      setError("Failed to download PDF. Please try again.")
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleSendEmail = async () => {
    setSendingEmail(true)
    setError("")

    try {
      const response = await fetch("/api/documents/confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId,
          documentTypes: signedDocuments.map(d => d.type),
          recipientEmail: partnerEmail,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      setEmailSent(true)
    } catch (err) {
      setError("Failed to send email. Please try again.")
    } finally {
      setSendingEmail(false)
    }
  }

  const handleContinue = () => {
    onClose()
    onContinue?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Documents Signed!</h2>
          <p className="text-teal-100">
            You have successfully signed all required documents.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Signed Documents List */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Signed Documents ({signedDocuments.length})
            </h3>
            <div className="space-y-2">
              {signedDocuments.map((doc) => (
                <div
                  key={doc.type}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Signed {new Date(doc.signedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium disabled:opacity-50"
            >
              {downloadingPdf ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : pdfDownloaded ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {pdfDownloaded ? "PDF Downloaded" : "Download PDF Copy"}
            </button>

            <button
              onClick={handleSendEmail}
              disabled={sendingEmail || emailSent}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium disabled:opacity-50"
            >
              {sendingEmail ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : emailSent ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Mail className="w-5 h-5" />
              )}
              {emailSent ? `Email Sent to ${partnerEmail}` : "Send Email Confirmation"}
            </button>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
          >
            Continue to Dashboard
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
