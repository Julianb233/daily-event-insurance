"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Key, Shield, Lock, AlertTriangle, CheckCircle, ArrowRight, Code, Database } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function APISecurityPage() {
  const securityPrinciples = [
    {
      icon: Key,
      title: "Secure Key Management",
      description: "Protect API keys and rotate regularly",
      practices: [
        "Store keys in environment variables or secure vaults",
        "Never commit keys to version control",
        "Rotate keys every 90 days",
        "Use separate keys per environment",
        "Revoke compromised keys immediately"
      ]
    },
    {
      icon: Lock,
      title: "Transport Security",
      description: "Encrypt all API communications",
      practices: [
        "Always use HTTPS/TLS 1.3",
        "Validate SSL certificates",
        "Use certificate pinning for mobile apps",
        "Implement HSTS headers",
        "Never transmit keys in URL parameters"
      ]
    },
    {
      icon: Shield,
      title: "Request Validation",
      description: "Validate and sanitize all inputs",
      practices: [
        "Validate request schemas",
        "Sanitize user input",
        "Implement rate limiting",
        "Check content-type headers",
        "Reject malformed requests"
      ]
    },
    {
      icon: Database,
      title: "Data Protection",
      description: "Protect sensitive data at rest and in transit",
      practices: [
        "Encrypt sensitive data fields",
        "Use tokenization for PCI data",
        "Implement field-level encryption",
        "Minimize data exposure in responses",
        "Log without sensitive data"
      ]
    }
  ];

  const rateLimits = [
    {
      tier: "Development",
      requests: "100/hour",
      burst: "10/minute",
      use: "Testing and development"
    },
    {
      tier: "Production",
      requests: "10,000/hour",
      burst: "100/minute",
      use: "Standard production traffic"
    },
    {
      tier: "Enterprise",
      requests: "Custom",
      burst: "Custom",
      use: "High-volume integrations"
    }
  ];

  const securityHeaders = [
    {
      header: "Authorization",
      value: "Bearer {api_key}",
      required: true,
      description: "API authentication key"
    },
    {
      header: "Content-Type",
      value: "application/json",
      required: true,
      description: "Request body format"
    },
    {
      header: "X-Request-ID",
      value: "unique-id",
      required: false,
      description: "Trace requests for debugging"
    },
    {
      header: "X-Idempotency-Key",
      value: "unique-key",
      required: false,
      description: "Prevent duplicate transactions"
    }
  ];

  const errorCodes = [
    { code: 401, meaning: "Unauthorized", action: "Check API key validity" },
    { code: 403, meaning: "Forbidden", action: "Verify API key permissions" },
    { code: 429, meaning: "Rate Limit Exceeded", action: "Implement exponential backoff" },
    { code: 500, meaning: "Server Error", action: "Retry with backoff, contact support if persists" }
  ];

  const bestPractices = [
    "Implement exponential backoff for failed requests",
    "Use idempotency keys for critical operations",
    "Validate webhook signatures",
    "Implement request timeouts (30 seconds recommended)",
    "Log API requests for audit trail (sanitize sensitive data)",
    "Monitor API usage and set up alerts",
    "Test error scenarios and edge cases",
    "Keep API client libraries up to date"
  ];

  const codeExample = `// Secure API request with all best practices
import crypto from 'crypto';

const makeSecureRequest = async (endpoint, data) => {
  // 1. Get key from secure storage
  const apiKey = process.env.DAILY_EVENT_API_KEY;
  if (!apiKey) throw new Error('API key not configured');

  // 2. Generate request ID for tracing
  const requestId = crypto.randomUUID();

  // 3. Generate idempotency key for critical operations
  const idempotencyKey = crypto.randomBytes(16).toString('hex');

  try {
    const response = await fetch(\`https://api.dailyevent.com/v1/\${endpoint}\`, {
      method: 'POST',
      timeout: 30000, // 30 second timeout
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data)
    });

    // 4. Handle response
    if (!response.ok) {
      if (response.status === 429) {
        // Implement exponential backoff
        await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
        return makeSecureRequest(endpoint, data);
      }
      throw new Error(\`API error: \${response.status}\`);
    }

    return await response.json();
  } catch (error) {
    // 5. Log error (without sensitive data)
    console.error('API request failed', {
      requestId,
      endpoint,
      error: error.message
    });
    throw error;
  }
};`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Breadcrumbs
            items={[
              { label: "Support Hub", href: "/support-hub" },
              { label: "Security", href: "/support-hub/security" },
              { label: "API Security" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
              <Key className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">API Security</h1>
              <p className="text-slate-400 text-lg mt-2">
                Security guidelines and best practices for API integration
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Principles */}
        <div className="grid md:grid-cols-2 gap-6">
          {securityPrinciples.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <principle.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">{principle.title}</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">{principle.description}</p>
                <ul className="space-y-2">
                  {principle.practices.map((practice, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Rate Limits</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {rateLimits.map((limit, index) => (
                <div
                  key={limit.tier}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 text-center"
                >
                  <h3 className="text-lg font-semibold mb-2 text-green-400">{limit.tier}</h3>
                  <div className="space-y-2 mb-3">
                    <div>
                      <div className="text-2xl font-bold">{limit.requests}</div>
                      <div className="text-slate-400 text-xs">Sustained</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{limit.burst}</div>
                      <div className="text-slate-400 text-xs">Burst</div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">{limit.use}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-slate-300 text-sm">
                <strong className="text-yellow-400">Note:</strong> Rate limits are per API key.
                Implement exponential backoff when receiving 429 responses.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Security Headers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Required Security Headers</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-green-400">Header</th>
                    <th className="text-left py-3 px-4 text-green-400">Example Value</th>
                    <th className="text-left py-3 px-4 text-green-400">Required</th>
                    <th className="text-left py-3 px-4 text-green-400">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {securityHeaders.map((header, index) => (
                    <tr key={index} className="border-b border-slate-800/50">
                      <td className="py-3 px-4 font-mono text-sm">{header.header}</td>
                      <td className="py-3 px-4 text-slate-400 text-sm font-mono">{header.value}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          header.required
                            ? "bg-red-500/20 text-red-400"
                            : "bg-slate-700/50 text-slate-400"
                        }`}>
                          {header.required ? "Required" : "Optional"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 text-sm">{header.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Error Handling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Error Handling</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {errorCodes.map((error, index) => (
                <div
                  key={error.code}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-red-400">{error.code}</span>
                    <span className="text-lg font-semibold">{error.meaning}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{error.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold">Secure API Request Example</h2>
            </div>

            <pre className="p-4 rounded-lg bg-slate-900 border border-slate-700 overflow-x-auto">
              <code className="text-sm text-slate-300">{codeExample}</code>
            </pre>
          </GlassCard>
        </motion.div>

        {/* Best Practices Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">API Security Checklist</h2>

            <div className="grid md:grid-cols-2 gap-3">
              {bestPractices.map((practice, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{practice}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
        >
          <GlassCard className="p-6 border-red-500/30 bg-red-500/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">
                  Report API Security Issues Immediately
                </h3>
                <p className="text-slate-300">
                  If you discover a security vulnerability in our API or suspect your API key
                  has been compromised, contact our security team immediately at{" "}
                  <a href="mailto:security@dailyeventinsurance.com" className="text-red-400 hover:underline">
                    security@dailyeventinsurance.com
                  </a>
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6 }}
          className="flex flex-wrap gap-4"
        >
          <Link href="/support-hub/security/best-practices">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>Next: Best Practices</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </GlassCard>
          </Link>

          <Link href="/support-hub/security">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>Back to Security Center</span>
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
