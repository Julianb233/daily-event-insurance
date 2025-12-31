/**
 * Example: Scrape carrier data from insurance websites
 *
 * Usage: pnpm tsx scripts/browser-automation/scrape-carrier-data.ts
 *
 * This demonstrates using Stagehand for web scraping tasks
 * relevant to the daily event insurance business.
 */

import { z } from "zod"
import { createStagehandClient } from "../../lib/automation"
import "dotenv/config"

// Schema for carrier data extraction
const CarrierDataSchema = z.object({
  carriers: z.array(z.object({
    name: z.string(),
    rating: z.string().optional(),
    specialties: z.array(z.string()).optional(),
  })),
})

async function main() {
  console.log("🚀 Starting carrier data scraper...")

  if (!process.env.OP_SERVICE_ACCOUNT_TOKEN) {
    throw new Error("Missing OP_SERVICE_ACCOUNT_TOKEN in environment")
  }

  const client = await createStagehandClient({ verbose: 1 })
  const { page, close } = client

  try {
    // Example: Navigate to a public insurance carrier directory
    console.log("🌐 Navigating to carrier directory...")

    // This is a placeholder URL - replace with actual carrier directory
    await page.goto("https://example.com/insurance-carriers", {
      waitUntil: "domcontentloaded",
    })

    // Use AI-powered extraction
    console.log("📊 Extracting carrier data...")
    const result = await page.extract({
      instruction: "Extract all insurance carrier names, their AM Best ratings if shown, and their specialty event types",
      schema: CarrierDataSchema,
    })

    console.log("📋 Found carriers:", JSON.stringify(result, null, 2))

    // You could save this to database or file
    // await db.insert(carriers).values(result.carriers)

  } catch (error) {
    console.error("❌ Scraping failed:", error)
    throw error
  } finally {
    await close()
    console.log("🏁 Browser closed")
  }
}

main().catch(console.error)
