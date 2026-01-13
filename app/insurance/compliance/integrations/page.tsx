"use client"

import Link from "next/link"
import {
  Globe,
  Code,
  Webhook,
  CheckCircle,
  Shield,
  Lock,
  FileText,
  AlertTriangle,
  Eye,
  Key,
  Server,
  Database,
  RefreshCw,
  Clock,
  Users,
  ArrowRight,
  Fingerprint,
  Network,
} from "lucide-react"

interface ComplianceRequirement {
  category: string
  requirement: string
  implementation: string
  status: "implemented" | "in_progress" | "planned"
}

const micrositeCompliance: ComplianceRequirement[] = [
  {
    category: "Data Collection",
    requirement: "Explicit consent collection before data submission",
    implementation: "Checkbox consent with timestamp logging, links to privacy policy and terms",
    status: "implemented",
  },
  {
    category: "Data Collection",
    requirement: "Clear privacy disclosure on data collection forms",
    implementation: "Privacy notice displayed above form submission, explaining data use",
    status: "implemented",
  },
  {
    category: "Security",
    requirement: "HTTPS-only form submission",
    implementation: "TLS 1.3 encryption, HSTS headers, automatic HTTP redirect",
    status: "implemented",
  },
  {
    category: "Security",
    requirement: "CSRF protection on all forms",
    implementation: "CSRF tokens generated per session, validated on submission",
    status: "implemented",
  },
  {
    category: "Security",
    requirement: "Input validation and sanitization",
    implementation: "Server-side validation, XSS prevention, SQL injection protection",
    status: "implemented",
  },
  {
    category: "Audit",
    requirement: "Complete submission logging",
    implementation: "All submissions logged with timestamp, IP, consent status, form data hash",
    status: "implemented",
  },
  {
    category: "Compliance",
    requirement: "Partner branding guidelines compliance",
    implementation: "Co-branding requirements enforced, DEI disclosure visible",
    status: "implemented",
  },
  {
    category: "Compliance",
    requirement: "Geographic data collection compliance",
    implementation: "State-specific disclosures, CCPA opt-out for California residents",
    status: "implemented",
  },
]

const apiCompliance: ComplianceRequirement[] = [
  {
    category: "Authentication",
    requirement: "Secure API authentication",
    implementation: "OAuth 2.0 with client credentials or API key authentication",
    status: "implemented",
  },
  {
    category: "Authentication",
    requirement: "API key security",
    implementation: "SHA-256 hashed storage, secure transmission, rotation support",
    status: "implemented",
  },
  {
    category: "Authorization",
    requirement: "Scope-based permissions",
    implementation: "Granular API scopes: read:quotes, write:quotes, read:policies, etc.",
    status: "implemented",
  },
  {
    category: "Authorization",
    requirement: "Principle of least privilege",
    implementation: "Partners only granted minimum required permissions",
    status: "implemented",
  },
  {
    category: "Security",
    requirement: "TLS encryption required",
    implementation: "TLS 1.2+ required for all API calls, TLS 1.3 preferred",
    status: "implemented",
  },
  {
    category: "Security",
    requirement: "Rate limiting",
    implementation: "100 requests/minute default, 429 response with retry headers",
    status: "implemented",
  },
  {
    category: "Security",
    requirement: "Request validation",
    implementation: "JSON schema validation, input sanitization, payload size limits",
    status: "implemented",
  },
  {
    category: "Audit",
    requirement: "Request logging with tracing",
    implementation: "Unique request ID, timestamp, endpoint, response code, duration",
    status: "implemented",
  },
  {
    category: "Compliance",
    requirement: "PII handling restrictions",
    implementation: "No PII in URL parameters, encrypted sensitive fields in request body",
    status: "implemented",
  },
  {
    category: "Compliance",
    requirement: "API versioning for stability",
    implementation: "Version in URL path, deprecation notices, migration support",
    status: "implemented",
  },
]

const webhookCompliance: ComplianceRequirement[] = [
  {
    category: "Security",
    requirement: "Webhook signature verification",
    implementation: "HMAC-SHA256 signature in X-DEI-Signature header, timestamp validation",
    status: "implemented",
  },
  {
    category: "Security",
    requirement: "Replay attack prevention",
    implementation: "Timestamp validation (5-minute window), event ID deduplication",
    status: "implemented",
  },
  {
    category: "Security",
    requirement: "Payload encryption",
    implementation: "Optional encrypted payloads for sensitive data, no PII in URL",
    status: "implemented",
  },
  {
    category: "Reliability",
    requirement: "Idempotent event processing",
    implementation: "Unique event IDs, deduplication in database, safe retry handling",
    status: "implemented",
  },
  {
    category: "Reliability",
    requirement: "Retry with exponential backoff",
    implementation: "Automatic retry (3 attempts), exponential backoff (1s, 5s, 25s)",
    status: "implemented",
  },
  {
    category: "Reliability",
    requirement: "Dead letter queue",
    implementation: "Failed events queued for manual review, alerting on failures",
    status: "implemented",
  },
  {
    category: "Audit",
    requirement: "Event logging",
    implementation: "All events logged with status, processing time, retry count",
    status: "implemented",
  },
  {
    category: "Compliance",
    requirement: "Event type documentation",
    implementation: "Comprehensive event catalog with schemas and examples",
    status: "implemented",
  },
  {
    category: "Compliance",
    requirement: "Partner endpoint requirements",
    implementation: "HTTPS required, response time SLA, status code requirements",
    status: "implemented",
  },
]

const statusConfig = {
  implemented: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Implemented" },
  in_progress: { bg: "bg-amber-100", text: "text-amber-700", label: "In Progress" },
  planned: { bg: "bg-slate-100", text: "text-slate-600", label: "Planned" },
}

function RequirementTable({ requirements, title }: { requirements: ComplianceRequirement[]; title: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="text-left py-3 px-4 font-semibold text-slate-700 w-32">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Requirement</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Implementation</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700 w-28">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requirements.map((req, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 text-slate-500 text-xs font-medium uppercase">{req.category}</td>
                <td className="py-3 px-4 text-slate-900 font-medium">{req.requirement}</td>
                <td className="py-3 px-4 text-slate-600">{req.implementation}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[req.status].bg} ${statusConfig[req.status].text}`}>
                    {statusConfig[req.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function IntegrationsCompliancePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-2">
          <Network className="w-4 h-4" />
          Partner Integrations
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Integration Compliance Standards
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Daily Event Insurance supports three primary integration methods for partners to submit
          insurance leads: Microsite, API, and Webhook. Each integration method is designed with
          comprehensive compliance controls to ensure data security, privacy, and regulatory adherence.
        </p>
      </div>

      {/* Integration Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-100 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Microsite Integration</h3>
          <p className="text-sm text-slate-600 mb-4">
            Embedded or co-branded web forms for direct customer enrollment with full consent management.
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <CheckCircle className="w-4 h-4" />
            <span>8 compliance controls</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-slate-50 rounded-xl border border-purple-100 p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Code className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">API Integration</h3>
          <p className="text-sm text-slate-600 mb-4">
            RESTful API for programmatic quote generation and policy creation from partner systems.
          </p>
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <CheckCircle className="w-4 h-4" />
            <span>10 compliance controls</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-slate-50 rounded-xl border border-orange-100 p-6">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <Webhook className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Webhook Integration</h3>
          <p className="text-sm text-slate-600 mb-4">
            Event-driven notifications for real-time updates from partner booking and CRM systems.
          </p>
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <CheckCircle className="w-4 h-4" />
            <span>9 compliance controls</span>
          </div>
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Database className="w-6 h-6 text-teal-400" />
          Compliant Data Flow Architecture
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="text-teal-400 font-semibold text-sm uppercase tracking-wide">Microsite Flow</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-xs">1</div>
                <span className="text-slate-300">Customer visits partner microsite</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-xs">2</div>
                <span className="text-slate-300">Privacy disclosure displayed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-xs">3</div>
                <span className="text-slate-300">Consent captured with timestamp</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-xs">4</div>
                <span className="text-slate-300">Form submitted over TLS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-xs">5</div>
                <span className="text-slate-300">Data validated & logged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-xs">6</div>
                <span className="text-slate-300">Quote generated, stored encrypted</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-teal-400 font-semibold text-sm uppercase tracking-wide">API Flow</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center text-xs">1</div>
                <span className="text-slate-300">Partner authenticates via OAuth/API key</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center text-xs">2</div>
                <span className="text-slate-300">Scope permissions verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center text-xs">3</div>
                <span className="text-slate-300">Rate limit checked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center text-xs">4</div>
                <span className="text-slate-300">Request payload validated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center text-xs">5</div>
                <span className="text-slate-300">Request logged with trace ID</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center text-xs">6</div>
                <span className="text-slate-300">Response returned, logged</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-teal-400 font-semibold text-sm uppercase tracking-wide">Webhook Flow</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500/20 rounded flex items-center justify-center text-xs">1</div>
                <span className="text-slate-300">Partner system sends webhook</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500/20 rounded flex items-center justify-center text-xs">2</div>
                <span className="text-slate-300">Signature verified (HMAC-SHA256)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500/20 rounded flex items-center justify-center text-xs">3</div>
                <span className="text-slate-300">Timestamp validated (replay check)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500/20 rounded flex items-center justify-center text-xs">4</div>
                <span className="text-slate-300">Event ID deduplication</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500/20 rounded flex items-center justify-center text-xs">5</div>
                <span className="text-slate-300">Payload processed & logged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500/20 rounded flex items-center justify-center text-xs">6</div>
                <span className="text-slate-300">Acknowledgment returned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Microsite Compliance */}
      <section id="microsite">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Microsite Integration Compliance</h2>
            <p className="text-sm text-slate-500">Web form and embedded checkout compliance requirements</p>
          </div>
        </div>
        <RequirementTable requirements={micrositeCompliance} title="Microsite Compliance Controls" />
      </section>

      {/* API Compliance */}
      <section id="api">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">API Integration Compliance</h2>
            <p className="text-sm text-slate-500">RESTful API security and compliance requirements</p>
          </div>
        </div>
        <RequirementTable requirements={apiCompliance} title="API Compliance Controls" />

        {/* API Authentication Details */}
        <div className="mt-6 bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-600" />
            API Authentication Methods
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-medium text-slate-900 mb-2">OAuth 2.0 Client Credentials</h4>
              <p className="text-sm text-slate-600 mb-3">
                Recommended for server-to-server integrations with automatic token refresh.
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Token expiration: 1 hour
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Automatic refresh support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Scope-based permissions
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-medium text-slate-900 mb-2">API Key Authentication</h4>
              <p className="text-sm text-slate-600 mb-3">
                Simple authentication for trusted partners with key rotation support.
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  X-API-Key header required
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  90-day rotation recommended
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  IP allowlisting optional
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Webhook Compliance */}
      <section id="webhook">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Webhook className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Webhook Integration Compliance</h2>
            <p className="text-sm text-slate-500">Event-driven integration security requirements</p>
          </div>
        </div>
        <RequirementTable requirements={webhookCompliance} title="Webhook Compliance Controls" />

        {/* Webhook Signature Verification */}
        <div className="mt-6 bg-orange-50 rounded-xl border border-orange-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-orange-600" />
            Webhook Signature Verification
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            All incoming webhooks must include a valid HMAC-SHA256 signature for verification.
            Webhooks without valid signatures are rejected and logged as security events.
          </p>
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="font-mono text-sm text-slate-700 space-y-2">
              <div><span className="text-orange-600">Header:</span> X-DEI-Signature</div>
              <div><span className="text-orange-600">Format:</span> t=timestamp,v1=signature</div>
              <div><span className="text-orange-600">Algorithm:</span> HMAC-SHA256</div>
              <div><span className="text-orange-600">Payload:</span> timestamp.request_body</div>
              <div><span className="text-orange-600">Time Window:</span> ±5 minutes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Requirements */}
      <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Users className="w-6 h-6 text-teal-600" />
          Partner Integration Requirements
        </h2>
        <p className="text-slate-600 mb-6">
          All integration partners must meet the following requirements before receiving
          production API credentials or webhook endpoints.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Pre-Integration</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Complete partner agreement including data processing terms</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Provide business verification documentation</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Designate technical contact for security notifications</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Review and acknowledge integration compliance requirements</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Ongoing Requirements</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Maintain secure credential storage (no hardcoding)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Rotate API keys every 90 days (recommended)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Report security incidents within 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Maintain HTTPS endpoints for webhooks</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance Matrix Summary */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Integration Compliance Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Control</th>
                <th className="text-center py-3 px-4 font-semibold text-blue-700">Microsite</th>
                <th className="text-center py-3 px-4 font-semibold text-purple-700">API</th>
                <th className="text-center py-3 px-4 font-semibold text-orange-700">Webhook</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 text-slate-900 font-medium">TLS Encryption</td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-medium">Authentication</td>
                <td className="py-3 px-4 text-center text-slate-500 text-xs">Session/CSRF</td>
                <td className="py-3 px-4 text-center text-slate-500 text-xs">OAuth/API Key</td>
                <td className="py-3 px-4 text-center text-slate-500 text-xs">HMAC Signature</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-medium">Rate Limiting</td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center text-slate-400 text-xs">N/A</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-medium">Input Validation</td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-medium">Audit Logging</td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-medium">Replay Prevention</td>
                <td className="py-3 px-4 text-center text-slate-500 text-xs">CSRF Token</td>
                <td className="py-3 px-4 text-center text-slate-500 text-xs">Nonce (optional)</td>
                <td className="py-3 px-4 text-center text-slate-500 text-xs">Timestamp + ID</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-medium">Consent Capture</td>
                <td className="py-3 px-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center text-slate-500 text-xs">Partner-side</td>
                <td className="py-3 px-4 text-center text-slate-500 text-xs">Partner-side</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Related Documentation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Related Documentation</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/insurance/compliance/data-security"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
          >
            Data Security
          </Link>
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
        </div>
      </div>
    </div>
  )
}
