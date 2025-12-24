"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

interface IndustryLink {
  label: string
  href: string
  description: string
}

const industries: IndustryLink[] = [
  { label: "Race Directors", href: "/industries/race-directors", description: "Insurance solutions for race organizers" },
  { label: "Cycling Events", href: "/industries/cycling-events", description: "Comprehensive coverage for cycling competitions" },
  { label: "Triathlons", href: "/industries/triathlons", description: "Multi-sport event insurance coverage" },
  { label: "Obstacle Courses", href: "/industries/obstacle-courses", description: "Protection for challenging events" },
  { label: "Marathons & Fun Runs", href: "/industries/marathons", description: "Coverage for running events of all sizes" },
  { label: "Corporate Wellness", href: "/industries/corporate-wellness", description: "Employee wellness event insurance" },
  { label: "Schools & Universities", href: "/industries/schools-universities", description: "Educational institution event coverage" },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [industriesOpen, setIndustriesOpen] = useState(false)
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 20)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [menuOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIndustriesOpen(false)
    }

    if (industriesOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [industriesOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    setIndustriesOpen(false)

    // If it's a page link (not a hash), navigate to it
    if (!href.startsWith("#")) {
      router.push(href)
      return
    }

    // If we're not on the home page and clicking a hash link, go home first
    if (pathname !== "/") {
      router.push("/" + href)
      return
    }

    // Scroll to element
    const elementId = href.replace("#", "")
    const element = document.getElementById(elementId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const navigationLinks = [
    { label: "Connect", href: "/connect" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Who We Serve", href: "#who-we-serve" },
    { label: "How You Can Earn", href: "/#revenue-calculator" },
    { label: "Benefits", href: "#benefits" },
    { label: "Pricing", href: "/pricing" },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)]"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <a
                href="/"
                onClick={(e) => handleNavClick(e, "/")}
                className="flex items-center gap-2 group"
              >
                <Image
                  src="/images/dei-logo.svg"
                  alt="Daily Event Insurance"
                  width={220}
                  height={44}
                  className="h-10 w-auto"
                  priority
                />
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:flex items-center gap-1"
            >
              {navigationLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="px-4 py-2 text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Industries Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => setIndustriesOpen(!industriesOpen)}
                  className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
                  aria-expanded={industriesOpen}
                  aria-haspopup="true"
                >
                  Industries
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      industriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {industriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="py-2">
                        {industries.map((industry, idx) => (
                          <motion.a
                            key={industry.href}
                            href={industry.href}
                            onClick={(e) => handleNavClick(e, industry.href)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="block px-4 py-3 hover:bg-[#14B8A6]/5 transition-colors group"
                          >
                            <div className="font-medium text-slate-900 text-sm group-hover:text-[#14B8A6] transition-colors">
                              {industry.label}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {industry.description}
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.nav>

            {/* Right Side Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              {/* CTA Button */}
              <motion.a
                href="#apply"
                onClick={(e) => handleNavClick(e, "#apply")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:flex items-center px-5 py-2 bg-[#14B8A6] text-white font-medium text-[15px] rounded-md hover:bg-[#0F9F90] transition-all"
              >
                Get Demo
              </motion.a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-40 lg:hidden overflow-y-auto"
            onClick={() => setMenuOpen(false)}
          >
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.07,
                    delayChildren: 0.15
                  }
                },
                closed: {
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1
                  }
                },
              }}
              className="flex flex-col h-full px-6 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.ul className="space-y-1">
                {navigationLinks.map((link) => (
                  <motion.li
                    key={link.label}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -20 },
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}

                {/* Mobile Industries Accordion */}
                <motion.li
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 },
                  }}
                >
                  <button
                    onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                    aria-expanded={mobileIndustriesOpen}
                  >
                    Industries
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        mobileIndustriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileIndustriesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-2 space-y-1">
                          {industries.map((industry) => (
                            <a
                              key={industry.href}
                              href={industry.href}
                              onClick={(e) => handleNavClick(e, industry.href)}
                              className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-[#14B8A6] hover:bg-[#14B8A6]/5 rounded-md transition-colors"
                            >
                              {industry.label}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              </motion.ul>

              {/* Mobile Actions */}
              <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 },
                }}
                className="mt-8 space-y-4"
              >
                <a
                  href="#apply"
                  onClick={(e) => handleNavClick(e, "#apply")}
                  className="block px-6 py-3 bg-[#14B8A6] text-white font-medium text-base rounded-md hover:bg-[#0F9F90] transition-all text-center"
                >
                  Get Demo
                </a>
              </motion.div>

              {/* Professional Tagline */}
              <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 },
                }}
                className="mt-auto mb-8 px-4"
              >
                <p className="text-sm text-slate-500">
                  Enterprise event insurance made simple
                </p>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
