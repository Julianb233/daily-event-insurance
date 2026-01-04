'use server'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { successResponse, serverError, validationError } from '@/lib/api-utils'
import { startOutboundSequence, stopOutboundSequence } from '@/lib/email/sequences-outbound'
import { requireAdmin, withAuth } from '@/lib/api-auth'

// Validation schema for starting an outbound campaign
const startCampaignSchema = z.object({
  leadId: z.string().min(1),
  vertical: z.enum(['gym', 'wellness', 'ski-resort', 'fitness']),
  email: z.string().email(),
  contactName: z.string().min(1),
  companyName: z.string().min(1),
  estimatedRevenue: z.number().positive(),
})

// Validation schema for stopping a campaign
const stopCampaignSchema = z.object({
  leadId: z.string().min(1),
})

/**
 * POST /api/campaigns/outbound
 * Start an outbound email sequence for a prospect
 * SECURITY: Requires admin authentication
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    // Require admin access to manage campaigns
    await requireAdmin()

    const body = await request.json()
    const validation = startCampaignSchema.safeParse(body)

    if (!validation.success) {
      return validationError(validation.error.errors)
    }

    const { leadId, vertical, email, contactName, companyName, estimatedRevenue } = validation.data

    const result = await startOutboundSequence({
      leadId,
      vertical,
      email,
      contactName,
      companyName,
      estimatedRevenue,
    })

    if (!result.success) {
      return serverError(result.error || 'Failed to start campaign')
    }

    return successResponse(
      {
        sequenceId: result.sequenceId,
        vertical,
        emailCount: 3, // initial + 2 follow-ups
        schedule: [
          { step: 1, delay: 'immediate', type: 'initial' },
          { step: 2, delay: '3 days', type: 'followUp1' },
          { step: 3, delay: '7 days', type: 'followUp2' },
        ]
      },
      'Outbound campaign started successfully',
      201
    )
  })
}

/**
 * DELETE /api/campaigns/outbound
 * Stop an outbound sequence (when prospect replies or converts)
 * SECURITY: Requires admin authentication
 */
export async function DELETE(request: NextRequest) {
  return withAuth(async () => {
    // Require admin access to manage campaigns
    await requireAdmin()

    const body = await request.json()
    const validation = stopCampaignSchema.safeParse(body)

    if (!validation.success) {
      return validationError(validation.error.errors)
    }

    const { leadId } = validation.data

    const result = await stopOutboundSequence(leadId)

    if (!result.success) {
      return serverError(result.error || 'Failed to stop campaign')
    }

    return successResponse(
      { leadId, stopped: true },
      'Campaign stopped successfully'
    )
  })
}

/**
 * GET /api/campaigns/outbound?leadId=xxx
 * Get status of outbound sequence
 * SECURITY: Requires admin authentication
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    // Require admin access to view campaign status
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')

    if (!leadId) {
      return validationError('leadId parameter is required')
    }

    const { getOutboundSequenceStatus } = await import('@/lib/email/sequences-outbound')
    const result = await getOutboundSequenceStatus(leadId)

    if (result.error) {
      return serverError(result.error)
    }

    return successResponse({
      sequence: result.sequence,
      emails: result.scheduledEmails,
    })
  })
}
