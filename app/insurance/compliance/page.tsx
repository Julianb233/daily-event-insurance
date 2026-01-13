"use client"

import type { Metadata } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  FileCheck,
  Users,
  Database,
  Eye,
  AlertTriangle,
  CheckCircle,
  Building2,
  Scale,
  FileText,
  Server,
  UserCheck,
  Clock,
  Globe,
  Phone,
  Mail,
  MapPin,
  Award,
  Fingerprint,
  ShieldCheck,
  ClipboardCheck,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

// Compliance status types
type ComplianceStatus = 'implemented' | 'in_progress' | 'planned'

interface ComplianceItem {
  title: string
  description: string
  status: ComplianceStatus
  details?: string[]
}

const statusColors = {
  implemented: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  planned: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
}

const statusLabels = {
  implemented: 'Implemented',
  in_progress: 'In Progress',
  planned: 'Planned',
}

// Compliance data
const dataSecurityItems: ComplianceItem[] = [
  {
    title: 'End-to-End Encryption',
    description: 'All data transmitted between users and our servers is encrypted using TLS 1.3',
    status: 'implemented',
    details: ['256-bit AES encryption', 'Perfect forward secrecy', 'HTTPS-only access'],
  },
  {
    title: 'Payment Security (PCI DSS)',
    description: 'Payment processing compliant with Payment Card Industry Data Security Standards',
    status: 'implemented',
    details: ['Stripe-powered payments', 'No card data stored on our servers', 'Level 1 PCI compliant partner'],
  },
  {
    title: 'Access Controls',
    description: 'Role-based access control (RBAC) with principle of least privilege',
    status: 'implemented',
    details: ['Multi-tier role hierarchy', 'Granular permissions', 'Admin audit trails'],
  },
  {
    title: 'SOC 2 Type II',
    description: 'Service Organization Control certification for security, availability, and confidentiality',
    status: 'in_progress',
    details: ['Trust services criteria', 'Annual audits', 'Third-party verification'],
  },
  {
    title: 'Database Encryption at Rest',
    description: 'All stored data encrypted using industry-standard encryption',
    status: 'implemented',
    details: ['AES-256 encryption', 'Key management system', 'Encrypted backups'],
  },
]

const privacyItems: ComplianceItem[] = [
  {
    title: 'CCPA Compliance',
    description: 'California Consumer Privacy Act compliance for California residents',
    status: 'implemented',
    details: ['Right to know', 'Right to delete', 'Right to opt-out', 'Non-discrimination'],
  },
  {
    title: 'GDPR Readiness',
    description: 'General Data Protection Regulation framework for EU data subjects',
    status: 'in_progress',
    details: ['Data portability', 'Right to erasure', 'Lawful processing basis', 'Data protection officer'],
  },
  {
    title: 'Privacy Policy',
    description: 'Comprehensive privacy policy covering all data collection and usage',
    status: 'implemented',
    details: ['Transparent data practices', 'Third-party disclosures', 'Cookie policy', 'Regular updates'],
  },
  {
    title: 'Data Minimization',
    description: 'Collection limited to data necessary for service delivery',
    status: 'implemented',
    details: ['Purpose limitation', 'Storage limitation', 'Data accuracy'],
  },
]

const amlKycItems: ComplianceItem[] = [
  {
    title: 'Customer Identification',
    description: 'Verification of customer identity during onboarding',
    status: 'implemented',
    details: ['Email verification', 'Phone verification', 'Business verification for partners'],
  },
  {
    title: 'Partner Due Diligence',
    description: 'Enhanced verification for business partners',
    status: 'implemented',
    details: ['W-9 collection', 'Business entity verification', 'Ownership documentation'],
  },
  {
    title: 'Transaction Monitoring',
    description: 'Automated monitoring of transactions for suspicious activity',
    status: 'in_progress',
    details: ['Rule-based detection', 'Anomaly detection', 'Risk scoring'],
  },
  {
    title: 'PEP/Sanctions Screening',
    description: 'Politically Exposed Persons and sanctions list screening',
    status: 'planned',
    details: ['OFAC screening', 'PEP database checks', 'Ongoing monitoring'],
  },
]

const auditItems: ComplianceItem[] = [
  {
    title: 'Complete Audit Trail',
    description: 'Comprehensive logging of all system activities and transactions',
    status: 'implemented',
    details: ['User actions', 'API requests', 'Data changes', 'Authentication events'],
  },
  {
    title: '7-Year Record Retention',
    description: 'Insurance records retained for regulatory compliance period',
    status: 'implemented',
    details: ['Policy documents', 'Transaction records', 'Claims history', 'Communication logs'],
  },
  {
    title: 'Real-Time Logging',
    description: 'Immediate capture of all compliance-relevant events',
    status: 'implemented',
    details: ['Timestamp accuracy', 'Immutable logs', 'Request tracing'],
  },
  {
    title: 'Audit Report Generation',
    description: 'On-demand generation of compliance and audit reports',
    status: 'in_progress',
    details: ['Custom date ranges', 'Exportable formats', 'Regulatory templates'],
  },
]

const consumerProtectionItems: ComplianceItem[] = [
  {
    title: 'Transparent Pricing',
    description: 'Clear disclosure of all fees, premiums, and coverage terms',
    status: 'implemented',
    details: ['No hidden fees', 'Coverage summaries', 'Policy comparison'],
  },
  {
    title: 'Claims Process',
    description: 'Documented and accessible claims filing and resolution process',
    status: 'implemented',
    details: ['Online claims portal', 'Status tracking', 'Appeal procedures'],
  },
  {
    title: 'Complaint Resolution',
    description: 'Formal complaint handling and resolution procedures',
    status: 'implemented',
    details: ['Dedicated support', 'Escalation path', 'Response timelines'],
  },
  {
    title: 'Policy Documentation',
    description: 'Clear and accessible insurance policy documents',
    status: 'implemented',
    details: ['Plain language', 'Digital delivery', 'Print on demand'],
  },
]

const licensingItems: ComplianceItem[] = [
  {
    title: 'State Insurance Licenses',
    description: 'Licensed as insurance producer in operating states',
    status: 'in_progress',
    details: ['Multi-state licensing', 'Annual renewals', 'Compliance monitoring'],
  },
  {
    title: 'NAIC Compliance',
    description: 'Adherence to National Association of Insurance Commissioners model laws',
    status: 'implemented',
    details: ['Model law compliance', 'Regulatory reporting', 'Best practices'],
  },
  {
    title: 'Producer Appointments',
    description: 'Appointed with insurance carriers to sell their products',
    status: 'in_progress',
    details: ['Carrier partnerships', 'Product training', 'Ongoing supervision'],
  },
]

function ComplianceStatusBadge({ status }: { status: ComplianceStatus }) {
  const colors = statusColors[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {statusLabels[status]}
    </span>
  )
}

function ComplianceCard({ item, delay }: { item: ComplianceItem; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h4 className="font-semibold text-slate-900">{item.title}</h4>
        <ComplianceStatusBadge status={item.status} />
      </div>
      <p className="text-slate-600 text-sm mb-4">{item.description}</p>
      {item.details && (
        <ul className="space-y-1.5">
          {item.details.map((detail, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
              {detail}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

function ComplianceSection({
  title,
  description,
  icon: Icon,
  items,
  id,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  items: ComplianceItem[]
  id: string
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-start gap-4 mb-8"
      >
        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-slate-600">{description}</p>
        </div>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <ComplianceCard key={item.title} item={item} delay={idx * 0.1} />
        ))}
      </div>
    </section>
  )
}

export default function InsuranceCompliancePage() {
  const sections = [
    { id: 'data-security', title: 'Data Security', icon: Lock },
    { id: 'privacy', title: 'Privacy Protection', icon: Eye },
    { id: 'aml-kyc', title: 'AML/KYC', icon: UserCheck },
    { id: 'audit', title: 'Audit & Records', icon: ClipboardCheck },
    { id: 'consumer', title: 'Consumer Protection', icon: Shield },
    { id: 'licensing', title: 'Licensing', icon: Award },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Insurance Compliance</h1>
                <p className="text-slate-500 text-sm">Regulatory & Security Standards</p>
              </div>
            </div>
            <p className="text-slate-600 max-w-3xl mt-4 text-lg">
              Daily Event Insurance is committed to maintaining the highest standards of regulatory compliance,
              data security, and consumer protection. Our platform is built to meet and exceed insurance
              industry requirements.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <span className="text-sm text-slate-500 flex-shrink-0">Jump to:</span>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-teal-600 whitespace-nowrap transition-colors"
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { label: 'Data Security Controls', value: '25+', icon: Lock },
            { label: 'Audit Log Events', value: '100%', icon: ClipboardCheck },
            { label: 'Compliance Areas', value: '6', icon: FileCheck },
            { label: 'Record Retention', value: '7 Years', icon: Clock },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-slate-200 p-5 text-center"
            >
              <stat.icon className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Compliance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-100 p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-teal-600" />
            Our Compliance Commitment
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-700 leading-relaxed mb-4">
                As an insurtech platform connecting fitness facilities, adventure sports operators, and
                rental businesses with insurance coverage, we understand the critical importance of
                regulatory compliance. Our infrastructure is designed from the ground up to meet the
                rigorous standards required by insurance carriers, state regulators, and federal authorities.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We continuously invest in our compliance infrastructure to ensure we meet evolving
                regulatory requirements and industry best practices. Our goal is to become a trusted
                broker of record, demonstrating to carriers that we maintain the highest standards of
                operation.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Key Regulatory Bodies</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-800">NAIC</span>
                    <p className="text-sm text-slate-500">National Association of Insurance Commissioners</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-800">State DOIs</span>
                    <p className="text-sm text-slate-500">State Departments of Insurance</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-800">FinCEN</span>
                    <p className="text-sm text-slate-500">Financial Crimes Enforcement Network</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-800">FTC</span>
                    <p className="text-sm text-slate-500">Federal Trade Commission (Privacy)</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Compliance Sections */}
        <div className="space-y-16">
          <ComplianceSection
            id="data-security"
            title="Data Security & Protection"
            description="Enterprise-grade security controls protecting customer data and ensuring platform integrity."
            icon={Lock}
            items={dataSecurityItems}
          />

          <ComplianceSection
            id="privacy"
            title="Privacy Protection"
            description="Comprehensive privacy framework ensuring customer data rights and transparent data practices."
            icon={Eye}
            items={privacyItems}
          />

          <ComplianceSection
            id="aml-kyc"
            title="Anti-Money Laundering & Know Your Customer"
            description="Robust customer verification and transaction monitoring to prevent financial crimes."
            icon={UserCheck}
            items={amlKycItems}
          />

          <ComplianceSection
            id="audit"
            title="Audit Trail & Record Keeping"
            description="Complete audit capabilities with regulatory-compliant record retention."
            icon={ClipboardCheck}
            items={auditItems}
          />

          <ComplianceSection
            id="consumer"
            title="Consumer Protection"
            description="Transparent practices and accessible processes ensuring fair treatment of all customers."
            icon={Shield}
            items={consumerProtectionItems}
          />

          <ComplianceSection
            id="licensing"
            title="Licensing & Regulatory Status"
            description="Insurance producer licensing and regulatory compliance across operating jurisdictions."
            icon={Award}
            items={licensingItems}
          />
        </div>

        {/* Carrier Partnership Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">For Insurance Carriers</h2>
              <p className="text-slate-300">
                Partner with a compliant, technology-driven distribution platform
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-teal-400">Why Partner With Us</h3>
              <ul className="space-y-3">
                {[
                  'Full regulatory compliance infrastructure',
                  'Complete audit trail on all transactions',
                  'Automated policy administration',
                  'Real-time reporting and analytics',
                  'Embedded distribution through partner network',
                  'Technology-first approach to insurance distribution',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-teal-400">Due Diligence Available</h3>
              <ul className="space-y-3">
                {[
                  'Security and compliance documentation',
                  'Technology architecture overview',
                  'Business continuity plans',
                  'Privacy impact assessments',
                  'Penetration test results (upon request)',
                  'SOC 2 report (when available)',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300">
                    <FileCheck className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm mb-1">Interested in partnering?</p>
              <p className="text-white font-medium">
                Contact our carrier relations team for due diligence materials
              </p>
            </div>
            <a
              href="mailto:carriers@dailyeventinsurance.com"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Carrier Relations
            </a>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-2xl border border-slate-200 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Phone className="w-6 h-6 text-teal-600" />
            Compliance Inquiries
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <Mail className="w-5 h-5 text-teal-600 mb-2" />
              <h4 className="font-semibold text-slate-900 mb-1">General Compliance</h4>
              <a href="mailto:compliance@dailyeventinsurance.com" className="text-teal-600 hover:text-teal-700 text-sm">
                compliance@dailyeventinsurance.com
              </a>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <Mail className="w-5 h-5 text-teal-600 mb-2" />
              <h4 className="font-semibold text-slate-900 mb-1">Privacy Requests</h4>
              <a href="mailto:privacy@dailyeventinsurance.com" className="text-teal-600 hover:text-teal-700 text-sm">
                privacy@dailyeventinsurance.com
              </a>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <Mail className="w-5 h-5 text-teal-600 mb-2" />
              <h4 className="font-semibold text-slate-900 mb-1">Carrier Partnerships</h4>
              <a href="mailto:carriers@dailyeventinsurance.com" className="text-teal-600 hover:text-teal-700 text-sm">
                carriers@dailyeventinsurance.com
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-slate-500 text-sm">
              Daily Event Insurance is a High-Core partner. For more information about our insurance products
              and services, please visit our{' '}
              <Link href="/insurance-disclosure" className="text-teal-600 hover:text-teal-700">
                Insurance Disclosure
              </Link>
              {' '}page.
            </p>
          </div>
        </motion.div>

        {/* Related Links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Privacy Policy
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Terms of Service
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/insurance-disclosure"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Insurance Disclosure
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/carriers"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-600 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            Carrier Partners
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </main>
  )
}
