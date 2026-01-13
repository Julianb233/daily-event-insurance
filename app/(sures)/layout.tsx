'use client'

import { SessionProvider } from 'next-auth/react'
import { SuresSidebar } from '@/components/sures/SuresSidebar'

export default function SuresLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-50">
        <SuresSidebar />
        <main className="lg:ml-72 pt-14 lg:pt-0">{children}</main>
      </div>
    </SessionProvider>
  )
}
