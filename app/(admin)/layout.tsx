'use client'

import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ToastProvider } from '@/components/shared/Toast'
import { ThemeProvider } from '@/lib/theme/theme-provider'
import { KeyboardShortcutsProvider } from '@/components/shared/KeyboardShortcuts'
import { CommandPalette } from '@/components/shared/CommandPalette'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  return (
    <ThemeProvider storageKey="dei-admin-theme">
      <SessionProvider>
        <KeyboardShortcutsProvider
          portalType="admin"
          onCommandPalette={() => setCommandPaletteOpen(true)}
        >
          <ToastProvider />
          <CommandPalette
            portalType="admin"
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
          />
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar />
            {/* Main content area */}
            <main className="lg:pl-72">
              {/* Mobile header spacer */}
              <div className="lg:hidden h-14" />
              <div className="min-h-screen">
                {children}
              </div>
            </main>
          </div>
        </KeyboardShortcutsProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
