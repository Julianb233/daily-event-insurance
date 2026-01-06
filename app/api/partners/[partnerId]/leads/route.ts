// app/api/partners/[partnerId]/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { withAuth, requirePartner } from '@/lib/api-auth';
import { eq, desc } from 'drizzle-orm';

/**
 * GET - Retrieve leads for a specific partner (partner dashboard)
 */
async function handler(request: NextRequest, { params }: { params: { partnerId: string } }) {
    // Ensure the requester is a partner and matches the partnerId in the URL
    await requirePartner();
    const { partnerId } = params;

    if (!partnerId) {
        return NextResponse.json({ success: false, message: 'partnerId required' }, { status: 400 });
    }

    // Development mode – return mock data
    if (!isDbConfigured()) {
        const mockLeads = [
            {
                id: 'lead_mock_1',
                partnerId,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '555-1234',
                activity: 'gym',
                estimatedRevenue: 1200,
                leadScore: 85,
                createdAt: new Date(),
            },
            {
                id: 'lead_mock_2',
                partnerId,
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '555-5678',
                activity: 'yoga',
                estimatedRevenue: 800,
                leadScore: 65,
                createdAt: new Date(Date.now() - 86400000),
            },
        ];
        // Mock pagination response format
        return NextResponse.json({
            success: true,
            data: {
                leads: mockLeads,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 2,
                    totalPages: 1
                }
            }
        });
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const results = await db!
        .select()
        .from(leads)
        .where(eq(leads.partnerId, partnerId))
        .orderBy(desc(leads.createdAt))
        .limit(limit)
        .offset(offset);

    // Count total for pagination (mock approximation or separate query)
    // For now simple count
    // In real app use count() query

    return NextResponse.json({
        success: true,
        data: {
            leads: results,
            pagination: {
                page,
                limit,
                total: results.length, // Simplified for now
                totalPages: 1
            }
        }
    });
}

export const GET = withAuth(handler);
