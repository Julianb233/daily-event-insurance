"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, X, FileImage, FileText, File, Loader2, AlertCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FileAttachment {
  id: string
  file: File
  preview?: string
  status: "pending" | "uploading" | "uploaded" | "error"
  progress: number
  url?: string
  error?: string
}

export interface FileUploadProps {
  onFilesSelected: (files: FileAttachment[]) => void
  onFileRemove: (fileId: string) => void
  maxFiles?: number
  maxSizeBytes?: number
  acceptedTypes?: string[]
  disabled?: boolean
  className?: string
}

const DEFAULT_ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "text/plain",
  "text/csv",
  "application/json",
  "application/pdf",
  "text/html",
  "text/css",
  "text/javascript",
  "application/x-javascript",
]

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024 // 10MB
const DEFAULT_MAX_FILES = 5

export function FileUpload({
  onFilesSelected,
  onFileRemove,
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  disabled = false,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileAttachment[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `File type ${file.type} not supported`
      }
      if (file.size > maxSizeBytes) {
        return `File size exceeds ${Math.round(maxSizeBytes / 1024 / 1024)}MB limit`
      }
      return null
    },
    [acceptedTypes, maxSizeBytes]
  )

  const createFileAttachment = useCallback((file: File): FileAttachment => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const isImage = file.type.startsWith("image/")

    return {
      id,
      file,
      preview: isImage ? URL.createObjectURL(file) : undefined,
      status: "pending",
      progress: 0,
    }
  }, [])

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      setError(null)
      const newFiles: FileAttachment[] = []
      const currentCount = files.length
      const remainingSlots = maxFiles - currentCount

      if (remainingSlots <= 0) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      const filesToProcess = Array.from(fileList).slice(0, remainingSlots)

      for (const file of filesToProcess) {
        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          continue
        }
        newFiles.push(createFileAttachment(file))
      }

      if (newFiles.length > 0) {
        const updated = [...files, ...newFiles]
        setFiles(updated)
        onFilesSelected(updated)
      }
    },
    [files, maxFiles, validateFile, createFileAttachment, onFilesSelected]
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set dragging to false if leaving the drop zone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled) return

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles)
      }
    },
    [disabled, processFiles]
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles)
      }
      // Reset input so same file can be selected again
      e.target.value = ""
    },
    [processFiles]
  )

  const handleRemoveFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const fileToRemove = prev.find((f) => f.id === fileId)
        if (fileToRemove?.preview) {
          URL.revokeObjectURL(fileToRemove.preview)
        }
        return prev.filter((f) => f.id !== fileId)
      })
      onFileRemove(fileId)
    },
    [onFileRemove]
  )

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <FileImage className="w-4 h-4" />
    }
    if (file.type.includes("text") || file.type.includes("json")) {
      return <FileText className="w-4 h-4" />
    }
    return <File className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop zone */}
      <div
        ref={dropZoneRef}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all",
          isDragging
            ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
            : "border-zinc-300 dark:border-zinc-700 hover:border-teal-400 dark:hover:border-teal-600",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <Upload
          className={cn(
            "w-6 h-6 mb-2",
            isDragging ? "text-teal-500" : "text-zinc-400"
          )}
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
          {isDragging ? (
            "Drop files here"
          ) : (
            <>
              <span className="font-medium text-teal-600 dark:text-teal-400">
                Click to upload
              </span>{" "}
              or drag and drop
            </>
          )}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          Images, text files, logs (max {Math.round(maxSizeBytes / 1024 / 1024)}MB)
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File previews */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileAttachment) => (
            <FilePreview
              key={fileAttachment.id}
              attachment={fileAttachment}
              onRemove={() => handleRemoveFile(fileAttachment.id)}
              getFileIcon={getFileIcon}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface FilePreviewProps {
  attachment: FileAttachment
  onRemove: () => void
  getFileIcon: (file: File) => React.ReactNode
  formatFileSize: (bytes: number) => string
}

function FilePreview({
  attachment,
  onRemove,
  getFileIcon,
  formatFileSize,
}: FilePreviewProps) {
  const { file, preview, status, progress, error } = attachment
  const isImage = file.type.startsWith("image/")

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg border transition-colors",
        status === "error"
          ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
      )}
    >
      {/* Preview/Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        {isImage && preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-zinc-400">{getFileIcon(file)}</div>
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {file.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>{formatFileSize(file.size)}</span>
          {status === "uploading" && <span>{progress}%</span>}
          {status === "error" && error && (
            <span className="text-red-500">{error}</span>
          )}
        </div>

        {/* Progress bar */}
        {status === "uploading" && (
          <div className="mt-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Status indicator / Remove button */}
      <div className="flex-shrink-0">
        {status === "uploading" && (
          <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
        )}
        {status === "uploaded" && (
          <Check className="w-4 h-4 text-green-500" />
        )}
        {(status === "pending" || status === "error") && (
          <button
            onClick={onRemove}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
            aria-label={`Remove ${file.name}`}
          >
            <X className="w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
          </button>
        )}
      </div>
    </div>
  )
}

// Image preview modal for full-size viewing
export function ImagePreviewModal({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
  onClose: () => void
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close preview"
      >
        <X className="w-6 h-6 text-white" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
