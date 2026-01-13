"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Award,
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  MapPin,
  Building2,
  ArrowRight,
  Info,
  Calendar,
  Users,
  BookOpen,
  Briefcase,
  Globe,
  Star,
} from "lucide-react"

// Licensing Status
type LicenseStatus = "active" | "pending" | "planned"

interface StateInfo {
  state: string
  status: LicenseStatus
  licenseNumber?: string
  expirationDate?: string
  linesOfAuthority: string[]
}

// State Licensing (example data - would be real in production)
const stateLicensing: StateInfo[] = [
  {
    state: "California",
    status: "active",
    licenseNumber: "0X12345",
    expirationDate: "2025-12-31",
    linesOfAuthority: ["Accident & Health", "Property", "Casualty"],
  },
  {
    state: "Texas",
    status: "active",
    licenseNumber: "TX-1234567",
    expirationDate: "2025-06-30",
    linesOfAuthority: ["Property", "Casualty", "Personal Lines"],
  },
  {
    state: "Florida",
    status: "pending",
    linesOfAuthority: ["Property", "Casualty"],
  },
  {
    state: "New York",
    status: "pending",
    linesOfAuthority: ["Accident & Health", "Property", "Casualty"],
  },
  {
    state: "Illinois",
    status: "planned",
    linesOfAuthority: ["Property", "Casualty"],
  },
  {
    state: "Pennsylvania",
    status: "planned",
    linesOfAuthority: ["Property", "Casualty"],
  },
]

// NAIC Model Laws
const naicCompliance = [
  {
    modelLaw: "Producer Licensing Model Act",
    description: "Uniform licensing standards for insurance producers",
    status: "compliant",
    notes: "NARAB reciprocity eligible",
  },
  {
    modelLaw: "Unfair Trade Practices Act",
    description: "Prohibits unfair methods of competition and deceptive practices",
    status: "compliant",
    notes: "Full compliance implemented",
  },
  {
    modelLaw: "Unfair Claims Settlement Practices Act",
    description: "Standards for fair claims handling",
    status: "compliant",
    notes: "Claims procedures documented",
  },
  {
    modelLaw: "Insurance Information and Privacy Protection Model Act",
    description: "Consumer privacy protections",
    status: "compliant",
    notes: "CCPA+ compliance achieved",
  },
  {
    modelLaw: "Market Conduct Surveillance Model Law",
    description: "Standards for market conduct examinations",
    status: "compliant",
    notes: "Examination-ready procedures",
  },
  {
    modelLaw: "Corporate Governance Annual Disclosure Model Act",
    description: "Governance disclosure requirements",
    status: "compliant",
    notes: "Annual disclosures prepared",
  },
]

// Carrier Appointments
const carrierAppointments = [
  {
    carrier: "Partner Carrier A",
    status: "appointed",
    linesOfBusiness: ["Special Events Liability", "Short-term Property"],
    effectiveDate: "2024-01-01",
  },
  {
    carrier: "Partner Carrier B",
    status: "in_progress",
    linesOfBusiness: ["Equipment Coverage", "Adventure Sports"],
    effectiveDate: "Pending",
  },
]

// Continuing Education
const continuingEducation = {
  requirements: [
    {
      state: "California",
      hours: 24,
      period: "2 years",
      ethicsRequired: 3,
    },
    {
      state: "Texas",
      hours: 30,
      period: "2 years",
      ethicsRequired: 2,
    },
  ],
  tracking: [
    "All CE courses tracked in learning management system",
    "Automated reminders 90 days before expiration",
    "Certificates of completion maintained",
    "State-specific requirements monitored",
  ],
}

// Regulatory Filings
const regulatoryFilings = [
  {
    filing: "Annual Statement",
    frequency: "Annual",
    dueDate: "March 1",
    description: "Financial condition and operations summary",
  },
  {
    filing: "Producer Renewal",
    frequency: "Biennial",
    dueDate: "Varies by state",
    description: "License renewal with CE verification",
  },
  {
    filing: "Market Conduct Report",
    frequency: "As requested",
    dueDate: "Upon request",
    description: "Compliance examination documentation",
  },
  {
    filing: "Complaint Log",
    frequency: "Annual",
    dueDate: "March 1",
    description: "Summary of complaints received and resolved",
  },
]

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  planned: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  appointed: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  in_progress: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  compliant: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
}

export default function LicensingPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-teal-600 font-medium mb-2">
          <Award className="w-4 h-4" />
          Document ID: DOC-007
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Licensing & Registration
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Insurance producer licensing, regulatory compliance, and carrier appointments across
          operating jurisdictions. This document details our licensing status, NAIC compliance,
          and regulatory relationships.
        </p>
      </div>

      {/* Policy Statement */}
      <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl border border-teal-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Shield className="w-6 h-6 text-teal-600" />
          Licensing Commitment
        </h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">
            Daily Event Insurance maintains appropriate licenses in all jurisdictions where we
            conduct business. We are committed to full compliance with state insurance regulations,
            NAIC model laws, and carrier appointment requirements. Our licensing program ensures
            we operate with proper authority while expanding our geographic footprint.
          </p>
        </div>
        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">
              {stateLicensing.filter(s => s.status === "active").length}
            </div>
            <div className="text-sm text-slate-600">Active State Licenses</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">
              {stateLicensing.filter(s => s.status === "pending").length}
            </div>
            <div className="text-sm text-slate-600">Pending Applications</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">100%</div>
            <div className="text-sm text-slate-600">NAIC Compliance</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4 border border-teal-100 text-center">
            <div className="text-2xl font-bold text-teal-600">Current</div>
            <div className="text-sm text-slate-600">CE Requirements</div>
          </div>
        </div>
      </div>

      {/* State Licensing */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-teal-600" />
          State Insurance Licenses
        </h2>
        <p className="text-slate-600 mb-6">
          Current licensing status by state. We are actively expanding our licensed footprint.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stateLicensing.map((state, idx) => (
            <motion.div
              key={state.state}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">{state.state}</h3>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusColors[state.status].bg} ${statusColors[state.status].text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusColors[state.status].dot}`} />
                  {state.status.charAt(0).toUpperCase() + state.status.slice(1)}
                </span>
              </div>
              {state.licenseNumber && (
                <div className="text-sm text-slate-600 mb-2">
                  <span className="text-slate-500">License #:</span> {state.licenseNumber}
                </div>
              )}
              {state.expirationDate && (
                <div className="text-sm text-slate-600 mb-3">
                  <span className="text-slate-500">Expires:</span> {state.expirationDate}
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {state.linesOfAuthority.map((line) => (
                  <span key={line} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                    {line}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* NAIC Compliance */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Building2 className="w-6 h-6 text-teal-600" />
          NAIC Model Law Compliance
        </h2>
        <p className="text-slate-600 mb-6">
          Adherence to National Association of Insurance Commissioners model laws and standards.
        </p>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {naicCompliance.map((item) => (
            <div key={item.modelLaw} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-medium text-slate-900">{item.modelLaw}</h4>
                  <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                  <p className="text-xs text-slate-400 mt-2">{item.notes}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusColors[item.status].bg} ${statusColors[item.status].text}`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Compliant
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrier Appointments */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-teal-400" />
          Carrier Appointments
        </h2>
        <p className="text-slate-300 mb-6">
          Insurance carrier relationships and appointment status for placing coverage.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {carrierAppointments.map((carrier) => (
            <div key={carrier.carrier} className="p-5 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{carrier.carrier}</h3>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                  carrier.status === "appointed"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}>
                  {carrier.status === "appointed" ? "Appointed" : "In Progress"}
                </span>
              </div>
              <div className="text-sm text-slate-400 mb-3">
                Effective: {carrier.effectiveDate}
              </div>
              <div className="flex flex-wrap gap-1">
                {carrier.linesOfBusiness.map((line) => (
                  <span key={line} className="px-2 py-0.5 bg-white/10 text-slate-300 text-xs rounded">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <strong className="text-white">For Carrier Partners:</strong> We welcome inquiries
              from insurance carriers interested in partnering with Daily Event Insurance. Our
              compliance infrastructure is designed to meet carrier due diligence requirements.
              Contact <a href="mailto:carriers@dailyeventinsurance.com" className="text-teal-400 hover:text-teal-300">carriers@dailyeventinsurance.com</a>.
            </div>
          </div>
        </div>
      </div>

      {/* Continuing Education */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-teal-600" />
          Continuing Education
        </h2>
        <p className="text-slate-600 mb-6">
          Ongoing education requirements maintained for all licensed personnel.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">State Requirements</h3>
            <div className="space-y-3">
              {continuingEducation.requirements.map((req) => (
                <div key={req.state} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-900">{req.state}</span>
                  <div className="text-sm text-slate-600">
                    {req.hours} hrs / {req.period} ({req.ethicsRequired} ethics)
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Tracking & Compliance</h3>
            <ul className="space-y-2">
              {continuingEducation.tracking.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Regulatory Filings */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Regulatory Filings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tl-lg">Filing</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Frequency</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Due Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900 rounded-tr-lg">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regulatoryFilings.map((filing, idx) => (
                <tr key={filing.filing} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-3 font-medium text-slate-900">{filing.filing}</td>
                  <td className="px-4 py-3 text-slate-600">{filing.frequency}</td>
                  <td className="px-4 py-3 text-slate-600">{filing.dueDate}</td>
                  <td className="px-4 py-3 text-slate-600">{filing.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expansion Plans */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Globe className="w-6 h-6" />
          Expansion Roadmap
        </h2>
        <p className="text-teal-100 mb-6">
          Our licensing expansion strategy to serve more markets.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-white/10 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-teal-300" />
              <h3 className="font-semibold">Phase 1 (Current)</h3>
            </div>
            <p className="text-sm text-teal-100">
              Focus on high-volume states with strong fitness and adventure markets
            </p>
          </div>
          <div className="p-5 bg-white/10 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-teal-300" />
              <h3 className="font-semibold">Phase 2 (2025)</h3>
            </div>
            <p className="text-sm text-teal-100">
              Expand to additional populous states, achieve nationwide non-resident licensing
            </p>
          </div>
          <div className="p-5 bg-white/10 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-teal-300" />
              <h3 className="font-semibold">Phase 3 (2026+)</h3>
            </div>
            <p className="text-sm text-teal-100">
              Full 50-state licensing, MGA/MGU designation pursuit
            </p>
          </div>
        </div>
      </div>

      {/* Related Documents */}
      <div className="flex flex-wrap items-center gap-6 text-sm pt-8 border-t border-slate-200">
        <span className="text-slate-500">Related Documentation:</span>
        <Link
          href="/insurance/compliance/consumer-protection"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          Consumer Protection
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          href="/insurance/compliance/aml-kyc"
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium"
        >
          AML/KYC Program
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
