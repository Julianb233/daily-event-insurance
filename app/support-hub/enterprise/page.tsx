"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  Building2,
  Users,
  Palette,
  ShieldCheck,
  Lock,
  DollarSign,
  BarChart3,
  Clock,
  Headphones,
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
  Globe
} from "lucide-react"

const features = [
  {
    title: "Multi-Location Management",
    description: "Centralized control across all locations with location-specific dashboards and permissions",
    icon: Building2,
    href: "/support-hub/enterprise/multi-location",
    color: "from-teal-500 to-blue-500",
    highlights: ["Location hierarchy", "Manager assignments", "Consolidated reporting"]
  },
  {
    title: "White-Label Branding",
    description: "Complete customization with your brand colors, logo, and domain",
    icon: Palette,
    href: "/support-hub/enterprise/white-label",
    color: "from-purple-500 to-pink-500",
    highlights: ["Custom domain", "Brand colors", "Logo integration"]
  },
  {
    title: "Single Sign-On (SSO)",
    description: "Seamless authentication with SAML 2.0 and OAuth 2.0 support",
    icon: Lock,
    href: "/support-hub/enterprise/sso",
    color: "from-orange-500 to-red-500",
    highlights: ["SAML 2.0", "OAuth 2.0", "Active Directory"]
  },
  {
    title: "Role-Based Permissions",
    description: "Granular access control with custom roles for different team members",
    icon: ShieldCheck,
    href: "/support-hub/enterprise/permissions",
    color: "from-blue-500 to-cyan-500",
    highlights: ["4 role types", "Location-specific access", "Custom permissions"]
  },
  {
    title: "Centralized Billing",
    description: "Single invoice with flexible payout routing to locations",
    icon: DollarSign,
    href: "/support-hub/enterprise/centralized-billing",
    color: "from-green-500 to-emerald-500",
    highlights: ["Single invoice", "Split payouts", "Location routing"]
  },
  {
    title: "Enterprise Analytics",
    description: "Advanced reporting across all locations with custom dashboards",
    icon: BarChart3,
    href: "/support-hub/enterprise/analytics",
    color: "from-indigo-500 to-purple-500",
    highlights: ["Cross-location reports", "Custom metrics", "Export to BI tools"]
  }
]

const benefits = [
  {
    icon: Users,
    title: "Dedicated Account Manager",
    description: "Personal support from implementation to optimization"
  },
  {
    icon: Clock,
    title: "Priority Support",
    description: "24/7 enterprise support with 1-hour response time SLA"
  },
  {
    icon: Headphones,
    title: "Onboarding Assistance",
    description: "White-glove setup and training for your entire team"
  },
  {
    icon: Zap,
    title: "API Access",
    description: "Custom integrations with full API documentation"
  }
]

const comparisonTable = [
  { feature: "Number of Locations", starter: "1", growth: "1-5", enterprise: "Unlimited" },
  { feature: "Commission Rate", starter: "40%", growth: "50%", enterprise: "60%" },
  { feature: "Custom Branding", starter: "—", growth: "Logo only", enterprise: "Full white-label" },
  { feature: "SSO Integration", starter: "—", growth: "—", enterprise: "✓" },
  { feature: "Multi-Location Dashboard", starter: "—", growth: "—", enterprise: "✓" },
  { feature: "Location-Specific Payouts", starter: "—", growth: "—", enterprise: "✓" },
  { feature: "Role-Based Access Control", starter: "Basic", growth: "Standard", enterprise: "Advanced" },
  { feature: "Dedicated Account Manager", starter: "—", growth: "—", enterprise: "✓" },
  { feature: "Priority Support", starter: "Email", growth: "Priority email", enterprise: "24/7 Phone + Email" },
  { feature: "API Access", starter: "—", growth: "Read-only", enterprise: "Full access" }
]

export default function EnterprisePage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs items={[{ label: "Enterprise Solutions" }]} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-600 font-semibold text-sm mb-6">
          <Building2 className="w-4 h-4" />
          Enterprise Solutions
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Scale Insurance Across
          <span className="block mt-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Your Organization
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Enterprise-grade features for multi-location businesses, franchises, and large organizations
          requiring centralized control with location-specific flexibility.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4"
        >
          <Link href="#features">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
              Explore Features
            </button>
          </Link>
          <Link href="mailto:enterprise@dailyeventinsurance.com">
            <button className="px-8 py-4 bg-white/70 backdrop-blur-xl border border-white/40 text-slate-900 rounded-xl font-semibold hover:shadow-lg transition-all">
              Contact Sales
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <GlassCard variant="elevated">
          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: "500+", label: "Enterprise Clients", icon: Building2 },
                { value: "10K+", label: "Locations Managed", icon: Globe },
                { value: "99.9%", label: "Uptime SLA", icon: Zap },
                { value: "24/7", label: "Support Available", icon: Headphones }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Features Grid */}
      <section id="features">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Enterprise Features
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to manage insurance across your entire organization
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={feature.href}>
                <GlassCard variant="elevated" className="h-full group cursor-pointer">
                  <div className="p-8 h-full flex flex-col">
                    <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 mb-6">
                      {feature.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {feature.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                          {highlight}
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center text-purple-600 font-semibold group-hover:gap-3 transition-all">
                      Learn More
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Enterprise Benefits
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Premium support and services included with every enterprise account
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Comparison Table */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Plan Comparison
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See how Enterprise stacks up against other plans
          </p>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-6 text-slate-900 font-bold">Feature</th>
                  <th className="text-center p-6 text-slate-600 font-semibold">Starter</th>
                  <th className="text-center p-6 text-slate-600 font-semibold">Growth</th>
                  <th className="text-center p-6 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold">
                        <Star className="w-3 h-3" /> Recommended
                      </span>
                    </div>
                    <span className="text-purple-600 font-bold">Enterprise</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                  >
                    <td className="p-6 font-medium text-slate-900">{row.feature}</td>
                    <td className="p-6 text-center text-slate-600">{row.starter}</td>
                    <td className="p-6 text-center text-slate-600">{row.growth}</td>
                    <td className="p-6 text-center font-semibold text-purple-600">{row.enterprise}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      {/* CTA */}
      <section>
        <GlassCard variant="featured">
          <div className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Ready to Scale?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                Get started with Enterprise today or schedule a demo to see how we can
                support your multi-location business.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="mailto:enterprise@dailyeventinsurance.com">
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                    Contact Sales Team
                  </button>
                </Link>
                <Link href="/support-hub/enterprise/multi-location">
                  <button className="px-8 py-4 bg-white/70 backdrop-blur-xl border border-white/40 text-slate-900 rounded-xl font-semibold hover:shadow-lg transition-all">
                    View Documentation
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
