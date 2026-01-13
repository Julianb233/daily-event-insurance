import { NextRequest, NextResponse } from "next/server"
import { fetchBrandData, isBrandfetchConfigured } from "@/lib/brandfetch"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    if (!isBrandfetchConfigured()) {
      return NextResponse.json({ error: "Brandfetch not configured" }, { status: 503 })
    }

    const brandData = await fetchBrandData(url)

    if (!brandData) {
      return NextResponse.json({ error: "Could not fetch brand data" }, { status: 404 })
    }

    return NextResponse.json({ data: brandData })
  } catch (error) {
    console.error("[Brandfetch API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
