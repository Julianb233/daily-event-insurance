import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Licensing Costs: 50-State Analysis | LDASD",
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
            Cost Analysis
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
            50-State Licensing Costs
          </h1>
          <p className="text-lg text-foreground/80 max-w-3xl">
            Comprehensive cost analysis for insurance broker licensing across all 50 states.
          </p>
        </div>
      </section>

      {/* Cost Tiers */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Cost Tiers by State</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {costTiers.map((tier) => (
              <div key={tier.tier} className="bg-sky rounded-2xl p-6">
                <h3 className="font-bold text-primary text-lg mb-2">{tier.tier}</h3>
                <p className="text-3xl font-bold text-secondary mb-2">{tier.avg}</p>
                <p className="text-sm text-foreground/70 mb-1">Average Initial Cost</p>
                <p className="text-sm text-foreground/70 mb-3">{tier.states}</p>
                <p className="text-xs text-foreground/50">Examples: {tier.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* West Coast Deep Dive */}
      <section className="py-16 bg-sky">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">West Coast Cost Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden">
              <thead className="bg-tan">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">State</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Initial Investment</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Annual Costs</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Cost Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {westCoastCosts.map((state) => (
                  <tr key={state.state} className="hover:bg-sky/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{state.state}</td>
                    <td className="px-6 py-4 text-foreground/80">{state.initial}</td>
                    <td className="px-6 py-4 text-foreground/80">{state.annual}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        state.tier === 'High' ? 'bg-red-100 text-red-700' :
                        state.tier === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
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
          <h2 className="text-2xl font-bold text-foreground mb-8">Additional Costs Beyond Licensing</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: "Pre-licensing Education", range: "$150 - $800", note: "Per line of authority" },
              { category: "Exam Fees", range: "$75 - $300", note: "Per examination attempt" },
              { category: "Background Check", range: "$50 - $180", note: "FBI fingerprinting" },
              { category: "NIPR Registration", range: "$100 - $150", note: "Annual fee" },
              { category: "E&O Insurance", range: "$600 - $2,500+", note: "Annual premium - BIGGEST COST" },
              { category: "Continuing Education", range: "$50 - $200", note: "Annual requirement" },
            ].map((item) => (
              <div key={item.category} className="bg-sand rounded-xl p-6">
                <h3 className="font-bold text-primary mb-2">{item.category}</h3>
                <p className="text-2xl font-bold text-secondary mb-1">{item.range}</p>
                <p className="text-sm text-foreground/60">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Total Investment Scenarios */}
      <section className="py-16 bg-sand">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Total Investment Scenarios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { scenario: "Single State", initial: "$475-$1,075", annual: "$1,475-$2,575", states: "1" },
              { scenario: "5-State Regional", initial: "$2,800-$6,050", annual: "$1,800-$3,500", states: "5" },
              { scenario: "15-State Operation", initial: "$6,150-$13,700", annual: "$4,200-$7,500", states: "15" },
              { scenario: "All 50 States", initial: "$20,100-$55,150", annual: "$12,000-$30,000", states: "50" },
            ].map((item) => (
              <div key={item.scenario} className="bg-white rounded-2xl p-6 shadow-premium">
                <h3 className="font-bold text-primary mb-4">{item.scenario}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">States:</span>
                    <span className="font-medium">{item.states}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Initial:</span>
                    <span className="font-medium text-secondary">{item.initial}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Annual:</span>
                    <span className="font-medium">{item.annual}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/insurance-broker-research/bor-requirements" className="px-6 py-3 bg-sky rounded-full text-primary font-medium hover:shadow-premium transition-all">
              ← BOR Requirements
            </Link>
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-white border border-gray-300 rounded-full text-primary font-medium hover:shadow-premium transition-all">
              Research Portal
            </Link>
            <Link href="/insurance-broker-research/west-coast-strategy" className="px-6 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary-light transition-all">
              West Coast Strategy →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
