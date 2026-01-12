"use client"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-[#F8FAFC] pt-16 pb-8 px-4 md:px-8 border-t border-gray-200">
      <div className="w-full max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-[#1E293B] mb-2">
                Daily Event Insurance
              </h3>
              <p className="text-sm text-[#14B8A6] font-medium mb-4">
                A HiQOR Company
              </p>
              <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                Empowering fitness businesses with embedded insurance technology.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-gray-200 flex items-center justify-center hover:bg-[#14B8A6] hover:border-[#14B8A6] transition-all group"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5 text-[#64748B] group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "How It Works", href: "/#how-it-works" },
                { name: "Who We Serve", href: "/#who-we-serve" },
                { name: "Benefits", href: "/#benefits" },
                { name: "Pricing", href: "/pricing" },
                { name: "For Carriers", href: "/carriers" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#64748B] hover:text-[#14B8A6] transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Industries We Serve */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider mb-4">
              Industries We Serve
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Race Directors", href: "/industries/race-directors" },
                { name: "Cycling Events", href: "/industries/cycling-events" },
                { name: "Triathlons", href: "/industries/triathlons" },
                { name: "Obstacle Courses", href: "/industries/obstacle-courses" },
                { name: "Marathons & Fun Runs", href: "/industries/marathons" },
                { name: "Corporate Wellness", href: "/industries/corporate-wellness" },
                { name: "Schools & Universities", href: "/industries/schools-universities" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#64748B] hover:text-[#14B8A6] transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Get Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider mb-4">
              Get Started
            </h4>
            <p className="text-sm text-[#64748B] mb-6">
              Ready to start earning commission? Sign up today—no contracts, no setup fees.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href="/#apply"
                className="inline-flex items-center justify-center gap-2 bg-[#14B8A6] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#0D9488] transition-colors text-sm"
              >
                Get Started Today
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              {/* Click-to-Call CTA */}
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#14B8A6] font-semibold px-6 py-3 rounded-lg border-2 border-[#14B8A6] hover:bg-[#F0FDFA] transition-colors text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Talk to a Specialist
              </a>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <p className="text-sm text-[#64748B]">
                <a
                  href="tel:+15551234567"
                  className="text-[#14B8A6] hover:text-[#0D9488] font-medium"
                >
                  (555) 123-4567
                </a>
              </p>
              <p className="text-sm text-[#64748B]">
                <a
                  href="mailto:partners@dailyeventinsurance.com"
                  className="text-[#14B8A6] hover:text-[#0D9488] font-medium"
                >
                  partners@dailyeventinsurance.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#64748B] font-medium">
              © {new Date().getFullYear()} Daily Event Insurance. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm text-[#64748B]">
              <Link href="/privacy" className="hover:text-[#14B8A6] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#14B8A6] transition-colors">
                Terms of Service
              </Link>
              <Link href="/insurance-disclosure" className="hover:text-[#14B8A6] transition-colors">
                Insurance Disclosure
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#64748B]">
              <span>Powered by</span>
              <Link
                href="https://hiqor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#14B8A6] hover:text-[#0D9488] transition-colors"
              >
                HiQOR
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <p className="text-xs text-[#64748B] leading-relaxed text-center md:text-left max-w-4xl">
              Daily Event Insurance provides flexible event coverage options. Insurance products are underwritten by licensed insurers.
              Coverage availability and terms may vary by state and event type. Please review policy documents for full terms and conditions.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
