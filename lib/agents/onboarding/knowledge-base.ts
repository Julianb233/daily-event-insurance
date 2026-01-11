/**
 * Onboarding Agent Knowledge Base
 *
 * Structured knowledge for the onboarding agent to reference.
 * Contains FAQs, integration guides, troubleshooting, and scripts.
 */

export interface KnowledgeEntry {
  id: string
  category: "faq" | "integration" | "troubleshooting" | "scripts" | "pricing" | "process"
  title: string
  content: string
  keywords: string[]
}

export const ONBOARDING_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ================= FAQs =================
  {
    id: "faq-cost-to-join",
    category: "faq",
    title: "Cost to Join as Partner",
    content: `Joining Daily Event Insurance as a partner is completely FREE. There are:
- No setup fees
- No monthly fees
- No contracts or commitments
- No equipment to purchase
- No minimum volume requirements

You simply earn commission on every policy sold through your business.`,
    keywords: ["cost", "fee", "price", "free", "money", "pay", "charge"]
  },
  {
    id: "faq-commission-rate",
    category: "faq",
    title: "Commission Structure",
    content: `Partners earn 50% commission on every policy sold. With average policy prices of $5, that's $2.50 per sale.

Monthly earnings estimates based on participants:
- 100 participants/month → ~$50-75/month
- 500 participants/month → ~$250-375/month
- 1000 participants/month → ~$500-750/month

Commission is calculated as: Monthly Visitors × Opt-in Rate (20-30%) × $2.50 commission

Payouts are made monthly via direct deposit, typically around the 15th.`,
    keywords: ["commission", "earn", "money", "revenue", "payout", "income", "percent"]
  },
  {
    id: "faq-what-is-covered",
    category: "faq",
    title: "What the Insurance Covers",
    content: `Daily Event Insurance provides same-day coverage for accidental injuries during activities at your facility.

Coverage includes:
- Medical expenses from accidents (up to $10,000)
- Emergency room visits
- Doctor visits and follow-up care
- X-rays and imaging
- Physical therapy if needed

Coverage does NOT include:
- Pre-existing conditions
- Intentional self-harm
- Professional sporting events
- Activities conducted while intoxicated`,
    keywords: ["cover", "coverage", "protect", "include", "injury", "accident", "medical"]
  },
  {
    id: "faq-customer-experience",
    category: "faq",
    title: "Customer Purchase Experience",
    content: `The customer experience is simple and takes under 60 seconds:

1. Customer scans QR code or clicks widget
2. Fills in basic info (name, email, activity date)
3. Pays $5 via credit card
4. Receives instant email confirmation with coverage certificate

No accounts needed, no lengthy forms, no waiting. Certificates are delivered immediately via email and can be shown on phone if needed.`,
    keywords: ["customer", "user", "purchase", "buy", "experience", "process", "how"]
  },
  {
    id: "faq-claims-process",
    category: "faq",
    title: "How Claims Work",
    content: `We handle all claims so you don't have to. Here's the process:

1. Customer contacts us at claims@dailyeventinsurance.com
2. They provide incident details and medical documentation
3. Our team reviews within 5-10 business days
4. Approved claims are paid directly to the customer

Partners are NOT involved in claims processing. You simply refer any claims inquiries to us.

There is no deductible for customers, and claims don't affect your commission rate.`,
    keywords: ["claim", "file", "incident", "injury", "report", "process"]
  },
  {
    id: "faq-documents-required",
    category: "faq",
    title: "Required Documents",
    content: `To complete partner onboarding, you'll need to sign three documents:

1. **Partnership Agreement** - Standard terms of our partnership
2. **W9 Form** - Required for tax reporting (you'll receive a 1099)
3. **Direct Deposit Authorization** - For commission payments

All documents are signed electronically - no printing or mailing needed. The entire document process takes about 5-10 minutes.`,
    keywords: ["document", "sign", "agreement", "w9", "tax", "deposit", "paperwork"]
  },

  // ================= Integration Guides =================
  {
    id: "int-qr-code",
    category: "integration",
    title: "QR Code Integration",
    content: `QR codes are the fastest and easiest integration method.

Setup (5 minutes):
1. We generate a custom QR code for your business
2. Download and print the QR code
3. Display at check-in desk, near equipment, or in lobby

Best practices:
- Place at eye level where customers naturally look
- Add signage: "Protect your workout for just $5"
- Include in welcome packets or waivers
- Consider digital display on TVs/tablets

QR codes work for any business type and require zero technical setup.`,
    keywords: ["qr", "code", "scan", "print", "display", "poster"]
  },
  {
    id: "int-widget",
    category: "integration",
    title: "Website Widget Integration",
    content: `Add a purchase widget to your website in 3 easy steps.

Option 1: Floating Button (Recommended)
- Appears in corner of every page
- Customers can purchase anytime
- Add this code before </body>:

<script>
(function(d,e,i){
  var s=d.createElement('script');
  s.src='https://dailyeventinsurance.com/widget.js';
  s.async=true;
  s.onload=function(){
    DEI.init({ partnerId: 'YOUR_ID' });
  };
  d.head.appendChild(s);
})(document);
</script>

Option 2: Inline Embed
- Embed directly in a page section
- Great for checkout pages
- Use iframe or div embed code

Option 3: Popup Modal
- Opens in overlay
- Triggered by button click
- Doesn't navigate away from page`,
    keywords: ["widget", "embed", "website", "code", "javascript", "iframe"]
  },
  {
    id: "int-mindbody",
    category: "integration",
    title: "Mindbody Integration",
    content: `Mindbody users can offer insurance during the booking flow.

Setup Steps:
1. Log into your Mindbody account
2. Go to Settings > Integrations > Webhooks
3. Add our webhook URL: https://dailyeventinsurance.com/api/webhooks/mindbody/YOUR_ID
4. Select events: Class Booked, Appointment Booked
5. Save and test

What happens:
- When a customer books, they receive an email offer
- They can purchase insurance with one click
- Coverage is tied to their booking date

Time: 15-20 minutes | Skill: Basic`,
    keywords: ["mindbody", "booking", "fitness", "gym", "studio", "spa", "webhook"]
  },
  {
    id: "int-shopify",
    category: "integration",
    title: "Shopify Integration",
    content: `Add insurance upsell to your Shopify checkout.

Option 1: Cart Add-on (Easiest)
1. Go to Online Store > Themes > Edit Code
2. Find cart.liquid or cart-template.liquid
3. Add our widget code in the cart section
4. Save

Option 2: Product Page Widget
1. Find product-template.liquid
2. Add widget below "Add to Cart" button
3. Save

Option 3: Checkout Extension (Coming Soon)
- Native Shopify checkout integration
- Appears as line item in checkout

The widget automatically detects cart contents and suggests appropriate coverage.`,
    keywords: ["shopify", "ecommerce", "cart", "checkout", "store", "online"]
  },

  // ================= Troubleshooting =================
  {
    id: "ts-widget-not-showing",
    category: "troubleshooting",
    title: "Widget Not Appearing",
    content: `If the widget isn't showing on your website:

1. **Check Console for Errors**
   - Right-click > Inspect > Console tab
   - Look for red error messages

2. **Verify Code Placement**
   - Should be just before </body>
   - Make sure it's not inside a comment

3. **Check for Conflicts**
   - Disable other scripts temporarily
   - Try incognito mode

4. **Clear Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear site cache in browser

5. **Verify Partner ID**
   - Make sure your partner ID is correct
   - No extra spaces or quotes

If still not working, contact support@dailyeventinsurance.com with your website URL.`,
    keywords: ["widget", "not", "showing", "appear", "display", "broken", "error"]
  },
  {
    id: "ts-qr-not-scanning",
    category: "troubleshooting",
    title: "QR Code Not Scanning",
    content: `If customers can't scan the QR code:

1. **Check Print Quality**
   - Print at 300 DPI or higher
   - Avoid scaling below 1.5 inches
   - Use high contrast (black on white)

2. **Check Lighting**
   - Avoid glare from plastic covers
   - Ensure adequate lighting
   - No direct sunlight on code

3. **Check Phone Settings**
   - Camera needs QR code scanning enabled
   - Try different camera apps

4. **Test the Code**
   - Scan with your own phone
   - Verify it goes to correct URL

If the QR code is damaged, we can regenerate a new one instantly.`,
    keywords: ["qr", "scan", "work", "read", "phone", "camera"]
  },

  // ================= Staff Scripts =================
  {
    id: "script-checkin",
    category: "scripts",
    title: "Check-in Script",
    content: `Use this script when customers check in:

**Simple Version:**
"Would you like same-day injury insurance for just $5? It covers any accidents during your visit today."

**If They Ask Questions:**
"It's quick coverage for any accidental injuries - medical expenses, ER visits, doctor follow-ups. Just scan this QR code with your phone and it takes 30 seconds."

**If They Decline:**
"No problem! The QR code will be here if you change your mind."

**Key Points:**
- Keep it brief (under 10 seconds)
- Mention the low price ($5)
- Point to the QR code
- Don't be pushy`,
    keywords: ["script", "say", "ask", "checkin", "offer", "customer", "talk"]
  },
  {
    id: "script-objections",
    category: "scripts",
    title: "Handling Common Objections",
    content: `**"I already have health insurance"**
"This covers out-of-pocket costs your health insurance might not, like copays and deductibles. It's just $5 for extra peace of mind."

**"What does it cover?"**
"Any accidental injuries during your visit - ER visits, doctor appointments, x-rays, even physical therapy if needed."

**"That seems unnecessary"**
"Totally understand! It's there if you want it. The QR code will be here if you change your mind."

**"I've never been injured here"**
"That's great! It's just an option for extra protection. Totally up to you."

**"Is this a scam?"**
"No, we partner with [Your Business] to offer this. You'll get an instant confirmation email with your coverage certificate."

Remember: One "no" means no. Don't push.`,
    keywords: ["objection", "answer", "respond", "question", "decline", "concern"]
  },

  // ================= Pricing & Business =================
  {
    id: "pricing-overview",
    category: "pricing",
    title: "Pricing Overview",
    content: `**Customer Pricing:**
- Standard day coverage: $5
- Premium activities (climbing, skiing): $8-15
- Equipment coverage add-on: +$2-5

**Partner Commission:**
- 50% of premium
- Standard: $2.50 per sale
- Premium: $4-7.50 per sale

**Volume Bonuses:**
- 100+ policies/month: +5% bonus
- 500+ policies/month: +10% bonus
- 1000+ policies/month: Custom rates available

**Payout Schedule:**
- Monthly payouts
- Processed around 15th of each month
- Direct deposit (ACH)
- Minimum payout: $25`,
    keywords: ["price", "cost", "premium", "commission", "bonus", "payout"]
  },

  // ================= Process =================
  {
    id: "process-onboarding-steps",
    category: "process",
    title: "Complete Onboarding Process",
    content: `The full onboarding process has 5 main stages:

**Stage 1: Signup (10-15 min)**
- Provide business information
- Create partner account
- Choose integration type

**Stage 2: Documents (5-10 min)**
- Sign partnership agreement
- Complete W9 form
- Set up direct deposit

**Stage 3: Integration (5-30 min)**
- Set up your chosen integration method
- QR codes: 5 minutes
- Website widget: 15-30 minutes
- POS integration: 30+ minutes

**Stage 4: Training (10-15 min)**
- Download staff scripts
- Review FAQ materials
- Watch training video (optional)

**Stage 5: Go Live!**
- Display QR codes
- Enable widgets
- Start earning

Total time: 30-60 minutes depending on integration choice`,
    keywords: ["step", "process", "onboarding", "setup", "start", "begin", "how"]
  },
  {
    id: "process-go-live-checklist",
    category: "process",
    title: "Go-Live Checklist",
    content: `Before going live, verify:

**Account Setup:**
[ ] Partner account created
[ ] All documents signed
[ ] Direct deposit configured
[ ] Integration method chosen

**Integration:**
[ ] Widget/QR code generated
[ ] Integration tested successfully
[ ] Test purchase completed

**Staff Preparation:**
[ ] Staff scripts distributed
[ ] FAQ cards available
[ ] Staff briefed on offering insurance

**Marketing:**
[ ] QR codes printed and displayed
[ ] Website widget visible
[ ] Signage in place

**Final Verification:**
[ ] Made a test purchase
[ ] Received confirmation email
[ ] Dashboard shows test policy

Once all items are checked, you're ready to go live!`,
    keywords: ["checklist", "launch", "live", "ready", "verify", "go", "start"]
  }
]

/**
 * Search the knowledge base
 */
export function searchKnowledgeBase(
  query: string,
  limit: number = 5
): KnowledgeEntry[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)

  const scored = ONBOARDING_KNOWLEDGE_BASE.map(entry => {
    let score = 0

    // Title match
    if (entry.title.toLowerCase().includes(queryLower)) {
      score += 10
    }

    // Keyword matches
    for (const keyword of entry.keywords) {
      if (queryLower.includes(keyword)) {
        score += 5
      }
    }

    // Content word matches
    const contentLower = entry.content.toLowerCase()
    for (const word of queryWords) {
      if (contentLower.includes(word)) {
        score += 1
      }
    }

    return { entry, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.entry)
}

/**
 * Get entries by category
 */
export function getEntriesByCategory(category: KnowledgeEntry["category"]): KnowledgeEntry[] {
  return ONBOARDING_KNOWLEDGE_BASE.filter(e => e.category === category)
}

/**
 * Get a specific entry by ID
 */
export function getEntryById(id: string): KnowledgeEntry | undefined {
  return ONBOARDING_KNOWLEDGE_BASE.find(e => e.id === id)
}
