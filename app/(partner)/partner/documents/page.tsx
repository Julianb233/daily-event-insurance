"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
    contentSnapshot?: string
}

const documentIcons: Record<string, React.ElementType> = {
    [DOCUMENT_TYPES.PARTNER_AGREEMENT]: Building2,
    [DOCUMENT_TYPES.JOINT_MARKETING_AGREEMENT]: Handshake,
    [DOCUMENT_TYPES.MUTUAL_NDA]: Shield,
    [DOCUMENT_TYPES.SPONSORSHIP_AGREEMENT]: Award,
    [DOCUMENT_TYPES.W9]: Receipt,
    [DOCUMENT_TYPES.DIRECT_DEPOSIT]: FileText,
}

export default function PartnerDocumentsPage() {
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

    // Handle re-signing if needed (though usually documents are immutable once signed)
    // For this page, we primarily support VIEWING. But if a new doc is added, we might support signing.
    const handleSign = async (documentType: string, signature: string) => {
        if (!partnerId) {
            throw new Error("Partner ID not found.")
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

        // Refresh status
        const statusRes = await fetch(`/api/documents/sign?partnerId=${partnerId}`)
        const statusData = await statusRes.json()
        if (statusData.success) {
            setDocumentStatuses(statusData.documents)
        }
    }

    const isOptional = (type: string) => {
        return type === DOCUMENT_TYPES.W9 || type === DOCUMENT_TYPES.DIRECT_DEPOSIT
    }

    if (loading) {
        return (
            <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 lg:p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
            >
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Legal Documents</h1>
                    <p className="text-slate-600 mt-1">View and manage your signed agreements.</p>
                </div>
            </motion.div>

            {/* Documents list */}
            <div className="grid gap-4 max-w-4xl">
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
                            className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${isSigned
                                ? "border-green-200 bg-green-50/30"
                                : "border-slate-200 hover:border-teal-200"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSigned ? "bg-green-100" : "bg-teal-100"
                                        }`}
                                >
                                    <Icon
                                        className={`w-6 h-6 ${isSigned ? "text-green-600" : "text-teal-600"}`}
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-slate-900">{template.title}</h3>
                                        {optional && (
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
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
                                                {optional ? "Not signed" : "Pending signature"}
                                            </span>
                                        )}
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-500">Version {template.version}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedDocument(template)
                                        setIsViewerOpen(true)
                                    }}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${isSigned
                                        ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
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
                                    documentStatuses[selectedDocument.type].contentSnapshot) ||
                                selectedDocument.content,
                        }
                        : null
                }
                onSign={handleSign}
                isSigned={selectedDocument ? documentStatuses[selectedDocument.type]?.signed : false}
            />
        </div>
    )
}
