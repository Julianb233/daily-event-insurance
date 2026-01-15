/**
 * Vector Search Knowledge Base Data
 *
 * Pre-defined knowledge base articles for the RAG system.
 * These are indexed on startup for semantic search.
 */

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  tags: string[]
}

export const KNOWLEDGE_BASE_ARTICLES: KnowledgeArticle[] = [
  // B2B Partnership Overview
  {
    id: "partnership-overview",
    title: "Daily Event Insurance Partnership Overview",
    content: `
Daily Event Insurance is an embedded insurance platform that helps gyms, climbing facilities,
rental businesses, and adventure companies offer same-day liability coverage to their members.

KEY BENEFITS FOR PARTNERS:
- Earn 15-25% commission on every policy sold
- Zero implementation cost - we handle everything
- Setup takes only 2-3 hours, then fully automated
- Reduces claims against existing liability policy

HOW IT WORKS:
1. Partner embeds our widget on their website or uses our API
2. Members/visitors see coverage option during booking/check-in
3. Coverage is offered at $5-15 per day depending on activity type
4. Partner earns commission on each sale automatically

BUSINESS TYPES WE SERVE:
- Gyms: Day-pass and drop-in coverage for non-members
- Climbing Gyms: First-timer and visitor accident protection
- Equipment Rental: Equipment damage + injury coverage bundled
- Adventure/Outdoor: High-risk activity coverage on demand
`,
    tags: ["partnership", "overview", "commission", "benefits", "b2b"],
  },

  // Pricing Information
  {
    id: "pricing-info",
    title: "Pricing and Commission Structure",
    content: `
CUSTOMER PRICING:
- Basic coverage: $5-8 per day
- Standard coverage: $8-12 per day
- Premium coverage: $12-15 per day

Pricing varies based on activity type, location, and coverage limits.

PARTNER COMMISSIONS:
- Standard partners: 15% of premium
- Silver tier (1000+ monthly): 18% of premium
- Gold tier (2500+ monthly): 20% of premium
- Platinum tier (5000+ monthly): 25% of premium

PAYOUT SCHEDULE:
- Commissions processed on the 1st and 15th of each month
- Payment via ACH or PayPal within 3-5 business days
- Minimum payout threshold: $50

NO COST TO PARTNERS:
- Zero setup fees
- Zero monthly fees
- Zero transaction fees
- We handle all insurance administration
`,
    tags: ["pricing", "commission", "payout", "fees", "cost"],
  },

  // Integration Options
  {
    id: "integration-options",
    title: "Integration Methods",
    content: `
WIDGET INTEGRATION (Recommended):
Simple embed code that adds insurance option to your website.

<script src="https://cdn.dailyeventinsurance.com/widget.js"></script>
<div id="dei-widget" data-partner-key="YOUR_KEY"></div>

API INTEGRATION:
Full control over the purchase flow with our REST API.
- Create quotes programmatically
- Handle payments in your existing flow
- Custom UI with your branding

POS INTEGRATION:
Direct integrations with popular point-of-sale systems:
- Mindbody
- Pike13
- ClubReady
- Zen Planner

SETUP TIME:
- Widget: 30 minutes
- API: 2-3 hours
- POS: 1-2 hours (with our support)
`,
    tags: ["integration", "widget", "api", "pos", "setup"],
  },

  // Objection Handling
  {
    id: "objection-handling",
    title: "Common Objections and Responses",
    content: `
"WE ALREADY HAVE INSURANCE"
Response: "That's great - liability coverage is essential. What we offer is different.
This is participant accident coverage that your members purchase themselves. It actually
protects YOUR insurance by reducing claims against your policy. Many partners see it as
an additional revenue stream."

"OUR MEMBERS WON'T PAY FOR IT"
Response: "I understand that concern. When coverage is optional and affordable - $5-15
per session - members who want extra protection are happy to pay. It's especially popular
with first-timers and visitors who are less familiar with your facility."

"WE DON'T HAVE TIME TO IMPLEMENT"
Response: "That's exactly why we built this to be hands-off. Setup takes about 2-3 hours
with our team handling most of the technical work. After that, it runs automatically with
no daily work required from your staff."

"WHAT DOES IT COST?"
Response: "There's no cost to your business - we handle all the insurance and administration.
You actually earn a commission on each policy sold. For members, coverage starts at around
$5 per day, which most consider very affordable for peace of mind."

"SEND ME SOME INFORMATION"
Response: "Happy to! Before I do, what specific information would be most helpful?
Also, when would be a good time for a quick follow-up call to answer any questions?"
`,
    tags: ["objections", "sales", "responses", "handling"],
  },

  // Coverage Details
  {
    id: "coverage-details",
    title: "Coverage Types and Limits",
    content: `
PARTICIPANT ACCIDENT COVERAGE:
- Covers medical expenses from accidents during activities
- Limits range from $10,000 to $50,000
- No deductible for minor injuries

LIABILITY COVERAGE:
- Protects against third-party claims
- Covers property damage and bodily injury
- Limits from $100,000 to $1,000,000

EQUIPMENT COVERAGE (For Rentals):
- Covers damage to rented equipment
- Theft protection included
- Replacement cost coverage

WHAT'S NOT COVERED:
- Pre-existing medical conditions
- Intentional acts or gross negligence
- Professional sports competitions
- Activities under influence of alcohol/drugs

CLAIMS PROCESS:
1. Member reports incident within 30 days
2. Our team collects necessary documentation
3. Claims typically processed within 7-14 days
4. Partner is not involved in claims handling
`,
    tags: ["coverage", "limits", "claims", "liability", "accident"],
  },

  // Support Information
  {
    id: "partner-support",
    title: "Partner Support Resources",
    content: `
GETTING HELP:
- Technical Support: support@dailyeventinsurance.com
- Billing Questions: billing@dailyeventinsurance.com
- Enterprise Sales: enterprise@dailyeventinsurance.com
- Phone: (555) 123-4567 (9am-6pm PT)

PARTNER DASHBOARD:
- View real-time sales and commissions
- Access reports and analytics
- Manage integration settings
- Download marketing materials

TRAINING RESOURCES:
- Video tutorials in partner dashboard
- Monthly webinars for partners
- Dedicated success manager for Gold+ partners
- Knowledge base with 50+ articles

ESCALATION PATH:
1. Chat support (available 24/7)
2. Email support (response within 24 hours)
3. Phone support (business hours)
4. Dedicated success manager (Gold+ partners)
`,
    tags: ["support", "help", "contact", "training", "resources"],
  },

  // Compliance Information
  {
    id: "compliance-info",
    title: "Compliance and Legal Information",
    content: `
LICENSING:
- Daily Event Insurance is a licensed insurance agency
- Coverage provided by A-rated carriers
- Licensed in all 50 US states

PARTNER RESPONSIBILITIES:
- You are NOT a licensed insurance agent
- Do not provide insurance advice
- Do not discuss specific coverage limits or exclusions
- Refer detailed questions to our licensed team

DO NOT CALL COMPLIANCE:
- Honor all DNC requests immediately
- Record DNC requests in the system
- We maintain compliance with FTC regulations

DOCUMENT REQUIREMENTS:
- Partner Agreement (required)
- W-9 Form (required for US partners)
- Direct Deposit Authorization (for payouts)
- Business License verification (may be required)

PRIVACY:
- We are HIPAA compliant for health information
- Customer data is encrypted at rest and in transit
- We do not sell customer data to third parties
`,
    tags: ["compliance", "legal", "licensing", "dnc", "privacy"],
  },

  // Sales Script - Gym
  {
    id: "script-gym",
    title: "Sales Script: Gym Partners",
    content: `
OPENING:
"Hi [NAME], this is Sarah calling from Daily Event Insurance. You recently submitted
an inquiry about offering insurance coverage at [GYM NAME]. Do you have a quick moment?"

DISCOVERY QUESTIONS:
1. "Tell me about [GYM NAME] - how many locations do you have?"
2. "About how many day-pass or drop-in visitors do you see monthly?"
3. "Do you currently offer any coverage options for non-members?"
4. "What's your biggest concern around liability with visitors?"

VALUE PROPOSITION:
"Based on what you've shared, our embedded coverage could be perfect for [GYM NAME].
Partners with similar visitor volumes typically earn $500-1,500 per month in commissions
while protecting both their members and their business."

KEY BENEFITS FOR GYMS:
- Day-pass visitors can get instant coverage
- Reduces liability exposure for the gym
- Popular with first-timers and visitors
- No staff training required

CLOSE:
"Let me schedule a quick 15-minute demo to show you exactly how this works in a gym
environment. Would [DAY] or [DAY] work better for you?"
`,
    tags: ["script", "gym", "fitness", "sales", "discovery"],
  },

  // Sales Script - Climbing
  {
    id: "script-climbing",
    title: "Sales Script: Climbing Gym Partners",
    content: `
OPENING:
"Hi [NAME], this is Sarah calling from Daily Event Insurance. You recently submitted
an inquiry about offering insurance coverage at [CLIMBING GYM]. Do you have a quick moment?"

DISCOVERY QUESTIONS:
1. "Tell me about [CLIMBING GYM] - what types of climbing do you offer?"
2. "About how many first-time climbers do you see each month?"
3. "Do you require waivers for all climbers?"
4. "Have you had any incidents with visitors that concerned you?"

VALUE PROPOSITION:
"Climbing gyms see some of our highest opt-in rates - typically 60-70% - because climbers
understand the inherent risks and value protection. For a gym your size, partners typically
see $800-2,000 in monthly commissions."

KEY BENEFITS FOR CLIMBING GYMS:
- First-timers especially value the peace of mind
- Covers accidents from belaying, bouldering, etc.
- Reduces your liability exposure significantly
- Integrates with common climbing gym software

CLOSE:
"I'd love to show you how this looks in a climbing gym context. We have a demo
environment set up just for climbing facilities. Would [DAY] work for a 15-minute call?"
`,
    tags: ["script", "climbing", "bouldering", "sales", "discovery"],
  },

  // Sales Script - Equipment Rental
  {
    id: "script-rental",
    title: "Sales Script: Equipment Rental Partners",
    content: `
OPENING:
"Hi [NAME], this is Sarah calling from Daily Event Insurance. You recently submitted
an inquiry about offering insurance coverage at [RENTAL BUSINESS]. Do you have a quick moment?"

DISCOVERY QUESTIONS:
1. "What types of equipment do you rent out?"
2. "How do you currently handle damage disputes with renters?"
3. "About how many rentals do you process monthly?"
4. "What's your biggest pain point with equipment damage?"

VALUE PROPOSITION:
"Rental businesses love our solution because it solves the damage dispute problem.
When customers have coverage, they're honest about incidents and you get compensated.
Partners report reducing damage disputes by 80%."

KEY BENEFITS FOR RENTAL BUSINESSES:
- Equipment damage coverage protects your inventory
- Injury coverage for using rented equipment
- Customers feel more comfortable renting expensive items
- Reduces friction around damage deposits

CLOSE:
"I'd love to show you how our equipment coverage works. It's different from consumer
options and designed specifically for rental businesses. When would be a good time
for a quick demo?"
`,
    tags: ["script", "rental", "equipment", "sales", "damage"],
  },

  // Voicemail Script
  {
    id: "script-voicemail",
    title: "Voicemail Script",
    content: `
STANDARD VOICEMAIL:
"Hi [NAME], this is Sarah from Daily Event Insurance. I'm following up on your
recent inquiry about offering insurance coverage to your members. We help businesses
like yours earn extra revenue by offering same-day coverage - with zero cost to you.

Please give me a call back at [NUMBER] or reply to our email. I'd love to share
how other [BUSINESS TYPE] are earning $500-2,000 monthly with our partnership.

Thanks, and have a great day!"

SHORT VOICEMAIL (Follow-up):
"Hi [NAME], Sarah from Daily Event Insurance again. Just wanted to make sure you
got our information. Give me a call when you have a moment - [NUMBER]. Thanks!"

KEY VOICEMAIL TIPS:
- Keep it under 30 seconds
- Mention one key benefit
- Leave callback number clearly
- Sound friendly, not salesy
- Don't leave more than 2 voicemails
`,
    tags: ["voicemail", "script", "message", "callback"],
  },
]
