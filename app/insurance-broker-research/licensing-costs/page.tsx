import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Licensing Costs: 50-State Analysis | HiQor",
  description: "Complete cost breakdown for insurance licensing in all 50 states. Fees, education costs, and multi-state licensing strategies.",
  keywords: "insurance license cost, state licensing fees, NIPR costs",
};

const westCoastCosts = [
  { state: "California", initial: "$500-$750", annual: "$1,450-$2,450", tier: "High" },
  { state: "Oregon", initial: "$575-$925", annual: "$1,000-$1,800", tier: "Moderate" },
  { state: "Washington", initial: "$675-$1,100", annual: "$1,250-$2,300", tier: "Moderate" },
  { state: "Nevada", initial: "$525-$825", annual: "$875-$1,625", tier: "Moderate" },
  { state: "Arizona", initial: "$475-$800", annual: "$750-$1,450", tier: "Low" },
];

const costTiers = [
  { tier: "Low Cost (<$225)", states: "16 states", examples: "AR, KS, MS, ND, SD, WY", avg: "$191" },
  { tier: "Moderate ($225-$350)", states: "28 states", examples: "AZ, NV, OR, TX, FL", avg: "$261" },
  { tier: "High Cost ($350+)", states: "6 states", examples: "CA, NY, WA, MA, NJ, PA", avg: "$433" },
];

export default function LicensingCostsPage() {
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
            <span className="text-teal-600 font-semibold text-sm">Cost Analysis</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            50-State{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              Licensing Costs
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl">
            Comprehensive cost analysis for insurance broker licensing across all 50 states.
          </p>
        </div>
      </section>

      {/* Cost Tiers */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Cost Tiers by State</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {costTiers.map((tier, i) => (
              <div key={tier.tier} className={`rounded-2xl p-8 border ${
                i === 0 ? 'bg-green-50 border-green-200' :
                i === 1 ? 'bg-amber-50 border-amber-200' :
                'bg-red-50 border-red-200'
              }`}>
                <h3 className="font-bold text-slate-900 text-lg mb-4">{tier.tier}</h3>
                <p className={`text-4xl font-bold mb-2 ${
                  i === 0 ? 'text-green-600' :
                  i === 1 ? 'text-amber-600' :
                  'text-red-600'
                }`}>{tier.avg}</p>
                <p className="text-sm text-slate-600 mb-1">Average Initial Cost</p>
                <p className="text-sm text-slate-500 mb-4">{tier.states}</p>
                <p className="text-xs text-slate-400">Examples: {tier.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* West Coast Deep Dive */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">West Coast Cost Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-lg shadow-teal-500/5 border border-slate-200">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">State</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Initial Investment</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Annual Costs</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white">Cost Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {westCoastCosts.map((state) => (
                  <tr key={state.state} className="hover:bg-teal-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{state.state}</td>
                    <td className="px-6 py-4 text-slate-600">{state.initial}</td>
                    <td className="px-6 py-4 text-slate-600">{state.annual}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        state.tier === 'High' ? 'bg-red-100 text-red-700' :
                        state.tier === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {state.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Additional Costs */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Additional Costs Beyond Licensing</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: "Pre-licensing Education", range: "$150 - $800", note: "Per line of authority" },
              { category: "Exam Fees", range: "$75 - $300", note: "Per examination attempt" },
              { category: "Background Check", range: "$50 - $180", note: "FBI fingerprinting" },
              { category: "NIPR Registration", range: "$100 - $150", note: "Annual fee" },
              { category: "E&O Insurance", range: "$600 - $2,500+", note: "Annual premium - BIGGEST COST", highlight: true },
              { category: "Continuing Education", range: "$50 - $200", note: "Annual requirement" },
            ].map((item) => (
              <div key={item.category} className={`rounded-2xl p-6 border ${
                item.highlight ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="font-bold text-slate-900 mb-2">{item.category}</h3>
                <p className={`text-2xl font-bold mb-1 ${item.highlight ? 'text-teal-600' : 'text-slate-900'}`}>{item.range}</p>
                <p className="text-sm text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Total Investment Scenarios */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Total Investment Scenarios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { scenario: "Single State", initial: "$475-$1,075", annual: "$1,475-$2,575", states: "1" },
              { scenario: "5-State Regional", initial: "$2,800-$6,050", annual: "$1,800-$3,500", states: "5" },
              { scenario: "15-State Operation", initial: "$6,150-$13,700", annual: "$4,200-$7,500", states: "15" },
              { scenario: "All 50 States", initial: "$20,100-$55,150", annual: "$12,000-$30,000", states: "50" },
            ].map((item) => (
              <div key={item.scenario} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-4">{item.scenario}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">States:</span>
                    <span className="font-medium text-white">{item.states}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Initial:</span>
                    <span className="font-medium text-teal-400">{item.initial}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual:</span>
                    <span className="font-medium text-white">{item.annual}</span>
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
            <Link href="/insurance-broker-research/bor-requirements" className="px-6 py-3 bg-white rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              BOR Requirements
            </Link>
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-white rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow">
              Research Portal
            </Link>
            <Link href="/insurance-broker-research/west-coast-strategy" className="px-6 py-3 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-colors inline-flex items-center gap-2">
              West Coast Strategy
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
