import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners, partnerDocuments } from "@/lib/db/schema"
import { eq, and, inArray } from "drizzle-orm"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { Resend } from "resend"
import { getDocumentByType } from "@/lib/demo-documents"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// POST /api/documents/confirmation-email - Send email confirmation of signed documents
// SECURITY: Requires partner authentication and ownership verification
export async function POST(request: Request) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    try {
      const body = await request.json()
      const { partnerId, documentTypes, recipientEmail } = body

      if (!partnerId || !documentTypes || !Array.isArray(documentTypes) || !recipientEmail) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        )
      }

      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      if (!resend) {
        return NextResponse.json(
          { success: false, error: "Email service not configured" },
          { status: 500 }
        )
      }

      // Get the partner and verify ownership
      const [partner] = await db
        .select()
        .from(partners)
        .where(eq(partners.id, partnerId))
        .limit(1)

      if (!partner) {
        return NextResponse.json(
          { success: false, error: "Partner not found" },
          { status: 404 }
        )
      }

      // SECURITY: Verify ownership
      if (partner.userId !== userId) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        )
      }

      // Get signed documents
      const signedDocs = await db
        .select()
        .from(partnerDocuments)
        .where(
          and(
            eq(partnerDocuments.partnerId, partnerId),
            eq(partnerDocuments.status, "signed"),
            inArray(partnerDocuments.documentType, documentTypes)
          )
        )

      if (signedDocs.length === 0) {
        return NextResponse.json(
          { success: false, error: "No signed documents found" },
          { status: 404 }
        )
      }

      // Build document list for email
      const documentList = signedDocs
        .map((doc) => {
          const template = getDocumentByType(doc.documentType as any)
          return `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                ${template?.title || doc.documentType}
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #059669;">
                Signed
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
                ${doc.signedAt?.toLocaleDateString() || "Unknown"}
              </td>
            </tr>
          `
        })
        .join("")

      // Send email
      const { error } = await resend.emails.send({
        from: "Daily Event Insurance <noreply@dailyeventinsurance.com>",
        to: recipientEmail,
        subject: "Document Signing Confirmation - Daily Event Insurance",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #14b8a6, #0d9488); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Document Signing Confirmation</h1>
            </div>

            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="margin-top: 0;">Hi ${partner.contactName},</p>

              <p>This email confirms that you have successfully signed the following documents for your partner account with Daily Event Insurance:</p>

              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Document</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Status</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${documentList}
                </tbody>
              </table>

              <p>You can access your signed documents anytime from your Partner Dashboard.</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://dailyeventinsurance.com"}/partner/dashboard"
                   style="display: inline-block; padding: 14px 28px; background: #0d9488; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  Go to Dashboard
                </a>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
                If you have any questions about your documents or partner account, please contact our support team at
                <a href="mailto:support@dailyeventinsurance.com" style="color: #0d9488;">support@dailyeventinsurance.com</a>
              </p>
            </div>

            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Daily Event Insurance. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
      })

      if (error) {
        console.error("Error sending confirmation email:", error)
        return NextResponse.json(
          { success: false, error: "Failed to send email" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Confirmation email sent successfully",
      })
    } catch (error) {
      console.error("Error sending confirmation email:", error)
      return NextResponse.json(
        { success: false, error: "Failed to send confirmation email" },
        { status: 500 }
      )
    }
  })
}
