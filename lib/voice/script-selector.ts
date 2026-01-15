/**
 * Script Selection Service
 * Selects the optimal call script based on lead characteristics
 */

import { db, isDbConfigured, agentScripts, leads } from "@/lib/db"
import { eq, and } from "drizzle-orm"

export interface SelectedScript {
  id: string
  name: string
  content: string
  objectionHandlers?: string[]
  closingTechniques?: string[]
  score?: number
}

// Mock scripts for dev mode
const MOCK_SCRIPTS: SelectedScript[] = [
  {
    id: "script-cold-outbound",
    name: "Cold Outbound - New Lead",
    content: `Opening: "Hi [NAME], this is Sarah from Daily Event Insurance..."
Discovery: Ask about business type, daily visitors, current insurance
Value Prop: Highlight revenue opportunity and zero implementation cost
Close: Schedule demo or send proposal`,
    objectionHandlers: ["We have insurance", "No time", "Send info"],
    closingTechniques: ["Demo scheduling", "Proposal offer"]
  },
  {
    id: "script-warm-followup",
    name: "Warm Follow-up",
    content: `Opening: "Hi [NAME], following up on our conversation..."
Recap: Reference previous discussion points
Address concerns: Handle any outstanding questions
Close: Move to next stage`,
  },
  {
    id: "script-hot-lead",
    name: "Hot Lead - Ready to Close",
    content: `Opening: Quick greeting, get to business
Confirm: Verify they're ready to proceed
Close: Walk through signup process`,
  },
  {
    id: "script-inbound",
    name: "Inbound Inquiry Handler",
    content: `Opening: "Thank you for calling Daily Event Insurance..."
Discovery: Understand their needs
Qualify: Assess fit
Next Steps: Demo, proposal, or info send`,
  }
]

/**
 * Select the best script for a lead based on their characteristics
 */
export async function selectScript(
  leadId: string,
  callType: "outbound_new" | "outbound_followup" | "inbound" = "outbound_new"
): Promise<SelectedScript | null> {
  // Dev mode - return mock script
  if (!isDbConfigured()) {
    const mockScript = callType === "inbound"
      ? MOCK_SCRIPTS.find(s => s.id === "script-inbound")
      : MOCK_SCRIPTS[0]
    return mockScript || MOCK_SCRIPTS[0]
  }

  try {
    // Get lead data
    const [lead] = await db!
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1)

    if (!lead) {
      console.warn(`[ScriptSelector] Lead not found: ${leadId}`)
      return MOCK_SCRIPTS[0]
    }

    // Get matching scripts
    const scripts = await db!
      .select()
      .from(agentScripts)
      .where(eq(agentScripts.isActive, true))

    if (scripts.length === 0) {
      return MOCK_SCRIPTS[0]
    }

    // Score each script based on lead characteristics
    const scored = scripts.map(script => {
      let score = 0

      // Business type match (30 points)
      if (script.businessType === lead.businessType) score += 30
      else if (script.businessType === "other" || !script.businessType) score += 10

      // Interest level match (30 points)
      if (script.interestLevel === lead.interestLevel) score += 30
      else if (script.interestLevel === "warm" && lead.interestLevel === "hot") score += 15

      // Geographic region match (20 points)
      if (script.geographicRegion === lead.state) score += 20
      else if (!script.geographicRegion) score += 10

      return {
        id: script.id,
        name: script.name,
        content: script.openingScript, // Use openingScript as main content
        objectionHandlers: script.objectionHandlers ? JSON.parse(script.objectionHandlers) : [],
        closingTechniques: script.closingScript ? [script.closingScript] : [],
        score
      }
    })

    // Sort by score and return best match
    scored.sort((a, b) => b.score - a.score)
    return scored[0]

  } catch (error) {
    console.error("[ScriptSelector] Error:", error)
    return MOCK_SCRIPTS[0]
  }
}

/**
 * Get all scripts for a business type
 */
export async function getScriptsByBusinessType(
  businessType: string
): Promise<SelectedScript[]> {
  if (!isDbConfigured()) {
    return MOCK_SCRIPTS
  }

  try {
    const scripts = await db!
      .select()
      .from(agentScripts)
      .where(and(
        eq(agentScripts.isActive, true),
        eq(agentScripts.businessType, businessType)
      ))

    return scripts.map(s => ({
      id: s.id,
      name: s.name,
      content: s.scriptContent,
      objectionHandlers: s.objectionHandlers ? JSON.parse(s.objectionHandlers) : [],
      closingTechniques: s.closingTechniques ? JSON.parse(s.closingTechniques) : [],
    }))
  } catch (error) {
    console.error("[ScriptSelector] Error:", error)
    return MOCK_SCRIPTS
  }
}

export const ScriptSelector = {
  selectScript,
  getScriptsByBusinessType,
  MOCK_SCRIPTS
}
