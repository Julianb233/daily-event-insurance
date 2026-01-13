"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Eye,
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Users,
  Globe,
  Lock,
  Trash2,
  Download,
  Mail,
  Ban,
  Building2,
  ArrowRight,
  Info,
  Database,
  UserX,
  MapPin,
  Scale,
} from "lucide-react"

// Data categories collected
const dataCategories = [
  {
    category: "Identifiers",
    examples: "Name, email, phone number, mailing address",
    purpose: "Account creation, policy issuance, communications",
    retention: "7 years after policy expiration",
    legalBasis: "Contract performance, legal obligation",
  },
  {
    category: "Commercial Information",
    examples: "Insurance purchases, policy details, premium payments",
    purpose: "Policy administration, claims processing",
    retention: "7 years after policy expiration",
    legalBasis: "Contract performance, legal obligation",
  },
  {
    category: "Financial Information",
    examples: "Payment card details (tokenized via Stripe), billing history",
    purpose: "Payment processing, fraud prevention",
    retention: "7 years for tax/audit purposes",
    legalBasis: "Contract performance, legitimate interest",
  },
  {
    category: "Internet Activity",
    examples: "IP address, browser type, pages visited, device info",
    purpose: "Security, analytics, service improvement",
    retention: "90 days for session data, 2 years for aggregated",
    legalBasis: "Legitimate interest, consent",
  },
  {
    category: "Geolocation Data",
    examples: "Event location, business address, IP-derived location",
    purpose: "Coverage determination, rate calculation",
    retention: "7 years with policy data",
    legalBasis: "Contract performance",
  },
  {
    category: "Professional Information",
    examples: "Business name, EIN, certifications, insurance history",
    purpose: "Partner verification, underwriting",
    retention: "7 years after relationship ends",
    legalBasis: "Contract performance, legal obligation",
  },
]

// CCPA Rights
const ccpaRights = [
  {
    right: "Right to Know",
    description: "Request disclosure of personal information collected, used, and shared",
    implementation: "Submit request via privacy portal or email; response within 45 days",
    icon: Eye,
  },
  {
    right: "Right to Delete",
    description: "Request deletion of personal information (with legal exceptions)",
    implementation: "Verified request processed within 45 days; exceptions documented",
    icon: Trash2,
  },
  {
    right: "Right to Opt-Out",
    description: "Opt out of sale of personal information",
    implementation: "\"Do Not Sell My Info\" link in footer; honored immediately",
    icon: Ban,
  },
  {
    right: "Right to Non-Discrimination",
    description: "Equal service regardless of privacy choices",
    implementation: "No denial of service, different pricing, or quality reduction",
    icon: Scale,
  },
  {
    right: "Right to Correct",
    description: "Request correction of inaccurate personal information",
    implementation: "Corrections processed within 45 days after verification",
    icon: FileText,
  },
  {
    right: "Right to Limit Use",
    description: "Limit use and disclosure of sensitive personal information",
    implementation: "Sensitive data use restricted to essential purposes only",
    icon: Lock,
  },
]

// GDPR Rights (if applicable)
const gdprRights = [
  {
    right: "Right of Access",
    article: "Article 15",
    description: "Obtain confirmation of processing and access to personal data",
  },
  {
    right: "Right to Rectification",
    article: "Article 16",
    description: "Have inaccurate personal data corrected",
  },
  {
    right: "Right to Erasure",
    article: "Article 17",
    description: "Have personal data deleted under certain circumstances",
  },
  {
    right: "Right to Restriction",
    article: "Article 18",
    description: "Restrict processing in certain situations",
  },
  {
    right: "Right to Portability",
    article: "Article 20",
    description: "Receive personal data in machine-readable format",
  },
  {
    right: "Right to Object",
    article: "Article 21",
    description: "Object to processing based on legitimate interests",
  },
]

// Third-party data sharing
const thirdPartySharing = [
  {
    recipient: "Insurance Carriers",
    dataShared: "Policy details, claims information, risk data",
    purpose: "Underwriting, claims adjudication",
    safeguards: "Business Associate Agreements, encryption",
  },
  {
    recipient: "Payment Processors (Stripe)",
    dataShared: "Payment card information (tokenized)",
    purpose: "Payment processing",
    safeguards: "PCI DSS Level 1 certified, tokenization",
  },
  {
    recipient: "Cloud Infrastructure (AWS/Vercel)",
    dataShared: "All system data (encrypted)",
    purpose: "Service hosting and delivery",
    safeguards: "SOC 2 certified, encryption at rest/transit",
  },
  {
    recipient: "Analytics Providers",
    dataShared: "Anonymized usage data, IP addresses",
    purpose: "Service improvement, fraud detection",
    safeguards: "Data minimization, no PII shared",
  },
  {
    recipient: "Regulatory Authorities",
    dataShared: "As legally required",
    purpose: "Regulatory compliance, legal proceedings",
    safeguards: "Minimum necessary disclosure",
  },
]

// Privacy procedures
const privacyProcedures = [
  {
    id: "PRIV-001",
    title: "Data Subject Request Handling",
    steps: [
      "Request received via portal/email",
      "Identity verification (2-step process)",
      "Request logged in compliance system",
      "Data search across all systems",
      "Response prepared within 30 days",
      "Delivery via secure portal",
      "Request archived for audit",
    ],
  },
  {
    id: "PRIV-002",
    title: "Data Deletion Procedure",
    steps: [
      "Verified deletion request received",
      "Check for legal retention requirements",
      "Identify all data locations",
      "Delete from primary systems",
      "Purge from backups (next cycle)",
      "Confirm deletion to requestor",
      "Maintain deletion record",
    ],
  },
  {
    id: "PRIV-003",
    title: "Data Breach Response",
    steps: [
      "Breach detected/reported",
      "Incident response team activated",
      "Containment measures implemented",
      "Impact assessment completed",
      "Affected individuals notified (72 hours)",
      "Regulatory notification (if required)",
      "Post-incident review and remediation",
    ],
  },
]

export default function PrivacyCompliancePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-2">
          <Eye className="w-4 h-4" />
          Document ID: DOC-003
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Privacy & Data Protection
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Comprehensive privacy framework ensuring data subject rights under CCPA, GDPR readiness,
          and state privacy laws. This document details our data handling practices, consumer rights
          implementation, and privacy-by-design principles.
        </p>
      </div>

      {/* Policy Statement */}
      <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Shield className="w-6 h-6 text-teal-600" />
          Privacy Policy Statement
        </h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">
            Daily Event Insurance is committed to protecting the privacy and security of personal
            information entrusted to us by customers, partners, and website visitors. We collect
            only the data necessary to provide our services, retain it only as long as required,
            and ensure individuals can exercise their privacy rights. Our privacy program is
            designed to comply with the California Consumer Privacy Act (CCPA/CPRA), and we
            maintain GDPR-ready practices for potential European operations.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100">
            <div className="text-2xl font-bold text-teal-600">45 Days</div>
            <div className="text-sm text-slate-600">Max response time for data requests</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100">
            <div className="text-2xl font-bold text-teal-600">72 Hours</div>
            <div className="text-sm text-slate-600">Breach notification timeline</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100">
            <div className="text-2xl font-bold text-teal-600">Zero</div>
            <div className="text-sm text-slate-600">Personal data sold to third parties</div>
          </div>
        </div>
      </div>

      {/* Data Categories */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Data Categories Collected</h2>
        <p className="text-slate-600 mb-6">
          Categories of personal information collected, purposes, and retention periods.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tl-lg">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Examples</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Purpose</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Retention</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tr-lg">Legal Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataCategories.map((item, idx) => (
                <tr key={item.category} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.category}</td>
                  <td className="px-4 py-3 text-slate-600">{item.examples}</td>
                  <td className="px-4 py-3 text-slate-600">{item.purpose}</td>
                  <td className="px-4 py-3 text-slate-600">{item.retention}</td>
                  <td className="px-4 py-3 text-slate-600">{item.legalBasis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CCPA Rights */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-teal-600" />
          California Consumer Privacy Rights (CCPA/CPRA)
        </h2>
        <p className="text-slate-600 mb-6">
          Rights available to California residents under the California Consumer Privacy Act and
          California Privacy Rights Act.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {ccpaRights.map((right, idx) => (
            <motion.div
              key={right.right}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <right.icon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{right.right}</h3>
                  <p className="text-sm text-slate-600 mt-1">{right.description}</p>
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs font-medium text-slate-500 mb-1">Implementation</div>
                    <p className="text-sm text-slate-700">{right.implementation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How to Exercise Rights */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Users className="w-6 h-6 text-teal-400" />
          How to Exercise Your Privacy Rights
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <Mail className="w-8 h-8 text-teal-400 mb-3" />
            <h3 className="font-semibold mb-2">Email Request</h3>
            <p className="text-sm text-slate-300 mb-3">
              Send your request to our privacy team
            </p>
            <a
              href="mailto:privacy@dailyeventinsurance.com"
              className="text-teal-400 hover:text-teal-300 text-sm font-medium"
            >
              privacy@dailyeventinsurance.com
            </a>
          </div>
          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <Globe className="w-8 h-8 text-teal-400 mb-3" />
            <h3 className="font-semibold mb-2">Online Portal</h3>
            <p className="text-sm text-slate-300 mb-3">
              Submit requests through our secure portal
            </p>
            <Link
              href="/privacy-request"
              className="text-teal-400 hover:text-teal-300 text-sm font-medium"
            >
              Privacy Request Portal
            </Link>
          </div>
          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <FileText className="w-8 h-8 text-teal-400 mb-3" />
            <h3 className="font-semibold mb-2">Written Request</h3>
            <p className="text-sm text-slate-300 mb-3">
              Mail your request to our compliance team
            </p>
            <p className="text-sm text-slate-400">
              Daily Event Insurance<br />
              Privacy Department<br />
              [Address on file]
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-white/10 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <strong className="text-white">Identity Verification Required:</strong> To protect your
              privacy, we verify the identity of all requestors before fulfilling data requests.
              You may be asked to provide information matching your account or government ID.
            </div>
          </div>
        </div>
      </div>

      {/* GDPR Framework */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Globe className="w-6 h-6 text-teal-600" />
          GDPR Framework (EU Readiness)
        </h2>
        <p className="text-slate-600 mb-6">
          While we currently operate in the United States, we maintain GDPR-ready practices to
          support potential future European operations and to serve as best-practice guidelines.
        </p>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {gdprRights.map((right) => (
            <div key={right.right} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-mono rounded">
                  {right.article}
                </span>
                <div>
                  <h4 className="font-medium text-slate-900">{right.right}</h4>
                  <p className="text-sm text-slate-500">{right.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                <CheckCircle className="w-3 h-3" />
                Ready
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Third-Party Sharing */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Building2 className="w-6 h-6 text-teal-600" />
          Third-Party Data Sharing
        </h2>
        <p className="text-slate-600 mb-6">
          Categories of third parties with whom personal information may be shared and safeguards in place.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900">We Do Not Sell Personal Information</h4>
              <p className="text-sm text-amber-700 mt-1">
                Daily Event Insurance does not sell personal information to third parties for monetary
                or other valuable consideration. Data sharing is limited to service delivery and
                legal requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tl-lg">Recipient</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Data Shared</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Purpose</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tr-lg">Safeguards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {thirdPartySharing.map((item, idx) => (
                <tr key={item.recipient} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.recipient}</td>
                  <td className="px-4 py-3 text-slate-600">{item.dataShared}</td>
                  <td className="px-4 py-3 text-slate-600">{item.purpose}</td>
                  <td className="px-4 py-3 text-slate-600">{item.safeguards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy Procedures */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Privacy Procedures</h2>
        <div className="space-y-6">
          {privacyProcedures.map((procedure) => (
            <div key={procedure.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-mono rounded">
                  {procedure.id}
                </span>
                <h3 className="font-semibold text-slate-900">{procedure.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {procedure.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="w-5 h-5 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-700">{step}</span>
                    </div>
                    {idx < procedure.steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy by Design */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6">Privacy by Design Principles</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Proactive not Reactive",
              description: "Privacy measures implemented before processing begins, not after incidents",
            },
            {
              title: "Privacy as Default",
              description: "Maximum privacy protection without user action; opt-in not opt-out",
            },
            {
              title: "Privacy Embedded",
              description: "Privacy built into system architecture and business practices",
            },
            {
              title: "Full Functionality",
              description: "Privacy without sacrificing features or user experience",
            },
            {
              title: "End-to-End Security",
              description: "Data protected throughout entire lifecycle from collection to deletion",
            },
            {
              title: "Visibility & Transparency",
              description: "Practices open to scrutiny and independently verifiable",
            },
            {
              title: "User-Centric",
              description: "User interests paramount with strong defaults and easy controls",
            },
            {
              title: "Data Minimization",
              description: "Collect only what's necessary, retain only as long as required",
            },
          ].map((principle) => (
            <div key={principle.title} className="p-4 bg-white/10 rounded-xl border border-white/20">
              <h3 className="font-semibold mb-1">{principle.title}</h3>
              <p className="text-sm text-teal-100">{principle.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Protection Impact Assessment */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Data Protection Impact Assessments</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-slate-600 mb-4">
            We conduct Data Protection Impact Assessments (DPIAs) when introducing new processing
            activities that may present high risk to individuals' rights and freedoms. DPIAs are
            required for:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "New automated decision-making processes",
              "Large-scale processing of sensitive data",
              "Systematic monitoring of public areas",
              "New technologies with privacy implications",
              "Processing that could affect vulnerable groups",
              "Combining datasets from multiple sources",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Documents */}
      <div className="flex flex-wrap items-center gap-6 text-sm pt-8 border-t border-slate-200">
        <span className="text-slate-500">Related Documentation:</span>
        <Link
          href="/insurance/compliance/data-security"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Data Security
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/audit-records"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Audit & Records
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/privacy"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Public Privacy Policy
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/glossary"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Glossary
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
