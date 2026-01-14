"use client"

import { cn } from "@/lib/utils"
import {
  CheckCircle,
  Clock,
  Settings,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react"

export type IntegrationStatus = "pending" | "configured" | "testing" | "live" | "failed"

interface IntegrationStatusBadgeProps {
  status: IntegrationStatus
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
}

const statusConfig: Record<
  IntegrationStatus,
  {
    label: string
    icon: typeof CheckCircle
    bgColor: string
    textColor: string
    iconColor: string
  }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-700 dark:text-gray-300",
    iconColor: "text-gray-500 dark:text-gray-400",
  },
  configured: {
    label: "Configured",
    icon: Settings,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  testing: {
    label: "Testing",
    icon: Loader2,
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-700 dark:text-amber-300",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
  live: {
    label: "Live",
    icon: CheckCircle,
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-700 dark:text-green-300",
    iconColor: "text-green-500 dark:text-green-400",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-300",
    iconColor: "text-red-500 dark:text-red-400",
  },
}

const sizeConfig = {
  sm: {
    badge: "px-2 py-0.5 text-xs",
    icon: "w-3 h-3",
    gap: "gap-1",
  },
  md: {
    badge: "px-2.5 py-1 text-sm",
    icon: "w-4 h-4",
    gap: "gap-1.5",
  },
  lg: {
    badge: "px-3 py-1.5 text-base",
    icon: "w-5 h-5",
    gap: "gap-2",
  },
}

export function IntegrationStatusBadge({
  status,
  size = "md",
  showIcon = true,
  className,
}: IntegrationStatusBadgeProps) {
  const config = statusConfig[status]
  const sizes = sizeConfig[size]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        sizes.badge,
        sizes.gap,
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            sizes.icon,
            config.iconColor,
            status === "testing" && "animate-spin"
          )}
        />
      )}
      {config.label}
    </span>
  )
}

// Export a variant that shows a dot indicator instead of icon
export function IntegrationStatusDot({
  status,
  className,
}: {
  status: IntegrationStatus
  className?: string
}) {
  const dotColors: Record<IntegrationStatus, string> = {
    pending: "bg-gray-400",
    configured: "bg-blue-500",
    testing: "bg-amber-500",
    live: "bg-green-500",
    failed: "bg-red-500",
  }

  return (
    <span
      className={cn(
        "inline-block w-2.5 h-2.5 rounded-full",
        dotColors[status],
        status === "testing" && "animate-pulse",
        className
      )}
    />
  )
}
