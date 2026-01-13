"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ClipboardCheck,
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Database,
  Archive,
  Search,
  Download,
  Lock,
  ArrowRight,
  Info,
  Calendar,
  HardDrive,
  Eye,
  History,
  Server,
  Trash2,
  RefreshCw,
} from "lucide-react"

// Retention Schedule
const retentionSchedule = [
  {
    dataType: "Insurance Policies",
    retentionPeriod: "7 years after expiration",
    legalBasis: "State insurance regulations, tax requirements",
    archiveAfter: "1 year",
    autoDelete: "No",
    format: "Encrypted database, PDF archives",
  },
  {
    dataType: "Claims Records",
    retentionPeriod: "7 years after closure",
    legalBasis: "Insurance regulatory requirement, statute of limitations",
    archiveAfter: "1 year after closure",
    autoDelete: "No",
    format: "Encrypted database, document storage",
  },
  {
    dataType: "Payment Transactions",
    retentionPeriod: "7 years",
    legalBasis: "Tax requirements, audit trail",
    archiveAfter: "1 year",
    autoDelete: "No",
    format: "Database records, payment processor logs",
  },
  {
    dataType: "Audit Logs",
    retentionPeriod: "7 years",
    legalBasis: "Regulatory compliance, security",
    archiveAfter: "1 year",
    autoDelete: "No",
    format: "Immutable append-only logs",
  },
  {
    dataType: "KYC/Verification Records",
    retentionPeriod: "5 years after relationship ends",
    legalBasis: "BSA/AML requirements",
    archiveAfter: "1 year",
    autoDelete: "No",
    format: "Encrypted document storage",
  },
  {
    dataType: "AML Alerts & SARs",
    retentionPeriod: "5 years from filing",
    legalBasis: "FinCEN requirements",
    archiveAfter: "Immediate",
    autoDelete: "No",
    format: "Secured separate system",
  },
  {
    dataType: "Partner Agreements",
    retentionPeriod: "7 years after termination",
    legalBasis: "Contractual, tax requirements",
    archiveAfter: "1 year after termination",
    autoDelete: "No",
    format: "Signed PDF documents",
  },
  {
    dataType: "Quote Requests",
    retentionPeriod: "1 year",
    legalBasis: "Business operations",
    archiveAfter: "90 days",
    autoDelete: "Yes",
    format: "Database records",
  },
  {
    dataType: "User Sessions",
    retentionPeriod: "90 days",
    legalBasis: "Security monitoring",
    archiveAfter: "N/A",
    autoDelete: "Yes",
    format: "Session logs",
  },
  {
    dataType: "Email Communications",
    retentionPeriod: "7 years for policy-related",
    legalBasis: "Regulatory record-keeping",
    archiveAfter: "1 year",
    autoDelete: "Varies",
    format: "Email archive system",
  },
]

// Audit Log Categories
const auditCategories = [
  {
    category: "Authentication Events",
    events: [
      "User login (success/failure)",
      "Password changes",
      "MFA enrollment/removal",
      "Session creation/termination",
      "API key generation",
    ],
    retention: "7 years",
    icon: Lock,
  },
  {
    category: "Policy Lifecycle",
    events: [
      "Quote generation",
      "Policy purchase",
      "Policy modification",
      "Policy cancellation",
      "Renewal processing",
    ],
    retention: "7 years",
    icon: FileText,
  },
  {
    category: "Claims Activity",
    events: [
      "Claim submission",
      "Document uploads",
      "Status changes",
      "Adjudicator actions",
      "Payment processing",
    ],
    retention: "7 years",
    icon: ClipboardCheck,
  },
  {
    category: "Financial Transactions",
    events: [
      "Payment initiation",
      "Payment completion",
      "Refund processing",
      "Commission calculations",
      "Payout generation",
    ],
    retention: "7 years",
    icon: Database,
  },
  {
    category: "Administrative Actions",
    events: [
      "User role changes",
      "Permission modifications",
      "System configuration",
      "Partner management",
      "Report generation",
    ],
    retention: "7 years",
    icon: Server,
  },
  {
    category: "Compliance Events",
    events: [
      "KYC verification status",
      "AML alert generation",
      "SAR filing",
      "Data subject requests",
      "Regulatory inquiries",
    ],
    retention: "5-7 years",
    icon: Shield,
  },
]

// Audit Log Format
const auditLogFormat = {
  fields: [
    { name: "timestamp", description: "ISO 8601 timestamp with timezone", example: "2024-01-15T14:32:00.000Z" },
    { name: "event_id", description: "Unique event identifier", example: "evt_abc123xyz" },
    { name: "event_type", description: "Category and action", example: "policy.purchased" },
    { name: "actor_id", description: "User or system ID", example: "usr_xyz789" },
    { name: "actor_type", description: "User, admin, system, or API", example: "user" },
    { name: "resource_type", description: "Type of resource affected", example: "policy" },
    { name: "resource_id", description: "ID of affected resource", example: "pol_abc123" },
    { name: "ip_address", description: "Source IP address", example: "192.168.1.100" },
    { name: "user_agent", description: "Browser/client information", example: "Mozilla/5.0..." },
    { name: "changes", description: "Before/after values (when applicable)", example: "{\"status\": {\"old\": \"active\", \"new\": \"cancelled\"}}" },
    { name: "metadata", description: "Additional context", example: "{\"request_id\": \"req_xyz\"}" },
    { name: "compliance_flags", description: "Regulatory relevance tags", example: "[\"pci\", \"aml\"]" },
  ],
}

// Available Reports
const availableReports = [
  {
    name: "Audit Log Export",
    description: "Complete audit trail for specified date range",
    formats: ["JSON", "CSV"],
    filters: "Date range, event type, user, resource",
    typical_use: "Regulatory examination, internal audit",
  },
  {
    name: "Transaction Summary",
    description: "All financial transactions with status",
    formats: ["CSV", "PDF"],
    filters: "Date range, transaction type, amount range",
    typical_use: "Financial audit, reconciliation",
  },
  {
    name: "KYC Verification Report",
    description: "Customer verification status and history",
    formats: ["CSV", "PDF"],
    filters: "Date range, verification level, status",
    typical_use: "Compliance audit, AML review",
  },
  {
    name: "AML Alert Summary",
    description: "All AML alerts with resolution status",
    formats: ["CSV", "PDF"],
    filters: "Date range, alert type, severity, status",
    typical_use: "AML audit, regulatory examination",
  },
  {
    name: "Policy Lifecycle Report",
    description: "Policy activity from quote to expiration",
    formats: ["CSV", "PDF"],
    filters: "Date range, policy type, status",
    typical_use: "Business analysis, carrier reporting",
  },
  {
    name: "Data Subject Request Log",
    description: "CCPA/GDPR request tracking and completion",
    formats: ["CSV", "PDF"],
    filters: "Date range, request type, status",
    typical_use: "Privacy audit, regulatory response",
  },
]

// Archive Process
const archiveSteps = [
  {
    step: 1,
    title: "Data Selection",
    description: "Identify records meeting archive criteria (age, status)",
    timing: "Automated weekly scan",
  },
  {
    step: 2,
    title: "Integrity Check",
    description: "Verify data completeness and calculate checksums",
    timing: "Before archive",
  },
  {
    step: 3,
    title: "Encryption",
    description: "AES-256 encryption with unique archive keys",
    timing: "During archive",
  },
  {
    step: 4,
    title: "Transfer",
    description: "Move to long-term storage with redundancy",
    timing: "Automated",
  },
  {
    step: 5,
    title: "Verification",
    description: "Confirm successful archive and accessibility",
    timing: "Post-transfer",
  },
  {
    step: 6,
    title: "Source Removal",
    description: "Remove from active systems (hot tier) after verification",
    timing: "After verification",
  },
]

export default function AuditRecordsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-2">
          <ClipboardCheck className="w-4 h-4" />
          Document ID: DOC-005
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Audit & Records Management
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Complete audit trail capabilities with 7-year record retention for regulatory compliance.
          This document details our audit logging system, record retention policies, archive
          procedures, and report generation capabilities.
        </p>
      </div>

      {/* Policy Statement */}
      <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Shield className="w-6 h-6 text-teal-600" />
          Records Management Policy
        </h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">
            Daily Event Insurance maintains comprehensive records of all business activities,
            transactions, and compliance events. Our records management program ensures complete
            audit trails, regulatory compliance, and the ability to reproduce any transaction
            or decision upon request. Records are retained according to regulatory requirements
            and business needs, with a minimum 7-year retention for insurance-related records.
          </p>
        </div>
        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">7 Years</div>
            <div className="text-sm text-slate-600">Insurance Record Retention</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">100%</div>
            <div className="text-sm text-slate-600">Transaction Coverage</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">Immutable</div>
            <div className="text-sm text-slate-600">Audit Logs</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">&lt; 24hr</div>
            <div className="text-sm text-slate-600">Report Generation</div>
          </div>
        </div>
      </div>

      {/* Retention Schedule */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-teal-600" />
          Record Retention Schedule
        </h2>
        <p className="text-slate-600 mb-6">
          Retention periods by data type, with legal basis and archive procedures.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tl-lg">Data Type</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Retention</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Legal Basis</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Archive After</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Auto-Delete</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tr-lg">Format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {retentionSchedule.map((item, idx) => (
                <tr key={item.dataType} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.dataType}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">
                      {item.retentionPeriod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.legalBasis}</td>
                  <td className="px-4 py-3 text-slate-600">{item.archiveAfter}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.autoDelete === "Yes" ? "bg-amber-100 text-amber-700" :
                      item.autoDelete === "No" ? "bg-slate-100 text-slate-600" :
                      "bg-slate-100 text-slate-500"
                    }`}>
                      {item.autoDelete}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{item.format}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Categories */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <History className="w-6 h-6 text-teal-600" />
          Audit Log Categories
        </h2>
        <p className="text-slate-600 mb-6">
          Events captured in the audit trail organized by category.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auditCategories.map((category, idx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{category.category}</h3>
                  <span className="text-xs text-slate-500">{category.retention} retention</span>
                </div>
              </div>
              <ul className="space-y-1.5">
                {category.events.map((event) => (
                  <li key={event} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                    {event}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audit Log Format */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Database className="w-6 h-6 text-teal-400" />
          Audit Log Format
        </h2>
        <p className="text-slate-300 mb-6">
          Standardized JSON format for all audit log entries ensuring consistency and queryability.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-4 py-3 text-left font-semibold text-teal-400">Field</th>
                <th className="px-4 py-3 text-left font-semibold text-teal-400">Description</th>
                <th className="px-4 py-3 text-left font-semibold text-teal-400">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {auditLogFormat.fields.map((field) => (
                <tr key={field.name}>
                  <td className="px-4 py-3 font-mono text-teal-300">{field.name}</td>
                  <td className="px-4 py-3 text-slate-300">{field.description}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400 max-w-xs truncate">{field.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <strong className="text-white">Immutability:</strong> Audit logs are append-only and
              cryptographically signed. Once written, entries cannot be modified or deleted, even
              by administrators. Any attempt to tamper with logs generates immediate security alerts.
            </div>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Download className="w-6 h-6 text-teal-600" />
          Compliance Reports
        </h2>
        <p className="text-slate-600 mb-6">
          Pre-built reports available for regulatory examinations and internal audits.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {availableReports.map((report) => (
            <div key={report.name} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-2">{report.name}</h3>
              <p className="text-sm text-slate-600 mb-3">{report.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-20">Formats:</span>
                  <div className="flex gap-1">
                    {report.formats.map((format) => (
                      <span key={format} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-20 flex-shrink-0">Filters:</span>
                  <span className="text-slate-600">{report.filters}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-20 flex-shrink-0">Use case:</span>
                  <span className="text-slate-600">{report.typical_use}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Archive Process */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Archive className="w-6 h-6 text-teal-600" />
          Data Archive Process
        </h2>
        <p className="text-slate-600 mb-6">
          Procedure for transitioning data from active storage to long-term archives.
        </p>
        <div className="flex flex-wrap gap-3">
          {archiveSteps.map((step, idx) => (
            <div key={step.step} className="flex items-center gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4 w-48">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.step}
                  </span>
                  <span className="font-semibold text-slate-900 text-sm">{step.title}</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">{step.description}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {step.timing}
                </div>
              </div>
              {idx < archiveSteps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-slate-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Retrieval Procedures */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Search className="w-6 h-6" />
          Record Retrieval Procedures
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-white/10 rounded-xl border border-white/20">
            <h3 className="font-semibold mb-4">Active Records (&lt;1 year)</h3>
            <ul className="space-y-2 text-sm text-teal-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-300" />
                Available via admin dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-300" />
                Real-time search and filtering
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-300" />
                Instant export capability
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-300" />
                Response time: &lt;5 seconds
              </li>
            </ul>
          </div>
          <div className="p-5 bg-white/10 rounded-xl border border-white/20">
            <h3 className="font-semibold mb-4">Archived Records (&gt;1 year)</h3>
            <ul className="space-y-2 text-sm text-teal-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-300" />
                Request via compliance team
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-300" />
                Retrieval from cold storage
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-300" />
                Integrity verification on restore
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-300" />
                Response time: &lt;24 hours
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <h4 className="font-semibold mb-2">Regulatory Examination Requests</h4>
          <p className="text-sm text-teal-100">
            For regulatory examination document requests, our compliance team can produce any
            record within 48 hours. We maintain a dedicated process for examiner requests with
            priority handling and secure delivery channels.
          </p>
        </div>
      </div>

      {/* Destruction Procedures */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Trash2 className="w-6 h-6 text-red-500" />
          Record Destruction
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-slate-600 mb-4">
            Records are destroyed only after retention periods expire and legal hold checks pass.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Pre-Destruction Checks</h4>
              <ul className="space-y-2">
                {[
                  "Retention period fully expired",
                  "No active legal holds",
                  "No pending regulatory requests",
                  "No open claims or disputes",
                  "Manager approval obtained",
                ].map((check) => (
                  <li key={check} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Destruction Methods</h4>
              <ul className="space-y-2">
                {[
                  "Cryptographic erasure (encrypted data)",
                  "Secure deletion with verification",
                  "Physical media destruction (if applicable)",
                  "Certificate of destruction generated",
                  "Destruction logged in audit trail",
                ].map((method) => (
                  <li key={method} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Hold */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          Legal Hold Procedures
        </h2>
        <p className="text-amber-800 mb-4">
          When litigation, investigation, or regulatory action is anticipated or pending,
          relevant records are placed on legal hold, suspending normal retention/destruction.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/60 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2">Triggering Events</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Litigation filed or threatened</li>
              <li>• Regulatory investigation</li>
              <li>• Subpoena received</li>
              <li>• Internal investigation</li>
            </ul>
          </div>
          <div className="p-4 bg-white/60 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2">Hold Implementation</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Legal team issues hold notice</li>
              <li>• Relevant records identified</li>
              <li>• Destruction suspended</li>
              <li>• Custodians notified</li>
            </ul>
          </div>
          <div className="p-4 bg-white/60 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2">Hold Release</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Matter concluded</li>
              <li>• Legal team authorizes release</li>
              <li>• Normal retention resumes</li>
              <li>• Release documented</li>
            </ul>
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
          href="/insurance/compliance/aml-kyc"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          AML/KYC Program
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/privacy"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Privacy & Data Protection
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
