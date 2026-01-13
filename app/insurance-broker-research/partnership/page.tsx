import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With HiQor & Daily Event Insurance | BOR Partnership",
  description: "Strategic partnership opportunity with Daily Event Insurance and HiQor as your Broker of Record. Turnkey insurance solutions for event professionals.",
  keywords: "insurance partnership, broker of record partnership, event insurance partner, HiQor BOR",
};

const partnershipBenefits = [
  {
    icon: "shield",
    title: "Licensed in All 50 States",
    description: "Access to a fully licensed multi-state insurance operation without the $150K+ investment and 18-36 month licensing timeline.",
  },
  {
    icon: "clock",
    title: "Immediate Market Access",
    description: "Start offering insurance products to your customers immediately. No waiting for license approvals or carrier appointments.",
  },
  {
    icon: "chart",
    title: "Revenue Share Model",
    description: "Competitive commission splits on all referred business. Recurring revenue on renewals without operational overhead.",
  },
  {
    icon: "support",
    title: "Full Service Support",
    description: "We handle policy placement, claims support, compliance, and renewals. You focus on your core business.",
  },
  {
    icon: "tech",
    title: "White-Label Technology",
    description: "Branded quote and bind platform integrated into your existing customer experience. API access available.",
  },
  {
    icon: "growth",
    title: "Scalable Growth",
    description: "No volume minimums to start. Commission rates improve as your portfolio grows. Enterprise solutions available.",
  },
];

const partnerTypes = [
  {
    type: "Referral Partner",
    ideal: "Event venues, planners, photographers",
    commitment: "Low",
    revenue: "15-20% commission",
    features: ["Simple referral links", "Co-branded landing pages", "Monthly reporting", "No minimum volume"],
  },
  {
    type: "Embedded Partner",
    ideal: "Event platforms, booking software",
    commitment: "Medium",
    revenue: "20-30% commission",
    features: ["API integration", "White-label quoting", "Real-time policy issuance", "Dedicated support"],
  },
  {
    type: "Strategic Partner",
    ideal: "Insurance agencies, large venues",
    commitment: "High",
    revenue: "Custom structure",
    features: ["Full BOR arrangement", "Custom product development", "Volume-based incentives", "Executive partnership"],
  },
];

const processSteps = [
  { step: "Discovery Call", duration: "30 min", description: "Discuss your business model and insurance needs" },
  { step: "Partnership Proposal", duration: "3-5 days", description: "Custom proposal with revenue projections" },
  { step: "Agreement & Onboarding", duration: "1-2 weeks", description: "Sign agreement and configure your integration" },
  { step: "Launch & Support", duration: "Ongoing", description: "Go live with dedicated partner success manager" },
];

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/insurance-broker-research" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-8 transition-colors group">
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Research Portal
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span className="text-teal-400 font-semibold text-sm">Partnership Opportunity</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Partner With{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300">
                  HiQor & Daily Event Insurance
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                Leverage our 50-state Broker of Record infrastructure to offer insurance products to your customers without the complexity of licensing, compliance, or carrier relationships.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#partner-types" className="px-8 py-4 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/30">
                  Explore Partnership Models
                </a>
                <a href="#process" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-colors border border-white/20">
                  How It Works
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Why Partner With Us?</h3>
              <div className="space-y-4">
                {[
                  { metric: "$48B+", label: "West Coast Market Size" },
                  { metric: "50", label: "States Licensed" },
                  { metric: "24hr", label: "Average Quote-to-Bind" },
                  { metric: "98%", label: "Partner Satisfaction" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-2xl font-bold text-teal-400">{item.metric}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Challenge of Going It Alone</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Building your own insurance operation requires significant investment, time, and expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-red-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Build Your Own BOR</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Initial Investment", value: "$75K - $150K", bad: true },
                  { label: "Time to Launch", value: "18-36 months", bad: true },
                  { label: "Ongoing Compliance", value: "$25K+/year", bad: true },
                  { label: "Staff Required", value: "3-5 FTEs", bad: true },
                  { label: "Risk Exposure", value: "High", bad: true },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-red-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-teal-200 shadow-lg shadow-teal-500/10 ring-2 ring-teal-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Partner With HiQor</h3>
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">RECOMMENDED</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Initial Investment", value: "$0", good: true },
                  { label: "Time to Launch", value: "1-2 weeks", good: true },
                  { label: "Ongoing Compliance", value: "Included", good: true },
                  { label: "Staff Required", value: "0 (We handle it)", good: true },
                  { label: "Risk Exposure", value: "None", good: true },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-teal-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-4">
              <span className="text-teal-600 font-semibold text-sm">Partnership Benefits</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need, Nothing You Don't</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Focus on what you do best while we handle the insurance infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnershipBenefits.map((benefit) => (
              <div key={benefit.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-4">
                  {benefit.icon === "shield" && (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  )}
                  {benefit.icon === "clock" && (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {benefit.icon === "chart" && (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  )}
                  {benefit.icon === "support" && (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  )}
                  {benefit.icon === "tech" && (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                  )}
                  {benefit.icon === "growth" && (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section id="partner-types" className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Partnership Models</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Choose the partnership level that fits your business model and growth ambitions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {partnerTypes.map((partner, i) => (
              <div key={partner.type} className={`bg-white rounded-2xl overflow-hidden shadow-lg border ${i === 1 ? 'border-teal-500 ring-2 ring-teal-500' : 'border-slate-200'}`}>
                {i === 1 && (
                  <div className="bg-teal-500 text-white text-center py-2 text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{partner.type}</h3>
                  <p className="text-slate-600 text-sm mb-4">Ideal for: {partner.ideal}</p>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold text-teal-600">{partner.revenue}</span>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Commitment Level</span>
                      <span className={`font-semibold ${
                        partner.commitment === 'Low' ? 'text-green-600' :
                        partner.commitment === 'Medium' ? 'text-amber-600' :
                        'text-slate-900'
                      }`}>{partner.commitment}</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-slate-200 pt-6">
                    {partner.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products We Offer */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Products Available Through Partnership</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Comprehensive coverage options for the event industry and beyond.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { product: "Event Liability", coverage: "$1M - $5M", premium: "$75 - $500", popular: true },
              { product: "Special Event", coverage: "Customizable", premium: "$150 - $1,500", popular: true },
              { product: "Liquor Liability", coverage: "$1M - $2M", premium: "$100 - $400", popular: false },
              { product: "Equipment Coverage", coverage: "$10K - $500K", premium: "$50 - $800", popular: false },
              { product: "Cancellation", coverage: "Event Cost", premium: "5-10% of cost", popular: true },
              { product: "Vendor Liability", coverage: "$1M - $2M", premium: "$100 - $300", popular: false },
              { product: "Professional Liability", coverage: "$1M - $5M", premium: "$300 - $2K", popular: false },
              { product: "Workers' Comp", coverage: "Statutory", premium: "Varies", popular: false },
            ].map((item) => (
              <div key={item.product} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-white">{item.product}</h3>
                  {item.popular && (
                    <span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">Popular</span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coverage:</span>
                    <span className="text-white">{item.coverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Premium:</span>
                    <span className="text-teal-400">{item.premium}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-4">
              <span className="text-teal-600 font-semibold text-sm">Getting Started</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple Onboarding Process</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From first conversation to live integration in as little as two weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:shadow-teal-500/10 transition-shadow h-full">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{step.step}</h3>
                  <p className="text-teal-600 text-sm font-semibold mb-2">{step.duration}</p>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </div>
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-teal-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-teal-500 to-teal-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Offer Insurance to Your Customers?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Schedule a discovery call to explore how a partnership with HiQor and Daily Event Insurance can unlock new revenue streams for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:partnerships@hiqor.io?subject=Partnership%20Inquiry" className="px-8 py-4 bg-white text-teal-600 rounded-full font-semibold hover:bg-slate-100 transition-colors shadow-lg">
              Schedule Discovery Call
            </a>
            <Link href="/insurance-broker-research/executive-summary" className="px-8 py-4 bg-teal-400/20 text-white rounded-full font-semibold hover:bg-teal-400/30 transition-colors border border-white/30">
              View Full Research
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Do I need an insurance license to partner with you?",
                a: "No. As the Broker of Record, HiQor holds all necessary licenses. You simply refer or integrate customers to our platform."
              },
              {
                q: "What are the minimum volume requirements?",
                a: "There are no minimum volume requirements for Referral Partners. Embedded and Strategic partnerships have volume targets that unlock higher commission rates."
              },
              {
                q: "How quickly can I start offering insurance?",
                a: "Referral partners can launch within days with a co-branded landing page. API integrations typically take 1-2 weeks depending on complexity."
              },
              {
                q: "Who handles customer support and claims?",
                a: "HiQor handles all policy servicing, customer support, and claims coordination. You can white-label our support or direct customers to us."
              },
              {
                q: "What states can I offer coverage in?",
                a: "Through our multi-state licensing, we can offer coverage in all 50 states. Some products may have state-specific restrictions."
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/insurance-broker-research/executive-summary" className="px-6 py-3 bg-slate-100 rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Executive Summary
            </Link>
            <Link href="/insurance-broker-research" className="px-6 py-3 bg-slate-100 rounded-full text-slate-700 font-medium border border-slate-200 hover:shadow-lg transition-shadow">
              Research Portal
            </Link>
            <Link href="/" className="px-6 py-3 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-colors inline-flex items-center gap-2">
              Daily Event Insurance
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
