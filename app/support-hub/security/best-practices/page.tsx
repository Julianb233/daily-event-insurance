"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileCheck, Shield, CheckCircle, AlertTriangle, ArrowRight, Lock, Code, Database, Users } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function BestPracticesPage() {
  const categories = [
    {
      icon: Lock,
      title: "Authentication & Access",
      color: "text-blue-400",
      practices: [
        { practice: "Enable MFA on all accounts", priority: "Critical" },
        { practice: "Use strong, unique passwords (12+ characters)", priority: "Critical" },
        { practice: "Rotate API keys every 90 days", priority: "High" },
        { practice: "Use separate API keys per environment", priority: "High" },
        { practice: "Implement role-based access control", priority: "Medium" },
        { practice: "Review user permissions quarterly", priority: "Medium" }
      ]
    },
    {
      icon: Code,
      title: "Development Security",
      color: "text-green-400",
      practices: [
        { practice: "Never commit secrets to version control", priority: "Critical" },
        { practice: "Use environment variables for configuration", priority: "Critical" },
        { practice: "Validate and sanitize all inputs", priority: "Critical" },
        { practice: "Implement proper error handling", priority: "High" },
        { practice: "Keep dependencies up to date", priority: "High" },
        { practice: "Use security linters and scanners", priority: "Medium" }
      ]
    },
    {
      icon: Database,
      title: "Data Protection",
      color: "text-purple-400",
      practices: [
        { practice: "Encrypt sensitive data at rest", priority: "Critical" },
        { practice: "Use TLS 1.3 for all communications", priority: "Critical" },
        { practice: "Implement data retention policies", priority: "High" },
        { practice: "Backup data regularly", priority: "High" },
        { practice: "Sanitize logs of sensitive information", priority: "High" },
        { practice: "Use tokenization for PCI data", priority: "Critical" }
      ]
    },
    {
      icon: Users,
      title: "Team & Operations",
      color: "text-yellow-400",
      practices: [
        { practice: "Provide regular security training", priority: "High" },
        { practice: "Establish incident response plan", priority: "Critical" },
        { practice: "Monitor and log security events", priority: "High" },
        { practice: "Conduct regular security audits", priority: "Medium" },
        { practice: "Implement change management process", priority: "Medium" },
        { practice: "Document security procedures", priority: "Medium" }
      ]
    }
  ];

  const securityChecklist = [
    {
      phase: "Development",
      tasks: [
        "Security requirements defined",
        "Threat model documented",
        "Secure coding guidelines followed",
        "Code review includes security check",
        "SAST tools integrated in CI/CD",
        "Dependencies scanned for vulnerabilities"
      ]
    },
    {
      phase: "Testing",
      tasks: [
        "Security test cases executed",
        "Penetration testing completed",
        "Vulnerability scan performed",
        "Authentication tested thoroughly",
        "Authorization rules verified",
        "Input validation tested"
      ]
    },
    {
      phase: "Deployment",
      tasks: [
        "Secrets management configured",
        "TLS/SSL certificates validated",
        "Firewall rules configured",
        "Monitoring and alerting set up",
        "Backup and recovery tested",
        "Security headers configured"
      ]
    },
    {
      phase: "Operations",
      tasks: [
        "Security logs monitored",
        "Incident response plan ready",
        "Regular security updates applied",
        "Access logs reviewed",
        "Performance metrics tracked",
        "Regular security audits conducted"
      ]
    }
  ];

  const commonVulnerabilities = [
    {
      vulnerability: "SQL Injection",
      risk: "Critical",
      prevention: "Use parameterized queries and ORM frameworks"
    },
    {
      vulnerability: "Cross-Site Scripting (XSS)",
      risk: "High",
      prevention: "Sanitize user input, use Content Security Policy"
    },
    {
      vulnerability: "Broken Authentication",
      risk: "Critical",
      prevention: "Implement MFA, secure session management"
    },
    {
      vulnerability: "Sensitive Data Exposure",
      risk: "High",
      prevention: "Encrypt data at rest and in transit"
    },
    {
      vulnerability: "Broken Access Control",
      risk: "Critical",
      prevention: "Implement proper authorization checks"
    },
    {
      vulnerability: "Security Misconfiguration",
      risk: "High",
      prevention: "Use security hardening guides, regular audits"
    },
    {
      vulnerability: "Cross-Site Request Forgery (CSRF)",
      risk: "Medium",
      prevention: "Use CSRF tokens, SameSite cookies"
    },
    {
      vulnerability: "Using Components with Known Vulnerabilities",
      risk: "High",
      prevention: "Regular dependency updates, vulnerability scanning"
    }
  ];

  const incidentResponse = [
    {
      step: "Detection",
      actions: ["Identify the incident", "Assess initial impact", "Activate response team"],
      timeframe: "< 1 hour"
    },
    {
      step: "Containment",
      actions: ["Isolate affected systems", "Prevent further damage", "Preserve evidence"],
      timeframe: "< 4 hours"
    },
    {
      step: "Investigation",
      actions: ["Determine root cause", "Assess full scope", "Document findings"],
      timeframe: "< 24 hours"
    },
    {
      step: "Remediation",
      actions: ["Fix vulnerabilities", "Restore services", "Verify security"],
      timeframe: "< 72 hours"
    },
    {
      step: "Recovery",
      actions: ["Resume normal operations", "Monitor for issues", "Communicate status"],
      timeframe: "Ongoing"
    },
    {
      step: "Lessons Learned",
      actions: ["Post-incident review", "Update procedures", "Share learnings"],
      timeframe: "Within 2 weeks"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white p-8">
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
              { label: "Best Practices" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <FileCheck className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Security Best Practices</h1>
              <p className="text-slate-400 text-lg mt-2">
                Comprehensive security checklist and guidelines for partners
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security by Category */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>

                <div className="space-y-2">
                  {category.practices.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 p-2 rounded bg-slate-800/30"
                    >
                      <div className="flex items-start gap-2 flex-1">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm">{item.practice}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
                        item.priority === "Critical"
                          ? "bg-red-500/20 text-red-400"
                          : item.priority === "High"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Security Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">SDLC Security Checklist</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityChecklist.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-purple-400">
                    {phase.phase}
                  </h3>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Common Vulnerabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">OWASP Top 10 Prevention</h2>

            <div className="space-y-3">
              {commonVulnerabilities.map((vuln, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 + index * 0.05 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold">{vuln.vulnerability}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                      vuln.risk === "Critical"
                        ? "bg-red-500/20 text-red-400"
                        : vuln.risk === "High"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {vuln.risk} Risk
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{vuln.prevention}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Incident Response */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Incident Response Process</h2>

            <div className="space-y-4">
              {incidentResponse.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <span className="text-purple-400 font-bold">{index + 1}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{step.step}</h3>
                      <span className="text-sm text-slate-400">{step.timeframe}</span>
                    </div>
                    <ul className="space-y-1">
                      {step.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.7 }}
        >
          <GlassCard className="p-6 border-red-500/30 bg-red-500/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">
                  Security Incident? Contact Us Immediately
                </h3>
                <p className="text-slate-300 mb-4">
                  If you experience a security incident or suspect a breach, contact our
                  24/7 security team immediately.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:security@dailyeventinsurance.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm"
                  >
                    Email: security@dailyeventinsurance.com
                  </a>
                  <a
                    href="tel:1-800-SECURE-1"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
                  >
                    Phone: 1-800-SECURE-1
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.8 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Additional Security Resources</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="https://owasp.org/www-project-top-ten/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/50 transition-colors"
              >
                <h3 className="font-semibold mb-2">OWASP Top 10</h3>
                <p className="text-slate-400 text-sm">Most critical web security risks</p>
              </a>

              <a
                href="https://www.sans.org/security-resources/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/50 transition-colors"
              >
                <h3 className="font-semibold mb-2">SANS Security</h3>
                <p className="text-slate-400 text-sm">Security training and resources</p>
              </a>

              <Link href="/support-hub/security/certifications">
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-2">Our Certifications</h3>
                  <p className="text-slate-400 text-sm">SOC 2, PCI DSS, and more</p>
                </div>
              </Link>
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
          <Link href="/support-hub/security/certifications">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>Next: Certifications</span>
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
