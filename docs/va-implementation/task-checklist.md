# VA Task Master Checklist

Complete task checklist for Daily Event Insurance project implementation.

**Last Updated:** December 2024

---

## How to Use This Document

1. Check this document daily for assigned tasks
2. Update status as you work:
   - ☐ = Pending
   - 🔄 = In Progress
   - ✅ = Complete
   - ⚠️ = Blocked
3. Add notes in the Notes column if issues arise
4. Reference the detailed documentation for each task

---

## Priority Legend

| Priority | Meaning |
|----------|---------|
| 🔴 HIGH | Critical path - do first |
| 🟡 MEDIUM | Important - do this week |
| 🟢 LOW | Can defer if needed |

---

## Phase 1: GoHighLevel Setup 🔴 HIGH

| # | Task | Reference Doc | Est. Time | Status | Assignee | Notes |
|---|------|---------------|-----------|--------|----------|-------|
| 1.1 | Create custom fields | `gohighlevel/04-setup/custom-fields.md` | 30 min | ☐ | | |
| 1.2 | Set up all tags | `gohighlevel/04-setup/custom-fields.md` | 15 min | ☐ | | |
| 1.3 | Create Partner Acquisition pipeline | `gohighlevel/01-workflows/new-partner-inquiry.md` | 20 min | ☐ | | |
| 1.4 | Create Onboarding pipeline | `gohighlevel/01-workflows/onboarding-sequence.md` | 20 min | ☐ | | |
| 1.5 | Create Welcome Series emails (5) | `gohighlevel/02-emails/welcome-series.md` | 45 min | ☐ | | |
| 1.6 | Create Onboarding emails (6) | `gohighlevel/02-emails/onboarding-emails.md` | 45 min | ☐ | | |
| 1.7 | Create Initial Outreach emails (5) | `gohighlevel/02-emails/initial-outreach.md` | 45 min | ☐ | | |
| 1.8 | Build New Partner Inquiry workflow | `gohighlevel/01-workflows/new-partner-inquiry.md` | 45 min | ☐ | | |
| 1.9 | Build Onboarding Sequence workflow | `gohighlevel/01-workflows/onboarding-sequence.md` | 1 hour | ☐ | | |
| 1.10 | Build Initial Outreach workflow | `gohighlevel/02-emails/initial-outreach.md` | 45 min | ☐ | | |
| 1.11 | Create Partner Inquiry form | `gohighlevel/04-setup/forms.md` | 20 min | ☐ | | |
| 1.12 | Create Partner Application form | `gohighlevel/04-setup/forms.md` | 30 min | ☐ | | |
| 1.13 | Create remaining forms (3) | `gohighlevel/04-setup/forms.md` | 30 min | ☐ | | |
| 1.14 | End-to-end workflow testing | `va-implementation/gohighlevel-tasks.md` | 2 hours | ☐ | | |

**Phase 1 Subtotal:** ~9 hours

---

## Phase 2: Image Assets 🔴 HIGH

| # | Task | Reference Doc | Est. Time | Status | Assignee | Notes |
|---|------|---------------|-----------|--------|----------|-------|
| 2.1 | Generate hero image | `va-implementation/image-generation-prompts.md` | 30 min | ☐ | | Use Nana Banana Pro |
| 2.2 | Generate gym icon | `va-implementation/image-generation-prompts.md` | 15 min | ☐ | | |
| 2.3 | Generate climbing icon | `va-implementation/image-generation-prompts.md` | 15 min | ☐ | | |
| 2.4 | Generate rental icon | `va-implementation/image-generation-prompts.md` | 15 min | ☐ | | |
| 2.5 | Generate adventure icon | `va-implementation/image-generation-prompts.md` | 15 min | ☐ | | |
| 2.6 | Generate Step 1 illustration | `va-implementation/image-generation-prompts.md` | 20 min | ☐ | | |
| 2.7 | Generate Step 2 illustration | `va-implementation/image-generation-prompts.md` | 20 min | ☐ | | |
| 2.8 | Generate Step 3 illustration | `va-implementation/image-generation-prompts.md` | 20 min | ☐ | | |
| 2.9 | Generate OG image | `va-implementation/image-generation-prompts.md` | 20 min | ☐ | | |
| 2.10 | Generate favicon set | `va-implementation/image-generation-prompts.md` | 20 min | ☐ | | |
| 2.11 | Generate trust badges (3) | `va-implementation/image-generation-prompts.md` | 30 min | ☐ | | |
| 2.12 | Generate email headers (2) | `va-implementation/image-generation-prompts.md` | 20 min | ☐ | | |
| 2.13 | Optimize all images for web | - | 30 min | ☐ | | Compress without quality loss |
| 2.14 | Upload to /public/images/ | - | 15 min | ☐ | | |
| 2.15 | Remove old Wizard of AI images | `/IMAGES-NEEDED.md` | 15 min | ☐ | | |

**Phase 2 Subtotal:** ~5 hours

---

## Phase 3: Website Updates 🟡 MEDIUM

| # | Task | Reference Doc | Est. Time | Status | Assignee | Notes |
|---|------|---------------|-----------|--------|----------|-------|
| 3.1 | Update hero section copy | `components/hero-section.tsx` | 30 min | ☐ | | Revenue-focused messaging |
| 3.2 | Update footer copy | `components/footer.tsx` | 15 min | ☐ | | |
| 3.3 | Update GetStarted section | `app/page.tsx` | 20 min | ☐ | | Add urgency/social proof |
| 3.4 | Update image imports | Various components | 30 min | ☐ | | After images uploaded |
| 3.5 | Mobile responsiveness check | - | 1 hour | ☐ | | Test all breakpoints |
| 3.6 | Cross-browser testing | - | 1 hour | ☐ | | Chrome, Firefox, Safari, Edge |
| 3.7 | Accessibility check | - | 30 min | ☐ | | Alt text, contrast, etc. |

**Phase 3 Subtotal:** ~4 hours

---

## Phase 4: Integration & Launch 🟡 MEDIUM

| # | Task | Reference Doc | Est. Time | Status | Assignee | Notes |
|---|------|---------------|-----------|--------|----------|-------|
| 4.1 | Set up Vercel project | - | 30 min | ☐ | | |
| 4.2 | Configure environment variables | - | 15 min | ☐ | | |
| 4.3 | Connect custom domain | - | 15 min | ☐ | | If domain ready |
| 4.4 | Set up Google Analytics 4 | - | 30 min | ☐ | | |
| 4.5 | Embed GHL form on website | `gohighlevel/04-setup/forms.md` | 20 min | ☐ | | |
| 4.6 | Test form → GHL workflow | - | 30 min | ☐ | | End-to-end |
| 4.7 | SSL certificate verification | - | 10 min | ☐ | | |
| 4.8 | Final QA checklist | - | 2 hours | ☐ | | Full site review |
| 4.9 | Launch approval | - | - | ☐ | | Owner sign-off |

**Phase 4 Subtotal:** ~4.5 hours

---

## Phase 5: Documentation & Training 🟢 LOW

| # | Task | Reference Doc | Est. Time | Status | Assignee | Notes |
|---|------|---------------|-----------|--------|----------|-------|
| 5.1 | Create partner FAQ document | - | 1 hour | ☐ | | |
| 5.2 | Create staff training guide | - | 1 hour | ☐ | | |
| 5.3 | Record Loom walkthrough | - | 30 min | ☐ | | Optional |
| 5.4 | Document GHL admin procedures | - | 30 min | ☐ | | |

**Phase 5 Subtotal:** ~3 hours

---

## Total Estimated Time

| Phase | Hours |
|-------|-------|
| Phase 1: GHL Setup | 9 hours |
| Phase 2: Image Assets | 5 hours |
| Phase 3: Website Updates | 4 hours |
| Phase 4: Integration | 4.5 hours |
| Phase 5: Documentation | 3 hours |
| **TOTAL** | **25.5 hours** |

---

## Notes Section

Use this space to document issues, decisions, or changes:

| Date | Note | Author |
|------|------|--------|
| | | |
| | | |
| | | |

---

## Completion Sign-Off

| Phase | Completed By | Date | Verified By |
|-------|--------------|------|-------------|
| Phase 1: GHL | | | |
| Phase 2: Images | | | |
| Phase 3: Website | | | |
| Phase 4: Integration | | | |
| Phase 5: Documentation | | | |
| **FINAL SIGN-OFF** | | | |

