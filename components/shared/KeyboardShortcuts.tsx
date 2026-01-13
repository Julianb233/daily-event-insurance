"use client"

import { useEffect, useState, useCallback, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { X, Command as CommandIcon, Keyboard } from 'lucide-react'

type PortalType = 'admin' | 'hiqor' | 'sures'

interface KeyboardShortcutsProps {
  portalType: PortalType
  onShowHelp?: () => void
  onCommandPalette?: () => void
  children: React.ReactNode
}

interface ShortcutConfig {
  key: string
  description: string
  category: 'Navigation' | 'Actions' | 'General'
}

// Context for command palette communication
const CommandPaletteContext = createContext<{
  openCommandPalette: () => void
  closeCommandPalette: () => void
}>({
  openCommandPalette: () => {},
  closeCommandPalette: () => {},
})

export function useCommandPalette() {
  return useContext(CommandPaletteContext)
}

// Detect if user is on Mac
const isMac = typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false
const modKey = isMac ? '⌘' : 'Ctrl'

export function KeyboardShortcutsProvider({
  portalType,
  onShowHelp,
  onCommandPalette,
  children,
}: KeyboardShortcutsProps) {
  const router = useRouter()
  const [showHelp, setShowHelp] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [sequenceMode, setSequenceMode] = useState<'g' | null>(null)
  const [sequenceTimeout, setSequenceTimeout] = useState<NodeJS.Timeout | null>(null)

  // Get base path for the portal
  const getBasePath = useCallback(() => {
    switch (portalType) {
      case 'admin':
        return '/admin'
      case 'hiqor':
        return '/hiqor'
      case 'sures':
        return '/sures'
    }
  }, [portalType])

  // Handle sequence timeout
  useEffect(() => {
    if (sequenceMode) {
      const timeout = setTimeout(() => {
        setSequenceMode(null)
      }, 1000)
      setSequenceTimeout(timeout)
      return () => clearTimeout(timeout)
    }
  }, [sequenceMode])

  // Command palette controls
  const openCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true)
  }, [])

  const closeCommandPalette = useCallback(() => {
    setCommandPaletteOpen(false)
  }, [])

  // Global keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModKey = isMac ? e.metaKey : e.ctrlKey
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      // CMD/Ctrl + K: Open command palette
      if (isModKey && e.key === 'k') {
        e.preventDefault()
        if (onCommandPalette) {
          onCommandPalette()
        } else {
          openCommandPalette()
        }
        return
      }

      // CMD/Ctrl + /: Show shortcuts help
      if (isModKey && e.key === '/') {
        e.preventDefault()
        setShowHelp(true)
        if (onShowHelp) onShowHelp()
        return
      }

      // ESC: Close modals/palette
      if (e.key === 'Escape') {
        if (commandPaletteOpen) {
          closeCommandPalette()
        } else if (showHelp) {
          setShowHelp(false)
        } else if (sequenceMode) {
          setSequenceMode(null)
        }
        // Emit custom event for other components to listen
        window.dispatchEvent(new CustomEvent('escape-pressed'))
        return
      }

      // Ignore shortcuts when typing in inputs (except ESC)
      if (isInput) return

      // R: Refresh page
      if (e.key === 'r' && !isModKey && !sequenceMode) {
        e.preventDefault()
        window.location.reload()
        return
      }

      // G sequence mode
      if (e.key === 'g' && !isModKey && !sequenceMode) {
        e.preventDefault()
        setSequenceMode('g')
        return
      }

      // Handle G + X shortcuts
      if (sequenceMode === 'g') {
        e.preventDefault()
        const basePath = getBasePath()

        if (sequenceTimeout) {
          clearTimeout(sequenceTimeout)
        }

        switch (e.key.toLowerCase()) {
          case 'd':
            router.push(basePath)
            break
          case 'p':
            router.push(`${basePath}/policies`)
            break
          case 'c':
            router.push(`${basePath}/claims`)
            break
        }

        setSequenceMode(null)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    router,
    portalType,
    getBasePath,
    openCommandPalette,
    closeCommandPalette,
    commandPaletteOpen,
    showHelp,
    sequenceMode,
    sequenceTimeout,
    onShowHelp,
    onCommandPalette,
  ])

  return (
    <CommandPaletteContext.Provider value={{ openCommandPalette, closeCommandPalette }}>
      {children}
      {showHelp && (
        <ShortcutsHelpModal portalType={portalType} onClose={() => setShowHelp(false)} />
      )}
    </CommandPaletteContext.Provider>
  )
}

interface ShortcutsHelpModalProps {
  portalType: PortalType
  onClose: () => void
}

export function ShortcutsHelpModal({ portalType, onClose }: ShortcutsHelpModalProps) {
  const shortcuts: ShortcutConfig[] = [
    // General
    { key: `${modKey} K`, description: 'Open command palette', category: 'General' },
    { key: `${modKey} /`, description: 'Show keyboard shortcuts', category: 'General' },
    { key: 'ESC', description: 'Close modal/palette', category: 'General' },

    // Navigation
    { key: 'G then D', description: 'Go to Dashboard', category: 'Navigation' },
    { key: 'G then P', description: 'Go to Policies', category: 'Navigation' },
    { key: 'G then C', description: 'Go to Claims', category: 'Navigation' },

    // Actions
    { key: 'R', description: 'Refresh current page', category: 'Actions' },
  ]

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, ShortcutConfig[]>)

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Keyboard Shortcuts
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {portalType.charAt(0).toUpperCase() + portalType.slice(1)} Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {Object.entries(groupedShortcuts).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {shortcut.description}
                    </span>
                    <kbd className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <CommandIcon className="w-4 h-4" />
            <span>
              Pro tip: Use <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300">{modKey} K</kbd> to quickly navigate anywhere
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
