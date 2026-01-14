"use client"

import { useState } from "react"
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Search,
  Copy,
  Check,
  ArrowRight,
  Bookmark,
  Code,
  HelpCircle,
  CreditCard,
  Wrench,
  Zap,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CannedResponse {
  id: string
  title: string
  content: string
  codeSnippet?: string
  codeLanguage?: string
  tags: string[]
}

interface ResponseCategory {
  id: string
  name: string
  icon: React.ElementType
  description: string
  responses: CannedResponse[]
}

const CANNED_RESPONSE_CATEGORIES: ResponseCategory[] = [
  {
    id: "onboarding",
    name: "Onboarding Help",
    icon: Bookmark,
    description: "Guide partners through the setup process",
    responses: [
      {
        id: "onb-1",
        title: "Welcome & Overview",
        content: `Welcome to Daily Event Insurance! I'm here to help you get set up.

The onboarding process has 5 simple steps:
1. Business Information - Enter your company details
2. Integration Type - Choose API or Widget integration
3. Technical Setup - Configure your integration
4. Test Transaction - Verify everything works
5. Go Live - Launch to your customers

Which step would you like help with?`,
        tags: ["welcome", "getting started", "overview"],
      },
      {
        id: "onb-2",
        title: "API Key Generation",
        content: `To generate your API keys:

1. Go to Settings > API Keys in your partner dashboard
2. Click "Generate New Key"
3. Choose between Sandbox (for testing) or Production
4. Copy and securely store your keys - they won't be shown again

Important: Never share your API secret key or commit it to version control. Use environment variables instead.

Would you like me to guide you through the configuration process?`,
        tags: ["api key", "credentials", "setup"],
      },
      {
        id: "onb-3",
        title: "Sandbox Testing Guide",
        content: `Great question about testing! Here's how to use our sandbox environment:

1. Use your Sandbox API keys (not Production)
2. All transactions in sandbox are simulated - no real charges
3. Test card number: 4242 4242 4242 4242
4. Any future expiry date and any 3-digit CVC

Test scenarios available:
- Successful purchase: Use test card above
- Declined: Use 4000 0000 0000 0002
- Requires auth: Use 4000 0025 0000 3155

Let me know when you're ready to test!`,
        tags: ["sandbox", "testing", "test cards"],
      },
    ],
  },
  {
    id: "api_integration",
    name: "API Integration",
    icon: Code,
    description: "Technical help for API implementation",
    responses: [
      {
        id: "api-1",
        title: "REST API Quick Start",
        content: `Here's a quick start guide for our REST API.

All API requests require authentication via Bearer token in the header. Here's a basic example:`,
        codeSnippet: `// Initialize API client
const API_BASE = 'https://api.dailyeventinsurance.com/v1';
const headers = {
  'Authorization': \`Bearer \${process.env.DEI_API_KEY}\`,
  'Content-Type': 'application/json'
};

// Create a quote
const response = await fetch(\`\${API_BASE}/quotes\`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    eventType: 'fitness_class',
    eventDate: '2024-03-15',
    participantCount: 1,
    coverageAmount: 50000
  })
});

const quote = await response.json();
console.log('Quote ID:', quote.id);`,
        codeLanguage: "javascript",
        tags: ["api", "rest", "authentication", "quick start"],
      },
      {
        id: "api-2",
        title: "Webhook Configuration",
        content: `To receive real-time updates about policies, you'll need to configure webhooks.

1. Go to Settings > Webhooks in your dashboard
2. Add your endpoint URL (must be HTTPS)
3. Select the events you want to receive
4. Copy the signing secret for verification

Here's how to verify webhook signatures:`,
        codeSnippet: `import crypto from 'crypto';

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(\`sha256=\${expectedSignature}\`)
  );
}

// In your webhook handler
app.post('/webhooks/dei', (req, res) => {
  const signature = req.headers['x-dei-signature'];
  const isValid = verifyWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Process the webhook...
  res.status(200).send('OK');
});`,
        codeLanguage: "typescript",
        tags: ["webhooks", "events", "signatures", "security"],
      },
      {
        id: "api-3",
        title: "Error Handling Best Practices",
        content: `Here are best practices for handling API errors:

Our API uses standard HTTP status codes:
- 200-299: Success
- 400: Bad request (check your input)
- 401: Unauthorized (check API key)
- 403: Forbidden (check permissions)
- 404: Not found
- 429: Rate limited (slow down)
- 500+: Server error (retry with backoff)

Here's a robust error handling example:`,
        codeSnippet: `async function apiRequest(endpoint, options, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(endpoint, options);

      if (response.ok) {
        return await response.json();
      }

      const error = await response.json();

      // Don't retry client errors
      if (response.status >= 400 && response.status < 500) {
        throw new Error(\`API Error: \${error.message}\`);
      }

      // Retry server errors with exponential backoff
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        continue;
      }

      throw new Error(\`Server error after \${retries} attempts\`);
    } catch (err) {
      if (attempt === retries) throw err;
    }
  }
}`,
        codeLanguage: "javascript",
        tags: ["errors", "retry", "best practices"],
      },
    ],
  },
  {
    id: "widget_install",
    name: "Widget Installation",
    icon: Zap,
    description: "Help with widget setup and customization",
    responses: [
      {
        id: "widget-1",
        title: "React Widget Installation",
        content: `To install the widget in your React application, follow these steps:

First, install the package:`,
        codeSnippet: `npm install @daily-event-insurance/widget-react

// Then in your component:
import { InsuranceWidget } from '@daily-event-insurance/widget-react';

function CheckoutPage({ eventDetails }) {
  const handlePurchase = (policy) => {
    console.log('Policy purchased:', policy.id);
    // Update your order with the policy info
  };

  return (
    <InsuranceWidget
      partnerId={process.env.NEXT_PUBLIC_DEI_PARTNER_ID}
      eventType={eventDetails.type}
      eventDate={eventDetails.date}
      onPurchase={handlePurchase}
      onError={(error) => console.error('Widget error:', error)}
      theme={{
        primaryColor: '#7c3aed', // Match your brand
        borderRadius: '8px'
      }}
    />
  );
}`,
        codeLanguage: "jsx",
        tags: ["react", "widget", "npm", "installation"],
      },
      {
        id: "widget-2",
        title: "Vanilla JS Widget (Script Tag)",
        content: `For non-React sites, you can use our script tag integration:`,
        codeSnippet: `<!-- Add to your HTML -->
<script src="https://widget.dailyeventinsurance.com/v1/embed.js"></script>

<div id="dei-widget"></div>

<script>
  DEIWidget.init({
    container: '#dei-widget',
    partnerId: 'YOUR_PARTNER_ID',
    eventType: 'fitness_class',
    eventDate: '2024-03-15',
    onPurchase: function(policy) {
      console.log('Policy purchased:', policy.id);
    },
    theme: {
      primaryColor: '#7c3aed'
    }
  });
</script>`,
        codeLanguage: "html",
        tags: ["javascript", "vanilla", "script tag", "html"],
      },
      {
        id: "widget-3",
        title: "Widget Styling & Customization",
        content: `You can customize the widget appearance to match your brand:`,
        codeSnippet: `// Theme options
const theme = {
  // Colors
  primaryColor: '#7c3aed',      // Main accent color
  backgroundColor: '#ffffff',   // Widget background
  textColor: '#1e293b',         // Primary text
  secondaryTextColor: '#64748b', // Secondary text

  // Borders & Shadows
  borderRadius: '12px',
  borderColor: '#e2e8f0',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',

  // Typography
  fontFamily: 'Inter, system-ui, sans-serif',

  // Size
  width: '100%',
  maxWidth: '400px'
};

<InsuranceWidget
  partnerId="your-id"
  theme={theme}
  // ... other props
/>`,
        codeLanguage: "javascript",
        tags: ["styling", "theme", "customization", "css"],
      },
    ],
  },
  {
    id: "billing",
    name: "Billing Questions",
    icon: CreditCard,
    description: "Commission, payouts, and billing help",
    responses: [
      {
        id: "bill-1",
        title: "Commission Structure",
        content: `Here's how our commission structure works:

Base Commission Tiers:
- Starter: 15% of premium
- Growth: 18% of premium (50+ policies/month)
- Pro: 20% of premium (200+ policies/month)
- Enterprise: Custom rates (contact us)

Commissions are calculated on the net premium (excluding taxes and fees). You can view your current tier and projected earnings in the Partner Dashboard under "My Earnings".

Would you like me to check your current tier status?`,
        tags: ["commission", "earnings", "tiers", "rates"],
      },
      {
        id: "bill-2",
        title: "Payout Schedule",
        content: `Our standard payout schedule:

- Payouts are processed on the 1st and 15th of each month
- Minimum payout threshold: $50
- Processing time: 2-3 business days via ACH
- International payouts: Wire transfer (5-7 business days)

To update your payout details:
1. Go to Settings > Billing
2. Click "Payment Methods"
3. Add or update your bank account

Your next scheduled payout can be viewed in the Dashboard.`,
        tags: ["payout", "payment", "schedule", "bank"],
      },
      {
        id: "bill-3",
        title: "Invoice & Reporting",
        content: `You can access detailed reports in your dashboard:

1. Monthly Commission Statements - Settings > Billing > Statements
2. Policy-level reports - Reports > Policy Details
3. Transaction exports - Reports > Export (CSV/Excel)

All invoices are automatically emailed on the 1st of each month. You can also download historical invoices from the Billing section.

Need a custom report format? Let me know what data you need!`,
        tags: ["invoice", "reports", "statements", "export"],
      },
    ],
  },
  {
    id: "troubleshooting",
    name: "Technical Troubleshooting",
    icon: Wrench,
    description: "Common issues and solutions",
    responses: [
      {
        id: "trouble-1",
        title: "CORS Error Resolution",
        content: `CORS errors usually occur when your domain isn't whitelisted. Here's how to fix it:

1. Go to Settings > Allowed Domains in your dashboard
2. Add your domain (e.g., https://yourdomain.com)
3. For local development, add http://localhost:3000

Important notes:
- Include the full origin (protocol + domain)
- No trailing slashes
- Add both www and non-www versions if needed
- Changes take effect within 5 minutes

I can also add domains for you - just let me know your domain!`,
        tags: ["cors", "domain", "whitelist", "error"],
      },
      {
        id: "trouble-2",
        title: "API Authentication Errors (401)",
        content: `Getting 401 Unauthorized errors? Check these common causes:

1. API Key Issues:
   - Verify you're using the correct key (Sandbox vs Production)
   - Check the key hasn't been revoked
   - Ensure no extra spaces in the key

2. Header Format:
   - Must be: Authorization: Bearer YOUR_API_KEY
   - Not: Authorization: YOUR_API_KEY

3. Environment:
   - Sandbox keys only work with sandbox endpoints
   - Production keys only work with production endpoints

Here's the correct format:`,
        codeSnippet: `// Correct
const headers = {
  'Authorization': 'Bearer sk_live_abc123...',
  'Content-Type': 'application/json'
};

// Common mistakes to avoid:
// 'Authorization': 'sk_live_abc123...'  // Missing 'Bearer'
// 'Authorization': 'Bearer  sk_live...'  // Extra space
// 'API-Key': 'sk_live_abc123...'  // Wrong header name`,
        codeLanguage: "javascript",
        tags: ["authentication", "401", "api key", "bearer"],
      },
      {
        id: "trouble-3",
        title: "Widget Not Loading",
        content: `If the widget isn't loading, try these troubleshooting steps:

1. Check Console Errors:
   - Open browser DevTools (F12)
   - Look for errors in Console tab

2. Verify Partner ID:
   - Ensure partnerId matches your dashboard
   - Check for typos or extra spaces

3. Script Loading:
   - Verify the script is loaded before init
   - Check for Content Security Policy blocks

4. Container Element:
   - Ensure the container div exists when init is called
   - Try using DOMContentLoaded or document ready

Debug checklist:`,
        codeSnippet: `// Debug widget loading
window.addEventListener('DOMContentLoaded', () => {
  console.log('Container exists:', !!document.querySelector('#dei-widget'));
  console.log('DEIWidget available:', typeof DEIWidget !== 'undefined');

  try {
    DEIWidget.init({
      container: '#dei-widget',
      partnerId: 'your-partner-id',
      debug: true,  // Enable debug mode
      onError: (error) => {
        console.error('Widget Error:', error);
      }
    });
  } catch (err) {
    console.error('Init Error:', err);
  }
});`,
        codeLanguage: "javascript",
        tags: ["widget", "loading", "debug", "troubleshoot"],
      },
      {
        id: "trouble-4",
        title: "Rate Limiting (429 Errors)",
        content: `If you're hitting rate limits, here's what to know:

Rate Limits:
- Standard: 100 requests per minute
- Burst: 20 requests per second
- Webhook retries: 3 attempts with exponential backoff

Best practices to avoid rate limits:
1. Cache quote responses (valid for 15 minutes)
2. Use webhooks instead of polling
3. Batch operations where possible
4. Implement exponential backoff on retries

Here's a backoff implementation:`,
        codeSnippet: `async function requestWithBackoff(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const delay = Math.min(1000 * Math.pow(2, i), 30000);
        console.log(\`Rate limited. Retrying in \${delay}ms...\`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}`,
        codeLanguage: "javascript",
        tags: ["rate limit", "429", "throttle", "backoff"],
      },
    ],
  },
]

interface CannedResponsesProps {
  onInsertResponse: (content: string, codeSnippet?: string, codeLanguage?: string) => void
  className?: string
}

export function CannedResponses({ onInsertResponse, className }: CannedResponsesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (response: CannedResponse) => {
    try {
      const textToCopy = response.codeSnippet
        ? `${response.content}\n\n${response.codeSnippet}`
        : response.content
      await navigator.clipboard.writeText(textToCopy)
      setCopiedId(response.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleInsert = (response: CannedResponse) => {
    onInsertResponse(response.content, response.codeSnippet, response.codeLanguage)
  }

  // Filter responses based on search query
  const filteredCategories = searchQuery
    ? CANNED_RESPONSE_CATEGORIES.map((category) => ({
        ...category,
        responses: category.responses.filter(
          (response) =>
            response.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            response.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            response.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        ),
      })).filter((category) => category.responses.length > 0)
    : CANNED_RESPONSE_CATEGORIES

  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm", className)}>
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Canned Responses</h3>
            <p className="text-xs text-slate-500">Quick templates for common questions</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search responses..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="max-h-[400px] overflow-y-auto">
        {filteredCategories.length === 0 ? (
          <div className="p-6 text-center">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No responses match your search</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="border-b border-slate-100 last:border-0">
              {/* Category Header */}
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <category.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900">{category.name}</p>
                  <p className="text-xs text-slate-500">{category.responses.length} templates</p>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Category Responses */}
              <AnimatePresence>
                {expandedCategory === category.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-slate-50"
                  >
                    <div className="p-2 space-y-2">
                      {category.responses.map((response) => (
                        <div
                          key={response.id}
                          className="bg-white rounded-lg border border-slate-200 p-3"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-sm font-medium text-slate-900">
                              {response.title}
                            </h4>
                            {response.codeSnippet && (
                              <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">
                                +code
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                            {response.content}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleInsert(response)}
                              className="flex items-center gap-1 px-2 py-1 bg-violet-600 text-white text-xs font-medium rounded hover:bg-violet-700 transition-colors"
                            >
                              <ArrowRight className="w-3 h-3" />
                              Insert
                            </button>
                            <button
                              onClick={() => handleCopy(response)}
                              className="flex items-center gap-1 px-2 py-1 border border-slate-200 text-slate-600 text-xs font-medium rounded hover:bg-slate-50 transition-colors"
                            >
                              {copiedId === response.id ? (
                                <>
                                  <Check className="w-3 h-3 text-green-500" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
