import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners, microsites } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { sendEmail } from "@/lib/email/resend"

/**
 * POST /api/partner/welcome-email
 * Sends a welcome email to a newly activated partner with their microsite details
 * Can be called by admin or internally after onboarding completion
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { partnerId } = body

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: partnerId" },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    // Get partner data
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

    // Get microsite data
    const [microsite] = await db
      .select()
      .from(microsites)
      .where(eq(microsites.partnerId, partnerId))
      .limit(1)

    const micrositeUrl = microsite?.domain
      ? `https://${microsite.domain}`
      : `${process.env.NEXT_PUBLIC_APP_URL || "https://dailyeventinsurance.com"}/partner/${partner.id}`

    const qrCodeUrl = microsite?.qrCodeUrl || null

    // Send welcome email
    const result = await sendEmail({
      to: partner.contactEmail,
      subject: "Welcome to Daily Event Insurance - Your Partner Account is Ready!",
      html: generateWelcomeEmailHtml({
        contactName: partner.contactName,
        businessName: partner.businessName,
        micrositeUrl,
        qrCodeUrl,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://dailyeventinsurance.com"}/partner/dashboard`,
        primaryColor: partner.primaryColor || "#14B8A6",
      }),
    })

    if (!result.success) {
      console.error("Error sending welcome email:", result.error)
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully",
      emailId: result.id,
    })
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send welcome email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

interface WelcomeEmailParams {
  contactName: string
  businessName: string
  micrositeUrl: string
  qrCodeUrl: string | null
  dashboardUrl: string
  primaryColor: string
}

function generateWelcomeEmailHtml(params: WelcomeEmailParams): string {
  const { contactName, businessName, micrositeUrl, qrCodeUrl, dashboardUrl, primaryColor } = params

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <!-- Header -->
  <div style="background: linear-gradient(to right, ${primaryColor}, #0d9488); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Daily Event Insurance!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your partner account is now active</p>
  </div>

  <!-- Main Content -->
  <div style="background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="margin-top: 0; font-size: 16px;">Hi ${contactName},</p>

    <p style="font-size: 16px;">Congratulations! Your partner account for <strong>${businessName}</strong> is now fully activated. You're ready to start earning commissions by offering daily event insurance to your customers.</p>

    <!-- Microsite Section -->
    <div style="background: linear-gradient(to right, #f0fdfa, #ccfbf1); border: 1px solid #99f6e4; border-radius: 12px; padding: 24px; margin: 30px 0;">
      <h2 style="color: #0d9488; margin: 0 0 16px 0; font-size: 18px;">🌐 Your Custom Microsite</h2>
      <p style="margin: 0 0 16px 0; color: #374151;">Your branded insurance portal is live and ready to share with your customers:</p>

      <div style="background: white; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <a href="${micrositeUrl}" style="color: ${primaryColor}; font-weight: 600; word-break: break-all; font-size: 14px;">${micrositeUrl}</a>
      </div>

      ${qrCodeUrl ? `
      <div style="text-align: center; padding: 16px; background: white; border-radius: 8px;">
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Scan to visit your microsite:</p>
        <img src="${qrCodeUrl}" alt="Microsite QR Code" style="max-width: 150px; height: auto;" />
      </div>
      ` : ''}
    </div>

    <!-- Quick Start Guide -->
    <h2 style="color: #111827; margin: 30px 0 20px 0; font-size: 18px;">🚀 Quick Start Guide</h2>

    <div style="margin-bottom: 20px;">
      <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
        <div style="background: ${primaryColor}; color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">1</div>
        <div>
          <strong style="color: #111827;">Share your microsite link</strong>
          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Add the link to your website, emails, or share directly with customers.</p>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
        <div style="background: ${primaryColor}; color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">2</div>
        <div>
          <strong style="color: #111827;">Display the QR code</strong>
          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Print and display at your front desk for easy customer access.</p>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
        <div style="background: ${primaryColor}; color: white; border-radius: 50%; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">3</div>
        <div>
          <strong style="color: #111827;">Track your earnings</strong>
          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Monitor sales and commissions from your Partner Dashboard.</p>
        </div>
      </div>
    </div>

    <!-- Commission Info -->
    <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 30px 0;">
      <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px;">💰 Your Commission Rate: 40%</h3>
      <p style="margin: 0; color: #92400e; font-size: 14px;">You earn 40% commission on every policy sold through your microsite. Payments are processed monthly.</p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${dashboardUrl}"
         style="display: inline-block; padding: 16px 32px; background: ${primaryColor}; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Go to Partner Dashboard
      </a>
    </div>

    <!-- Support Section -->
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
      Need help getting started? Our support team is here for you:<br>
      <a href="mailto:support@dailyeventinsurance.com" style="color: ${primaryColor};">support@dailyeventinsurance.com</a> |
      <a href="tel:1-800-123-4567" style="color: ${primaryColor};">1-800-123-4567</a>
    </p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} Daily Event Insurance. All rights reserved.</p>
    <p style="margin: 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://dailyeventinsurance.com"}/privacy" style="color: #9ca3af;">Privacy Policy</a> |
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://dailyeventinsurance.com"}/terms" style="color: #9ca3af;">Terms of Service</a>
    </p>
  </div>
</body>
</html>
`
}
