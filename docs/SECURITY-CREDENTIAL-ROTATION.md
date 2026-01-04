# Security Credential Rotation Guide

## CRITICAL: Immediate Action Required

If credentials were exposed (e.g., in `.env.local` committed to git or shared publicly), follow these steps **immediately**.

---

## 1. Database Credentials (Supabase/PostgreSQL)

### Rotate Database Password
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings → Database**
4. Click **Reset database password**
5. Update `DATABASE_URL` in Vercel:
   ```bash
   vercel env rm DATABASE_URL production
   vercel env add DATABASE_URL production
   # Paste new connection string when prompted
   ```

### Rotate Supabase Service Role Key
1. Go to **Settings → API** in Supabase
2. Click **Generate new keys** (this invalidates old keys immediately)
3. Update in Vercel:
   ```bash
   vercel env rm SUPABASE_SERVICE_ROLE_KEY production
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   ```

---

## 2. Authentication Secret (NextAuth)

### Rotate AUTH_SECRET
```bash
# Generate new secret
openssl rand -base64 32

# Update in Vercel
vercel env rm AUTH_SECRET production
vercel env add AUTH_SECRET production
```

**Note:** This will invalidate all existing sessions. Users will need to log in again.

---

## 3. API Keys

### GoHighLevel (GHL)
1. Log into GoHighLevel
2. Navigate to **Settings → API Keys**
3. Revoke existing key and generate new one
4. Update:
   ```bash
   vercel env rm GHL_API_KEY production
   vercel env add GHL_API_KEY production
   ```

### Resend (Email)
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Revoke compromised key
3. Create new API key
4. Update:
   ```bash
   vercel env rm RESEND_API_KEY production
   vercel env add RESEND_API_KEY production
   ```

---

## 4. Post-Rotation Checklist

- [ ] All credentials rotated in provider dashboards
- [ ] All environment variables updated in Vercel
- [ ] Redeployed production (`vercel --prod`)
- [ ] Verified application functions correctly
- [ ] Reviewed access logs for unauthorized activity
- [ ] Updated any CI/CD secrets (GitHub Actions, etc.)
- [ ] Notified team members of the rotation

---

## 5. Verify No Exposure

### Check Git History
```bash
# Search for potential secrets in git history
git log -p --all -S 'DATABASE_URL' -- ':!*.md'
git log -p --all -S 'SUPABASE' -- ':!*.md'
git log -p --all -S 'AUTH_SECRET' -- ':!*.md'
```

If found in history, consider:
1. Using `git filter-branch` or BFG Repo Cleaner to remove
2. Force pushing to all branches (coordinate with team)
3. Treating all historical credentials as compromised

### Verify .gitignore
Ensure these patterns are in `.gitignore`:
```
.env
.env.*
.env.local
.env.*.local
!.env.example
```

---

## 6. Prevention

### Environment Variable Best Practices
1. **Never** commit `.env.local` or similar files
2. Use Vercel's environment variable UI for production secrets
3. Use `.env.example` with placeholder values for documentation
4. Consider using a secrets manager (1Password, Doppler, etc.)

### Development Setup
```bash
# Copy example file
cp .env.example .env.local

# Edit with your development credentials
# NEVER use production credentials in development
```

---

## 7. Audit Log Review

After rotation, review logs for suspicious activity:

1. **Supabase**: Check "Logs" section for unusual queries
2. **Vercel**: Review function logs for unusual patterns
3. **Application**: Check for unusual login attempts or data access

Report any suspicious activity to the security team immediately.

---

## Contact

For security incidents, contact: [security contact here]
