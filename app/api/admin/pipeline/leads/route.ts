/**
 * Pipeline Leads API
 * GET - Get leads grouped by pipeline stage for Kanban view
 * PATCH - Move lead to new stage
 */

import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"

// Map old status values to stage slugs
const STATUS_TO_STAGE: Record<string, string> = {
  new: "new",
  contacted: "contacted",
  qualified: "qualified",
  demo_scheduled: "demo_scheduled",
  proposal_sent: "proposal_sent",
  converted: "converted",
  lost: "lost",
  dnc: "lost",
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "50", 10)

    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({
        leads: [],
        byStage: {},
        message: "Database not configured",
      })
    }

    const supabase = createAdminClient()

    // Get all active leads (exclude dnc)
    const { data: leads, error } = await (supabase as any)
      .from("leads")
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        business_name,
        business_type,
        status,
        interest_level,
        interest_score,
        initial_value,
        converted_value,
        created_at,
        updated_at,
        last_activity_at
      `)
      .neq("status", "dnc")
      .order("updated_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("[Pipeline Leads] Error:", error)
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 }
      )
    }

    // Group leads by stage
    const byStage: Record<string, any[]> = {
      new: [],
      contacted: [],
      qualified: [],
      demo_scheduled: [],
      proposal_sent: [],
      converted: [],
      lost: [],
    }

    for (const lead of leads || []) {
      const stageName = STATUS_TO_STAGE[lead.status] || "new"
      if (byStage[stageName]) {
        byStage[stageName].push({
          id: lead.id,
          firstName: lead.first_name,
          lastName: lead.last_name,
          email: lead.email,
          phone: lead.phone,
          businessName: lead.business_name,
          businessType: lead.business_type,
          status: lead.status,
          interestLevel: lead.interest_level,
          interestScore: lead.interest_score,
          initialValue: lead.initial_value,
          convertedValue: lead.converted_value,
          createdAt: lead.created_at,
          updatedAt: lead.updated_at,
          lastActivityAt: lead.last_activity_at,
        })
      }
    }

    // Calculate stage counts
    const stageCounts = Object.entries(byStage).reduce((acc, [stage, leads]) => {
      acc[stage] = leads.length
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      leads: leads?.length || 0,
      byStage,
      stageCounts,
    })
  } catch (error) {
    console.error("[Pipeline Leads] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pipeline leads" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isSupabaseServerConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { leadId, newStage, reason } = body

    if (!leadId || !newStage) {
      return NextResponse.json(
        { error: "leadId and newStage are required" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get current lead status
    const { data: lead, error: fetchError } = await (supabase as any)
      .from("leads")
      .select("id, status")
      .eq("id", leadId)
      .single()

    if (fetchError || !lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      )
    }

    const oldStatus = lead.status

    // Update lead status
    const updateData: Record<string, any> = {
      status: newStage,
      updated_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    }

    // Set converted timestamp if moving to converted
    if (newStage === "converted" && oldStatus !== "converted") {
      updateData.converted_at = new Date().toISOString()
    }

    const { error: updateError } = await (supabase as any)
      .from("leads")
      .update(updateData)
      .eq("id", leadId)

    if (updateError) {
      console.error("[Pipeline Leads] Update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update lead stage" },
        { status: 500 }
      )
    }

    // Log stage change (optional - if table exists)
    try {
      await (supabase as any)
        .from("lead_stage_history")
        .insert({
          lead_id: leadId,
          from_stage_id: null, // We'd need to look up stage IDs
          to_stage_id: null,
          changed_by: "admin",
          reason,
        })
    } catch {
      // Stage history table may not exist yet
    }

    return NextResponse.json({
      success: true,
      leadId,
      oldStage: oldStatus,
      newStage,
    })
  } catch (error) {
    console.error("[Pipeline Leads] Error:", error)
    return NextResponse.json(
      { error: "Failed to move lead" },
      { status: 500 }
    )
  }
}
