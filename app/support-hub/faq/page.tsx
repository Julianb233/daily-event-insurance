"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  Search,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  MessageCircle,
  BookOpen,
  CreditCard,
  Package,
  FileCheck,
  Building2,
  Sparkles,
} from "lucide-react"

interface Question {
  id: string
  q: string
  a: string
  popular?: boolean
}

interface FAQCategory {
  category: string
  icon: React.ReactNode
  questions: Question[]
}

const faqs: FAQCategory[] = [
  {
    category: "Getting Started",
    icon: <Sparkles className="w-5 h-5" />,
    questions: [
      {
        id: "gs1",
        q: "How do I become a partner with Daily Event Insurance?",
        a: "Becoming a partner is simple! First, visit our partner portal and complete the registration form. You'll need to provide your business information, tax ID, and banking details for commission payments. Once submitted, our team will review your application within 2-3 business days. Upon approval, you'll receive API credentials, access to our dashboard, and onboarding materials to get started.",
        popular: true,
      },
      {
        id: "gs2",
        q: "What are the requirements to sell Daily Event Insurance?",
        a: "Partners must be registered businesses operating legally in their jurisdiction. You'll need an active business license, liability insurance (minimum $1M), and the ability to integrate our API or embed our widget. For fitness studios and event venues, you must have an established business with regular events or classes. We require partners to complete our certification training before going live.",
        popular: true,
      },
      {
        id: "gs3",
        q: "How long does the integration process take?",
        a: "Integration time varies by method. Our JavaScript widget can be implemented in under 30 minutes with no backend required. API integration typically takes 1-3 days for developers familiar with REST APIs. We provide sandbox environments, comprehensive documentation, and technical support throughout the process. Most partners are fully live within one week of approval.",
      },
      {
        id: "gs4",
        q: "Do I need to be an insurance broker or agent to partner?",
        a: "No insurance license is required! We handle all regulatory compliance and underwriting. You simply facilitate the sale as an authorized partner. Our program is designed for fitness studios, event venues, activity centers, and service providers who want to offer protection to their customers without needing insurance expertise.",
      },
      {
        id: "gs5",
        q: "What support is available during onboarding?",
        a: "We provide comprehensive onboarding support including dedicated account managers, live implementation assistance, video tutorials, API documentation, and access to our support hub. Enterprise partners receive priority support and white-glove onboarding. Our team is available via email, chat, and scheduled calls throughout your integration process.",
      },
      {
        id: "gs6",
        q: "Can I test the system before going live?",
        a: "Absolutely! All partners receive full access to our sandbox environment. You can test the complete purchase flow, API integrations, webhook events, and commission calculations with test data. Sandbox access is unlimited and perfect for training your staff before launching to customers.",
      },
      {
        id: "gs7",
        q: "What marketing materials are provided?",
        a: "Partners receive a complete marketing toolkit including customizable email templates, social media graphics, website copy, in-studio signage templates, and customer education materials. Enterprise partners can request custom branding and co-branded materials. All assets are available in your partner dashboard immediately upon approval.",
      },
      {
        id: "gs8",
        q: "Is there a minimum sales requirement?",
        a: "No minimum sales requirements exist for partners. You earn commissions on every policy sold, regardless of volume. However, partners who consistently generate sales qualify for higher commission tiers and additional benefits through our partner rewards program.",
      },
    ],
  },
  {
    category: "Coverage",
    icon: <Package className="w-5 h-5" />,
    questions: [
      {
        id: "cov1",
        q: "What types of events and activities are covered?",
        a: "Daily Event Insurance covers a wide range of activities including fitness classes (yoga, CrossFit, spin, HIIT), recreational sports, workshops, community events, private parties, outdoor adventures, wellness retreats, and similar activities. Coverage includes participant accident medical, general liability, and event cancellation. We cover both indoor and outdoor events with up to 500 participants per event.",
        popular: true,
      },
      {
        id: "cov2",
        q: "What are the coverage limits and deductibles?",
        a: "Standard coverage includes: General Liability up to $2M per occurrence, Participant Accident Medical up to $25K per person, and Event Cancellation up to the policy premium value. Deductibles range from $100-$500 depending on coverage type. Higher limits are available for premium and enterprise policies. All policies include legal defense costs in addition to policy limits.",
      },
      {
        id: "cov3",
        q: "Are extreme sports and high-risk activities covered?",
        a: "Coverage depends on the specific activity. Moderate-risk activities like rock climbing, obstacle courses, and martial arts are covered with appropriate premiums. Extreme sports like skydiving, BASE jumping, or motorsports require custom underwriting. Our risk assessment tool in the API will automatically flag activities requiring additional review.",
        popular: true,
      },
      {
        id: "cov4",
        q: "Does coverage extend to equipment damage?",
        a: "Standard policies include incidental equipment coverage up to $5,000 per occurrence for damage caused by covered events. This includes items like sound systems, fitness equipment, and rental gear. For higher-value equipment, partners can offer enhanced property coverage as an add-on, increasing limits to $50K.",
      },
      {
        id: "cov5",
        q: "What exclusions should customers be aware of?",
        a: "Standard exclusions include: pre-existing medical conditions, intentional misconduct, professional sports, activities under the influence of drugs/alcohol, and events not disclosed during purchase. Communicable disease coverage is available as an add-on. Partners should ensure customers review the full policy terms during checkout.",
      },
      {
        id: "cov6",
        q: "Can coverage be purchased for multi-day events?",
        a: "Yes! Policies can cover single-day events or multi-day events up to 7 consecutive days. Pricing scales based on duration and daily participant count. For events longer than 7 days, such as month-long workshops or retreats, contact our enterprise team for custom policy structures.",
      },
      {
        id: "cov7",
        q: "How does weather-related cancellation coverage work?",
        a: "Weather cancellation coverage protects against losses from severe weather that prevents the event from occurring safely. Covered perils include hurricanes, severe thunderstorms, flooding, and heavy snow. The weather must be verified by a recognized meteorological service, and claims are processed based on actual documented expenses and lost revenue.",
      },
      {
        id: "cov8",
        q: "Are instructors and staff covered under participant policies?",
        a: "Event staff and instructors are covered under the general liability portion but not participant accident medical (which covers attendees). For comprehensive instructor coverage, we recommend partners maintain their own professional liability insurance. We offer referrals to commercial insurance providers for annual instructor policies.",
      },
    ],
  },
  {
    category: "Payments",
    icon: <CreditCard className="w-5 h-5" />,
    questions: [
      {
        id: "pay1",
        q: "How much commission do partners earn per policy?",
        a: "Partners earn 20-35% commission on every policy sold, depending on your tier. New partners start at 20%, with increases based on monthly volume: 25% at $5K/month, 30% at $15K/month, and 35% at $50K/month. Enterprise partners negotiate custom commission structures. Commissions are calculated on the gross policy premium.",
        popular: true,
      },
      {
        id: "pay2",
        q: "When are commissions paid out?",
        a: "Commissions are paid monthly on the 15th for all policies sold in the previous month. Payments are made via ACH direct deposit to your registered bank account. You can track pending and paid commissions in real-time through your partner dashboard. International partners receive wire transfers within 3-5 business days.",
        popular: true,
      },
      {
        id: "pay3",
        q: "What happens to commissions if a policy is cancelled?",
        a: "If a customer cancels within the 30-day refund period before the event date, the commission is reversed and deducted from your next payment. Policies cancelled within 48 hours of the event or after the event date are non-refundable, and commissions are retained. All cancellations and reversals are clearly tracked in your dashboard.",
      },
      {
        id: "pay4",
        q: "Are there any transaction fees?",
        a: "No transaction fees are charged to partners. Credit card processing fees are built into the policy pricing. Customers pay the full policy amount, and your commission is calculated from that total. For white-label partners who process payments directly, standard Stripe fees (2.9% + $0.30) apply.",
      },
      {
        id: "pay5",
        q: "Can customers pay with payment plans or installments?",
        a: "Single-event policies require full payment at time of purchase. For enterprise partners with annual contracts or high-volume accounts, we can arrange invoicing and payment terms. Multi-event package purchases (10+ events) can be structured with installment options through our enterprise billing system.",
      },
      {
        id: "pay6",
        q: "How do refunds work for customers?",
        a: "Customers can request full refunds up to 30 days before the event date. Refunds requested within 30 days incur a 10% processing fee. No refunds are available within 48 hours of the event or after the event occurs. Refund requests are processed automatically through the API, and partners are notified via webhook of any commission adjustments.",
      },
      {
        id: "pay7",
        q: "What payment methods are accepted?",
        a: "We accept all major credit cards (Visa, Mastercard, Amex, Discover), debit cards, and digital wallets (Apple Pay, Google Pay). For enterprise clients, we also support ACH bank transfers and invoicing with net-30 terms. International payments are supported in 40+ currencies with automatic conversion.",
      },
      {
        id: "pay8",
        q: "How are chargebacks handled?",
        a: "Chargebacks are rare but handled by our risk team. If a chargeback occurs on a policy you sold, you'll be notified immediately. Commission adjustments are made only after the chargeback is finalized (not during dispute). We maintain detailed transaction records and assist with dispute resolution. Partners with chargeback rates above 1% may require additional review.",
      },
    ],
  },
  {
    category: "Integration",
    icon: <BookOpen className="w-5 h-5" />,
    questions: [
      {
        id: "int1",
        q: "What integration methods are available?",
        a: "We offer three integration methods: (1) JavaScript Widget - embed directly on your website with no backend required, (2) REST API - full programmatic control for custom implementations, and (3) Native Integrations - pre-built plugins for Square, Pike13, Mindbody, and Toast. Choose the method that best fits your technical capabilities and use case.",
        popular: true,
      },
      {
        id: "int2",
        q: "Do you integrate with booking systems like Mindbody?",
        a: "Yes! We have native integrations with Mindbody, Pike13, Square, Toast, and other popular booking systems. These integrations automatically sync event data, add insurance as an upsell during checkout, and provide seamless customer experiences. Custom integrations with other systems can be built using our REST API.",
        popular: true,
      },
      {
        id: "int3",
        q: "What data does the API require to quote and bind policies?",
        a: "The minimum required fields are: event name, date/time, location (address or zip code), activity type, expected participant count, and purchaser information (name, email, phone). Optional fields include instructor names, equipment details, and special requirements. Our API documentation includes field validation rules and example payloads.",
      },
      {
        id: "int4",
        q: "How do webhooks work for real-time updates?",
        a: "Webhooks notify your system of important events: policy purchased, claim filed, policy cancelled, payment processed, and commission adjustments. Configure webhook URLs in your dashboard, and we'll POST JSON payloads to your endpoint. All webhooks include signatures for verification and support automatic retries with exponential backoff.",
      },
      {
        id: "int5",
        q: "Is there a testing environment?",
        a: "Yes, all partners receive full sandbox API access with separate credentials. The sandbox mirrors production functionality but uses test data and doesn't process real payments. Test credit card numbers are provided in our documentation. Webhook testing is supported with tools to manually trigger events.",
      },
      {
        id: "int6",
        q: "What authentication methods are supported?",
        a: "We use API key authentication with separate keys for sandbox and production environments. Keys are passed via the Authorization header: 'Bearer YOUR_API_KEY'. Keys can be rotated anytime in your dashboard. For enterprise SSO integrations, we support OAuth 2.0 and SAML protocols.",
      },
      {
        id: "int7",
        q: "Are there rate limits on API requests?",
        a: "Standard partners have a rate limit of 100 requests per minute per API key. Enterprise partners receive higher limits (1000/min) and dedicated infrastructure. Rate limit headers are included in all responses. If you need higher limits, contact your account manager to discuss your use case.",
      },
      {
        id: "int8",
        q: "Can I white-label the insurance purchase experience?",
        a: "Enterprise partners can fully white-label the experience with custom branding, domains, email templates, and policy documents featuring your logo. The widget accepts custom CSS for styling, and API integrations give complete control over the UI. Standard partners can customize colors and basic branding elements.",
      },
    ],
  },
  {
    category: "Claims",
    icon: <FileCheck className="w-5 h-5" />,
    questions: [
      {
        id: "clm1",
        q: "How do customers file a claim?",
        a: "Customers can file claims through three methods: (1) Online portal using their policy number, (2) Mobile app with photo upload capabilities, or (3) Phone call to our 24/7 claims hotline. Claims must be filed within 30 days of the incident. Required documentation includes incident details, photos, medical reports (for injury claims), and receipts for expenses.",
        popular: true,
      },
      {
        id: "clm2",
        q: "What is the typical claims processing time?",
        a: "Most claims are reviewed within 2-3 business days of submission. Simple claims (under $1,000) can be approved within 24 hours. Payment is issued within 5-7 business days after approval. Complex claims requiring investigation may take 10-14 days. Customers receive status updates via email and can track their claim in the portal.",
        popular: true,
      },
      {
        id: "clm3",
        q: "Do partners get notified when claims are filed?",
        a: "Yes, partners receive webhook notifications and dashboard alerts when claims are filed against policies they sold. You'll see claim status, amounts, and updates in real-time. This helps you support customers and maintain awareness of risk patterns. Partners are not responsible for claim decisions or payments.",
      },
      {
        id: "clm4",
        q: "Will claims affect my commission or partner status?",
        a: "No, legitimate claims do not impact your commissions or partner standing. Claims are a normal part of insurance operations. However, if fraud patterns are detected or claim rates significantly exceed industry norms, we may review your account and provide additional training or guidance.",
      },
      {
        id: "clm5",
        q: "What documentation is required for injury claims?",
        a: "Injury claims require: incident report detailing what happened, medical records or treatment documentation, itemized medical bills, proof of payment, and any relevant photos or witness statements. For claims over $5,000, we may request additional documentation or conduct an investigation.",
      },
      {
        id: "clm6",
        q: "How are liability claims handled?",
        a: "Liability claims are managed by our legal team. When notified of a potential liability issue, we immediately assign a claims adjuster and, if necessary, legal counsel. We handle all communications with claimants and provide defense coverage. Partners should report any incidents or demand letters immediately, even if you're uncertain whether they're covered.",
      },
      {
        id: "clm7",
        q: "Can claims be appealed if initially denied?",
        a: "Yes, customers can appeal denied claims within 30 days of the decision. Appeals should include additional documentation or clarification addressing the denial reason. Appeals are reviewed by senior adjusters not involved in the initial decision. Partners can assist customers with the appeals process but cannot override claim decisions.",
      },
      {
        id: "clm8",
        q: "What happens if a claim exceeds the policy limits?",
        a: "Claims are paid up to the policy limits specified in the coverage. Amounts exceeding policy limits become the responsibility of the insured party. This is why we recommend customers purchase adequate coverage for their event size and risk level. Partners should educate customers on coverage limits during the purchase process.",
      },
    ],
  },
  {
    category: "Enterprise",
    icon: <Building2 className="w-5 h-5" />,
    questions: [
      {
        id: "ent1",
        q: "What features are included in enterprise partnerships?",
        a: "Enterprise partnerships include: custom commission structures (up to 35%), white-label branding, dedicated account management, priority support, custom API rate limits, SSO integration, centralized billing across multiple locations, advanced analytics, and quarterly business reviews. Minimum requirements vary based on industry and volume projections.",
        popular: true,
      },
      {
        id: "ent2",
        q: "Can we manage multiple locations under one account?",
        a: "Absolutely! Enterprise accounts include multi-location management with centralized dashboards. Each location can have separate branding, pricing, and reporting while maintaining unified billing and commission payments. You can set permissions for location managers and view consolidated or location-specific analytics.",
      },
      {
        id: "ent3",
        q: "Is SSO (Single Sign-On) available?",
        a: "Yes, enterprise partners can integrate SSO using SAML 2.0 or OAuth 2.0 protocols. This allows your team to access the partner portal using your existing identity provider (Azure AD, Okta, Google Workspace, etc.). We also support SCIM for automated user provisioning and de-provisioning.",
      },
      {
        id: "ent4",
        q: "Can we have custom policy terms or coverage adjustments?",
        a: "Enterprise partners can work with our underwriting team to customize coverage terms, adjust limits, modify exclusions, or create specialized policies for unique activities. Custom policies require underwriting approval and may affect pricing. This is ideal for franchise operations or specialty activity providers.",
      },
      {
        id: "ent5",
        q: "What SLA guarantees are provided for enterprise?",
        a: "Enterprise partners receive guaranteed 99.9% API uptime, priority support with 2-hour response times during business hours, dedicated account manager with quarterly reviews, and priority access to new features. Critical issues receive 24/7 escalation paths. Full SLA terms are outlined in enterprise agreements.",
      },
      {
        id: "ent6",
        q: "Can we use our own payment processor?",
        a: "Yes, enterprise partners can use their own Stripe or payment processor for white-label implementations. You'll process payments directly and remit premiums to us minus your commission. This provides maximum control over the customer payment experience and can reduce processing fees for high-volume partners.",
      },
      {
        id: "ent7",
        q: "Are volume discounts available for large partners?",
        a: "Enterprise partners receive volume-based pricing with tiered discounts starting at $50K in annual policy sales. Higher volumes unlock lower base rates, allowing you to offer more competitive pricing or increase margins. Custom pricing structures are negotiated based on projected volume, retention rates, and loss ratios.",
      },
      {
        id: "ent8",
        q: "What training is provided for enterprise teams?",
        a: "Enterprise partnerships include comprehensive team training: live onboarding sessions, recorded training modules, certification programs for staff, sales training materials, and ongoing education webinars. We can customize training for your specific use cases and conduct on-site training for large implementations.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const popularQuestions = useMemo(() => {
    return faqs.flatMap((cat) => cat.questions.filter((q) => q.popular))
  }, [])

  const filteredFaqs = useMemo(() => {
    if (!searchQuery && !activeCategory) return faqs

    return faqs
      .map((category) => ({
        ...category,
        questions: category.questions.filter((q) => {
          const matchesSearch =
            !searchQuery ||
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
          const matchesCategory =
            !activeCategory || category.category === activeCategory
          return matchesSearch && matchesCategory
        }),
      }))
      .filter((category) => category.questions.length > 0)
  }, [searchQuery, activeCategory])

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedQuestions(newExpanded)
  }

  const totalQuestions = faqs.reduce((sum, cat) => sum + cat.questions.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Breadcrumbs items={[{ label: "FAQ" }]} />

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl shadow-lg">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Frequently Asked Questions
                </h1>
                <p className="text-slate-600 mt-1">
                  {totalQuestions} questions across {faqs.length} categories
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard variant="elevated" className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === null
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-white/50 text-slate-600 hover:bg-white/80"
                }`}
              >
                All Categories
              </button>
              {faqs.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setActiveCategory(category.category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeCategory === category.category
                      ? "bg-teal-500 text-white shadow-md"
                      : "bg-white/50 text-slate-600 hover:bg-white/80"
                  }`}
                >
                  {category.icon}
                  {category.category}
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Popular Questions */}
        {!searchQuery && !activeCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <GlassCard variant="featured" className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Most Popular Questions
                </h2>
              </div>
              <div className="space-y-2">
                {popularQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => {
                      toggleQuestion(question.id)
                      // Scroll to the question
                      const element = document.getElementById(question.id)
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" })
                      }
                    }}
                    className="w-full text-left px-4 py-3 bg-white/50 hover:bg-white/80 rounded-lg transition-all flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
                    <span className="text-slate-700 group-hover:text-slate-900">
                      {question.q}
                    </span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredFaqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + categoryIndex * 0.1 }}
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {category.category}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {category.questions.length} questions
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.questions.map((question, qIndex) => (
                    <motion.div
                      key={question.id}
                      id={question.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: qIndex * 0.05 }}
                      className="bg-white/40 rounded-xl overflow-hidden border border-slate-200/50"
                    >
                      <button
                        onClick={() => toggleQuestion(question.id)}
                        className="w-full flex items-start gap-3 p-4 hover:bg-white/60 transition-all text-left"
                      >
                        <motion.div
                          animate={{
                            rotate: expandedQuestions.has(question.id) ? 90 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {question.q}
                          </p>
                          {question.popular && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                              <TrendingUp className="w-3 h-3" />
                              Popular
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                            expandedQuestions.has(question.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedQuestions.has(question.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-4 pb-4 pl-12 text-slate-700 leading-relaxed">
                              {question.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GlassCard variant="elevated" className="p-8">
              <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No questions found
              </h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory(null)
                }}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Clear Filters
              </button>
            </GlassCard>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <GlassCard variant="featured" className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Didn't find your answer?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our support team is here to help. Contact us via chat, email, or
              phone, and we'll get back to you within 2 hours during business hours.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/support-hub/contact"
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
              >
                Contact Support
              </a>
              <a
                href="/support-hub/training"
                className="px-6 py-3 bg-white/50 text-slate-700 rounded-lg hover:bg-white/80 transition-colors font-medium"
              >
                View Training Resources
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
