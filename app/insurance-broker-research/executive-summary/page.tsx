import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Executive Summary: 50-State Insurance Broker Initiative | LDASD",
  description: "Strategic overview of establishing a multi-state insurance brokerage. Investment requirements, ROI projections, and implementation roadmap.",
  keywords: "insurance broker business plan, broker of record ROI, insurance startup",
};

export default function ExecutiveSummaryPage() {
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
            Executive Summary
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl mb-6">
            50-State Insurance Broker Initiative
          </h1>
          <p className="text-lg text-foreground/80 max-w-3xl">
            Strategic overview and key recommendations for establishing a multi-state Broker of Record operation.
          </p>
        </div>
      </section>

      {/* At a Glance */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">At a Glance</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Total Investment Required", value: "$75K - $150K" },
              { label: "Time to Market (West Coast)", value: "6-12 months" },
              { label: "Time to 50-State Coverage", value: "18-36 months" },
              { label: "Addressable Market", value: "$48B+" },
              { label: "Year 3 Revenue Projection", value: "$7.2M" },
              { label: "Year 3 Net Margin", value: "28%" },
            ].map((item) => (
              <div key={item.label} className="bg-sky rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-primary">{item.value}</p>
                <p className="text-xs text-foreground/70 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-16 bg-sky">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">The Opportunity</h2>
              <p className="text-foreground/80 mb-4">
                The U.S. property and casualty insurance market exceeds <strong>$800 billion</strong> in annual premiums.
                The West Coast region alone represents over <strong>$48 billion</strong>, with California being the largest state market nationally.
              </p>
              <h3 className="text-lg font-bold text-primary mt-6 mb-3">Why Now?</h3>
              <ul className="space-y-2">
                {[
                  "Digital transformation is disrupting traditional distribution",
                  "Consolidation creates opportunities for specialized brokers",
                  "Regulatory complexity favors well-organized operations",
                  "Remote work enables cost-effective multi-state operations",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-premium">
              <h3 className="text-lg font-bold text-primary mb-4">Strategic Recommendation</h3>
              <p className="text-foreground/80 mb-6">
                <strong>Phased West Coast Expansion</strong> starting with California as the anchor market:
              </p>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span>Phase 1: California + Nevada</span>
                  <span className="text-secondary">$45,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Phase 2: Arizona</span>
                  <span className="text-secondary">$15,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Phase 3: Oregon + Washington</span>
                  <span className="text-secondary">$20,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Phase 4: National Expansion</span>
                  <span className="text-secondary">$70,000</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                  <span>Total Investment</span>
                  <span className="text-secondary">$150,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Financial Projections</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-sand rounded-2xl p-6">
              <h3 className="text-lg font-bold text-primary mb-4">Investment Requirements</h3>
              <div className="space-y-2 text-sm">
                {[
                  { cat: "Licensing & Registration", val: "$25K - $45K" },
                  { cat: "E&O Insurance", val: "$5K - $15K" },
                  { cat: "Technology & Systems", val: "$10K - $25K" },
                  { cat: "Professional Services", val: "$10K - $20K" },
                  { cat: "Working Capital", val: "$25K - $45K" },
                ].map((item) => (
                  <div key={item.cat} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                    <span>{item.cat}</span>
                    <span className="font-medium">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-sand rounded-2xl p-6">
              <h3 className="text-lg font-bold text-primary mb-4">Revenue Projections</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 text-left">Year</th>
                    <th className="py-2 text-left">Revenue</th>
                    <th className="py-2 text-left">Margin</th>
                    <th className="py-2 text-left">Net Income</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { y: "1", r: "$2.15M", m: "15%", n: "$322K" },
                    { y: "2", r: "$4.08M", m: "22%", n: "$898K" },
                    { y: "3", r: "$7.23M", m: "28%", n: "$2.02M" },
                  ].map((row) => (
                    <tr key={row.y} className="border-b border-gray-200 last:border-0">
                      <td className="py-2 font-medium">Year {row.y}</td>
                      <td className="py-2">{row.r}</td>
                      <td className="py-2">{row.m}</td>
                      <td className="py-2 text-secondary font-medium">{row.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-16 bg-tan">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">Return on Investment</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-premium">
              <p className="text-3xl font-bold text-secondary">14-18</p>
              <p className="text-foreground/70 mt-1">Months to Breakeven</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-premium">
              <p className="text-3xl font-bold text-secondary">624%+</p>
              <p className="text-foreground/70 mt-1">3-Year ROI</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-premium">
              <p className="text-3xl font-bold text-secondary">$11.25M</p>
              <p className="text-foreground/70 mt-1">Exit Value (3x EBITDA)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Immediate Actions Required</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { week: "Week 1", action: "Board approval of strategic initiative" },
              { week: "Week 2", action: "Identify and secure DRLP candidate" },
              { week: "Week 3", action: "Engage legal counsel for entity formation" },
              { week: "Week 4", action: "Begin California license application" },
            ].map((item) => (
              <div key={item.week} className="bg-sky rounded-xl p-6">
                <p className="text-sm font-bold text-secondary mb-2">{item.week}</p>
                <p className="text-foreground/80">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-sand">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-white rounded-full text-primary font-medium hover:shadow-premium transition-all">
              Back to Portal
            </Link>
            <Link href="/insurance-broker-research/bor-requirements" className="px-6 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary-light transition-all">
              BOR Requirements →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
