"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  Shield,
  Users,
  UserCog,
  Building2,
  CheckCircle,
  X,
  Minus,
  ArrowRight,
  Settings,
  Eye,
  Lock,
  AlertCircle,
  Key,
  UserPlus
} from "lucide-react"

const roles = [
  {
    name: "Corporate Admin",
    description: "Full system access across all locations and settings",
    icon: Shield,
    color: "from-purple-500 to-pink-500",
    bestFor: "CEO, CFO, Operations Director",
    permissions: {
      locations: "All locations",
      dashboard: "Corporate & all location dashboards",
      users: "Create, edit, delete all users",
      settings: "Full system configuration",
      billing: "View invoices, manage payment methods",
      reports: "All reports across all locations",
      claims: "View and manage all claims",
      api: "Full API access"
    }
  },
  {
    name: "Regional Manager",
    description: "Manage multiple locations within assigned region",
    icon: Building2,
    color: "from-blue-500 to-cyan-500",
    bestFor: "Regional Directors, Area Managers",
    permissions: {
      locations: "Assigned region only",
      dashboard: "Region and assigned location dashboards",
      users: "Create/edit location managers in region",
      settings: "Location-level settings (not system)",
      billing: "View region performance, no billing access",
      reports: "Regional and location reports",
      claims: "View and manage regional claims",
      api: "Read-only API access"
    }
  },
  {
    name: "Location Manager",
    description: "Manage single location operations and team",
    icon: UserCog,
    color: "from-teal-500 to-green-500",
    bestFor: "General Managers, Facility Directors",
    permissions: {
      locations: "Single assigned location only",
      dashboard: "Location-specific dashboard only",
      users: "Create/edit staff at their location",
      settings: "Location branding and preferences",
      billing: "View location revenue only",
      reports: "Location reports only",
      claims: "View and manage location claims",
      api: "No API access"
    }
  },
  {
    name: "Staff",
    description: "View-only access for front-line team members",
    icon: Users,
    color: "from-slate-500 to-gray-500",
    bestFor: "Front Desk, Sales Associates",
    permissions: {
      locations: "Single assigned location only",
      dashboard: "View location dashboard (read-only)",
      users: "View team members only",
      settings: "No settings access",
      billing: "No billing access",
      reports: "View basic location stats",
      claims: "View claim status only",
      api: "No API access"
    }
  }
]

const permissionsMatrix = [
  {
    feature: "View All Locations",
    corporateAdmin: "full",
    regionalManager: "region",
    locationManager: "single",
    staff: "single"
  },
  {
    feature: "Add/Remove Locations",
    corporateAdmin: "full",
    regionalManager: "none",
    locationManager: "none",
    staff: "none"
  },
  {
    feature: "Manage Users",
    corporateAdmin: "full",
    regionalManager: "region",
    locationManager: "location",
    staff: "none"
  },
  {
    feature: "Configure White-Label",
    corporateAdmin: "full",
    regionalManager: "none",
    locationManager: "none",
    staff: "none"
  },
  {
    feature: "Set up SSO",
    corporateAdmin: "full",
    regionalManager: "none",
    locationManager: "none",
    staff: "none"
  },
  {
    feature: "View Financial Reports",
    corporateAdmin: "full",
    regionalManager: "region",
    locationManager: "location",
    staff: "none"
  },
  {
    feature: "Manage Billing",
    corporateAdmin: "full",
    regionalManager: "none",
    locationManager: "none",
    staff: "none"
  },
  {
    feature: "Configure Payouts",
    corporateAdmin: "full",
    regionalManager: "none",
    locationManager: "request",
    staff: "none"
  },
  {
    feature: "Handle Claims",
    corporateAdmin: "full",
    regionalManager: "region",
    locationManager: "location",
    staff: "view"
  },
  {
    feature: "Export Data",
    corporateAdmin: "full",
    regionalManager: "region",
    locationManager: "location",
    staff: "none"
  },
  {
    feature: "API Access",
    corporateAdmin: "full",
    regionalManager: "readonly",
    locationManager: "none",
    staff: "none"
  },
  {
    feature: "Custom Integrations",
    corporateAdmin: "full",
    regionalManager: "none",
    locationManager: "none",
    staff: "none"
  }
]

const setupSteps = [
  {
    step: 1,
    title: "Define Organizational Structure",
    instruction: "Map out corporate, regional, and location hierarchy",
    details: "Determine which locations belong to which regions"
  },
  {
    step: 2,
    title: "Create User Accounts",
    instruction: "Invite users via email with their assigned role",
    details: "Settings → Users → Add User"
  },
  {
    step: 3,
    title: "Assign Locations",
    instruction: "Link each user to their location(s) or region",
    details: "Regional managers can oversee multiple locations"
  },
  {
    step: 4,
    title: "Set Custom Permissions (Optional)",
    instruction: "Override default role permissions for specific users",
    details: "Give location manager extra permissions as needed"
  },
  {
    step: 5,
    title: "Review and Activate",
    instruction: "Users receive invitation emails and can log in immediately",
    details: "They'll see only what they're permitted to access"
  }
]

const scenarioExamples = [
  {
    scenario: "National Gym Chain (50 locations)",
    structure: [
      "1 Corporate Admin (CEO)",
      "3 Regional Managers (East, West, Central)",
      "50 Location Managers (one per gym)",
      "200 Staff (front desk, trainers)"
    ],
    implementation: "Corporate sets company-wide policies, regional managers track area performance, location managers handle day-to-day operations, staff can view their location's insurance sales."
  },
  {
    scenario: "Franchise Business (100+ locations)",
    structure: [
      "1 Corporate Admin (Franchisor)",
      "100+ Location Managers (Independent franchisees)",
      "No regional managers (flat structure)"
    ],
    implementation: "Corporate admin manages brand and master settings. Each franchisee has full control of their location as location manager with their own payout account."
  },
  {
    scenario: "Enterprise with Subsidiaries",
    structure: [
      "1 Corporate Admin (Parent company)",
      "5 Regional Managers (One per subsidiary brand)",
      "30 Location Managers (Across all brands)",
      "150 Staff"
    ],
    implementation: "Parent company sees consolidated view. Each subsidiary operates semi-independently with regional manager oversight. Location managers focus on their facility."
  }
]

const customPermissionExamples = [
  {
    useCase: "Allow location manager to view other locations' performance",
    howTo: "Edit user → Custom Permissions → Enable 'View Other Locations Dashboard'",
    reason: "Useful for location managers who oversee multiple sites or want benchmarking data"
  },
  {
    useCase: "Give staff member claim handling ability",
    howTo: "Edit user → Custom Permissions → Enable 'Manage Claims'",
    reason: "Customer service staff who need to help members file claims"
  },
  {
    useCase: "Restrict corporate admin from certain locations",
    howTo: "Edit user → Location Access → Uncheck specific locations",
    reason: "Joint ventures or partnerships where some locations have restricted access"
  }
]

const faqs = [
  {
    question: "Can one person have multiple roles?",
    answer: "No, each user has one primary role. However, you can customize permissions for any user to add specific capabilities beyond their base role. For example, a Location Manager can be given Regional Manager permissions for specific features."
  },
  {
    question: "What happens when a location manager leaves?",
    answer: "Deactivate their account in Settings → Users. You can immediately reassign their location to a new manager. All historical data and settings remain intact."
  },
  {
    question: "Can I create custom roles?",
    answer: "Yes, Enterprise accounts can create custom roles with specific permission sets. Contact your account manager to configure custom roles for your organization."
  },
  {
    question: "How do regional managers get assigned to regions?",
    answer: "When creating or editing a regional manager account, you assign them to specific locations. They automatically have access to all locations in their region."
  },
  {
    question: "Can staff see customer data?",
    answer: "Staff can view anonymized insurance purchase data (number of policies, coverage types) but cannot see member names, email addresses, or payment details unless given explicit custom permissions."
  },
  {
    question: "Is there a limit on users per location?",
    answer: "No limit on users. You can have as many staff accounts as needed at each location. Common setup is 1 location manager + 3-10 staff per location."
  }
]

export default function PermissionsPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Enterprise", href: "/support-hub/enterprise" },
          { label: "Role-Based Permissions" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-teal-600 font-semibold text-sm mb-6">
          <Shield className="w-4 h-4" />
          Access Control
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Granular Access Control
          <span className="block mt-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            By Role & Location
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Four built-in roles with customizable permissions. Control exactly what each
          team member can see and do across your entire organization.
        </p>
      </motion.div>

      {/* Roles Overview */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Role Types
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Four standard roles designed for multi-location organizations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="h-full">
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0`}>
                      <role.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{role.name}</h3>
                      <p className="text-slate-600 mb-3">{role.description}</p>
                      <p className="text-sm text-teal-600 font-semibold">
                        Best for: {role.bestFor}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-200">
                    {Object.entries(role.permissions).map(([key, value], i) => (
                      <div key={i} className="flex justify-between items-start text-sm">
                        <span className="text-slate-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-semibold text-slate-900 text-right ml-4">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Permissions Matrix */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Permissions Matrix
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Detailed breakdown of what each role can do
          </p>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-6 text-slate-900 font-bold min-w-[200px]">Feature</th>
                  <th className="text-center p-6 text-purple-600 font-bold min-w-[140px]">Corporate Admin</th>
                  <th className="text-center p-6 text-blue-600 font-bold min-w-[140px]">Regional Manager</th>
                  <th className="text-center p-6 text-teal-600 font-bold min-w-[140px]">Location Manager</th>
                  <th className="text-center p-6 text-slate-600 font-bold min-w-[100px]">Staff</th>
                </tr>
              </thead>
              <tbody>
                {permissionsMatrix.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                  >
                    <td className="p-6 font-medium text-slate-900">{row.feature}</td>
                    <td className="p-6 text-center">
                      {row.corporateAdmin === 'full' && <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />}
                      {row.corporateAdmin === 'none' && <X className="w-6 h-6 text-red-400 mx-auto" />}
                      {!['full', 'none'].includes(row.corporateAdmin) && (
                        <span className="text-sm text-slate-600">{row.corporateAdmin}</span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {row.regionalManager === 'full' && <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />}
                      {row.regionalManager === 'none' && <X className="w-6 h-6 text-red-400 mx-auto" />}
                      {!['full', 'none'].includes(row.regionalManager) && (
                        <span className="text-sm text-slate-600">{row.regionalManager}</span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {row.locationManager === 'full' && <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />}
                      {row.locationManager === 'none' && <X className="w-6 h-6 text-red-400 mx-auto" />}
                      {!['full', 'none'].includes(row.locationManager) && (
                        <span className="text-sm text-slate-600">{row.locationManager}</span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {row.staff === 'full' && <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />}
                      {row.staff === 'none' && <X className="w-6 h-6 text-red-400 mx-auto" />}
                      {!['full', 'none'].includes(row.staff) && (
                        <span className="text-sm text-slate-600">{row.staff}</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700">Full Access</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                <span className="text-slate-700">No Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">Limited/Conditional Access</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Setup Steps */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Setting Up User Roles
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            How to add users and assign roles across your organization
          </p>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="p-8">
            <div className="space-y-4">
              {setupSteps.map((step, index) => (
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
                      <span className="text-white font-bold text-sm">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-1">{step.title}</h4>
                      <p className="text-slate-700 mb-2">{step.instruction}</p>
                      <p className="text-sm text-slate-600 italic">{step.details}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Scenario Examples */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Real-World Examples
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            How different organizations structure their permissions
          </p>
        </motion.div>

        <div className="space-y-6">
          {scenarioExamples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">{example.scenario}</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-4">Structure</h4>
                      <ul className="space-y-2">
                        {example.structure.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                            <Users className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 bg-teal-50 rounded-xl border border-teal-100">
                      <h4 className="font-bold text-teal-900 mb-4">Implementation</h4>
                      <p className="text-sm text-teal-700">{example.implementation}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Custom Permissions */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Custom Permissions
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Override default role permissions for specific use cases
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {customPermissionExamples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="h-full">
                <div className="p-8">
                  <Key className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{example.useCase}</h3>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs font-semibold text-blue-900 mb-1">How To</p>
                      <p className="text-sm text-blue-700">{example.howTo}</p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                      <p className="text-xs font-semibold text-teal-900 mb-1">Why</p>
                      <p className="text-sm text-teal-700">{example.reason}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
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
              <Link href="/support-hub/enterprise/multi-location">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <Building2 className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Multi-Location Setup
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Configure locations and hierarchies
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    Setup Locations
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/enterprise/sso">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <Lock className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Single Sign-On
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Integrate with your identity provider
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    Setup SSO
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>

              <Link href="/support-hub/enterprise">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 hover:border-teal-300 transition-all group"
                >
                  <Shield className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    All Enterprise Features
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Explore all enterprise capabilities
                  </p>
                  <div className="flex items-center text-teal-600 font-semibold">
                    View All
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
