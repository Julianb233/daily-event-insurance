"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/support-hub/GlassCard"
import { Breadcrumbs } from "@/components/support-hub/Breadcrumbs"
import { StepByStep } from "@/components/support-hub/StepByStep"
import {
  Puzzle,
  Key,
  Webhook,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Code,
  Settings,
  RefreshCw,
  ArrowRight
} from "lucide-react"

const commonIssues = [
  {
    issue: "API Key Not Working",
    symptoms: [
      "401 Unauthorized errors",
      "Authentication failed messages",
      "Invalid API key responses"
    ],
    solutions: [
      "Verify you're using the correct API key for your environment (test vs. production)",
      "Check that the API key is active in your dashboard",
      "Ensure the key is being sent in the Authorization header as 'Bearer YOUR_KEY'",
      "Generate a new API key if the current one may be compromised"
    ],
    code: `// Correct API key usage
const response = await fetch('https://api.dailyevent.com/v1/policies', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});`
  },
  {
    issue: "CORS Errors",
    symptoms: [
      "Access-Control-Allow-Origin errors",
      "Blocked by CORS policy messages",
      "Preflight request failures"
    ],
    solutions: [
      "Add your domain to the allowed origins in your dashboard settings",
      "Ensure requests include proper CORS headers",
      "Use server-side API calls for sensitive operations",
      "For widget integration, verify the domain whitelist"
    ],
    code: `// Backend proxy to avoid CORS (recommended)
app.post('/api/insurance', async (req, res) => {
  const response = await fetch('https://api.dailyevent.com/v1/policies', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.DAILY_EVENT_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
});`
  },
  {
    issue: "Webhook Not Receiving Events",
    symptoms: [
      "No webhook deliveries in logs",
      "Events not triggering callbacks",
      "Webhook endpoint not being called"
    ],
    solutions: [
      "Verify webhook URL is publicly accessible (not localhost)",
      "Check that your endpoint accepts POST requests",
      "Ensure SSL certificate is valid",
      "Review webhook logs in your dashboard for delivery attempts",
      "Verify webhook signature validation is correct"
    ],
    code: `// Webhook endpoint example
app.post('/webhooks/insurance', (req, res) => {
  const signature = req.headers['x-dailyevent-signature'];

  // Verify webhook signature
  const isValid = verifySignature(req.body, signature, WEBHOOK_SECRET);

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;

  // Process event
  switch (event.type) {
    case 'policy.created':
      // Handle policy creation
      break;
    case 'claim.submitted':
      // Handle claim submission
      break;
  }

  res.status(200).send('OK');
});`
  },
  {
    issue: "Rate Limiting",
    symptoms: [
      "429 Too Many Requests errors",
      "Rate limit exceeded messages",
      "Temporary blocks on API calls"
    ],
    solutions: [
      "Implement exponential backoff retry logic",
      "Cache responses where appropriate",
      "Batch API calls when possible",
      "Monitor your rate limit usage in the dashboard",
      "Contact support for higher rate limits if needed"
    ],
    code: `// Rate limit handling with exponential backoff
async function callApiWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || (Math.pow(2, i) * 1000);
        await new Promise(resolve => setTimeout(resolve, retryAfter));
        continue;
      }

      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}`
  }
]

const setupSteps = [
  {
    title: "Generate API Keys",
    description: "Log into your dashboard and navigate to Settings > API Keys. Generate separate keys for test and production environments. Store keys securely in environment variables.",
    icon: Key
  },
  {
    title: "Configure Webhooks",
    description: "Set up webhook endpoints in your dashboard. Provide a publicly accessible HTTPS URL. Select which events you want to receive. Save the webhook secret for signature verification.",
    icon: Webhook
  },
  {
    title: "Whitelist Domains",
    description: "Add your domains to the allowed list in dashboard settings. Include all subdomains that will make API calls. Configure CORS settings for frontend integrations.",
    icon: Globe
  },
  {
    title: "Test Integration",
    description: "Use test API keys to verify your integration works correctly. Test all endpoints you'll be using. Verify webhook delivery. Check error handling before going live.",
    icon: CheckCircle
  }
]

const troubleshootingChecklist = [
  "Verify API key is correct and active",
  "Check that you're using the right environment (test/production)",
  "Confirm API endpoint URLs are correct",
  "Review request headers and payload format",
  "Check server logs for detailed error messages",
  "Verify SSL certificates are valid",
  "Test with Postman or cURL first",
  "Check for network/firewall issues",
  "Review API version compatibility",
  "Verify webhook signature calculation"
]

export default function IntegrationIssuesPage() {
  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: "Troubleshooting", href: "/support-hub/troubleshooting" },
          { label: "Integration Issues" }
        ]}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 font-semibold text-sm mb-6">
          <Puzzle className="w-4 h-4" />
          Integration Help
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Integration Issues
          <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Setup & Connection Problems
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Resolve API connection problems, authentication errors, and integration challenges
          with step-by-step solutions and code examples.
        </p>
      </motion.div>

      {/* Common Issues */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Common Integration Problems
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Most frequent issues and how to fix them
          </p>
        </motion.div>

        <div className="space-y-6">
          {commonIssues.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    {item.issue}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                      <h4 className="flex items-center gap-2 font-bold text-red-800 mb-3">
                        <AlertTriangle className="w-5 h-5" />
                        Symptoms
                      </h4>
                      <ul className="space-y-2">
                        {item.symptoms.map((symptom, i) => (
                          <li key={i} className="flex items-start gap-2 text-red-700 text-sm">
                            <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                      <h4 className="flex items-center gap-2 font-bold text-green-800 mb-3">
                        <CheckCircle className="w-5 h-5" />
                        Solutions
                      </h4>
                      <ul className="space-y-2">
                        {item.solutions.map((solution, i) => (
                          <li key={i} className="flex items-start gap-2 text-green-700 text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {item.code && (
                    <div>
                      <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-3">
                        <Code className="w-5 h-5" />
                        Code Example
                      </h4>
                      <pre className="p-4 bg-slate-900 text-green-400 rounded-xl overflow-x-auto text-sm">
                        <code>{item.code}</code>
                      </pre>
                    </div>
                  )}
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
            Proper Integration Setup
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Follow these steps to avoid common integration issues
          </p>
        </motion.div>

        <StepByStep steps={setupSteps} />
      </section>

      {/* Troubleshooting Checklist */}
      <section>
        <GlassCard variant="featured">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                Integration Troubleshooting Checklist
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {troubleshootingChecklist.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-white/50 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* CTA */}
      <section>
        <GlassCard>
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Our integration specialists are available to help you get connected
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/support-hub/integrations">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  View Integration Guides
                </motion.button>
              </Link>

              <Link href="/support-hub/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl border-2 border-blue-500 hover:bg-blue-50 transition-all"
                >
                  Contact Support
                </motion.button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
