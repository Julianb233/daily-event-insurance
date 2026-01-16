"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useVoiceAgent } from "@/lib/voice/voice-context"

export default function Footer() {
  const { openVoiceAgent } = useVoiceAgent()
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
              <Image
                src="/images/logo-color.png"
                alt="Daily Event Insurance"
                width={234}
                height={59}
                className="h-[62px] w-auto mb-2"
              />
              <p className="text-sm text-[#14B8A6] font-medium mb-4">
                A HiQor Partner
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
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
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
                { name: "About Us", href: "/about" },
                { name: "For Carriers", href: "/carriers" },
                { name: "Support Hub", href: "/support-hub" },
                { name: "Work with HiQor", href: "/support-hub/partner-program" },
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
                { name: "Gem Shows", href: "/industries/gem-shows" },
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

            {/* CTA Buttons - Open Voice Chat */}
            <div className="flex flex-col gap-3">
              <button
                onClick={openVoiceAgent}
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
              </button>

              {/* Start Today - Opens Voice Chat */}
              <button
                onClick={openVoiceAgent}
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Start Today • $0 Setup
              </button>
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

        {/* HiQor Partnership Disclosure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-8 p-6 bg-[#F8FAFC] rounded-xl border border-gray-200"
        >
          <h4 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider mb-3">
            Partnership Disclosure
          </h4>
          <p className="text-xs text-[#64748B] leading-relaxed">
            <strong>Important:</strong> Daily Event Insurance is an independent company and is not owned by,
            controlled by, or a subsidiary of HiQor. We operate as a HiQor Partner through a referral
            partnership arrangement. HiQor does not underwrite, sell, or administer insurance policies
            offered through Daily Event Insurance. This partnership allows us to provide enhanced services
            to our customers while maintaining our independence as a separate business entity. For questions
            about our partnership, please contact us at{" "}
            <a
              href="mailto:partners@dailyeventinsurance.com"
              className="text-[#14B8A6] hover:text-[#0D9488]"
            >
              partners@dailyeventinsurance.com
            </a>.
          </p>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          {/* Bottom bar with logo on left */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo on the left */}
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo-color.png"
                alt="Daily Event Insurance"
                width={218}
                height={73}
                className="h-[73px] w-auto"
              />
              <p className="text-sm text-[#64748B] font-medium">
                © {new Date().getFullYear()} Daily Event Insurance. All rights reserved.
              </p>
            </div>

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
              <Link href="/compliance" className="hover:text-[#14B8A6] transition-colors">
                Compliance
              </Link>
              <Link href="/security" className="hover:text-[#14B8A6] transition-colors">
                Security
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#64748B]">
              <span>A</span>
              <Link
                href="https://hiqor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#14B8A6] hover:text-[#0D9488] transition-colors"
              >
                HiQor
              </Link>
              <span>Partner</span>
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
