"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Eye, Shield, Database, Users, FileText, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function PrivacyPage() {
  const privacyPrinciples = [
    {
      icon: Lock,
      title: "Data Minimization",
      description: "We collect only the information necessary to provide insurance services"
    },
    {
      icon: Shield,
      title: "Purpose Limitation",
      description: "Data is used only for the specific purposes disclosed at collection"
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear communication about what data we collect and how we use it"
    },
    {
      icon: Users,
      title: "User Control",
      description: "Customers have rights to access, correct, and delete their data"
    },
    {
      icon: Database,
      title: "Secure Storage",
      description: "Industry-leading encryption and security measures protect all data"
    },
    {
      icon: FileText,
      title: "Compliance",
      description: "Full compliance with GLBA, CCPA, GDPR, and state privacy laws"
    }
  ];

  const dataTypes = [
    {
      category: "Personal Information",
      items: [
        "Name, email, phone number",
        "Mailing address",
        "Date of birth",
        "Government-issued ID numbers (when required)"
      ],
      usage: "Identity verification and policy issuance",
      retention: "7 years after policy expiration"
    },
    {
      category: "Event Information",
      items: [
        "Event type and description",
        "Event date and location",
        "Venue details",
        "Expected attendance"
      ],
      usage: "Underwriting and risk assessment",
      retention: "7 years after policy expiration"
    },
    {
      category: "Payment Information",
      items: [
        "Credit/debit card details (tokenized)",
        "Bank account information (if applicable)",
        "Billing address",
        "Transaction history"
      ],
      usage: "Payment processing and fraud prevention",
      retention: "7 years for tax/audit purposes"
    },
    {
      category: "Claims Data",
      items: [
        "Incident reports",
        "Supporting documentation",
        "Communication records",
        "Settlement information"
      ],
      usage: "Claims processing and legal compliance",
      retention: "10 years after claim closure"
    }
  ];

  const customerRights = [
    {
      right: "Right to Know",
      description: "Request details about what personal information we collect and how we use it",
      action: "Submit a data access request"
    },
    {
      right: "Right to Delete",
      description: "Request deletion of your personal information (subject to legal retention requirements)",
      action: "Submit a deletion request"
    },
    {
      right: "Right to Correct",
      description: "Request correction of inaccurate personal information",
      action: "Contact customer support"
    },
    {
      right: "Right to Opt-Out",
      description: "Opt out of marketing communications and data sharing (where applicable)",
      action: "Use unsubscribe links or contact us"
    },
    {
      right: "Right to Data Portability",
      description: "Receive a copy of your personal information in a portable format",
      action: "Submit a portability request"
    },
    {
      right: "Right to Non-Discrimination",
      description: "Exercise privacy rights without discrimination in service or pricing",
      action: "Automatically protected"
    }
  ];

  const dataSecurity = [
    {
      measure: "Encryption",
      details: "AES-256 encryption at rest, TLS 1.3 in transit"
    },
    {
      measure: "Access Controls",
      details: "Role-based access, multi-factor authentication required"
    },
    {
      measure: "Regular Audits",
      details: "SOC 2 Type II compliance, annual penetration testing"
    },
    {
      measure: "Employee Training",
      details: "Mandatory privacy and security training for all staff"
    },
    {
      measure: "Vendor Management",
      details: "Third-party vendors undergo security assessments"
    },
    {
      measure: "Incident Response",
      details: "24/7 monitoring and documented incident response plan"
    }
  ];

  const partnerGuidelines = [
    "Only collect customer data necessary for insurance transactions",
    "Use secure, encrypted channels for transmitting customer information",
    "Never share customer data with unauthorized third parties",
    "Implement appropriate access controls for customer data",
    "Report any suspected data breaches immediately",
    "Follow approved data retention and deletion policies",
    "Provide required privacy notices at point of sale",
    "Honor customer privacy rights requests promptly"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-pink-950 to-slate-950 text-white p-8">
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
              { label: "Privacy" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-pink-500/20 border border-pink-500/30">
              <Lock className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-slate-400 text-lg mt-2">
                Our commitment to protecting customer data and privacy
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
            <h2 className="text-2xl font-bold mb-4">Privacy Commitment</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Daily Event Insurance is committed to protecting the privacy and security of customer
              information. We adhere to the highest standards of data protection, including full
              compliance with the Gramm-Leach-Bliley Act (GLBA), California Consumer Privacy Act
              (CCPA), and other applicable privacy regulations.
            </p>
            <p className="text-slate-300 leading-relaxed">
              This privacy policy applies to all customer data collected through our platform,
              partner integrations, and direct customer interactions. We are transparent about our
              data practices and provide customers with meaningful control over their information.
            </p>
          </GlassCard>
        </motion.div>

        {/* Privacy Principles */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold"
          >
            Core Privacy Principles
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privacyPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="p-3 rounded-lg bg-pink-500/20 w-fit mb-4">
                    <principle.icon className="w-6 h-6 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{principle.title}</h3>
                  <p className="text-slate-400 text-sm">{principle.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data We Collect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Data We Collect</h2>

            <div className="space-y-6">
              {dataTypes.map((dataType, index) => (
                <motion.div
                  key={dataType.category}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <h3 className="text-lg font-semibold mb-3 text-pink-400">
                    {dataType.category}
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Data Collected:</h4>
                      <ul className="space-y-1">
                        {dataType.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-pink-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Usage:</h4>
                      <p className="text-sm text-slate-300">{dataType.usage}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Retention:</h4>
                      <p className="text-sm text-slate-300">{dataType.retention}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Customer Rights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Privacy Rights</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {customerRights.map((item, index) => (
                <motion.div
                  key={item.right}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <h3 className="text-lg font-semibold">{item.right}</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-2 ml-8">{item.description}</p>
                  <div className="ml-8 text-sm text-pink-400">
                    <ArrowRight className="w-4 h-4 inline mr-1" />
                    {item.action}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <p className="text-slate-300 text-sm">
                <strong className="text-blue-400">How to Exercise Your Rights:</strong> Email{" "}
                <a href="mailto:privacy@dailyeventinsurance.com" className="text-blue-400 hover:underline">
                  privacy@dailyeventinsurance.com
                </a>{" "}
                or use our privacy request form. We will respond within 30 days of receiving your request.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Data Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Data Security Measures</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSecurity.map((item, index) => (
                <motion.div
                  key={item.measure}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <h3 className="font-semibold mb-2 text-pink-400">{item.measure}</h3>
                  <p className="text-slate-300 text-sm">{item.details}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Partner Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
        >
          <GlassCard className="p-6 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-start gap-4 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Partner Privacy Guidelines</h2>
                <p className="text-slate-300 mb-4">
                  Partners must follow these privacy guidelines when handling customer data:
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {partnerGuidelines.map((guideline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6 + index * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{guideline}</span>
                </motion.div>
              ))}
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
            <h2 className="text-xl font-semibold mb-2">Privacy Questions?</h2>
            <p className="text-slate-400 mb-4">
              Contact our privacy team for questions about data handling and customer rights
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="mailto:privacy@dailyeventinsurance.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
              >
                Email Privacy Team
              </Link>
              <Link
                href="/support-hub/compliance/data-protection"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                View Data Protection Guide
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
          <Link href="/support-hub/compliance/data-protection">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>Next: Data Protection</span>
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
