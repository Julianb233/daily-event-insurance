"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Paperclip, Image, FileText, X, Upload, Camera, AlertCircle, Loader2, File } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FileAttachment as FileAttachmentType } from "@/lib/support/types"

interface FileAttachmentProps {
  onFilesSelect: (files: File[]) => void
  attachments: FileAttachmentType[]
  onRemoveAttachment: (id: string) => void
  maxFiles?: number
  maxSizeBytes?: number
  acceptedTypes?: string[]
  isUploading?: boolean
  className?: string
}

const defaultAcceptedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/json",
  "text/javascript",
  "text/typescript",
  "text/html",
  "text/css"
]

const typeIcons: Record<string, React.ReactNode> = {
  "image": <Image className="w-4 h-4" />,
  "application/pdf": <FileText className="w-4 h-4" />,
  "text": <FileText className="w-4 h-4" />,
  "default": <File className="w-4 h-4" />
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return typeIcons["image"]
  if (type.startsWith("text/")) return typeIcons["text"]
  return typeIcons[type] || typeIcons["default"]
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileAttachmentUI({
  onFilesSelect,
  attachments,
  onRemoveAttachment,
  maxFiles = 5,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = defaultAcceptedTypes,
  isUploading = false,
  className
}: FileAttachmentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []

    const remaining = maxFiles - attachments.length

    for (const file of files.slice(0, remaining)) {
      if (file.size > maxSizeBytes) {
        errors.push(`${file.name} is too large (max ${formatFileSize(maxSizeBytes)})`)
        continue
      }

      if (!acceptedTypes.includes(file.type) && !acceptedTypes.some(t => file.type.startsWith(t.replace("/*", "/")))) {
        errors.push(`${file.name} has unsupported format`)
        continue
      }

      valid.push(file)
    }

    if (files.length > remaining) {
      errors.push(`Maximum ${maxFiles} files allowed`)
    }

    return { valid, errors }
  }, [attachments.length, maxFiles, maxSizeBytes, acceptedTypes])

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const { valid, errors } = validateFiles(fileArray)

    if (errors.length > 0) {
      setError(errors[0])
      setTimeout(() => setError(null), 3000)
    }

    if (valid.length > 0) {
      onFilesSelect(valid)
    }
  }, [validateFiles, onFilesSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
    // Reset input so same file can be selected again
    e.target.value = ""
  }, [handleFiles])

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Drop zone - shown when dragging or when there are attachments */}
      <AnimatePresence>
        {(isDragging || attachments.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "rounded-lg border-2 border-dashed transition-colors p-3",
              isDragging
                ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                : "border-zinc-200 dark:border-zinc-700"
            )}
          >
            {attachments.length > 0 ? (
              <div className="space-y-2">
                {/* Attachment list */}
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment) => (
                    <AttachmentPreview
                      key={attachment.id}
                      attachment={attachment}
                      onRemove={() => onRemoveAttachment(attachment.id)}
                    />
                  ))}
                </div>

                {/* Add more button */}
                {attachments.length < maxFiles && (
                  <button
                    onClick={openFilePicker}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    <Paperclip className="w-3 h-3" />
                    Add more files
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Upload className="w-8 h-8 mx-auto mb-2 text-teal-500" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Drop files here to attach
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload indicator */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-xs text-zinc-500"
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            Uploading...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AttachmentPreview({
  attachment,
  onRemove
}: {
  attachment: FileAttachmentType
  onRemove: () => void
}) {
  const isImage = attachment.type.startsWith("image/")

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group"
    >
      {isImage && attachment.thumbnailUrl ? (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={attachment.thumbnailUrl}
            alt={attachment.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          {getFileIcon(attachment.type)}
          <div className="max-w-[120px]">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
              {attachment.name}
            </p>
            <p className="text-[10px] text-zinc-500">
              {formatFileSize(attachment.size)}
            </p>
          </div>
        </div>
      )}

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  )
}

// Trigger buttons for attachment menu
export function FileAttachmentTrigger({
  onClick,
  disabled,
  className
}: {
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label="Attach file"
    >
      <Paperclip className="w-5 h-5" />
    </motion.button>
  )
}

export function ScreenshotTrigger({
  onClick,
  disabled,
  className
}: {
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label="Take screenshot"
      title="Capture screenshot"
    >
      <Camera className="w-5 h-5" />
    </motion.button>
  )
}

// Attachment menu popover
export function AttachmentMenu({
  isOpen,
  onOpenChange,
  onFileClick,
  onScreenshotClick,
  className
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onFileClick: () => void
  onScreenshotClick: () => void
  className?: string
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute bottom-full mb-2 left-0 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden",
            className
          )}
        >
          <div className="p-1">
            <button
              onClick={() => {
                onFileClick()
                onOpenChange(false)
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Paperclip className="w-4 h-4 text-zinc-400" />
              Upload file
            </button>
            <button
              onClick={() => {
                onScreenshotClick()
                onOpenChange(false)
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Camera className="w-4 h-4 text-zinc-400" />
              Capture screenshot
            </button>
            <button
              onClick={() => {
                onFileClick()
                onOpenChange(false)
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Image className="w-4 h-4 text-zinc-400" />
              Upload image
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
