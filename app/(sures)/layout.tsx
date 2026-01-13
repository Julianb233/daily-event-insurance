'use client'

import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { SuresSidebar } from '@/components/sures/SuresSidebar'
import { ToastProvider } from '@/components/shared/Toast'
import { ThemeProvider } from '@/lib/theme/theme-provider'
import { KeyboardShortcutsProvider } from '@/components/shared/KeyboardShortcuts'
import { CommandPalette } from '@/components/shared/CommandPalette'

export default function SuresLayout({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  return (
    <ThemeProvider storageKey="dei-sures-theme">
      <SessionProvider>
        <KeyboardShortcutsProvider
          portalType="sures"
          onCommandPalette={() => setCommandPaletteOpen(true)}
        >
          <ToastProvider />
          <CommandPalette
            portalType="sures"
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
          />
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <SuresSidebar />
            <main className="lg:ml-72 pt-14 lg:pt-0">{children}</main>
          </div>
        </KeyboardShortcutsProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
