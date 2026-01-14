import { NextRequest, NextResponse } from "next/server"
import type {
  Claim,
  ClaimStatus,
  ClaimType,
  ClaimTimelineStep,
  ClaimDocument,
  ClaimMessage,
  ClaimsAdjuster,
  ResolutionEstimate,
  ClaimsListResponse,
} from "@/types/claims"

// Check dev mode
const isDevMode = !process.env.AUTH_SECRET

// Generate timeline steps based on current status
function generateTimeline(currentStatus: ClaimStatus): ClaimTimelineStep[] {
  const statuses: { status: ClaimStatus; title: string; description: string }[] = [
    { status: 'submitted', title: 'Claim Submitted', description: 'Your claim has been received and logged.' },
    { status: 'under_review', title: 'Under Review', description: 'Our claims team is reviewing your submission.' },
    { status: 'approved', title: 'Approved', description: 'Your claim has been approved for payment.' },
    { status: 'paid', title: 'Payment Sent', description: 'Payment has been processed and sent.' },
  ]

  const statusOrder: ClaimStatus[] = ['submitted', 'under_review', 'approved', 'paid']
  const currentIndex = statusOrder.indexOf(currentStatus)

  return statuses.map((step, index) => ({
    id: `step_${index + 1}`,
    status: step.status,
    title: step.title,
    description: step.description,
    timestamp: index <= currentIndex ? new Date(Date.now() - (currentIndex - index) * 2 * 24 * 60 * 60 * 1000) : null,
    isCompleted: index < currentIndex,
    isCurrent: index === currentIndex,
  }))
}

// Mock adjusters
const mockAdjusters: ClaimsAdjuster[] = [
  {
    id: 'adj_1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@dei-claims.com',
    phone: '+1 (555) 123-4567',
    availability: 'available',
  },
  {
    id: 'adj_2',
    name: 'Michael Chen',
    email: 'michael.chen@dei-claims.com',
    phone: '+1 (555) 234-5678',
    availability: 'busy',
  },
  {
    id: 'adj_3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@dei-claims.com',
    phone: '+1 (555) 345-6789',
    availability: 'available',
  },
]

// Generate mock claims data
function generateMockClaims(): Claim[] {
  const claimTypes: ClaimType[] = ['property_damage', 'bodily_injury', 'equipment_loss', 'event_cancellation', 'liability']
  const statuses: ClaimStatus[] = ['submitted', 'under_review', 'approved', 'paid', 'denied']

  return Array.from({ length: 8 }, (_, i) => {
    const status = statuses[i % 5]
    const type = claimTypes[i % 5]
    const claimedAmount = 500 + i * 250 + Math.floor(Math.random() * 1000)
    const isApproved = status === 'approved' || status === 'paid'
    const isPaid = status === 'paid'
    const approvedAmount = isApproved ? claimedAmount * (0.8 + Math.random() * 0.2) : null

    const messages: ClaimMessage[] = [
      {
        id: `msg_${i}_1`,
        claimId: `claim_${i + 1}`,
        content: 'Thank you for submitting your claim. We have received your documentation and will begin the review process.',
        senderId: 'system',
        senderName: 'Claims System',
        senderRole: 'system',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isRead: true,
      },
      {
        id: `msg_${i}_2`,
        claimId: `claim_${i + 1}`,
        content: 'Hi, I wanted to check on the status of my claim. Is there any additional information needed?',
        senderId: 'customer',
        senderName: 'Customer',
        senderRole: 'customer',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isRead: true,
      },
      {
        id: `msg_${i}_3`,
        claimId: `claim_${i + 1}`,
        content: 'Hello! Your claim is currently under review. We may need additional documentation such as receipts or photos. I will be in touch soon.',
        senderId: mockAdjusters[i % 3].id,
        senderName: mockAdjusters[i % 3].name,
        senderRole: 'adjuster',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isRead: true,
      },
    ]

    const documents: ClaimDocument[] = [
      {
        id: `doc_${i}_1`,
        claimId: `claim_${i + 1}`,
        name: 'incident_photo.jpg',
        type: 'photo',
        url: '/placeholder-document.pdf',
        size: 2450000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        uploadedBy: 'customer',
      },
      {
        id: `doc_${i}_2`,
        claimId: `claim_${i + 1}`,
        name: 'repair_receipt.pdf',
        type: 'receipt',
        url: '/placeholder-document.pdf',
        size: 125000,
        mimeType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        uploadedBy: 'customer',
      },
    ]

    const resolutionEstimate: ResolutionEstimate = {
      averageDays: 7,
      minDays: 5,
      maxDays: 14,
      estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      basedOn: 'similar claims in the last 90 days',
    }

    return {
      id: `claim_${i + 1}`,
      claimNumber: `CLM-2025-${String(i + 1).padStart(5, '0')}`,
      policyId: `policy_${i + 1}`,
      policyNumber: `POL-2025-${String(i + 1).padStart(5, '0')}`,
      customerId: `customer_${i + 1}`,
      customerName: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,

      type,
      status,
      title: getClaimTitle(type, i),
      description: getClaimDescription(type),
      incidentDate: new Date(Date.now() - (14 + i * 3) * 24 * 60 * 60 * 1000),
      reportedDate: new Date(Date.now() - (7 + i * 2) * 24 * 60 * 60 * 1000),

      claimedAmount,
      approvedAmount,
      paidAmount: isPaid ? approvedAmount : null,
      deductible: 100,

      adjuster: status !== 'submitted' ? mockAdjusters[i % 3] : null,

      timeline: generateTimeline(status),
      documents,
      messages,

      resolutionEstimate: status !== 'paid' && status !== 'denied' ? resolutionEstimate : null,
      resolvedAt: isPaid ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) : null,
      resolution: isPaid ? 'Claim approved and payment processed successfully.' : null,

      createdAt: new Date(Date.now() - (10 + i * 2) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    }
  })
}

function getClaimTitle(type: ClaimType, index: number): string {
  const titles: Record<ClaimType, string[]> = {
    property_damage: ['Venue Floor Damage', 'Wall Damage During Event', 'Furniture Damage'],
    bodily_injury: ['Guest Injury - Slip and Fall', 'Participant Injury', 'Minor Injury Claim'],
    equipment_loss: ['Sound Equipment Theft', 'Camera Equipment Damage', 'Rental Equipment Lost'],
    event_cancellation: ['Weather Cancellation', 'Venue Issue Cancellation', 'Vendor No-Show'],
    liability: ['Third Party Property Damage', 'Vendor Dispute', 'Liability Incident'],
    weather_related: ['Storm Damage', 'Rain Delay Costs', 'Weather Cancellation'],
    other: ['Miscellaneous Claim', 'General Incident', 'Other Expense'],
  }

  const options = titles[type] || titles.other
  return options[index % options.length]
}

function getClaimDescription(type: ClaimType): string {
  const descriptions: Record<ClaimType, string> = {
    property_damage: 'Damage to venue property occurred during the event. Photos and repair estimates have been submitted for review.',
    bodily_injury: 'A participant sustained an injury during the event. Medical documentation and incident report have been provided.',
    equipment_loss: 'Equipment was damaged or lost during the event. Receipt and replacement quotes attached.',
    event_cancellation: 'Event was cancelled due to unforeseen circumstances. Documentation of cancellation reason and associated costs included.',
    liability: 'Third-party liability incident occurred. Full details and supporting documentation submitted.',
    weather_related: 'Event impacted by severe weather conditions. Weather reports and cost documentation provided.',
    other: 'Additional expenses incurred during the event. Supporting documentation attached for review.',
  }

  return descriptions[type] || descriptions.other
}

/**
 * GET /api/claims
 * Returns claims for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // In production, we would validate the user session
    // For now, return mock data

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
    const status = searchParams.get('status') as ClaimStatus | null
    const claimId = searchParams.get('id')

    if (isDevMode) {
      console.log('[DEV MODE] Returning mock claims data')
    }

    let claims = generateMockClaims()

    // Single claim lookup
    if (claimId) {
      const claim = claims.find(c => c.id === claimId)
      if (!claim) {
        return NextResponse.json(
          { error: 'Claim not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: claim })
    }

    // Filter by status if provided
    if (status) {
      claims = claims.filter(c => c.status === status)
    }

    // Pagination
    const total = claims.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const paginatedClaims = claims.slice(start, start + pageSize)

    const response: ClaimsListResponse = {
      claims: paginatedClaims,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    }

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('[Claims API] GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/claims
 * Submits a new claim
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { policyId, type, title, description, incidentDate, claimedAmount } = body

    if (!policyId || !type || !title || !description || !incidentDate || !claimedAmount) {
      return NextResponse.json(
        { error: 'Missing required fields', required: ['policyId', 'type', 'title', 'description', 'incidentDate', 'claimedAmount'] },
        { status: 400 }
      )
    }

    // In production, this would create a real claim in the database
    // For now, return a mock created claim
    const newClaim: Claim = {
      id: `claim_new_${Date.now()}`,
      claimNumber: `CLM-2025-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
      policyId,
      policyNumber: `POL-2025-00001`, // Would be looked up from policy
      customerId: 'customer_1',
      customerName: 'Demo Customer',
      customerEmail: 'demo@example.com',

      type,
      status: 'submitted',
      title,
      description,
      incidentDate: new Date(incidentDate),
      reportedDate: new Date(),

      claimedAmount,
      approvedAmount: null,
      paidAmount: null,
      deductible: 100,

      adjuster: null,

      timeline: generateTimeline('submitted'),
      documents: [],
      messages: [
        {
          id: `msg_new_1`,
          claimId: `claim_new_${Date.now()}`,
          content: 'Thank you for submitting your claim. We have received your documentation and will begin the review process within 1-2 business days.',
          senderId: 'system',
          senderName: 'Claims System',
          senderRole: 'system',
          timestamp: new Date(),
          isRead: false,
        },
      ],

      resolutionEstimate: {
        averageDays: 7,
        minDays: 5,
        maxDays: 14,
        estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        basedOn: 'similar claims in the last 90 days',
      },
      resolvedAt: null,
      resolution: null,

      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (isDevMode) {
      console.log('[DEV MODE] Created mock claim:', newClaim.claimNumber)
    }

    return NextResponse.json(
      { success: true, data: newClaim, message: 'Claim submitted successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Claims API] POST Error:', error)
    return NextResponse.json(
      { error: 'Failed to create claim' },
      { status: 500 }
    )
  }
}
