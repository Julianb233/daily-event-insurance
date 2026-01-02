'use server';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, isDbConfigured } from '@/lib/db';
import { microsites, micrositeBilling, partners, carrierLicenses } from '@/lib/db/schema';
import { withAuth, requireAdmin } from '@/lib/auth-middleware';
import {
  successResponse,
  paginatedResponse,
  notFoundError,
  serverError,
  validationError
} from '@/lib/api-utils';
import { eq, desc, and, ilike, sql } from 'drizzle-orm';

// Validation schemas
const createMicrositeSchema = z.object({
  partnerId: z.string().uuid(),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, 'Subdomain must be lowercase alphanumeric with hyphens'),
  customDomain: z.string().url().optional().nullable(),
  brandingConfig: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    logoUrl: z.string().url().optional(),
    faviconUrl: z.string().url().optional(),
    headerImages: z.array(z.string().url()).optional(),
    companyName: z.string().optional(),
    tagline: z.string().optional()
  }).optional(),
  features: z.object({
    chatbot: z.boolean().optional(),
    quoteForm: z.boolean().optional(),
    analytics: z.boolean().optional(),
    customPages: z.boolean().optional()
  }).optional(),
  status: z.enum(['pending', 'deploying', 'active', 'suspended', 'archived']).optional()
});

const updateMicrositeSchema = createMicrositeSchema.partial().extend({
  id: z.string().uuid()
});

// Mock data for development
const mockMicrosites = [
  {
    id: 'ms_001',
    partnerId: 'partner_001',
    subdomain: 'summit-fitness',
    customDomain: 'insurance.summitfitness.com',
    brandingConfig: {
      primaryColor: '#FF6B35',
      secondaryColor: '#1A1A2E',
      logoUrl: 'https://example.com/summit-logo.png',
      companyName: 'Summit Fitness',
      tagline: 'Protect Your Peak Performance'
    },
    features: { chatbot: true, quoteForm: true, analytics: true, customPages: false },
    status: 'active',
    deployedAt: new Date('2025-12-15'),
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2025-12-20'),
    partner: { id: 'partner_001', businessName: 'Summit Fitness', vertical: 'gym' }
  },
  {
    id: 'ms_002',
    partnerId: 'partner_002',
    subdomain: 'alpine-resort',
    customDomain: null,
    brandingConfig: {
      primaryColor: '#0EA5E9',
      secondaryColor: '#0F172A',
      logoUrl: 'https://example.com/alpine-logo.png',
      companyName: 'Alpine Mountain Resort',
      tagline: 'Adventure Protected'
    },
    features: { chatbot: true, quoteForm: true, analytics: true, customPages: true },
    status: 'active',
    deployedAt: new Date('2025-11-20'),
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-12-18'),
    partner: { id: 'partner_002', businessName: 'Alpine Mountain Resort', vertical: 'ski-resort' }
  },
  {
    id: 'ms_003',
    partnerId: 'partner_003',
    subdomain: 'glow-wellness',
    customDomain: null,
    brandingConfig: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#1E1B4B',
      logoUrl: 'https://example.com/glow-logo.png',
      companyName: 'Glow Wellness Spa',
      tagline: 'Beauty With Confidence'
    },
    features: { chatbot: true, quoteForm: true, analytics: false, customPages: false },
    status: 'pending',
    deployedAt: null,
    createdAt: new Date('2025-12-28'),
    updatedAt: new Date('2025-12-28'),
    partner: { id: 'partner_003', businessName: 'Glow Wellness Spa', vertical: 'wellness' }
  }
];

const mockBilling = [
  {
    id: 'bill_001',
    micrositeId: 'ms_001',
    monthlyFee: 650,
    operatingCost: 320,
    julianShare: 500,
    margin: 150,
    billingCycle: 'monthly',
    nextBillingDate: new Date('2026-01-15'),
    status: 'active'
  },
  {
    id: 'bill_002',
    micrositeId: 'ms_002',
    monthlyFee: 650,
    operatingCost: 320,
    julianShare: 500,
    margin: 150,
    billingCycle: 'monthly',
    nextBillingDate: new Date('2026-01-20'),
    status: 'active'
  }
];

// GET - List all microsites
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    return requireAdmin(user, async () => {
      try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const partnerId = searchParams.get('partnerId');

        // Development mode - return mock data
        if (!isDbConfigured()) {
          let filtered = [...mockMicrosites];

          if (status) {
            filtered = filtered.filter(m => m.status === status);
          }
          if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(m =>
              m.subdomain.includes(searchLower) ||
              m.brandingConfig?.companyName?.toLowerCase().includes(searchLower)
            );
          }
          if (partnerId) {
            filtered = filtered.filter(m => m.partnerId === partnerId);
          }

          const start = (page - 1) * limit;
          const paged = filtered.slice(start, start + limit);

          return paginatedResponse(paged, filtered.length, page, limit);
        }

        // Production mode - query database
        const offset = (page - 1) * limit;

        let whereConditions = [];

        if (status) {
          whereConditions.push(eq(microsites.status, status));
        }
        if (partnerId) {
          whereConditions.push(eq(microsites.partnerId, partnerId));
        }
        if (search) {
          whereConditions.push(ilike(microsites.subdomain, `%${search}%`));
        }

        const whereClause = whereConditions.length > 0
          ? and(...whereConditions)
          : undefined;

        const [results, countResult] = await Promise.all([
          db!
            .select({
              id: microsites.id,
              partnerId: microsites.partnerId,
              subdomain: microsites.subdomain,
              domain: microsites.domain,
              customDomain: microsites.customDomain,
              siteName: microsites.siteName,
              primaryColor: microsites.primaryColor,
              logoUrl: microsites.logoUrl,
              status: microsites.status,
              launchedAt: microsites.launchedAt,
              createdAt: microsites.createdAt,
              updatedAt: microsites.updatedAt,
              partnerName: partners.businessName,
              partnerBusinessType: partners.businessType
            })
            .from(microsites)
            .leftJoin(partners, eq(microsites.partnerId, partners.id))
            .where(whereClause)
            .orderBy(desc(microsites.createdAt))
            .limit(limit)
            .offset(offset),
          db!
            .select({ count: sql<number>`count(*)` })
            .from(microsites)
            .where(whereClause)
        ]);

        const total = countResult[0]?.count || 0;
        return paginatedResponse(results, total, page, limit);

      } catch (error) {
        console.error('Error fetching microsites:', error);
        return serverError('Failed to fetch microsites');
      }
    });
  });
}

// POST - Create new microsite
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    return requireAdmin(user, async () => {
      try {
        const body = await req.json();
        const validation = createMicrositeSchema.safeParse(body);

        if (!validation.success) {
          return validationError(validation.error.errors);
        }

        const data = validation.data;

        // Development mode
        if (!isDbConfigured()) {
          const newMicrosite = {
            id: `ms_${Date.now()}`,
            ...data,
            status: data.status || 'pending',
            deployedAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          return successResponse(newMicrosite, 'Microsite created successfully', 201);
        }

        // Production - insert into database
        const [newMicrosite] = await db!
          .insert(microsites)
          .values({
            partnerId: data.partnerId,
            subdomain: data.subdomain,
            siteName: data.brandingConfig?.companyName || data.subdomain,
            customDomain: data.customDomain || null,
            primaryColor: data.brandingConfig?.primaryColor || '#14B8A6',
            logoUrl: data.brandingConfig?.logoUrl || null,
            status: data.status || 'building'
          })
          .returning();

        // Create billing record for first month
        const yearMonth = new Date().toISOString().slice(0, 7); // "2026-01" format
        await db!
          .insert(micrositeBilling)
          .values({
            micrositeId: newMicrosite.id,
            yearMonth,
            totalCharge: '650',
            julianShare: '500',
            operatingCost: '150',
            status: 'pending'
          });

        return successResponse(newMicrosite, 'Microsite created successfully', 201);

      } catch (error) {
        console.error('Error creating microsite:', error);
        return serverError('Failed to create microsite');
      }
    });
  });
}

// PATCH - Update microsite
export async function PATCH(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    return requireAdmin(user, async () => {
      try {
        const body = await req.json();
        const validation = updateMicrositeSchema.safeParse(body);

        if (!validation.success) {
          return validationError(validation.error.errors);
        }

        const { id, ...updates } = validation.data;

        // Development mode
        if (!isDbConfigured()) {
          const index = mockMicrosites.findIndex(m => m.id === id);
          if (index === -1) {
            return notFoundError('Microsite not found');
          }

          const updated = { ...mockMicrosites[index], ...updates, updatedAt: new Date() };
          return successResponse(updated, 'Microsite updated successfully');
        }

        // Production - update database
        const [updated] = await db!
          .update(microsites)
          .set({
            ...updates,
            updatedAt: new Date()
          })
          .where(eq(microsites.id, id))
          .returning();

        if (!updated) {
          return notFoundError('Microsite not found');
        }

        return successResponse(updated, 'Microsite updated successfully');

      } catch (error) {
        console.error('Error updating microsite:', error);
        return serverError('Failed to update microsite');
      }
    });
  });
}

// DELETE - Archive microsite
export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    return requireAdmin(user, async () => {
      try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
          return validationError([{ message: 'Microsite ID is required' }]);
        }

        // Development mode
        if (!isDbConfigured()) {
          const index = mockMicrosites.findIndex(m => m.id === id);
          if (index === -1) {
            return notFoundError('Microsite not found');
          }
          return successResponse({ id }, 'Microsite archived successfully');
        }

        // Production - soft delete (archive)
        const [archived] = await db!
          .update(microsites)
          .set({
            status: 'archived',
            updatedAt: new Date()
          })
          .where(eq(microsites.id, id))
          .returning();

        if (!archived) {
          return notFoundError('Microsite not found');
        }

        // Also update billing status
        await db!
          .update(micrositeBilling)
          .set({ status: 'cancelled' })
          .where(eq(micrositeBilling.micrositeId, id));

        return successResponse({ id: archived.id }, 'Microsite archived successfully');

      } catch (error) {
        console.error('Error archiving microsite:', error);
        return serverError('Failed to archive microsite');
      }
    });
  });
}
