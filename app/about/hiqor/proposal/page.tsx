'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FileText,
  Mail,
  BarChart3,
  FileCheck,
  ExternalLink,
  Download,
  Presentation,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

const documents = [
  {
    title: 'Executive Summary',
    description: 'One-page overview of the partnership opportunity, terms, and growth roadmap. Print-friendly format.',
    icon: FileText,
    file: '/hiqor-partnership-proposal/executive-summary.html',
    color: 'from-teal-500 to-emerald-500',
    highlights: ['Partnership Terms', 'Value Propositions', 'Growth Roadmap']
  },
  {
    title: 'Partnership Terms',
    description: 'Detailed terms sheet covering revenue structure, microsite services, included services, and contract terms.',
    icon: FileCheck,
    file: '/hiqor-partnership-proposal/partnership-terms.html',
    color: 'from-blue-500 to-cyan-500',
    highlights: ['70/30 Revenue Split', '$600/mo Microsite', 'Full Support Included']
  },
  {
    title: 'Platform Features',
    description: 'Comprehensive showcase of our platform capabilities including dashboards, analytics, and support tools.',
    icon: BarChart3,
    file: '/hiqor-partnership-proposal/platform-features.html',
    color: 'from-violet-500 to-purple-500',
    highlights: ['Partner Dashboard', 'Conversion Metrics', 'Live Support']
  },
  {
    title: 'Email Template',
    description: 'Ready-to-use email template for stakeholder outreach with partnership overview and key terms.',
    icon: Mail,
    file: '/hiqor-partnership-proposal/email-template.html',
    color: 'from-orange-500 to-amber-500',
    highlights: ['Copy & Paste Ready', 'Key Terms Summary', 'CTA Included']
  }
]

const keyTerms = [
  { label: 'Revenue Split', value: '70/30', sublabel: 'HIQOR / DEI' },
  { label: 'Microsite Cost', value: '$600', sublabel: 'per month' },
  { label: 'Support', value: 'Full', sublabel: 'Included' },
  { label: 'Onboarding', value: 'Complete', sublabel: 'Training Included' }
]

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/logo-color.png"
                alt="Daily Event Insurance"
                className="h-8"
              />
            </Link>
            <Link
              href="/about/hiqor/presentation"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all"
            >
              <Presentation className="w-4 h-4" />
              View Full Presentation
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Partnership Proposal Documents
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Daily Event Insurance
              <span className="block text-teal-600">+ HIQOR Partnership</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              All the documents you need to review our strategic partnership proposal.
              View online, download, or share with your team.
            </p>
          </motion.div>

          {/* Key Terms Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {keyTerms.map((term, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
              >
                <div className="text-2xl font-bold text-teal-600">{term.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">{term.label}</div>
                <div className="text-xs text-slate-400">{term.sublabel}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${doc.color} p-6`}>
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <doc.icon className="w-7 h-7 text-white" />
                      </div>
                      <a
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open
                      </a>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-4">{doc.title}</h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {doc.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {doc.highlights.map((highlight, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-teal-500" />
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <a
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors"
                      >
                        View Document
                        <ArrowRight className="w-4 h-4" />
                      </a>
                      <a
                        href={doc.file}
                        download
                        className="flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to See the Full Presentation?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Our interactive presentation includes live demos, detailed financials,
              platform screenshots, and the complete partnership roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/about/hiqor/presentation"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all"
              >
                <Presentation className="w-5 h-5" />
                View Full Presentation
              </Link>
              <a
                href="mailto:julian@dailyeventinsurance.com?subject=HIQOR Partnership Inquiry"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            <strong className="text-slate-700">Daily Event Insurance</strong> &middot; Events-Based InsurTech Platform
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Insurance that activates only when an event is happening
          </p>
        </div>
      </footer>
    </div>
  )
}
