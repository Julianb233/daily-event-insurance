
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads, microsites } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

    // Insert into leads table
    const [lead] = await db!.insert(leads).values({
      partnerId,
      micrositeId,
      contactName: name,
      email,
      phone: phone || null,
      source: source || 'checkin-kiosk',
      vertical: 'gym', // Defaulting to gym for this flow, or could be passed from form
      formData: JSON.stringify({ activity, micrositeUrl }),
      status: 'new'
    }).returning();

    return NextResponse.json({ success: true, leadId: lead.id });

  } catch (error) {
    console.error('Check-in API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
