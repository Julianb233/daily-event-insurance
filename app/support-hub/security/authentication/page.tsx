"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Key, Shield, CheckCircle, AlertTriangle, ArrowRight, Code } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function AuthenticationPage() {
  const authMethods = [
    {
      method: "API Keys",
      useCase: "Server-to-server integration",
      security: "High",
      features: [
        "Long-lived credentials",
        "Environment-specific keys",
        "Rate limiting built-in",
        "IP whitelisting available"
      ],
      bestFor: "Backend integrations, automated systems"
    },
    {
      method: "OAuth 2.0",
      useCase: "User authorization",
      security: "Very High",
      features: [
        "Token-based authentication",
        "Scoped permissions",
        "Short-lived access tokens",
        "Refresh token support"
      ],
      bestFor: "Third-party applications, user-facing apps"
    },
    {
      method: "JWT Tokens",
      useCase: "Stateless authentication",
      security: "High",
      features: [
        "Self-contained tokens",
        "Signature verification",
        "Expiration handling",
        "Custom claims support"
      ],
      bestFor: "Microservices, distributed systems"
    }
  ];

  const mfaMethods = [
    {
      name: "Authenticator App",
      description: "TOTP-based verification (Google Authenticator, Authy)",
      recommended: true
    },
    {
      name: "SMS Verification",
      description: "One-time code sent via text message",
      recommended: false
    },
    {
      name: "Email Verification",
      description: "One-time code sent via email",
      recommended: false
    },
    {
      name: "Hardware Keys",
      description: "FIDO2/WebAuthn security keys (YubiKey)",
      recommended: true
    }
  ];

  const bestPractices = [
    {
      category: "Credential Management",
      practices: [
        "Never hardcode API keys in source code",
        "Use environment variables for sensitive data",
        "Rotate credentials every 90 days",
        "Use different keys for dev/staging/production",
        "Store keys in secure vaults (AWS Secrets Manager, etc.)",
        "Revoke unused or compromised keys immediately"
      ]
    },
    {
      category: "Session Management",
      practices: [
        "Use secure, httpOnly cookies for session tokens",
        "Implement proper session timeout (15-30 minutes)",
        "Regenerate session IDs after authentication",
        "Implement logout on all devices",
        "Use CSRF tokens for state-changing operations",
        "Log session events for audit trail"
      ]
    },
    {
      category: "Password Security",
      practices: [
        "Enforce minimum 12 character passwords",
        "Require mix of uppercase, lowercase, numbers, symbols",
        "Implement password strength meter",
        "Prevent common/breached passwords",
        "Use bcrypt/argon2 for password hashing",
        "Implement account lockout after failed attempts"
      ]
    },
    {
      category: "Access Control",
      practices: [
        "Implement role-based access control (RBAC)",
        "Follow principle of least privilege",
        "Separate read and write permissions",
        "Log all access attempts",
        "Review and audit permissions regularly",
        "Require re-authentication for sensitive actions"
      ]
    }
  ];

  const codeExamples = [
    {
      title: "Secure API Key Usage (Node.js)",
      code: `// ❌ Bad: Hardcoded API key
const apiKey = 'sk_live_1234567890';

// ✅ Good: Environment variable
const apiKey = process.env.DAILY_EVENT_API_KEY;

// ✅ Better: Validate key exists
if (!process.env.DAILY_EVENT_API_KEY) {
  throw new Error('API key not configured');
}

const apiKey = process.env.DAILY_EVENT_API_KEY;`
    },
    {
      title: "API Request with Authentication",
      code: `const response = await fetch('https://api.dailyevent.com/v1/quotes', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json',
    'X-Request-ID': generateRequestId(), // For tracing
  },
  body: JSON.stringify(quoteData)
});

// Always check response status
if (!response.ok) {
  if (response.status === 401) {
    // Handle authentication error
    throw new Error('Invalid API key');
  }
  throw new Error('API request failed');
}`
    },
    {
      title: "Secure Token Storage (Frontend)",
      code: `// ❌ Bad: localStorage for sensitive tokens
localStorage.setItem('access_token', token);

// ✅ Good: httpOnly cookie (set by backend)
// Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict

// ✅ For short-lived tokens in memory
class TokenManager {
  #accessToken = null;

  setToken(token) {
    this.#accessToken = token;
    // Clear token after expiration
    setTimeout(() => this.#accessToken = null, 15 * 60 * 1000);
  }

  getToken() {
    return this.#accessToken;
  }
}`
    }
  ];

  const commonMistakes = [
    {
      mistake: "Exposing API keys in client-side code",
      impact: "High - Keys can be stolen and abused",
      solution: "Use server-side proxy or OAuth flow for client apps"
    },
    {
      mistake: "Not validating tokens on every request",
      impact: "High - Expired/revoked tokens may be accepted",
      solution: "Implement middleware to verify tokens on all protected routes"
    },
    {
      mistake: "Using weak password requirements",
      impact: "Medium - Accounts vulnerable to brute force",
      solution: "Enforce strong password policies and rate limiting"
    },
    {
      mistake: "Storing passwords in plain text logs",
      impact: "Critical - Complete compromise of user credentials",
      solution: "Sanitize logs to remove sensitive data before storage"
    },
    {
      mistake: "Not implementing MFA for admin accounts",
      impact: "High - Single point of failure for critical access",
      solution: "Require MFA for all privileged accounts"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-8">
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
              { label: "Authentication" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Authentication</h1>
              <p className="text-slate-400 text-lg mt-2">
                Best practices for API and dashboard authentication
              </p>
            </div>
          </div>
        </motion.div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Authentication Overview</h2>
            <p className="text-slate-300 leading-relaxed">
              Daily Event Insurance uses industry-standard authentication methods to secure API
              access and user accounts. We support multiple authentication methods depending on
              your integration type, all designed to provide strong security while maintaining
              ease of use.
            </p>
          </GlassCard>
        </motion.div>

        {/* Authentication Methods */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold"
          >
            Authentication Methods
          </motion.h2>

          {authMethods.map((method, index) => (
            <motion.div
              key={method.method}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{method.method}</h3>
                    <p className="text-slate-400 text-sm">{method.useCase}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    method.security === "Very High"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {method.security} Security
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {method.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-slate-400 mb-1">Best for:</p>
                    <p className="text-slate-300">{method.bestFor}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Multi-Factor Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold">Multi-Factor Authentication (MFA)</h2>
            </div>

            <p className="text-slate-300 mb-6">
              MFA adds an extra layer of security by requiring two or more verification factors.
              We strongly recommend enabling MFA for all accounts, and require it for admin access.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {mfaMethods.map((method, index) => (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    method.recommended
                      ? "bg-green-500/5 border-green-500/30"
                      : "bg-slate-800/30 border-slate-700/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{method.name}</h3>
                    {method.recommended && (
                      <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{method.description}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Authentication Best Practices</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {bestPractices.map((section, index) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">
                    {section.category}
                  </h3>
                  <ul className="space-y-2">
                    {section.practices.map((practice, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold">Code Examples</h2>
            </div>

            <div className="space-y-6">
              {codeExamples.map((example, index) => (
                <motion.div
                  key={example.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold mb-3">{example.title}</h3>
                  <pre className="p-4 rounded-lg bg-slate-900 border border-slate-700 overflow-x-auto">
                    <code className="text-sm text-slate-300">{example.code}</code>
                  </pre>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Common Mistakes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
        >
          <GlassCard className="p-6 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Common Authentication Mistakes</h2>
            </div>

            <div className="space-y-3">
              {commonMistakes.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6 + index * 0.05 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-yellow-400">{item.mistake}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                      item.impact.startsWith("Critical")
                        ? "bg-red-500/20 text-red-400"
                        : item.impact.startsWith("High")
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {item.impact.split(" - ")[0]}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{item.impact.split(" - ")[1]}</p>
                  <div className="flex items-start gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-green-400">{item.solution}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.8 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/support-hub/integrations/api">
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-2">API Documentation</h3>
                  <p className="text-slate-400 text-sm">Complete API reference with authentication examples</p>
                </div>
              </Link>

              <Link href="/support-hub/security/api-security">
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-2">API Security</h3>
                  <p className="text-slate-400 text-sm">Security guidelines for API usage</p>
                </div>
              </Link>

              <a
                href="mailto:security@dailyeventinsurance.com"
                className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 transition-colors"
              >
                <h3 className="font-semibold mb-2">Security Support</h3>
                <p className="text-slate-400 text-sm">Contact our security team for help</p>
              </a>
            </div>
          </GlassCard>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.9 }}
          className="flex flex-wrap gap-4"
        >
          <Link href="/support-hub/security/api-security">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>Next: API Security</span>
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
