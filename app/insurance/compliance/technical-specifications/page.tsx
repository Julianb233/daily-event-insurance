"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Server,
  Shield,
  CheckCircle,
  Database,
  Cloud,
  Lock,
  ArrowRight,
  Info,
  Cpu,
  HardDrive,
  Globe,
  RefreshCw,
  AlertTriangle,
  Clock,
  Layers,
  Network,
  Key,
  Eye,
  FileText,
} from "lucide-react"

// System Architecture
const architectureLayers = [
  {
    layer: "Presentation Layer",
    components: ["Next.js 14 Frontend", "React Server Components", "TailwindCSS", "Vercel Edge Network"],
    security: ["CSP Headers", "XSS Protection", "HTTPS Only"],
  },
  {
    layer: "Application Layer",
    components: ["Next.js API Routes", "Server Actions", "Authentication Middleware", "Rate Limiting"],
    security: ["JWT/Session Auth", "Input Validation", "CORS Policy"],
  },
  {
    layer: "Business Logic Layer",
    components: ["Policy Engine", "Rating Calculator", "Claims Processor", "Compliance Engine"],
    security: ["Role-Based Access", "Audit Logging", "Data Validation"],
  },
  {
    layer: "Data Layer",
    components: ["PostgreSQL (Supabase)", "Redis Cache", "Document Storage", "Backup Systems"],
    security: ["Encryption at Rest", "Row-Level Security", "Connection Encryption"],
  },
  {
    layer: "Integration Layer",
    components: ["Stripe Payments", "Email Services", "Carrier APIs", "Partner Webhooks"],
    security: ["API Key Management", "Webhook Signatures", "TLS 1.3"],
  },
]

// Infrastructure Details
const infrastructure = {
  hosting: {
    primary: "Vercel",
    database: "Supabase (AWS)",
    cdn: "Vercel Edge Network",
    region: "US-East-1 (primary)",
  },
  certifications: [
    { name: "SOC 2 Type II", provider: "Vercel", status: "Covered" },
    { name: "SOC 2 Type II", provider: "Supabase", status: "Covered" },
    { name: "PCI DSS Level 1", provider: "Stripe", status: "Covered" },
    { name: "ISO 27001", provider: "AWS", status: "Covered" },
  ],
}

// Security Controls Summary
const securityControls = [
  {
    category: "Encryption",
    controls: [
      { name: "Data in Transit", spec: "TLS 1.3, HTTPS enforced" },
      { name: "Data at Rest", spec: "AES-256-GCM" },
      { name: "Database Connections", spec: "SSL/TLS required" },
      { name: "API Communications", spec: "TLS 1.3" },
    ],
  },
  {
    category: "Authentication",
    controls: [
      { name: "User Auth", spec: "NextAuth.js with secure sessions" },
      { name: "API Auth", spec: "API keys with scoped permissions" },
      { name: "Admin Auth", spec: "MFA required" },
      { name: "Partner Auth", spec: "OAuth 2.0 / API keys" },
    ],
  },
  {
    category: "Access Control",
    controls: [
      { name: "Authorization", spec: "Role-based (RBAC)" },
      { name: "Database", spec: "Row-level security (RLS)" },
      { name: "Admin Access", spec: "Principle of least privilege" },
      { name: "Audit", spec: "All access logged" },
    ],
  },
  {
    category: "Network Security",
    controls: [
      { name: "Firewall", spec: "Cloud WAF enabled" },
      { name: "DDoS Protection", spec: "Vercel DDoS mitigation" },
      { name: "Rate Limiting", spec: "Per-IP and per-user limits" },
      { name: "Bot Protection", spec: "Challenge/CAPTCHA on forms" },
    ],
  },
]

// Business Continuity
const businessContinuity = {
  rpo: "1 hour",
  rto: "4 hours",
  backupSchedule: "Continuous with point-in-time recovery",
  backupRetention: "30 days incremental, 1 year monthly",
  backupLocations: "Multi-region (US-East, US-West)",
  drTesting: "Quarterly",
}

// API Security
const apiSecurity = [
  {
    endpoint: "Public API",
    auth: "API Key (header)",
    rateLimit: "1000/hour",
    encryption: "TLS 1.3",
    validation: "JSON Schema",
  },
  {
    endpoint: "Partner API",
    auth: "OAuth 2.0 / API Key",
    rateLimit: "5000/hour",
    encryption: "TLS 1.3",
    validation: "JSON Schema + Business Rules",
  },
  {
    endpoint: "Webhook Endpoints",
    auth: "HMAC-SHA256 Signature",
    rateLimit: "N/A (inbound)",
    encryption: "TLS 1.3",
    validation: "Signature + Schema",
  },
  {
    endpoint: "Admin API",
    auth: "Session + MFA",
    rateLimit: "500/hour",
    encryption: "TLS 1.3",
    validation: "Strict Schema + RBAC",
  },
]

// Performance Metrics
const performanceMetrics = [
  { metric: "API Response Time (p50)", target: "<100ms", current: "~65ms" },
  { metric: "API Response Time (p99)", target: "<500ms", current: "~250ms" },
  { metric: "Page Load Time", target: "<2s", current: "~1.2s" },
  { metric: "Uptime SLA", target: "99.9%", current: "99.95%" },
  { metric: "Database Query Time", target: "<50ms", current: "~25ms" },
]

// Data Flow
const dataFlows = [
  {
    flow: "Policy Purchase",
    steps: [
      "User submits quote request",
      "Data validated at edge",
      "Rating engine calculates premium",
      "User completes checkout",
      "Payment processed via Stripe",
      "Policy issued, documents generated",
      "Confirmation email sent",
      "Audit log entry created",
    ],
  },
  {
    flow: "Partner Integration (API)",
    steps: [
      "Partner authenticates via API key",
      "Request validated against schema",
      "Rate limit checked",
      "Business logic executed",
      "Response returned",
      "Webhook sent (if configured)",
      "Transaction logged",
    ],
  },
]

export default function TechnicalSpecificationsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-2">
          <Server className="w-4 h-4" />
          Document ID: DOC-009
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Technical Specifications
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          System architecture, security controls, and technical infrastructure details for
          insurance carrier IT teams and compliance reviewers conducting due diligence.
        </p>
      </div>

      {/* Infrastructure Overview */}
      <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Cloud className="w-6 h-6 text-teal-600" />
          Infrastructure Overview
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100">
            <div className="text-sm text-slate-500 mb-1">Application Hosting</div>
            <div className="font-semibold text-slate-900">{infrastructure.hosting.primary}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100">
            <div className="text-sm text-slate-500 mb-1">Database</div>
            <div className="font-semibold text-slate-900">{infrastructure.hosting.database}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100">
            <div className="text-sm text-slate-500 mb-1">CDN</div>
            <div className="font-semibold text-slate-900">{infrastructure.hosting.cdn}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100">
            <div className="text-sm text-slate-500 mb-1">Primary Region</div>
            <div className="font-semibold text-slate-900">{infrastructure.hosting.region}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-slate-900 mb-3">Provider Certifications</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {infrastructure.certifications.map((cert) => (
              <div key={`${cert.name}-${cert.provider}`} className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="text-sm font-medium text-slate-900">{cert.name}</div>
                  <div className="text-xs text-slate-500">{cert.provider}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Architecture */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Layers className="w-6 h-6 text-teal-600" />
          System Architecture
        </h2>
        <p className="text-slate-600 mb-6">
          Layered architecture with security controls at each level.
        </p>
        <div className="space-y-4">
          {architectureLayers.map((layer, idx) => (
            <motion.div
              key={layer.layer}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-500 text-white text-sm font-bold rounded-lg flex items-center justify-center">
                  {idx + 1}
                </div>
                <h3 className="font-semibold text-slate-900">{layer.layer}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-2">Components</div>
                  <div className="flex flex-wrap gap-2">
                    {layer.components.map((comp) => (
                      <span key={comp} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-2">Security Controls</div>
                  <div className="flex flex-wrap gap-2">
                    {layer.security.map((sec) => (
                      <span key={sec} className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security Controls */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Shield className="w-6 h-6 text-teal-600" />
          Security Controls Summary
        </h2>
        <p className="text-slate-600 mb-6">
          Key security controls implemented across the platform.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {securityControls.map((category) => (
            <div key={category.category} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-4">{category.category}</h3>
              <div className="space-y-3">
                {category.controls.map((control) => (
                  <div key={control.name} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">{control.name}</span>
                    <span className="text-xs text-slate-500">{control.spec}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Security */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Key className="w-6 h-6 text-teal-400" />
          API Security Specifications
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-4 py-3 text-left font-semibold text-teal-400">Endpoint</th>
                <th className="px-4 py-3 text-left font-semibold text-teal-400">Authentication</th>
                <th className="px-4 py-3 text-left font-semibold text-teal-400">Rate Limit</th>
                <th className="px-4 py-3 text-left font-semibold text-teal-400">Encryption</th>
                <th className="px-4 py-3 text-left font-semibold text-teal-400">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {apiSecurity.map((api) => (
                <tr key={api.endpoint}>
                  <td className="px-4 py-3 font-medium">{api.endpoint}</td>
                  <td className="px-4 py-3 text-slate-300">{api.auth}</td>
                  <td className="px-4 py-3 text-slate-300">{api.rateLimit}</td>
                  <td className="px-4 py-3 text-slate-300">{api.encryption}</td>
                  <td className="px-4 py-3 text-slate-300">{api.validation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Continuity */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-teal-600" />
          Business Continuity & Disaster Recovery
        </h2>
        <p className="text-slate-600 mb-6">
          Recovery objectives and backup procedures.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-8 h-8 text-amber-500" />
              <div>
                <div className="text-sm text-slate-500">Recovery Point Objective</div>
                <div className="text-2xl font-bold text-slate-900">{businessContinuity.rpo}</div>
              </div>
            </div>
            <p className="text-sm text-slate-600">Maximum acceptable data loss</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-8 h-8 text-teal-500" />
              <div>
                <div className="text-sm text-slate-500">Recovery Time Objective</div>
                <div className="text-2xl font-bold text-slate-900">{businessContinuity.rto}</div>
              </div>
            </div>
            <p className="text-sm text-slate-600">Maximum acceptable downtime</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-sm text-slate-500">Backup Schedule</div>
                <div className="text-lg font-bold text-slate-900">Continuous</div>
              </div>
            </div>
            <p className="text-sm text-slate-600">Point-in-time recovery available</p>
          </div>
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm font-medium text-slate-700">Backup Retention</div>
            <div className="text-sm text-slate-600 mt-1">{businessContinuity.backupRetention}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm font-medium text-slate-700">Backup Locations</div>
            <div className="text-sm text-slate-600 mt-1">{businessContinuity.backupLocations}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm font-medium text-slate-700">DR Testing</div>
            <div className="text-sm text-slate-600 mt-1">{businessContinuity.drTesting}</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Performance Metrics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tl-lg">Metric</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Target</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tr-lg">Current</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {performanceMetrics.map((item, idx) => (
                <tr key={item.metric} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.metric}</td>
                  <td className="px-4 py-3 text-slate-600">{item.target}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      {item.current}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Flow */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Network className="w-6 h-6" />
          Data Flow Diagrams
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {dataFlows.map((flow) => (
            <div key={flow.flow} className="p-5 bg-white/10 rounded-xl border border-white/20">
              <h3 className="font-semibold mb-4">{flow.flow}</h3>
              <ol className="space-y-2">
                {flow.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-teal-100">
                    <span className="w-5 h-5 bg-white/20 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
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
          href="/insurance/compliance/integrations"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Integration Compliance
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
