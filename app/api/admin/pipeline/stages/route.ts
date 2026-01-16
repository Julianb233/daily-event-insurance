/**
 * Pipeline Stages API
 * GET - List all pipeline stages
 * POST - Create a new stage
 */

import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"

// Default pipeline stages
const DEFAULT_STAGES = [
  { name: "New", slug: "new", color: "#6366F1", sortOrder: 0, isDefault: true, stageType: "active" },
  { name: "Contacted", slug: "contacted", color: "#8B5CF6", sortOrder: 1, stageType: "active" },
  { name: "Qualified", slug: "qualified", color: "#EC4899", sortOrder: 2, stageType: "active" },
  { name: "Demo Scheduled", slug: "demo_scheduled", color: "#F59E0B", sortOrder: 3, stageType: "active" },
  { name: "Proposal Sent", slug: "proposal_sent", color: "#10B981", sortOrder: 4, stageType: "active" },
  { name: "Converted", slug: "converted", color: "#22C55E", sortOrder: 5, isTerminal: true, stageType: "won" },
  { name: "Lost", slug: "lost", color: "#EF4444", sortOrder: 6, isTerminal: true, stageType: "lost" },
]

export async function GET() {
  try {
    if (!isSupabaseServerConfigured()) {
      // Return default stages if no database
      return NextResponse.json({
        stages: DEFAULT_STAGES.map((s, i) => ({ id: `default-${i}`, ...s })),
        source: "default",
      })
    }

    const supabase = createAdminClient()

    const { data: stages, error } = await (supabase as any)
      .from("pipeline_stages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("[Pipeline Stages] Error:", error)
      // Fall back to defaults
      return NextResponse.json({
        stages: DEFAULT_STAGES.map((s, i) => ({ id: `default-${i}`, ...s })),
        source: "default",
      })
    }

    // If no stages exist, seed with defaults
    if (!stages || stages.length === 0) {
      const { data: seeded, error: seedError } = await (supabase as any)
        .from("pipeline_stages")
        .insert(DEFAULT_STAGES)
        .select()

      if (seedError) {
        console.error("[Pipeline Stages] Seed error:", seedError)
        return NextResponse.json({
          stages: DEFAULT_STAGES.map((s, i) => ({ id: `default-${i}`, ...s })),
          source: "default",
        })
      }

      return NextResponse.json({
        stages: seeded,
        source: "seeded",
      })
    }

    return NextResponse.json({
      stages,
      source: "database",
    })
  } catch (error) {
    console.error("[Pipeline Stages] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pipeline stages" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseServerConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { name, description, color, sortOrder, stageType, slaHours } = body

    if (!name) {
      return NextResponse.json(
        { error: "Stage name is required" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")

    const supabase = createAdminClient()

    const { data: stage, error } = await (supabase as any)
      .from("pipeline_stages")
      .insert({
        name,
        slug,
        description,
        color: color || "#6366F1",
        sort_order: sortOrder ?? 0,
        stage_type: stageType || "active",
        sla_hours: slaHours,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[Pipeline Stages] Create error:", error)
      return NextResponse.json(
        { error: "Failed to create stage" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      stage,
    })
  } catch (error) {
    console.error("[Pipeline Stages] Error:", error)
    return NextResponse.json(
      { error: "Failed to create pipeline stage" },
      { status: 500 }
    )
  }
}
