/**
 * Email Templates API
 * GET - List all email templates
 * POST - Create a new template
 */

import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server"

// Default email templates
const DEFAULT_TEMPLATES = [
  {
    name: "Initial Outreach",
    slug: "initial_outreach",
    category: "outreach",
    subject: "Partner with {{businessName}} for Event Insurance",
    htmlContent: `<h2>Hi {{firstName}},</h2>
<p>I'm reaching out from Daily Event Insurance. We help businesses like {{businessName}} protect their events with affordable, easy-to-get coverage.</p>
<p>Our partners typically see:</p>
<ul>
<li>Additional revenue from insurance upsells</li>
<li>Reduced liability exposure</li>
<li>Happier customers with peace of mind</li>
</ul>
<p>Would you have 15 minutes this week for a quick call?</p>
<p>Best,<br/>{{agentName}}</p>`,
    availableVariables: JSON.stringify(["firstName", "lastName", "businessName", "agentName"]),
  },
  {
    name: "Follow Up",
    slug: "follow_up",
    category: "follow_up",
    subject: "Following up - Event Insurance for {{businessName}}",
    htmlContent: `<h2>Hi {{firstName}},</h2>
<p>I wanted to follow up on my previous message about partnering with Daily Event Insurance.</p>
<p>I'd love to show you how our integration works - it takes less than 10 minutes to set up and can start generating revenue immediately.</p>
<p>Are you available for a quick demo this week?</p>
<p>Best,<br/>{{agentName}}</p>`,
    availableVariables: JSON.stringify(["firstName", "lastName", "businessName", "agentName"]),
  },
  {
    name: "Demo Confirmation",
    slug: "demo_confirmation",
    category: "onboarding",
    subject: "Your Demo with Daily Event Insurance - {{demoDate}}",
    htmlContent: `<h2>Hi {{firstName}},</h2>
<p>Great news! Your demo is confirmed for <strong>{{demoDate}}</strong>.</p>
<p>During our call, I'll show you:</p>
<ul>
<li>How the widget integrates with your booking flow</li>
<li>Your partner dashboard and earnings tracking</li>
<li>Real-time reporting and analytics</li>
</ul>
<p>Please join using this link: {{demoLink}}</p>
<p>See you soon!</p>
<p>{{agentName}}</p>`,
    availableVariables: JSON.stringify(["firstName", "businessName", "demoDate", "demoLink", "agentName"]),
  },
  {
    name: "Welcome Partner",
    slug: "welcome_partner",
    category: "onboarding",
    subject: "Welcome to Daily Event Insurance, {{firstName}}! 🎉",
    htmlContent: `<h2>Welcome aboard, {{firstName}}!</h2>
<p>We're thrilled to have {{businessName}} as our newest partner.</p>
<p>Here's what happens next:</p>
<ol>
<li><strong>Complete your setup</strong> - Log into your partner dashboard to finish configuration</li>
<li><strong>Add the widget</strong> - Copy and paste our integration code</li>
<li><strong>Start earning</strong> - Every policy sold earns you commission</li>
</ol>
<p>Your Partner Dashboard: {{dashboardLink}}</p>
<p>Need help? Reply to this email or chat with our support team.</p>
<p>Welcome to the team!</p>
<p>{{agentName}}</p>`,
    availableVariables: JSON.stringify(["firstName", "businessName", "dashboardLink", "agentName"]),
  },
  {
    name: "Nurture - Cold Lead",
    slug: "nurture_cold",
    category: "nurture",
    subject: "Quick question about {{businessName}}",
    htmlContent: `<h2>Hi {{firstName}},</h2>
<p>I noticed you checked out Daily Event Insurance a while back but we haven't connected yet.</p>
<p>I'm curious - what's your biggest challenge when it comes to event coverage right now?</p>
<p>No pressure, just want to understand if we might be a good fit.</p>
<p>{{agentName}}</p>`,
    availableVariables: JSON.stringify(["firstName", "businessName", "agentName"]),
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    if (!isSupabaseServerConfigured()) {
      let templates = DEFAULT_TEMPLATES.map((t, i) => ({
        id: `default-${i}`,
        ...t,
        isActive: true,
        sentCount: 0,
        createdAt: new Date().toISOString(),
      }))

      if (category) {
        templates = templates.filter((t) => t.category === category)
      }

      return NextResponse.json({
        templates,
        source: "default",
      })
    }

    const supabase = createAdminClient()

    let query = (supabase as any)
      .from("email_templates")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category", category)
    }

    const { data: templates, error } = await query

    if (error) {
      console.error("[Email Templates] Error:", error)
      return NextResponse.json({
        templates: DEFAULT_TEMPLATES.map((t, i) => ({
          id: `default-${i}`,
          ...t,
          isActive: true,
          sentCount: 0,
        })),
        source: "default",
      })
    }

    // If no templates, seed with defaults
    if (!templates || templates.length === 0) {
      const { data: seeded } = await (supabase as any)
        .from("email_templates")
        .insert(DEFAULT_TEMPLATES.map((t) => ({
          ...t,
          is_active: true,
          sent_count: 0,
        })))
        .select()

      return NextResponse.json({
        templates: seeded || DEFAULT_TEMPLATES.map((t, i) => ({ id: `default-${i}`, ...t })),
        source: "seeded",
      })
    }

    // Transform to camelCase
    const transformedTemplates = templates.map((t: any) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description,
      category: t.category,
      subject: t.subject,
      htmlContent: t.html_content,
      textContent: t.text_content,
      availableVariables: t.available_variables,
      isActive: t.is_active,
      sentCount: t.sent_count,
      openRate: t.open_rate,
      clickRate: t.click_rate,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }))

    return NextResponse.json({
      templates: transformedTemplates,
      source: "database",
    })
  } catch (error) {
    console.error("[Email Templates] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch email templates" },
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
    const { name, category, subject, htmlContent, textContent, description, availableVariables } = body

    if (!name || !subject || !htmlContent) {
      return NextResponse.json(
        { error: "name, subject, and htmlContent are required" },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")

    const supabase = createAdminClient()

    const { data: template, error } = await (supabase as any)
      .from("email_templates")
      .insert({
        name,
        slug,
        description,
        category: category || "general",
        subject,
        html_content: htmlContent,
        text_content: textContent,
        available_variables: availableVariables || JSON.stringify([]),
        is_active: true,
        sent_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[Email Templates] Create error:", error)
      return NextResponse.json(
        { error: "Failed to create template" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      template,
    })
  } catch (error) {
    console.error("[Email Templates] Error:", error)
    return NextResponse.json(
      { error: "Failed to create email template" },
      { status: 500 }
    )
  }
}
