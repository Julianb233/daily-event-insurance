"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu, X, ChevronDown, Dumbbell, Mountain, Sparkles, Trophy, Building2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { industryCategories } from "@/lib/category-data"

interface CategoryLink {
  id: string
  label: string
  href: string
  description: string
  icon: React.ElementType
  color: string
}

const categoryIconMap: Record<string, React.ElementType> = {
  Dumbbell,
  Mountain,
  Sparkles,
  Trophy
}

const categories: CategoryLink[] = industryCategories.map((cat) => ({
  id: cat.id,
  label: cat.title,
  href: `/categories/${cat.slug}`,
  description: cat.description,
  icon: categoryIconMap[cat.icon] || Dumbbell,
  color: cat.color
}))

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
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
      setCategoriesOpen(false)
    }

    if (categoriesOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [categoriesOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    setCategoriesOpen(false)

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
    { label: "About", href: "/about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Who We Serve", href: "#who-we-serve" },
    { label: "How You Can Earn", href: "#calculator" },
    { label: "Benefits", href: "#benefits" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Carriers", href: "/carriers" },
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
                  src="/images/logo-color.png"
                  alt="Daily Event Insurance"
                  width={180}
                  height={40}
                  priority
                  className="h-auto w-auto max-h-10"
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

              {/* Categories Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
                  aria-expanded={categoriesOpen}
                  aria-haspopup="true"
                >
                  Industries
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      categoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="p-2">
                        {categories.map((category, idx) => {
                          const Icon = category.icon
                          return (
                            <motion.a
                              key={category.href}
                              href={category.href}
                              onClick={(e) => handleNavClick(e, category.href)}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 transition-colors group"
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                category.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                                category.color === 'sky' ? 'bg-sky-100 text-sky-600' :
                                category.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                'bg-orange-100 text-orange-600'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 text-sm group-hover:text-[#14B8A6] transition-colors">
                                  {category.label}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                  {category.description}
                                </div>
                              </div>
                            </motion.a>
                          )
                        })}
                        {/* Divider */}
                        <div className="my-2 border-t border-slate-100" />
                        {/* For Carriers Link */}
                        <motion.a
                          href="/carriers"
                          onClick={(e) => handleNavClick(e, "/carriers")}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: categories.length * 0.05 }}
                          className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-100 text-emerald-600">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 text-sm group-hover:text-[#14B8A6] transition-colors">
                              For Insurance Carriers
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              Partner with us for embedded distribution
                            </div>
                          </div>
                        </motion.a>
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
                Apply Now
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
              {/* Mobile Menu Logo */}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -20 },
                }}
                className="mb-8"
              >
                <a
                  href="/"
                  onClick={(e) => handleNavClick(e, "/")}
                  className="flex items-center"
                >
                  <Image
                    src="/images/logo-color.png"
                    alt="Daily Event Insurance"
                    width={180}
                    height={40}
                    className="h-auto w-auto max-h-10"
                  />
                </a>
              </motion.div>

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

                {/* Mobile Categories Accordion */}
                <motion.li
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 },
                  }}
                >
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                    aria-expanded={mobileCategoriesOpen}
                  >
                    Industries
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        mobileCategoriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileCategoriesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-2 space-y-1">
                          {categories.map((category) => {
                            const Icon = category.icon
                            return (
                              <a
                                key={category.href}
                                href={category.href}
                                onClick={(e) => handleNavClick(e, category.href)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-[#14B8A6] hover:bg-[#14B8A6]/5 rounded-md transition-colors"
                              >
                                <Icon className="w-4 h-4" />
                                {category.label}
                              </a>
                            )
                          })}
                          {/* Divider */}
                          <div className="my-2 border-t border-slate-100 mx-4" />
                          {/* For Carriers Link */}
                          <a
                            href="/carriers"
                            onClick={(e) => handleNavClick(e, "/carriers")}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-[#14B8A6] hover:bg-[#14B8A6]/5 rounded-md transition-colors"
                          >
                            <Building2 className="w-4 h-4" />
                            For Insurance Carriers
                          </a>
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
                  Apply Now
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
