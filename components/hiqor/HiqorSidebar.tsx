"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  Phone,
} from "lucide-react"

// Check dev mode
const isDevMode = !process.env.NEXT_PUBLIC_AUTH_SECRET

// Mock user for development mode
const MOCK_USER = {
  name: "HIQOR Admin",
  email: "admin@hiqor.com",
}

const navItems = [
  {
    label: "Dashboard",
    href: "/hiqor/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Policies",
    href: "/hiqor/policies",
    icon: FileText,
  },
  {
    label: "Claims",
    href: "/hiqor/claims",
    icon: AlertTriangle,
  },
  {
    label: "Call Center",
    href: "/hiqor/call-center",
    icon: Phone,
  },
  {
    label: "Reports",
    href: "/hiqor/reports",
    icon: TrendingUp,
  },
  {
    label: "API Sync",
    href: "/hiqor/sync",
    icon: RefreshCw,
  },
  {
    label: "Settings",
    href: "/hiqor/settings",
    icon: Settings,
  },
]

interface UserData {
  name?: string | null
  email?: string | null
}

function SidebarInnerContent({
  user,
  onSignOut,
  setIsMobileOpen,
  pathname,
  isDevMode: devMode
}: {
  user: UserData
  onSignOut: () => void
  setIsMobileOpen: (open: boolean) => void
  pathname: string
  isDevMode: boolean
}) {
  const displayName = user?.name || user?.email?.split("@")[0] || "HIQOR Admin"
  const initials = displayName[0]?.toUpperCase() || "H"

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/hiqor/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900">HIQOR Portal</span>
            <span className="block text-xs text-slate-500">Carrier Dashboard</span>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 mx-4 mt-4 bg-indigo-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-indigo-200">
          <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            {devMode ? "Dev Mode" : "HIQOR Administrator"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}`} />
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

export function HiqorSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Determine user data - use session or mock
  const user: UserData = session?.user || MOCK_USER
  const isInDevMode = isDevMode || status === "unauthenticated"

  const handleSignOut = async () => {
    if (isDevMode) {
      router.push("/")
    } else {
      await signOut({ callbackUrl: "/" })
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200">
        <SidebarInnerContent
          user={user}
          onSignOut={handleSignOut}
          setIsMobileOpen={setIsMobileOpen}
          pathname={pathname}
          isDevMode={isInDevMode}
        />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/hiqor/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">HIQOR Portal</span>
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
                onSignOut={handleSignOut}
                setIsMobileOpen={setIsMobileOpen}
                pathname={pathname}
                isDevMode={isInDevMode}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
