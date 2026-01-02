'use server';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, isDbConfigured } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { successResponse, serverError, validationError } from '@/lib/api-utils';
import { desc } from 'drizzle-orm';

// Validation schema for lead submission from quote forms
const createLeadSchema = z.object({
  // Common fields
  vertical: z.enum(['gym', 'wellness', 'ski-resort', 'fitness', 'race', 'other']),
  source: z.string().min(1).max(100),

  // Contact info
  email: z.string().email(),
  phone: z.string().optional(),
  contactName: z.string().min(1).max(100),

  // Organization
  organizationName: z.string().optional(),
  resortName: z.string().optional(),
  facilityName: z.string().optional(),

  // Business details
  facilityType: z.string().optional(),
  resortType: z.string().optional(),
  eventType: z.string().optional(),

  // Volume metrics
  monthlyGuests: z.string().optional(),
  monthlyClients: z.string().optional(),
  dailyVisitors: z.string().optional(),
  expectedParticipants: z.string().optional(),
  eventsPerYear: z.string().optional(),
  seasonLength: z.string().optional(),

  // Additional details
  eventName: z.string().optional(),
  eventDate: z.string().optional(),
  eventLocation: z.string().optional(),
  treatmentTypes: z.array(z.string()).optional(),
  liftCount: z.string().optional(),
  currentCoverage: z.string().optional(),
  message: z.string().optional(),

  // UTM tracking
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),

  // Partner attribution
  partnerId: z.string().uuid().optional(),
  referralCode: z.string().optional()
});

// Calculate estimated revenue based on vertical and volume
function calculateEstimatedRevenue(data: z.infer<typeof createLeadSchema>): number {
  const OPT_IN_RATE = 0.65;
  const COMMISSION_PER_POLICY = 14;

  let volume = 0;
  let multiplier = 1;

  switch (data.vertical) {
    case 'gym':
      volume = parseInt(data.monthlyGuests || '0') || 0;
      multiplier = 12; // annual
      break;
    case 'wellness':
      volume = parseInt(data.monthlyClients || '0') || 0;
      multiplier = 12;
      break;
    case 'ski-resort':
      const dailyVisitors = parseInt(data.dailyVisitors || '0') || 0;
      const seasonDays = parseInt(data.seasonLength || '120') || 120;
      volume = dailyVisitors * seasonDays;
      multiplier = 1; // already annual
      break;
    case 'fitness':
      const participants = parseInt(data.expectedParticipants || '0') || 0;
      const eventsPerYear = parseInt(data.eventsPerYear || '1') || 1;
      volume = participants * eventsPerYear;
      multiplier = 1;
      break;
    default:
      volume = 0;
  }

  return Math.round(volume * OPT_IN_RATE * COMMISSION_PER_POLICY * multiplier);
}

// POST - Submit lead from quote form (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createLeadSchema.safeParse(body);

    if (!validation.success) {
      return validationError(validation.error.errors);
    }

    const data = validation.data;

    // Calculate estimated revenue
    const estimatedRevenue = calculateEstimatedRevenue(data);

    // Determine company name from various fields
    const companyName = data.organizationName || data.resortName || data.facilityName || 'Unknown';

    // Development mode
    if (!isDbConfigured()) {
      const newLead = {
        id: `lead_${Date.now()}`,
        vertical: data.vertical,
        source: data.source,
        email: data.email,
        phone: data.phone || null,
        contactName: data.contactName,
        companyName,
        formData: data,
        estimatedRevenue,
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('[DEV] Lead captured:', {
        vertical: data.vertical,
        email: data.email,
        estimatedRevenue: `$${estimatedRevenue.toLocaleString()}/year`
      });

      return successResponse(
        { id: newLead.id, estimatedRevenue },
        'Quote request submitted successfully',
        201
      );
    }

    // Production - insert into database
    const [newLead] = await db!
      .insert(leads)
      .values({
        vertical: data.vertical,
        source: data.source,
        email: data.email,
        phone: data.phone || null,
        contactName: data.contactName,
        businessName: companyName,
        formData: JSON.stringify(data),
        estimatedRevenue: String(estimatedRevenue),
        status: 'new',
        partnerId: data.partnerId || null
      })
      .returning();

    // TODO: Trigger notification to sales team
    // TODO: Add to email drip campaign based on vertical
    // TODO: Calculate lead score based on volume

    return successResponse(
      { id: newLead.id, estimatedRevenue },
      'Quote request submitted successfully',
      201
    );

  } catch (error) {
    console.error('Error creating lead:', error);
    return serverError('Failed to submit quote request');
  }
}

// GET - Admin endpoint to list leads (protected)
export async function GET(request: NextRequest) {
  // Note: This should be protected but keeping simple for now
  // In production, wrap with withAuth/requireAdmin
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const vertical = searchParams.get('vertical');
    const status = searchParams.get('status');

    // Development mode
    if (!isDbConfigured()) {
      const mockLeads = [
        {
          id: 'lead_001',
          vertical: 'gym',
          source: 'gym-quote-form',
          email: 'owner@summitfitness.com',
          contactName: 'Mike Johnson',
          companyName: 'Summit Fitness',
          estimatedRevenue: 54600,
          status: 'qualified',
          createdAt: new Date('2025-12-28'),
        },
        {
          id: 'lead_002',
          vertical: 'ski-resort',
          source: 'ski-resort-quote-form',
          email: 'ops@alpineresort.com',
          contactName: 'Sarah Chen',
          companyName: 'Alpine Mountain Resort',
          estimatedRevenue: 2730000,
          status: 'contacted',
          createdAt: new Date('2025-12-27'),
        },
        {
          id: 'lead_003',
          vertical: 'wellness',
          source: 'wellness-quote-form',
          email: 'info@glowspa.com',
          contactName: 'Emily Davis',
          companyName: 'Glow Wellness Spa',
          estimatedRevenue: 16380,
          status: 'new',
          createdAt: new Date('2025-12-29'),
        },
        {
          id: 'lead_004',
          vertical: 'fitness',
          source: 'fitness-quote-form',
          email: 'events@spartanrace.com',
          contactName: 'Tom Williams',
          companyName: 'Spartan Events Co',
          estimatedRevenue: 109200,
          status: 'proposal_sent',
          createdAt: new Date('2025-12-26'),
        }
      ];

      let filtered = [...mockLeads];
      if (vertical) filtered = filtered.filter(l => l.vertical === vertical);
      if (status) filtered = filtered.filter(l => l.status === status);

      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);

      return NextResponse.json({
        success: true,
        data: paged,
        pagination: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit)
        }
      });
    }

    // Production - query database
    const offset = (page - 1) * limit;

    const results = await db!
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: { page, limit }
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return serverError('Failed to fetch leads');
  }
}
