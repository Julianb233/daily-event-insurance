import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broker of Record Requirements: Complete Licensing Guide | LDASD",
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
    <div className="bg-background">
      {/* Hero */}
      <section className="relative py-20 bg-tan overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/insurance-broker-research" className="inline-flex items-center text-secondary hover:text-secondary-light mb-6 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Research Portal
          </Link>
          <span className="inline-block text-secondary font-semibold tracking-wider text-sm uppercase mb-4">
            Licensing Guide
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
            Broker of Record Requirements
          </h1>
          <p className="text-lg text-foreground/80 max-w-3xl">
            Complete guide to becoming a licensed Insurance Broker of Record in the United States.
          </p>
        </div>
      </section>

      {/* What is a BOR */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">What is a Broker of Record?</h2>
              <p className="text-foreground/80 mb-4">
                A Broker of Record (BOR) is the licensed insurance professional or entity designated to represent and service a client's insurance policies.
                The BOR has exclusive authority to make changes, receive commissions, and act on behalf of the policyholder.
              </p>
              <h3 className="text-lg font-bold text-primary mt-6 mb-3">Key Responsibilities</h3>
              <ul className="space-y-2">
                {[
                  "Policy placement and management",
                  "Claims advocacy and support",
                  "Coverage analysis and recommendations",
                  "Renewal negotiations",
                  "Risk assessment and mitigation",
                  "Compliance with state regulations",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-sky rounded-2xl p-8">
              <h3 className="text-lg font-bold text-primary mb-4">BOR vs. Agent vs. Adjuster</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4">
                  <p className="font-bold text-primary">Broker of Record</p>
                  <p className="text-sm text-foreground/70">Represents the client, can work with multiple carriers, earns commissions from placed business.</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="font-bold text-primary">Captive Agent</p>
                  <p className="text-sm text-foreground/70">Represents a single insurance carrier, limited product offerings, employed by or contracted with one company.</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="font-bold text-primary">Claims Adjuster</p>
                  <p className="text-sm text-foreground/70">Evaluates and settles claims, works for carrier or independently, does not sell or service policies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* License Types */}
      <section className="py-16 bg-sky">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">License Types</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden">
              <thead className="bg-tan">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">License Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Lines of Authority</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Education</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Examination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {licenseTypes.map((license) => (
                  <tr key={license.type} className="hover:bg-sky/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{license.type}</td>
                    <td className="px-6 py-4 text-foreground/80 text-sm">{license.lines}</td>
                    <td className="px-6 py-4 text-foreground/80 text-sm">{license.education}</td>
                    <td className="px-6 py-4 text-foreground/80 text-sm">{license.exam}</td>
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
          <h2 className="text-2xl font-bold text-foreground mb-8">Licensing Timeline</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {timeline.map((step, i) => (
              <div key={step.phase} className="relative">
                <div className="bg-sand rounded-xl p-6 h-full">
                  <div className="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-primary mb-2">{step.phase}</h3>
                  <p className="text-sm text-foreground/70">Duration: {step.duration}</p>
                  <p className="text-sm text-secondary font-medium mt-1">Cost: {step.cost}</p>
                </div>
                {i < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-secondary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Requirements */}
      <section className="py-16 bg-sand">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Key Requirements Summary</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Pre-Licensing Education", desc: "20-40 hours per line of authority, state-approved courses" },
              { title: "State Examination", desc: "70-75% passing score, proctored exam, multiple choice format" },
              { title: "Background Check", desc: "FBI fingerprint check, clean criminal record required" },
              { title: "E&O Insurance", desc: "$100K-$1M coverage, required in most states" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-premium">
                <h3 className="font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/insurance-broker-research/executive-summary" className="px-6 py-3 bg-sky rounded-full text-primary font-medium hover:shadow-premium transition-all">
              ← Executive Summary
            </Link>
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-white border border-gray-300 rounded-full text-primary font-medium hover:shadow-premium transition-all">
              Research Portal
            </Link>
            <Link href="/insurance-broker-research/licensing-costs" className="px-6 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary-light transition-all">
              Licensing Costs →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
