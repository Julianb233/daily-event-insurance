"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Shield,
  Clock,
  TrendingUp,
  Users,
  Code,
  Rocket,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Zap,
  Building2,
  Calendar,
  FileCheck,
  Sparkles,
  Globe,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";

// Note: metadata must be defined in a separate layout.tsx or a server component wrapper
// See: https://nextjs.org/docs/app/api-reference/functions/generate-metadata

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
      ease: "easeOut",
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const benefitIcons = {
  shield: Shield,
  clock: Clock,
  chart: TrendingUp,
  support: Users,
  tech: Code,
  growth: Rocket,
};

const partnershipBenefits = [
  {
    icon: "shield" as const,
    title: "Licensed in All 50 States",
    description: "Access to a fully licensed multi-state insurance operation without the $150K+ investment and 18-36 month licensing timeline.",
    color: "teal",
  },
  {
    icon: "clock" as const,
    title: "Immediate Market Access",
    description: "Start offering insurance products to your customers immediately. No waiting for license approvals or carrier appointments.",
    color: "sky",
  },
  {
    icon: "chart" as const,
    title: "Revenue Share Model",
    description: "Competitive commission splits on all referred business. Recurring revenue on renewals without operational overhead.",
    color: "emerald",
  },
  {
    icon: "support" as const,
    title: "Full Service Support",
    description: "We handle policy placement, claims support, compliance, and renewals. You focus on your core business.",
    color: "violet",
  },
  {
    icon: "tech" as const,
    title: "White-Label Technology",
    description: "Branded quote and bind platform integrated into your existing customer experience. API access available.",
    color: "amber",
  },
  {
    icon: "growth" as const,
    title: "Scalable Growth",
    description: "No volume minimums to start. Commission rates improve as your portfolio grows. Enterprise solutions available.",
    color: "rose",
  },
];

const colorClasses = {
  teal: {
    bg: "bg-teal-500",
    light: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-600",
    glow: "from-teal-500/40 to-teal-600/40",
  },
  sky: {
    bg: "bg-sky-500",
    light: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-600",
    glow: "from-sky-500/40 to-sky-600/40",
  },
  emerald: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    glow: "from-emerald-500/40 to-emerald-600/40",
  },
  violet: {
    bg: "bg-violet-500",
    light: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-600",
    glow: "from-violet-500/40 to-violet-600/40",
  },
  amber: {
    bg: "bg-amber-500",
    light: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    glow: "from-amber-500/40 to-amber-600/40",
  },
  rose: {
    bg: "bg-rose-500",
    light: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-600",
    glow: "from-rose-500/40 to-rose-600/40",
  },
};

interface BenefitCardProps {
  benefit: typeof partnershipBenefits[0];
  index: number;
}

function BenefitCard({ benefit, index }: BenefitCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = benefitIcons[benefit.icon];
  const colors = colorClasses[benefit.color as keyof typeof colorClasses];

  return (
    <motion.div
      variants={cardVariants}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-r ${colors.glow} blur-xl`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className={`relative ${colors.light} rounded-3xl p-6 border ${colors.border} overflow-hidden h-full`}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{
            backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        <motion.div
          className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>

        <h3 className="font-bold text-slate-900 text-lg mb-2">{benefit.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>

        <motion.div
          className={`mt-4 flex items-center gap-2 ${colors.text} text-sm font-medium`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
        >
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const partnerTypes = [
  {
    type: "Referral Partner",
    ideal: "Event venues, planners, photographers",
    commitment: "Low",
    revenue: "15-20%",
    revenueLabel: "commission",
    features: ["Simple referral links", "Co-branded landing pages", "Monthly reporting", "No minimum volume"],
    popular: false,
    color: "slate",
  },
  {
    type: "Embedded Partner",
    ideal: "Event platforms, booking software",
    commitment: "Medium",
    revenue: "20-30%",
    revenueLabel: "commission",
    features: ["API integration", "White-label quoting", "Real-time policy issuance", "Dedicated support"],
    popular: true,
    color: "teal",
  },
  {
    type: "Strategic Partner",
    ideal: "Insurance agencies, large venues",
    commitment: "High",
    revenue: "Custom",
    revenueLabel: "structure",
    features: ["Full BOR arrangement", "Custom product development", "Volume-based incentives", "Executive partnership"],
    popular: false,
    color: "slate",
  },
];

function PartnerTypeCard({ partner, index }: { partner: typeof partnerTypes[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {partner.popular && (
        <motion.div
          className="absolute -inset-[3px] rounded-3xl bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 blur-sm"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />
      )}

      <motion.div
        className={`relative bg-white rounded-3xl overflow-hidden shadow-xl border ${partner.popular ? "border-teal-300" : "border-slate-200"} h-full`}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {partner.popular && (
          <motion.div
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center py-3 text-sm font-bold"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              MOST POPULAR
              <Sparkles className="w-4 h-4" />
            </div>
          </motion.div>
        )}

        <div className="p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{partner.type}</h3>
          <p className="text-slate-500 text-sm mb-6">Ideal for: {partner.ideal}</p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className={`text-4xl font-bold ${partner.popular ? "text-teal-600" : "text-slate-900"}`}>
              {partner.revenue}
            </span>
            <span className="text-slate-500">{partner.revenueLabel}</span>
          </div>

          <div className="mb-6 flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
            <span className="text-slate-500 text-sm">Commitment Level</span>
            <span className={`font-semibold ${
              partner.commitment === "Low" ? "text-green-600" :
              partner.commitment === "Medium" ? "text-amber-600" :
              "text-slate-900"
            }`}>
              {partner.commitment}
            </span>
          </div>

          <div className="space-y-3 border-t border-slate-200 pt-6">
            {partner.features.map((feature, i) => (
              <motion.div
                key={feature}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${partner.popular ? "text-teal-500" : "text-slate-400"}`} />
                <span className="text-slate-700 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            className={`w-full mt-8 py-4 rounded-xl font-semibold transition-all ${
              partner.popular
                ? "bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/30"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const processSteps = [
  { step: "Discovery Call", duration: "30 min", description: "Discuss your business model and insurance needs", icon: Phone },
  { step: "Partnership Proposal", duration: "3-5 days", description: "Custom proposal with revenue projections", icon: FileCheck },
  { step: "Agreement & Onboarding", duration: "1-2 weeks", description: "Sign agreement and configure your integration", icon: Building2 },
  { step: "Launch & Support", duration: "Ongoing", description: "Go live with dedicated partner success manager", icon: Rocket },
];

const products = [
  { product: "Event Liability", coverage: "$1M - $5M", premium: "$75 - $500", popular: true },
  { product: "Special Event", coverage: "Customizable", premium: "$150 - $1,500", popular: true },
  { product: "Liquor Liability", coverage: "$1M - $2M", premium: "$100 - $400", popular: false },
  { product: "Equipment Coverage", coverage: "$10K - $500K", premium: "$50 - $800", popular: false },
  { product: "Cancellation", coverage: "Event Cost", premium: "5-10% of cost", popular: true },
  { product: "Vendor Liability", coverage: "$1M - $2M", premium: "$100 - $300", popular: false },
  { product: "Professional Liability", coverage: "$1M - $5M", premium: "$300 - $2K", popular: false },
  { product: "Workers' Comp", coverage: "Statutory", premium: "Varies", popular: false },
];

const faqs = [
  {
    q: "Do I need an insurance license to partner with you?",
    a: "No. As the Broker of Record, HiQor holds all necessary licenses. You simply refer or integrate customers to our platform.",
  },
  {
    q: "What are the minimum volume requirements?",
    a: "There are no minimum volume requirements for Referral Partners. Embedded and Strategic partnerships have volume targets that unlock higher commission rates.",
  },
  {
    q: "How quickly can I start offering insurance?",
    a: "Referral partners can launch within days with a co-branded landing page. API integrations typically take 1-2 weeks depending on complexity.",
  },
  {
    q: "Who handles customer support and claims?",
    a: "HiQor handles all policy servicing, customer support, and claims coordination. You can white-label our support or direct customers to us.",
  },
  {
    q: "What states can I offer coverage in?",
    a: "Through our multi-state licensing, we can offer coverage in all 50 states. Some products may have state-specific restrictions.",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
      <motion.button
        className="w-full p-6 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
      >
        <h3 className="font-bold text-slate-900 pr-4">{faq.q}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </motion.button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-slate-600">{faq.a}</p>
      </motion.div>
    </motion.div>
  );
}

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0d9488 100%)",
              "linear-gradient(135deg, #1e293b 0%, #0d9488 50%, #0f172a 100%)",
              "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0d9488 100%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated dot pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/insurance-broker-research"
              className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-8 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Research Portal
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30 mb-6"
              >
                <motion.span
                  className="relative flex h-2 w-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                </motion.span>
                <span className="text-teal-400 font-semibold text-sm">Partnership Opportunity</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                Partner With{" "}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  HiQor & Daily Event Insurance
                </motion.span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed"
              >
                Leverage our 50-state Broker of Record infrastructure to offer insurance products to your customers without the complexity of licensing, compliance, or carrier relationships.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                <motion.a
                  href="#partner-types"
                  className="px-8 py-4 bg-teal-500 text-white rounded-full font-semibold shadow-lg shadow-teal-500/30 inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(20, 184, 166, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Partnership Models
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#process"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold border border-white/20"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  How It Works
                </motion.a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-3xl blur-2xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-teal-400" />
                  Why Partner With Us?
                </h3>
                <div className="space-y-4">
                  {[
                    { metric: "$48B+", label: "West Coast Market Size" },
                    { metric: "50", label: "States Licensed" },
                    { metric: "24hr", label: "Average Quote-to-Bind" },
                    { metric: "98%", label: "Partner Satisfaction" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-slate-300">{item.label}</span>
                      <motion.span
                        className="text-2xl font-bold text-teal-400"
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.metric}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Challenge - Comparison Section */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm mb-4"
            >
              <span className="text-slate-600 font-semibold text-sm">The Smart Choice</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              The Challenge of Going It Alone
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 max-w-2xl mx-auto">
              Building your own insurance operation requires significant investment, time, and expertise.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* Build Your Own - Red */}
            <motion.div
              variants={cardVariants}
              className="relative"
            >
              <motion.div
                className="bg-white rounded-3xl p-8 border-2 border-red-200 shadow-xl relative overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center"
                      whileHover={{ rotate: 10 }}
                    >
                      <X className="w-7 h-7 text-red-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-900">Build Your Own BOR</h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Initial Investment", value: "$75K - $150K" },
                      { label: "Time to Launch", value: "18-36 months" },
                      { label: "Ongoing Compliance", value: "$25K+/year" },
                      { label: "Staff Required", value: "3-5 FTEs" },
                      { label: "Risk Exposure", value: "High" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-semibold text-red-600">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Partner With HiQor - Teal */}
            <motion.div
              variants={cardVariants}
              className="relative"
            >
              <motion.div
                className="absolute -inset-[3px] bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 rounded-3xl"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              />

              <motion.div
                className="relative bg-white rounded-3xl p-8 border-2 border-teal-200 shadow-xl overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-teal-600" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Partner With HiQor</h3>
                      <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">RECOMMENDED</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Initial Investment", value: "$0" },
                      { label: "Time to Launch", value: "1-2 weeks" },
                      { label: "Ongoing Compliance", value: "Included" },
                      { label: "Staff Required", value: "0 (We handle it)" },
                      { label: "Risk Exposure", value: "None" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-semibold text-teal-600">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-4"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-teal-600 font-semibold text-sm">Partnership Benefits</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              Everything You Need, Nothing You Don't
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 max-w-2xl mx-auto">
              Focus on what you do best while we handle the insurance infrastructure.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {partnershipBenefits.map((benefit, i) => (
              <BenefitCard key={benefit.title} benefit={benefit} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partner Types Section */}
      <section id="partner-types" className="py-20 bg-slate-50 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              Partnership Models
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 max-w-2xl mx-auto">
              Choose the partnership level that fits your business model and growth ambitions.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {partnerTypes.map((partner, i) => (
              <PartnerTypeCard key={partner.type} partner={partner} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #134e4a 100%)",
              "linear-gradient(135deg, #1e293b 0%, #134e4a 50%, #0f172a 100%)",
              "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #134e4a 100%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Products Available Through Partnership
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-300 max-w-2xl mx-auto">
              Comprehensive coverage options for the event industry and beyond.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {products.map((item, i) => (
              <motion.div
                key={item.product}
                variants={cardVariants}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-white">{item.product}</h3>
                  {item.popular && (
                    <motion.span
                      className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Popular
                    </motion.span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coverage:</span>
                    <span className="text-white">{item.coverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Premium:</span>
                    <span className="text-teal-400 font-semibold">{item.premium}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-4"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="text-teal-600 font-semibold text-sm">Getting Started</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              Simple Onboarding Process
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-600 max-w-2xl mx-auto">
              From first conversation to live integration in as little as two weeks.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-6 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200" />

            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  variants={cardVariants}
                  className="relative"
                >
                  <motion.div
                    className="bg-slate-50 rounded-3xl p-6 border border-slate-200 h-full relative"
                    whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(20, 184, 166, 0.2)" }}
                  >
                    <motion.div
                      className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center font-bold mb-4 shadow-lg shadow-teal-500/30 relative z-10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{step.step}</h3>
                    <p className="text-teal-600 text-sm font-semibold mb-2">{step.duration}</p>
                    <p className="text-slate-600 text-sm">{step.description}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0891b2 100%)",
              "linear-gradient(135deg, #14b8a6 0%, #0891b2 50%, #0d9488 100%)",
              "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0891b2 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated shapes */}
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Offer Insurance to Your Customers?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto"
            >
              Schedule a discovery call to explore how a partnership with HiQor and Daily Event Insurance can unlock new revenue streams for your business.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.a
                href="mailto:partnerships@hiqor.io?subject=Partnership%20Inquiry"
                className="px-8 py-4 bg-white text-teal-600 rounded-full font-semibold shadow-xl inline-flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
                Schedule Discovery Call
              </motion.a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/insurance-broker-research/executive-summary"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold border border-white/30 inline-flex items-center gap-2"
                >
                  View Full Research
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {faqs.map((faq, i) => (
              <FAQItem key={faq.q} faq={faq} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/insurance-broker-research/executive-summary"
                className="px-6 py-3 bg-slate-100 rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Executive Summary
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/insurance-broker-research"
                className="px-6 py-3 bg-slate-100 rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow"
              >
                Research Portal
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="px-6 py-3 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-colors inline-flex items-center gap-2"
              >
                Daily Event Insurance
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
