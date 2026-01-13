"use client"

import Link from "next/link"
import {
  Lock,
  Shield,
  Key,
  Server,
  Database,
  Eye,
  AlertTriangle,
  CheckCircle,
  Users,
  Clock,
  FileText,
  Network,
  Fingerprint,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Layers,
} from "lucide-react"

interface ControlItem {
  id: string
  name: string
  description: string
  implementation: string[]
  status: "implemented" | "in_progress" | "planned"
}

const encryptionControls: ControlItem[] = [
  {
    id: "ENC-001",
    name: "Data in Transit Encryption",
    description: "All data transmitted between clients and servers is encrypted using TLS 1.3",
    implementation: [
      "TLS 1.3 with strong cipher suites (AES-256-GCM, CHACHA20-POLY1305)",
      "Perfect Forward Secrecy (PFS) enabled",
      "HSTS (HTTP Strict Transport Security) enforced",
      "Certificate pinning for mobile applications",
      "Automatic HTTP to HTTPS redirect",
    ],
    status: "implemented",
  },
  {
    id: "ENC-002",
    name: "Data at Rest Encryption",
    description: "All stored data is encrypted using AES-256 encryption",
    implementation: [
      "AES-256 encryption for database storage",
      "Encrypted backup storage",
      "Key management using cloud provider HSM",
      "Regular key rotation schedule (90 days)",
      "Separation of encryption keys from data",
    ],
    status: "implemented",
  },
  {
    id: "ENC-003",
    name: "API Payload Encryption",
    description: "Sensitive API payloads are encrypted at the application layer",
    implementation: [
      "JSON Web Encryption (JWE) for sensitive payloads",
      "Encrypted webhook payloads",
      "No PII in URL parameters",
      "Request/response body encryption for high-sensitivity operations",
    ],
    status: "implemented",
  },
]

const accessControls: ControlItem[] = [
  {
    id: "ACC-001",
    name: "Role-Based Access Control (RBAC)",
    description: "Granular permission system with role-based access",
    implementation: [
      "Five-tier role hierarchy: Admin, Moderator, Partner, User, Viewer",
      "Granular permissions per resource type",
      "Role inheritance for hierarchical access",
      "Audit logging of all permission changes",
      "Regular access reviews (quarterly)",
    ],
    status: "implemented",
  },
  {
    id: "ACC-002",
    name: "Authentication Controls",
    description: "Secure authentication with multiple verification factors",
    implementation: [
      "Bcrypt password hashing with salt",
      "JWT-based session management",
      "Session expiration and automatic logout",
      "Failed login attempt tracking and lockout",
      "Password complexity requirements enforced",
    ],
    status: "implemented",
  },
  {
    id: "ACC-003",
    name: "Multi-Factor Authentication (MFA)",
    description: "Additional authentication factors for sensitive operations",
    implementation: [
      "TOTP-based MFA support",
      "MFA required for admin accounts",
      "MFA enforcement for high-risk transactions",
      "Backup codes for account recovery",
    ],
    status: "in_progress",
  },
  {
    id: "ACC-004",
    name: "API Access Controls",
    description: "Secure API authentication and authorization",
    implementation: [
      "OAuth 2.0 / API key authentication",
      "Scope-based API permissions",
      "Rate limiting per API key",
      "IP allowlisting (optional)",
      "API key rotation support",
    ],
    status: "implemented",
  },
]

const networkControls: ControlItem[] = [
  {
    id: "NET-001",
    name: "Network Segmentation",
    description: "Logical separation of network resources",
    implementation: [
      "VPC isolation for production workloads",
      "Private subnets for database servers",
      "Public subnets only for load balancers",
      "Network ACLs for subnet-level filtering",
      "Security groups for instance-level filtering",
    ],
    status: "implemented",
  },
  {
    id: "NET-002",
    name: "DDoS Protection",
    description: "Protection against distributed denial-of-service attacks",
    implementation: [
      "Cloud provider DDoS protection (always-on)",
      "Rate limiting at edge and application layers",
      "Geographic filtering capability",
      "Traffic analysis and anomaly detection",
      "Automatic scaling during traffic spikes",
    ],
    status: "implemented",
  },
  {
    id: "NET-003",
    name: "Web Application Firewall (WAF)",
    description: "Protection against common web application attacks",
    implementation: [
      "OWASP Top 10 rule sets",
      "SQL injection protection",
      "Cross-site scripting (XSS) prevention",
      "Custom rule configuration",
      "Real-time threat monitoring",
    ],
    status: "implemented",
  },
]

const incidentControls: ControlItem[] = [
  {
    id: "INC-001",
    name: "Security Incident Response",
    description: "Documented procedures for security incident handling",
    implementation: [
      "24/7 security monitoring",
      "Incident severity classification (P1-P4)",
      "Escalation procedures and contacts",
      "Incident communication templates",
      "Post-incident review process",
    ],
    status: "implemented",
  },
  {
    id: "INC-002",
    name: "Breach Notification",
    description: "Procedures for data breach notification",
    implementation: [
      "72-hour notification timeline for regulators",
      "Customer notification procedures",
      "Breach assessment criteria",
      "Documentation requirements",
      "Remediation tracking",
    ],
    status: "implemented",
  },
  {
    id: "INC-003",
    name: "Vulnerability Management",
    description: "Continuous vulnerability identification and remediation",
    implementation: [
      "Weekly automated vulnerability scans",
      "Critical vulnerability patching within 24 hours",
      "High vulnerability patching within 7 days",
      "Dependency vulnerability monitoring",
      "Security patch testing procedures",
    ],
    status: "implemented",
  },
]

const statusConfig = {
  implemented: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Implemented" },
  in_progress: { bg: "bg-amber-100", text: "text-amber-700", label: "In Progress" },
  planned: { bg: "bg-slate-100", text: "text-slate-600", label: "Planned" },
}

function ControlCard({ control }: { control: ControlItem }) {
  const status = statusConfig[control.status]
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-400">{control.id}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
          <h4 className="font-semibold text-slate-900">{control.name}</h4>
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-4">{control.description}</p>
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Implementation Details</div>
        <ul className="space-y-1.5">
          {control.implementation.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function DataSecurityPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-2">
          <Lock className="w-4 h-4" />
          Security Controls
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Data Security & Protection
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Daily Event Insurance implements comprehensive security controls to protect customer data,
          ensure system integrity, and maintain confidentiality. Our security program is designed
          to meet SOC 2 Type II requirements and insurance industry standards.
        </p>
      </div>

      {/* Policy Statement */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
          <FileText className="w-6 h-6 text-teal-400" />
          Data Security Policy Statement
        </h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 leading-relaxed">
            Daily Event Insurance is committed to protecting the confidentiality, integrity, and availability
            of all information assets. We implement security controls commensurate with the sensitivity of
            the data we process, including personally identifiable information (PII), protected health
            information (PHI), and financial data.
          </p>
          <p className="text-slate-300 leading-relaxed mt-4">
            Our security program is based on industry-recognized frameworks including SOC 2 Trust Services
            Criteria, NIST Cybersecurity Framework, and insurance industry best practices. We continuously
            monitor, test, and improve our security posture to address evolving threats.
          </p>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            Policy Version: 2.0 | Last Reviewed: January 2026 | Next Review: July 2026
          </div>
        </div>
      </div>

      {/* Security Architecture Overview */}
      <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Layers className="w-6 h-6 text-teal-600" />
          Security Architecture Overview
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Perimeter Security</h3>
            <p className="text-sm text-slate-600">
              WAF, DDoS protection, and edge security controls protect against external threats.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Application Security</h3>
            <p className="text-sm text-slate-600">
              Authentication, authorization, input validation, and secure coding practices.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Data Security</h3>
            <p className="text-sm text-slate-600">
              Encryption at rest and in transit, key management, and data classification.
            </p>
          </div>
        </div>
      </div>

      {/* Encryption Controls */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Encryption Controls</h2>
            <p className="text-sm text-slate-500">Cryptographic protection for data in transit and at rest</p>
          </div>
        </div>
        <div className="grid md:grid-cols-1 gap-6">
          {encryptionControls.map((control) => (
            <ControlCard key={control.id} control={control} />
          ))}
        </div>
      </section>

      {/* Access Controls */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Access Controls</h2>
            <p className="text-sm text-slate-500">Authentication, authorization, and identity management</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {accessControls.map((control) => (
            <ControlCard key={control.id} control={control} />
          ))}
        </div>
      </section>

      {/* Network Security */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Network Security</h2>
            <p className="text-sm text-slate-500">Infrastructure and network-level security controls</p>
          </div>
        </div>
        <div className="grid md:grid-cols-1 gap-6">
          {networkControls.map((control) => (
            <ControlCard key={control.id} control={control} />
          ))}
        </div>
      </section>

      {/* Incident Response */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Incident Response & Vulnerability Management</h2>
            <p className="text-sm text-slate-500">Security monitoring, incident handling, and remediation</p>
          </div>
        </div>
        <div className="grid md:grid-cols-1 gap-6">
          {incidentControls.map((control) => (
            <ControlCard key={control.id} control={control} />
          ))}
        </div>
      </section>

      {/* SOC 2 Mapping */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          SOC 2 Trust Services Criteria Mapping
        </h2>
        <p className="text-slate-600 mb-6">
          Our security controls are mapped to SOC 2 Trust Services Criteria for Security, Availability,
          and Confidentiality.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Criteria</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Controls</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 text-slate-600">Security</td>
                <td className="py-3 px-4 text-slate-600">CC6.1 - Logical Access</td>
                <td className="py-3 px-4 text-slate-600">ACC-001, ACC-002, ACC-004</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    Implemented
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600">Security</td>
                <td className="py-3 px-4 text-slate-600">CC6.6 - Encryption</td>
                <td className="py-3 px-4 text-slate-600">ENC-001, ENC-002, ENC-003</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    Implemented
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600">Security</td>
                <td className="py-3 px-4 text-slate-600">CC6.7 - Transmission Protection</td>
                <td className="py-3 px-4 text-slate-600">ENC-001, NET-001</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    Implemented
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600">Security</td>
                <td className="py-3 px-4 text-slate-600">CC7.2 - System Monitoring</td>
                <td className="py-3 px-4 text-slate-600">INC-001, INC-003</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    Implemented
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600">Availability</td>
                <td className="py-3 px-4 text-slate-600">A1.2 - Environmental Protections</td>
                <td className="py-3 px-4 text-slate-600">NET-002 (Cloud provider)</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    Implemented
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600">Confidentiality</td>
                <td className="py-3 px-4 text-slate-600">C1.2 - Data Disposal</td>
                <td className="py-3 px-4 text-slate-600">See Data Retention Policy</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    Implemented
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Testing */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-teal-600" />
          Security Testing & Monitoring
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Testing Schedule</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-900">Vulnerability Scanning</span>
                  <p className="text-sm text-slate-500">Weekly automated scans</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-900">Penetration Testing</span>
                  <p className="text-sm text-slate-500">Annual third-party assessment</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-900">Code Security Review</span>
                  <p className="text-sm text-slate-500">Continuous with each deployment</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-900">Access Reviews</span>
                  <p className="text-sm text-slate-500">Quarterly access recertification</p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Continuous Monitoring</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Eye className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-900">Security Information & Event Management</span>
                  <p className="text-sm text-slate-500">24/7 log monitoring and alerting</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Eye className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-900">Intrusion Detection</span>
                  <p className="text-sm text-slate-500">Network and host-based IDS</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Eye className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-900">File Integrity Monitoring</span>
                  <p className="text-sm text-slate-500">Critical file change detection</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Eye className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-900">Uptime Monitoring</span>
                  <p className="text-sm text-slate-500">99.9% availability target</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Documents */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Related Documentation</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/insurance/compliance/technical-specifications"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
          >
            Technical Specifications
          </Link>
          <Link
            href="/insurance/compliance/audit-records"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
          >
            Audit & Records
          </Link>
          <Link
            href="/insurance/compliance/privacy"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
          >
            Privacy & Data Protection
          </Link>
          <Link
            href="/insurance/compliance/glossary"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
          >
            Glossary & Definitions
          </Link>
        </div>
      </div>
    </div>
  )
}
