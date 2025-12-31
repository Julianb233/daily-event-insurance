/**
 * Example: Automated login with 1Password credentials
 *
 * Usage: pnpm tsx scripts/browser-automation/example-login.ts
 *
 * Prerequisites:
 * 1. Set OP_SERVICE_ACCOUNT_TOKEN in .env.local
 * 2. Set BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID in .env.local
 * 3. Create credentials in 1Password vault "Browserbase Agent"
 */

import { z } from "zod"
import { createStagehandClient } from "../../lib/automation"
import "dotenv/config"

async function main() {
  console.log("🚀 Starting browser automation...")

  // Validate required env vars
  if (!process.env.OP_SERVICE_ACCOUNT_TOKEN) {
    throw new Error("Missing OP_SERVICE_ACCOUNT_TOKEN in environment")
  }
  if (!process.env.BROWSERBASE_API_KEY) {
    throw new Error("Missing BROWSERBASE_API_KEY in environment")
  }

  // Create authenticated client (verbose: 0=off, 1=info, 2=debug)
  const client = await createStagehandClient({ verbose: 1 })
  const { page, getCredentials, close } = client

  try {
    // Get credentials from 1Password
    console.log("🔐 Fetching credentials from 1Password...")
    const creds = await getCredentials("op://Browserbase Agent/Browserbase")
    console.log("✅ Credentials retrieved")

    // Navigate to login page
    console.log("🌐 Navigating to Browserbase...")
    await page.goto("https://www.browserbase.com/sign-in", {
      waitUntil: "domcontentloaded"
    })

    // Perform login
    console.log("📝 Filling login form...")
    await page.act({
      action: "Type in the username: %username%",
      variables: { username: creds.username },
    })
    await page.act("Click continue")

    await page.act({
      action: "Type in the password: %password%",
      variables: { password: creds.password },
    })
    await page.act("Click the sign in button")

    await page.waitForLoadState("domcontentloaded")
    console.log("✅ Login successful!")

    // Extract data from dashboard
    console.log("📊 Extracting project data...")
    const result = await page.extract({
      instruction: "Extract the project ID of the Browserbase account",
      schema: z.object({
        projectId: z.string(),
      }),
    })

    console.log("📋 Extracted data:", result)

  } catch (error) {
    console.error("❌ Automation failed:", error)
    throw error
  } finally {
    await close()
    console.log("🏁 Browser closed")
  }
}

main().catch(console.error)
