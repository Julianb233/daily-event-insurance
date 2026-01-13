import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "West Coast Insurance Expansion Strategy | HiQor",
  description: "Strategic playbook for West Coast insurance market expansion. California, Oregon, Washington, Nevada, and Arizona market analysis.",
  keywords: "west coast insurance market, California insurance broker, insurance expansion strategy",
};

const markets = [
  { state: "California", market: "$35-40B", share: "65-70%", growth: "4-6%", segments: "Tech, Professional Services, Healthcare" },
  { state: "Oregon", market: "$2.8-3.2B", share: "60-65%", growth: "5-7%", segments: "Tech, Timber, Craft Beverage" },
  { state: "Washington", market: "$3.5-4.0B", share: "65-70%", growth: "6-8%", segments: "Tech, Aerospace, Healthcare" },
  { state: "Nevada", market: "$1.5-1.8B", share: "55-60%", growth: "7-9%", segments: "Hospitality, Gaming, Construction" },
  { state: "Arizona", market: "$3.2-3.8B", share: "58-63%", growth: "7-9%", segments: "Retiree Services, Construction, SMB" },
];

export default function WestCoastStrategyPage() {
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
            <span className="text-teal-400 font-semibold text-sm">Expansion Playbook</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            West Coast{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300">
              Expansion Strategy
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl">
            Strategic playbook for establishing insurance brokerage operations across California, Oregon, Washington, Nevada, and Arizona.
          </p>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Market Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-lg shadow-teal-500/5 border border-slate-200">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">State</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Market Size</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Broker Share</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Growth Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Key Segments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {markets.map((market) => (
                  <tr key={market.state} className="hover:bg-teal-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{market.state}</td>
                    <td className="px-6 py-4 text-teal-600 font-semibold">{market.market}</td>
                    <td className="px-6 py-4 text-slate-600">{market.share}</td>
                    <td className="px-6 py-4 text-slate-600">{market.growth}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{market.segments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Phased Expansion */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Phased Expansion Timeline</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { phase: "Phase 1", title: "West Coast Foundation", timeline: "Months 1-12", markets: "CA, NV", investment: "$45,000", gci: "$2.15M" },
              { phase: "Phase 2", title: "Southwest Expansion", timeline: "Months 13-18", markets: "AZ", investment: "$15,000", gci: "$630K" },
              { phase: "Phase 3", title: "Pacific Northwest", timeline: "Months 19-24", markets: "OR, WA", investment: "$20,000", gci: "$1.3M" },
              { phase: "Phase 4", title: "National Rollout", timeline: "Months 25-36+", markets: "Remaining", investment: "$70,000", gci: "$3.0M+" },
            ].map((phase, i) => (
              <div key={phase.phase} className="bg-white rounded-2xl p-6 shadow-lg shadow-teal-500/10 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{i + 1}</span>
                  </div>
                  <span className="text-teal-600 font-bold">{phase.phase}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-4">{phase.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timeline:</span>
                    <span className="font-medium text-slate-900">{phase.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Markets:</span>
                    <span className="font-medium text-slate-900">{phase.markets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Investment:</span>
                    <span className="font-medium text-teal-600">{phase.investment}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                    <span className="text-slate-500">Target GCI:</span>
                    <span className="font-bold text-slate-900">{phase.gci}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* California Focus */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6">
                <span className="text-teal-600 font-semibold text-sm">Primary Market</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">California: The Anchor Market</h2>
              <p className="text-slate-600 mb-6">
                California represents <strong className="text-slate-900">40%+ of West Coast premium volume</strong> and is the largest state insurance market nationally.
                Success in California establishes credibility and carrier relationships for expansion.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">CDI Requirements</h3>
              <div className="space-y-3">
                {[
                  "Designated Responsible Licensed Producer (DRLP) required",
                  "DRLP must be California resident",
                  "E&O Insurance: $100K-$300K minimum",
                  "Trust Account required for premium deposits",
                  "Processing time: 8-12 weeks",
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

            <div className="bg-slate-900 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Target Market Segments</h3>
              <div className="space-y-4">
                {[
                  { segment: "Professional Services", size: "$2.8B", margin: "25-35%" },
                  { segment: "Technology Companies", size: "$3.2B", margin: "30-40%" },
                  { segment: "Healthcare Providers", size: "$1.9B", margin: "20-25%" },
                  { segment: "Light Manufacturing", size: "$4.5B", margin: "18-22%" },
                ].map((item) => (
                  <div key={item.segment} className="bg-white/10 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-white">{item.segment}</p>
                      <p className="text-sm text-slate-400">Market: {item.size}</p>
                    </div>
                    <span className="text-teal-400 font-bold">{item.margin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Projections */}
      <section className="py-16 bg-gradient-to-br from-teal-500 to-teal-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">3-Year Revenue Projections</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { year: "Year 1", revenue: "$2.15M", margin: "21%", profit: "$450K" },
              { year: "Year 2", revenue: "$4.08M", margin: "34%", profit: "$1.38M" },
              { year: "Year 3", revenue: "$7.23M", margin: "48%", profit: "$3.48M" },
            ].map((item) => (
              <div key={item.year} className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="font-bold text-slate-900 mb-4">{item.year}</h3>
                <p className="text-4xl font-bold text-teal-600 mb-2">{item.revenue}</p>
                <p className="text-slate-500">Gross Commission Income</p>
                <div className="border-t border-slate-200 mt-4 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Margin:</span>
                    <span className="font-medium text-slate-900">{item.margin}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-500">Profit:</span>
                    <span className="font-bold text-teal-600">{item.profit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/insurance-broker-research/licensing-costs" className="px-6 py-3 bg-white rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Licensing Costs
            </Link>
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-white rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow">
              Research Portal
            </Link>
            <Link href="/insurance-broker-research/compliance" className="px-6 py-3 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-colors inline-flex items-center gap-2">
              Compliance Guide
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
