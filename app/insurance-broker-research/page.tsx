import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Broker of Record: 50-State Licensing Guide | LDASD",
  description: "Comprehensive research hub for establishing a multi-state Insurance Broker of Record operation. Covers licensing requirements, costs, West Coast expansion strategy, and compliance.",
  keywords: "broker of record, insurance licensing, 50 state license, insurance broker, BOR, West Coast insurance",
};

const sections = [
  {
    title: "Executive Summary",
    slug: "/insurance-broker-research/executive-summary",
    description: "High-level overview, key findings, ROI projections, and strategic recommendations",
  },
  {
    title: "BOR Requirements",
    slug: "/insurance-broker-research/bor-requirements",
    description: "Complete licensing requirements including education, exams, and appointments",
  },
  {
    title: "Licensing Costs",
    slug: "/insurance-broker-research/licensing-costs",
    description: "50-state cost analysis with fee breakdowns and multi-state scenarios",
  },
  {
    title: "West Coast Strategy",
    slug: "/insurance-broker-research/west-coast-strategy",
    description: "Regional expansion playbook for CA, OR, WA, NV, and AZ markets",
  },
  {
    title: "Compliance Guide",
    slug: "/insurance-broker-research/compliance",
    description: "Federal and state regulatory requirements, NAIC standards, and audit preparation",
  },
];

const keyMetrics = [
  { label: "Total Initial Investment", value: "$75K - $150K" },
  { label: "Time to 50-State Coverage", value: "12-18 months" },
  { label: "Annual Maintenance", value: "$25K - $40K" },
  { label: "West Coast Market Size", value: "$48B+" },
  { label: "Year 3 Revenue Projection", value: "$7.2M" },
  { label: "Year 3 Net Margin", value: "28%" },
];

const phases = [
  { phase: "Phase 1", markets: "CA, NV", timeline: "Months 1-12", investment: "$45,000" },
  { phase: "Phase 2", markets: "AZ", timeline: "Months 13-18", investment: "$15,000" },
  { phase: "Phase 3", markets: "OR, WA", timeline: "Months 19-24", investment: "$20,000" },
  { phase: "Phase 4", markets: "National", timeline: "Months 25-36+", investment: "$70,000" },
];

const costBreakdown = [
  { category: "Pre-Licensing & Education", range: "$5,000 - $10,000" },
  { category: "State Licensing Fees", range: "$15,000 - $30,000" },
  { category: "Entity Registration", range: "$5,000 - $15,000" },
  { category: "E&O Insurance (Year 1)", range: "$5,000 - $15,000" },
  { category: "Technology & Systems", range: "$10,000 - $25,000" },
  { category: "Legal & Professional", range: "$10,000 - $20,000" },
  { category: "Working Capital Reserve", range: "$25,000 - $35,000" },
];

const revenueProjections = [
  { year: "Year 1", revenue: "$2,150,000", margin: "15%", netIncome: "$322,500" },
  { year: "Year 2", revenue: "$4,080,000", margin: "22%", netIncome: "$897,600" },
  { year: "Year 3", revenue: "$7,230,000", margin: "28%", netIncome: "$2,024,400" },
];

export default function InsuranceBrokerResearchPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 bg-tan overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <span className="inline-block text-secondary font-semibold tracking-wider text-sm uppercase mb-4">
            Strategic Research Portal
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl mb-6">
            Insurance Broker of Record
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-4">
            50-State Licensing & Expansion Guide
          </p>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Comprehensive research hub for establishing a multi-state Insurance Broker of Record operation with focused West Coast regional strategy.
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-secondary font-semibold tracking-wider text-sm uppercase mb-4">
              Key Findings
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              At a Glance
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {keyMetrics.map((metric) => (
              <div key={metric.label} className="bg-sky rounded-xl p-6 text-center hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
                <p className="text-2xl font-bold text-primary mb-2">{metric.value}</p>
                <p className="text-sm text-foreground/70">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 bg-sky">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-secondary font-semibold tracking-wider text-sm uppercase mb-4">
              Research Sections
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Quick Navigation
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link
                key={section.slug}
                href={section.slug}
                className="bg-white rounded-2xl p-8 shadow-premium hover:shadow-premium-hover hover:-translate-y-2 transition-all duration-400 ring-1 ring-black/5 group"
              >
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                  {section.title}
                </h3>
                <p className="text-foreground/80">{section.description}</p>
                <div className="mt-4 flex items-center text-secondary font-medium">
                  View Section
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Expansion Strategy */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-secondary font-semibold tracking-wider text-sm uppercase mb-4">
              Strategic Recommendation
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Phased West Coast Expansion
            </h2>
            <p className="text-lg text-foreground/70 mt-4 max-w-2xl mx-auto">
              Starting with California as the anchor market, expanding to Pacific Northwest and Southwest before national coverage.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-tan">
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Phase</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Markets</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Timeline</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {phases.map((phase) => (
                  <tr key={phase.phase} className="hover:bg-sky/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{phase.phase}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{phase.markets}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{phase.timeline}</td>
                    <td className="px-6 py-4 text-sm font-medium text-secondary">{phase.investment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Financial Summary */}
      <section className="py-16 bg-sand">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Investment Breakdown */}
            <div>
              <span className="inline-block text-secondary font-semibold tracking-wider text-sm uppercase mb-4">
                Investment Required
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
                Initial Cost Breakdown
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-premium">
                <div className="space-y-3">
                  {costBreakdown.map((item) => (
                    <div key={item.category} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-foreground/80">{item.category}</span>
                      <span className="font-medium text-primary">{item.range}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-secondary">
                    <span className="font-bold text-foreground">TOTAL</span>
                    <span className="font-bold text-secondary text-lg">$75,000 - $150,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Projections */}
            <div>
              <span className="inline-block text-secondary font-semibold tracking-wider text-sm uppercase mb-4">
                West Coast Focus
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
                Revenue Projections
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-premium">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 text-left text-sm font-bold text-primary">Year</th>
                      <th className="py-3 text-left text-sm font-bold text-primary">Revenue</th>
                      <th className="py-3 text-left text-sm font-bold text-primary">Margin</th>
                      <th className="py-3 text-left text-sm font-bold text-primary">Net Income</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {revenueProjections.map((row) => (
                      <tr key={row.year}>
                        <td className="py-3 text-sm font-semibold text-foreground">{row.year}</td>
                        <td className="py-3 text-sm text-foreground/80">{row.revenue}</td>
                        <td className="py-3 text-sm text-foreground/80">{row.margin}</td>
                        <td className="py-3 text-sm font-medium text-secondary">{row.netIncome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Success Factors */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-secondary font-semibold tracking-wider text-sm uppercase mb-4">
              Critical Requirements
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Key Success Factors
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-sky rounded-2xl p-8 hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">California Market Mastery</h3>
              <p className="text-foreground/80 text-sm">Deep CDI understanding, surplus lines expertise, earthquake/wildfire coverage</p>
            </div>

            <div className="bg-sky rounded-2xl p-8 hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Compliance Excellence</h3>
              <p className="text-foreground/80 text-sm">Proactive CE completion, robust documentation, regular compliance audits</p>
            </div>

            <div className="bg-sky rounded-2xl p-8 hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Technology Infrastructure</h3>
              <p className="text-foreground/80 text-sm">Agency management system, CRM integration, client portal capabilities</p>
            </div>

            <div className="bg-sky rounded-2xl p-8 hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Strategic Hiring</h3>
              <p className="text-foreground/80 text-sm">Experienced DRLP, niche market specialists, compliance professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-primary to-primary-dark" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Explore the Full Research?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Dive into the detailed sections for comprehensive analysis and actionable insights.
          </p>
          <Link
            href="/insurance-broker-research/executive-summary"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-4 text-lg font-semibold text-white hover:bg-secondary-light hover:scale-105 hover:gap-3 transition-all duration-400 shadow-premium hover:shadow-premium-hover"
          >
            Start with Executive Summary
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 bg-tan">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm text-foreground/60">
            <strong>Disclaimer:</strong> This research is for informational purposes only and does not constitute legal, financial, or professional advice.
            Consult with qualified professionals before making business decisions.
          </p>
          <p className="text-xs text-foreground/50 mt-2">
            Last Updated: January 2026 | Version 1.0
          </p>
        </div>
      </section>
    </div>
  );
}
