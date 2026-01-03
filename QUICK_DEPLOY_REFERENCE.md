# Quick Deployment Reference Card

**Project:** Daily Event Insurance
**Framework:** Next.js 16.1.0
**Status:** READY TO DEPLOY (pending env vars)

---

## In 30 Seconds

| Check | Status |
|-------|--------|
| Build | PASSED (7.1s) |
| TypeScript | 0 Errors |
| Database | Connected |
| Security | Configured |
| **BLOCKER** | **Missing 6+ env vars** |

---

## Critical Variables Needed

```bash
# Auth (generate: openssl rand -base64 32)
AUTH_SECRET = [generate]
CRON_SECRET = [generate]
NEXTAUTH_URL = https://your-domain.com

# Email (from https://resend.com/api-keys)
RESEND_API_KEY = [obtain]

# Database (copy from .env.production.local)
DATABASE_URL = [copy]
POSTGRES_URL = [copy]
POSTGRES_USER = [copy]
POSTGRES_PASSWORD = [copy]
POSTGRES_HOST = [copy]

# Webhooks (generate: openssl rand -base64 32)
NEXT_PUBLIC_FORM_WEBHOOK_URL = [your endpoint]
WEBHOOK_SECRET = [generate]

# GHL (if using partner features)
GHL_API_KEY = [obtain from GHL]
GHL_LOCATION_ID = [obtain from GHL]
+ 13 more GHL fields...

# Supabase (if using file uploads)
NEXT_PUBLIC_SUPABASE_URL = [obtain]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [obtain]
SUPABASE_SERVICE_ROLE_KEY = [obtain]
```

---

## Deploy in 3 Steps

### Step 1: Configure (15 min)
1. Go to Vercel Dashboard
2. Settings > Environment Variables
3. Add all variables from the list above
4. Ensure they're set for "Production" environment

### Step 2: Deploy (5 min)
```bash
git push origin main
# OR
vercel deploy --prod
```

### Step 3: Test (10 min)
- Visit your domain
- Test login/signup
- Check homepage loads
- Verify no 500 errors

---

## What Was Built

```
✓ 93 routes compiled
✓ 65 static pages prerendered
✓ 28 dynamic API routes
✓ Security headers configured
✓ Database connection ready
✓ Cron jobs configured (/api/cron/email every 5 min)
```

---

## Code Quality Status

**ESLint:** 97 warnings (non-blocking)
- Mostly unescaped quotes in text
- Can fix in next release

**TypeScript:** 0 errors
- Strict mode enabled
- All types checked

---

## Key Files

```
vercel.json                          # Deployment config ✓
next.config.mjs                      # Next.js config ✓
package.json                         # Dependencies ✓
.env.example                         # Variable reference ✓
DEPLOYMENT_STATUS_REPORT.md          # Detailed guide
DEPLOYMENT_CHECKLIST.md              # Full checklist
DEPLOYMENT_TECHNICAL_REFERENCE.md    # Technical details
```

---

## Common Secrets Generation

```bash
# Auth secret
openssl rand -base64 32

# Cron secret
openssl rand -base64 32

# Webhook secret
openssl rand -base64 32
```

---

## Cron Job Configured

**Endpoint:** `/api/cron/email`
**Schedule:** Every 5 minutes
**Requires:** `CRON_SECRET` env var

Monitor in Vercel Dashboard > Crons section

---

## Database Ready

**Type:** Neon PostgreSQL
**Connection:** Pooled + non-pooled
**SSL:** Required

Apply migrations before deployment:
```bash
npx drizzle-kit push:pg
```

---

## Post-Deploy Checklist

- [ ] Home page loads
- [ ] Login/signup works
- [ ] No 500 errors in logs
- [ ] Cron job appears in logs
- [ ] Analytics data flowing
- [ ] Verify for 24 hours

---

## If Something Goes Wrong

1. **Instant rollback** in Vercel dashboard
2. Check Vercel function logs
3. Verify environment variables
4. Test database connection
5. Redeploy

---

## Timeline

| Task | Time |
|------|------|
| Gather credentials | 30-60 min |
| Configure in Vercel | 15 min |
| Deploy | 5-10 min |
| Test | 10-20 min |
| **Total** | **1-2 hours** |

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Neon Docs:** https://neon.tech/docs

---

## Next Steps

1. Gather environment variable credentials
2. Add them to Vercel dashboard
3. Push to main branch (or run `vercel deploy --prod`)
4. Monitor logs for 24 hours
5. (Optional) Fix ESLint warnings in next release

**Bottom Line:** Build is done. Just need config. Then deploy.
