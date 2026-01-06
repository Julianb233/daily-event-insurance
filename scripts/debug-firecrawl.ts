import { config } from "dotenv"
config({ path: ".env.local" })
import fs from "fs"
import path from "path"

async function debugFireCrawl() {
    const apiKey = process.env.FIRECRAWL_API_KEY
    const websiteUrl = "https://www.oceanpacificgym.com"

    console.log(`Debug: Fetching ${websiteUrl} with API Key: ${apiKey ? "Present" : "Missing"}`)

    if (!apiKey) {
        console.error("❌ No API Key found.")
        return
    }

    try {
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                url: websiteUrl,
                formats: ['markdown', 'html'],
                includeTags: ['img', 'meta'],
                onlyMainContent: false
            })
        })

        console.log(`Response Status: ${response.status} ${response.statusText}`)

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Error Body:", errorText)
            return
        }

        const data = await response.json()

        console.log("Data Keys:", Object.keys(data))
        if (data.data) {
            console.log("Data.data Keys:", Object.keys(data.data))
            // FireCrawl v1/scrape usually returns { success: true, data: { ... } } 
            // or sometimes directly the data depending on endpoint version details.
            // Let's check structure.
        }

        const html = data.data?.html || data.html
        if (html) {
            console.log(`HTML Length: ${html.length}`)
            const debugPath = path.join(process.cwd(), "debug_firecrawl_output.html")
            fs.writeFileSync(debugPath, html)
            console.log(`Saved HTML to ${debugPath}`)

            // Quick regex test
            const imgRegex = /<img[^>]*src=["']([^"']+)["']/gi
            const matches = html.match(imgRegex)
            console.log(`Regex Matches for <img>: ${matches ? matches.length : 0}`)
        } else {
            console.log("❌ No HTML found in response.")
            console.log("Full Response:", JSON.stringify(data, null, 2).substring(0, 500) + "...")
        }

    } catch (error) {
        console.error("Fetch failed:", error)
    }
}

debugFireCrawl()
