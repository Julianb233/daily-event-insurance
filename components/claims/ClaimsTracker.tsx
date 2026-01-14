"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Upload,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MessageSquare,
  Send,
  Paperclip,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  X,
  File,
  Image as ImageIcon,
  FileCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type {
  Claim,
  ClaimStatus,
  ClaimTimelineStep,
  ClaimDocument,
  ClaimMessage,
  DocumentType,
} from "@/types/claims"

// Status display configuration
const statusConfig: Record<ClaimStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  submitted: { label: 'Submitted', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: FileText },
  under_review: { label: 'Under Review', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
  additional_info_needed: { label: 'Info Needed', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertCircle },
  approved: { label: 'Approved', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2 },
  denied: { label: 'Denied', color: 'text-red-600', bgColor: 'bg-red-100', icon: X },
  paid: { label: 'Paid', color: 'text-teal-600', bgColor: 'bg-teal-100', icon: DollarSign },
}

// Document type icons
const documentTypeIcons: Record<DocumentType, React.ElementType> = {
  photo: ImageIcon,
  receipt: FileText,
  police_report: FileCheck,
  medical_record: FileText,
  invoice: FileText,
  statement: FileText,
  other: File,
}

interface ClaimsTrackerProps {
  claim: Claim
  onUploadDocument?: (file: File, type: DocumentType) => Promise<void>
  onSendMessage?: (content: string) => Promise<void>
  className?: string
}

export function ClaimsTracker({
  claim,
  onUploadDocument,
  onSendMessage,
  className,
}: ClaimsTrackerProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'documents' | 'messages'>('timeline')
  const [messageInput, setMessageInput] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showAdjusterDetails, setShowAdjusterDetails] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const status = statusConfig[claim.status]
  const StatusIcon = status.icon

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !onUploadDocument) return

    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        // Determine document type based on file type
        let docType: DocumentType = 'other'
        if (file.type.startsWith('image/')) docType = 'photo'
        else if (file.type === 'application/pdf') docType = 'receipt'

        await onUploadDocument(file, docType)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }, [onUploadDocument])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }, [handleFileUpload])

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !onSendMessage) return

    setIsSendingMessage(true)
    try {
      await onSendMessage(messageInput)
      setMessageInput('')
      // Scroll to bottom after sending
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSendingMessage(false)
    }
  }, [messageInput, onSendMessage])

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Format time
  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className={cn("bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden", className)}>
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={cn("px-3 py-1 rounded-full text-sm font-medium", status.bgColor, status.color)}>
                <StatusIcon className="w-4 h-4 inline mr-1.5" />
                {status.label}
              </span>
              <span className="text-slate-500 text-sm">{claim.claimNumber}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{claim.title}</h2>
            <p className="text-slate-600 text-sm mt-1">{claim.description}</p>
          </div>

          {/* Claimed Amount */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 min-w-[200px]">
            <p className="text-sm text-slate-500 mb-1">Claimed Amount</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(claim.claimedAmount)}</p>
            {claim.approvedAmount && (
              <p className="text-sm text-green-600 mt-1">
                Approved: {formatCurrency(claim.approvedAmount)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Claim Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-slate-200 bg-slate-50">
        <div>
          <p className="text-xs text-slate-500 mb-1">Incident Date</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-900">{formatDate(claim.incidentDate)}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Reported Date</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-900">{formatDate(claim.reportedDate)}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Policy Number</p>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-900">{claim.policyNumber}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Deductible</p>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-900">{formatCurrency(claim.deductible)}</span>
          </div>
        </div>
      </div>

      {/* Adjuster Info */}
      {claim.adjuster && (
        <div className="p-4 mx-6 mt-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
          <button
            onClick={() => setShowAdjusterDetails(!showAdjusterDetails)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
                {claim.adjuster.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">{claim.adjuster.name}</p>
                <p className="text-xs text-slate-500">Claims Adjuster</p>
              </div>
            </div>
            {showAdjusterDetails ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          <AnimatePresence>
            {showAdjusterDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-teal-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-teal-600" />
                    <a href={`mailto:${claim.adjuster.email}`} className="hover:text-teal-600 transition-colors">
                      {claim.adjuster.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-teal-600" />
                    <a href={`tel:${claim.adjuster.phone}`} className="hover:text-teal-600 transition-colors">
                      {claim.adjuster.phone}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Estimated Resolution */}
      {claim.resolutionEstimate && (
        <div className="p-4 mx-6 mt-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Estimated Resolution</p>
              <p className="text-sm text-slate-600 mt-1">
                {claim.resolutionEstimate.minDays}-{claim.resolutionEstimate.maxDays} business days
                <span className="text-slate-400 ml-1">
                  (avg: {claim.resolutionEstimate.averageDays} days)
                </span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Based on {claim.resolutionEstimate.basedOn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-6 mt-6">
        {(['timeline', 'documents', 'messages'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize",
              activeTab === tab
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            {tab === 'messages' && (
              <span className="inline-flex items-center">
                {tab}
                {claim.messages.filter(m => !m.isRead).length > 0 && (
                  <span className="ml-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {claim.messages.filter(m => !m.isRead).length}
                  </span>
                )}
              </span>
            )}
            {tab !== 'messages' && tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                {claim.timeline.map((step, index) => (
                  <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
                    {/* Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                          step.isCompleted
                            ? "bg-teal-500 text-white"
                            : step.isCurrent
                            ? "bg-amber-500 text-white animate-pulse"
                            : "bg-slate-200 text-slate-400"
                        )}
                      >
                        {step.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : step.isCurrent ? (
                          <Clock className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                      {index < claim.timeline.length - 1 && (
                        <div
                          className={cn(
                            "w-0.5 flex-1 mt-2",
                            step.isCompleted ? "bg-teal-500" : "bg-slate-200"
                          )}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h4 className={cn(
                        "font-semibold",
                        step.isCompleted || step.isCurrent ? "text-slate-900" : "text-slate-400"
                      )}>
                        {step.title}
                      </h4>
                      <p className={cn(
                        "text-sm mt-1",
                        step.isCompleted || step.isCurrent ? "text-slate-600" : "text-slate-400"
                      )}>
                        {step.description}
                      </p>
                      {step.timestamp && (
                        <p className="text-xs text-slate-400 mt-2">
                          {formatDate(step.timestamp)} at {formatTime(step.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                  isDragging
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-300 hover:border-teal-400 hover:bg-slate-50"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <Upload className={cn(
                  "w-10 h-10 mx-auto mb-3 transition-colors",
                  isDragging ? "text-teal-500" : "text-slate-400"
                )} />
                <p className="text-sm font-medium text-slate-700">
                  {isDragging ? 'Drop files here' : 'Drag and drop files or click to upload'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports: Images, PDFs, Documents (Max 10MB)
                </p>
                {isUploading && (
                  <div className="mt-3">
                    <div className="w-32 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Uploading...</p>
                  </div>
                )}
              </div>

              {/* Document List */}
              <div className="mt-6 space-y-3">
                {claim.documents.length === 0 ? (
                  <p className="text-center text-slate-500 py-4">No documents uploaded yet</p>
                ) : (
                  claim.documents.map((doc) => {
                    const DocIcon = documentTypeIcons[doc.type] || File
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                          <DocIcon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-500">
                            {formatFileSize(doc.size)} - {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                      </div>
                    )
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-[400px]"
            >
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {claim.messages.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No messages yet. Start a conversation with your claims team.</p>
                ) : (
                  claim.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.senderRole === 'customer' ? "flex-row-reverse" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          message.senderRole === 'customer'
                            ? "bg-teal-500 text-white"
                            : message.senderRole === 'adjuster'
                            ? "bg-blue-500 text-white"
                            : "bg-slate-300 text-slate-600"
                        )}
                      >
                        {message.senderRole === 'system' ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          message.senderName[0].toUpperCase()
                        )}
                      </div>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl p-4",
                          message.senderRole === 'customer'
                            ? "bg-teal-500 text-white rounded-br-md"
                            : message.senderRole === 'adjuster'
                            ? "bg-blue-50 text-slate-900 rounded-bl-md"
                            : "bg-slate-100 text-slate-900 rounded-bl-md"
                        )}
                      >
                        <p className={cn(
                          "text-xs font-medium mb-1",
                          message.senderRole === 'customer' ? "text-teal-100" : "text-slate-500"
                        )}>
                          {message.senderName}
                        </p>
                        <p className="text-sm">{message.content}</p>
                        <p className={cn(
                          "text-xs mt-2",
                          message.senderRole === 'customer' ? "text-teal-200" : "text-slate-400"
                        )}>
                          {formatDate(message.timestamp)} at {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isSendingMessage}
                  className="px-4"
                >
                  {isSendingMessage ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ClaimsTracker
