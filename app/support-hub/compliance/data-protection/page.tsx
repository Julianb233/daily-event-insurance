"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Shield, Lock, CheckCircle, FileText, AlertCircle, ArrowRight, Database } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function DataProtectionPage() {
  const regulations = [
    {
      name: "GDPR",
      fullName: "General Data Protection Regulation",
      region: "European Union",
      icon: "🇪🇺",
      status: "Compliant",
      keyRequirements: [
        "Lawful basis for processing personal data",
        "Data subject rights (access, deletion, portability)",
        "Data protection impact assessments",
        "Privacy by design and default",
        "Mandatory breach notification (72 hours)",
        "Appointment of Data Protection Officer"
      ]
    },
    {
      name: "CCPA",
      fullName: "California Consumer Privacy Act",
      region: "California, USA",
      icon: "🇺🇸",
      status: "Compliant",
      keyRequirements: [
        "Right to know what data is collected",
        "Right to delete personal information",
        "Right to opt-out of data sale",
        "Right to non-discrimination",
        "Enhanced privacy notices",
        "Annual privacy audits"
      ]
    },
    {
      name: "CPRA",
      fullName: "California Privacy Rights Act",
      region: "California, USA",
      icon: "🇺🇸",
      status: "Compliant",
      keyRequirements: [
        "Sensitive personal information protections",
        "Right to correct inaccurate data",
        "Risk assessment requirements",
        "Contractor/service provider obligations",
        "Automated decision-making disclosures",
        "California Privacy Protection Agency oversight"
      ]
    },
    {
      name: "PIPEDA",
      fullName: "Personal Information Protection Act",
      region: "Canada",
      icon: "🇨🇦",
      status: "Compliant",
      keyRequirements: [
        "Consent for collection and use",
        "Limiting collection to necessary data",
        "Accuracy of personal information",
        "Safeguards for data security",
        "Openness about policies",
        "Individual access rights"
      ]
    }
  ];

  const gdprCompliance = [
    {
      principle: "Lawfulness, Fairness, Transparency",
      implementation: "Clear privacy notices, lawful basis documented, transparent processing"
    },
    {
      principle: "Purpose Limitation",
      implementation: "Data used only for stated purposes, no secondary uses without consent"
    },
    {
      principle: "Data Minimization",
      implementation: "Collect only necessary data, regular reviews of data needs"
    },
    {
      principle: "Accuracy",
      implementation: "Processes to correct inaccurate data, customer self-service options"
    },
    {
      principle: "Storage Limitation",
      implementation: "Defined retention periods, automated deletion processes"
    },
    {
      principle: "Integrity and Confidentiality",
      implementation: "Encryption, access controls, security monitoring"
    },
    {
      principle: "Accountability",
      implementation: "DPO appointed, DPIA processes, compliance documentation"
    }
  ];

  const dataTransfers = [
    {
      mechanism: "Standard Contractual Clauses",
      description: "EU Commission approved contracts for international transfers",
      applicability: "All EU to non-EU transfers"
    },
    {
      mechanism: "Adequacy Decisions",
      description: "Transfers to countries with adequate data protection",
      applicability: "Canada, UK, Japan (limited)"
    },
    {
      mechanism: "Binding Corporate Rules",
      description: "Internal data transfer policies for multinational organizations",
      applicability: "Intra-group transfers"
    },
    {
      mechanism: "Explicit Consent",
      description: "Customer consent for specific international transfers",
      applicability: "Individual transactions"
    }
  ];

  const breachResponse = [
    {
      phase: "Detection (0-4 hours)",
      actions: [
        "Identify and contain the breach",
        "Assess scope and data involved",
        "Activate incident response team",
        "Document initial findings"
      ]
    },
    {
      phase: "Assessment (4-24 hours)",
      actions: [
        "Determine number of affected individuals",
        "Evaluate risk level to data subjects",
        "Identify root cause",
        "Begin remediation"
      ]
    },
    {
      phase: "Notification (24-72 hours)",
      actions: [
        "Notify supervisory authority (GDPR: 72 hours)",
        "Notify affected individuals if high risk",
        "Coordinate with law enforcement if needed",
        "Update stakeholders"
      ]
    },
    {
      phase: "Remediation (Ongoing)",
      actions: [
        "Implement security improvements",
        "Provide support to affected individuals",
        "Conduct post-incident review",
        "Update policies and procedures"
      ]
    }
  ];

  const partnerObligations = [
    "Act as data processor under our instructions",
    "Implement appropriate security measures",
    "Assist with data subject rights requests",
    "Notify us of any data breaches within 24 hours",
    "Only process data for specified purposes",
    "Maintain records of processing activities",
    "Cooperate with regulatory investigations",
    "Delete or return data upon contract termination"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 text-white p-8">
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
              { label: "Compliance", href: "/support-hub/compliance" },
              { label: "Data Protection" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <Globe className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Data Protection</h1>
              <p className="text-slate-400 text-lg mt-2">
                GDPR, CCPA, and international data protection compliance
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
              <Database className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Global Data Protection Framework</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Daily Event Insurance maintains comprehensive compliance with global data
                  protection regulations including GDPR (EU), CCPA/CPRA (California), PIPEDA
                  (Canada), and other international privacy laws.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Our data protection framework ensures that customer information is handled with
                  the highest standards of security and privacy, regardless of where the customer
                  is located or where the data is processed.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Regulatory Compliance */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold"
          >
            Regulatory Compliance
          </motion.h2>

          {regulations.map((reg, index) => (
            <motion.div
              key={reg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{reg.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold">{reg.name}</h3>
                      <p className="text-slate-400 text-sm">{reg.fullName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                      {reg.status}
                    </span>
                    <span className="text-slate-400 text-sm">{reg.region}</span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-cyan-400 mb-3">Key Requirements:</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {reg.keyRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* GDPR Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">GDPR Core Principles & Implementation</h2>

            <div className="space-y-3">
              {gdprCompliance.map((item, index) => (
                <motion.div
                  key={item.principle}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-cyan-400 mb-1">{item.principle}</h3>
                      <p className="text-slate-300 text-sm">{item.implementation}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* International Data Transfers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">International Data Transfer Mechanisms</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {dataTransfers.map((transfer, index) => (
                <motion.div
                  key={transfer.mechanism}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <h3 className="text-lg font-semibold">{transfer.mechanism}</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{transfer.description}</p>
                  <div className="text-xs text-slate-400 mt-2">
                    <strong>Applies to:</strong> {transfer.applicability}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Breach Response */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Data Breach Response Protocol</h2>

            <div className="space-y-4">
              {breachResponse.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <h3 className="text-lg font-semibold mb-3 text-cyan-400">{phase.phase}</h3>
                  <ul className="space-y-2">
                    {phase.actions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <ArrowRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300 text-sm">
                    <strong className="text-red-400">Partners must report any suspected data breaches immediately.</strong>{" "}
                    Contact our security team at{" "}
                    <a href="mailto:security@dailyeventinsurance.com" className="text-red-400 hover:underline">
                      security@dailyeventinsurance.com
                    </a>{" "}
                    or call our 24/7 security hotline at 1-800-SECURE-1.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Partner Obligations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6 }}
        >
          <GlassCard className="p-6 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-start gap-4 mb-4">
              <FileText className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Partner Data Protection Obligations</h2>
                <p className="text-slate-300 mb-4">
                  As a data processor, partners have specific obligations under data protection laws:
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {partnerObligations.map((obligation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.7 + index * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{obligation}</span>
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
          transition={{ delay: 1.9 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Certifications & Audits</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold mb-1">SOC 2 Type II</h3>
                <p className="text-slate-400 text-sm">Annual audit</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="text-3xl mb-2">🇪🇺</div>
                <h3 className="font-semibold mb-1">GDPR Compliant</h3>
                <p className="text-slate-400 text-sm">DPO appointed</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-semibold mb-1">ISO 27001</h3>
                <p className="text-slate-400 text-sm">In progress</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 2.0 }}
        >
          <GlassCard className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Data Protection Questions?</h2>
            <p className="text-slate-400 mb-4">
              Contact our Data Protection Officer for compliance questions
            </p>
            <Link
              href="mailto:dpo@dailyeventinsurance.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
            >
              Email Data Protection Officer
            </Link>
          </GlassCard>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 2.1 }}
          className="flex flex-wrap gap-4"
        >
          <Link href="/support-hub/security">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>Next: Security Center</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </GlassCard>
          </Link>

          <Link href="/support-hub/compliance">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>Back to Compliance Center</span>
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
