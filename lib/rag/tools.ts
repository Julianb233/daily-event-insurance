
import { type ChatCompletionTool } from 'openai/resources/chat/completions'
import { getSupabaseServerClient } from '../supabase'

/**
 * Tools available to the chatbot
 */
export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'lookup_partner_status',
      description: 'Look up the current status and details of a business partner by their Partner ID. Useful when a user asks "Is my account active?" or "Check my status".',
      parameters: {
        type: 'object',
        properties: {
          partnerId: {
            type: 'string',
            description: 'The unique ID of the partner (e.g., "p_12345")',
          },
        },
        required: ['partnerId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'check_claim_status',
      description: 'Check the status of a specific insurance claim. Useful when a user asks about the progress of their claim.',
      parameters: {
        type: 'object',
        properties: {
          claimId: {
            type: 'string',
            description: 'The unique ID of the claim (e.g., "CLM-98765")',
          },
        },
        required: ['claimId'],
      },
    },
  },
]

/**
 * Execute a tool call
 */
export async function executeTool(name: string, args: any): Promise<string> {
  console.log(`🛠️ Executing tool: ${name}`, args)

  try {
    switch (name) {
      case 'lookup_partner_status':
        return await lookupPartnerStatus(args.partnerId)
      case 'check_claim_status':
        return await checkClaimStatus(args.claimId)
      default:
        return `Error: Tool ${name} not found.`
    }
  } catch (error: any) {
    console.error(`Error executing tool ${name}:`, error)
    return `Error executing tool: ${error.message}`
  }
}

/**
 * Tool Implementation: Lookup Partner
 */
async function lookupPartnerStatus(partnerId: string): Promise<string> {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return "Error: Database connection unavailable."
  }

  // 1. Try to fetch from DB
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', partnerId)
    .single()

  if (error) {
    console.warn(`Partner lookup failed for ${partnerId}:`, error.message)
    // Fallback Mock for Demo/Testing if DB fails (or if ID is "demo")
    if (partnerId === 'demo_partner') {
      return JSON.stringify({
        id: 'demo_partner',
        business_name: "Demo Gym",
        status: "active",
        microsite_url: "https://demo.dailyeventinsurance.com",
        commission_rate: "20%"
      })
    }
    return `Could not find partner with ID ${partnerId}. Error: ${error.message}`
  }

  if (!data) return "Partner not found."
  
  const partner = data as any

  return JSON.stringify({
    id: partner.id,
    business_name: partner.business_name,
    status: partner.status,
    contact: partner.contact_name,
    integration: partner.integration_type
  })
}

/**
 * Tool Implementation: Check Claim Status
 * (Mock implementation for now)
 */
async function checkClaimStatus(claimId: string): Promise<string> {
  // Simulate API call or DB lookup
  // In real app, this would query a 'claims' table
  
  if (claimId.startsWith('CLM-')) {
    // Deterministic mock
    const statuses = ['Processing', 'Approved', 'Requires Information', 'Paid']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    
    return JSON.stringify({
      claim_id: claimId,
      status: randomStatus,
      last_updated: new Date().toISOString().split('T')[0],
      estimated_completion: "5-10 business days"
    })
  }

  return "Claim ID format invalid. Must start with 'CLM-'."
}
