import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Executive Summary: 50-State Insurance Broker Initiative | HiQor",
  description: "Strategic overview of establishing a multi-state insurance brokerage. Investment requirements, ROI projections, and implementation roadmap.",
  keywords: "insurance broker business plan, broker of record ROI, insurance startup",
};

export default function ExecutiveSummaryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/insurance-broker-research" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-8 transition-colors group">
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Research Portal
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30 mb-6">
            <span className="text-teal-400 font-semibold text-sm">Executive Summary</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            50-State Insurance{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300">
              Broker Initiative
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl">
            Strategic overview and key recommendations for establishing a multi-state Broker of Record operation.
          </p>
        </div>
      </section>

      {/* At a Glance */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">At a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Total Investment Required", value: "$75K - $150K" },
              { label: "Time to Market (West Coast)", value: "6-12 months" },
              { label: "Time to 50-State Coverage", value: "18-36 months" },
              { label: "Addressable Market", value: "$48B+" },
              { label: "Year 3 Revenue Projection", value: "$7.2M" },
              { label: "Year 3 Net Margin", value: "28%" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-2xl p-5 text-center border border-slate-200 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1 transition-all">
                <p className="text-2xl font-bold text-teal-600 mb-2">{item.value}</p>
                <p className="text-xs text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6">
                <span className="text-teal-600 font-semibold text-sm">Market Analysis</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">The Opportunity</h2>
              <p className="text-slate-600 mb-6">
                The U.S. property and casualty insurance market exceeds <strong className="text-slate-900">$800 billion</strong> in annual premiums.
                The West Coast region alone represents over <strong className="text-slate-900">$48 billion</strong>, with California being the largest state market nationally.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Why Now?</h3>
              <div className="space-y-3">
                {[
                  "Digital transformation is disrupting traditional distribution",
                  "Consolidation creates opportunities for specialized brokers",
                  "Regulatory complexity favors well-organized operations",
                  "Remote work enables cost-effective multi-state operations",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-teal-500/10 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Strategic Recommendation</h3>
              <p className="text-slate-600 mb-6">
                <strong className="text-teal-600">Phased West Coast Expansion</strong> starting with California as the anchor market:
              </p>
              <div className="space-y-4">
                {[
                  { phase: "Phase 1: California + Nevada", amount: "$45,000" },
                  { phase: "Phase 2: Arizona", amount: "$15,000" },
                  { phase: "Phase 3: Oregon + Washington", amount: "$20,000" },
                  { phase: "Phase 4: National Expansion", amount: "$70,000" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700">{item.phase}</span>
                    <span className="text-teal-600 font-semibold">{item.amount}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t-2 border-teal-500">
                  <span className="font-bold text-slate-900">Total Investment</span>
                  <span className="font-bold text-teal-600 text-lg">$150,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Financial Projections</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Investment Requirements</h3>
              <div className="space-y-3">
                {[
                  { cat: "Licensing & Registration", val: "$25K - $45K" },
                  { cat: "E&O Insurance", val: "$5K - $15K" },
                  { cat: "Technology & Systems", val: "$10K - $25K" },
                  { cat: "Professional Services", val: "$10K - $20K" },
                  { cat: "Working Capital", val: "$25K - $45K" },
                ].map((item) => (
                  <div key={item.cat} className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                    <span className="text-slate-600">{item.cat}</span>
                    <span className="font-medium text-slate-900">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Revenue Projections</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-300">
                      <th className="py-3 text-left text-sm font-bold text-slate-900">Year</th>
                      <th className="py-3 text-left text-sm font-bold text-slate-900">Revenue</th>
                      <th className="py-3 text-left text-sm font-bold text-slate-900">Margin</th>
                      <th className="py-3 text-left text-sm font-bold text-slate-900">Net Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { y: "1", r: "$2.15M", m: "15%", n: "$322K" },
                      { y: "2", r: "$4.08M", m: "22%", n: "$898K" },
                      { y: "3", r: "$7.23M", m: "28%", n: "$2.02M" },
                    ].map((row) => (
                      <tr key={row.y} className="border-b border-slate-200 last:border-0">
                        <td className="py-3 font-medium text-slate-900">Year {row.y}</td>
                        <td className="py-3 text-slate-600">{row.r}</td>
                        <td className="py-3 text-slate-600">{row.m}</td>
                        <td className="py-3 text-teal-600 font-semibold">{row.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-16 bg-gradient-to-br from-teal-500 to-teal-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Return on Investment</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: "14-18", label: "Months to Breakeven" },
              { value: "624%+", label: "3-Year ROI" },
              { value: "$11.25M", label: "Exit Value (3x EBITDA)" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-4xl font-bold text-white mb-2">{item.value}</p>
                <p className="text-teal-100">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Immediate Actions Required</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { week: "Week 1", action: "Board approval of strategic initiative" },
              { week: "Week 2", action: "Identify and secure DRLP candidate" },
              { week: "Week 3", action: "Engage legal counsel for entity formation" },
              { week: "Week 4", action: "Begin California license application" },
            ].map((item, i) => (
              <div key={item.week} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:shadow-teal-500/10 transition-shadow">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold">{i + 1}</span>
                </div>
                <p className="text-sm font-bold text-teal-600 mb-2">{item.week}</p>
                <p className="text-slate-700">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-white rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow">
              Back to Portal
            </Link>
            <Link href="/insurance-broker-research/bor-requirements" className="px-6 py-3 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-colors inline-flex items-center gap-2">
              BOR Requirements
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
