"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/providers/session-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { DocumentViewer } from "@/components/document-viewer"
import { DOCUMENT_TYPES } from "@/lib/demo-documents"
import {
  FileText,
  CheckCircle2,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
  Receipt,
  Building2,
  Handshake,
  Shield,
  Award,
  Sparkles,
  PartyPopper,
  Eye,
} from "lucide-react"

interface DocumentTemplate {
  id: string
  type: string
  title: string
  content: string
  version: string
}

interface DocumentStatus {
  signed: boolean
  signedAt?: string
}

const documentIcons: Record<string, React.ElementType> = {
  [DOCUMENT_TYPES.PARTNER_AGREEMENT]: Building2,
  [DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT]: Handshake,
  [DOCUMENT_TYPES.MUTUAL_NDA]: Shield,
  [DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT]: Award,
  [DOCUMENT_TYPES.W9]: Receipt,
  [DOCUMENT_TYPES.DIRECT_DEPOSIT]: FileText,
}

const documentDescriptions: Record<string, string> = {
  [DOCUMENT_TYPES.PARTNER_AGREEMENT]: "Core partnership terms and revenue sharing",
  [DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT]: "Co-marketing rights and obligations",
  [DOCUMENT_TYPES.MUTUAL_NDA]: "Confidentiality protections for both parties",
  [DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT]: "Sponsorship terms with Mutual of Omaha",
  [DOCUMENT_TYPES.W9]: "Tax identification for commission payments",
  [DOCUMENT_TYPES.DIRECT_DEPOSIT]: "Bank details for automatic payments",
}

export default function OnboardingDocumentsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, DocumentStatus>>({})
  const [selectedDocument, setSelectedDocument] = useState<DocumentTemplate | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Fetch templates and partner info on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // First, fetch partner info
        const partnerRes = await fetch("/api/partner")
        let currentPartnerId: string | null = null

        if (partnerRes.ok) {
          const partnerData = await partnerRes.json()
          if (partnerData.partner) {
            currentPartnerId = partnerData.partner.id
            setPartnerId(currentPartnerId)

            // Fetch document signing status
            const statusRes = await fetch(`/api/documents/sign?partnerId=${currentPartnerId}`)
            const statusData = await statusRes.json()

            if (statusData.success) {
              setDocumentStatuses(statusData.documents)
            }
          }
        }

        // Fetch document templates (with partner data for auto-population if available)
        const templatesUrl = currentPartnerId
          ? `/api/documents/templates?partnerId=${currentPartnerId}`
          : "/api/documents/templates"
        const templatesRes = await fetch(templatesUrl)
        const templatesData = await templatesRes.json()

        if (templatesData.success) {
          setTemplates(templatesData.templates)
        } else {
          throw new Error("Failed to load document templates")
        }
      } catch (err) {
        console.error("Error loading documents:", err)
        setError("Failed to load documents. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSign = async (documentType: string, signature: string) => {
    if (!partnerId) {
      throw new Error("Partner ID not found. Please complete registration first.")
    }

    const response = await fetch("/api/documents/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerId,
        documentType,
        signature,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to sign document")
    }

    // Update local state
    setDocumentStatuses((prev) => ({
      ...prev,
      [documentType]: { signed: true, signedAt: new Date().toISOString() },
    }))

    // Check if this was the last required document
    const requiredTypes = templates
      .filter(t => !isOptional(t.type))
      .map(t => t.type)

    const newStatuses = {
      ...documentStatuses,
      [documentType]: { signed: true, signedAt: new Date().toISOString() },
    }

    const allRequiredSigned = requiredTypes.every(type => newStatuses[type]?.signed)

    if (allRequiredSigned && !isRequiredComplete) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  const isOptional = (type: string) => {
    return type === DOCUMENT_TYPES.W9 || type === DOCUMENT_TYPES.DIRECT_DEPOSIT
  }

  const requiredDocuments = templates.filter(t => !isOptional(t.type))
  const optionalDocuments = templates.filter(t => isOptional(t.type))
  const requiredSignedCount = requiredDocuments.filter(t => documentStatuses[t.type]?.signed).length
  const isRequiredComplete = requiredDocuments.length > 0 && requiredDocuments.every(t => documentStatuses[t.type]?.signed)

  const totalSignedCount = templates.filter(t => documentStatuses[t.type]?.signed).length

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
        <Header />
        <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Documents</h2>
            <p className="text-gray-500">Please wait while we prepare your agreements...</p>
          </motion.div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
        <Header />
        <div className="pt-32 pb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/30">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Documents</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all"
            >
              Try Again
            </button>
          </motion.div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      <Header />

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/30"
              >
                <PartyPopper className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Required Documents Signed!</h2>
              <p className="text-gray-500">You&apos;re ready to access your partner dashboard</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-28 pb-20 px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            <span>Partner Onboarding</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Review & Sign Your{" "}
            <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
              Agreements
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Please review and electronically sign the following documents to complete your partner setup.
            Required documents must be signed before accessing your dashboard.
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-10"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Signing Progress</h2>
                <p className="text-sm text-gray-500">
                  {isRequiredComplete
                    ? "All required documents signed!"
                    : `${requiredDocuments.length - requiredSignedCount} required document${requiredDocuments.length - requiredSignedCount !== 1 ? "s" : ""} remaining`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-bold text-teal-600">
                    {requiredSignedCount}/{requiredDocuments.length}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Required</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-400">
                    {totalSignedCount}/{templates.length}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(requiredSignedCount / requiredDocuments.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              {/* Milestone markers */}
              <div className="absolute inset-x-0 top-0 flex justify-between pointer-events-none">
                {requiredDocuments.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                      idx < requiredSignedCount ? "bg-teal-500" : "bg-gray-200"
                    }`}
                    style={{ marginLeft: idx === 0 ? 0 : -6 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Required Documents Section */}
        <div className="max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">!</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
            <span className="text-sm text-gray-500">
              ({requiredSignedCount} of {requiredDocuments.length} signed)
            </span>
          </motion.div>

          <div className="space-y-4">
            {requiredDocuments.map((template, index) => {
              const Icon = documentIcons[template.type] || FileText
              const status = documentStatuses[template.type]
              const isSigned = status?.signed

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`group bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-xl ${
                    isSigned
                      ? "border-green-200 bg-gradient-to-r from-green-50/50 to-white"
                      : "border-gray-100 hover:border-teal-200"
                  }`}
                >
                  <div className="p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                          isSigned
                            ? "bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-500/20"
                            : "bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/20 group-hover:scale-105"
                        }`}
                      >
                        {isSigned ? (
                          <CheckCircle2 className="w-7 h-7 text-white" />
                        ) : (
                          <Icon className="w-7 h-7 text-white" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {template.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {documentDescriptions[template.type] || "Review and sign this document"}
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          {isSigned ? (
                            <span className="flex items-center gap-1.5 text-green-600 font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Signed {status.signedAt && `on ${new Date(status.signedAt).toLocaleDateString()}`}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                              <Clock className="w-4 h-4" />
                              Awaiting signature
                            </span>
                          )}
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-400">v{template.version}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0">
                        <motion.button
                          onClick={() => {
                            setSelectedDocument(template)
                            setIsViewerOpen(true)
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                            isSigned
                              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              : "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40"
                          }`}
                        >
                          {isSigned ? (
                            <>
                              <Eye className="w-4 h-4" />
                              View
                            </>
                          ) : (
                            <>
                              Sign Now
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Optional Documents Section */}
        {optionalDocuments.length > 0 && (
          <div className="max-w-3xl mx-auto mb-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Optional Documents</h3>
              <span className="text-sm text-gray-500">(for payment setup)</span>
            </motion.div>

            <div className="space-y-4">
              {optionalDocuments.map((template, index) => {
                const Icon = documentIcons[template.type] || FileText
                const status = documentStatuses[template.type]
                const isSigned = status?.signed

                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`group bg-white rounded-2xl shadow-md border-2 overflow-hidden transition-all hover:shadow-lg ${
                      isSigned
                        ? "border-green-200 bg-gradient-to-r from-green-50/50 to-white"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSigned
                              ? "bg-gradient-to-br from-green-400 to-green-500 shadow-md shadow-green-500/20"
                              : "bg-gray-100 group-hover:bg-gray-200"
                          }`}
                        >
                          {isSigned ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <Icon className="w-6 h-6 text-gray-500" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-gray-900">
                              {template.title}
                            </h3>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                              Optional
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {documentDescriptions[template.type] || "Complete later in dashboard"}
                          </p>
                        </div>

                        {/* Action */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => {
                              setSelectedDocument(template)
                              setIsViewerOpen(true)
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                              isSigned
                                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                : "border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {isSigned ? (
                              <>
                                <Eye className="w-4 h-4" />
                                View
                              </>
                            ) : (
                              <>
                                Sign
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Completion Action */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {isRequiredComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 text-white p-8 md:p-10 shadow-2xl"
              >
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-black/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-3">You&apos;re All Set!</h2>
                  <p className="text-teal-100 mb-8 max-w-md mx-auto">
                    All required documents have been signed. Access your partner dashboard to start
                    generating revenue with Daily Event Insurance.
                  </p>
                  <motion.button
                    onClick={() => router.push("/partner/dashboard")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-white text-teal-600 font-bold rounded-xl hover:bg-teal-50 transition-all shadow-xl inline-flex items-center gap-2"
                  >
                    Go to Partner Dashboard
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="incomplete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  <span>
                    Sign {requiredDocuments.length - requiredSignedCount} more required document
                    {requiredDocuments.length - requiredSignedCount !== 1 ? "s" : ""} to continue
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewer
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false)
          setSelectedDocument(null)
        }}
        document={
          selectedDocument
            ? {
              ...selectedDocument,
              content:
                (documentStatuses[selectedDocument.type]?.signed &&
                  (documentStatuses[selectedDocument.type] as any).contentSnapshot) ||
                selectedDocument.content,
            }
            : null
        }
        onSign={handleSign}
        isSigned={selectedDocument ? documentStatuses[selectedDocument.type]?.signed : false}
      />

      <Footer />
    </main>
  )
}
