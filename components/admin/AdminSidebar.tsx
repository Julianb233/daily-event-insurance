"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Layers,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  FileText,
  AlertTriangle,
  TrendingUp,
  Globe,
  Plug,
  ScrollText,
  Wallet,
  Phone,
} from "lucide-react"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

// Check dev mode
const isDevMode = !process.env.NEXT_PUBLIC_AUTH_SECRET

// Mock user for development mode
const MOCK_USER = {
  name: "Admin User",
  email: "admin@dailyevent.dev",
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Earnings",
    href: "/admin/my-earnings",
    icon: Wallet,
  },
  {
    label: "Partners",
    href: "/admin/partners",
    icon: Users,
  },
  {
    label: "Microsites",
    href: "/admin/microsites",
    icon: Globe,
  },
  {
    label: "Policies",
    href: "/admin/policies",
    icon: FileText,
  },
  {
    label: "Commission Tiers",
    href: "/admin/commission-tiers",
    icon: Layers,
  },
  {
    label: "Payouts",
    href: "/admin/payouts",
    icon: DollarSign,
  },
  {
    label: "Claims",
    href: "/admin/claims",
    icon: AlertTriangle,
  },
  {
    label: "Call Center",
    href: "/admin/voice-agent",
    icon: Phone,
  },
  {
    label: "API Integrations",
    href: "/admin/integrations",
    icon: Plug,
  },
  {
    label: "Contracts",
    href: "/admin/contracts",
    icon: ScrollText,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: TrendingUp,
  },
  {
    label: "Settings",
    href: "/admin/settings",
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
  const displayName = user?.name || user?.email?.split("@")[0] || "Admin"
  const initials = displayName[0]?.toUpperCase() || "A"

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Admin Portal</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Daily Event Insurance</span>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 mx-4 mt-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {displayName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-violet-200 dark:border-violet-700">
          <span className="inline-flex items-center px-2 py-1 bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-200 text-xs font-medium rounded-full">
            {devMode ? "Dev Mode" : "Administrator"}
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
                  ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-violet-500"}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Partner Portal Link */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <Link
          href="/partner/dashboard"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Partner Portal</span>
        </Link>
      </div>

      {/* Theme Toggle */}
      <div className="px-4 py-2">
        <ThemeToggle size="sm" />
      </div>

      {/* Sign out */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </>
  )
}

export function AdminSidebar() {
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
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
        <SidebarInnerContent
          user={user}
          onSignOut={handleSignOut}
          setIsMobileOpen={setIsMobileOpen}
          pathname={pathname}
          isDevMode={isInDevMode}
        />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Admin Portal</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isMobileOpen ? (
              <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
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
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 flex flex-col shadow-xl"
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
