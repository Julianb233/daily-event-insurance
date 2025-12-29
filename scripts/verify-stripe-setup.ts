/**
 * Stripe Setup Verification Script
 *
 * Verifies that all Stripe integration components are properly configured
 */

import fs from "fs"
import path from "path"

interface VerificationResult {
  category: string
  checks: {
    name: string
    passed: boolean
    message: string
  }[]
}

const results: VerificationResult[] = []

// Check 1: Files Exist
console.log("🔍 Verifying Stripe integration files...\n")

const requiredFiles = [
  "lib/stripe/client.ts",
  "lib/stripe/checkout.ts",
  "lib/stripe/webhooks.ts",
  "lib/stripe/index.ts",
  "app/api/stripe/checkout/route.ts",
  "app/api/stripe/webhook/route.ts",
  "app/checkout/page.tsx",
  "app/checkout/success/page.tsx",
  "app/checkout/cancel/page.tsx",
]

const fileChecks = requiredFiles.map((file) => {
  const filePath = path.join(process.cwd(), file)
  const exists = fs.existsSync(filePath)
  return {
    name: file,
    passed: exists,
    message: exists ? "✓ File exists" : "✗ File missing",
  }
})

results.push({
  category: "Required Files",
  checks: fileChecks,
})

// Check 2: Environment Variables
const envChecks = [
  {
    name: "STRIPE_SECRET_KEY",
    passed: !!process.env.STRIPE_SECRET_KEY,
    message: process.env.STRIPE_SECRET_KEY
      ? "✓ Configured"
      : "✗ Not configured (add to .env.local)",
  },
  {
    name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    passed: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    message: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ? "✓ Configured"
      : "✗ Not configured (add to .env.local)",
  },
  {
    name: "STRIPE_WEBHOOK_SECRET",
    passed: !!process.env.STRIPE_WEBHOOK_SECRET,
    message: process.env.STRIPE_WEBHOOK_SECRET
      ? "✓ Configured"
      : "⚠ Not configured (required for webhooks)",
  },
]

results.push({
  category: "Environment Variables",
  checks: envChecks,
})

// Check 3: Package Dependencies
let packageJson: any
try {
  packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8")
  )
} catch (error) {
  packageJson = { dependencies: {} }
}

const dependencyChecks = [
  {
    name: "stripe",
    passed: !!packageJson.dependencies?.stripe,
    message: packageJson.dependencies?.stripe
      ? `✓ Installed (${packageJson.dependencies.stripe})`
      : "✗ Not installed (run: pnpm add stripe)",
  },
  {
    name: "@stripe/stripe-js",
    passed: !!packageJson.dependencies?.["@stripe/stripe-js"],
    message: packageJson.dependencies?.["@stripe/stripe-js"]
      ? `✓ Installed (${packageJson.dependencies["@stripe/stripe-js"]})`
      : "✗ Not installed (run: pnpm add @stripe/stripe-js)",
  },
]

results.push({
  category: "Package Dependencies",
  checks: dependencyChecks,
})

// Check 4: TypeScript Configuration
const tsConfigPath = path.join(process.cwd(), "tsconfig.json")
let tsConfig: any
try {
  tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf-8"))
} catch (error) {
  tsConfig = {}
}

const tsChecks = [
  {
    name: "tsconfig.json exists",
    passed: fs.existsSync(tsConfigPath),
    message: fs.existsSync(tsConfigPath) ? "✓ Found" : "✗ Missing",
  },
  {
    name: "Strict mode enabled",
    passed: tsConfig.compilerOptions?.strict === true,
    message:
      tsConfig.compilerOptions?.strict === true
        ? "✓ Enabled"
        : "⚠ Not enabled (recommended)",
  },
]

results.push({
  category: "TypeScript Configuration",
  checks: tsChecks,
})

// Print Results
console.log("\n" + "=".repeat(60))
console.log("STRIPE INTEGRATION VERIFICATION REPORT")
console.log("=".repeat(60) + "\n")

let allPassed = true

results.forEach((result) => {
  console.log(`📋 ${result.category}`)
  console.log("-".repeat(60))

  result.checks.forEach((check) => {
    console.log(`  ${check.message.padEnd(50)} ${check.name}`)
    if (!check.passed) allPassed = false
  })

  console.log("")
})

// Summary
console.log("=".repeat(60))
if (allPassed) {
  console.log("✅ All checks passed! Stripe integration is ready.")
  console.log("\nNext steps:")
  console.log("  1. Run: pnpm install")
  console.log("  2. Configure Stripe keys in .env.local")
  console.log("  3. Set up webhook endpoint (see STRIPE_SETUP.md)")
  console.log("  4. Test the integration")
} else {
  console.log("⚠️  Some checks failed. Please review the issues above.")
  console.log("\nRefer to STRIPE_SETUP.md for detailed setup instructions.")
}
console.log("=".repeat(60) + "\n")

// Exit with appropriate code
process.exit(allPassed ? 0 : 1)
