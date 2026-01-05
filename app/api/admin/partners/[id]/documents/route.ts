import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partnerDocuments } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

/**
 * GET /api/admin/partners/[id]/documents
 * List all legal documents for a specific partner
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Check database connection
        if (!db) {
            return NextResponse.json(
                { success: false, error: "Database not configured" },
                { status: 500 }
            )
        }

        const documents = await db
            .select()
            .from(partnerDocuments)
            .where(eq(partnerDocuments.partnerId, id))
            .orderBy(desc(partnerDocuments.createdAt))

        return NextResponse.json({
            success: true,
            documents
        })

    } catch (error) {
        console.error("[Admin Partner Documents] Error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch partner documents" },
            { status: 500 }
        )
    }
}
