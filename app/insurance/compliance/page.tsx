"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  ClipboardCheck,
  Award,
  CheckCircle,
  ArrowRight,
  Building2,
  FileCheck,
  Clock,
  Server,
  Mail,
  ExternalLink,
  AlertCircle,
} from "lucide-react"

// Compliance status types
type Status = "implemented" | "in_progress" | "planned"

interface ComplianceArea {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  status: Status
  highlights: string[]
}

const statusConfig = {
  implemented: {
    label: "Implemented",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  in_progress: {
    label: "In Progress",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  planned: {
    label: "Planned",
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
}

const complianceAreas: ComplianceArea[] = [
  {
    title: "Data Security",
    description: "Enterprise-grade security protecting customer data with encryption, access controls, and continuous monitoring.",
    icon: Lock,
    href: "/insurance/compliance/data-security",
    status: "implemented",
    highlights: ["TLS 1.3 encryption", "Role-based access control", "SOC 2 Type II (in progress)"],
  },
  {
    title: "Privacy & Data Protection",
    description: "Comprehensive privacy framework ensuring data rights under CCPA, GDPR, and state privacy laws.",
    icon: Eye,
    href: "/insurance/compliance/privacy",
    status: "implemented",
    highlights: ["CCPA compliant", "GDPR framework", "Data minimization"],
  },
  {
    title: "AML/KYC Program",
    description: "Robust customer verification and transaction monitoring to prevent financial crimes.",
    icon: UserCheck,
    href: "/insurance/compliance/aml-kyc",
    status: "implemented",
    highlights: ["Customer identification", "Partner verification", "Transaction monitoring"],
  },
  {
    title: "Audit & Records",
    description: "Complete audit trail capabilities with 7-year record retention for regulatory compliance.",
    icon: ClipboardCheck,
    href: "/insurance/compliance/audit-records",
    status: "implemented",
    highlights: ["Complete audit trail", "7-year retention", "Exportable reports"],
  },
  {
    title: "Consumer Protection",
    description: "Transparent practices ensuring fair treatment of all customers and clear claims processes.",
    icon: Shield,
    href: "/insurance/compliance/consumer-protection",
    status: "implemented",
    highlights: ["Transparent pricing", "Clear claims process", "Complaint resolution"],
  },
  {
    title: "Licensing & Registration",
    description: "Insurance producer licensing and regulatory compliance across operating jurisdictions.",
    icon: Award,
    href: "/insurance/compliance/licensing",
    status: "in_progress",
    highlights: ["Multi-state licensing", "NAIC compliance", "Producer appointments"],
  },
]

const certifications = [
  {
    name: "PCI DSS Compliant",
    description: "Payment processing through Stripe (Level 1 Service Provider)",
    status: "implemented" as Status,
  },
  {
    name: "SOC 2 Type II",
    description: "Security, availability, and confidentiality controls",
    status: "in_progress" as Status,
  },
  {
    name: "NAIC Model Law Compliance",
    description: "Adherence to NAIC insurance regulatory standards",
    status: "implemented" as Status,
  },
  {
    name: "State Insurance Licenses",
    description: "Licensed insurance producer in operating states",
    status: "in_progress" as Status,
  },
]

export default function ComplianceOverviewPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-2">
          <Shield className="w-4 h-4" />
          Compliance Documentation
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Insurance Compliance Overview
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Daily Event Insurance maintains comprehensive regulatory compliance to meet the rigorous
          standards required by insurance carriers, state regulators, and federal authorities.
          This documentation provides transparency into our compliance infrastructure.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Security Controls", value: "25+", icon: Lock },
          { label: "Audit Coverage", value: "100%", icon: ClipboardCheck },
          { label: "Record Retention", value: "7 Years", icon: Clock },
          { label: "Compliance Areas", value: "6", icon: FileCheck },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-4 text-center"
          >
            <stat.icon className="w-6 h-6 text-teal-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Compliance Mission */}
      <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Building2 className="w-6 h-6 text-teal-600" />
          Our Compliance Commitment
        </h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">
            As an insurtech platform facilitating insurance coverage for fitness facilities, adventure
            sports operators, and equipment rental businesses, we recognize that regulatory compliance
            is foundational to our business. Our compliance program is designed to:
          </p>
          <ul className="text-slate-700 mt-4 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
              <span>Protect consumer data and privacy in accordance with applicable laws</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
              <span>Maintain complete audit trails for all insurance transactions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
              <span>Implement robust controls to prevent fraud and financial crimes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
              <span>Ensure fair and transparent treatment of all customers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
              <span>Meet or exceed insurance industry regulatory requirements</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Compliance Areas */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Compliance Areas</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {complianceAreas.map((area, idx) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link
                href={area.href}
                className="block bg-white rounded-xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10 transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                      <area.icon className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{area.title}</h3>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[area.status].bg} ${statusConfig[area.status].text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[area.status].dot}`} />
                    {statusConfig[area.status].label}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{area.description}</p>
                <div className="space-y-1.5">
                  {area.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                      {highlight}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm text-teal-600 font-medium group-hover:gap-2 transition-all">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certifications & Standards */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Certifications & Standards</h2>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {certifications.map((cert) => (
            <div key={cert.name} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{cert.name}</h4>
                  <p className="text-sm text-slate-500">{cert.description}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[cert.status].bg} ${statusConfig[cert.status].text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[cert.status].dot}`} />
                {statusConfig[cert.status].label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Bodies */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Building2 className="w-6 h-6 text-teal-400" />
          Regulatory Oversight
        </h2>
        <p className="text-slate-300 mb-6">
          Daily Event Insurance operates under the oversight of multiple regulatory bodies and
          adheres to applicable federal and state regulations.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              name: "National Association of Insurance Commissioners (NAIC)",
              description: "Adherence to model laws and regulatory standards",
            },
            {
              name: "State Departments of Insurance",
              description: "State-level licensing and compliance in operating jurisdictions",
            },
            {
              name: "Financial Crimes Enforcement Network (FinCEN)",
              description: "Anti-money laundering program compliance",
            },
            {
              name: "Federal Trade Commission (FTC)",
              description: "Consumer protection and privacy compliance",
            },
          ].map((body) => (
            <div key={body.name} className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-medium text-white mb-1">{body.name}</h4>
              <p className="text-sm text-slate-400">{body.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* For Carriers */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">For Insurance Carriers</h2>
            <p className="text-teal-100">Due diligence and partnership information</p>
          </div>
        </div>
        <p className="text-teal-50 mb-6">
          We welcome carrier inquiries and are prepared to provide comprehensive documentation
          for due diligence purposes. Our compliance team is available to discuss partnership
          opportunities and answer questions about our compliance infrastructure.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:carriers@dailyeventinsurance.com"
            className="inline-flex items-center justify-center gap-2 bg-white text-teal-600 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Carrier Relations
          </a>
          <Link
            href="/insurance/compliance/technical-specifications"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
          >
            <Server className="w-5 h-5" />
            View Technical Specs
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap items-center gap-6 text-sm pt-8 border-t border-slate-200">
        <span className="text-slate-500">Related Documentation:</span>
        <Link
          href="/privacy"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-600 transition-colors"
        >
          Privacy Policy
          <ExternalLink className="w-3 h-3" />
        </Link>
        <Link
          href="/terms"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-600 transition-colors"
        >
          Terms of Service
          <ExternalLink className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance-disclosure"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-600 transition-colors"
        >
          Insurance Disclosure
          <ExternalLink className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/glossary"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-600 transition-colors"
        >
          Compliance Glossary
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
