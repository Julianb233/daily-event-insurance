"use client"

import { ReactNode, useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  ClipboardCheck,
  Scale,
  Award,
  BookOpen,
  Server,
  FileText,
  ChevronRight,
  Home,
  ShieldCheck,
  Search,
  X,
  Plug,
  ArrowRight,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  keywords: string[]
  documentId: string
}

const complianceNav: NavItem[] = [
  {
    href: "/insurance/compliance",
    label: "Overview",
    icon: ShieldCheck,
    description: "Compliance summary and certifications",
    keywords: ["overview", "summary", "certifications", "SOC 2", "PCI DSS", "NAIC"],
    documentId: "DOC-001",
  },
  {
    href: "/insurance/compliance/data-security",
    label: "Data Security",
    icon: Lock,
    description: "Encryption, access controls, and security standards",
    keywords: ["encryption", "TLS", "AES-256", "access control", "RBAC", "firewall", "SOC 2", "penetration testing"],
    documentId: "DOC-002",
  },
  {
    href: "/insurance/compliance/privacy",
    label: "Privacy & Data Protection",
    icon: Eye,
    description: "CCPA, GDPR, and data handling procedures",
    keywords: ["privacy", "CCPA", "GDPR", "data protection", "consent", "data subject rights", "opt-out", "deletion"],
    documentId: "DOC-003",
  },
  {
    href: "/insurance/compliance/aml-kyc",
    label: "AML/KYC Program",
    icon: UserCheck,
    description: "Anti-money laundering and customer verification",
    keywords: ["AML", "KYC", "anti-money laundering", "customer identification", "CIP", "CDD", "SAR", "FinCEN", "OFAC", "sanctions"],
    documentId: "DOC-004",
  },
  {
    href: "/insurance/compliance/audit-records",
    label: "Audit & Records",
    icon: ClipboardCheck,
    description: "Audit trails and record retention policies",
    keywords: ["audit", "audit trail", "records", "retention", "7 years", "logging", "immutable", "archive"],
    documentId: "DOC-005",
  },
  {
    href: "/insurance/compliance/consumer-protection",
    label: "Consumer Protection",
    icon: Shield,
    description: "Fair dealing and complaint procedures",
    keywords: ["consumer", "protection", "complaints", "claims", "appeals", "fair dealing", "UCSPA", "disclosure"],
    documentId: "DOC-006",
  },
  {
    href: "/insurance/compliance/licensing",
    label: "Licensing & Registration",
    icon: Award,
    description: "State licenses and regulatory registrations",
    keywords: ["licensing", "license", "registration", "state", "NAIC", "producer", "appointment", "continuing education"],
    documentId: "DOC-007",
  },
  {
    href: "/insurance/compliance/integrations",
    label: "Integration Compliance",
    icon: Plug,
    description: "Microsite, API, and webhook compliance",
    keywords: ["integration", "microsite", "API", "webhook", "partner", "authentication", "OAuth", "HMAC", "data flow"],
    documentId: "DOC-008",
  },
  {
    href: "/insurance/compliance/technical-specifications",
    label: "Technical Specifications",
    icon: Server,
    description: "System architecture and security controls",
    keywords: ["technical", "architecture", "infrastructure", "cloud", "AWS", "disaster recovery", "RTO", "RPO", "backup"],
    documentId: "DOC-009",
  },
  {
    href: "/insurance/compliance/glossary",
    label: "Glossary & Definitions",
    icon: BookOpen,
    description: "Compliance terminology and definitions",
    keywords: ["glossary", "definitions", "terms", "terminology", "acronyms"],
    documentId: "DOC-010",
  },
]

export default function ComplianceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Filter documents based on search query
  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return complianceNav
    const query = searchQuery.toLowerCase()
    return complianceNav.filter(
      (doc) =>
        doc.label.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    )
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-[100] flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search compliance documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-lg outline-none placeholder:text-slate-400"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {filteredDocs.length > 0 ? (
                  <div className="p-2">
                    {filteredDocs.map((doc) => (
                      <Link
                        key={doc.href}
                        href={doc.href}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <doc.icon className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{doc.label}</span>
                            <span className="text-xs text-slate-400 font-mono">{doc.documentId}</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{doc.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {doc.keywords.slice(0, 4).map((keyword) => (
                              <span
                                key={keyword}
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-3" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">No documents found</p>
                    <p className="text-sm text-slate-400 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>

              {/* Search Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>{complianceNav.length} compliance documents available</span>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">ESC</kbd>
                  <span>to close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-slate-500 hover:text-teal-600 transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <Link href="/insurance/compliance" className="text-slate-500 hover:text-teal-600 transition-colors">
                Compliance
              </Link>
              {pathname !== "/insurance/compliance" && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <span className="text-slate-900 font-medium">
                    {complianceNav.find((item) => item.href === pathname)?.label || "Details"}
                  </span>
                </>
              )}
            </nav>

            {/* Search & Quick Links */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">Search docs...</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-400">
                  /
                </kbd>
              </button>
              <Link
                href="/insurance-disclosure"
                className="text-slate-500 hover:text-teal-600 transition-colors"
              >
                Insurance Disclosure
              </Link>
              <a
                href="mailto:compliance@dailyeventinsurance.com"
                className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                Contact Compliance
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              {/* Compliance Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Compliance Center</h2>
                    <p className="text-xs text-slate-500">Regulatory Documentation</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {complianceNav.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all
                        ${isActive
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? "text-teal-600" : ""}`} />
                      <div>
                        <div className={`font-medium text-sm ${isActive ? "text-teal-700" : ""}`}>
                          {item.label}
                        </div>
                        <div className={`text-xs mt-0.5 ${isActive ? "text-teal-600/70" : "text-slate-400"}`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </nav>

              {/* Contact Box */}
              <div className="mt-8 p-4 bg-slate-100 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 text-sm mb-2">Compliance Inquiries</h3>
                <p className="text-xs text-slate-600 mb-3">
                  For due diligence requests or compliance documentation, contact our team.
                </p>
                <a
                  href="mailto:compliance@dailyeventinsurance.com"
                  className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  compliance@dailyeventinsurance.com
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
