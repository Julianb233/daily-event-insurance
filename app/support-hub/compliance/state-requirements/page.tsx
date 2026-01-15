"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, CheckCircle, AlertTriangle, FileText, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function StateRequirementsPage() {
  const stateCategories = [
    {
      category: "Highly Regulated States",
      states: ["California", "New York", "Florida", "Texas", "Massachusetts"],
      color: "text-red-400",
      requirements: [
        "Enhanced disclosure requirements",
        "Stricter rate filing standards",
        "Additional consumer protections",
        "Higher financial reserves"
      ]
    },
    {
      category: "Moderate Regulation States",
      states: ["Illinois", "Pennsylvania", "Ohio", "Georgia", "Washington"],
      color: "text-yellow-400",
      requirements: [
        "Standard rate and form filing",
        "Regular market conduct exams",
        "Consumer complaint procedures",
        "Standard financial requirements"
      ]
    },
    {
      category: "Flexible Regulation States",
      states: ["Wyoming", "Montana", "Idaho", "Nevada", "Arizona"],
      color: "text-green-400",
      requirements: [
        "File and use rate approval",
        "Simplified form approval",
        "Standard licensing requirements",
        "Basic financial standards"
      ]
    }
  ];

  const commonRequirements = [
    {
      requirement: "Producer Licensing",
      description: "Insurance agent licenses required to sell policies",
      applies: "All states",
      status: "Compliant"
    },
    {
      requirement: "Rate Filing",
      description: "Insurance rates must be filed with state regulator",
      applies: "45+ states",
      status: "Compliant"
    },
    {
      requirement: "Policy Form Approval",
      description: "Insurance policy forms must be approved before use",
      applies: "All states",
      status: "Compliant"
    },
    {
      requirement: "Financial Reporting",
      description: "Quarterly and annual financial statements required",
      applies: "All states",
      status: "Compliant"
    },
    {
      requirement: "Surplus Lines",
      description: "Special rules for non-admitted insurance",
      applies: "Varies by state",
      status: "N/A - Admitted"
    },
    {
      requirement: "Advertising Rules",
      description: "Marketing and advertising must follow state guidelines",
      applies: "All states",
      status: "Compliant"
    }
  ];

  const specialCases = [
    {
      state: "California",
      icon: "🌴",
      requirements: [
        "Proposition 103 rate approval process",
        "Enhanced consumer privacy (CCPA)",
        "Spanish language disclosure requirements",
        "Earthquake insurance considerations"
      ]
    },
    {
      state: "New York",
      icon: "🗽",
      requirements: [
        "Department of Financial Services oversight",
        "Strict rate approval process",
        "Enhanced cybersecurity requirements",
        "Special event venue regulations"
      ]
    },
    {
      state: "Florida",
      icon: "🌊",
      requirements: [
        "Hurricane and weather event provisions",
        "Citizens Property Insurance considerations",
        "Special event cancellation rules",
        "Venue liability requirements"
      ]
    },
    {
      state: "Texas",
      icon: "⭐",
      requirements: [
        "Texas Department of Insurance oversight",
        "Separate surplus lines regulations",
        "Venue certificate requirements",
        "Special event permit coordination"
      ]
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
              { label: "State Requirements" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
              <MapPin className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">State Requirements</h1>
              <p className="text-slate-400 text-lg mt-2">
                State-by-state compliance requirements and variations
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
            <h2 className="text-2xl font-bold mb-4">Multi-State Compliance</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Daily Event Insurance maintains licenses and regulatory compliance in all 50 states
              plus the District of Columbia. Each state has unique requirements, and we ensure
              full compliance with all state-specific regulations.
            </p>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-300">
                <strong className="text-blue-400">Important:</strong> Partners can operate in
                any state where Daily Event Insurance is licensed. You do not need separate
                licenses, but you must follow state-specific requirements for your location.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* State Categories */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold"
          >
            State Regulatory Categories
          </motion.h2>

          {stateCategories.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <GlassCard className="p-6">
                <h3 className={`text-xl font-semibold mb-4 ${category.color}`}>
                  {category.category}
                </h3>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {category.states.map((state) => (
                      <span
                        key={state}
                        className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm"
                      >
                        {state}
                      </span>
                    ))}
                    <span className="px-3 py-1 rounded-full bg-slate-800/30 text-slate-400 text-sm">
                      +{index === 0 ? 5 : index === 1 ? 15 : 25} more
                    </span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {category.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <ArrowRight className={`w-4 h-4 ${category.color} flex-shrink-0 mt-1`} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Common Requirements Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Common State Requirements</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-blue-400">Requirement</th>
                    <th className="text-left py-3 px-4 text-blue-400">Description</th>
                    <th className="text-left py-3 px-4 text-blue-400">Applies To</th>
                    <th className="text-left py-3 px-4 text-blue-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {commonRequirements.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="border-b border-slate-800/50"
                    >
                      <td className="py-3 px-4 font-semibold">{item.requirement}</td>
                      <td className="py-3 px-4 text-slate-300 text-sm">{item.description}</td>
                      <td className="py-3 px-4 text-slate-400 text-sm">{item.applies}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          item.status === "Compliant"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-slate-700/50 text-slate-400"
                        }`}>
                          {item.status === "Compliant" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {item.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Special State Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Special State Considerations</h2>
            <p className="text-slate-400 mb-6">
              Some states have unique requirements that partners should be aware of:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {specialCases.map((item, index) => (
                <motion.div
                  key={item.state}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-xl font-semibold">{item.state}</h3>
                  </div>

                  <ul className="space-y-2">
                    {item.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <FileText className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Partner Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          <GlassCard className="p-6 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  Know Your State Requirements
                </h3>
                <p className="text-slate-300 mb-4">
                  While Daily Event Insurance handles all licensing and regulatory filings,
                  partners operating in highly regulated states should be aware of:
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                    <span>Additional disclosure requirements at point of sale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                    <span>Language requirements for customer communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                    <span>State-specific advertising and marketing rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                    <span>Local business license or permit requirements</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Get Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
        >
          <GlassCard className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Questions About Your State?
            </h2>
            <p className="text-slate-400 mb-4">
              Contact our compliance team for state-specific guidance and requirements
            </p>
            <Link
              href="mailto:compliance@dailyeventinsurance.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Contact State Compliance Team
            </Link>
          </GlassCard>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 }}
          className="flex flex-wrap gap-4"
        >
          <Link href="/support-hub/compliance/licensing">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>Next: Licensing Requirements</span>
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
