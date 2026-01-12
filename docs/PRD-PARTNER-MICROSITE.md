# Product Requirements Document: Partner Microsite Generation

**Version:** 1.0  
**Date:** January 12, 2026  
**Project:** Daily Event Insurance  
**Priority:** Critical - Core Feature  

---

## Executive Summary

When a partner (business owner) completes signing the required documents (Marketing Agreement, W-9, Direct Deposit), the system automatically generates a branded microsite. This microsite uses the partner's branding (logo, colors, typography) pulled from their website URL via Brandfetch API, and includes a lead capture form for their customers.

---

## Business Model Context

- **Partners** = Businesses (gyms, climbing gyms, adventure sports, rentals) who refer their customers
- Partners earn **commission** on insurance policies sold through their microsite
- **Microsites** are the primary way partners drive customer conversions
- Customer leads from microsites populate the partner's dashboard for tracking

---

## 1. Document Signing Flow

### Documents Overview
| Document | Purpose | Required for Microsite |
|----------|---------|------------------------|
| **Marketing Agreement** | Partnership terms, branding rights | ✅ Yes - Triggers microsite |
| **W-9 Tax Form** | IRS tax identification | ❌ No - For payment setup |
| **Direct Deposit Authorization** | Commission payments | ❌ No - For payment setup |

### Trigger Condition
```
IF agreementSigned = true
THEN trigger_microsite_generation(partnerId)
```

**Note:** W-9 and Direct Deposit are collected separately for commission payment setup, but do NOT block microsite generation.

---

## 2. Microsite Generation Flow

### Step 1: Brand Extraction (Brandfetch API)
When all documents are signed:
1. Take partner's website URL (from onboarding form or business website field)
2. Call Brandfetch API to extract:
   - **Logo** (primary logo, icon)
   - **Colors** (primary color hex, secondary colors)
   - **Typography** (font family if available)
   - **Company name** (verified)

### Step 2: Microsite Generation
1. Generate unique microsite URL: `https://dailyeventinsurance.com/p/{partner-slug}`
2. Create microsite with:
   - Partner logo
   - Partner brand colors
   - Partner name
   - Insurance product offerings
   - Lead capture form

### Step 3: Database Updates
1. Save microsite URL to partner record
2. Save extracted brand assets (logo URL, colors)
3. Mark microsite as "active"
4. Notify partner via email

---

## 3. Microsite Features

### 3.1 Header Section
- Partner logo (from Brandfetch)
- "Powered by Daily Event Insurance" badge
- Partner business name

### 3.2 Hero Section
- Headline: "Protect Your [Event Type] Experience"
- Subheadline: "Quick, affordable insurance from {Partner Name}"
- CTA button: "Get Covered Now"

### 3.3 Product Cards
- Liability Coverage ($4.99)
- Equipment Protection ($X.XX)
- Cancellation Coverage ($X.XX)
- Each with quick description and "Add to Quote" button

### 3.4 Lead Capture Form
**Required Fields:**
| Field | Type | Validation |
|-------|------|------------|
| First Name | Text | Required, min 2 chars |
| Last Name | Text | Required, min 2 chars |
| Email Address | Email | Required, valid email |
| Address | Text | Required |
| Phone | Tel | Optional |

**On Submit:**
1. Validate all fields
2. Create lead record linked to partner
3. Redirect to quote page with pre-filled info
4. Send confirmation email to customer
5. Notify partner (if notifications enabled)

### 3.5 Footer
- Trust badges (Licensed, Secure, etc.)
- Links to Terms, Privacy
- Partner contact info (optional)

---

## 4. Technical Architecture

### 4.1 New Database Fields (partners table)
```sql
ALTER TABLE partners ADD COLUMN website_url TEXT;
ALTER TABLE partners ADD COLUMN microsite_slug TEXT UNIQUE;
ALTER TABLE partners ADD COLUMN microsite_url TEXT;
ALTER TABLE partners ADD COLUMN microsite_active BOOLEAN DEFAULT false;
ALTER TABLE partners ADD COLUMN brand_logo_url TEXT;
ALTER TABLE partners ADD COLUMN brand_primary_color TEXT;
ALTER TABLE partners ADD COLUMN brand_secondary_color TEXT;
ALTER TABLE partners ADD COLUMN brand_font_family TEXT;
ALTER TABLE partners ADD COLUMN microsite_generated_at TIMESTAMP;
```

### 4.2 New Database Table: partner_leads
```sql
CREATE TABLE partner_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  source TEXT DEFAULT 'microsite',
  status TEXT DEFAULT 'new', -- new, contacted, quoted, converted, lost
  quote_id UUID REFERENCES quotes(id),
  policy_id UUID REFERENCES policies(id),
  converted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.3 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/microsite/generate` | POST | Trigger microsite generation |
| `/api/microsite/[slug]` | GET | Get microsite data |
| `/api/microsite/[slug]/lead` | POST | Submit lead form |
| `/api/brandfetch` | POST | Fetch brand data from URL |
| `/api/partner/leads` | GET | List partner's leads |
| `/api/partner/leads/[id]` | GET | Get lead detail |

### 4.4 Pages

| Route | Purpose |
|-------|---------|
| `/p/[slug]` | Partner microsite (public) |
| `/partner/leads` | Partner's lead management |
| `/admin/microsites` | Admin microsite management |

---

## 5. Brandfetch Integration

### API Details
- **API:** Brandfetch (https://brandfetch.com)
- **Endpoint:** `GET https://api.brandfetch.io/v2/brands/{domain}`
- **Authentication:** API Key in header

### Request Example
```typescript
const response = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
  headers: {
    'Authorization': `Bearer ${BRANDFETCH_API_KEY}`
  }
});
```

### Response Structure
```json
{
  "name": "Peak Fitness",
  "domain": "peakfitness.com",
  "logos": [
    { "type": "logo", "theme": "light", "formats": [{ "src": "https://...", "format": "png" }] },
    { "type": "icon", "theme": "light", "formats": [{ "src": "https://...", "format": "png" }] }
  ],
  "colors": [
    { "hex": "#FF5733", "type": "accent" },
    { "hex": "#333333", "type": "dark" }
  ],
  "fonts": [
    { "name": "Roboto", "type": "title" }
  ]
}
```

### Fallback Handling
If Brandfetch fails:
1. Use partner's uploaded logo (if available)
2. Use default Daily Event Insurance branding
3. Allow partner to customize later in settings

---

## 6. User Stories (15 Stories)

### Story 1: The Complete Onboarding
*Sarah owns Peak Fitness gym. She signs up on Daily Event Insurance, completes the onboarding form with her website URL "peakfitness.com", then signs the Marketing Agreement, W-9, and Direct Deposit forms via DocuSign. Within 5 minutes of signing the last document, she receives an email: "Your branded insurance page is ready!" She clicks the link and sees her gym's logo, colors, and name on a professional insurance landing page at dailyeventinsurance.com/p/peak-fitness.*

**Tests:**
- Documents signed triggers generation
- Brandfetch extracts logo and colors
- Microsite URL is generated with slug
- Email notification sent to partner
- Microsite displays partner branding

### Story 2: Customer Lead Capture
*Mike is a member at Peak Fitness. He sees a poster about daily insurance and scans the QR code leading to peakfitness's microsite. He fills in his name (Mike Johnson), email (mike@email.com), and address (123 Main St). When he submits, he's redirected to a quote page with his info pre-filled. Meanwhile, Sarah sees a new lead appear in her partner dashboard.*

**Tests:**
- Form validation works
- Lead created in database
- Partner ID linked correctly
- Redirect to quote page works
- Partner dashboard shows new lead

### Story 3: Partner Views Their Leads
*Sarah logs into her partner dashboard and navigates to "Leads." She sees a table with all customers who submitted forms on her microsite: Mike Johnson (new), Jane Doe (quoted), Tom Brown (converted). She can see each lead's status and when they submitted. She clicks on Mike to see his full details.*

**Tests:**
- Leads page lists all partner leads
- Status filtering works
- Lead detail view shows all info
- Leads are scoped to logged-in partner

### Story 4: Failed Brand Extraction Fallback
*Tom runs a small kayak rental business without a website. During onboarding, he leaves the website field blank. When his documents are signed, the system can't extract branding from Brandfetch. Instead, his microsite is generated with Daily Event Insurance default branding and his business name "Tom's Kayak Rentals." He receives an email suggesting he upload his logo in settings.*

**Tests:**
- Generation proceeds without website
- Default branding applied
- Business name still displayed
- Email prompts logo upload
- Partner can customize later

### Story 5: Microsite URL Conflict Resolution
*Two gyms sign up: "Fitness First" and "Fitness First Chicago." The system generates slug "fitness-first" for the first one. When the second signs up, the system detects the conflict and generates "fitness-first-chicago" instead.*

**Tests:**
- Slug generation from business name
- Conflict detection works
- Unique slug generated
- Both microsites accessible

### Story 6: Admin Microsite Overview
*Admin Lisa opens the admin dashboard and clicks "Microsites." She sees a list of all partner microsites with their status (active, pending, disabled), creation date, and lead count. She can click to preview any microsite or disable one if needed.*

**Tests:**
- Admin can view all microsites
- Status indicators correct
- Lead count accurate
- Preview links work
- Disable functionality works

### Story 7: Lead to Quote Conversion
*Mike (from Story 2) receives a quote for $4.99 liability coverage. He completes the purchase. Sarah sees Mike's status change from "new" to "converted" in her leads dashboard. The policy ID is linked to the lead record.*

**Tests:**
- Quote linked to lead
- Policy linked on purchase
- Status updates to "converted"
- Commission calculated correctly

### Story 8: Partner Customizes Microsite Colors
*Sarah doesn't love the green that Brandfetch extracted. She goes to Partner Settings > Microsite and changes her primary color from #00FF00 to #FF5733. When she saves, her microsite immediately reflects the new color.*

**Tests:**
- Color picker in settings
- Save updates database
- Microsite reflects change
- No regeneration needed

### Story 9: QR Code for Microsite
*Sarah wants to print a flyer for her gym. She goes to Partner Settings > Microsite and clicks "Download QR Code." A QR code image downloads that, when scanned, opens her microsite URL.*

**Tests:**
- QR code generates correctly
- QR encodes correct URL
- Downloadable as PNG
- Scannable on mobile

### Story 10: Lead Email Notification
*Sarah has enabled "New Lead" email notifications. When Mike submits the form on her microsite, she immediately receives an email: "New lead from your insurance page! Mike Johnson submitted at 2:30 PM. View in dashboard: [link]"*

**Tests:**
- Notification preference respected
- Email sent on form submit
- Contains lead details
- Dashboard link works

### Story 11: Mobile Responsive Microsite
*Mike visits Sarah's microsite on his iPhone. The page renders perfectly - logo sized appropriately, form fields are full-width and easy to tap, buttons are large enough to press. He completes the form without any issues.*

**Tests:**
- Responsive design works
- Form usable on mobile
- Images scale correctly
- Buttons have touch targets

### Story 12: Microsite Analytics
*Sarah wants to know how many people visit her microsite. In her dashboard, she sees: "Microsite Views: 347 | Form Submissions: 42 | Conversion Rate: 12.1%" for the last 30 days.*

**Tests:**
- Page views tracked
- Form submissions counted
- Conversion rate calculated
- Date range filtering works

### Story 13: Regenerate Microsite
*Sarah's gym rebranded with a new logo and colors. She goes to Settings > Microsite and clicks "Regenerate from Website." The system calls Brandfetch again with her website URL and updates her microsite with the new branding.*

**Tests:**
- Regenerate button works
- Brandfetch called again
- New assets saved
- Microsite updated

### Story 14: Disabled Partner Microsite
*Tom's account is suspended by admin for non-compliance. His microsite at /p/toms-kayak-rentals now shows a message: "This page is temporarily unavailable. Contact support for assistance." Customers can't submit forms.*

**Tests:**
- Suspended partner detected
- Friendly message displayed
- Form submission blocked
- Admin can re-enable

### Story 15: Webhook Triggers Generation
*The DocuSign webhook fires when the Marketing Agreement is signed. The webhook handler checks the agreementSigned flag. When true, it calls the microsite generation service. Within 30 seconds, the microsite is live and the partner is notified. W-9 and Direct Deposit are collected later for payment setup.*

**Tests:**
- Webhook receives Marketing Agreement signed event
- agreementSigned flag checked
- Generation triggered automatically
- Timing under 30 seconds
- Notification sent
- W-9/DD don't block generation

---

## 7. Implementation Phases

### Phase 1: Database & API Foundation (Sprint 1)
- Add microsite fields to partners table
- Create partner_leads table
- Create Brandfetch integration service
- Create microsite generation service

### Phase 2: Microsite Page & Form (Sprint 1-2)
- Create /p/[slug] dynamic route
- Build microsite React components
- Implement lead capture form
- Create lead submission API

### Phase 3: Partner Dashboard Integration (Sprint 2)
- Create partner leads page
- Add lead detail view
- Add microsite settings page
- Implement QR code generation

### Phase 4: Admin & Automation (Sprint 2-3)
- Create admin microsites page
- Integrate with document signing webhook
- Add email notifications
- Implement analytics tracking

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Microsite generation time | < 30 seconds |
| Lead form completion rate | > 60% |
| Partner lead visibility | Real-time |
| Brandfetch success rate | > 90% |
| Mobile form completion | > 50% |

---

## 9. Dependencies

- **Brandfetch API** - Brand extraction service
- **Supabase Storage** - Logo image storage
- **DocuSign Webhook** - Trigger for generation
- **Email Service** - Partner notifications

---

## 10. Environment Variables Required

```bash
BRANDFETCH_API_KEY=xxx
NEXT_PUBLIC_MICROSITE_BASE_URL=https://dailyeventinsurance.com/p
```

---

## 11. Out of Scope (Future)

- Custom domain mapping (partner.theirgym.com)
- A/B testing microsite variants
- Multi-language microsites
- Advanced analytics (heatmaps, etc.)

---

*Document created for Ralph multi-agent implementation*
