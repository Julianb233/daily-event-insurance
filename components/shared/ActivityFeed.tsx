"use client"

import { useState, useMemo } from "react"
import {
  CheckCircle2,
  FileText,
  UserPlus,
  CreditCard,
  RefreshCw,
  TrendingUp,
  Filter,
  Loader2,
} from "lucide-react"

// Types
export interface Activity {
  id: string
  type:
    | "policy_created"
    | "claim_filed"
    | "partner_signup"
    | "payment_received"
    | "sync_complete"
    | "lead_converted"
  title: string
  description?: string
  timestamp: Date
  user?: {
    name: string
    avatar?: string
  }
  metadata?: Record<string, any>
}

export interface ActivityFeedProps {
  activities: Activity[]
  maxItems?: number
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
  emptyMessage?: string
  showFilters?: boolean
  className?: string
}

// Helper function for relative time formatting
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes === 1 ? "" : "s"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`
}

// Activity type configuration
const activityConfig = {
  policy_created: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-200 dark:border-green-800",
  },
  claim_filed: {
    icon: FileText,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  partner_signup: {
    icon: UserPlus,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  payment_received: {
    icon: CreditCard,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  sync_complete: {
    icon: RefreshCw,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  lead_converted: {
    icon: TrendingUp,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    borderColor: "border-violet-200 dark:border-violet-800",
  },
}

// User Avatar Component
function UserAvatar({ user }: { user?: Activity["user"] }) {
  if (!user) return null

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-700"
      />
    )
  }

  return (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
      {initials}
    </div>
  )
}

// Activity Item Component
function ActivityItem({
  activity,
  isLast,
}: {
  activity: Activity
  isLast: boolean
}) {
  const config = activityConfig[activity.type]
  const Icon = config.icon

  return (
    <div className="relative flex gap-4 pb-6">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-5 top-11 w-px h-full bg-gray-200 dark:bg-gray-700" />
      )}

      {/* Icon */}
      <div
        className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center`}
      >
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {activity.title}
          </h4>
          <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {getRelativeTime(activity.timestamp)}
          </time>
        </div>

        {activity.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {activity.description}
          </p>
        )}

        {activity.user && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <UserAvatar user={activity.user} />
            <span>{activity.user.name}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Skeleton Loading State
function ActivitySkeleton() {
  return (
    <div className="relative flex gap-4 pb-6 animate-pulse">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 min-w-0 pt-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  )
}

// Main Component
export default function ActivityFeed({
  activities,
  maxItems = 10,
  onLoadMore,
  hasMore = false,
  loading = false,
  emptyMessage = "No recent activity",
  showFilters = false,
  className = "",
}: ActivityFeedProps) {
  const [selectedFilter, setSelectedFilter] = useState<Activity["type"] | "all">(
    "all"
  )

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (selectedFilter === "all") {
      return activities.slice(0, maxItems)
    }
    return activities.filter((a) => a.type === selectedFilter).slice(0, maxItems)
  }, [activities, selectedFilter, maxItems])

  // Get unique activity types for filter
  const activityTypes = useMemo(() => {
    const types = new Set(activities.map((a) => a.type))
    return Array.from(types)
  }, [activities])

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Activity
          </h3>

          {showFilters && activityTypes.length > 1 && (
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) =>
                  setSelectedFilter(e.target.value as Activity["type"] | "all")
                }
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
              >
                <option value="all">All Activity</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="px-6 py-4">
        {loading && filteredActivities.length === 0 ? (
          <>
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
          </>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <>
            {filteredActivities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isLast={index === filteredActivities.length - 1 && !hasMore}
              />
            ))}

            {/* Load More Button */}
            {hasMore && onLoadMore && (
              <div className="pt-2">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="w-full py-2 px-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Export helper function for external use
export { getRelativeTime }
