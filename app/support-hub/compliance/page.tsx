"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, FileText, MapPin, Lock, Globe, CheckCircle, AlertTriangle, Scale } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function CompliancePage() {
  const complianceTopics = [
    {
      icon: Scale,
      title: "Insurance Regulations",
      description: "Federal and state insurance regulations that govern our operations",
      href: "/support-hub/compliance/insurance-regulations",
      color: "text-blue-400"
    },
    {
      icon: MapPin,
      title: "State Requirements",
      description: "State-by-state compliance requirements and variations",
      href: "/support-hub/compliance/state-requirements",
      color: "text-green-400"
    },
    {
      icon: FileText,
      title: "Licensing",
      description: "Licensing requirements and how we handle compliance",
      href: "/support-hub/compliance/licensing",
      color: "text-purple-400"
    },
    {
      icon: Lock,
      title: "Privacy Policy",
      description: "Our commitment to protecting customer data and privacy",
      href: "/support-hub/compliance/privacy",
      color: "text-pink-400"
    },
    {
      icon: Globe,
      title: "Data Protection",
      description: "GDPR, CCPA, and international data protection compliance",
      href: "/support-hub/compliance/data-protection",
      color: "text-cyan-400"
    },
    {
      icon: CheckCircle,
      title: "Audit & Reporting",
      description: "Compliance audits, reporting requirements, and documentation",
      href: "/support-hub/compliance/audit",
      color: "text-yellow-400"
    }
  ];

  const complianceStats = [
    { label: "States Licensed", value: "50+", color: "text-blue-400" },
    { label: "Compliance Rate", value: "100%", color: "text-green-400" },
    { label: "Annual Audits", value: "4+", color: "text-purple-400" },
    { label: "Certifications", value: "6+", color: "text-cyan-400" }
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
              { label: "Compliance" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Compliance Center</h1>
              <p className="text-slate-400 text-lg mt-2">
                Regulatory compliance, licensing, and data protection guidelines
              </p>
            </div>
          </div>
        </motion.div>

        {/* Compliance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {complianceStats.map((stat, index) => (
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

        {/* Alert Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  Compliance is Shared Responsibility
                </h3>
                <p className="text-slate-300">
                  While Daily Event Insurance maintains all required licenses and regulatory compliance,
                  partners are responsible for adhering to their local business regulations and
                  providing accurate information to customers. Review your state-specific requirements
                  and ensure your team is properly trained.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Compliance Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complianceTopics.map((topic, index) => (
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

        {/* Quick Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Compliance Quick Reference</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">
                  Federal Requirements
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>NAIC compliance and reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Federal trade regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>AML and KYC requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Consumer protection laws</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-400">
                  Data Protection
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>GDPR compliance for EU customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>CCPA compliance for California</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>SOC 2 Type II certification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>PCI DSS for payment data</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0 }}
        >
          <GlassCard className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Need Compliance Assistance?
            </h2>
            <p className="text-slate-400 mb-4">
              Our compliance team is here to help with regulatory questions and requirements
            </p>
            <Link
              href="mailto:compliance@dailyeventinsurance.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Contact Compliance Team
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
