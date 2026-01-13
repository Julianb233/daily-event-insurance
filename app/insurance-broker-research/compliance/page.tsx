import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Broker Regulatory Compliance Guide | LDASD",
  description: "Comprehensive compliance framework for multi-state insurance brokers. Federal, state, and NAIC requirements.",
  keywords: "insurance compliance, insurance regulations, broker compliance requirements",
};

export default function CompliancePage() {
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
            Regulatory Framework
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
            Compliance Guide
          </h1>
          <p className="text-lg text-foreground/80 max-w-3xl">
            Comprehensive compliance framework for multi-state insurance broker operations.
          </p>
        </div>
      </section>

      {/* Regulatory Bodies */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Regulatory Bodies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { level: "Federal", body: "FTC, OFAC, FinCEN", focus: "Consumer protection, sanctions, AML" },
              { level: "State", body: "DOI (Dept of Insurance)", focus: "Licensing, market conduct" },
              { level: "Industry", body: "NAIC", focus: "Model laws, standards" },
              { level: "Self-Regulatory", body: "NAIFA, IIABA", focus: "Best practices, ethics" },
            ].map((item) => (
              <div key={item.level} className="bg-sky rounded-xl p-6">
                <span className="text-secondary font-bold text-sm">{item.level}</span>
                <h3 className="font-bold text-primary text-lg mt-2 mb-2">{item.body}</h3>
                <p className="text-sm text-foreground/70">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Federal Requirements */}
      <section className="py-16 bg-sky">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Federal Compliance Requirements</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-primary text-lg mb-4">GLBA (Gramm-Leach-Bliley Act)</h3>
              <ul className="space-y-3">
                {[
                  "Privacy Notice: Provide initial and annual privacy notices",
                  "Safeguards Rule: Implement written information security programs",
                  "Pretexting Protection: Protect against fraudulent data access",
                  "Customer Information: Secure nonpublic personal information",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-primary text-lg mb-4">OFAC & AML Requirements</h3>
              <ul className="space-y-3">
                {[
                  "Screen all clients against SDN (Specially Designated Nationals) list",
                  "Implement AML program for life insurance and annuities",
                  "File SARs (Suspicious Activity Reports) within 30 days",
                  "Report cash transactions over $10,000 (CTR)",
                  "Annual AML training for all personnel",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* State CE Requirements */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Continuing Education Requirements</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-sky rounded-xl overflow-hidden">
              <thead className="bg-tan">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">State</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Total Hours</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Ethics Hours</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Renewal Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {[
                  { state: "California", hours: "24", ethics: "3", period: "2 years" },
                  { state: "Florida", hours: "24", ethics: "5", period: "2 years" },
                  { state: "Texas", hours: "30", ethics: "2", period: "2 years" },
                  { state: "New York", hours: "15", ethics: "3", period: "2 years" },
                  { state: "Oregon", hours: "24", ethics: "3", period: "2 years" },
                  { state: "Washington", hours: "24", ethics: "3", period: "2 years" },
                ].map((state) => (
                  <tr key={state.state} className="hover:bg-sky/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{state.state}</td>
                    <td className="px-6 py-4 text-foreground/80">{state.hours}</td>
                    <td className="px-6 py-4 text-foreground/80">{state.ethics}</td>
                    <td className="px-6 py-4 text-foreground/80">{state.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Record Keeping */}
      <section className="py-16 bg-sand">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Record Keeping Requirements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: "Client Applications", period: "7 years", note: "After policy expiration" },
              { type: "Policies Issued", period: "7 years", note: "After expiration" },
              { type: "Claims Files", period: "10 years", note: "After closure" },
              { type: "Commission Records", period: "7 years", note: "All records" },
              { type: "CE Certificates", period: "5+ years", note: "Recommend permanent" },
              { type: "E&O Claims", period: "Permanent", note: "Including closed" },
            ].map((item) => (
              <div key={item.type} className="bg-white rounded-xl p-6 shadow-premium">
                <h3 className="font-bold text-primary mb-2">{item.type}</h3>
                <p className="text-2xl font-bold text-secondary mb-1">{item.period}</p>
                <p className="text-sm text-foreground/60">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top 10 Priorities */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Top 10 Compliance Priorities</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Maintain all licenses current - Set calendar reminders 90 days out",
              "Complete CE on time - Track in centralized system",
              "Keep adequate E&O coverage - Review annually",
              "Document everything - If it's not written, it didn't happen",
              "Screen clients - OFAC and AML requirements",
              "Protect data - Implement cybersecurity program",
              "Train staff - Regular compliance education",
              "Follow advertising rules - Review all marketing",
              "Handle complaints properly - Document and respond timely",
              "Prepare for audits - Maintain audit-ready files",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-sky rounded-xl p-4">
                <span className="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-foreground/80 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-tan">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/insurance-broker-research/west-coast-strategy" className="px-6 py-3 bg-white rounded-full text-primary font-medium hover:shadow-premium transition-all">
              ← West Coast Strategy
            </Link>
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary-light transition-all">
              Back to Research Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-xs text-foreground/50">
            <strong>Disclaimer:</strong> This compliance guide is for informational purposes only and does not constitute legal or regulatory advice.
            Consult with qualified professionals for advice specific to your business operations.
          </p>
        </div>
      </section>
    </div>
  );
}
