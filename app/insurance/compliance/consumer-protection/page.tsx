"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Users,
  Phone,
  Mail,
  ArrowRight,
  Info,
  Scale,
  MessageSquare,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  FileCheck,
  HelpCircle,
  Gavel,
  DollarSign,
  Heart,
} from "lucide-react"

// Consumer Rights
const consumerRights = [
  {
    right: "Clear & Accurate Information",
    description: "All policy terms, coverage, exclusions, and pricing disclosed in plain language",
    implementation: "Policy documents reviewed for readability; coverage summaries provided",
    icon: FileText,
  },
  {
    right: "Fair Pricing",
    description: "Premiums based on actuarially sound principles without unfair discrimination",
    implementation: "Rate filings with state regulators; pricing transparency",
    icon: DollarSign,
  },
  {
    right: "Timely Service",
    description: "Prompt response to inquiries, policy issuance, and claims processing",
    implementation: "SLA monitoring; automated acknowledgments; escalation procedures",
    icon: Clock,
  },
  {
    right: "Privacy Protection",
    description: "Personal information protected and used only for legitimate purposes",
    implementation: "CCPA compliance; data minimization; secure handling",
    icon: Shield,
  },
  {
    right: "Fair Claims Handling",
    description: "Claims evaluated promptly, fairly, and in good faith",
    implementation: "Documented procedures; reasonable deadlines; clear communication",
    icon: Scale,
  },
  {
    right: "Complaint Resolution",
    description: "Effective process to address concerns and resolve disputes",
    implementation: "Multiple channels; tracking system; escalation path",
    icon: MessageSquare,
  },
]

// Claims Process Steps
const claimsProcess = [
  {
    step: 1,
    title: "Claim Submission",
    description: "Customer submits claim through portal, email, or phone",
    sla: "24-hour acknowledgment",
    details: [
      "Online submission available 24/7",
      "Automated acknowledgment email sent",
      "Claim number assigned immediately",
      "Required documentation listed",
    ],
  },
  {
    step: 2,
    title: "Initial Review",
    description: "Claim reviewed for coverage and completeness",
    sla: "3 business days",
    details: [
      "Coverage verification",
      "Policy terms review",
      "Documentation completeness check",
      "Request additional info if needed",
    ],
  },
  {
    step: 3,
    title: "Investigation",
    description: "Gather facts and assess claim validity",
    sla: "15 business days",
    details: [
      "Contact insured for details",
      "Review supporting documentation",
      "Third-party verification if needed",
      "Loss assessment",
    ],
  },
  {
    step: 4,
    title: "Decision",
    description: "Claim approved, denied, or partial payment determined",
    sla: "30 days from submission",
    details: [
      "Coverage determination",
      "Amount calculation",
      "Written decision provided",
      "Explanation of determination",
    ],
  },
  {
    step: 5,
    title: "Payment/Resolution",
    description: "Payment issued or denial explanation provided",
    sla: "5 business days after decision",
    details: [
      "Payment via preferred method",
      "Detailed explanation letter",
      "Appeal rights explained",
      "Contact for questions",
    ],
  },
]

// Complaint Handling
const complaintProcess = [
  {
    stage: "Receipt",
    timeline: "Immediate",
    actions: [
      "Complaint logged in tracking system",
      "Acknowledgment sent within 24 hours",
      "Unique reference number assigned",
      "Initial categorization",
    ],
  },
  {
    stage: "Investigation",
    timeline: "1-15 business days",
    actions: [
      "Assigned to appropriate team",
      "Facts gathered and reviewed",
      "Customer contacted if needed",
      "Resolution options identified",
    ],
  },
  {
    stage: "Resolution",
    timeline: "Within 30 days",
    actions: [
      "Decision communicated in writing",
      "Explanation of resolution provided",
      "Appeal process explained if denied",
      "Follow-up to confirm satisfaction",
    ],
  },
  {
    stage: "Escalation (if needed)",
    timeline: "Additional 15 days",
    actions: [
      "Senior review if customer dissatisfied",
      "Compliance officer involvement",
      "Regulatory liaison if required",
      "Final determination communicated",
    ],
  },
]

// UCSPA Compliance
const ucspaCompliance = [
  {
    requirement: "No Misrepresentation",
    description: "All policy terms and benefits accurately represented",
    status: "compliant",
  },
  {
    requirement: "Prompt Investigation",
    description: "Claims investigated within reasonable timeframes",
    status: "compliant",
  },
  {
    requirement: "Good Faith Communication",
    description: "Honest, clear communication about coverage and claims",
    status: "compliant",
  },
  {
    requirement: "Timely Payment",
    description: "Valid claims paid promptly after determination",
    status: "compliant",
  },
  {
    requirement: "Reasonable Standards",
    description: "Investigation standards that are reasonable for claim size",
    status: "compliant",
  },
  {
    requirement: "No Undue Delay",
    description: "No delaying tactics or unnecessary documentation requests",
    status: "compliant",
  },
  {
    requirement: "Fair Settlement",
    description: "Settlement offers reflect actual policy value",
    status: "compliant",
  },
  {
    requirement: "Honest Denial",
    description: "Denials based on legitimate policy grounds only",
    status: "compliant",
  },
]

// Disclosure Requirements
const disclosures = [
  {
    document: "Policy Summary",
    timing: "Before purchase",
    contents: "Coverage overview, key exclusions, premium, deductibles",
  },
  {
    document: "Full Policy Document",
    timing: "At purchase",
    contents: "Complete terms, conditions, exclusions, definitions",
  },
  {
    document: "Certificate of Insurance",
    timing: "At purchase",
    contents: "Proof of coverage, policy number, coverage dates, limits",
  },
  {
    document: "Claims Information",
    timing: "At purchase and claim",
    contents: "How to file, timeline, required documentation",
  },
  {
    document: "Cancellation Terms",
    timing: "At purchase",
    contents: "Refund policy, cancellation procedure, pro-rata terms",
  },
  {
    document: "Complaint Procedure",
    timing: "At purchase",
    contents: "How to file complaints, contact information, escalation",
  },
]

export default function ConsumerProtectionPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-2">
          <Shield className="w-4 h-4" />
          Document ID: DOC-006
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Consumer Protection
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Transparent practices ensuring fair treatment of all customers, clear claims processes,
          and effective complaint resolution. Our consumer protection program is designed to meet
          or exceed regulatory requirements and industry best practices.
        </p>
      </div>

      {/* Policy Statement */}
      <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Heart className="w-6 h-6 text-teal-600" />
          Consumer Protection Commitment
        </h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">
            Daily Event Insurance is committed to treating all customers fairly and honestly.
            We believe in transparent pricing, clear communication, prompt claims handling,
            and accessible complaint resolution. Our practices are designed to comply with
            state Unfair Claims Settlement Practices Acts and insurance consumer protection
            regulations.
          </p>
        </div>
        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">24 hrs</div>
            <div className="text-sm text-slate-600">Claim Acknowledgment</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">30 Days</div>
            <div className="text-sm text-slate-600">Max Claims Decision</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">100%</div>
            <div className="text-sm text-slate-600">Complaint Response Rate</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">Zero</div>
            <div className="text-sm text-slate-600">Hidden Fees</div>
          </div>
        </div>
      </div>

      {/* Consumer Rights */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Your Rights as a Customer</h2>
        <p className="text-slate-600 mb-6">
          Fundamental rights we guarantee to all customers.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {consumerRights.map((right, idx) => (
            <motion.div
              key={right.right}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <right.icon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{right.right}</h3>
                  <p className="text-sm text-slate-600 mt-1">{right.description}</p>
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs font-medium text-slate-500 mb-1">How We Deliver</div>
                    <p className="text-sm text-slate-700">{right.implementation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Claims Process */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <FileCheck className="w-6 h-6 text-teal-600" />
          Claims Process
        </h2>
        <p className="text-slate-600 mb-6">
          Step-by-step process for filing and resolving claims with guaranteed timelines.
        </p>
        <div className="space-y-4">
          {claimsProcess.map((step) => (
            <div key={step.step} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl font-bold">{step.step}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{step.title}</h3>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                      {step.sla}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-3">{step.description}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {step.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complaint Handling */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-teal-400" />
          Complaint Handling Process
        </h2>
        <p className="text-slate-300 mb-6">
          We take all complaints seriously and have established clear procedures for resolution.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complaintProcess.map((stage, idx) => (
            <div key={stage.stage} className="p-5 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-semibold">{stage.stage}</span>
              </div>
              <div className="text-xs text-teal-400 mb-3">{stage.timeline}</div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {stage.actions.map((action) => (
                  <li key={action} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* How to File Complaint */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">How to File a Complaint</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <Mail className="w-10 h-10 text-teal-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
            <p className="text-sm text-slate-600 mb-3">Send detailed complaint via email</p>
            <a
              href="mailto:complaints@dailyeventinsurance.com"
              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
            >
              complaints@dailyeventinsurance.com
            </a>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <Phone className="w-10 h-10 text-teal-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
            <p className="text-sm text-slate-600 mb-3">Speak with customer service</p>
            <span className="text-teal-600 font-medium text-sm">1-800-XXX-XXXX</span>
            <p className="text-xs text-slate-500 mt-1">Mon-Fri, 9am-6pm EST</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <FileText className="w-10 h-10 text-teal-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Online Form</h3>
            <p className="text-sm text-slate-600 mb-3">Submit through our portal</p>
            <Link
              href="/complaints"
              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
            >
              File Online Complaint
            </Link>
          </div>
        </div>
      </div>

      {/* UCSPA Compliance */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Gavel className="w-6 h-6 text-teal-600" />
          Unfair Claims Settlement Practices Act Compliance
        </h2>
        <p className="text-slate-600 mb-6">
          Our practices are designed to comply with state UCSPA requirements.
        </p>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {ucspaCompliance.map((item) => (
            <div key={item.requirement} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">{item.requirement}</h4>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                Compliant
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclosure Requirements */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Required Disclosures</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tl-lg">Document</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Timing</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tr-lg">Contents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {disclosures.map((item, idx) => (
                <tr key={item.document} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.document}</td>
                  <td className="px-4 py-3 text-slate-600">{item.timing}</td>
                  <td className="px-4 py-3 text-slate-600">{item.contents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appeals Process */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Scale className="w-6 h-6" />
          Appeals Process
        </h2>
        <p className="text-teal-100 mb-6">
          If you disagree with a claims decision, you have the right to appeal.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-white/10 rounded-xl border border-white/20">
            <h3 className="font-semibold mb-3">Step 1: Internal Appeal</h3>
            <ul className="space-y-2 text-sm text-teal-100">
              <li>• Submit written appeal within 60 days</li>
              <li>• Include new information or arguments</li>
              <li>• Review by different adjuster</li>
              <li>• Decision within 30 days</li>
            </ul>
          </div>
          <div className="p-5 bg-white/10 rounded-xl border border-white/20">
            <h3 className="font-semibold mb-3">Step 2: Senior Review</h3>
            <ul className="space-y-2 text-sm text-teal-100">
              <li>• If internal appeal denied</li>
              <li>• Review by compliance officer</li>
              <li>• Comprehensive file review</li>
              <li>• Decision within 15 days</li>
            </ul>
          </div>
          <div className="p-5 bg-white/10 rounded-xl border border-white/20">
            <h3 className="font-semibold mb-3">Step 3: External Options</h3>
            <ul className="space-y-2 text-sm text-teal-100">
              <li>• State insurance department complaint</li>
              <li>• Mediation or arbitration</li>
              <li>• Legal action if necessary</li>
              <li>• We provide regulatory contacts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Documents */}
      <div className="flex flex-wrap items-center gap-6 text-sm pt-8 border-t border-slate-200">
        <span className="text-slate-500">Related Documentation:</span>
        <Link
          href="/insurance/compliance/privacy"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Privacy & Data Protection
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/licensing"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Licensing & Registration
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
