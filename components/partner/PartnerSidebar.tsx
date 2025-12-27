"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  DollarSign,
  FolderOpen,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
} from "lucide-react"

// Check dev mode at build time - NEXT_PUBLIC_ vars are inlined
const isDevMode = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// Mock user for development mode
const MOCK_USER = {
  firstName: "Demo",
  lastName: "Partner",
  emailAddresses: [{ emailAddress: "demo@partner.dev" }],
}

const navItems = [
  {
    label: "Dashboard",
    href: "/partner/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Earnings",
    href: "/partner/earnings",
    icon: DollarSign,
  },
  {
    label: "Materials",
    href: "/partner/materials",
    icon: FolderOpen,
  },
  {
    label: "Profile",
    href: "/partner/profile",
    icon: User,
  },
]

interface UserData {
  firstName?: string
  lastName?: string
  emailAddresses: { emailAddress: string }[]
}

// Inner content component - no hooks, just renders UI
function SidebarInnerContent({
  user,
  onSignOut,
  setIsMobileOpen,
  pathname
}: {
  user: UserData
  onSignOut: () => void
  setIsMobileOpen: (open: boolean) => void
  pathname: string
}) {
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900">Partner Portal</span>
            <span className="block text-xs text-slate-500">Daily Event Insurance</span>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 mx-4 mt-4 bg-slate-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
            {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "P"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.firstName || "Partner"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200">
          <span className="inline-flex items-center px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
            {isDevMode ? "Dev Mode" : "Active Partner"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-teal-500"}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </>
  )
}

// Wrapper that handles desktop/mobile layout
function SidebarWrapper({
  user,
  onSignOut
}: {
  user: UserData
  onSignOut: () => void
}) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200">
        <SidebarInnerContent
          user={user}
          onSignOut={onSignOut}
          setIsMobileOpen={setIsMobileOpen}
          pathname={pathname}
        />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/partner/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Partner Portal</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            {isMobileOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col shadow-xl"
            >
              <SidebarInnerContent
                user={user}
                onSignOut={onSignOut}
                setIsMobileOpen={setIsMobileOpen}
                pathname={pathname}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Dev mode sidebar - uses mock data, no Clerk
function DevModeSidebar() {
  const router = useRouter()

  const handleSignOut = () => {
    router.push("/")
  }

  return <SidebarWrapper user={MOCK_USER} onSignOut={handleSignOut} />
}

// Production sidebar - uses Clerk hooks
// This component is only rendered when ClerkProvider is available
function ClerkSidebar() {
  const router = useRouter()

  // Dynamic import to avoid build-time issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useUser, useClerk } = require("@clerk/nextjs")
  const { user } = useUser()
  const { signOut } = useClerk()

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" })
  }

  const userData: UserData = user ? {
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    emailAddresses: user.emailAddresses || []
  } : MOCK_USER

  return <SidebarWrapper user={userData} onSignOut={handleSignOut} />
}

// Main export - chooses correct implementation based on environment
export function PartnerSidebar() {
  // In dev mode, use the mock sidebar that never touches Clerk
  if (isDevMode) {
    return <DevModeSidebar />
  }

  // In production, use the Clerk-enabled sidebar
  return <ClerkSidebar />
}
