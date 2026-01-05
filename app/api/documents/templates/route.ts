import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { documentTemplates, partners } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { demoDocuments, DOCUMENT_TYPES } from "@/lib/demo-documents"
import { requireAdmin, withAuth } from "@/lib/api-auth"

/**
 * Auto-populate document content with partner data
 * Replaces template variables like {{BUSINESS_NAME}}, {{CONTACT_NAME}}, etc.
 */
function populateDocumentContent(content: string, partnerData: Record<string, string | null | undefined>): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return content
    .replace(/\{\{BUSINESS_NAME\}\}/g, partnerData.businessName || '[Business Name]')
    .replace(/\{\{CONTACT_NAME\}\}/g, partnerData.contactName || '[Contact Name]')
    .replace(/\{\{CONTACT_EMAIL\}\}/g, partnerData.contactEmail || '[Contact Email]')
    .replace(/\{\{CONTACT_PHONE\}\}/g, partnerData.contactPhone || '[Contact Phone]')
    .replace(/\{\{BUSINESS_ADDRESS\}\}/g, partnerData.businessAddress || '[Business Address]')
    .replace(/\{\{WEBSITE_URL\}\}/g, partnerData.websiteUrl || '[Website URL]')
    .replace(/\{\{BUSINESS_TYPE\}\}/g, partnerData.businessType || '[Business Type]')
    .replace(/\{\{DIRECT_CONTACT_NAME\}\}/g, partnerData.directContactName || '[Direct Contact]')
    .replace(/\{\{DIRECT_CONTACT_EMAIL\}\}/g, partnerData.directContactEmail || '[Direct Contact Email]')
    .replace(/\{\{DIRECT_CONTACT_PHONE\}\}/g, partnerData.directContactPhone || '[Direct Contact Phone]')
    .replace(/\{\{DATE\}\}/g, date)
    .replace(/\{\{YEAR\}\}/g, new Date().getFullYear().toString())
}

// GET /api/documents/templates - List all active document templates
// Optional query params: ?partnerId=xxx to auto-populate with partner data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get('partnerId')

    // Fetch partner data if partnerId provided
    let partnerData: Record<string, string | null | undefined> | null = null

    if (partnerId && db) {
      const [partner] = await db
        .select()
        .from(partners)
        .where(eq(partners.id, partnerId))
        .limit(1)

      if (partner) {
        partnerData = {
          businessName: partner.businessName,
          contactName: partner.contactName,
          contactEmail: partner.contactEmail,
          contactPhone: partner.contactPhone,
          businessAddress: partner.businessAddress,
          websiteUrl: partner.websiteUrl,
          businessType: partner.businessType,
          directContactName: partner.directContactName,
          directContactEmail: partner.directContactEmail,
          directContactPhone: partner.directContactPhone,
        }
      }
    }

    // If db is configured, try to get templates from database
    if (db) {
      const dbTemplates = await db
        .select()
        .from(documentTemplates)
        .where(eq(documentTemplates.isActive, true))
        .orderBy(documentTemplates.type)

      // Merge DB templates with missing demo templates
      // This ensures new document types added to code appear even if not yet in DB

      const dbTemplateTypes = new Set(dbTemplates.map(t => t.type))

      const mergedTemplates = [
        ...dbTemplates.map(t => ({
          id: t.id,
          type: t.type,
          title: t.title,
          content: partnerData ? populateDocumentContent(t.content, partnerData) : t.content,
          version: t.version,
        })),
        ...demoDocuments
          .filter(doc => !dbTemplateTypes.has(doc.type))
          .map((doc, index) => ({
            id: `demo-fallback-${index}`,
            type: doc.type,
            title: doc.title,
            content: partnerData ? populateDocumentContent(doc.content, partnerData) : doc.content,
            version: doc.version,
          }))
      ]

      if (mergedTemplates.length > 0) {
        return NextResponse.json({
          success: true,
          templates: mergedTemplates,
          source: "database-merged",
          populated: !!partnerData,
        })
      }
    }

    // Otherwise, return demo documents as fallback
    // This ensures the onboarding flow works even before admin adds templates
    return NextResponse.json({
      success: true,
      templates: demoDocuments.map((doc, index) => ({
        id: `demo-${index}`,
        type: doc.type,
        title: doc.title,
        content: partnerData ? populateDocumentContent(doc.content, partnerData) : doc.content,
        version: doc.version,
      })),
      source: "demo",
      populated: !!partnerData,
    })
  } catch (error) {
    console.error("Error fetching document templates:", error)

    // Fallback to demo documents on any error
    return NextResponse.json({
      success: true,
      templates: demoDocuments.map((doc, index) => ({
        id: `demo-${index}`,
        type: doc.type,
        title: doc.title,
        content: doc.content,
        version: doc.version,
      })),
      source: "demo-fallback",
      populated: false,
    })
  }
}

/**
 * POST /api/documents/templates - Create a new template
 * SECURITY: Requires admin authentication
 */
export async function POST(request: Request) {
  return withAuth(async () => {
    // Require admin access to modify document templates
    const { userId } = await requireAdmin()

    try {
      const body = await request.json()
      const { type, title, content, version = "1.0" } = body

      if (!type || !title || !content) {
        return NextResponse.json(
          { success: false, error: "Missing required fields: type, title, content" },
          { status: 400 }
        )
      }

      // Validate type is one of allowed types
      const validTypes = Object.values(DOCUMENT_TYPES)
      if (!validTypes.includes(type)) {
        // SECURITY: Don't expose valid types in production
        const isProduction = process.env.NODE_ENV === "production"
        return NextResponse.json(
          { success: false, error: isProduction ? "Invalid document type" : `Invalid type. Must be one of: ${validTypes.join(", ")}` },
          { status: 400 }
        )
      }

      // Check database connection
      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Deactivate existing template of same type
      await db
        .update(documentTemplates)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(documentTemplates.type, type))

      // Create new template
      const [newTemplate] = await db
        .insert(documentTemplates)
        .values({
          type,
          title,
          content,
          version,
          isActive: true,
        })
        .returning()

      // Audit log for template modification
      console.log('[AUDIT] Document template modified:', {
        timestamp: new Date().toISOString(),
        action: 'TEMPLATE_UPDATE',
        modifiedBy: userId,
        templateType: type,
        newVersion: version,
      })

      return NextResponse.json({
        success: true,
        template: newTemplate,
      })
    } catch (error) {
      console.error("Error creating document template:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create template" },
        { status: 500 }
      )
    }
  })
}
