import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broker of Record Requirements: Complete Licensing Guide | HiQor",
  description: "Detailed requirements for becoming an Insurance Broker of Record. State licensing, education, examinations, and appointment procedures.",
  keywords: "broker of record requirements, insurance license requirements, BOR license",
};

const licenseTypes = [
  { type: "Property & Casualty (P&C)", lines: "Auto, Homeowners, Commercial, Workers' Comp", education: "20-40 hours", exam: "State P&C exam" },
  { type: "Life & Health (L&H)", lines: "Life, Health, Disability, LTC", education: "20-40 hours", exam: "State L&H exam" },
  { type: "Surplus Lines", lines: "Non-admitted carriers, Lloyd's", education: "Additional 20+ hours", exam: "Surplus lines exam" },
];

const timeline = [
  { phase: "Pre-Licensing Education", duration: "1-4 weeks", cost: "$200-$500" },
  { phase: "Examination Preparation", duration: "1-2 weeks", cost: "$50-$150" },
  { phase: "State Examination", duration: "1 day", cost: "$75-$150" },
  { phase: "Application Processing", duration: "4-12 weeks", cost: "$25-$600" },
  { phase: "Carrier Appointments", duration: "2-4 weeks", cost: "$0-$50/carrier" },
];

export default function BORRequirementsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50/30" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/insurance-broker-research" className="inline-flex items-center text-teal-600 hover:text-teal-500 mb-8 transition-colors group">
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Research Portal
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6">
            <span className="text-teal-600 font-semibold text-sm">Licensing Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Broker of Record{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              Requirements
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl">
            Complete guide to becoming a licensed Insurance Broker of Record in the United States.
          </p>
        </div>
      </section>

      {/* What is a BOR */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is a Broker of Record?</h2>
              <p className="text-slate-600 mb-6">
                A Broker of Record (BOR) is the licensed insurance professional or entity designated to represent and service a client's insurance policies.
                The BOR has exclusive authority to make changes, receive commissions, and act on behalf of the policyholder.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Key Responsibilities</h3>
              <div className="space-y-3">
                {[
                  "Policy placement and management",
                  "Claims advocacy and support",
                  "Coverage analysis and recommendations",
                  "Renewal negotiations",
                  "Risk assessment and mitigation",
                  "Compliance with state regulations",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">BOR vs. Agent vs. Adjuster</h3>
              <div className="space-y-4">
                {[
                  { title: "Broker of Record", desc: "Represents the client, can work with multiple carriers, earns commissions from placed business." },
                  { title: "Captive Agent", desc: "Represents a single insurance carrier, limited product offerings, employed by or contracted with one company." },
                  { title: "Claims Adjuster", desc: "Evaluates and settles claims, works for carrier or independently, does not sell or service policies." },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-xl p-5 border border-slate-200">
                    <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* License Types */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">License Types</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-lg shadow-teal-500/5 border border-slate-200">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">License Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Lines of Authority</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Education</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Examination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {licenseTypes.map((license) => (
                  <tr key={license.type} className="hover:bg-teal-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{license.type}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{license.lines}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{license.education}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{license.exam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Licensing Timeline</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {timeline.map((step, i) => (
              <div key={step.phase} className="relative">
                <div className="bg-slate-50 rounded-2xl p-6 h-full border border-slate-200 hover:shadow-lg hover:shadow-teal-500/10 transition-shadow">
                  <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{step.phase}</h3>
                  <p className="text-sm text-slate-600 mb-1">Duration: {step.duration}</p>
                  <p className="text-sm text-teal-600 font-medium">Cost: {step.cost}</p>
                </div>
                {i < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-teal-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Requirements */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Requirements Summary</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Pre-Licensing Education", desc: "20-40 hours per line of authority, state-approved courses" },
              { title: "State Examination", desc: "70-75% passing score, proctored exam, multiple choice format" },
              { title: "Background Check", desc: "FBI fingerprint check, clean criminal record required" },
              { title: "E&O Insurance", desc: "$100K-$1M coverage, required in most states" },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/insurance-broker-research/executive-summary" className="px-6 py-3 bg-white rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Executive Summary
            </Link>
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-white rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow">
              Research Portal
            </Link>
            <Link href="/insurance-broker-research/licensing-costs" className="px-6 py-3 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-colors inline-flex items-center gap-2">
              Licensing Costs
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
