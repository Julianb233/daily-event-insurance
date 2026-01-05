"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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

    // We no longer auto-redirect here to allow optional docs signing
    // The "Go to Dashboard" button will become available
  }

  const isOptional = (type: string) => {
    return type === DOCUMENT_TYPES.W9 || type === DOCUMENT_TYPES.DIRECT_DEPOSIT
  }

  const requiredDocuments = templates.filter(t => !isOptional(t.type))
  const requiredSignedCount = requiredDocuments.filter(t => documentStatuses[t.type]?.signed).length
  const isRequiredComplete = requiredDocuments.length > 0 && requiredDocuments.every(t => documentStatuses[t.type]?.signed)

  const allSigned = templates.length > 0 && templates.every(t => documentStatuses[t.type]?.signed)
  const totalSignedCount = templates.filter(t => documentStatuses[t.type]?.signed).length

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="pt-32 pb-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading documents...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Documents</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sign Your{" "}
            <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
              Partner Documents
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please review and sign the following documents to complete your partner setup.
          </p>
        </motion.div>

        {/* Progress indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Required documents signed</span>
            <span className="font-medium">{requiredSignedCount} of {requiredDocuments.length}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-teal-600"
              initial={{ width: 0 }}
              animate={{ width: `${(requiredSignedCount / requiredDocuments.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Documents list */}
        <div className="max-w-3xl mx-auto space-y-4">
          {templates.map((template, index) => {
            const Icon = documentIcons[template.type] || FileText
            const status = documentStatuses[template.type]
            const isSigned = status?.signed
            const optional = isOptional(template.type)

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg border-2 p-6 transition-all ${isSigned
                  ? "border-green-200 bg-green-50/50"
                  : "border-gray-100 hover:border-teal-200"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${isSigned ? "bg-green-100" : "bg-teal-100"
                      }`}
                  >
                    <Icon
                      className={`w-7 h-7 ${isSigned ? "text-green-600" : "text-teal-600"}`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{template.title}</h3>
                      {optional && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                          Optional
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      {isSigned ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Signed {status.signedAt && `on ${new Date(status.signedAt).toLocaleDateString()}`}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Clock className="w-4 h-4" />
                          {optional ? "Not signed (can be skipped)" : "Pending signature"}
                        </span>
                      )}
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">Version {template.version}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDocument(template)
                      setIsViewerOpen(true)
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${isSigned
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                  >
                    {isSigned ? "View" : "Sign"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Completion Action */}
        <div className="max-w-3xl mx-auto mt-8">
          {isRequiredComplete ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl text-white text-center shadow-lg"
            >
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">You&apos;re Ready to Go!</h2>
              <p className="text-teal-100 mb-6">
                Required agreements are signed. You can set up your payment details later in the dashboard.
              </p>
              <button
                onClick={() => router.push("/partner/dashboard")}
                className="px-8 py-3 bg-white text-teal-600 font-bold rounded-lg hover:bg-teal-50 transition-all shadow-md"
              >
                Go to Partner Dashboard
              </button>
            </motion.div>
          ) : (
            <div className="text-center text-gray-500">
              <p>Please sign all required documents to continue.</p>
            </div>
          )}
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
