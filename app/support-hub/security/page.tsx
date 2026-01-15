"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Lock, Key, FileCheck, Award, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function SecurityPage() {
  const securityTopics = [
    {
      icon: Lock,
      title: "Authentication",
      description: "Best practices for API and dashboard authentication",
      href: "/support-hub/security/authentication",
      color: "text-blue-400"
    },
    {
      icon: Key,
      title: "API Security",
      description: "API security guidelines and token management",
      href: "/support-hub/security/api-security",
      color: "text-green-400"
    },
    {
      icon: FileCheck,
      title: "Best Practices",
      description: "Security best practices checklist for partners",
      href: "/support-hub/security/best-practices",
      color: "text-purple-400"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "SOC 2, compliance certifications and audits",
      href: "/support-hub/security/certifications",
      color: "text-yellow-400"
    }
  ];

  const securityStats = [
    { label: "Uptime", value: "99.99%", color: "text-green-400" },
    { label: "Data Encrypted", value: "100%", color: "text-blue-400" },
    { label: "Security Audits/Year", value: "4+", color: "text-purple-400" },
    { label: "MTTR (Minutes)", value: "<15", color: "text-cyan-400" }
  ];

  const securityLayers = [
    {
      layer: "Application Security",
      measures: [
        "Input validation and sanitization",
        "OWASP Top 10 protection",
        "Secure coding practices",
        "Regular code reviews",
        "Automated security scanning"
      ]
    },
    {
      layer: "Data Security",
      measures: [
        "AES-256 encryption at rest",
        "TLS 1.3 encryption in transit",
        "Tokenization of sensitive data",
        "Secure key management",
        "Regular encryption audits"
      ]
    },
    {
      layer: "Infrastructure Security",
      measures: [
        "Cloud security best practices",
        "Network segmentation",
        "DDoS protection",
        "WAF and intrusion detection",
        "Regular vulnerability scans"
      ]
    },
    {
      layer: "Access Control",
      measures: [
        "Multi-factor authentication",
        "Role-based access control",
        "Least privilege principle",
        "Session management",
        "Access logging and monitoring"
      ]
    }
  ];

  const certifications = [
    {
      name: "SOC 2 Type II",
      description: "Annual audit of security controls",
      status: "Current",
      icon: "🔒"
    },
    {
      name: "PCI DSS",
      description: "Payment card industry compliance",
      status: "Current",
      icon: "💳"
    },
    {
      name: "ISO 27001",
      description: "Information security management",
      status: "In Progress",
      icon: "🛡️"
    },
    {
      name: "GDPR",
      description: "EU data protection compliance",
      status: "Current",
      icon: "🇪🇺"
    }
  ];

  const threatDetection = [
    "Real-time threat monitoring and alerting",
    "Automated security incident response",
    "Behavioral anomaly detection",
    "Log aggregation and analysis",
    "Threat intelligence integration",
    "24/7 security operations center"
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
              { label: "Security" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Security Center</h1>
              <p className="text-slate-400 text-lg mt-2">
                Comprehensive security practices, certifications, and guidelines
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {securityStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Security Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Security Commitment</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Security is fundamental to everything we do at Daily Event Insurance. We employ
                  industry-leading security practices, maintain rigorous compliance certifications,
                  and continuously monitor our systems to protect customer data and ensure service
                  reliability.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Our security program follows a defense-in-depth approach with multiple layers of
                  protection, from application security to infrastructure hardening. We undergo
                  regular third-party audits and maintain certifications including SOC 2 Type II
                  and PCI DSS.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Security Topics Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {securityTopics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link href={topic.href}>
                <GlassCard className="p-6 hover:scale-[1.02] transition-transform cursor-pointer h-full">
                  <div className={`p-3 rounded-lg bg-slate-800/50 w-fit ${topic.color}`}>
                    <topic.icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {topic.title}
                  </h3>

                  <p className="text-slate-400">
                    {topic.description}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-blue-400">
                    <span className="text-sm">Learn more</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Security Layers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Defense-in-Depth Security</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {securityLayers.map((layer, index) => (
                <motion.div
                  key={layer.layer}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">
                    {layer.layer}
                  </h3>
                  <ul className="space-y-2">
                    {layer.measures.map((measure, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Security Certifications</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="text-center p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="text-4xl mb-2">{cert.icon}</div>
                  <h3 className="font-semibold mb-1">{cert.name}</h3>
                  <p className="text-slate-400 text-xs mb-2">{cert.description}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    cert.status === "Current"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {cert.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Threat Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Threat Detection & Response</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {threatDetection.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4 + index * 0.05 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Security Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6 }}
        >
          <GlassCard className="p-6 border-red-500/30 bg-red-500/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">
                  Report Security Issues Immediately
                </h3>
                <p className="text-slate-300 mb-4">
                  If you discover a security vulnerability or suspect a security incident, contact
                  our security team immediately. Do not disclose security issues publicly.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:security@dailyeventinsurance.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm"
                  >
                    Email Security Team
                  </a>
                  <a
                    href="tel:1-800-SECURE-1"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
                  >
                    24/7 Security Hotline
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Responsible Disclosure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.7 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Responsible Disclosure Program</h2>
            <p className="text-slate-300 mb-4">
              We welcome security researchers to help us maintain the highest security standards.
              Our responsible disclosure program provides:
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <h3 className="font-semibold mb-2 text-blue-400">Safe Harbor</h3>
                <p className="text-slate-300 text-sm">
                  Protection from legal action for good faith security research
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <h3 className="font-semibold mb-2 text-green-400">Recognition</h3>
                <p className="text-slate-300 text-sm">
                  Public acknowledgment in our security hall of fame
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <h3 className="font-semibold mb-2 text-purple-400">Rewards</h3>
                <p className="text-slate-300 text-sm">
                  Bug bounties for qualifying vulnerabilities
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.8 }}
        >
          <GlassCard className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Security Questions?
            </h2>
            <p className="text-slate-400 mb-4">
              Our security team is available to answer questions and provide guidance
            </p>
            <Link
              href="mailto:security@dailyeventinsurance.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Contact Security Team
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
