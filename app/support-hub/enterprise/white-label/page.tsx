"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  Palette,
  Globe,
  Image,
  Type,
  Mail,
  Layout,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Settings,
  Eye,
  Upload,
  Code,
  AlertCircle
} from "lucide-react"

const brandingElements = [
  {
    title: "Custom Domain",
    description: "Use your own domain for the insurance checkout experience",
    icon: Globe,
    example: "insurance.yourbrand.com",
    setup: "Point your DNS to our servers, we'll handle SSL",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Logo & Branding",
    description: "Upload your logo, favicon, and brand assets",
    icon: Image,
    example: "Your logo appears throughout checkout and emails",
    setup: "Upload PNG/SVG in Settings → White-Label",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Color Scheme",
    description: "Customize primary, secondary, and accent colors",
    icon: Palette,
    example: "Match your existing brand guidelines",
    setup: "Hex color picker or upload brand palette JSON",
    color: "from-teal-500 to-green-500"
  },
  {
    title: "Typography",
    description: "Use your brand fonts throughout the experience",
    icon: Type,
    example: "Choose from Google Fonts or upload custom fonts",
    setup: "Select font families for headings and body text",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Email Templates",
    description: "Customize confirmation and claim emails",
    icon: Mail,
    example: "Emails sent from your domain with your branding",
    setup: "HTML templates with merge tags",
    color: "from-indigo-500 to-purple-500"
  },
  {
    title: "Custom Messaging",
    description: "Personalize copy, CTAs, and legal disclaimers",
    icon: Layout,
    example: "Change button text, headers, and descriptions",
    setup: "Edit text strings in branding dashboard",
    color: "from-pink-500 to-rose-500"
  }
]

const setupSteps = [
  {
    step: 1,
    title: "Access White-Label Settings",
    instruction: "Navigate to Settings → White-Label Configuration",
    details: "Available for Enterprise accounts only"
  },
  {
    step: 2,
    title: "Upload Brand Assets",
    instruction: "Upload logo (SVG recommended), favicon, and any additional brand imagery",
    details: "Logo: 500x200px minimum, transparent background preferred"
  },
  {
    step: 3,
    title: "Configure Color Palette",
    instruction: "Enter hex codes for primary, secondary, accent, and text colors",
    details: "Test contrast ratios to ensure accessibility"
  },
  {
    step: 4,
    title: "Set Typography",
    instruction: "Select font families from Google Fonts library or upload custom fonts",
    details: "Choose heading font and body font separately"
  },
  {
    step: 5,
    title: "Customize Domain (Optional)",
    instruction: "Add CNAME record pointing to insurance.dailyeventinsurance.com",
    details: "We'll provision SSL certificate within 24 hours"
  },
  {
    step: 6,
    title: "Personalize Email Templates",
    instruction: "Edit confirmation, reminder, and claim emails with your messaging",
    details: "Preview emails before activating"
  },
  {
    step: 7,
    title: "Preview & Activate",
    instruction: "Review full checkout flow in preview mode, then activate",
    details: "Changes take effect immediately for new policies"
  }
]

const customizationLevels = [
  {
    level: "Basic Branding",
    features: [
      "Logo in checkout header",
      "Primary brand color",
      "Custom email signature",
      "Basic color scheme"
    ],
    bestFor: "Quick branded experience",
    timeToSetup: "15 minutes"
  },
  {
    level: "Full White-Label",
    features: [
      "Custom domain",
      "Complete color palette",
      "Custom fonts",
      "Branded emails",
      "Custom messaging",
      "Favicon and icons"
    ],
    bestFor: "Complete brand immersion",
    timeToSetup: "2-4 hours"
  },
  {
    level: "Enterprise Custom",
    features: [
      "Everything in Full White-Label",
      "Custom checkout flow",
      "Embedded widget styling",
      "API-first integration",
      "Custom legal disclaimers",
      "Dedicated design support"
    ],
    bestFor: "Unique experiences and advanced integrations",
    timeToSetup: "1-2 weeks with design team"
  }
]

const technicalRequirements = [
  {
    category: "Logo Files",
    requirements: [
      "Format: SVG, PNG (with transparency)",
      "Dimensions: 500x200px minimum",
      "File size: Under 500KB",
      "Dark and light versions recommended"
    ]
  },
  {
    category: "Color Palette",
    requirements: [
      "Primary color (hex code)",
      "Secondary color (hex code)",
      "Accent color (hex code)",
      "Background colors (light/dark mode)",
      "WCAG AA contrast ratios required"
    ]
  },
  {
    category: "Custom Domain",
    requirements: [
      "CNAME record: insurance.yourbrand.com",
      "Points to: white-label.dailyeventinsurance.com",
      "SSL certificate (we handle this)",
      "DNS propagation: 24-48 hours"
    ]
  },
  {
    category: "Custom Fonts",
    requirements: [
      "Google Fonts (select from library)",
      "Or upload WOFF/WOFF2 files",
      "Max 2 font families",
      "Licensing: must allow web embedding"
    ]
  }
]

const exampleBrands = [
  {
    company: "Apex Fitness",
    description: "National gym chain with 200+ locations",
    customization: "Custom domain (insurance.apexfitness.com), red/black color scheme, custom fonts",
    result: "Members experience seamless brand continuity"
  },
  {
    company: "Summit Adventures",
    description: "Outdoor adventure company",
    customization: "Green/orange palette matching outdoor brand, custom email templates",
    result: "85% brand recognition in customer surveys"
  },
  {
    company: "Urban Yoga Collective",
    description: "Boutique yoga studios",
    customization: "Calming purple/blue palette, custom domain, mindfulness-focused messaging",
    result: "40% increase in insurance attachment rate"
  }
]

const faqs = [
  {
    question: "How long does white-label setup take?",
    answer: "Basic branding (logo + colors) takes 15 minutes. Full white-label with custom domain and fonts takes 2-4 hours. Custom domain activation requires 24-48 hours for DNS propagation and SSL provisioning."
  },
  {
    question: "Can I use my own fonts?",
    answer: "Yes. You can select from our Google Fonts library (800+ fonts) or upload custom fonts (WOFF/WOFF2 format). Custom fonts must include web embedding licenses."
  },
  {
    question: "Will my branding appear in claim emails?",
    answer: "Yes. All customer-facing emails (confirmations, reminders, claim updates) use your branding, logo, and custom messaging. You can customize email templates in Settings → White-Label → Email Templates."
  },
  {
    question: "Can I customize the legal disclaimers?",
    answer: "You can add supplementary disclaimers, but core insurance policy language must remain unchanged per regulatory requirements. Enterprise Custom plans include legal review for custom disclaimers."
  },
  {
    question: "What if I rebrand my business?",
    answer: "Update your branding anytime in Settings → White-Label. Changes take effect immediately for new policies. Existing policies retain the branding from purchase date for consistency."
  },
  {
    question: "Is there a cost for white-label features?",
    answer: "White-label features are included with Enterprise accounts. No additional per-location or per-user fees."
  }
]

export default function WhiteLabelPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Enterprise", href: "/support-hub/enterprise" },
          { label: "White-Label Branding" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 font-semibold text-sm mb-6">
          <Palette className="w-4 h-4" />
          White-Label Configuration
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Insurance That Looks Like
          <span className="block mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Brand
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Complete customization of the insurance experience with your colors, logo, domain,
          and messaging. Your members never know they're using a third-party insurance platform.
        </p>
      </motion.div>

      {/* Branding Elements */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            What You Can Customize
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Every element of the insurance experience can match your brand
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandingElements.map((element, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="h-full">
                <div className="p-8">
                  <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${element.color} flex items-center justify-center`}>
                    <element.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">{element.title}</h3>
                  <p className="text-slate-600 mb-4">{element.description}</p>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-700">
                        <strong>Example:</strong> {element.example}
                      </p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                      <p className="text-sm text-teal-700">
                        <strong>Setup:</strong> {element.setup}
                      </p>
                    </div>
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
            Setup Guide
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Follow these steps to configure your white-label branding
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
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

      {/* Customization Levels */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Customization Levels
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the level of customization that fits your needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {customizationLevels.map((level, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant={index === 1 ? "featured" : "elevated"} className="h-full">
                <div className="p-8">
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
                        <Sparkles className="w-3 h-3" /> Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{level.level}</h3>

                  <div className="space-y-3 mb-6">
                    {level.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-6 border-t border-slate-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Best for:</span>
                      <span className="font-semibold text-slate-900">{level.bestFor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Setup time:</span>
                      <span className="font-semibold text-teal-600">{level.timeToSetup}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technical Requirements */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Technical Requirements
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Specifications for logos, colors, domains, and fonts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {technicalRequirements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated" className="h-full">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="w-8 h-8 text-purple-600" />
                    <h3 className="text-2xl font-bold text-slate-900">{item.category}</h3>
                  </div>

                  <ul className="space-y-3">
                    {item.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Example Brands */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            White-Label Success Stories
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See how brands use white-label features
          </p>
        </motion.div>

        <div className="space-y-6">
          {exampleBrands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard variant="elevated">
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{brand.company}</h3>
                      <p className="text-slate-600 mb-4">{brand.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Customization</p>
                          <p className="text-sm text-blue-700">{brand.customization}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-sm font-semibold text-green-900 mb-1">Result</p>
                          <p className="text-sm text-green-700">{brand.result}</p>
                        </div>
                      </div>
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
                    <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
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
              <Eye className="w-16 h-16 mx-auto mb-6 text-purple-600" />
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Ready to See It in Action?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                Schedule a demo to see how your brand could look with white-label insurance.
                We'll create a custom preview with your branding.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="mailto:enterprise@dailyeventinsurance.com?subject=White-Label Demo Request">
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                    Request Demo
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
