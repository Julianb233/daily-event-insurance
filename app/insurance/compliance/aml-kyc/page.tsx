"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  UserCheck,
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Users,
  Globe,
  Search,
  Building2,
  ArrowRight,
  Info,
  Database,
  Eye,
  AlertCircle,
  Scale,
  Target,
  BadgeCheck,
  Briefcase,
  Ban,
  Flag,
  TrendingUp,
  DollarSign,
} from "lucide-react"

// KYC Levels
const kycLevels = [
  {
    level: "Basic",
    threshold: "All customers",
    requirements: [
      "Email verification",
      "Name collection",
      "Phone number (optional)",
    ],
    riskLevel: "Standard",
    color: "emerald",
  },
  {
    level: "Standard",
    threshold: "Partners, high-value policies",
    requirements: [
      "Basic requirements",
      "Business verification",
      "Phone verification",
      "Address verification",
    ],
    riskLevel: "Moderate",
    color: "amber",
  },
  {
    level: "Enhanced",
    threshold: "High-risk indicators, large transactions",
    requirements: [
      "Standard requirements",
      "Government ID verification",
      "Address documentation",
      "Source of funds",
    ],
    riskLevel: "Elevated",
    color: "orange",
  },
  {
    level: "Full",
    threshold: "PEP, sanctions concerns",
    requirements: [
      "Enhanced requirements",
      "PEP/sanctions screening",
      "Beneficial ownership",
      "Ongoing monitoring",
    ],
    riskLevel: "High",
    color: "red",
  },
]

// CIP Requirements
const cipRequirements = [
  {
    id: "CIP-001",
    category: "Individual Customers",
    required: [
      "Full legal name",
      "Date of birth",
      "Address (residential or business)",
      "Identification number (SSN or foreign equivalent)",
    ],
    verification: "Documentary (ID) or non-documentary (database verification)",
  },
  {
    id: "CIP-002",
    category: "Business Customers",
    required: [
      "Legal business name",
      "Principal place of business",
      "EIN or equivalent tax ID",
      "State of incorporation/registration",
    ],
    verification: "Secretary of State records, business documents",
  },
  {
    id: "CIP-003",
    category: "Beneficial Owners",
    required: [
      "Names of individuals with 25%+ ownership",
      "Names of controlling person(s)",
      "Same info as individual customers",
    ],
    verification: "Certification form plus verification",
  },
]

// Transaction Monitoring Rules
const monitoringRules = [
  {
    id: "TM-001",
    name: "High Value Transaction",
    trigger: "Single transaction > $10,000",
    action: "Flag for review, potential CTR filing",
    severity: "high",
  },
  {
    id: "TM-002",
    name: "Velocity Alert",
    trigger: "5+ transactions in 24 hours",
    action: "Review for structuring patterns",
    severity: "medium",
  },
  {
    id: "TM-003",
    name: "Daily Volume Threshold",
    trigger: "Cumulative daily > $25,000",
    action: "Enhanced monitoring, potential SAR",
    severity: "high",
  },
  {
    id: "TM-004",
    name: "Weekly Volume Threshold",
    trigger: "Cumulative weekly > $100,000",
    action: "Review by compliance officer",
    severity: "high",
  },
  {
    id: "TM-005",
    name: "Geographic Risk",
    trigger: "High-risk jurisdiction indicators",
    action: "Enhanced due diligence",
    severity: "medium",
  },
  {
    id: "TM-006",
    name: "Structuring Pattern",
    trigger: "Multiple transactions just under $10,000",
    action: "Immediate SAR consideration",
    severity: "critical",
  },
  {
    id: "TM-007",
    name: "Unusual Activity",
    trigger: "Deviation from established patterns",
    action: "Investigation, documentation",
    severity: "medium",
  },
  {
    id: "TM-008",
    name: "Sanctions Match",
    trigger: "Name/entity matches OFAC list",
    action: "Transaction block, immediate escalation",
    severity: "critical",
  },
]

// Alert Types
const alertTypes = [
  {
    type: "High Value Transaction",
    description: "Single transaction exceeds $10,000",
    icon: DollarSign,
  },
  {
    type: "Unusual Pattern",
    description: "Activity deviates from established baseline",
    icon: TrendingUp,
  },
  {
    type: "Velocity Exceeded",
    description: "Transaction frequency exceeds thresholds",
    icon: Clock,
  },
  {
    type: "Sanctioned Party",
    description: "Match against OFAC or other sanctions lists",
    icon: Ban,
  },
  {
    type: "PEP Match",
    description: "Politically exposed person identification",
    icon: Flag,
  },
  {
    type: "Structuring Suspected",
    description: "Pattern suggests avoiding reporting thresholds",
    icon: Target,
  },
]

// SAR Process
const sarProcess = [
  {
    step: 1,
    title: "Detection",
    description: "Suspicious activity identified through monitoring or report",
    timeline: "Immediate",
  },
  {
    step: 2,
    title: "Investigation",
    description: "Compliance team reviews activity, gathers documentation",
    timeline: "1-5 days",
  },
  {
    step: 3,
    title: "Decision",
    description: "Compliance officer determines if SAR is warranted",
    timeline: "Within 30 days of detection",
  },
  {
    step: 4,
    title: "Filing",
    description: "SAR filed with FinCEN via BSA E-Filing system",
    timeline: "30 days (60 with extension)",
  },
  {
    step: 5,
    title: "Documentation",
    description: "Supporting documentation retained for 5 years",
    timeline: "Ongoing",
  },
]

// Risk Assessment Factors
const riskFactors = [
  {
    category: "Customer Risk",
    factors: [
      "Type of customer (individual vs. business)",
      "Geographic location",
      "Occupation or business type",
      "Source of funds",
      "PEP status",
    ],
  },
  {
    category: "Product Risk",
    factors: [
      "Policy type and coverage amount",
      "Payment methods used",
      "Frequency of transactions",
      "Premium amounts",
    ],
  },
  {
    category: "Geographic Risk",
    factors: [
      "Customer location",
      "Event location",
      "Connection to high-risk jurisdictions",
      "Cross-border transactions",
    ],
  },
  {
    category: "Transactional Risk",
    factors: [
      "Transaction size and frequency",
      "Payment patterns",
      "Cash vs. electronic payments",
      "Third-party payments",
    ],
  },
]

export default function AMLKYCPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-2">
          <UserCheck className="w-4 h-4" />
          Document ID: DOC-004
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          AML/KYC Program
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Comprehensive anti-money laundering and know-your-customer program designed to prevent
          financial crimes, comply with Bank Secrecy Act requirements, and meet insurance regulatory
          standards for customer identification and verification.
        </p>
      </div>

      {/* Program Overview */}
      <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Shield className="w-6 h-6 text-teal-600" />
          Program Statement
        </h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">
            Daily Event Insurance maintains a risk-based Anti-Money Laundering (AML) program
            that includes Customer Identification Program (CIP), Customer Due Diligence (CDD),
            Enhanced Due Diligence (EDD), ongoing transaction monitoring, and suspicious activity
            reporting. Our program is designed to comply with the Bank Secrecy Act, USA PATRIOT
            Act, and applicable insurance regulations.
          </p>
        </div>
        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">100%</div>
            <div className="text-sm text-slate-600">Customer ID Verification</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">Real-time</div>
            <div className="text-sm text-slate-600">Sanctions Screening</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">30 Days</div>
            <div className="text-sm text-slate-600">SAR Filing Deadline</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">5 Years</div>
            <div className="text-sm text-slate-600">Record Retention</div>
          </div>
        </div>
      </div>

      {/* KYC Verification Levels */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">KYC Verification Levels</h2>
        <p className="text-slate-600 mb-6">
          Risk-based approach with escalating verification requirements based on risk indicators.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kycLevels.map((level, idx) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${
                level.color === "emerald" ? "bg-emerald-100 text-emerald-700" :
                level.color === "amber" ? "bg-amber-100 text-amber-700" :
                level.color === "orange" ? "bg-orange-100 text-orange-700" :
                "bg-red-100 text-red-700"
              }`}>
                {level.riskLevel} Risk
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{level.level}</h3>
              <p className="text-sm text-slate-500 mb-4">{level.threshold}</p>
              <div className="space-y-2">
                {level.requirements.map((req) => (
                  <div key={req} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    {req}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Customer Identification Program */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <BadgeCheck className="w-6 h-6 text-teal-600" />
          Customer Identification Program (CIP)
        </h2>
        <p className="text-slate-600 mb-6">
          Required information collected and verified for each customer type per USA PATRIOT Act Section 326.
        </p>
        <div className="space-y-4">
          {cipRequirements.map((cip) => (
            <div key={cip.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-mono rounded">
                  {cip.id}
                </span>
                <h3 className="font-semibold text-slate-900">{cip.category}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-2">Required Information</div>
                  <ul className="space-y-1.5">
                    {cip.required.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-2">Verification Method</div>
                  <p className="text-sm text-slate-700 p-3 bg-slate-50 rounded-lg">
                    {cip.verification}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Monitoring */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Eye className="w-6 h-6 text-teal-600" />
          Transaction Monitoring Rules
        </h2>
        <p className="text-slate-600 mb-6">
          Automated monitoring rules to detect suspicious activity patterns and regulatory thresholds.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tl-lg">Rule ID</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Rule Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Trigger</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Action</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tr-lg">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monitoringRules.map((rule, idx) => (
                <tr key={rule.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{rule.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{rule.name}</td>
                  <td className="px-4 py-3 text-slate-600">{rule.trigger}</td>
                  <td className="px-4 py-3 text-slate-600">{rule.action}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      rule.severity === "critical" ? "bg-red-100 text-red-700" :
                      rule.severity === "high" ? "bg-orange-100 text-orange-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {rule.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Types */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">AML Alert Types</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {alertTypes.map((alert, idx) => (
            <motion.div
              key={alert.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                <alert.icon className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900">{alert.type}</h3>
              <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sanctions Screening */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Ban className="w-6 h-6 text-red-400" />
          Sanctions Screening (OFAC Compliance)
        </h2>
        <p className="text-slate-300 mb-6">
          All customers and transactions are screened against OFAC sanctions lists in real-time.
          Matches result in immediate transaction blocking and compliance review.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-semibold mb-4">Lists Screened</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Specially Designated Nationals (SDN)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Sectoral Sanctions Identifications (SSI)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Foreign Sanctions Evaders (FSE)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Non-SDN Menu-Based Sanctions (NS-MBS)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Consolidated Screening List
              </li>
            </ul>
          </div>
          <div className="p-5 bg-white/5 rounded-xl border border-white/10">
            <h3 className="font-semibold mb-4">Screening Process</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                Real-time screening at onboarding
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                Batch rescreening on list updates
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                Transaction-level screening
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center">4</span>
                False positive review (2-hour SLA)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center">5</span>
                True match escalation (immediate)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SAR Process */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          Suspicious Activity Reporting (SAR)
        </h2>
        <p className="text-slate-600 mb-6">
          Process for identifying, investigating, and reporting suspicious activity to FinCEN.
        </p>
        <div className="flex flex-wrap gap-3">
          {sarProcess.map((step, idx) => (
            <div key={step.step} className="flex items-center gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4 w-56">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.step}
                  </span>
                  <span className="font-semibold text-slate-900">{step.title}</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{step.description}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {step.timeline}
                </div>
              </div>
              {idx < sarProcess.length - 1 && (
                <ArrowRight className="w-5 h-5 text-slate-300" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900">SAR Confidentiality</h4>
              <p className="text-sm text-amber-700 mt-1">
                The existence of a SAR is confidential. It is a federal crime to disclose to any
                person involved in the transaction that a SAR has been filed. SARs must not be
                discussed with customers, and documentation must be maintained separately from
                customer files.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Risk Assessment Framework</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {riskFactors.map((category) => (
            <div key={category.category} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">{category.category}</h3>
              <ul className="space-y-2">
                {category.factors.map((factor) => (
                  <li key={factor} className="flex items-center gap-2 text-sm text-slate-600">
                    <Target className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Training Requirements */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Users className="w-6 h-6" />
          AML Training Program
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <h3 className="font-semibold mb-2">Initial Training</h3>
            <p className="text-sm text-teal-100">All employees within 30 days of hire</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <h3 className="font-semibold mb-2">Annual Refresher</h3>
            <p className="text-sm text-teal-100">Required for all staff annually</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <h3 className="font-semibold mb-2">Role-Based Training</h3>
            <p className="text-sm text-teal-100">Advanced training for compliance staff</p>
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="font-semibold mb-2">Topics Covered</h4>
            <ul className="space-y-1 text-sm text-teal-100">
              <li>• BSA/AML regulatory requirements</li>
              <li>• Red flags and suspicious activity indicators</li>
              <li>• CIP and CDD procedures</li>
              <li>• SAR filing requirements</li>
              <li>• OFAC sanctions compliance</li>
              <li>• Record retention requirements</li>
            </ul>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="font-semibold mb-2">Documentation</h4>
            <ul className="space-y-1 text-sm text-teal-100">
              <li>• Training attendance records</li>
              <li>• Comprehension assessments</li>
              <li>• Training materials archived</li>
              <li>• Certificates of completion</li>
              <li>• Records retained 5 years</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance Officer */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-teal-600" />
          AML Compliance Officer
        </h2>
        <p className="text-slate-600 mb-4">
          A designated AML Compliance Officer has overall responsibility for the AML program,
          including:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Day-to-day operation of AML program",
            "Filing SARs with FinCEN",
            "Ensuring CIP/CDD procedures are followed",
            "Reviewing and investigating alerts",
            "Training program oversight",
            "Regulatory examination response",
            "Program updates and enhancements",
            "Board reporting and escalation",
          ].map((responsibility) => (
            <div key={responsibility} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
              <span className="text-sm text-slate-700">{responsibility}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Documents */}
      <div className="flex flex-wrap items-center gap-6 text-sm pt-8 border-t border-slate-200">
        <span className="text-slate-500">Related Documentation:</span>
        <Link
          href="/insurance/compliance/audit-records"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Audit & Records
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/privacy"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Privacy & Data Protection
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/consumer-protection"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Consumer Protection
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/glossary"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Glossary
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
