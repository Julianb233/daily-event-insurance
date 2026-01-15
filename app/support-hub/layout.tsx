"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Code,
  HelpCircle,
  Wrench,
  Building2,
  GraduationCap,
  Menu,
  X,
  Home,
  ChevronRight
} from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/support-hub",
    icon: Home,
    description: "Support hub home"
  },
  {
    name: "Getting Started",
    href: "/support-hub/getting-started",
    icon: BookOpen,
    description: "Quick start guide"
  },
  {
    name: "Integrations",
    href: "/support-hub/integrations",
    icon: Code,
    description: "POS systems & APIs"
  },
  {
    name: "FAQ",
    href: "/support-hub/faq",
    icon: HelpCircle,
    description: "Common questions"
  },
  {
    name: "Troubleshooting",
    href: "/support-hub/troubleshooting",
    icon: Wrench,
    description: "Fix common issues"
  },
  {
    name: "Enterprise",
    href: "/support-hub/enterprise",
    icon: Building2,
    description: "Advanced features"
  },
  {
    name: "Training",
    href: "/support-hub/training",
    icon: GraduationCap,
    description: "Agent resources"
  }
]

export default function SupportHubLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30">
      <Header />

      {/* Mesh gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-28">
                <div className="
                  bg-white/70 backdrop-blur-xl
                  border border-white/20
                  rounded-2xl
                  shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
                  overflow-hidden
                ">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">
                      Support Hub
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Documentation & Resources
                    </p>
                  </div>

                  <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon

                      return (
                        <Link key={item.href} href={item.href}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className={`
                              relative flex items-center gap-3 px-4 py-3 rounded-xl
                              transition-all duration-200
                              ${isActive
                                ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/30"
                                : "text-slate-700 hover:bg-slate-100/50"
                              }
                            `}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold">{item.name}</div>
                              <div className={`text-xs ${isActive ? "text-white/80" : "text-slate-500"}`}>
                                {item.description}
                              </div>
                            </div>
                            {isActive && (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </motion.div>
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Quick Contact */}
                  <div className="p-6 border-t border-slate-100 bg-gradient-to-br from-teal-50/50 to-blue-50/50">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      Need Help?
                    </h3>
                    <p className="text-xs text-slate-600 mb-3">
                      Our team is here to assist you
                    </p>
                    <Link
                      href="/support"
                      className="
                        block w-full px-4 py-2.5 text-center
                        bg-gradient-to-r from-teal-500 to-blue-500
                        text-white font-semibold rounded-xl
                        hover:shadow-lg hover:shadow-teal-500/30
                        transition-all duration-300
                      "
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                lg:hidden fixed bottom-6 right-6 z-50
                w-14 h-14 rounded-full
                bg-gradient-to-r from-teal-500 to-blue-500
                text-white shadow-lg shadow-teal-500/30
                flex items-center justify-center
              "
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Sidebar */}
            <AnimatePresence>
              {sidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  />
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25 }}
                    className="
                      lg:hidden fixed inset-y-0 left-0 z-50 w-80
                      bg-white/95 backdrop-blur-xl
                      shadow-2xl overflow-y-auto
                    "
                  >
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Support Hub
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                          Documentation & Resources
                        </p>
                      </div>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <nav className="p-4 space-y-1">
                      {navigation.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <div
                              className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl
                                transition-all duration-200
                                ${isActive
                                  ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white"
                                  : "text-slate-700 hover:bg-slate-100"
                                }
                              `}
                            >
                              <Icon className="w-5 h-5" />
                              <div>
                                <div className="font-semibold">{item.name}</div>
                                <div className={`text-xs ${isActive ? "text-white/80" : "text-slate-500"}`}>
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </nav>

                    <div className="p-6 border-t border-slate-100">
                      <Link
                        href="/support"
                        className="
                          block w-full px-4 py-2.5 text-center
                          bg-gradient-to-r from-teal-500 to-blue-500
                          text-white font-semibold rounded-xl
                        "
                      >
                        Contact Support
                      </Link>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
