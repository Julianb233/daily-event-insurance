
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
      status: sureResult?.success ? 'qualified' : 'new'
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
