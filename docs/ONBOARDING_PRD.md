# Daily Event Insurance - Partner Onboarding System PRD

**Version:** 2.0.0
**Last Updated:** January 11, 2026
**Status:** 75% Complete

---

## Executive Summary

The Partner Onboarding System enables businesses to become insurance distribution partners for Daily Event Insurance. Partners can offer accident and medical coverage to their customers (gym members, event participants, etc.) and earn 40% commission on each policy sold.

---

## User Journey

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. CUSTOMIZE   │ ──▶ │  2. BUSINESS    │ ──▶ │  3. INTEGRATION │
│  Coverage       │     │  Information    │     │  Selection      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                                │
         ▼                                                ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  4. DOCUMENT    │ ──▶ │  5. POST-SIGN   │ ──▶ │  6. DASHBOARD   │
│  Signing        │     │  Automation     │     │  Access         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Milestones

### M1: Core Onboarding Flow ✅ COMPLETE

**Features:**
- Multi-step form with progress tracking
- Product selection and pricing preview
- Business information collection
- Integration method selection (Widget/API/Manual)

### M2: Document Signing Flow ✅ COMPLETE

**Features:**
- 6 document types (4 required, 2 optional)
- Digital signature capture (text & drawn)
- Document viewer with variable substitution
- Progress tracking and auto-advance

**Documents:**
| Document | Type | Required |
|----------|------|----------|
| Partner Agreement | partner_agreement | Yes |
| Joint Marketing Agreement | joint_marketing_agreement | Yes |
| Mutual NDA | mutual_nda | Yes |
| Sponsorship Agreement | sponsorship_agreement | Yes |
| W-9 Tax Form | w9 | No |
| Direct Deposit Form | direct_deposit | No |

### M3: AI Integration Assistant ✅ COMPLETE

**Features:**
- Claude-powered chat assistant
- 7 platform integrations (Mindbody, Zen Planner, Shopify, etc.)
- Code snippet generation
- Platform detection and auto-configuration

### M4: Post-Signing Automation ⚠️ IN PROGRESS

**Features to Implement:**

#### F4.1 Email Confirmation (PENDING)
- Send branded confirmation email after signing
- Include list of signed documents
- Attach PDF copies of documents

#### F4.2 PDF Generation (PENDING)
- Generate PDF from signed documents
- Embed signature images
- Professional formatting with branding

### M5: Testing & QA ⚠️ IN PROGRESS

**Current Coverage:**
- ✅ Document signing page: 33+ tests
- ❌ Onboarding form: No tests
- ❌ Integration assistant: No tests
- ⚠️ E2E: Basic flow only

---

## Technical Architecture

### API Routes

```
/api/onboarding/
├── ai-assistant/          # Claude chat endpoint
└── scrape-website/        # FireCrawl auto-fill

/api/documents/
├── templates/             # Get/create templates
├── sign/                  # Record signatures
├── confirmation-email/    # Send confirmation (TODO)
└── pdf/                   # Generate PDFs (TODO)

/api/partner/              # Partner CRUD
```

### Database Schema

Key tables:
- `partners` - Partner profiles
- `documentTemplates` - Admin-managed templates
- `partnerDocuments` - Signed document records
- `microsites` - Partner branded websites

---

## Implementation Tasks

### High Priority

| Task ID | Description | File | Status |
|---------|-------------|------|--------|
| T4.1.1 | Email confirmation route | app/api/documents/confirmation-email/route.ts | Pending |
| T4.1.2 | Email template | lib/email/templates/document-confirmation.tsx | Pending |
| T4.2.1 | PDF generation | app/api/documents/pdf/route.ts | Pending |
| T5.2.1 | Form tests | app/onboarding/onboarding-form.test.tsx | Pending |

### Medium Priority

| Task ID | Description | File | Status |
|---------|-------------|------|--------|
| T5.3.1 | Assistant tests | components/onboarding/IntegrationAssistant.test.tsx | Pending |
| T5.4.1 | E2E expansion | e2e/onboarding-full-flow.spec.ts | Pending |

---

## Success Metrics

- **Conversion Rate:** 80%+ of started onboardings complete
- **Time to Complete:** < 10 minutes average
- **Document Signing Rate:** 95%+ sign all required documents
- **Support Tickets:** < 5% of partners need help

---

## Dependencies

```json
{
  "resend": "Email service",
  "@react-pdf/renderer": "PDF generation",
  "@anthropic-ai/sdk": "AI assistant",
  "firecrawl": "Website scraping",
  "drizzle-orm": "Database"
}
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Email deliverability | Use Resend with SPF/DKIM |
| PDF performance | Generate async, cache results |
| AI rate limits | Mock fallback, rate limiting |
