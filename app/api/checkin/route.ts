
import { NextRequest, NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { quotes, partners, partnerProducts } from '@/lib/db/schema';
import { successResponse, serverError } from '@/lib/api-utils';
import { eq } from 'drizzle-orm';
import { rateLimitResponse } from '@/lib/rate-limit';

// POST - Member Check-in from Microsite
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { partnerId, name, email, phone, activity, source, micrositeUrl } = body;

        // Basic validation
        if (!partnerId || !email || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Default values if DB not configured or defaults needed
        const defaultPremium = 4.99;
        const defaultCommissionRate = 0.35; // 35%

        let premium = defaultPremium;
        let commission = defaultPremium * defaultCommissionRate;
        let coverageType = 'accident_medical'; // Default coverage

        if (isDbConfigured() && db) {
            // Fetch partner product settings to get accurate price
            const productSettings = await db
                .select()
                .from(partnerProducts)
                .where(eq(partnerProducts.partnerId, partnerId))
                .limit(1);

            if (productSettings.length > 0) {
                premium = parseFloat(productSettings[0].customerPrice || '4.99');
                coverageType = productSettings[0].productType;
            }

            // Calculate commission (simplified: fixed % for now, ideally fetch from commission_tiers)
            // For this MVP, we use the standard 35% unless overridden
            commission = premium * defaultCommissionRate;

            // Create Quote Record (Pending Transaction)
            const [newQuote] = await db.insert(quotes).values({
                partnerId,
                quoteNumber: `QT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                eventType: activity || 'checkin',
                eventDate: new Date(),
                participants: 1,
                coverageType,
                premium: String(premium.toFixed(2)),
                commission: String(commission.toFixed(2)),
                customerName: name,
                customerEmail: email,
                status: 'pending',
                metadata: JSON.stringify({ source, phone, micrositeUrl })
            }).returning();

            console.log(`[CheckIn] Created pending quote ${newQuote.id} for ${email}. Premium: $${premium}, Comm: $${commission}`);

            return successResponse({
                quoteId: newQuote.id,
                premium,
                redirectUrl: `${micrositeUrl}/quote?id=${newQuote.id}`
            }, 'Check-in successful', 201);
        } else {
            // Mock for dev/no-db
            console.log(`[CheckIn] Mock Quote Created for ${email}. Premium: $${premium}`);
            return successResponse({
                quoteId: 'mock-quote-id',
                premium,
                redirectUrl: `${micrositeUrl}/quote?id=mock-quote-id`
            }, 'Check-in successful (Mock)', 201);
        }

    } catch (error) {
        console.error('Error processing check-in:', error);
        return serverError('Failed to process check-in');
    }
}
