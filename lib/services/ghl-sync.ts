/**
 * GoHighLevel Sync Service
 * Syncs leads and contacts between our system and GHL
 */

const GHL_API_KEY = process.env.GHL_API_KEY || ""
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || ""
const GHL_BASE_URL = "https://rest.gohighlevel.com/v1"

interface GHLContact {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  tags?: string[]
  customFields?: Record<string, string>
}

async function ghlRequest(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${GHL_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${GHL_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers
    }
  })

  if (!res.ok) {
    throw new Error(`GHL API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function createGHLContact(contact: GHLContact): Promise<string | null> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.warn("[GHL] Not configured, skipping contact creation")
    return null
  }

  try {
    const result = await ghlRequest("/contacts", {
      method: "POST",
      body: JSON.stringify({
        ...contact,
        locationId: GHL_LOCATION_ID
      })
    })

    console.log("[GHL] Created contact:", result.contact?.id)
    return result.contact?.id || null
  } catch (error) {
    console.error("[GHL] Create contact error:", error)
    return null
  }
}

export async function updateGHLContact(contactId: string, updates: Partial<GHLContact>): Promise<boolean> {
  if (!GHL_API_KEY) return false

  try {
    await ghlRequest(`/contacts/${contactId}`, {
      method: "PUT",
      body: JSON.stringify(updates)
    })
    return true
  } catch (error) {
    console.error("[GHL] Update contact error:", error)
    return false
  }
}

export async function addTagToContact(contactId: string, tags: string[]): Promise<boolean> {
  if (!GHL_API_KEY) return false

  try {
    await ghlRequest(`/contacts/${contactId}/tags`, {
      method: "POST",
      body: JSON.stringify({ tags })
    })
    return true
  } catch (error) {
    console.error("[GHL] Add tags error:", error)
    return false
  }
}

export async function updatePipelineStage(contactId: string, pipelineId: string, stageId: string): Promise<boolean> {
  if (!GHL_API_KEY) return false

  try {
    await ghlRequest("/opportunities", {
      method: "POST",
      body: JSON.stringify({
        contactId,
        pipelineId,
        pipelineStageId: stageId,
        locationId: GHL_LOCATION_ID
      })
    })
    return true
  } catch (error) {
    console.error("[GHL] Update pipeline error:", error)
    return false
  }
}

export async function syncLeadToGHL(lead: {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  businessName?: string
  status: string
}): Promise<string | null> {
  const tags = ["daily-event-insurance", `status-${lead.status}`]
  if (lead.businessName) tags.push("has-business")

  return createGHLContact({
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    tags,
    customFields: {
      business_name: lead.businessName || "",
      lead_id: lead.id
    }
  })
}

export const GHLSync = {
  createContact: createGHLContact,
  updateContact: updateGHLContact,
  addTags: addTagToContact,
  updatePipelineStage,
  syncLead: syncLeadToGHL
}
