"use client"

import { useState, Fragment } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  UserPlus,
  DollarSign,
  AlertCircle,
  FileText,
  Plug,
  ChevronRight,
  Settings,
  Filter,
  Wifi,
  WifiOff,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications } from "@/lib/admin/use-notifications"
import type {
  AdminNotification,
  NotificationType,
  NotificationPriority,
} from "@/lib/admin/notification-types"
import {
  NOTIFICATION_STYLES,
  PRIORITY_STYLES,
} from "@/lib/admin/notification-types"

// Icon mapping
const TypeIcons: Record<NotificationType, typeof Bell> = {
  escalation: AlertTriangle,
  partner_approval: UserPlus,
  payout_alert: DollarSign,
  system_health: AlertCircle,
  claim_filed: FileText,
  integration_error: Plug,
  general: Bell,
}

interface NotificationItemProps {
  notification: AdminNotification
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
  onClose: () => void
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDismiss,
  onClose,
}: NotificationItemProps) {
  const style = NOTIFICATION_STYLES[notification.type]
  const priorityStyle = PRIORITY_STYLES[notification.priority]
  const Icon = TypeIcons[notification.type]
  const isUnread = notification.status === "unread"

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`
        group relative p-4 border-b border-slate-100 dark:border-slate-700
        hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors
        ${isUnread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}
      `}
    >
      {/* Unread indicator */}
      {isUnread && (
        <span className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
      )}

      <div className="flex gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${style.bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${style.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className={`text-sm font-semibold text-slate-900 dark:text-white truncate ${isUnread ? "font-bold" : ""}`}>
                  {notification.title}
                </h4>
                {notification.priority !== "low" && (
                  <span className={`
                    inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
                    ${priorityStyle.color}
                  `}>
                    {priorityStyle.label}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {notification.message}
              </p>
              <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
                {timeAgo}
              </span>
            </div>

            {/* Actions (visible on hover) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isUnread && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onMarkAsRead(notification.id)
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onDismiss(notification.id)
                }}
                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action link */}
          {notification.actionUrl && (
            <Link
              href={notification.actionUrl}
              onClick={onClose}
              className="mt-2 inline-flex items-center gap-1 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium"
            >
              {notification.actionLabel || "View Details"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className = "" }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")

  const {
    notifications,
    unreadCount,
    stats,
    isLoading,
    error,
    isConnected,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
  } = useNotifications({
    enableRealtime: true,
    enableSounds: true,
    enableToasts: true,
  })

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => n.status === "unread")
      : notifications.filter((n) => n.status !== "dismissed")

  const handleClose = () => setIsOpen(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`
            relative p-2 rounded-lg transition-colors
            hover:bg-slate-100 dark:hover:bg-slate-700
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
            ${className}
          `}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />

          {/* Unread badge */}
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="
                absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                flex items-center justify-center
                bg-red-500 text-white text-xs font-bold rounded-full
              "
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[400px] p-0 shadow-xl border border-slate-200 dark:border-slate-700"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Notifications
            </h3>
            {/* Connection status */}
            {isConnected ? (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <Wifi className="w-3 h-3" />
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <WifiOff className="w-3 h-3" />
                Polling
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {filteredNotifications.length > 0 && (
              <button
                onClick={clearAll}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "unread")}>
          <div className="px-4 pt-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="all" className="text-sm">
                All
                {stats && <span className="ml-1 text-slate-400">({stats.total})</span>}
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-sm">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0">
            <NotificationsList
              notifications={filteredNotifications}
              isLoading={isLoading}
              onMarkAsRead={markAsRead}
              onDismiss={dismissNotification}
              onClose={handleClose}
            />
          </TabsContent>

          <TabsContent value="unread" className="m-0">
            <NotificationsList
              notifications={filteredNotifications}
              isLoading={isLoading}
              onMarkAsRead={markAsRead}
              onDismiss={dismissNotification}
              onClose={handleClose}
              emptyMessage="No unread notifications"
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <Link
            href="/admin/settings"
            onClick={handleClose}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 flex items-center gap-1"
          >
            <Settings className="w-4 h-4" />
            Notification Settings
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface NotificationsListProps {
  notifications: AdminNotification[]
  isLoading: boolean
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
  onClose: () => void
  emptyMessage?: string
}

function NotificationsList({
  notifications,
  isLoading,
  onMarkAsRead,
  onDismiss,
  onClose,
  emptyMessage = "No notifications",
}: NotificationsListProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-slate-500 mt-2">Loading notifications...</p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[360px]">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDismiss={onDismiss}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </ScrollArea>
  )
}

// Export standalone notification bell for use in header
export default NotificationBell
