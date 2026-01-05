"use client"

import Link from "next/link"
import { useSession } from "@/components/providers/session-provider"
import { User, LogOut } from "lucide-react"

export function AuthHeader() {
  const { data: session, status, signOut } = useSession()
  const isLoading = status === "loading"

  if (isLoading) {
    return (
      <header className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      </header>
    )
  }

  return (
    <header className="fixed top-4 right-4 z-50 flex items-center gap-4">
      {!session?.user ? (
        <>
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm font-medium text-white bg-[#B8860B] hover:bg-[#9A7209] rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 text-sm font-medium text-[#0A4D3C] bg-[#F4D35E] hover:bg-[#E5C44F] rounded-lg transition-colors"
          >
            Sign Up
          </Link>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            href="/partner/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{session.user.name || session.user.email}</span>
          </Link>
          <button
            onClick={signOut}
            className="p-2 text-gray-500 hover:text-red-600 bg-white rounded-lg shadow-sm hover:shadow transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  )
}
