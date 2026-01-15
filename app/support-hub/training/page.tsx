"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  BookOpen,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Award,
  Target,
  ArrowRight,
  Play,
  Download,
  ExternalLink,
  Clock,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  estimatedTime: string
}

interface TrainingModule {
  id: string
  title: string
  description: string
  duration: string
  icon: React.ReactNode
  lessons: number
  status: "not-started" | "in-progress" | "completed"
  link: string
}

interface ResponseTemplate {
  id: string
  title: string
  scenario: string
  template: string
  category: string
}

export default function TrainingPage() {
  const [onboardingChecklist, setOnboardingChecklist] = useState<ChecklistItem[]>([
    {
      id: "acc",
      title: "Partner Account Setup",
      description: "Complete your partner profile and verify your business information",
      completed: true,
      estimatedTime: "10 min",
    },
    {
      id: "api",
      title: "API Credentials & Sandbox Access",
      description: "Retrieve your API keys and test the sandbox environment",
      completed: true,
      estimatedTime: "15 min",
    },
    {
      id: "prod",
      title: "Product Knowledge Training",
      description: "Complete the coverage types and pricing fundamentals course",
      completed: false,
      estimatedTime: "45 min",
    },
    {
      id: "int",
      title: "Integration Setup",
      description: "Choose and implement your integration method (widget or API)",
      completed: false,
      estimatedTime: "2-4 hours",
    },
    {
      id: "test",
      title: "Test Transaction Walkthrough",
      description: "Complete at least 3 test purchases in sandbox mode",
      completed: false,
      estimatedTime: "30 min",
    },
    {
      id: "comp",
      title: "Compliance & Legal Review",
      description: "Review insurance regulations and disclosure requirements",
      completed: false,
      estimatedTime: "20 min",
    },
    {
      id: "cert",
      title: "Partner Certification Exam",
      description: "Pass the certification exam with 80% or higher",
      completed: false,
      estimatedTime: "30 min",
    },
    {
      id: "live",
      title: "Go Live",
      description: "Switch to production credentials and process your first sale",
      completed: false,
      estimatedTime: "1 hour",
    },
  ])

  const trainingModules: TrainingModule[] = [
    {
      id: "fund",
      title: "Insurance Fundamentals",
      description: "Understanding event insurance, coverage types, and basic concepts",
      duration: "45 min",
      icon: <BookOpen className="w-6 h-6" />,
      lessons: 8,
      status: "completed",
      link: "/support-hub/products/event-insurance",
    },
    {
      id: "cov",
      title: "Coverage Deep Dive",
      description: "Detailed breakdown of liability, medical, property, and cancellation coverage",
      duration: "1 hour",
      icon: <Shield className="w-6 h-6" />,
      lessons: 12,
      status: "in-progress",
      link: "/support-hub/products/coverage-types",
    },
    {
      id: "price",
      title: "Pricing & Underwriting",
      description: "How pricing works, risk factors, and quoting best practices",
      duration: "40 min",
      icon: <TrendingUp className="w-6 h-6" />,
      lessons: 6,
      status: "in-progress",
      link: "/support-hub/products/pricing",
    },
    {
      id: "tech",
      title: "Technical Integration",
      description: "API documentation, widget implementation, and webhook setup",
      duration: "2 hours",
      icon: <Zap className="w-6 h-6" />,
      lessons: 15,
      status: "not-started",
      link: "/support-hub/integrations/api",
    },
    {
      id: "claims",
      title: "Claims Processing",
      description: "How to support customers through the claims process",
      duration: "50 min",
      icon: <FileText className="w-6 h-6" />,
      lessons: 9,
      status: "not-started",
      link: "/support-hub/products/claims",
    },
    {
      id: "comp",
      title: "Compliance & Regulations",
      description: "State requirements, disclosure rules, and legal obligations",
      duration: "35 min",
      icon: <AlertCircle className="w-6 h-6" />,
      lessons: 7,
      status: "not-started",
      link: "/support-hub/compliance/insurance-regulations",
    },
  ]

  const responseTemplates: ResponseTemplate[] = [
    {
      id: "rt1",
      title: "Coverage Inquiry",
      scenario: "Customer asks if their specific activity is covered",
      category: "Coverage",
      template: `Hi [Customer Name],

Thank you for your interest in Daily Event Insurance!

We provide coverage for [activity type] events with the following protections:
• General Liability: Up to $2M per occurrence
• Participant Accident Medical: Up to $25K per person
• Event Cancellation: Coverage available for weather/venue issues

Your specific activity falls under [risk category], and coverage is available starting at $[price estimate] for [participant count] participants.

I'd be happy to provide a detailed quote. Can you share:
1. Event date and location
2. Expected number of participants
3. Any special equipment or activities involved

Looking forward to protecting your event!

Best regards,
[Your Name]`,
    },
    {
      id: "rt2",
      title: "Pricing Question",
      scenario: "Customer thinks the price is too high",
      category: "Sales",
      template: `Hi [Customer Name],

I understand you're looking for the best value for your event protection.

Our pricing is based on several factors that directly reflect the risk:
• Event type and activity level
• Number of participants
• Coverage limits
• Location and duration

For your [event type] with [X] participants, the $[amount] premium provides:
✓ $2M general liability protection
✓ $25K medical coverage per participant
✓ Legal defense costs included
✓ Claims support with 24/7 access

Many partners find that this peace of mind is invaluable – a single injury claim without insurance could cost $15,000-$50,000 out of pocket.

Would you like me to explore options to adjust coverage limits or see if there are any applicable discounts?

Best,
[Your Name]`,
    },
    {
      id: "rt3",
      title: "Claims Support",
      scenario: "Customer needs help filing a claim",
      category: "Claims",
      template: `Hi [Customer Name],

I'm sorry to hear about the incident at your event. I'm here to help you through the claims process.

Here's what you need to do next:

**Immediate Steps:**
1. File a claim at [claims portal URL] using policy #[POLICY_NUMBER]
2. Gather incident documentation:
   - Photos of the scene/damage
   - Witness statements if available
   - Medical records (for injury claims)
   - Receipts for expenses

**What to Expect:**
• Claims are reviewed within 2-3 business days
• You'll receive status updates via email
• Average processing time is 5-7 days after approval

**Important Notes:**
- File within 30 days of the incident
- Our 24/7 claims hotline: [phone number]
- Track your claim status in the portal anytime

I've also attached a claims checklist to ensure you have everything needed. Please don't hesitate to reach out if you have questions during the process.

We're here to support you,
[Your Name]`,
    },
    {
      id: "rt4",
      title: "Technical Integration Help",
      scenario: "Partner having trouble with API integration",
      category: "Technical",
      template: `Hi [Partner Name],

I'd be happy to help troubleshoot your integration issue.

**Quick Diagnostics:**
1. Are you using sandbox or production credentials?
2. What HTTP status code are you receiving?
3. Can you share the request payload (remove sensitive data)?

**Common Solutions:**
• **401 Unauthorized**: Check that you're using the correct API key in the Authorization header: "Bearer YOUR_API_KEY"
• **400 Bad Request**: Verify all required fields are included (event_name, date, location, participant_count, activity_type)
• **Rate Limit**: Standard limit is 100 req/min – contact us if you need higher limits

**Resources:**
📘 API Documentation: [docs URL]
🛠️ Sandbox Testing: [sandbox URL]
💬 Technical Support: [support email]

I'm also available for a screen share session if you'd prefer live assistance. Let me know what works best for you.

Best regards,
[Your Name]
Technical Support`,
    },
    {
      id: "rt5",
      title: "Refund Request",
      scenario: "Customer wants to cancel and get a refund",
      category: "Payments",
      template: `Hi [Customer Name],

I can certainly help you with your refund request for policy #[POLICY_NUMBER].

**Refund Policy:**
• Full refund: 30+ days before event date
• 90% refund: 8-29 days before event (10% processing fee)
• No refund: Within 7 days of event or after event date

Your event is scheduled for [DATE], which is [X] days away.

**You're eligible for: [REFUND TYPE]**

To process your refund:
1. Confirm you'd like to proceed with cancellation
2. Refunds are processed within 5-7 business days
3. Funds return to the original payment method

**Before You Cancel:**
Is there anything we can help with? Many customers have concerns we can address:
- Need to change the event date? We can update the policy
- Worried about pricing? Let's review your coverage options
- Technical issues? Our support team can assist

Please let me know how you'd like to proceed.

Best regards,
[Your Name]`,
    },
    {
      id: "rt6",
      title: "Enterprise Inquiry",
      scenario: "Large organization inquiring about partnership",
      category: "Sales",
      template: `Hi [Contact Name],

Thank you for your interest in partnering with Daily Event Insurance!

For organizations like [Company Name] with [X] locations/events, we offer **Enterprise Partnership** benefits:

**What's Included:**
✓ Custom commission structure (up to 35%)
✓ White-label branding with your logo
✓ Multi-location centralized management
✓ Dedicated account manager
✓ Priority support with 2-hour response SLA
✓ Custom API rate limits
✓ SSO integration (SAML/OAuth)
✓ Quarterly business reviews

**Next Steps:**
1. Discovery call to understand your needs (30 min)
2. Custom pricing and solution proposal
3. Technical integration planning
4. Onboarding and training for your team

I'd love to schedule a call this week. Does [day/time] or [day/time] work for your calendar?

In the meantime, here are some resources:
📊 Enterprise One-Pager: [attachment]
📹 Platform Demo Video: [link]
💼 Case Study: [similar company]

Looking forward to partnering with you!

Best regards,
[Your Name]
Enterprise Partnerships`,
    },
  ]

  const escalationProcedures = [
    {
      title: "Technical Issues",
      icon: <AlertCircle className="w-5 h-5" />,
      steps: [
        "Verify issue in sandbox environment",
        "Check API status page for known issues",
        "Review error codes in documentation",
        "If unresolved after 30 min, escalate to Technical Support",
      ],
      contact: "tech-support@dailyevent.com",
    },
    {
      title: "Claims Disputes",
      icon: <FileText className="w-5 h-5" />,
      steps: [
        "Review claim decision with customer",
        "Verify all required documentation was submitted",
        "Explain appeal process if applicable",
        "Escalate to Claims Manager for complex disputes",
      ],
      contact: "claims@dailyevent.com",
    },
    {
      title: "Billing & Payment Issues",
      icon: <TrendingUp className="w-5 h-5" />,
      steps: [
        "Verify transaction details in partner dashboard",
        "Check for payment processing errors",
        "Confirm commission calculations",
        "Escalate to Finance team for discrepancies",
      ],
      contact: "billing@dailyevent.com",
    },
    {
      title: "Legal & Compliance Questions",
      icon: <Shield className="w-5 h-5" />,
      steps: [
        "Review compliance documentation",
        "Check state-specific regulations if applicable",
        "Do NOT provide legal advice",
        "Immediately escalate to Legal team",
      ],
      contact: "legal@dailyevent.com",
    },
  ]

  const qaGuidelines = [
    {
      title: "Response Time Standards",
      description: "Respond to customer inquiries within these timeframes",
      metrics: [
        { label: "Critical (claims, technical outage)", target: "< 1 hour" },
        { label: "High (pre-purchase questions, billing)", target: "< 2 hours" },
        { label: "Medium (general questions)", target: "< 4 hours" },
        { label: "Low (documentation requests)", target: "< 24 hours" },
      ],
    },
    {
      title: "Communication Quality",
      description: "Maintain these standards in all customer interactions",
      metrics: [
        { label: "Professional tone", target: "100%" },
        { label: "Grammar and spelling accuracy", target: "> 98%" },
        { label: "Include relevant links/resources", target: "Always" },
        { label: "Personalize with customer name", target: "Always" },
      ],
    },
    {
      title: "Resolution Metrics",
      description: "Strive to resolve issues effectively",
      metrics: [
        { label: "First contact resolution", target: "> 75%" },
        { label: "Customer satisfaction score", target: "> 4.5/5" },
        { label: "Follow-up within 24h if unresolved", target: "100%" },
        { label: "Escalation when needed", target: "< 10%" },
      ],
    },
  ]

  const toggleChecklistItem = (id: string) => {
    setOnboardingChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const completedCount = onboardingChecklist.filter((item) => item.completed).length
  const progressPercentage = (completedCount / onboardingChecklist.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Breadcrumbs items={[{ label: "Training" }]} />

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Support Agent Training Portal
                </h1>
                <p className="text-slate-600 mt-1">
                  Master Daily Event Insurance in 8 comprehensive modules
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Onboarding Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard variant="featured" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  Onboarding Checklist
                </h2>
                <p className="text-slate-600">
                  {completedCount} of {onboardingChecklist.length} completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-teal-600">
                  {Math.round(progressPercentage)}%
                </div>
                <p className="text-sm text-slate-600">Progress</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
              />
            </div>

            {/* Checklist Items */}
            <div className="grid md:grid-cols-2 gap-4">
              {onboardingChecklist.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="flex items-start gap-3 p-4 bg-white/50 hover:bg-white/80 rounded-xl transition-all text-left group"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 flex-shrink-0 mt-0.5 group-hover:text-teal-400 transition-colors" />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`font-semibold mb-1 ${
                        item.completed ? "text-slate-500 line-through" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {item.estimatedTime}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Training Modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-6 h-6 text-teal-600" />
                  <h2 className="text-2xl font-bold text-slate-900">
                    Training Modules
                  </h2>
                </div>

                <div className="space-y-4">
                  {trainingModules.map((module, index) => (
                    <motion.a
                      key={module.id}
                      href={module.link}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white/50 hover:bg-white/80 rounded-xl transition-all group"
                    >
                      <div className="p-3 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg text-white flex-shrink-0">
                        {module.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
                              {module.title}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              {module.description}
                            </p>
                          </div>
                          {module.status === "completed" && (
                            <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {module.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Play className="w-4 h-4" />
                            {module.lessons} lessons
                          </div>
                          {module.status === "in-progress" && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </motion.a>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Response Templates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-6 h-6 text-teal-600" />
                  <h2 className="text-2xl font-bold text-slate-900">
                    Response Templates
                  </h2>
                </div>

                <div className="space-y-4">
                  {responseTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/50 rounded-xl overflow-hidden border border-slate-200/50"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {template.title}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              {template.scenario}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                            {template.category}
                          </span>
                        </div>
                        <details className="mt-4">
                          <summary className="cursor-pointer text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                            View Template
                            <ArrowRight className="w-4 h-4" />
                          </summary>
                          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                              {template.template}
                            </pre>
                            <button className="mt-3 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Copy Template
                            </button>
                          </div>
                        </details>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* QA Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-6 h-6 text-teal-600" />
                  <h2 className="text-2xl font-bold text-slate-900">
                    Quality Assurance Guidelines
                  </h2>
                </div>

                <div className="space-y-6">
                  {qaGuidelines.map((guideline, index) => (
                    <div key={index} className="bg-white/50 rounded-xl p-4">
                      <h3 className="font-semibold text-slate-900 mb-2">
                        {guideline.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        {guideline.description}
                      </p>
                      <div className="space-y-2">
                        {guideline.metrics.map((metric, mIndex) => (
                          <div
                            key={mIndex}
                            className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0"
                          >
                            <span className="text-sm text-slate-700">
                              {metric.label}
                            </span>
                            <span className="text-sm font-semibold text-teal-600">
                              {metric.target}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-8">
            {/* Knowledge Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-6 h-6 text-teal-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Certification
                  </h2>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Complete all training modules to unlock the certification exam.
                  Passing score: 80%
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Modules Completed</span>
                    <span className="font-semibold text-slate-900">1/6</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/6 bg-gradient-to-r from-teal-500 to-blue-500" />
                  </div>
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-slate-300 text-slate-500 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Take Certification Exam
                  </button>
                  <p className="text-xs text-slate-500 text-center">
                    Complete 5 more modules to unlock
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Escalation Procedures */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Escalation Procedures
                  </h2>
                </div>

                <div className="space-y-4">
                  {escalationProcedures.map((procedure, index) => (
                    <details
                      key={index}
                      className="bg-white/50 rounded-lg overflow-hidden"
                    >
                      <summary className="cursor-pointer p-3 hover:bg-white/80 transition-all flex items-center gap-2">
                        {procedure.icon}
                        <span className="font-medium text-slate-900 text-sm">
                          {procedure.title}
                        </span>
                      </summary>
                      <div className="p-3 pt-0">
                        <ol className="space-y-2 mb-3">
                          {procedure.steps.map((step, sIndex) => (
                            <li
                              key={sIndex}
                              className="text-xs text-slate-600 flex items-start gap-2"
                            >
                              <span className="flex-shrink-0 w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-[10px] font-medium">
                                {sIndex + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <a
                          href={`mailto:${procedure.contact}`}
                          className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {procedure.contact}
                        </a>
                      </div>
                    </details>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <GlassCard variant="elevated" className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Quick Links
                </h2>
                <div className="space-y-2">
                  <a
                    href="/support-hub/faq"
                    className="flex items-center justify-between p-3 bg-white/50 hover:bg-white/80 rounded-lg transition-all group"
                  >
                    <span className="text-sm text-slate-700">FAQ</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </a>
                  <a
                    href="/support-hub/products"
                    className="flex items-center justify-between p-3 bg-white/50 hover:bg-white/80 rounded-lg transition-all group"
                  >
                    <span className="text-sm text-slate-700">Product Docs</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </a>
                  <a
                    href="/support-hub/integrations"
                    className="flex items-center justify-between p-3 bg-white/50 hover:bg-white/80 rounded-lg transition-all group"
                  >
                    <span className="text-sm text-slate-700">API Docs</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </a>
                  <a
                    href="/support-hub/troubleshooting"
                    className="flex items-center justify-between p-3 bg-white/50 hover:bg-white/80 rounded-lg transition-all group"
                  >
                    <span className="text-sm text-slate-700">
                      Troubleshooting
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
