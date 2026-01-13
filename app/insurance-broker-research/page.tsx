import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Broker Research Portal | HiQor & Daily Event Insurance",
  description: "Comprehensive research on becoming an Insurance Broker of Record. 50-state licensing analysis, West Coast expansion strategy, compliance frameworks, and partnership opportunities.",
  keywords: "insurance broker, broker of record, insurance licensing, BOR requirements, multi-state insurance",
};

const researchModules = [
  {
    title: "Executive Summary",
    description: "Strategic overview of the 50-state insurance broker initiative with investment requirements, ROI projections, and implementation roadmap.",
    href: "/insurance-broker-research/executive-summary",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    stats: { label: "ROI Projection", value: "624%+" },
    badge: "Start Here",
  },
  {
    title: "BOR Requirements",
    description: "Complete guide to Broker of Record licensing including education requirements, examination process, and state-by-state variations.",
    href: "/insurance-broker-research/bor-requirements",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    stats: { label: "License Types", value: "3" },
  },
  {
    title: "50-State Licensing Costs",
    description: "Comprehensive cost analysis for insurance licensing across all 50 states, including fees, education costs, and multi-state strategies.",
    href: "/insurance-broker-research/licensing-costs",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    stats: { label: "50-State Total", value: "$20K-$55K" },
  },
  {
    title: "West Coast Expansion Strategy",
    description: "Strategic playbook for establishing insurance brokerage operations across California, Oregon, Washington, Nevada, and Arizona.",
    href: "/insurance-broker-research/west-coast-strategy",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    stats: { label: "Target Market", value: "$48B+" },
    badge: "Regional Focus",
  },
  {
    title: "Compliance Guide",
    description: "Comprehensive compliance framework covering federal requirements, state regulations, NAIC standards, and record-keeping requirements.",
    href: "/insurance-broker-research/compliance",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    stats: { label: "Regulations", value: "4 Levels" },
  },
  {
    title: "Partnership Opportunity",
    description: "Explore how partnering with Daily Event Insurance and HiQor as your Broker of Record can accelerate your market entry.",
    href: "/insurance-broker-research/partnership",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    stats: { label: "Time to Market", value: "30 Days" },
    badge: "New",
    highlight: true,
  },
];

const keyMetrics = [
  { label: "Total Investment", value: "$75K-$150K", description: "Full 50-state coverage" },
  { label: "West Coast Entry", value: "$45K", description: "CA, NV initial markets" },
  { label: "Year 3 Revenue", value: "$7.2M", description: "Projected GCI" },
  { label: "Breakeven", value: "14-18 mo", description: "Time to profitability" },
];

export default function InsuranceBrokerResearchPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50/30" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200">
              <span className="text-teal-600 font-semibold text-sm">HiQor Research Portal</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 text-center mb-6">
            Insurance Broker{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              Research Portal
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 text-center max-w-3xl mx-auto mb-10">
            Comprehensive research and analysis for establishing a multi-state Insurance Broker of Record operation with a focus on West Coast market expansion.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {keyMetrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 shadow-lg shadow-teal-500/5 text-center"
              >
                <p className="text-2xl md:text-3xl font-bold text-teal-600 mb-1">{metric.value}</p>
                <p className="text-sm font-medium text-slate-900">{metric.label}</p>
                <p className="text-xs text-slate-500 mt-1">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Modules */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Research Modules
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Navigate through comprehensive research covering every aspect of becoming a licensed insurance broker.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchModules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className={`group relative bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 ${
                  module.highlight
                    ? 'border-teal-300 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                {/* Badge */}
                {module.badge && (
                  <div className="absolute -top-3 right-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      module.highlight
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {module.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  module.highlight
                    ? 'bg-teal-500 text-white'
                    : 'bg-teal-50 text-teal-600 group-hover:bg-teal-500 group-hover:text-white'
                } transition-colors`}>
                  {module.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                  {module.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {module.description}
                </p>

                {/* Stats */}
                {module.stats && (
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500">{module.stats.label}:</span>
                    <span className="text-sm font-bold text-teal-600">{module.stats.value}</span>
                  </div>
                )}

                {/* Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Overview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6">
                <span className="text-teal-600 font-semibold text-sm">Strategic Recommendation</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Phased West Coast Expansion
              </h2>

              <p className="text-lg text-slate-600 mb-8">
                Our research recommends a strategic phased approach starting with California as the anchor market.
                This approach minimizes risk while maximizing market penetration and revenue potential.
              </p>

              <div className="space-y-4">
                {[
                  { phase: "Phase 1", markets: "California + Nevada", investment: "$45,000", timeline: "Months 1-12" },
                  { phase: "Phase 2", markets: "Arizona", investment: "$15,000", timeline: "Months 13-18" },
                  { phase: "Phase 3", markets: "Oregon + Washington", investment: "$20,000", timeline: "Months 19-24" },
                  { phase: "Phase 4", markets: "National Expansion", investment: "$70,000", timeline: "Months 25-36+" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">{item.phase}: {item.markets}</p>
                        <p className="text-teal-600 font-semibold">{item.investment}</p>
                      </div>
                      <p className="text-sm text-slate-500">{item.timeline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Opportunity Card */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Market Opportunity</h3>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: "$48B+", label: "West Coast Market" },
                  { value: "65-70%", label: "Broker Share" },
                  { value: "5-7%", label: "Annual Growth" },
                  { value: "$7.2M", label: "Year 3 Target" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-teal-400">{stat.value}</p>
                    <p className="text-sm text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  "California: Largest state market nationally",
                  "Digital transformation disrupting traditional distribution",
                  "Remote work enables cost-effective operations",
                  "Regulatory complexity favors organized operations",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href="/insurance-broker-research/executive-summary"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-full transition-colors"
                >
                  Read Full Executive Summary
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-500 to-teal-600">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Partner with HiQor?
          </h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Skip the licensing complexity. Partner with Daily Event Insurance and HiQor as your Broker of Record and get to market in 30 days instead of 18+ months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/insurance-broker-research/partnership"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Explore Partnership
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/#apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-500">
            <strong>Disclaimer:</strong> This research portal is for informational purposes only and does not constitute legal, financial, or regulatory advice.
            Consult with qualified professionals for advice specific to your business operations.
          </p>
        </div>
      </section>
    </div>
  );
}
