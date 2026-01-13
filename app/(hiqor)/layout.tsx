'use client'

import { SessionProvider } from 'next-auth/react'
import { HiqorSidebar } from '@/components/hiqor/HiqorSidebar'

export default function HiqorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-50">
        <HiqorSidebar />
        <main className="lg:ml-72 pt-14 lg:pt-0">{children}</main>
      </div>
    </SessionProvider>
  )
}
