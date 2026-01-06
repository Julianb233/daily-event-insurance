
import { config } from 'dotenv'
config({ path: '.env.local' })

import fs from 'fs'
import path from 'path'
import { generateStandaloneMicrosite, generateCheckinMicrosite } from "../lib/microsite/generator"

async function generateLaFitness() {
    console.log("Generating microsite for LA Fitness...")

    // Config for LA Fitness
    const micrositeConfig = {
        partnerId: 'la-fitness-demo',
        partnerName: 'LA Fitness',
        websiteUrl: 'https://www.lafitness.com',
        // We'll let the branding fetcher find the logo, or fallback
        primaryColor: '#1d2345', // LA Fitness typically uses dark blue/orange, picking a dark blue
        type: 'standalone' as const,
        businessType: 'gym',
        contactEmail: 'contact@lafitness.com',
        subdomain: 'lafitness'
    }

    try {
        // Generate Standalone
        console.log("Fetching branding and generating standalone microsite...")
        const microsite = await generateStandaloneMicrosite(micrositeConfig)

        const outputPath = path.join(process.cwd(), 'public', 'lafitness.html')
        fs.writeFileSync(outputPath, microsite.html)
        console.log(`✅ Saved standalone microsite to: ${outputPath}`)
        console.log(`   URL: ${microsite.url}`)
        console.log(`   Logo Found: ${microsite.branding.logoUrl ? 'Yes' : 'No'}`)

        // Generate Check-in
        console.log("Generating check-in microsite...")
        const checkin = await generateCheckinMicrosite({
            ...micrositeConfig,
            type: 'checkin'
        })

        const checkinPath = path.join(process.cwd(), 'public', 'lafitness-checkin.html')
        fs.writeFileSync(checkinPath, checkin.html)
        console.log(`✅ Saved check-in microsite to: ${checkinPath}`)

    } catch (error) {
        console.error("Error generating microsite:", error)
        process.exit(1)
    }
}

generateLaFitness()
