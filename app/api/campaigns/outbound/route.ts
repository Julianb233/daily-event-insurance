'use server'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { successResponse, serverError, validationError } from '@/lib/api-utils'
import { startOutboundSequence, stopOutboundSequence } from '@/lib/email/sequences-outbound'

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
 */
export async function POST(request: NextRequest) {
  try {
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

  } catch (error) {
    console.error('Error starting outbound campaign:', error)
    return serverError('Failed to start campaign')
  }
}

/**
 * DELETE /api/campaigns/outbound
 * Stop an outbound sequence (when prospect replies or converts)
 */
export async function DELETE(request: NextRequest) {
  try {
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

  } catch (error) {
    console.error('Error stopping outbound campaign:', error)
    return serverError('Failed to stop campaign')
  }
}

/**
 * GET /api/campaigns/outbound?leadId=xxx
 * Get status of outbound sequence
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')

    if (!leadId) {
      return validationError('leadId parameter is required')
    }

    const { startOutboundSequence, getOutboundSequenceStatus } = await import('@/lib/email/sequences-outbound')
    const result = await getOutboundSequenceStatus(leadId)

    if (result.error) {
      return serverError(result.error)
    }

    return successResponse({
      sequence: result.sequence,
      emails: result.scheduledEmails,
    })

  } catch (error) {
    console.error('Error fetching campaign status:', error)
    return serverError('Failed to fetch campaign status')
  }
}
