"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, Shield, CheckCircle, FileText, Calendar, ArrowRight, Download } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function CertificationsPage() {
  const certifications = [
    {
      name: "SOC 2 Type II",
      icon: "🔒",
      status: "Current",
      renewed: "Dec 2025",
      nextAudit: "Dec 2026",
      description: "Independent audit of security controls and processes",
      coverage: [
        "Security - Protection against unauthorized access",
        "Availability - System uptime and reliability",
        "Processing Integrity - Accurate data processing",
        "Confidentiality - Protected sensitive information",
        "Privacy - Personal data handling practices"
      ],
      auditor: "Big Four Accounting Firm",
      reportAvailable: true
    },
    {
      name: "PCI DSS Level 1",
      icon: "💳",
      status: "Current",
      renewed: "Oct 2025",
      nextAudit: "Oct 2026",
      description: "Payment Card Industry Data Security Standard compliance",
      coverage: [
        "Build and maintain secure network",
        "Protect cardholder data",
        "Maintain vulnerability management program",
        "Implement strong access control measures",
        "Regularly monitor and test networks",
        "Maintain information security policy"
      ],
      auditor: "PCI Qualified Security Assessor",
      reportAvailable: false
    },
    {
      name: "ISO 27001",
      icon: "🛡️",
      status: "In Progress",
      renewed: "N/A",
      nextAudit: "Q2 2026",
      description: "International standard for information security management",
      coverage: [
        "Information security policies",
        "Organization of information security",
        "Human resource security",
        "Asset management",
        "Access control",
        "Cryptography",
        "Physical and environmental security",
        "Operations security",
        "Business continuity management"
      ],
      auditor: "Accredited Certification Body",
      reportAvailable: false
    },
    {
      name: "GDPR Compliance",
      icon: "🇪🇺",
      status: "Current",
      renewed: "Ongoing",
      nextAudit: "Continuous",
      description: "EU General Data Protection Regulation compliance",
      coverage: [
        "Lawful processing of personal data",
        "Data subject rights implementation",
        "Data protection by design and default",
        "Data breach notification procedures",
        "Data Protection Officer appointed",
        "Cross-border transfer mechanisms"
      ],
      auditor: "Internal DPO + External Auditor",
      reportAvailable: false
    },
    {
      name: "HIPAA Compliance",
      icon: "🏥",
      status: "Current",
      renewed: "Jan 2025",
      nextAudit: "Jan 2026",
      description: "Health Insurance Portability and Accountability Act",
      coverage: [
        "Protected Health Information (PHI) safeguards",
        "Administrative safeguards",
        "Physical safeguards",
        "Technical safeguards",
        "Business associate agreements",
        "Breach notification procedures"
      ],
      auditor: "HIPAA Security Specialist",
      reportAvailable: false
    },
    {
      name: "State Insurance Licenses",
      icon: "📜",
      status: "Current",
      renewed: "Various",
      nextAudit: "Ongoing",
      description: "Insurance licenses in all 50 states plus DC",
      coverage: [
        "Producer licenses maintained",
        "Entity licenses current",
        "Continuing education completed",
        "State filings up to date",
        "Market conduct compliance",
        "Financial reporting current"
      ],
      auditor: "State Insurance Departments",
      reportAvailable: false
    }
  ];

  const auditProcess = [
    {
      phase: "Planning",
      duration: "2-4 weeks",
      activities: [
        "Scope definition and preparation",
        "Documentation review",
        "Interview scheduling",
        "Preliminary assessments"
      ]
    },
    {
      phase: "Fieldwork",
      duration: "4-6 weeks",
      activities: [
        "Control testing",
        "Security assessments",
        "Technical reviews",
        "Staff interviews"
      ]
    },
    {
      phase: "Reporting",
      duration: "2-3 weeks",
      activities: [
        "Findings compilation",
        "Report drafting",
        "Management review",
        "Final report issuance"
      ]
    },
    {
      phase: "Remediation",
      duration: "Ongoing",
      activities: [
        "Address findings",
        "Implement improvements",
        "Follow-up testing",
        "Continuous monitoring"
      ]
    }
  ];

  const continuousCompliance = [
    "Monthly security scans and vulnerability assessments",
    "Quarterly penetration testing",
    "Continuous security monitoring and alerting",
    "Regular employee security training",
    "Vendor security assessments",
    "Incident response drills",
    "Policy and procedure updates",
    "Compliance metrics tracking and reporting"
  ];

  const partnerBenefits = [
    {
      benefit: "Trusted Security Posture",
      description: "Demonstrate strong security to your customers"
    },
    {
      benefit: "Compliance Inheritance",
      description: "Leverage our certifications for your compliance needs"
    },
    {
      benefit: "Risk Mitigation",
      description: "Reduce security risks through our certified controls"
    },
    {
      benefit: "Audit Support",
      description: "Access to audit reports and compliance documentation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-yellow-950 to-slate-950 text-white p-8">
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
              { label: "Certifications" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Security Certifications</h1>
              <p className="text-slate-400 text-lg mt-2">
                Industry certifications, compliance audits, and security standards
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
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Commitment to Certification</h2>
                <p className="text-slate-300 leading-relaxed">
                  Daily Event Insurance maintains industry-leading security certifications and
                  undergoes regular third-party audits to ensure the highest standards of data
                  protection, security, and compliance. Our certifications provide independent
                  validation of our security controls and operational practices.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Certifications Grid */}
        <div className="space-y-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{cert.icon}</span>
                    <div>
                      <h3 className="text-2xl font-bold">{cert.name}</h3>
                      <p className="text-slate-400 text-sm">{cert.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      cert.status === "Current"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {cert.status}
                    </span>
                    {cert.reportAvailable && (
                      <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm">
                        <Download className="w-4 h-4" />
                        Request Report
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">Last Renewed</span>
                    </div>
                    <div className="text-lg font-semibold">{cert.renewed}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">Next Audit</span>
                    </div>
                    <div className="text-lg font-semibold">{cert.nextAudit}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">Auditor</span>
                    </div>
                    <div className="text-sm font-semibold">{cert.auditor}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-3">Coverage Areas:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {cert.coverage.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Audit Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Annual Audit Process</h2>

            <div className="grid md:grid-cols-4 gap-4">
              {auditProcess.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                      <span className="text-yellow-400 font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{phase.phase}</h3>
                  </div>

                  <div className="text-sm text-slate-400 mb-3">{phase.duration}</div>

                  <ul className="space-y-2">
                    {phase.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Continuous Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Continuous Compliance Program</h2>
            <p className="text-slate-300 mb-6">
              Beyond annual audits, we maintain continuous compliance through:
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {continuousCompliance.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.3 + index * 0.05 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Partner Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Partner Benefits</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {partnerBenefits.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <h3 className="font-semibold mb-2 text-yellow-400">{item.benefit}</h3>
                  <p className="text-slate-300 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Request Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.8 }}
        >
          <GlassCard className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Request Audit Reports</h2>
            <p className="text-slate-400 mb-4">
              Partners can request copies of our SOC 2 report and other compliance documentation
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="mailto:compliance@dailyeventinsurance.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5" />
                Request SOC 2 Report
              </Link>
              <Link
                href="/support-hub/compliance"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                View Compliance Center
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
          <Link href="/support-hub/compliance">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>View Compliance Center</span>
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
