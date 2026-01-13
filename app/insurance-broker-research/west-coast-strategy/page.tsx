import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "West Coast Insurance Expansion Strategy | LDASD",
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
            Expansion Playbook
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
            West Coast Expansion Strategy
          </h1>
          <p className="text-lg text-foreground/80 max-w-3xl">
            Strategic playbook for establishing insurance brokerage operations across California, Oregon, Washington, Nevada, and Arizona.
          </p>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Market Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-sky rounded-xl overflow-hidden">
              <thead className="bg-tan">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">State</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Market Size</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Broker Share</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Growth Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Key Segments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {markets.map((market) => (
                  <tr key={market.state} className="hover:bg-sky/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{market.state}</td>
                    <td className="px-6 py-4 text-secondary font-medium">{market.market}</td>
                    <td className="px-6 py-4 text-foreground/80">{market.share}</td>
                    <td className="px-6 py-4 text-foreground/80">{market.growth}</td>
                    <td className="px-6 py-4 text-foreground/80 text-sm">{market.segments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Phased Expansion */}
      <section className="py-16 bg-sky">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Phased Expansion Timeline</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { phase: "Phase 1", title: "West Coast Foundation", timeline: "Months 1-12", markets: "CA, NV", investment: "$45,000", gci: "$2.15M" },
              { phase: "Phase 2", title: "Southwest Expansion", timeline: "Months 13-18", markets: "AZ", investment: "$15,000", gci: "$630K" },
              { phase: "Phase 3", title: "Pacific Northwest", timeline: "Months 19-24", markets: "OR, WA", investment: "$20,000", gci: "$1.3M" },
              { phase: "Phase 4", title: "National Rollout", timeline: "Months 25-36+", markets: "Remaining", investment: "$70,000", gci: "$3.0M+" },
            ].map((phase) => (
              <div key={phase.phase} className="bg-white rounded-2xl p-6 shadow-premium">
                <span className="text-secondary font-bold text-sm">{phase.phase}</span>
                <h3 className="font-bold text-primary text-lg mt-2 mb-4">{phase.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Timeline:</span>
                    <span className="font-medium">{phase.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Markets:</span>
                    <span className="font-medium">{phase.markets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Investment:</span>
                    <span className="font-medium text-secondary">{phase.investment}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="text-foreground/70">Target GCI:</span>
                    <span className="font-bold text-primary">{phase.gci}</span>
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
              <h2 className="text-2xl font-bold text-foreground mb-6">California: The Anchor Market</h2>
              <p className="text-foreground/80 mb-4">
                California represents <strong>40%+ of West Coast premium volume</strong> and is the largest state insurance market nationally.
                Success in California establishes credibility and carrier relationships for expansion.
              </p>
              <h3 className="text-lg font-bold text-primary mt-6 mb-3">CDI Requirements</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Designated Responsible Licensed Producer (DRLP) required",
                  "DRLP must be California resident",
                  "E&O Insurance: $100K-$300K minimum",
                  "Trust Account required for premium deposits",
                  "Processing time: 8-12 weeks",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-sand rounded-2xl p-8">
              <h3 className="text-lg font-bold text-primary mb-4">Target Market Segments</h3>
              <div className="space-y-4">
                {[
                  { segment: "Professional Services", size: "$2.8B", margin: "25-35%" },
                  { segment: "Technology Companies", size: "$3.2B", margin: "30-40%" },
                  { segment: "Healthcare Providers", size: "$1.9B", margin: "20-25%" },
                  { segment: "Light Manufacturing", size: "$4.5B", margin: "18-22%" },
                ].map((item) => (
                  <div key={item.segment} className="bg-white rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-primary">{item.segment}</p>
                      <p className="text-sm text-foreground/60">Market: {item.size}</p>
                    </div>
                    <span className="text-secondary font-bold">{item.margin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Projections */}
      <section className="py-16 bg-tan">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">3-Year Revenue Projections</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { year: "Year 1", revenue: "$2.15M", margin: "21%", profit: "$450K" },
              { year: "Year 2", revenue: "$4.08M", margin: "34%", profit: "$1.38M" },
              { year: "Year 3", revenue: "$7.23M", margin: "48%", profit: "$3.48M" },
            ].map((item) => (
              <div key={item.year} className="bg-white rounded-2xl p-8 shadow-premium">
                <h3 className="font-bold text-primary mb-4">{item.year}</h3>
                <p className="text-3xl font-bold text-secondary mb-2">{item.revenue}</p>
                <p className="text-foreground/70">Gross Commission Income</p>
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Margin:</span>
                    <span className="font-medium">{item.margin}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Profit:</span>
                    <span className="font-bold text-secondary">{item.profit}</span>
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
            <Link href="/insurance-broker-research/licensing-costs" className="px-6 py-3 bg-sky rounded-full text-primary font-medium hover:shadow-premium transition-all">
              ← Licensing Costs
            </Link>
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-white border border-gray-300 rounded-full text-primary font-medium hover:shadow-premium transition-all">
              Research Portal
            </Link>
            <Link href="/insurance-broker-research/compliance" className="px-6 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary-light transition-all">
              Compliance Guide →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
