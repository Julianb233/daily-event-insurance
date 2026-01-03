# Technical Deployment Reference

**Project:** Daily Event Insurance
**Framework:** Next.js 16.1.0
**Runtime:** Node.js (Vercel)
**Database:** Neon PostgreSQL
**Package Manager:** npm/pnpm

---

## Build Information

### Build Command
```bash
npm run build
```

### Build Output
```
Framework: Next.js 16.1.0 (Turbopack)
Build Time: 7.1 seconds
Compiler: Turbopack (fast incremental builds)
Output: Static/Server rendered HTML + JS chunks
```

### Routes Generated (93 Total)

**Static Routes (prerendered):** 65
- `/` (homepage)
- `/about`, `/pricing`, `/terms`, `/privacy`
- `/industries/*` (16 industry-specific pages)
- `/categories/*` (4 category pages)
- `/carriers/*` (4 carrier pages)
- `/landing/*` (5 landing pages)
- And many more...

**Dynamic Routes (server-rendered on demand):** 28
- `/api/*` (20+ API routes)
- `/onboarding` (user onboarding flow)
- `/opengraph-image` (dynamic OG images)
- And more...

**Edge/Proxy Routes:** 1
- Middleware (proxy configuration)

---

## Security Configuration

### Content Security Policy (CSP)
```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app https://va.vercel-scripts.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com data:
img-src 'self' data: blob: https: http:
connect-src 'self' https: wss:
frame-src 'self' https://vercel.live
object-src 'none'
base-uri 'self'
form-action 'self'
```

### Additional Security Headers
- **X-Content-Type-Options:** nosniff
- **X-Frame-Options:** DENY
- **X-XSS-Protection:** 1; mode=block
- **Referrer-Policy:** strict-origin-when-cross-origin
- **Permissions-Policy:** camera=(), microphone=(), geolocation=()

---

## Cron Jobs Configuration

### Scheduled Task: Email Automation
```json
{
  "path": "/api/cron/email",
  "schedule": "*/5 * * * *"
}
```

**Details:**
- Runs every 5 minutes
- Endpoint: `/api/cron/email`
- Requires: `CRON_SECRET` environment variable
- Purpose: Send automated emails and notifications

**Monitoring:**
- Check Vercel dashboard: Crons section
- Look for execution logs
- Monitor for failures/timeouts

---

## Environment Variables - Detailed Breakdown

### Database (Required)
```
DATABASE_URL                    # Primary connection
DATABASE_URL_UNPOOLED          # For migrations
POSTGRES_URL                    # Alias
POSTGRES_URL_NON_POOLING       # Non-pooled connection
POSTGRES_URL_NO_SSL            # Development fallback
POSTGRES_USER                   # Database user
POSTGRES_PASSWORD              # Database password
POSTGRES_HOST                   # Database host
POSTGRES_DATABASE              # Database name
PGDATABASE, PGHOST, PGUSER, PGPASSWORD  # Alternative names
```

**Source:** Neon Dashboard > Project > Connection String

### Authentication (Required)
```
AUTH_SECRET                     # Generate: openssl rand -base64 32
NEXTAUTH_URL                    # Production URL (https://yourdomain.com)
NEXT_PUBLIC_AUTH_SECRET         # Optional public indicator
```

**Source:** Generate locally, store in Vercel Secrets

### File Storage - Supabase (Required if using files)
```
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Anon key for browser
SUPABASE_SERVICE_ROLE_KEY       # Service role for backend
```

**Source:** Supabase Dashboard > API Settings

### Email Service - Resend (Required for emails)
```
RESEND_API_KEY                  # Generate in Resend dashboard
```

**Source:** https://resend.com/api-keys

### Webhooks (Required for lead capture)
```
NEXT_PUBLIC_FORM_WEBHOOK_URL    # Endpoint URL for form submissions
WEBHOOK_SECRET                  # Generate: openssl rand -base64 32
```

**Source:** Your form handling backend

### GHL Integration (Required for partner workflows)
```
GHL_API_KEY                     # GHL API credential
GHL_LOCATION_ID                 # GHL location

# Document Templates
GHL_DOC_PARTNER_AGREEMENT_ID    # Template ID
GHL_DOC_W9_ID                   # Template ID
GHL_DOC_DIRECT_DEPOSIT_ID       # Template ID

# Workflows
GHL_WORKFLOW_WELCOME_ID         # Automation ID
GHL_WORKFLOW_DOCS_SENT_ID       # Automation ID
GHL_WORKFLOW_DOCS_COMPLETE_ID   # Automation ID
GHL_WORKFLOW_APPROVED_ID        # Automation ID

# Pipeline Configuration
GHL_PIPELINE_ONBOARDING_ID      # Pipeline ID
GHL_STAGE_NEW_LEAD_ID           # Stage ID
GHL_STAGE_DOCS_SENT_ID          # Stage ID
GHL_STAGE_DOCS_PENDING_ID       # Stage ID
GHL_STAGE_REVIEW_ID             # Stage ID
GHL_STAGE_ACTIVE_ID             # Stage ID
GHL_STAGE_DECLINED_ID           # Stage ID
```

**Source:** Go High Level Dashboard > API Settings

### Cron Security (Required)
```
CRON_SECRET                     # Generate: openssl rand -base64 32
```

**Source:** Generate locally, store in Vercel

### Optional Services
```
GOOGLE_AI_STUDIO_KEY            # For AI image generation
NOTION_API_KEY                  # For content management
BROWSERBASE_API_KEY             # For browser automation
BROWSERBASE_PROJECT_ID          # Browser automation project
NEXT_PUBLIC_LIVEKIT_URL         # For video conferencing
```

### Service Account (Development)
```
OP_SERVICE_ACCOUNT_TOKEN        # 1Password service account
```

---

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js provider
- `POST /api/auth/register` - User registration

### Partner Portal
- `GET /api/partner` - Partner info
- `GET /api/partner/dashboard` - Dashboard data
- `GET /api/partner/earnings` - Earnings data
- `GET /api/partner/analytics` - Analytics
- `POST /api/partner/profile` - Update profile
- `GET /api/partner/quotes` - Quote list
- `POST /api/partner/quotes` - Create quote
- `GET /api/partner/policies` - Policy list
- `GET /api/partner/resources` - Resources

### Documents & Files
- `POST /api/documents/sign` - Signature endpoint
- `GET /api/documents/templates` - Templates
- `POST /api/partner/assets/generate` - Generate assets

### Admin APIs
- `GET /api/admin/dashboard` - Admin stats
- `POST /api/admin/resources` - Manage resources
- `POST /api/admin/commission-tiers` - Tier management
- `GET /api/admin/voice-agent/analytics` - Voice agent stats

### Webhooks
- `POST /api/webhooks/ghl` - GHL webhook handler
- `POST /api/webhooks/policy-updates` - Policy updates
- `POST /api/leads` - Lead capture

### Cron Jobs
- `GET /api/cron/email` - Email automation (runs every 5 minutes)
- `GET /api/cron/expire-quotes` - Quote expiration

### Campaigns
- `POST /api/campaigns/outbound` - Outbound campaigns

---

## TypeScript Configuration

### Compiler Options
```json
{
  "lib": ["dom", "dom.iterable", "esnext"],
  "allowJs": true,
  "target": "ES6",
  "strict": true,
  "noEmit": true,
  "esModuleInterop": true,
  "module": "esnext",
  "moduleResolution": "bundler",
  "resolveJsonModule": true,
  "isolatedModules": true,
  "jsx": "react-jsx",
  "incremental": true,
  "skipLibCheck": true,
  "plugins": [{"name": "next"}]
}
```

### Path Aliases
```json
{
  "@/*": ["./*"]
}
```

---

## Middleware Configuration

### Current: deprecated middleware.ts
```typescript
// app/middleware.ts
// Handles auth and routing logic
```

### Recommended: Next.js proxy pattern
Update in next.config.mjs for Next.js 17+ compatibility

---

## Performance Optimizations

### Image Handling
- `unoptimized: true` in next.config.mjs
- Reason: Custom image optimization needed
- Production: Consider enabling image optimization

### Static Generation
- 65 pages prerendered as static HTML
- Remaining 28 routes use SSR
- ISR (Incremental Static Regeneration) not used

### Build Output
- All static pages in `.next/static`
- API routes as serverless functions
- No edge workers configured

---

## Database Migrations

### Using Drizzle ORM

Check current schema:
```bash
npm run drizzle-kit-studio
```

Apply pending migrations:
```bash
npx drizzle-kit push:pg
```

Generate migration files:
```bash
npx drizzle-kit generate:pg
```

### Schema Location
- `/Users/julianbradley/CODEING /daily-event-insurance/drizzle/`
- Config: `drizzle.config.ts`

---

## Monitoring & Logging

### Vercel Built-in
- Web Analytics (`@vercel/analytics` installed)
- Build logs
- Deployment logs
- Function logs

### Recommended Additions
- Error tracking: Sentry
- APM: Datadog or New Relic
- Logs: Axiom or LogRocket
- Uptime monitoring: UptimeRobot

---

## Dependency Summary

### Key Production Dependencies
- **Next.js** 16.1.0
- **React** 19.2.3
- **TypeScript** 5.0.2 (update to 5.1.0+)
- **Drizzle ORM** 0.45.1
- **NextAuth** 5.0.0-beta.30
- **Supabase** 2.89.0
- **Resend** 6.6.0
- **Radix UI** (comprehensive component library)
- **TailwindCSS** 4.1.9
- **Framer Motion** 11.18.0
- **React Hook Form** 7.60.0

### Build Dependencies
- **Drizzle Kit** 0.31.8
- **ESLint** 8.57.0
- **Sharp** 0.34.5

---

## Deployment Checklist (Technical)

### Pre-Deployment
- [ ] `npm run build` completes with 0 errors
- [ ] `npm run lint` reviewed (warnings acceptable)
- [ ] All required env vars defined in Vercel
- [ ] Database migrations applied
- [ ] Test coverage verified if applicable

### During Deployment
- [ ] Build logs show no 500 errors
- [ ] All 93 routes compile successfully
- [ ] Cron job endpoint is accessible

### Post-Deployment
- [ ] Home page loads in <3 seconds
- [ ] API endpoints respond correctly
- [ ] Authentication flow works
- [ ] Database queries execute
- [ ] Error logs are empty

---

## Troubleshooting

### Build Failures

**Problem:** "DATABASE_URL not found"
**Solution:** Verify env var is set in Vercel dashboard for Production environment

**Problem:** "Module not found"
**Solution:** Check `node_modules` is properly installed: `npm install`

**Problem:** "TypeScript errors in build"
**Solution:** Run locally: `npm run build` to see full error details

### Runtime Issues

**Problem:** 500 errors after deployment
**Solution:** Check function logs in Vercel dashboard

**Problem:** Cron job not running
**Solution:** Verify `CRON_SECRET` is set and matches handler expectations

**Problem:** Slow page loads
**Solution:** Check database query performance, enable caching

---

## Files Reference

```
/Users/julianbradley/CODEING /daily-event-insurance/
├── next.config.mjs              # Main Next.js config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies & scripts
├── vercel.json                  # Vercel deployment config
├── drizzle.config.ts            # Database config
├── middleware.ts                # Auth middleware
├── .env.example                 # Env var documentation
├── .env.local                   # Dev variables (not committed)
├── .env.production.local        # Prod variables (not committed)
├── .next/                       # Build output
├── app/                         # Next.js App Router
│   ├── api/                     # API routes
│   ├── (partner)/               # Partner portal routes
│   └── ...                      # Page routes
├── components/                  # Reusable components
├── lib/                         # Utilities & hooks
├── styles/                      # Global styles
├── types/                       # TypeScript types
├── public/                      # Static assets
└── drizzle/                     # Database schema
```

---

## Production Readiness Checklist

- [x] Code compiles without TypeScript errors
- [x] Security headers configured
- [x] Database connection pooling enabled
- [x] Cron jobs configured
- [ ] All environment variables configured
- [ ] Error tracking enabled (recommended)
- [ ] Performance monitoring enabled (recommended)
- [ ] Backup strategy in place (recommended)
- [ ] Rollback plan documented

---

## Deployment Success Criteria

1. Build completes in <15 seconds
2. All 93 routes compile successfully
3. No 500 errors in function logs
4. Homepage loads in <3 seconds
5. Authentication works end-to-end
6. Database queries execute successfully
7. Cron job runs every 5 minutes
8. No TypeScript or runtime errors in logs

**Current Status:** 6/7 requirements met. Awaiting environment variable configuration.
