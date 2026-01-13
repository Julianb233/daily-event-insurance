"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Command } from 'cmdk'
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertCircle,
  TrendingUp,
  Globe,
  DollarSign,
  FileCheck,
  Plug,
  BarChart3,
  Settings,
  Phone,
  RefreshCw,
  Download,
  Search,
} from 'lucide-react'

type PortalType = 'admin' | 'hiqor' | 'sures'

interface CommandPaletteProps {
  portalType: PortalType
  isOpen: boolean
  onClose: () => void
}

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
}

interface ActionItem {
  label: string
  action: () => void
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
}

const STORAGE_KEY = 'command-palette-recent'
const MAX_RECENT_ITEMS = 5

export function CommandPalette({ portalType, isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [recentPages, setRecentPages] = useState<NavigationItem[]>([])

  // Load recent pages from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setRecentPages(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to parse recent pages:', e)
        }
      }
    }
  }, [])

  // Save page to recent on navigation
  const saveToRecent = useCallback((item: NavigationItem) => {
    setRecentPages((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((p) => p.href !== item.href)
      // Add to front
      const updated = [item, ...filtered].slice(0, MAX_RECENT_ITEMS)
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  // Navigation items by portal
  const navigationItems: NavigationItem[] = (() => {
    switch (portalType) {
      case 'admin':
        return [
          { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, shortcut: 'G D' },
          { label: 'Partners', href: '/admin/partners', icon: Users },
          { label: 'Policies', href: '/admin/policies', icon: FileText, shortcut: 'G P' },
          { label: 'Claims', href: '/admin/claims', icon: AlertCircle, shortcut: 'G C' },
          { label: 'Leads', href: '/admin/leads', icon: TrendingUp },
          { label: 'Microsites', href: '/admin/microsites', icon: Globe },
          { label: 'Earnings', href: '/admin/earnings', icon: DollarSign },
          { label: 'Contracts', href: '/admin/contracts', icon: FileCheck },
          { label: 'Integrations', href: '/admin/integrations', icon: Plug },
          { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
          { label: 'Settings', href: '/admin/settings', icon: Settings },
        ]
      case 'hiqor':
        return [
          { label: 'Dashboard', href: '/hiqor', icon: LayoutDashboard, shortcut: 'G D' },
          { label: 'Policies', href: '/hiqor/policies', icon: FileText, shortcut: 'G P' },
          { label: 'Claims', href: '/hiqor/claims', icon: AlertCircle, shortcut: 'G C' },
          { label: 'Call Center', href: '/hiqor/call-center', icon: Phone },
          { label: 'Reports', href: '/hiqor/reports', icon: BarChart3 },
          { label: 'Sync', href: '/hiqor/sync', icon: RefreshCw },
          { label: 'Settings', href: '/hiqor/settings', icon: Settings },
        ]
      case 'sures':
        return [
          { label: 'Dashboard', href: '/sures', icon: LayoutDashboard, shortcut: 'G D' },
          { label: 'Policies', href: '/sures/policies', icon: FileText, shortcut: 'G P' },
          { label: 'Claims', href: '/sures/claims', icon: AlertCircle, shortcut: 'G C' },
          { label: 'Reports', href: '/sures/reports', icon: BarChart3 },
          { label: 'Sync', href: '/sures/sync', icon: RefreshCw },
          { label: 'Settings', href: '/sures/settings', icon: Settings },
        ]
    }
  })()

  // Quick actions
  const actionItems: ActionItem[] = [
    {
      label: 'Refresh Page',
      action: () => {
        window.location.reload()
        onClose()
      },
      icon: RefreshCw,
      shortcut: 'R',
    },
    {
      label: 'Export Data',
      action: () => {
        // Placeholder for export functionality
        console.log('Export triggered')
        onClose()
      },
      icon: Download,
    },
  ]

  // Handle navigation
  const handleNavigate = useCallback(
    (item: NavigationItem) => {
      saveToRecent(item)
      router.push(item.href)
      onClose()
    },
    [router, onClose, saveToRecent]
  )

  // Reset search on close
  useEffect(() => {
    if (!isOpen) {
      setSearch('')
    }
  }, [isOpen])

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Command Palette */}
      <Command
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            onClose()
          }
        }}
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search for commands, pages, or actions..."
            className="flex-1 py-4 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-gray-500">
            No results found.
          </Command.Empty>

          {/* Recent Pages */}
          {recentPages.length > 0 && search === '' && (
            <Command.Group
              heading="Recent"
              className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {recentPages.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.label}
                  onSelect={() => handleNavigate(item)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700 transition-colors"
                >
                  <item.icon className="w-4 h-4 text-gray-400" />
                  <span className="flex-1">{item.label}</span>
                  {item.href === pathname && (
                    <span className="text-xs text-gray-400">Current</span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Navigation Items */}
          <Command.Group
            heading="Navigation"
            className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2"
          >
            {navigationItems.map((item) => (
              <Command.Item
                key={item.href}
                value={item.label}
                onSelect={() => handleNavigate(item)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700 transition-colors"
              >
                <item.icon className="w-4 h-4 text-gray-400" />
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded">
                    {item.shortcut}
                  </kbd>
                )}
                {item.href === pathname && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </Command.Item>
            ))}
          </Command.Group>

          {/* Actions */}
          <Command.Group
            heading="Actions"
            className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2"
          >
            {actionItems.map((item) => (
              <Command.Item
                key={item.label}
                value={item.label}
                onSelect={item.action}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700 transition-colors"
              >
                <item.icon className="w-4 h-4 text-gray-400" />
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded">
                    {item.shortcut}
                  </kbd>
                )}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↑↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↵</kbd>
              to select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">ESC</kbd>
            to close
          </span>
        </div>
      </Command>
    </div>
  )
}
