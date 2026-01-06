---
description: Verify microsite generation using FireCrawl and DB
---

This workflow verifies the partner microsite generation pipeline, from FireCrawl scraping to database record creation.

1. Run the verification script:
   ```bash
   npx tsx scripts/verify-microsite-generation.ts
   ```

2. The script will:
   - Create a test partner (Gold's Gym Venice)
   - Scrape branding using FireCrawl (if API key present)
   - Generate microsite data validation
   - Save to database
   - Output the verification URL

3. Verify manually:
   - Visit `http://localhost:3000/golds-gym-venice`
   - Check if the page loads with the correct branding (Yellow/Gold color)
   - Verify the QR code is displayed
