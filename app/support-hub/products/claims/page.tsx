"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { StepByStep } from "@/components/support-hub/StepByStep"
import {
  FileText,
  Shield,
  CheckCircle,
  Clock,
  Camera,
  Upload,
  Mail,
  Phone,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  ArrowRight,
  Zap,
  MessageSquare
} from "lucide-react"

const claimsSteps = [
  {
    title: "Report Incident",
    description: "File claim through member portal within 30 days of incident. Provide basic details: what happened, when, where, and type of coverage. Include incident photos if available.",
    icon: FileText
  },
  {
    title: "Submit Documentation",
    description: "Upload required documents: medical bills, receipts, police reports, or damage photos. Clear, complete documentation speeds up processing significantly.",
    icon: Upload
  },
  {
    title: "Claim Review",
    description: "Our claims team reviews submission within 24-48 hours. May request additional documentation if needed. You'll receive updates via email and SMS at each stage.",
    icon: Clock
  },
  {
    title: "Approval & Payment",
    description: "Once approved, payment processed within 3-5 business days. Funds sent directly to member's original payment method or via check for larger amounts.",
    icon: DollarSign
  }
]

const requiredDocuments = [
  {
    coverageType: "Event Insurance",
    icon: Shield,
    color: "teal",
    documents: [
      { name: "Incident report", required: true },
      { name: "Medical bills/receipts", required: true },
      { name: "Doctor's notes", required: true },
      { name: "Prescription receipts", required: false },
      { name: "Photos of injury", required: false },
      { name: "Witness statements", required: false }
    ]
  },
  {
    coverageType: "Liability Claims",
    icon: AlertTriangle,
    color: "orange",
    documents: [
      { name: "Incident report", required: true },
      { name: "Photos of damage/injury", required: true },
      { name: "Third-party claim letter", required: true },
      { name: "Police report", required: false },
      { name: "Witness statements", required: true },
      { name: "Repair estimates", required: false }
    ]
  },
  {
    coverageType: "Property Coverage",
    icon: Camera,
    color: "blue",
    documents: [
      { name: "Damage photos", required: true },
      { name: "Rental agreement", required: true },
      { name: "Repair estimates", required: true },
      { name: "Police report (if theft)", required: true },
      { name: "Purchase receipts", required: false },
      { name: "Incident description", required: true }
    ]
  },
  {
    coverageType: "Cancellation Claims",
    icon: Calendar,
    color: "purple",
    documents: [
      { name: "Cancellation request", required: true },
      { name: "Proof of covered reason", required: true },
      { name: "Medical note (if illness)", required: true },
      { name: "Weather alert (if weather)", required: true },
      { name: "Booking confirmation", required: true },
      { name: "Flight cancellation (if travel)", required: false }
    ]
  }
]

const processingTimes = [
  {
    type: "Standard Processing",
    time: "3-5 days",
    description: "Most claims with complete documentation",
    icon: Clock
  },
  {
    type: "Priority Processing",
    time: "24-48 hours",
    description: "Premium coverage holders and urgent cases",
    icon: Zap
  },
  {
    type: "Same-Day Processing",
    time: "< 24 hours",
    description: "Emergency situations and high-value claims",
    icon: TrendingUp
  }
]

const claimsStats = [
  { metric: "95%", label: "Approval Rate", color: "green" },
  { metric: "2.8 days", label: "Avg Processing Time", color: "blue" },
  { metric: "4.9/5", label: "Member Satisfaction", color: "purple" },
  { metric: "24/7", label: "Claims Support", color: "orange" }
]

const commonIssues = [
  {
    issue: "Missing Documentation",
    solution: "Most common reason for delays. Submit all required documents upfront.",
    impact: "Delays claim by 3-7 days"
  },
  {
    issue: "Late Filing",
    solution: "File within 30 days of incident. Late claims may be denied.",
    impact: "May result in denial"
  },
  {
    issue: "Unclear Photos",
    solution: "Take clear, well-lit photos from multiple angles.",
    impact: "Requires resubmission"
  },
  {
    issue: "Incomplete Forms",
    solution: "Fill out all required fields. Use N/A for non-applicable items.",
    impact: "Delays review process"
  },
  {
    issue: "No Medical Documentation",
    solution: "Always get medical care documented, even for minor injuries.",
    impact: "Cannot verify claim"
  },
  {
    issue: "Wrong Coverage Type",
    solution: "Verify which coverage applies to your claim before filing.",
    impact: "Claim may be denied"
  }
]

const claimsTips = [
  "Report incidents immediately - don't wait until the 30-day deadline",
  "Take photos of everything - injuries, damage, scene, and documents",
  "Keep all receipts and bills organized in one place",
  "Get witness contact information and statements if possible",
  "Follow up with doctors and get detailed medical notes",
  "Communicate promptly when claims team requests additional info",
  "Use the mobile app for fastest claims submission",
  "Save copies of all submitted documents for your records"
]

export default function ClaimsPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/support-hub/products" },
          { label: "Claims Process" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 font-semibold text-sm mb-6">
          <FileText className="w-4 h-4" />
          Claims Guide
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          How to File a Claim
          <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fast & Simple Process
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Step-by-step guide to filing insurance claims. Fast processing, high approval rates,
          and dedicated support every step of the way.
        </p>
      </motion.div>

      {/* Claims Stats */}
      <section>
        <div className="grid md:grid-cols-4 gap-6">
          {claimsStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="p-6 text-center">
                  <div className={`text-4xl font-bold mb-2 bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-500 bg-clip-text text-transparent`}>
                    {stat.metric}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Claims Process */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            The Claims Process
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From incident to payment in 4 simple steps
          </p>
        </motion.div>

        <StepByStep steps={claimsSteps} />
      </section>

      {/* Required Documents */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Required Documentation
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            What you need to submit for each coverage type
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {requiredDocuments.map((coverage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${coverage.color}-500 to-${coverage.color}-600 flex items-center justify-center`}>
                      <coverage.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {coverage.coverageType}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {coverage.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {doc.required ? (
                          <CheckCircle className={`w-5 h-5 text-${coverage.color}-600 flex-shrink-0 mt-0.5`} />
                        ) : (
                          <div className="w-5 h-5 flex-shrink-0 mt-0.5 rounded border-2 border-slate-300" />
                        )}
                        <div>
                          <span className="text-slate-700">{doc.name}</span>
                          {doc.required && (
                            <span className="ml-2 text-xs text-red-600 font-semibold">*Required</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Processing Times */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Processing Timelines
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                How quickly you can expect claim resolution
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {processingTimes.map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/50 rounded-xl border border-white/40 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <process.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {process.type}
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-3">
                    {process.time}
                  </div>
                  <p className="text-sm text-slate-600">
                    {process.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Common Issues */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <AlertCircle className="w-8 h-8 text-orange-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                Common Issues & Solutions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {commonIssues.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-orange-50/50 rounded-xl border border-orange-100"
                >
                  <h3 className="font-bold text-slate-900 mb-2">{item.issue}</h3>
                  <p className="text-sm text-slate-700 mb-2">{item.solution}</p>
                  <div className="text-xs text-orange-700 font-semibold">
                    Impact: {item.impact}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Claims Tips */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                Tips for Faster Claims Processing
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {claimsTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-white/50 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{tip}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Support Channels */}
      <section>
        <GlassCard>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Need Help with Your Claim?
              </h2>
              <p className="text-lg text-slate-600">
                Our claims support team is here to assist you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 bg-white/50 rounded-xl border border-white/40 text-center"
              >
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Phone Support
                </h3>
                <p className="text-slate-600 mb-4">
                  Speak with a claims specialist
                </p>
                <a
                  href="tel:1-800-CLAIMS"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                >
                  1-800-CLAIMS
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 bg-white/50 rounded-xl border border-white/40 text-center"
              >
                <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Email Support
                </h3>
                <p className="text-slate-600 mb-4">
                  Response within 24 hours
                </p>
                <a
                  href="mailto:claims@dailyevent.com"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                >
                  claims@dailyevent.com
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 bg-white/50 rounded-xl border border-white/40 text-center"
              >
                <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Live Chat
                </h3>
                <p className="text-slate-600 mb-4">
                  Instant assistance available
                </p>
                <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
                  Start Chat
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* CTA Section */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to File a Claim?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Start your claim online in minutes
            </p>

            <Link href="/support-hub/integrations">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                File Claim Now
              </motion.button>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
