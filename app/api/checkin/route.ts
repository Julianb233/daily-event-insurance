
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads, microsites } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

import { submitToSure } from '@/lib/sure/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partnerId, name, email, phone, activity, source, micrositeUrl } = body;

    if (!partnerId || !name || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to resolve microsite ID from partner ID
    let micrositeId: string | null = null;
    const [microsite] = await db!
        .select({ id: microsites.id })
        .from(microsites)
        .where(eq(microsites.partnerId, partnerId))
        .limit(1);
    
    if (microsite) {
        micrositeId = microsite.id;
    }

    // Call Sure API (Mock)
    let sureResult = null;
    try {
        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ') || 'Unknown';
        
        sureResult = await submitToSure({
            firstName,
            lastName,
            email,
            phone,
            activity: activity || 'gym-visit',
            micrositeUrl: micrositeUrl || '',
            partnerId
        });

        // Use ! operator to assert db is not null since we're in a route handler
        if (sureResult && sureResult.success && db) {
           await db.insert(policies).values({
               partnerId,
               policyNumber: sureResult.policyNumber!,
               eventType: activity || 'gym-visit',
               eventDate: new Date(),
               participants: 1, // Individual check-in
               coverageType: 'liability', // Default for check-ins
               premium: sureResult.premium?.toString() || '0',
               commission: (sureResult.premium || 0 * 0.1).toString(), // 10% commission
               status: 'active',
               effectiveDate: sureResult.effectiveDate || new Date(),
               expirationDate: sureResult.expirationDate || new Date(Date.now() + 24*60*60*1000),
               customerEmail: email,
               customerName: name,
               customerPhone: phone,
               certificateIssued: true
           });
        }
    } catch (e) {
        console.error('Sure API Failed:', e);
        // Continue to save lead even if Sure fails, but log it
    }

    // Insert into leads table
    const [lead] = await db!.insert(leads).values({
      partnerId,
      micrositeId,
      contactName: name,
      email,
      phone: phone || null,
      source: source || 'checkin-kiosk',
      vertical: 'gym', 
      formData: JSON.stringify({ 
          activity, 
          micrositeUrl,
          surePolicy: sureResult 
      }),
      status: sureResult?.success ? 'won' : 'new' // Mark as 'won' if policy purchased
    }).returning();

    return NextResponse.json({ success: true, leadId: lead.id, policy: sureResult });

  } catch (error) {
    console.error('Check-in API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
