"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  Lock,
  Shield,
  Key,
  Users,
  CheckCircle,
  ArrowRight,
  Settings,
  Globe,
  AlertCircle,
  FileText,
  Code,
  Zap,
  Building2,
  UserCheck
} from "lucide-react"

const ssoProviders = [
  {
    name: "SAML 2.0",
    description: "Enterprise-grade SSO with identity providers like Okta, Azure AD, OneLogin",
    icon: Shield,
    features: [
      "Full SAML 2.0 compliance",
      "Automatic user provisioning",
      "Role mapping",
      "Just-in-time provisioning"
    ],
    bestFor: "Large enterprises with existing IdP",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "OAuth 2.0",
    description: "Modern authentication with Google Workspace, Microsoft 365, GitHub",
    icon: Key,
    features: [
      "OAuth 2.0 / OpenID Connect",
      "Social login support",
      "Token-based authentication",
      "Refresh token rotation"
    ],
    bestFor: "Modern cloud-based organizations",
    color: "from-teal-500 to-green-500"
  },
  {
    name: "Active Directory",
    description: "Direct integration with on-premise Active Directory",
    icon: Building2,
    features: [
      "LDAP integration",
      "AD group synchronization",
      "Seamless authentication",
      "Password sync optional"
    ],
    bestFor: "On-premise infrastructure",
    color: "from-purple-500 to-pink-500"
  }
]

const setupSteps = [
  {
    step: 1,
    title: "Contact Enterprise Support",
    description: "Request SSO activation for your enterprise account",
    action: "Email: enterprise@dailyeventinsurance.com",
    icon: Users
  },
  {
    step: 2,
    title: "Choose SSO Provider",
    description: "Select your identity provider (SAML, OAuth, AD)",
    action: "Confirm which IdP you're using (Okta, Azure AD, etc.)",
    icon: Shield
  },
  {
    step: 3,
    title: "Configure Identity Provider",
    description: "Add Daily Event Insurance as a connected app in your IdP",
    action: "Use our SSO metadata provided by support team",
    icon: Settings
  },
  {
    step: 4,
    title: "Exchange Configuration Details",
    description: "Share your IdP metadata with us, we'll configure our side",
    action: "Provide entity ID, SSO URL, and signing certificate",
    icon: FileText
  },
  {
    step: 5,
    title: "Map User Attributes",
    description: "Configure how user roles and attributes are mapped",
    action: "Define email, name, role mappings",
    icon: Code
  },
  {
    step: 6,
    title: "Test SSO Connection",
    description: "Test authentication flow with test accounts",
    action: "Login with test user to verify configuration",
    icon: UserCheck
  },
  {
    step: 7,
    title: "Enable for Organization",
    description: "Activate SSO for all users in your organization",
    action: "Users will use SSO on next login",
    icon: Zap
  }
]

const samlConfiguration = {
  required: [
    { field: "Entity ID", description: "Unique identifier for your organization", example: "https://your-company.com" },
    { field: "SSO URL", description: "Identity provider's single sign-on endpoint", example: "https://idp.example.com/sso" },
    { field: "X.509 Certificate", description: "Public certificate for SAML assertion signing", example: "PEM-encoded certificate" },
    { field: "Assertion Consumer Service URL", description: "Where we send SAML responses", example: "https://api.dailyeventinsurance.com/sso/acs" }
  ],
  optional: [
    { field: "Single Logout URL", description: "Endpoint for logout requests", example: "https://idp.example.com/logout" },
    { field: "Name ID Format", description: "Format for user identifiers", example: "emailAddress (default)" },
    { field: "Attribute Mappings", description: "Custom attribute field mappings", example: "firstName → givenName" }
  ]
}

const attributeMapping = [
  {
    attribute: "Email",
    required: true,
    samlClaim: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    description: "User's email address (used as unique identifier)"
  },
  {
    attribute: "First Name",
    required: true,
    samlClaim: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
    description: "User's first name"
  },
  {
    attribute: "Last Name",
    required: true,
    samlClaim: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
    description: "User's last name"
  },
  {
    attribute: "Role",
    required: false,
    samlClaim: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    description: "User's role in the system (maps to our permission levels)"
  },
  {
    attribute: "Location",
    required: false,
    samlClaim: "custom:location",
    description: "User's assigned location(s) for multi-location setups"
  }
]

const securityFeatures = [
  {
    title: "Automatic User Provisioning",
    description: "Users are created automatically on first SSO login",
    icon: Users
  },
  {
    title: "Role-Based Access",
    description: "IdP groups automatically map to platform roles",
    icon: Shield
  },
  {
    title: "Session Management",
    description: "Centralized session control and timeout settings",
    icon: Lock
  },
  {
    title: "Audit Logging",
    description: "Complete audit trail of all authentication events",
    icon: FileText
  }
]

const commonProviderGuides = [
  {
    provider: "Okta",
    steps: [
      "Admin Console → Applications → Create App Integration",
      "Choose SAML 2.0",
      "Enter SSO URL: https://api.dailyeventinsurance.com/sso/acs",
      "Enter Audience URI: https://dailyeventinsurance.com",
      "Attribute Statements: email, firstName, lastName",
      "Assign users or groups to the application",
      "Download metadata and share with our support team"
    ]
  },
  {
    provider: "Azure AD (Microsoft Entra ID)",
    steps: [
      "Azure Portal → Enterprise Applications → New Application",
      "Create your own application → Integrate any app (non-gallery)",
      "Set up single sign-on → SAML",
      "Basic SAML Config → Identifier: https://dailyeventinsurance.com",
      "Reply URL: https://api.dailyeventinsurance.com/sso/acs",
      "User Attributes: emailaddress, givenname, surname",
      "Assign users or groups",
      "Download Federation Metadata XML"
    ]
  },
  {
    provider: "Google Workspace",
    steps: [
      "Admin Console → Apps → Web and mobile apps",
      "Add custom SAML app",
      "Name: Daily Event Insurance",
      "Download Google IdP metadata",
      "ACS URL: https://api.dailyeventinsurance.com/sso/acs",
      "Entity ID: https://dailyeventinsurance.com",
      "Start URL: https://dashboard.dailyeventinsurance.com",
      "Attribute mapping: Primary email → email",
      "Assign to organizational units"
    ]
  }
]

const faqs = [
  {
    question: "What SSO providers do you support?",
    answer: "We support any SAML 2.0 compliant identity provider (Okta, Azure AD, OneLogin, Google Workspace, Ping Identity, etc.) and OAuth 2.0 providers. We also support direct Active Directory integration via LDAP."
  },
  {
    question: "Can users still use password login with SSO enabled?",
    answer: "By default, SSO becomes the only authentication method when enabled. However, you can configure fallback password authentication for specific admin accounts or allow both methods."
  },
  {
    question: "How long does SSO setup take?",
    answer: "Initial configuration takes 1-2 business days once we receive your IdP metadata. Testing and refinement typically adds another 1-2 days. Total time: 2-4 business days."
  },
  {
    question: "What happens if our IdP goes down?",
    answer: "You can configure emergency admin accounts that bypass SSO for critical access. Additionally, we can enable temporary password authentication if your IdP has extended downtime."
  },
  {
    question: "Can we use different SSO providers for different locations?",
    answer: "Yes. Enterprise accounts can configure location-specific SSO providers. For example, corporate uses Azure AD while franchisees use Google Workspace."
  },
  {
    question: "Is there an additional cost for SSO?",
    answer: "SSO is included with Enterprise accounts at no additional cost. Implementation and ongoing support are also included."
  }
]

export default function SSOPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Enterprise", href: "/support-hub/enterprise" },
          { label: "Single Sign-On (SSO)" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 font-semibold text-sm mb-6">
          <Lock className="w-4 h-4" />
          SSO Integration
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Secure Single Sign-On
          <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            For Enterprise
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Seamless authentication with SAML 2.0, OAuth 2.0, and Active Directory integration.
          One login for all your enterprise applications.
        </p>
      </motion.div>

      {/* SSO Providers */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Supported Authentication Methods
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the authentication method that fits your infrastructure
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {ssoProviders.map((provider, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="h-full">
                <div className="p-8">
                  <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${provider.color} flex items-center justify-center`}>
                    <provider.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{provider.name}</h3>
                  <p className="text-slate-600 mb-6">{provider.description}</p>

                  <ul className="space-y-3 mb-6">
                    {provider.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                      <strong>Best for:</strong> {provider.bestFor}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
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
            SSO Setup Process
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our team guides you through every step of the integration
          </p>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="p-8">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 hidden md:block" />

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
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-white border-4 border-blue-500 items-center justify-center flex-shrink-0 z-10">
                      <step.icon className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1 p-6 bg-white/50 rounded-xl border border-white/40">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                          STEP {step.step}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                      </div>
                      <p className="text-slate-600 mb-3">{step.description}</p>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-700 font-medium">
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

      {/* SAML Configuration */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            SAML Configuration Details
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Technical requirements for SAML 2.0 integration
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard variant="elevated" className="h-full">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Required Fields</h3>
                <div className="space-y-4">
                  {samlConfiguration.required.map((field, index) => (
                    <div key={index} className="p-4 bg-white/50 rounded-lg border border-white/40">
                      <h4 className="font-bold text-slate-900 mb-1">{field.field}</h4>
                      <p className="text-sm text-slate-600 mb-2">{field.description}</p>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {field.example}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard variant="elevated" className="h-full">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Optional Fields</h3>
                <div className="space-y-4">
                  {samlConfiguration.optional.map((field, index) => (
                    <div key={index} className="p-4 bg-white/50 rounded-lg border border-white/40">
                      <h4 className="font-bold text-slate-900 mb-1">{field.field}</h4>
                      <p className="text-sm text-slate-600 mb-2">{field.description}</p>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {field.example}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Attribute Mapping */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            User Attribute Mapping
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            How user data is mapped from your identity provider
          </p>
        </motion.div>

        <GlassCard variant="elevated">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-6 text-slate-900 font-bold">Attribute</th>
                  <th className="text-left p-6 text-slate-900 font-bold">Required</th>
                  <th className="text-left p-6 text-slate-900 font-bold">SAML Claim</th>
                  <th className="text-left p-6 text-slate-900 font-bold">Description</th>
                </tr>
              </thead>
              <tbody>
                {attributeMapping.map((attr, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                  >
                    <td className="p-6 font-semibold text-slate-900">{attr.attribute}</td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        attr.required ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {attr.required ? 'Required' : 'Optional'}
                      </span>
                    </td>
                    <td className="p-6">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {attr.samlClaim}
                      </code>
                    </td>
                    <td className="p-6 text-slate-600">{attr.description}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      {/* Security Features */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Security Features
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Enterprise-grade security built into every SSO integration
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="h-full text-center">
                <div className="p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Provider-Specific Guides */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Provider Setup Guides
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Step-by-step instructions for popular identity providers
          </p>
        </motion.div>

        <div className="space-y-6">
          {commonProviderGuides.map((guide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">{guide.provider}</h3>
                  <ol className="space-y-4">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="text-slate-700 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
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
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-slate-700 pl-7">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
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
                Ready to Enable SSO?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                Contact our enterprise team to start your SSO integration.
                We'll guide you through the entire process.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="mailto:enterprise@dailyeventinsurance.com?subject=SSO Setup Request">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                    Request SSO Setup
                  </button>
                </Link>
                <Link href="/support-hub/enterprise">
                  <button className="px-8 py-4 bg-white/70 backdrop-blur-xl border border-white/40 text-slate-900 rounded-xl font-semibold hover:shadow-lg transition-all">
                    View Enterprise Features
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
