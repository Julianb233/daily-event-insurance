---
description: Verify Firecrawl branding extraction and microsite generation pipeline
---

# Verify Microsite Generation Pipeline

This workflow validates the complete partner onboarding automation pipeline, specifically focusing on:
1. Firecrawl branding extraction (logo, images, metadata)
2. Microsite generation (glass morphism design)
3. QR code generation
4. Database record creation

## Prerequisites

1. **Firecrawl API Key**:
   To test the actual scraping, you need a Firecrawl API key.
   - get a key from [firecrawl.dev](https://firecrawl.dev)
   - Add it to your `.env.local`:
     ```bash
     FIRECRAWL_API_KEY=fc_...
     ```
   
   *Note: If no key is provided, the test will use fallback data (no branding).*

2. **Database Connection**:
   Ensure your `.env.local` has a valid `DATABASE_URL`.

## 1. Run the Pipeline Test Script

Run the following command to execute the end-to-end test script. This script simulates an onboarding completion event.

// turbo
```bash
npx tsx scripts/test-pipeline.ts
```

## 2. Interpret Results

Check the output of the script:

### Success Indicators
- **Branding extraction**: Should show "Logo found" (if API key is set).
- **Microsite generation**: Should show "Standalone microsite generated" with a URL.
- **QR Code**: Should show "QR code generated".
- **Database**: Should show "Microsite record exists".

### Common Issues
- **"FIRECRAWL_API_KEY not set"**: The script ran in fallback mode. Add the key to `.env.local` to test actual scraping.
- **"Database not configured"**: Check `DATABASE_URL` in `.env.local`.

## 3. Manual Verification (Optional)

If the script passes, you can manually verify the generated assets:
1. The script outputs a URL for the generated microsite (e.g., `https://[uuid].dailyeventinsurance.com`).
2. Since this is running locally, you cannot visit the subdomain effectively without local DNS spoofing, but you can inspect the HTML size and content in the logs.
3. Check the database `microsites` table to see the stored record.

## 4. End-to-End User Test

To test the flow as a real user:
1. Go to `http://localhost:3000/onboarding`
2. Complete the form with a real website URL
3. Sign all documents
4. Check your dashboard at `/partner/dashboard` to see the generated microsite and QR code.
