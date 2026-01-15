"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { CodeBlock } from "@/components/support-hub/CodeBlock"
import {
  Layers,
  Palette,
  Code,
  Smartphone,
  Zap,
  CheckCircle2,
  AlertCircle,
  Settings
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Easy Installation",
    description: "Add insurance quotes to your website with just a few lines of code"
  },
  {
    icon: Palette,
    title: "Customizable Design",
    description: "Match your brand with custom colors, fonts, and styling options"
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Looks perfect on all devices from phones to desktop monitors"
  },
  {
    icon: Code,
    title: "Framework Support",
    description: "Works with React, Vue, Angular, and vanilla JavaScript"
  },
  {
    icon: Settings,
    title: "Pre-fill Data",
    description: "Automatically populate fields with customer information"
  },
  {
    icon: CheckCircle2,
    title: "Conversion Optimized",
    description: "Designed for maximum conversion with A/B tested layouts"
  }
]

const vanillaExample = `<!-- Add to your HTML page -->
<!DOCTYPE html>
<html>
<head>
  <title>Event Booking with Insurance</title>

  <!-- Daily Event Insurance Widget CSS -->
  <link rel="stylesheet" href="https://cdn.dailyeventinsurance.com/widget/v1/dei-widget.css">
</head>
<body>
  <!-- Insurance Widget Container -->
  <div id="dei-insurance-widget"></div>

  <!-- Daily Event Insurance Widget JS -->
  <script src="https://cdn.dailyeventinsurance.com/widget/v1/dei-widget.js"></script>

  <script>
    // Initialize the widget
    DailyEventInsurance.init({
      apiKey: 'YOUR_PUBLIC_API_KEY',
      container: '#dei-insurance-widget',
      theme: {
        primaryColor: '#14b8a6',
        borderRadius: '12px',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      prefill: {
        eventType: 'wedding',
        guests: 150
      },
      onQuoteGenerated: function(quote) {
        console.log('Quote generated:', quote)
      },
      onPolicyPurchased: function(policy) {
        console.log('Policy purchased:', policy)
        // Redirect or show confirmation
      }
    })
  </script>
</body>
</html>`

const reactExample = `// React Component Integration
import { useEffect, useRef } from 'react'

export function InsuranceWidget({ eventData, onPolicyPurchased }) {
  const widgetRef = useRef(null)

  useEffect(() => {
    // Load widget script
    const script = document.createElement('script')
    script.src = 'https://cdn.dailyeventinsurance.com/widget/v1/dei-widget.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.DailyEventInsurance && widgetRef.current) {
        window.DailyEventInsurance.init({
          apiKey: process.env.NEXT_PUBLIC_DEI_API_KEY,
          container: widgetRef.current,
          theme: {
            primaryColor: '#14b8a6',
            borderRadius: '12px'
          },
          prefill: {
            eventType: eventData.type,
            eventDate: eventData.date,
            guests: eventData.guests,
            venue: eventData.venue
          },
          onPolicyPurchased: (policy) => {
            onPolicyPurchased(policy)
          }
        })
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [eventData, onPolicyPurchased])

  return (
    <div
      ref={widgetRef}
      className="insurance-widget-container"
    />
  )
}

// Usage in your app
function EventBookingPage() {
  const [eventData, setEventData] = useState({
    type: 'wedding',
    date: '2026-08-15',
    guests: 150,
    venue: 'Grand Ballroom'
  })

  const handlePolicyPurchased = (policy) => {
    console.log('Insurance purchased:', policy)
    // Update your booking with insurance info
  }

  return (
    <div>
      <h1>Book Your Event</h1>
      {/* Your event booking form */}

      <h2>Add Insurance Protection</h2>
      <InsuranceWidget
        eventData={eventData}
        onPolicyPurchased={handlePolicyPurchased}
      />
    </div>
  )
}`

const customizationExample = `// Advanced Customization Options
DailyEventInsurance.init({
  apiKey: 'YOUR_PUBLIC_API_KEY',
  container: '#dei-insurance-widget',

  // Theme customization
  theme: {
    primaryColor: '#14b8a6',
    secondaryColor: '#0ea5e9',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    borderRadius: '12px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '16px'
  },

  // Layout options
  layout: 'vertical', // 'vertical' | 'horizontal' | 'compact'
  showLogo: true,
  showPoweredBy: true,

  // Coverage options
  coverageOptions: {
    showGeneralLiability: true,
    showPropertyDamage: true,
    showLiquorLiability: true,
    showCancellation: true,
    allowCustomAmounts: false
  },

  // Pre-fill customer data
  prefill: {
    eventType: 'wedding',
    eventDate: '2026-08-15',
    eventTime: '18:00',
    duration: 6,
    guests: 150,
    venue: {
      name: 'Grand Ballroom',
      address: '123 Main St, City, ST 12345'
    },
    contact: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-0123'
    }
  },

  // Callbacks
  onLoad: function() {
    console.log('Widget loaded')
  },
  onQuoteGenerated: function(quote) {
    console.log('Quote:', quote)
    // Track in analytics
    gtag('event', 'insurance_quote', {
      quote_id: quote.id,
      premium: quote.premium
    })
  },
  onPolicyPurchased: function(policy) {
    console.log('Policy:', policy)
    // Track conversion
    gtag('event', 'purchase', {
      transaction_id: policy.id,
      value: policy.premium,
      currency: 'USD'
    })
  },
  onError: function(error) {
    console.error('Widget error:', error)
  }
})`

const vueExample = `<!-- Vue.js Component Integration -->
<template>
  <div>
    <h2>Add Insurance Protection</h2>
    <div ref="widgetContainer" class="insurance-widget"></div>
  </div>
</template>

<script>
export default {
  name: 'InsuranceWidget',
  props: {
    eventData: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.loadWidget()
  },
  methods: {
    loadWidget() {
      const script = document.createElement('script')
      script.src = 'https://cdn.dailyeventinsurance.com/widget/v1/dei-widget.js'
      script.async = true

      script.onload = () => {
        window.DailyEventInsurance.init({
          apiKey: process.env.VUE_APP_DEI_API_KEY,
          container: this.$refs.widgetContainer,
          theme: {
            primaryColor: '#14b8a6'
          },
          prefill: {
            eventType: this.eventData.type,
            eventDate: this.eventData.date,
            guests: this.eventData.guests
          },
          onPolicyPurchased: (policy) => {
            this.$emit('policy-purchased', policy)
          }
        })
      }

      document.body.appendChild(script)
    }
  }
}
</script>`

export default function WidgetIntegrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs
            items={[
              { label: "Integrations", href: "/support-hub/integrations" },
              { label: "Website Widget" }
            ]}
          />

          <div className="mt-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 text-white">
                <Layers className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  Website Widget
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  Installation time: 5 minutes • Zero backend required
                </p>
              </div>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl">
              Embed insurance quotes directly on your website with our JavaScript widget
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Widget Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
              <GlassCard key={feature.title} className="p-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-100 to-sky-100 w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Vanilla JS Installation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Basic Installation (Vanilla JavaScript)
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Quick Start
              </h3>
              <p className="text-slate-600">
                Add the widget to any HTML page with these simple steps:
              </p>
            </div>

            <CodeBlock
              language="html"
              filename="index.html"
              code={vanillaExample}
            />

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <strong>Get your API key:</strong> Log in to your dashboard at Settings → API Keys → Create Public Key
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* React Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            React / Next.js Integration
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                React Component
              </h3>
              <p className="text-slate-600">
                Use the widget as a React component with hooks and state management:
              </p>
            </div>

            <CodeBlock
              language="javascript"
              filename="InsuranceWidget.jsx"
              code={reactExample}
            />
          </GlassCard>
        </motion.div>

        {/* Vue Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Vue.js Integration
          </h2>

          <GlassCard variant="elevated" className="p-8 mb-12">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Vue Component
              </h3>
              <p className="text-slate-600">
                Integrate the widget into your Vue.js application:
              </p>
            </div>

            <CodeBlock
              language="javascript"
              filename="InsuranceWidget.vue"
              code={vueExample}
            />
          </GlassCard>
        </motion.div>

        {/* Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Advanced Customization
          </h2>

          <GlassCard variant="featured" className="p-8 mb-12">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Full Configuration Options
              </h3>
              <p className="text-slate-600">
                Customize every aspect of the widget to match your brand and workflow:
              </p>
            </div>

            <CodeBlock
              language="javascript"
              filename="advanced-config.js"
              code={customizationExample}
            />
          </GlassCard>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GlassCard variant="elevated" className="p-8 mb-12">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Important Notes
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Use your <strong>public API key</strong> for widget integration (not your secret key)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>The widget handles all payment processing securely via PCI-compliant iframe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Test in sandbox mode first before deploying to production</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Widget automatically adapts to mobile, tablet, and desktop screen sizes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Callbacks fire in real-time - perfect for analytics and conversion tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <GlassCard variant="elevated" className="p-8 text-center">
            <Code className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Need Help with Installation?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our team can help you customize and install the widget on your site
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-white/80 text-slate-900 rounded-xl font-medium border border-slate-200 hover:border-teal-300 transition-colors">
                View Demo
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
