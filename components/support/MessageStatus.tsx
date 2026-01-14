"use client"

import { motion } from "framer-motion"
import { Check, CheckCheck, Clock, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MessageStatus as MessageStatusType } from "@/lib/support/types"

interface MessageStatusProps {
  status: MessageStatusType
  timestamp?: Date
  showLabel?: boolean
  className?: string
  size?: "sm" | "md"
}

const statusConfig: Record<MessageStatusType, {
  icon: React.ReactNode
  label: string
  color: string
}> = {
  sending: {
    icon: <Loader2 className="animate-spin" />,
    label: "Sending",
    color: "text-zinc-400"
  },
  sent: {
    icon: <Check />,
    label: "Sent",
    color: "text-zinc-400"
  },
  delivered: {
    icon: <CheckCheck />,
    label: "Delivered",
    color: "text-zinc-400"
  },
  read: {
    icon: <CheckCheck />,
    label: "Read",
    color: "text-teal-500"
  },
  failed: {
    icon: <AlertCircle />,
    label: "Failed",
    color: "text-red-500"
  }
}

export function MessageStatusIndicator({
  status,
  timestamp,
  showLabel = false,
  className,
  size = "sm"
}: MessageStatusProps) {
  const config = statusConfig[status]
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("flex items-center gap-1", className)}
    >
      {timestamp && (
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
          {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
      <span className={cn(config.color, sizeClass, "[&>svg]:w-full [&>svg]:h-full")}>
        {config.icon}
      </span>
      {showLabel && (
        <span className={cn("text-[10px]", config.color)}>
          {config.label}
        </span>
      )}
    </motion.div>
  )
}

// Animated status transition
export function MessageStatusAnimated({
  status,
  className
}: {
  status: MessageStatusType
  className?: string
}) {
  const config = statusConfig[status]

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn("flex items-center gap-1", className)}
    >
      <motion.span
        className={cn(config.color, "w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full")}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {config.icon}
      </motion.span>
    </motion.div>
  )
}

// Message timestamp with status
export function MessageTimestamp({
  timestamp,
  status,
  isUser = false,
  className
}: {
  timestamp: Date
  status?: MessageStatusType
  isUser?: boolean
  className?: string
}) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 mt-1",
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      <span className={cn(
        "text-[10px]",
        isUser ? "text-white/60" : "text-zinc-400 dark:text-zinc-500"
      )}>
        {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>

      {status && isUser && (
        <MessageStatusIndicator
          status={status}
          className={cn(
            status === "read" && "text-teal-300",
            status !== "read" && status !== "failed" && "text-white/60",
            status === "failed" && "text-red-300"
          )}
        />
      )}
    </div>
  )
}

// Delivery status with retry option
export function MessageDeliveryStatus({
  status,
  onRetry,
  className
}: {
  status: MessageStatusType
  onRetry?: () => void
  className?: string
}) {
  if (status === "failed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex items-center gap-2", className)}
      >
        <span className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5" />
          Failed to send
        </span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
          >
            Retry
          </button>
        )}
      </motion.div>
    )
  }

  if (status === "sending") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn("flex items-center gap-1.5 text-zinc-400", className)}
      >
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="text-[10px]">Sending...</span>
      </motion.div>
    )
  }

  return null
}

// Read receipt indicator
export function ReadReceipt({
  readAt,
  readBy,
  className
}: {
  readAt: Date
  readBy?: string
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex items-center gap-1 text-teal-500", className)}
    >
      <CheckCheck className="w-3.5 h-3.5" />
      <span className="text-[10px]">
        {readBy ? `Read by ${readBy}` : "Read"} at {new Date(readAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </motion.div>
  )
}
