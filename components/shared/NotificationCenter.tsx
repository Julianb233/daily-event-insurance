"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  AlertCircle,
  Info,
  Settings,
  Check,
  CheckCheck,
  X,
  type LucideIcon
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  type: 'alert' | 'update' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  href?: string
  icon?: LucideIcon
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onNotificationClick?: (notification: Notification) => void
}

type FilterTab = 'all' | 'alert' | 'update' | 'system'

const typeIcons: Record<string, LucideIcon> = {
  alert: AlertCircle,
  update: Info,
  system: Settings
}

const typeColors: Record<string, string> = {
  alert: 'text-red-500 bg-red-50 dark:bg-red-950/30',
  update: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
  system: 'text-gray-500 bg-gray-50 dark:bg-gray-950/30'
}

export default function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNotificationClick
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true
    return notification.type === activeFilter
  })

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkRead(notification.id)
    }

    if (onNotificationClick) {
      onNotificationClick(notification)
    }

    setIsOpen(false)
  }

  // Get relative time
  const getRelativeTime = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true })
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-semibold text-white bg-red-500 rounded-full"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h3>

              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 px-2 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {(['all', 'alert', 'update', 'system'] as FilterTab[]).map(filter => {
                const count = filter === 'all'
                  ? notifications.length
                  : notifications.filter(n => n.type === filter).length

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`
                      relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                      ${activeFilter === filter
                        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      }
                    `}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    {count > 0 && (
                      <span className={`
                        text-[10px] px-1.5 py-0.5 rounded-full
                        ${activeFilter === filter
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500'
                        }
                      `}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-12 h-12 mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No notifications
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activeFilter === 'all'
                      ? "You're all caught up!"
                      : `No ${activeFilter} notifications`
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredNotifications.map((notification, index) => {
                    const IconComponent = notification.icon || typeIcons[notification.type]

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => handleNotificationClick(notification)}
                          className={`
                            w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors relative
                            ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}
                          `}
                        >
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div className={`
                              flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                              ${typeColors[notification.type]}
                            `}>
                              <IconComponent className="w-4 h-4" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className={`
                                  text-sm line-clamp-1
                                  ${!notification.read
                                    ? 'font-semibold text-gray-900 dark:text-gray-100'
                                    : 'font-medium text-gray-700 dark:text-gray-300'
                                  }
                                `}>
                                  {notification.title}
                                </p>

                                {/* Unread Indicator */}
                                {!notification.read && (
                                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                                )}
                              </div>

                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                                {notification.message}
                              </p>

                              <p className="text-[11px] text-gray-500 dark:text-gray-500">
                                {getRelativeTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>

                          {/* Mark as Read Button */}
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onMarkRead(notification.id)
                              }}
                              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Optional: Navigate to full notifications page
                  }}
                  className="w-full text-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-1 transition-colors"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
