"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Shield,
  Users,
  FileText,
  FolderOpen,
  Phone,
  Layers,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
  Bell,
  Search,
  Home,
  Globe,
  Building2,
  Newspaper,
} from "lucide-react"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

// Portal configurations
const PORTALS = [
  { id: "admin", name: "Admin Portal", icon: Shield, color: "bg-indigo-600" },
  { id: "partner", name: "Partner Portal", icon: Building2, color: "bg-teal-600" },
  { id: "sales", name: "Sales Portal", icon: Users, color: "bg-emerald-600" },
  { id: "public", name: "Public Website", icon: Globe, color: "bg-blue-600" },
]

// Navigation items for admin portal
const ADMIN_NAV = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Partners", href: "/admin/partners", icon: Users },
  { name: "Articles", href: "/admin/articles", icon: Newspaper },
  { name: "Resources", href: "/admin/resources", icon: FolderOpen },
  { name: "Documents", href: "/admin/documents", icon: FileText },
  { name: "Voice Agent", href: "/admin/voice-agent", icon: Phone },
  { name: "Commission Tiers", href: "/admin/commission-tiers", icon: Layers, disabled: true },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3, disabled: true },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [currentPortal, setCurrentPortal] = useState(PORTALS[0])
  const [user, setUser] = useState<AdminUser | null>(null)
  const [globalStats, setGlobalStats] = useState({
    totalPartners: 0,
    totalPolicies: 0,
    totalRevenue: 0,
    pendingItems: 0,
  })

  useEffect(() => {
    // Fetch user profile and global stats
    async function fetchData() {
      try {
        // Mock user for now - in production this would come from auth
        setUser({
          id: "admin-1",
          name: "Admin User",
          email: "admin@dailyeventinsurance.com",
          role: "admin",
        })

        // Fetch dashboard stats
        const response = await fetch("/api/admin/dashboard")
        const data = await response.json()
        if (data.success && data.data) {
          setGlobalStats({
            totalPartners: data.data.overview?.totalPartners || 0,
            totalPolicies: data.data.overview?.totalPolicies || 0,
            totalRevenue: data.data.revenue?.totalPremium || 0,
            pendingItems: data.data.overview?.pendingPartners || 0,
          })
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo & Portal Switcher */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo */}
              <Link href="/admin" className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${currentPortal.color} flex items-center justify-center`}>
                  <currentPortal.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 hidden sm:block">HiQOR Admin</span>
              </Link>

              {/* Portal Switcher */}
              <div className="relative">
                <button
                  onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <span className="hidden sm:inline">{currentPortal.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {portalDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setPortalDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                      <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Switch Portal
                      </p>
                      {PORTALS.map((portal) => (
                        <button
                          key={portal.id}
                          onClick={() => {
                            setCurrentPortal(portal)
                            setPortalDropdownOpen(false)
                            // In production, this would navigate to the portal
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
                            currentPortal.id === portal.id ? "bg-gray-50 text-indigo-600" : "text-gray-700"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg ${portal.color} flex items-center justify-center`}>
                            <portal.icon className="w-4 h-4 text-white" />
                          </div>
                          <span>{portal.name}</span>
                          {currentPortal.id === portal.id && (
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Center - Global Stats (Desktop) */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-500">Partners</p>
                <p className="text-sm font-bold text-gray-900">{globalStats.totalPartners}</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-xs text-gray-500">Policies</p>
                <p className="text-sm font-bold text-gray-900">{globalStats.totalPolicies}</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="text-sm font-bold text-emerald-600">{formatCurrency(globalStats.totalRevenue)}</p>
              </div>
              {globalStats.pendingItems > 0 && (
                <>
                  <div className="h-8 w-px bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-sm font-bold text-amber-600">{globalStats.pendingItems}</p>
                  </div>
                </>
              )}
            </div>

            {/* Right side - Search, Notifications, Profile */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5" />
                {globalStats.pendingItems > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    {user?.image ? (
                      <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                          {user?.role}
                        </span>
                      </div>

                      {/* Global Profile Stats */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Platform Overview
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-gray-500">Partners</p>
                            <p className="font-bold text-gray-900">{globalStats.totalPartners}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-gray-500">Policies</p>
                            <p className="font-bold text-gray-900">{globalStats.totalPolicies}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 col-span-2">
                            <p className="text-gray-500">Total Revenue</p>
                            <p className="font-bold text-emerald-600">{formatCurrency(globalStats.totalRevenue)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/admin/settings"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false)
                            // Handle logout
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:fixed md:left-0 md:top-16 md:bottom-0 md:w-64 md:flex md:flex-col bg-white border-r border-gray-200 overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.disabled ? "#" : item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  item.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
                {item.disabled && (
                  <span className="ml-auto text-xs text-gray-400">Soon</span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-50 md:hidden overflow-y-auto">
            <nav className="px-4 py-6 space-y-1">
              {ADMIN_NAV.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.disabled ? "#" : item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      item.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={(e) => {
                      if (item.disabled) e.preventDefault()
                      else setSidebarOpen(false)
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                    {item.disabled && (
                      <span className="ml-auto text-xs text-gray-400">Soon</span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="md:pl-64 pt-16">
        {children}
      </main>
    </div>
  )
}
