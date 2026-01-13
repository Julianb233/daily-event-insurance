import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Broker Regulatory Compliance Guide | HiQor",
  description: "Comprehensive compliance framework for multi-state insurance brokers. Federal, state, and NAIC requirements.",
  keywords: "insurance compliance, insurance regulations, broker compliance requirements",
};

export default function CompliancePage() {
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
            <span className="text-teal-600 font-semibold text-sm">Regulatory Framework</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Compliance{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              Guide
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl">
            Comprehensive compliance framework for multi-state insurance broker operations.
          </p>
        </div>
      </section>

      {/* Regulatory Bodies */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Regulatory Bodies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { level: "Federal", body: "FTC, OFAC, FinCEN", focus: "Consumer protection, sanctions, AML" },
              { level: "State", body: "DOI (Dept of Insurance)", focus: "Licensing, market conduct" },
              { level: "Industry", body: "NAIC", focus: "Model laws, standards" },
              { level: "Self-Regulatory", body: "NAIFA, IIABA", focus: "Best practices, ethics" },
            ].map((item) => (
              <div key={item.level} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:shadow-teal-500/10 transition-shadow">
                <span className="text-teal-600 font-bold text-sm">{item.level}</span>
                <h3 className="font-bold text-slate-900 text-lg mt-2 mb-2">{item.body}</h3>
                <p className="text-sm text-slate-600">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Federal Requirements */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Federal Compliance Requirements</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg shadow-teal-500/5">
              <h3 className="font-bold text-slate-900 text-xl mb-6">GLBA (Gramm-Leach-Bliley Act)</h3>
              <div className="space-y-4">
                {[
                  "Privacy Notice: Provide initial and annual privacy notices",
                  "Safeguards Rule: Implement written information security programs",
                  "Pretexting Protection: Protect against fraudulent data access",
                  "Customer Information: Secure nonpublic personal information",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg shadow-teal-500/5">
              <h3 className="font-bold text-slate-900 text-xl mb-6">OFAC & AML Requirements</h3>
              <div className="space-y-4">
                {[
                  "Screen all clients against SDN (Specially Designated Nationals) list",
                  "Implement AML program for life insurance and annuities",
                  "File SARs (Suspicious Activity Reports) within 30 days",
                  "Report cash transactions over $10,000 (CTR)",
                  "Annual AML training for all personnel",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* State CE Requirements */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Continuing Education Requirements</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-lg shadow-teal-500/5 border border-slate-200">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">State</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Total Hours</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Ethics Hours</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Renewal Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { state: "California", hours: "24", ethics: "3", period: "2 years" },
                  { state: "Florida", hours: "24", ethics: "5", period: "2 years" },
                  { state: "Texas", hours: "30", ethics: "2", period: "2 years" },
                  { state: "New York", hours: "15", ethics: "3", period: "2 years" },
                  { state: "Oregon", hours: "24", ethics: "3", period: "2 years" },
                  { state: "Washington", hours: "24", ethics: "3", period: "2 years" },
                ].map((state) => (
                  <tr key={state.state} className="hover:bg-teal-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{state.state}</td>
                    <td className="px-6 py-4 text-slate-600">{state.hours}</td>
                    <td className="px-6 py-4 text-slate-600">{state.ethics}</td>
                    <td className="px-6 py-4 text-slate-600">{state.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Record Keeping */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Record Keeping Requirements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: "Client Applications", period: "7 years", note: "After policy expiration" },
              { type: "Policies Issued", period: "7 years", note: "After expiration" },
              { type: "Claims Files", period: "10 years", note: "After closure" },
              { type: "Commission Records", period: "7 years", note: "All records" },
              { type: "CE Certificates", period: "5+ years", note: "Recommend permanent" },
              { type: "E&O Claims", period: "Permanent", note: "Including closed" },
            ].map((item) => (
              <div key={item.type} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-2">{item.type}</h3>
                <p className="text-3xl font-bold text-teal-400 mb-1">{item.period}</p>
                <p className="text-sm text-slate-400">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top 10 Priorities */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Top 10 Compliance Priorities</h2>
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
              <div key={i} className="flex items-start gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/insurance-broker-research/west-coast-strategy" className="px-6 py-3 bg-white rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              West Coast Strategy
            </Link>
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-colors">
              Back to Research Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-500">
            <strong>Disclaimer:</strong> This compliance guide is for informational purposes only and does not constitute legal or regulatory advice.
            Consult with qualified professionals for advice specific to your business operations.
          </p>
        </div>
      </section>
    </div>
  );
}
