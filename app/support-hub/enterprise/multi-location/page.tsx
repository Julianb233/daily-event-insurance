"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  Building2,
  Users,
  MapPin,
  DollarSign,
  Settings,
  Plus,
  CheckCircle,
  ArrowRight,
  UserCog,
  BarChart3,
  Wallet,
  Shield,
  AlertCircle,
  Info,
  Zap,
  Globe
} from "lucide-react"

const setupSteps = [
  {
    step: 1,
    title: "Sign Up for Enterprise",
    description: "Contact sales to activate enterprise features for your account",
    action: "Upgrade account to Enterprise tier",
    icon: Building2
  },
  {
    step: 2,
    title: "Define Location Hierarchy",
    description: "Structure your organization: Corporate → Regions → Individual Locations",
    action: "Create organizational structure",
    icon: MapPin
  },
  {
    step: 3,
    title: "Add Locations",
    description: "Add each physical location with name, address, and unique identifier",
    action: "Navigate to Settings → Locations → Add Location",
    icon: Plus
  },
  {
    step: 4,
    title: "Assign Location Managers",
    description: "Invite managers and assign them to specific locations",
    action: "Send invitation emails with location assignments",
    icon: UserCog
  },
  {
    step: 5,
    title: "Configure Payout Routing",
    description: "Set up bank accounts for each location or consolidated payout",
    action: "Settings → Payment Configuration → Add Payout Account",
    icon: Wallet
  },
  {
    step: 6,
    title: "Set Permissions",
    description: "Define what each role can access at each location",
    action: "Configure role-based access control",
    icon: Shield
  }
]

const hierarchyExample = [
  {
    level: "Corporate",
    name: "FitLife Corporate",
    access: "Full access to all locations, analytics, and settings",
    users: ["CEO", "CFO", "Operations Director"],
    color: "purple"
  },
  {
    level: "Regional",
    name: "Northeast Region",
    access: "Access to 5 locations in the northeast region",
    users: ["Regional Manager"],
    color: "blue"
  },
  {
    level: "Location",
    name: "Boston Downtown Gym",
    access: "Location-specific dashboard, member management, local reporting",
    users: ["Location Manager", "Staff"],
    color: "teal"
  }
]

const dashboardFeatures = [
  {
    title: "Corporate Dashboard",
    description: "View all locations at once with consolidated metrics",
    features: [
      "Total policies across all locations",
      "Revenue by location comparison",
      "Top performing locations",
      "Cross-location trends and insights"
    ],
    icon: BarChart3
  },
  {
    title: "Location-Specific Dashboard",
    description: "Each manager sees only their location's data",
    features: [
      "Location sales and revenue",
      "Member purchase rates",
      "Claims specific to location",
      "Performance vs. regional average"
    ],
    icon: MapPin
  }
]

const payoutOptions = [
  {
    title: "Consolidated Payout",
    description: "All location earnings combined into single monthly payout to corporate",
    bestFor: "Owner-operated chains, corporate-managed locations",
    setup: "One bank account receives all revenue",
    icon: Building2,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Location-Specific Payouts",
    description: "Each location receives its own separate payout to designated accounts",
    bestFor: "Franchises, independent location owners",
    setup: "Each location manager provides their own banking details",
    icon: MapPin,
    color: "from-teal-500 to-green-500"
  },
  {
    title: "Split Payouts",
    description: "Corporate takes a percentage, remainder distributed to locations",
    bestFor: "Revenue-sharing agreements, franchise fees",
    setup: "Set corporate percentage (e.g., 20%), rest goes to locations",
    icon: DollarSign,
    color: "from-purple-500 to-pink-500"
  }
]

const addLocationGuide = [
  {
    step: "Navigate to Locations",
    instruction: "Dashboard → Settings → Locations → Add New Location",
    details: "Click the 'Add Location' button in the top right"
  },
  {
    step: "Enter Location Details",
    instruction: "Provide location name, address, and contact information",
    details: "Example: 'Boston Downtown Gym, 123 Main St, Boston MA 02101'"
  },
  {
    step: "Assign Parent (Optional)",
    instruction: "Select regional manager if using regional hierarchy",
    details: "Leave blank if location reports directly to corporate"
  },
  {
    step: "Set Location Manager",
    instruction: "Invite location manager via email",
    details: "They'll receive invitation to access their location dashboard"
  },
  {
    step: "Configure Payout",
    instruction: "Choose payout method for this location",
    details: "Consolidated, location-specific, or split payout"
  },
  {
    step: "Activate Location",
    instruction: "Review settings and click 'Activate Location'",
    details: "Location goes live immediately and appears in your dashboard"
  }
]

const faqs = [
  {
    question: "How many locations can I add?",
    answer: "Enterprise accounts have unlimited locations. You can manage 2 locations or 2,000 locations with the same tools and pricing structure."
  },
  {
    question: "Can location managers see other locations' data?",
    answer: "No. Location managers only see their assigned location's data. Regional managers can see all locations in their region. Only corporate admins see all locations."
  },
  {
    question: "How do I change a location's payout method?",
    answer: "Navigate to Settings → Locations → [Select Location] → Payment Settings. You can switch between consolidated, location-specific, or split payouts at any time. Changes take effect the following month."
  },
  {
    question: "Can one person manage multiple locations?",
    answer: "Yes. A single user can be assigned as manager for multiple locations and will see a location switcher in their dashboard."
  },
  {
    question: "What happens if a location closes?",
    answer: "You can archive locations in Settings → Locations → Archive. Archived locations retain historical data but stop appearing in active dashboards. You can reactivate them anytime."
  },
  {
    question: "Do I pay extra per location?",
    answer: "No. Enterprise pricing is based on total policy volume across all locations, not the number of locations. Add as many as you need."
  }
]

export default function MultiLocationPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Enterprise", href: "/support-hub/enterprise" },
          { label: "Multi-Location Management" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-teal-600 font-semibold text-sm mb-6">
          <Building2 className="w-4 h-4" />
          Multi-Location Setup
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Manage Insurance Across
          <span className="block mt-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            All Your Locations
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Centralized control with location-specific dashboards, flexible payout routing,
          and hierarchical permissions for multi-location businesses.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <GlassCard variant="elevated">
          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: "Unlimited", label: "Locations", icon: Building2 },
                { value: "5 min", label: "Setup Time", icon: Zap },
                { value: "4 Roles", label: "Permission Levels", icon: Shield },
                { value: "3 Options", label: "Payout Methods", icon: Wallet }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-slate-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Setup Steps */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Setup Guide
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Follow these steps to configure multi-location management
          </p>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="p-8">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-blue-500 hidden md:block" />

              <div className="space-y-8">
                {setupSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-6"
                  >
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-white border-4 border-teal-500 items-center justify-center flex-shrink-0 z-10">
                      <step.icon className="w-6 h-6 text-teal-600" />
                    </div>

                    <div className="flex-1 p-6 bg-white/50 rounded-xl border border-white/40">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-bold">
                          STEP {step.step}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                      </div>
                      <p className="text-slate-600 mb-3">{step.description}</p>
                      <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                        <p className="text-sm text-teal-700 font-medium">
                          <strong>Action:</strong> {step.action}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Location Hierarchy */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Location Hierarchy
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Structure your organization with three levels of management
          </p>
        </motion.div>

        <div className="space-y-6">
          {hierarchyExample.map((level, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{ marginLeft: `${index * 2}rem` }}
            >
              <GlassCard variant="elevated">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${level.color}-500 to-${level.color}-600 flex items-center justify-center flex-shrink-0`}>
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 bg-${level.color}-100 text-${level.color}-700 rounded text-xs font-bold`}>
                          {level.level.toUpperCase()}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{level.name}</h3>
                      </div>
                      <p className="text-slate-600 mb-3">{level.access}</p>
                      <div className="flex flex-wrap gap-2">
                        {level.users.map((user, i) => (
                          <span key={i} className="px-3 py-1 bg-white/70 rounded-full text-sm text-slate-700 border border-slate-200">
                            <Users className="w-3 h-3 inline mr-1" />
                            {user}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Features */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Location Dashboards
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Different views for different roles
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {dashboardFeatures.map((dashboard, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="h-full">
                <div className="p-8">
                  <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                    <dashboard.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{dashboard.title}</h3>
                  <p className="text-slate-600 mb-6">{dashboard.description}</p>
                  <ul className="space-y-3">
                    {dashboard.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Payout Options */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Payout Configuration
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose how earnings are distributed across your organization
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {payoutOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="h-full">
                <div className="p-8">
                  <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                    <option.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{option.title}</h3>
                  <p className="text-slate-600 mb-4">{option.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-700">
                        <strong>Best for:</strong> {option.bestFor}
                      </p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                      <p className="text-sm text-teal-700">
                        <strong>Setup:</strong> {option.setup}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Payout Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <GlassCard variant="featured">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Payout Examples
              </h3>

              <div className="space-y-6">
                <div className="p-6 bg-white/50 rounded-xl border border-white/40">
                  <h4 className="font-bold text-slate-900 mb-3">Example: 3 Locations, $10,000 Total Monthly Revenue</h4>

                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-teal-600 mb-2">Consolidated Payout:</p>
                      <p className="text-slate-700">→ Corporate receives: $10,000 (100%)</p>
                    </div>

                    <div>
                      <p className="font-semibold text-blue-600 mb-2">Location-Specific Payouts:</p>
                      <p className="text-slate-700">→ Location A receives: $4,000 (40%)</p>
                      <p className="text-slate-700">→ Location B receives: $3,500 (35%)</p>
                      <p className="text-slate-700">→ Location C receives: $2,500 (25%)</p>
                    </div>

                    <div>
                      <p className="font-semibold text-purple-600 mb-2">Split Payout (20% to Corporate):</p>
                      <p className="text-slate-700">→ Corporate receives: $2,000 (20%)</p>
                      <p className="text-slate-700">→ Location A receives: $3,200 (32%)</p>
                      <p className="text-slate-700">→ Location B receives: $2,800 (28%)</p>
                      <p className="text-slate-700">→ Location C receives: $2,000 (20%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Adding a Location Guide */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            How to Add a New Location
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Step-by-step guide to adding locations to your enterprise account
          </p>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="p-8">
            <div className="space-y-4">
              {addLocationGuide.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-1">{item.step}</h4>
                      <p className="text-slate-700 mb-2">{item.instruction}</p>
                      <p className="text-sm text-slate-600 italic">{item.details}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-700">
                    <strong>Pro Tip:</strong> You can bulk import locations via CSV. Contact your account manager
                    for the import template if you have 10+ locations to add.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* FAQs */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="p-8">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-slate-700 pl-7">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Related Resources */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Related Enterprise Features
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/support-hub/enterprise/permissions">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <Shield className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Role-Based Permissions
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Set up access control for different roles
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    Configure Roles
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/enterprise/centralized-billing">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <DollarSign className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Centralized Billing
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Understand enterprise billing and invoicing
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    View Billing
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/business/revenue">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <BarChart3 className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Revenue & Commissions
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Learn about commission tiers and payouts
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    View Revenue
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
