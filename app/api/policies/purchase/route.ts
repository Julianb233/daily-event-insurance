import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"
import { nanoid } from "nanoid"
import { format, addDays } from "date-fns"

/**
 * POST /api/policies/purchase
 * Purchase a policy from an existing quote
 *
 * Request body:
 * - quoteId: string (required)
 * - customer: { email, name, phone? } (required)
 * - paymentMethod: "stripe" | "test" (default: "stripe")
 * - testMode?: boolean
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      quoteId,
      customer,
      paymentMethod = "stripe",
      testMode = false,
    } = body

    // Validation
    if (!quoteId) {
      return NextResponse.json(
        { error: "Quote ID is required" },
        { status: 400 }
      )
    }
    if (!customer?.email) {
      return NextResponse.json(
        { error: "Customer email is required" },
        { status: 400 }
      )
    }
    if (!customer?.name) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      )
    }

    // Generate policy number
    const dateStr = format(new Date(), "yyyyMMdd")
    const randomSuffix = nanoid(5).toUpperCase()
    const policyNumber = `POL-${dateStr}-${randomSuffix}`

    // If Supabase is configured and not in test mode
    if (isSupabaseServerConfigured() && !testMode && paymentMethod !== "test") {
      const supabase = createAdminClient()

      // Get quote
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", quoteId)
        .single()

      if (quoteError || !quote) {
        return NextResponse.json(
          { error: "Quote not found" },
          { status: 404 }
        )
      }

      // Check quote status
      if (quote.status !== "pending") {
        return NextResponse.json(
          { error: `Quote is ${quote.status}, cannot purchase` },
          { status: 400 }
        )
      }

      // Check expiration
      if (quote.expires_at && new Date(quote.expires_at) < new Date()) {
        // Update quote status
        await supabase
          .from("quotes")
          .update({ status: "expired" })
          .eq("id", quoteId)

        return NextResponse.json(
          { error: "Quote has expired" },
          { status: 400 }
        )
      }

      // TODO: Process actual payment with Stripe here
      // For now, we'll simulate successful payment

      // Create policy
      const effectiveDate = new Date()
      const eventDate = new Date(quote.event_date)
      const expirationDate = addDays(eventDate, 1) // Coverage until day after event

      const { data: policy, error: policyError } = await supabase
        .from("policies")
        .insert({
          partner_id: quote.partner_id,
          quote_id: quoteId,
          policy_number: policyNumber,
          event_type: quote.event_type,
          event_date: quote.event_date,
          participants: quote.participants,
          coverage_type: quote.coverage_type,
          premium: quote.premium,
          commission: quote.commission,
          status: "active",
          effective_date: effectiveDate.toISOString(),
          expiration_date: expirationDate.toISOString(),
          customer_email: customer.email,
          customer_name: customer.name,
          customer_phone: customer.phone || null,
          location: quote.location,
          duration: quote.duration,
          risk_multiplier: quote.risk_multiplier,
        })
        .select()
        .single()

      if (policyError) {
        console.error("[Purchase API] Policy creation error:", policyError)
        return NextResponse.json(
          { error: "Failed to create policy" },
          { status: 500 }
        )
      }

      // Update quote status
      await supabase
        .from("quotes")
        .update({
          status: "accepted",
          accepted_at: new Date().toISOString(),
          customer_email: customer.email,
          customer_name: customer.name,
        })
        .eq("id", quoteId)

      // Generate certificate URL (mock for now)
      const certificateUrl = `/api/policies/${policy.id}/certificate`

      // Update policy with certificate URL
      await supabase
        .from("policies")
        .update({
          policy_document: certificateUrl,
          certificate_issued: true,
        })
        .eq("id", policy.id)

      return NextResponse.json({
        success: true,
        policy: {
          id: policy.id,
          policyNumber: policy.policy_number,
          eventType: policy.event_type,
          eventDate: policy.event_date,
          coverageType: policy.coverage_type,
          premium: policy.premium,
          status: policy.status,
          effectiveDate: policy.effective_date,
          expirationDate: policy.expiration_date,
          customerEmail: policy.customer_email,
          customerName: policy.customer_name,
          certificateUrl,
        },
        message: "Policy purchased successfully",
      })
    }

    // Test mode / mock response
    const mockPolicyId = `policy_${nanoid(12)}`
    const effectiveDate = new Date()
    const expirationDate = addDays(new Date(), 30)
    const certificateUrl = `/api/policies/${mockPolicyId}/certificate`

    return NextResponse.json({
      success: true,
      policy: {
        id: mockPolicyId,
        policyNumber,
        eventType: "event",
        eventDate: addDays(new Date(), 7).toISOString(),
        coverageType: "liability",
        premium: "150.00",
        status: "active",
        effectiveDate: effectiveDate.toISOString(),
        expirationDate: expirationDate.toISOString(),
        customerEmail: customer.email,
        customerName: customer.name,
        certificateUrl,
      },
      testMode: true,
      message: "Test policy created successfully",
    })

  } catch (error) {
    console.error("[Purchase API] Error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    )
  }
}
