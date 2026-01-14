"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FileText,
  GraduationCap,
  DollarSign,
  Map,
  Shield,
  Users,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
  Zap,
  CheckCircle2,
  Building2
} from "lucide-react";

const researchModules = [
  {
    title: "Executive Summary",
    description: "Strategic overview with investment requirements, ROI projections, and implementation roadmap for the 50-state initiative.",
    href: "/insurance-broker-research/executive-summary",
    icon: FileText,
    stats: { label: "ROI Projection", value: "624%+" },
    badge: "Start Here",
    color: "teal",
  },
  {
    title: "BOR Requirements",
    description: "Complete licensing guide including education, examinations, and state-by-state variations for Broker of Record status.",
    href: "/insurance-broker-research/bor-requirements",
    icon: GraduationCap,
    stats: { label: "License Types", value: "3" },
    color: "sky",
  },
  {
    title: "50-State Licensing Costs",
    description: "Comprehensive cost analysis across all states with fees, education expenses, and multi-state optimization strategies.",
    href: "/insurance-broker-research/licensing-costs",
    icon: DollarSign,
    stats: { label: "Total Range", value: "$20K-$55K" },
    color: "emerald",
  },
  {
    title: "West Coast Strategy",
    description: "Strategic playbook for California, Oregon, Washington, Nevada, and Arizona market expansion.",
    href: "/insurance-broker-research/west-coast-strategy",
    icon: Map,
    stats: { label: "Target Market", value: "$48B+" },
    badge: "Regional Focus",
    color: "violet",
  },
  {
    title: "Compliance Guide",
    description: "Federal requirements, state regulations, NAIC standards, and comprehensive record-keeping requirements.",
    href: "/insurance-broker-research/compliance",
    icon: Shield,
    stats: { label: "Regulations", value: "4 Levels" },
    color: "amber",
  },
  {
    title: "Partnership Opportunity",
    description: "Partner with Daily Event Insurance and HiQor as your Broker of Record. Skip licensing and launch in 30 days.",
    href: "/insurance-broker-research/partnership",
    icon: Users,
    stats: { label: "Time to Market", value: "30 Days" },
    badge: "Fast Track",
    highlight: true,
    color: "teal",
  },
];

const keyMetrics = [
  { icon: DollarSign, label: "Total Investment", value: "$75K-$150K", description: "Full 50-state coverage" },
  { icon: Target, label: "West Coast Entry", value: "$45K", description: "CA + NV initial markets" },
  { icon: TrendingUp, label: "Year 3 Revenue", value: "$7.2M", description: "Projected GCI" },
  { icon: Clock, label: "Breakeven", value: "14-18 mo", description: "Time to profitability" },
];

const phases = [
  { phase: "Phase 1", markets: "California + Nevada", investment: "$45,000", timeline: "Months 1-12" },
  { phase: "Phase 2", markets: "Arizona", investment: "$15,000", timeline: "Months 13-18" },
  { phase: "Phase 3", markets: "Oregon + Washington", investment: "$20,000", timeline: "Months 19-24" },
  { phase: "Phase 4", markets: "National Expansion", investment: "$70,000", timeline: "Months 25-36+" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

function ModuleCard({ module, index }: { module: typeof researchModules[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses: Record<string, { bg: string; bgLight: string; border: string; text: string; glow: string }> = {
    teal: {
      bg: 'bg-teal-500',
      bgLight: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-600',
      glow: 'from-teal-500/30 via-teal-400/40 to-teal-500/30',
    },
    sky: {
      bg: 'bg-sky-500',
      bgLight: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-600',
      glow: 'from-sky-500/30 via-sky-400/40 to-sky-500/30',
    },
    emerald: {
      bg: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-600',
      glow: 'from-emerald-500/30 via-emerald-400/40 to-emerald-500/30',
    },
    violet: {
      bg: 'bg-violet-500',
      bgLight: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-600',
      glow: 'from-violet-500/30 via-violet-400/40 to-violet-500/30',
    },
    amber: {
      bg: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-600',
      glow: 'from-amber-500/30 via-amber-400/40 to-amber-500/30',
    },
  };

  const colors = colorClasses[module.color] || colorClasses.teal;

  return (
    <motion.div
      variants={cardVariants}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={module.href}>
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="relative h-full"
        >
          {/* Glow effect on hover */}
          <motion.div
            className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-r ${colors.glow} blur-xl`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Card */}
          <div className={`relative h-full bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 transition-all duration-500 overflow-hidden ${
            module.highlight
              ? 'border-teal-400 ring-2 ring-teal-500/20'
              : `${colors.border} hover:border-teal-400`
          }`}>
            {/* Badge */}
            {module.badge && (
              <div className="absolute -top-0 right-4">
                <motion.span
                  className={`px-4 py-1.5 text-xs font-bold rounded-b-xl shadow-lg ${
                    module.highlight
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                      : 'bg-slate-900 text-white'
                  }`}
                  animate={{ y: isHovered ? 2 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {module.badge}
                </motion.span>
              </div>
            )}

            {/* Icon */}
            <motion.div
              className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0
              }}
              transition={{ duration: 0.4 }}
            >
              <module.icon className="w-8 h-8 text-white" strokeWidth={2} />
            </motion.div>

            {/* Content */}
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
              {module.title}
            </h3>
            <p className="text-slate-600 mb-5 leading-relaxed">
              {module.description}
            </p>

            {/* Stats */}
            {module.stats && (
              <div className={`flex items-center justify-between pt-5 border-t ${colors.border}`}>
                <span className="text-sm text-slate-500 font-medium">{module.stats.label}</span>
                <span className={`text-lg font-bold ${colors.text}`}>{module.stats.value}</span>
              </div>
            )}

            {/* Hover Arrow */}
            <motion.div
              className="absolute bottom-6 right-6"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className={`w-6 h-6 ${colors.text}`} />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function InsuranceBrokerResearchPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-20 md:py-28 overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "radial-gradient(ellipse at 30% 20%, rgba(20,184,166,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(13,148,136,0.08) 0%, transparent 50%), linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)",
              "radial-gradient(ellipse at 70% 30%, rgba(20,184,166,0.12) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(13,148,136,0.08) 0%, transparent 50%), linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)",
              "radial-gradient(ellipse at 30% 20%, rgba(20,184,166,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(13,148,136,0.08) 0%, transparent 50%), linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 z-[1] opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(20,184,166,0.15) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-teal-200 shadow-lg shadow-teal-500/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
              <span className="text-teal-700 font-semibold text-sm">HiQor Research Portal</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 text-center mb-6"
            style={{
              textShadow: "0 0 80px rgba(20,184,166,0.3)",
            }}
          >
            Insurance Broker{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-teal-600 to-teal-500">
              Research Portal
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-600 text-center max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Comprehensive research for establishing a multi-state Insurance Broker of Record operation
            with strategic West Coast market expansion.
          </motion.p>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto"
          >
            {keyMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-slate-200 shadow-xl shadow-teal-500/5 text-center hover:border-teal-300 transition-colors">
                  <metric.icon className="w-6 h-6 text-teal-500 mx-auto mb-2" />
                  <p className="text-2xl md:text-3xl font-black text-teal-600 mb-1">{metric.value}</p>
                  <p className="text-sm font-bold text-slate-900">{metric.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{metric.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />
      </section>

      {/* Research Modules */}
      <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(to right, #14B8A6 1px, transparent 1px), linear-gradient(to bottom, #14B8A6 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-teal-200 shadow-lg mb-6"
            >
              <Zap className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-semibold text-teal-700">Research Modules</span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
              Navigate the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
                Complete Guide
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Every aspect of becoming a licensed insurance broker, from requirements to strategy.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {researchModules.map((module, index) => (
              <ModuleCard key={module.title} module={module} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Strategic Overview */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6">
                <Target className="w-4 h-4 text-teal-600" />
                <span className="text-teal-700 font-semibold text-sm">Strategic Recommendation</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                Phased West Coast{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
                  Expansion
                </span>
              </h2>

              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Our research recommends a strategic phased approach starting with California as the anchor market.
                This minimizes risk while maximizing market penetration and revenue potential.
              </p>

              <div className="space-y-4">
                {phases.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white font-bold text-lg">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-slate-900">{item.phase}: {item.markets}</p>
                        <p className="text-teal-600 font-bold">{item.investment}</p>
                      </div>
                      <p className="text-sm text-slate-500">{item.timeline}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Market Opportunity Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-600/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-8">Market Opportunity</h3>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {[
                      { value: "$48B+", label: "West Coast Market" },
                      { value: "65-70%", label: "Broker Share" },
                      { value: "5-7%", label: "Annual Growth" },
                      { value: "$7.2M", label: "Year 3 Target" },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
                      >
                        <p className="text-2xl md:text-3xl font-black text-teal-400">{stat.value}</p>
                        <p className="text-sm text-slate-300">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      "California: Largest state market nationally",
                      "Digital transformation disrupting distribution",
                      "Remote work enables cost-effective operations",
                      "Regulatory complexity favors organization",
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Link
                    href="/insurance-broker-research/executive-summary"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-full transition-colors shadow-lg shadow-teal-500/30"
                  >
                    Read Full Executive Summary
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)",
              "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #14b8a6 100%)",
              "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-10 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-8"
          >
            <Building2 className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">Partnership Opportunity</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6"
          >
            Skip the Licensing.<br />
            <span className="text-teal-200">Partner with HiQor.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-teal-100 mb-10 max-w-3xl mx-auto"
          >
            Get to market in 30 days instead of 18+ months. Let Daily Event Insurance and HiQor be your Broker of Record.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/insurance-broker-research/partnership"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              Explore Partnership
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/#apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors"
            >
              Apply Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500">
            <strong>Disclaimer:</strong> This research portal is for informational purposes only and does not constitute legal, financial, or regulatory advice.
            Consult with qualified professionals for advice specific to your business operations.
          </p>
        </div>
      </section>
    </div>
  );
}
