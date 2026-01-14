'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Zap,
  MessageCircle,
  QrCode,
  BarChart3,
  Bell,
  FileText,
  CreditCard,
  Mail,
  Smartphone,
  Monitor,
  Check,
  ArrowRight,
  Waves,
  ChevronRight,
  Play,
  Sparkles
} from 'lucide-react'

const automationFeatures = [
  {
    icon: QrCode,
    title: 'QR Code Integration',
    description: 'Auto-generated QR codes for flyers, signage, and marketing materials. Tracks scans and conversions.',
    color: 'from-violet-500 to-purple-600'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat Widget',
    description: 'Embedded support chat with smart routing. Customers get instant help without leaving the page.',
    color: 'from-sky-500 to-cyan-600'
  },
  {
    icon: Smartphone,
    title: 'SMS Notifications',
    description: 'Automated text messages for policy confirmations, reminders, and claim updates.',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: Mail,
    title: 'Email Automation',
    description: 'Branded emails for quotes, confirmations, renewals, and marketing campaigns.',
    color: 'from-orange-500 to-amber-600'
  },
  {
    icon: CreditCard,
    title: 'Instant Checkout',
    description: 'One-click purchasing with saved payment methods. No forms, no friction.',
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: FileText,
    title: 'Auto Policy Generation',
    description: 'Policies generated instantly upon purchase. PDF certificates delivered in seconds.',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Dashboard tracks views, quotes, conversions, and revenue. All in real-time.',
    color: 'from-teal-500 to-emerald-600'
  },
  {
    icon: Bell,
    title: 'Webhook Notifications',
    description: 'Instant notifications to your systems when policies are purchased or claims filed.',
    color: 'from-red-500 to-orange-600'
  }
]

export default function OceanPacificGymDemo() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/logo-color.png" alt="Daily Event Insurance" className="h-8" />
              <span className="text-slate-500">|</span>
              <span className="text-white font-medium">Microsite Demo</span>
            </div>
            <a
              href="/about/hiqor/presentation"
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium text-sm hover:bg-teal-600 transition-colors"
            >
              Back to Presentation
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Example Partner Microsite
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ocean Pacific Gym
            <span className="block text-teal-400">Automated Insurance Portal</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            See how a fully automated, white-label microsite works for partners.
            Every feature below is built-in and ready to go.
          </p>
        </motion.div>
      </section>

      {/* Microsite Preview with Annotations */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left: Feature List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-400" />
                Automation Features
              </h3>
              {automationFeatures.map((feature, index) => (
                <motion.button
                  key={feature.title}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activeFeature === index
                      ? 'bg-slate-800 border-teal-500'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{feature.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Center: Microsite Preview */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 bg-slate-700 rounded-lg px-4 py-1.5 text-sm text-slate-400">
                    insurance.oceanpacificgym.com
                  </div>
                </div>

                {/* Microsite Content */}
                <div className="bg-gradient-to-br from-sky-50 to-cyan-50 p-6">
                  {/* Microsite Header */}
                  <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <Waves className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Ocean Pacific Gym</h4>
                        <p className="text-xs text-sky-600">Event Insurance</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="flex items-center gap-2 px-3 py-2 bg-sky-500 text-white rounded-lg text-xs font-medium">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Chat
                      </button>
                      {activeFeature === 1 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center"
                        >
                          <Zap className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Hero Banner */}
                  <div className="bg-gradient-to-r from-sky-600 to-cyan-600 rounded-xl p-6 mb-4 text-white">
                    <h3 className="font-bold text-lg mb-1">Protect Your Fitness Events</h3>
                    <p className="text-sky-100 text-sm mb-4">Coverage starting at just $15</p>
                    <button className="px-4 py-2 bg-white text-sky-600 rounded-lg text-sm font-semibold flex items-center gap-2">
                      Get Instant Quote
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="relative bg-white rounded-xl p-4 text-center shadow-sm">
                      <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-5 h-5 text-sky-600" />
                      </div>
                      <p className="text-xs font-medium text-slate-700">Get Quote</p>
                      {activeFeature === 5 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center"
                        >
                          <Zap className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                    </div>
                    <div className="relative bg-white rounded-xl p-4 text-center shadow-sm">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <QrCode className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-xs font-medium text-slate-700">Scan QR</p>
                      {activeFeature === 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center"
                        >
                          <Zap className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                    </div>
                    <div className="relative bg-white rounded-xl p-4 text-center shadow-sm">
                      <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <CreditCard className="w-5 h-5 text-violet-600" />
                      </div>
                      <p className="text-xs font-medium text-slate-700">Buy Now</p>
                      {activeFeature === 4 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center"
                        >
                          <Zap className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Coverage Options */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="font-semibold text-slate-900 text-sm mb-3">Select Coverage</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'Basic', price: '$15', coverage: '$500K' },
                        { name: 'Standard', price: '$35', coverage: '$1M', popular: true },
                        { name: 'Premium', price: '$65', coverage: '$2M' }
                      ].map((plan) => (
                        <div
                          key={plan.name}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            plan.popular ? 'border-sky-500 bg-sky-50' : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border-2 ${plan.popular ? 'border-sky-500 bg-sky-500' : 'border-slate-300'}`}>
                              {plan.popular && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{plan.name}</span>
                            {plan.popular && <span className="text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full">Popular</span>}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-sky-600">{plan.price}</span>
                            <span className="text-xs text-slate-500 block">{plan.coverage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">
                      Powered by <span className="text-sky-600 font-medium">Daily Event Insurance</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Feature Detail */}
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-slate-900 rounded-xl border border-slate-800"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${automationFeatures[activeFeature].color} flex items-center justify-center flex-shrink-0`}>
                    {(() => {
                      const Icon = automationFeatures[activeFeature].icon
                      return <Icon className="w-7 h-7 text-white" />
                    })()}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{automationFeatures[activeFeature].title}</h4>
                    <p className="text-slate-400">{automationFeatures[activeFeature].description}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs font-medium">
                        <Check className="w-3 h-3" />
                        Fully Automated
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs font-medium">
                        <Zap className="w-3 h-3" />
                        No Code Required
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            Every Microsite Includes
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Monitor, label: 'Custom Branding', desc: 'Your logo, colors, domain' },
              { icon: Smartphone, label: 'Mobile Optimized', desc: 'Works on all devices' },
              { icon: BarChart3, label: 'Analytics Dashboard', desc: 'Real-time metrics' },
              { icon: Shield, label: 'SSL Security', desc: 'Bank-level encryption' }
            ].map((item) => (
              <div key={item.label} className="text-center p-6 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h4 className="font-semibold text-white mb-1">{item.label}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Launch Your Microsite?
            </h2>
            <p className="text-teal-100 mb-8">
              We'll have your branded insurance portal live within days.
              $600/month includes everything shown above.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/about/hiqor/presentation"
                className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                View Full Presentation
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/about/hiqor/proposal"
                className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-400 transition-colors"
              >
                See All Documents
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            <strong className="text-slate-400">Daily Event Insurance</strong> &middot; Events-Based InsurTech Platform
          </p>
        </div>
      </footer>
    </div>
  )
}
