import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { microsites, partners } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { generateStandaloneHTML } from "@/lib/microsite/generator"
import { notFound } from "next/navigation"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ subdomain: string }> }
) {
    // In Next.js 15, params is a Promise
    const resolvedParams = await params
    let subdomain = resolvedParams?.subdomain

    // Fallback: Extract from URL if params is missing (rewrite edge case)
    if (!subdomain) {
        const parts = request.nextUrl.pathname.split('/')
        subdomain = parts[parts.length - 1]
    }

    console.log(`[Microsite API] Fetching for subdomain: ${subdomain}`)

    if (!subdomain) {
        return new NextResponse("Subdomain required", { status: 400 })
    }

    // Fetch microsite data
    const [microsite] = await db!
        .select({
            microsite: microsites,
            partner: partners
        })
        .from(microsites)
        .innerJoin(partners, eq(microsites.partnerId, partners.id))
        .where(eq(microsites.subdomain, subdomain))
        .limit(1)

    if (!microsite) {
        console.error(`Microsite not found for subdomain: ${subdomain}`)
        return new NextResponse("Microsite not found", { status: 404 })
    }

    // Generate HTML on the fly
    // This ensures that any DB updates (new logo, colors) are immediately reflected
    // without needing a rebuild.
    const html = generateStandaloneHTML({
        partnerId: microsite.partner.id,
        partnerName: microsite.partner.businessName,
        logoUrl: microsite.microsite.logoUrl || "",
        primaryColor: microsite.microsite.primaryColor || "#14B8A6",
        branding: {
            images: (microsite.partner.brandingImages as string[]) || [],
            logoUrl: microsite.partner.logoUrl || undefined
        },
        qrCodeDataUrl: microsite.microsite.qrCodeUrl || "",
        micrositeUrl: `https://${microsite.microsite.domain}`
    })

    return new NextResponse(html, {
        headers: {
            "Content-Type": "text/html",
            // Cache for 1 hour to reduce DB load
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300"
        },
    })
}
