"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Scale, FileText, BookOpen, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function InsuranceRegulationsPage() {
  const regulations = [
    {
      category: "Federal Regulations",
      items: [
        {
          name: "McCarran-Ferguson Act",
          description: "Establishes state authority over insurance regulation",
          impact: "State-level compliance is primary focus"
        },
        {
          name: "Gramm-Leach-Bliley Act (GLBA)",
          description: "Financial privacy and data security requirements",
          impact: "Strict customer information protection protocols"
        },
        {
          name: "FCRA (Fair Credit Reporting Act)",
          description: "Governs use of consumer credit information",
          impact: "Limited application for event insurance underwriting"
        },
        {
          name: "AML/KYC Requirements",
          description: "Anti-money laundering and know-your-customer rules",
          impact: "Identity verification for high-value policies"
        }
      ]
    },
    {
      category: "State Regulations",
      items: [
        {
          name: "Producer Licensing",
          description: "State-specific insurance agent licensing requirements",
          impact: "Daily Event Insurance holds all necessary state licenses"
        },
        {
          name: "Rate Filing Requirements",
          description: "Insurance rate approval and filing processes",
          impact: "Rates are filed and approved in all operating states"
        },
        {
          name: "Policy Form Approval",
          description: "State review and approval of insurance policy forms",
          impact: "All policy forms are state-approved before use"
        },
        {
          name: "Market Conduct Rules",
          description: "Standards for insurance sales and marketing practices",
          impact: "Training and compliance monitoring for all partners"
        }
      ]
    },
    {
      category: "NAIC Standards",
      items: [
        {
          name: "Model Insurance Laws",
          description: "NAIC model regulations adopted by states",
          impact: "Framework for multi-state compliance"
        },
        {
          name: "Financial Reporting",
          description: "Standardized financial statement requirements",
          impact: "Quarterly and annual regulatory reporting"
        },
        {
          name: "Consumer Protection",
          description: "NAIC consumer protection standards",
          impact: "Enhanced disclosure and transparency requirements"
        },
        {
          name: "Market Regulation",
          description: "Trade practices and market conduct guidelines",
          impact: "Ongoing compliance monitoring and audits"
        }
      ]
    }
  ];

  const complianceChecklist = [
    "Licensed to sell insurance in all operating states",
    "Policy forms filed and approved by state regulators",
    "Rates reviewed and approved where required",
    "Financial reserves meet regulatory requirements",
    "Producer appointments maintained and current",
    "Consumer complaint procedures established",
    "Regular market conduct examinations",
    "Compliance with advertising regulations",
    "Privacy policy meets GLBA standards",
    "Anti-fraud measures implemented"
  ];

  const partnerResponsibilities = [
    {
      title: "Accurate Representation",
      description: "Represent policy terms and coverage accurately to customers"
    },
    {
      title: "Licensed Operations",
      description: "Operate within the scope of Daily Event Insurance's licenses"
    },
    {
      title: "Disclosure Requirements",
      description: "Provide all required disclosures to customers at point of sale"
    },
    {
      title: "Data Protection",
      description: "Handle customer information according to privacy regulations"
    },
    {
      title: "Complaint Handling",
      description: "Forward customer complaints to Daily Event Insurance promptly"
    },
    {
      title: "Advertising Compliance",
      description: "Use only approved marketing materials and messaging"
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
              { label: "Compliance", href: "/support-hub/compliance" },
              { label: "Insurance Regulations" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Scale className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Insurance Regulations</h1>
              <p className="text-slate-400 text-lg mt-2">
                Federal and state insurance regulations governing our operations
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
              <BookOpen className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Regulatory Overview</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Insurance is one of the most heavily regulated industries in the United States.
                  Daily Event Insurance operates under comprehensive federal and state regulations
                  designed to protect consumers and ensure financial stability.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  The insurance industry is primarily regulated at the state level, with each state
                  maintaining its own Department of Insurance. We maintain licenses and compliance
                  in all states where we operate, ensuring full regulatory compliance.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Regulatory Framework */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold"
          >
            Regulatory Framework
          </motion.h2>

          {regulations.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + sectionIndex * 0.1 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">
                  {section.category}
                </h3>

                <div className="space-y-4">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-lg font-semibold">{item.name}</h4>
                        <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      </div>
                      <p className="text-slate-300 text-sm mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-green-400">{item.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Compliance Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Daily Event Insurance Compliance Status</h2>

            <div className="grid md:grid-cols-2 gap-3">
              {complianceChecklist.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Partner Responsibilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Partner Responsibilities</h2>
            <p className="text-slate-400 mb-6">
              While Daily Event Insurance maintains all regulatory licenses and compliance,
              partners have important responsibilities:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerResponsibilities.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <h3 className="text-lg font-semibold mb-2 text-purple-400">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          <GlassCard className="p-6 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  Regulatory Compliance is Critical
                </h3>
                <p className="text-slate-300 mb-4">
                  Violations of insurance regulations can result in severe penalties including
                  license revocation, fines, and legal action. All partners must operate within
                  the scope of our licenses and follow proper procedures.
                </p>
                <p className="text-slate-300">
                  If you have questions about regulatory requirements or need guidance on
                  compliance matters, contact our compliance team immediately.
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
          transition={{ delay: 1.3 }}
          className="flex flex-wrap gap-4"
        >
          <Link href="/support-hub/compliance/state-requirements">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>Next: State Requirements</span>
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
