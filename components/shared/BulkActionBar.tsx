"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Download,
  Trash2,
  X,
  CheckCircle2,
  ChevronDown,
  LucideIcon,
} from "lucide-react"

export interface BulkAction {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: 'default' | 'danger'
}

export interface BulkActionBarProps {
  selectedCount: number
  onExport?: () => void
  onDelete?: () => void
  onUpdateStatus?: (status: string) => void
  onDeselectAll: () => void
  actions?: BulkAction[]
  statusOptions?: string[]
  portalType?: 'admin' | 'hiqor' | 'sures'
}

export function BulkActionBar({
  selectedCount,
  onExport,
  onDelete,
  onUpdateStatus,
  onDeselectAll,
  actions = [],
  statusOptions = [],
  portalType = 'admin',
}: BulkActionBarProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  // Portal-specific colors
  const portalColors = {
    admin: {
      bg: 'from-violet-500 to-violet-600',
      hover: 'hover:bg-violet-700/90',
      focus: 'focus:ring-violet-500',
      text: 'text-white',
    },
    hiqor: {
      bg: 'from-indigo-500 to-indigo-600',
      hover: 'hover:bg-indigo-700/90',
      focus: 'focus:ring-indigo-500',
      text: 'text-white',
    },
    sures: {
      bg: 'from-emerald-500 to-emerald-600',
      hover: 'hover:bg-emerald-700/90',
      focus: 'focus:ring-emerald-500',
      text: 'text-white',
    },
  }

  const colors = portalColors[portalType]

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete?.()
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => setShowDeleteConfirm(false), 5000)
    }
  }

  const handleStatusSelect = (status: string) => {
    onUpdateStatus?.(status)
    setShowStatusDropdown(false)
  }

  // Build default actions if not provided
  const defaultActions: BulkAction[] = []

  if (onExport) {
    defaultActions.push({
      label: 'Export',
      icon: Download,
      onClick: onExport,
    })
  }

  if (onDelete) {
    defaultActions.push({
      label: showDeleteConfirm ? 'Confirm Delete?' : 'Delete',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'danger',
    })
  }

  const allActions = [...defaultActions, ...actions]

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`
              bg-gradient-to-r ${colors.bg} ${colors.text}
              rounded-full shadow-2xl border border-white/20
              backdrop-blur-xl
              px-6 py-4
              flex items-center gap-6
              min-w-max
            `}
          >
            {/* Selected Count */}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold text-sm">
                {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/30" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {allActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full
                    font-medium text-sm
                    transition-all duration-200
                    ${
                      action.variant === 'danger'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : `bg-white/20 ${colors.hover} backdrop-blur-sm`
                    }
                    focus:outline-none focus:ring-2 ${colors.focus} focus:ring-offset-2
                    active:scale-95
                  `}
                >
                  <action.icon className="w-4 h-4" />
                  <span>{action.label}</span>
                </button>
              ))}

              {/* Status Dropdown */}
              {onUpdateStatus && statusOptions.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full
                      bg-white/20 ${colors.hover} backdrop-blur-sm
                      font-medium text-sm
                      transition-all duration-200
                      focus:outline-none focus:ring-2 ${colors.focus} focus:ring-offset-2
                      active:scale-95
                    `}
                  >
                    <span>Update Status</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showStatusDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 right-0 min-w-[200px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusSelect(status)}
                            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {status}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/30" />

            {/* Deselect All */}
            <button
              onClick={onDeselectAll}
              className={`
                p-2 rounded-full
                bg-white/20 ${colors.hover} backdrop-blur-sm
                transition-all duration-200
                focus:outline-none focus:ring-2 ${colors.focus} focus:ring-offset-2
                active:scale-95
              `}
              aria-label="Deselect all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Usage Example:
 *
 * ```tsx
 * const [selectedItems, setSelectedItems] = useState<string[]>([])
 *
 * <BulkActionBar
 *   selectedCount={selectedItems.length}
 *   portalType="admin" // or 'hiqor' or 'sures'
 *   onExport={() => {
 *     // Export selected items
 *     const data = items.filter(item => selectedItems.includes(item.id))
 *     exportToCSV(data)
 *   }}
 *   onDelete={() => {
 *     // Delete selected items
 *     deleteItems(selectedItems)
 *     setSelectedItems([])
 *   }}
 *   onUpdateStatus={(status) => {
 *     // Update status for selected items
 *     updateItemsStatus(selectedItems, status)
 *     setSelectedItems([])
 *   }}
 *   onDeselectAll={() => setSelectedItems([])}
 *   statusOptions={['Active', 'Inactive', 'Pending', 'Archived']}
 *   // Optional custom actions
 *   actions={[
 *     {
 *       label: 'Send Email',
 *       icon: Mail,
 *       onClick: () => sendEmailToSelected(selectedItems),
 *     },
 *   ]}
 * />
 * ```
 */
