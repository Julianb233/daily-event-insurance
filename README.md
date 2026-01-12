# Daily Event Insurance

**B2B Insurance Broker Platform** - A broker/affiliate platform enabling gyms, climbing facilities, and rental businesses to offer same-day insurance coverage to their members and earn commissions.

> A [HiQOR](https://hiqor.com) Company

---

## Business Model

Daily Event Insurance is a **broker/affiliate platform** — NOT an insurance provider.

| Role | Description |
|------|-------------|
| **Partners** | Businesses (gyms, climbing gyms, adventure sports, rentals) who refer customers |
| **Revenue** | Partners earn commission on every policy sold through their referrals |
| **Insurance Carriers** | Actual insurance provided by carrier partners |
| **Claims** | Handled directly by insurance carriers — NOT managed in this platform |

---

## Core Features

### 1. Partner Onboarding
- Partner signs up and completes business information
- Signs Marketing Agreement via DocuSign
- W-9 and Direct Deposit collected for payment setup (separate from activation)

### 2. Automatic Microsite Generation ⭐
When a partner signs the **Marketing Agreement**, the system automatically:
1. Extracts brand assets (logo, colors) from partner's website via **Brandfetch API**
2. Generates a branded microsite at `/p/{partner-slug}`
3. Includes lead capture form for customer information
4. Notifies partner their page is ready

### 3. Lead Management
- Customer leads from microsites populate partner dashboard
- Track lead status: New → Contacted → Quoted → Converted
- Link leads to quotes and policies

### 4. Commission Tracking
- Tiered commission structure (Bronze → Platinum)
- Monthly earnings dashboard
- Payout management for admins

### 5. Admin Dashboard
- Partner management and approval
- Lead pipeline visibility
- Microsite management
- Commission payouts
- Reports and analytics

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 (App Router) | Full-stack framework |
| React | 19 | UI components |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4 | Styling |
| Framer Motion | 12 | Animations |
| Drizzle ORM | - | Database ORM |
| PostgreSQL (Neon) | - | Database |
| Supabase | - | Auth & Storage |
| NextAuth.js | - | Authentication |
| GoHighLevel | - | CRM & Document Signing |
| Brandfetch | - | Brand asset extraction |

---

## Project Structure

```
daily-event-insurance/
├── app/                          # Next.js App Router
│   ├── (admin)/admin/           # Admin dashboard pages
│   ├── (partner)/partner/       # Partner dashboard pages
│   ├── p/[slug]/                # Partner microsites (public)
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin APIs
│   │   ├── partner/             # Partner APIs
│   │   ├── microsite/           # Microsite APIs
│   │   └── webhooks/            # Webhook handlers
│   └── ...                      # Public pages
├── components/
│   ├── admin/                   # Admin UI components
│   ├── partner/                 # Partner UI components
│   ├── microsite/               # Microsite components
│   └── ...                      # Shared components
├── lib/
│   ├── db/                      # Database schema & client
│   ├── ghl.ts                   # GoHighLevel integration
│   ├── brandfetch.ts            # Brandfetch API client
│   ├── microsite/               # Microsite generation
│   └── ...                      # Utilities
├── docs/                        # Documentation
│   ├── PRD-PARTNER-MICROSITE.md # Microsite feature PRD
│   ├── GHL-INTEGRATION-README.md # GHL integration guide
│   └── va-implementation/       # VA task documentation
└── drizzle/                     # Database migrations
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- PostgreSQL database (Neon recommended)
- Supabase project

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://dailyeventinsurance.com

# GoHighLevel
GHL_API_KEY=...
GHL_LOCATION_ID=...

# Brandfetch
BRANDFETCH_API_KEY=...

# Microsite
NEXT_PUBLIC_MICROSITE_BASE_URL=https://dailyeventinsurance.com/p
```

### Installation

```bash
# Clone the repository
git clone https://github.com/ai-acrobatics/daily-event-insurance.git
cd daily-event-insurance

# Install dependencies
pnpm install

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

### Build & Deploy

```bash
# Production build
pnpm build

# Type check
pnpm typecheck

# Deploy to Vercel
vercel --prod
```

---

## Documentation

### Product Requirements Documents
- [PRD: Partner Microsite Generation](./docs/PRD-PARTNER-MICROSITE.md) - Core microsite feature
- [PRD: Dashboard Enhancements](./docs/PRD-DASHBOARD-ENHANCEMENTS.md) - Admin & Partner dashboards

### Integration Guides
- [GHL Integration](./docs/GHL-INTEGRATION-README.md) - GoHighLevel CRM setup
- [VA Implementation](./docs/va-implementation/README.md) - Virtual assistant tasks

### API Documentation
- [Partner API Reference](./app/api/partner/README.md)
- [Admin API Reference](./app/api/README.md)

---

## Key Workflows

### Partner Onboarding Flow
```
Sign Up → Onboarding Form → Sign Marketing Agreement → Microsite Generated → Active Partner
                                      ↓
                            (Later) W-9 + Direct Deposit → Payment Setup Complete
```

### Lead to Policy Flow
```
Customer visits microsite → Fills lead form → Lead created in partner dashboard
         ↓
    Gets quote → Purchases policy → Lead status: Converted → Commission earned
```

---

## Implementation Status

### Completed ✅
- Partner & Admin authentication (NextAuth.js)
- Database schema (Drizzle ORM)
- Partner dashboard (earnings, quotes, policies, analytics)
- Admin dashboard (partners, leads, payouts, commission tiers)
- GHL integration framework
- Quote engine with pricing

### In Progress 🔄
- Partner microsite generation
- Brandfetch integration
- Lead capture system
- Document signing automation

### Planned 📋
- Admin reports with export
- Widget customization for partners
- API key management for API partners

---

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Teal | `#14B8A6` | Buttons, accents, links |
| Dark Teal | `#0D9488` | Hover states |
| Text Primary | `#1E293B` | Headings |
| Text Secondary | `#64748B` | Body text |

---

## Target Markets

- **Gyms & Fitness Centers** - Day pass insurance
- **Rock Climbing Facilities** - Activity coverage
- **Equipment Rentals** - Bikes, kayaks, sporting goods
- **Adventure Sports** - Zip lines, obstacle courses

---

## Deployment

**Production URL:** https://dailyeventinsurance.com  
**Hosting:** Vercel  
**Database:** Neon PostgreSQL  
**Storage:** Supabase

---

## License

Proprietary - Daily Event Insurance / HiQOR

---

## Contact

- **Website**: [dailyeventinsurance.com](https://dailyeventinsurance.com)
- **Parent Company**: [HiQOR](https://hiqor.com)
