"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, CheckCircle, Shield, Users, Building, ArrowRight, Award } from "lucide-react";
import { GlassCard } from "@/components/support-hub/GlassCard";
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs";

export default function LicensingPage() {
  const licenseTypes = [
    {
      type: "Producer Licenses",
      icon: Users,
      description: "Individual insurance agent licenses",
      coverage: "All 50 states + DC",
      renewal: "Varies by state (1-2 years)",
      requirements: [
        "Pre-licensing education",
        "State examination",
        "Background check",
        "Continuing education"
      ]
    },
    {
      type: "Business Entity License",
      icon: Building,
      description: "Corporate insurance entity registration",
      coverage: "All operating states",
      renewal: "Annual renewal",
      requirements: [
        "Designated responsible producer",
        "Proof of financial responsibility",
        "Business entity registration",
        "Errors & omissions insurance"
      ]
    },
    {
      type: "Surplus Lines License",
      icon: Shield,
      description: "Non-admitted insurance authority (if needed)",
      coverage: "Select states",
      renewal: "Annual or biennial",
      requirements: [
        "Admitted license prerequisite",
        "Additional examination",
        "Surplus lines eligibility",
        "Special tax reporting"
      ]
    }
  ];

  const complianceSteps = [
    {
      step: 1,
      title: "Initial Licensing",
      description: "Complete pre-licensing education and pass state exams",
      timeline: "4-8 weeks per state"
    },
    {
      step: 2,
      title: "Background Checks",
      description: "Submit to FBI fingerprinting and background verification",
      timeline: "2-4 weeks"
    },
    {
      step: 3,
      title: "Appointment",
      description: "Carrier appoints agent to sell insurance products",
      timeline: "1-2 weeks"
    },
    {
      step: 4,
      title: "Continuing Education",
      description: "Complete required CE credits for license renewal",
      timeline: "Ongoing (annual/biennial)"
    },
    {
      step: 5,
      title: "Renewal",
      description: "Renew licenses before expiration dates",
      timeline: "Every 1-2 years"
    }
  ];

  const partnerBenefits = [
    {
      title: "No Individual License Needed",
      description: "Partners operate under Daily Event Insurance's licenses",
      icon: CheckCircle
    },
    {
      title: "Multi-State Coverage",
      description: "Sell in all 50 states without separate state licenses",
      icon: CheckCircle
    },
    {
      title: "Compliance Support",
      description: "We handle all regulatory filings and compliance",
      icon: CheckCircle
    },
    {
      title: "Training Provided",
      description: "Product training ensures proper representation",
      icon: CheckCircle
    }
  ];

  const responsibilities = [
    {
      category: "Daily Event Insurance",
      items: [
        "Maintain all producer and entity licenses",
        "Handle license renewals and continuing education",
        "Ensure compliance with all state regulations",
        "File required reports with state regulators",
        "Pay licensing fees and taxes",
        "Manage carrier appointments"
      ]
    },
    {
      category: "Partner Responsibilities",
      items: [
        "Operate within scope of our licenses",
        "Complete required product training",
        "Follow approved sales processes",
        "Maintain accurate customer records",
        "Report any compliance issues promptly",
        "Use only approved marketing materials"
      ]
    }
  ];

  const stateHighlights = [
    { state: "California", requirement: "Enhanced disclosure and CE requirements" },
    { state: "New York", requirement: "Strict licensing and ongoing education" },
    { state: "Texas", requirement: "Separate entity and individual licenses" },
    { state: "Florida", requirement: "Hurricane-related training required" }
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
              { label: "Compliance", href: "/support-hub/compliance" },
              { label: "Licensing" }
            ]}
          />

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Licensing Requirements</h1>
              <p className="text-slate-400 text-lg mt-2">
                How Daily Event Insurance handles licensing and compliance
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
              <Award className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Licensing Approach</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Daily Event Insurance maintains comprehensive insurance licenses in all 50 states
                  plus the District of Columbia. Our licensing infrastructure allows partners to
                  sell insurance nationwide without obtaining individual licenses.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  We handle all regulatory compliance, license renewals, continuing education, and
                  carrier appointments. This allows partners to focus on serving customers while we
                  manage the complex regulatory requirements.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* License Types */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold"
          >
            License Types We Maintain
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {licenseTypes.map((license, index) => (
              <motion.div
                key={license.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="p-3 rounded-lg bg-purple-500/20 w-fit mb-4">
                    <license.icon className="w-6 h-6 text-purple-400" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{license.type}</h3>
                  <p className="text-slate-400 text-sm mb-4">{license.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Coverage:</span>
                      <span className="text-green-400 font-semibold">{license.coverage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Renewal:</span>
                      <span className="text-slate-300">{license.renewal}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50">
                    <h4 className="text-sm font-semibold mb-2 text-purple-400">Requirements:</h4>
                    <ul className="space-y-1">
                      {license.requirements.map((req, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Compliance Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Licensing Compliance Process</h2>

            <div className="space-y-4">
              {complianceSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <span className="text-purple-400 font-bold">{step.step}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <span className="text-sm text-slate-400 whitespace-nowrap">
                        {step.timeline}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">{step.description}</p>
                  </div>
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
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Partner Benefits</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {partnerBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30"
                >
                  <benefit.icon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-slate-300 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Responsibilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Shared Responsibilities</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {responsibilities.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-4 text-purple-400">
                    {section.category}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* State Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">State-Specific Highlights</h2>
            <p className="text-slate-400 mb-4">
              Some states have unique licensing requirements we manage:
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {stateHighlights.map((item, index) => (
                <motion.div
                  key={item.state}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="font-semibold text-purple-400 min-w-[100px]">
                    {item.state}
                  </div>
                  <div className="text-sm text-slate-300">
                    {item.requirement}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.7 }}
        >
          <GlassCard className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Questions About Licensing?
            </h2>
            <p className="text-slate-400 mb-4">
              Our compliance team can provide detailed information about our licensing coverage
            </p>
            <Link
              href="mailto:compliance@dailyeventinsurance.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
            >
              Contact Licensing Team
            </Link>
          </GlassCard>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.8 }}
          className="flex flex-wrap gap-4"
        >
          <Link href="/support-hub/compliance/privacy">
            <GlassCard className="p-4 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span>Next: Privacy Policy</span>
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
