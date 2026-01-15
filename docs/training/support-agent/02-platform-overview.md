# Platform Overview
## Understanding the Daily Event Insurance Platform

**Version:** 1.0
**Last Updated:** January 2025
**Prerequisites:** Complete [Getting Started](./01-getting-started.md)

---

## Table of Contents

1. [Platform Architecture](#platform-architecture)
2. [Customer Flow](#customer-flow)
3. [Partner Dashboard](#partner-dashboard)
4. [Integration Methods](#integration-methods)
5. [Key Features](#key-features)
6. [Data Flow](#data-flow)
7. [Platform Components](#platform-components)

---

## Platform Architecture

### System Overview

```
┌─────────────────────────────────────────────────────┐
│                 Daily Event Insurance                │
│                    Main Platform                     │
└──────────┬──────────────────────────────┬───────────┘
           │                              │
    ┌──────▼──────┐              ┌───────▼──────┐
    │   Partner   │              │   Customer   │
    │  Dashboard  │              │  Experience  │
    │   (Admin)   │              │  (Purchase)  │
    └──────┬──────┘              └───────┬──────┘
           │                              │
    ┌──────▼──────────────────────────────▼──────┐
    │         Integration Layer                   │
    │  • Widget Embed                             │
    │  • API Endpoints                            │
    │  • POS Integrations (Square, Mindbody)      │
    │  • Webhooks                                 │
    └──────┬──────────────────────────────────────┘
           │
    ┌──────▼──────────────────────────────────────┐
    │         Core Services                        │
    │  • Quote Engine                              │
    │  • Payment Processing                        │
    │  • Policy Issuance                           │
    │  • Email/SMS Delivery                        │
    │  • Claims Management                         │
    └──────┬──────────────────────────────────────┘
           │
    ┌──────▼──────────────────────────────────────┐
    │         Data & Analytics                     │
    │  • Transaction Database                      │
    │  • Reporting Engine                          │
    │  • Commission Tracking                       │
    └─────────────────────────────────────────────┘
```

### Key Platform URLs

| Environment | Purpose | URL Pattern | Who Uses |
|-------------|---------|-------------|----------|
| **Production** | Live customer purchases | dailyeventinsurance.com | Everyone |
| **Partner Portal** | Partner dashboard | partners.dailyeventinsurance.com | Business partners |
| **Admin Portal** | Internal management | admin.dailyeventinsurance.com | Internal team |
| **Staging** | Testing environment | staging.dailyeventinsurance.com | Dev/Support teams |
| **Widget CDN** | Embedded widget script | widget.dailyeventinsurance.com | Partner websites |

---

## Customer Flow

### Purchase Journey (Step-by-Step)

#### Step 1: Discovery
**Where:** Partner's website or check-in system
**What happens:**
- Customer arrives at partner location or website
- Begins check-in or checkout process
- Widget/integration displays insurance option

**Support Issues:**
- Widget not displaying
- Wrong activity type showing
- Pricing incorrect

#### Step 2: Coverage Selection
**Where:** Embedded widget or POS screen
**What happens:**
- Customer sees coverage options
- Reads coverage summary
- Selects "Yes, add coverage" or "No thanks"

**Support Issues:**
- Coverage details unclear
- Price not displaying
- Terms link broken

#### Step 3: Checkout
**Where:** Payment collection screen
**What happens:**
- Customer enters payment information
- Reviews total (activity + insurance)
- Completes purchase

**Support Issues:**
- Payment declined
- Slow processing
- Error messages

#### Step 4: Policy Delivery
**Where:** Email and/or SMS
**What happens:**
- Instant policy generation
- Email sent within 30 seconds
- SMS sent with policy link (if phone provided)
- Confirmation displayed on screen

**Support Issues (Most Common):**
- Email not received
- Wrong email address entered
- Spam folder
- SMS not delivered

#### Step 5: Coverage Active
**Where:** Policy is live
**What happens:**
- Coverage begins immediately
- Customer can view policy anytime
- Claims can be filed if needed

**Support Issues:**
- Can't access policy
- Questions about coverage
- Need to file a claim

### User Journey Diagram

```
Customer Arrives → Sees Offer → Chooses Coverage → Pays → Receives Policy → Protected
     │                │              │               │          │              │
  Widget loads    Clear pricing   Quick checkout   Instant    Email/SMS    Coverage active
     ↓                ↓              ↓               ↓          ↓              ↓
 [Support]        [Support]      [Support]       [Support]  [Support]      [Claims]
```

---

## Partner Dashboard

### Dashboard Sections

#### 1. Overview (Home)

**Displays:**
- Today's sales count and revenue
- Week-to-date metrics
- Top-selling products
- Commission earned
- Recent transactions

**Common Support Questions:**
- "Why isn't today's sale showing?" → Real-time sync, may take 5 min
- "Commission looks wrong" → Explain calculation method
- "Can't see historical data" → Check date range filter

#### 2. Sales Report

**Features:**
- Date range selection
- Filter by product, location, status
- Export to CSV/Excel
- Transaction details (customer name, amount, policy ID)

**Common Support Questions:**
- "How do I download sales data?" → Export button top right
- "Missing a transaction" → Check filters and date range
- "Export not working" → Browser popup blocker

#### 3. Commission Tracking

**Shows:**
- Commission rate per product
- Earned vs. pending commissions
- Payment history
- Next payment date

**Common Support Questions:**
- "When do I get paid?" → See payment schedule section
- "Rate seems wrong" → Confirm with account manager
- "Missing payment" → Escalate to finance team

#### 4. Integration Settings

**Contains:**
- Widget embed code
- API keys (hidden by default)
- Webhook URLs
- Connected systems (POS, etc.)
- Test mode toggle

**Common Support Questions:**
- "Lost my API key" → Regenerate (warn: breaks existing integration)
- "Widget code not working" → Check placement, script tag format
- "How to test without charging cards?" → Enable test mode

#### 5. Account Settings

**Includes:**
- Business information
- Contact details
- Notification preferences
- Password management
- User management (multi-user accounts)

**Common Support Questions:**
- "Can't log in" → Password reset process
- "Add a team member" → User management section
- "Change business name" → Requires verification, escalate

---

## Integration Methods

### Method 1: JavaScript Widget (Most Common)

**Best For:** Websites, booking pages, custom platforms

**How It Works:**
```html
<!-- Partner adds this to their checkout page -->
<div id="dei-widget"></div>
<script src="https://widget.dailyeventinsurance.com/v1/widget.js"></script>
<script>
  DEI.init({
    partnerId: 'abc123',
    activityType: 'gym',
    amount: 25.00,
    containerId: 'dei-widget'
  });
</script>
```

**Customizable Options:**
- Activity type
- Pricing display
- Styling (colors, fonts)
- Language
- Success callbacks

**Support Checklist:**
- [ ] Widget appears on page?
- [ ] Correct activity type?
- [ ] Pricing matches expected?
- [ ] No JavaScript errors in console?
- [ ] Test purchase works in test mode?

### Method 2: POS Integration

**Best For:** Gyms, studios using Mindbody, Pike13, Square, etc.

**How It Works:**
- Direct connection to POS system
- Appears as add-on item at checkout
- Syncs automatically
- No code changes needed

**Supported Systems:**
| POS System | Status | Notes |
|------------|--------|-------|
| **Mindbody** | ✅ Full | Most common, well-tested |
| **Pike13** | ✅ Full | Climbing gyms, studios |
| **Square** | ✅ Full | Retail, rentals |
| **ClubReady** | ✅ Full | Gyms, fitness chains |
| **ABC Fitness** | ⚠️ Beta | Limited availability |
| **Custom** | 🔧 API | Case-by-case basis |

**Support Escalation:**
POS integration issues typically require Technical Support (Tier 2).

### Method 3: API Direct

**Best For:** Custom platforms, mobile apps, enterprise partners

**How It Works:**
- RESTful API endpoints
- Partner builds their own UI
- Complete control over experience
- Requires development resources

**Endpoints:**
- `POST /quotes` - Get coverage price
- `POST /policies` - Issue policy
- `GET /policies/:id` - Retrieve policy
- `POST /claims` - File claim (coming soon)

**Support Approach:**
- Provide API documentation link
- Check API key validity
- Review request/response logs
- Escalate complex issues to Technical Support

### Method 4: QR Code / Kiosk

**Best For:** On-site check-in without POS integration

**How It Works:**
- QR code displayed at front desk
- Customer scans with phone
- Opens mobile-optimized purchase flow
- Completes on their device

**Use Cases:**
- Temporary solution during integration
- Small businesses without POS
- Self-check-in facilities

**Support:**
- Generate QR code in partner dashboard
- Print instructions provided
- Can track conversions by QR code

---

## Key Features

### 1. Instant Policy Issuance

**What It Means:**
- Policy generated in < 2 seconds
- No manual review needed
- Immediate email/SMS delivery

**Why It Matters:**
- Customer doesn't wait
- Seamless purchase experience
- Immediate proof of coverage

**Support Impact:**
- Most "didn't get policy" issues are email delivery
- Check spam folders first
- Can resend from dashboard

### 2. Multi-Channel Delivery

**Email:**
- Primary delivery method
- PDF policy attachment
- Includes terms, conditions, ID card
- Tracking pixel confirms delivery

**SMS:**
- Optional (if phone number provided)
- Short link to mobile policy
- Backup to email

**On-Screen:**
- Confirmation message with policy ID
- Option to download immediately
- QR code for mobile save

**Support Tip:** Always check all three delivery methods when troubleshooting "didn't receive policy."

### 3. Real-Time Reporting

**Partners Can See:**
- Sales as they happen (5-min refresh)
- Customer details (name, email, policy ID)
- Revenue and commission calculations
- Policy status (active, expired, claimed)

**Data Retention:**
- Current month: Real-time
- Historical: Archived after 90 days (still accessible)
- Exports: Available anytime

### 4. Commission Automation

**How It Works:**
- Commission calculated on each sale
- Accrues in pending balance
- Paid monthly via ACH
- Statements emailed automatically

**Payment Schedule:**
- **Cutoff:** Last day of month
- **Processing:** 1st week of following month
- **Deposit:** By 7th of month
- **Statement:** Emailed same day as deposit

**Support:**
- Payment inquiries → Partner Success team
- Missing payment → Finance team (escalate)
- Rate questions → Account Manager

### 5. Test Mode

**Purpose:** Allow partners to test without real charges

**Features:**
- Toggle in dashboard
- Uses test credit cards (4242 4242 4242 4242)
- Real policy issuance (marked as TEST)
- All features work identically

**Support Use:**
- Always test in test mode first
- Confirm test policies show "TEST" watermark
- Remind partners to disable before go-live

---

## Data Flow

### Transaction Data Flow

```
Customer Purchase
       ↓
Quote Engine (calculate price)
       ↓
Payment Processor (charge card)
       ↓
Policy Generator (issue policy)
       ↓
Delivery System (email/SMS)
       ↓
┌──────────────┬────────────────┐
│              │                │
Partner      Customer        Database
Dashboard    Inbox          (storage)
```

### Integration Data Exchange

**Partner → Platform:**
- Customer info (name, email, phone)
- Activity details (type, date, duration)
- Transaction amount
- Location/business ID

**Platform → Partner:**
- Quote amount
- Policy ID and status
- Confirmation receipt
- Webhook notifications (if configured)

**Platform → Customer:**
- Policy document (PDF)
- Coverage summary
- Claims instructions
- Customer service contact

---

## Platform Components

### 1. Widget System

**Purpose:** Embed insurance offer on partner websites

**Technology:**
- JavaScript/React
- Responsive design
- Iframe fallback
- Mobile-optimized

**Customization:**
- Theme colors
- Button text
- Layout (inline, modal, sidebar)
- Language (English, Spanish)

### 2. Quote Engine

**Purpose:** Calculate coverage price in real-time

**Factors:**
- Activity type (gym, climbing, rental, etc.)
- Risk level (low, medium, high)
- Coverage amount
- Location/state
- Duration

**Speed:** < 500ms response time

### 3. Payment Processing

**Provider:** Stripe (primary)

**Accepts:**
- Credit cards (Visa, MC, Amex, Discover)
- Debit cards
- Digital wallets (Apple Pay, Google Pay)

**Security:**
- PCI DSS compliant
- 3D Secure support
- Fraud detection

### 4. Policy Management System

**Functions:**
- Policy generation
- Document storage
- Status tracking
- Amendment processing
- Expiration handling

**Storage:** Secure cloud storage, encrypted

### 5. Notification Engine

**Capabilities:**
- Email sending (SendGrid)
- SMS delivery (Twilio)
- Webhook dispatch
- Template management

**Monitoring:**
- Delivery tracking
- Bounce handling
- Spam scoring

### 6. Analytics & Reporting

**Tracks:**
- Conversion rates (offer shown → purchased)
- Revenue by partner, product, location
- Customer demographics
- Support ticket trends

**Dashboards:**
- Partner-facing (limited)
- Internal (comprehensive)
- Executive (high-level KPIs)

---

## Technical Specifications

### Performance Standards

| Metric | Target | Acceptable | Alert |
|--------|--------|------------|-------|
| **Page Load** | < 1s | < 2s | > 3s |
| **Quote Speed** | < 500ms | < 1s | > 2s |
| **Purchase Complete** | < 3s | < 5s | > 10s |
| **Email Delivery** | < 30s | < 2min | > 5min |
| **Dashboard Load** | < 2s | < 4s | > 6s |

### Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Recommended |
| Firefox | 88+ | Fully supported |
| Safari | 14+ | iOS and macOS |
| Edge | 90+ | Chromium-based |
| IE 11 | ❌ | Not supported |

### Mobile Compatibility

- Responsive design (320px - 1920px)
- Touch-optimized
- Native feel on iOS/Android
- Progressive Web App (PWA) capable

---

## Common Platform Questions

### "How secure is the platform?"

**Answer:**
- SOC 2 Type II compliant
- PCI DSS Level 1 certified
- Data encrypted at rest and in transit
- Regular security audits
- GDPR and CCPA compliant

### "What's the uptime?"

**Answer:**
- 99.9% uptime SLA
- Redundant infrastructure
- Automatic failover
- Status page: status.dailyeventinsurance.com

### "Can I customize the look?"

**Answer (Widget):**
- Yes - colors, fonts, button text
- Configuration in dashboard
- Advanced customization via CSS

**Answer (API):**
- Complete control (build your own UI)

### "How do I track conversions?"

**Answer:**
- Built-in analytics in dashboard
- Conversion rate = (policies sold / offers shown)
- Can integrate with Google Analytics
- Webhook events for custom tracking

### "What if a customer needs to cancel?"

**Answer:**
- Cancellation policy in terms
- Typically no refunds (instant coverage)
- Special cases → Claims team
- Not handled through support (escalate)

---

## Next Steps

Now that you understand the platform:

1. ✅ Complete this document
2. → Continue to [Chat Widget Usage](./03-chat-widget-usage.md)
3. Explore the partner dashboard (demo account)
4. Watch the integration demo video
5. Review one real support ticket end-to-end

---

## Quick Reference Card

### Platform URLs
- **Customer Purchase:** dailyeventinsurance.com
- **Partner Portal:** partners.dailyeventinsurance.com
- **Admin:** admin.dailyeventinsurance.com
- **Status:** status.dailyeventinsurance.com

### Support Access
- **Partner Portal:** Request temporary access from Team Lead
- **Admin Portal:** Use your @dailyeventinsurance.com credentials
- **Test Mode:** Enable in dashboard → Settings → Test Mode

### Key Metrics
- Quote Speed: < 500ms
- Email Delivery: < 30s
- Platform Uptime: 99.9%
- Commission Payout: Monthly, by 7th

---

**Document maintained by Daily Event Insurance Training Team**
