import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { requireAdmin, withAuth } from '@/lib/api-auth';

// GET - Fetch voice agent configuration (ADMIN ONLY)
export async function GET() {
  return withAuth(async () => {
    await requireAdmin();

    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
    if (!connectionString) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = postgres(connectionString, { ssl: 'require' });
    const result = await sql`
      SELECT * FROM voice_agent_config
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (result.length === 0) {
      // Return default config if none exists
      return NextResponse.json({
        id: null,
        name: 'Default Agent',
        is_active: true,
        system_prompt: `You are a helpful AI support assistant for Daily Event Insurance. Your role is to:
- Help users with questions about event insurance coverage
- Assist with getting quotes for events
- Answer questions about policy terms and conditions
- Provide information about coverage options

Guidelines:
- Be friendly, professional, and concise
- If you don't know something, offer to connect them with a human agent
- Keep responses focused and avoid unnecessary filler`,
        greeting_message: 'Hello! Thank you for calling Daily Event Insurance. How can I help you today?',
        voice: 'alloy',
        max_response_length: 150,
        response_style: 'professional',
        language: 'en',
        business_hours: {
          monday: { enabled: true, start: '09:00', end: '17:00' },
          tuesday: { enabled: true, start: '09:00', end: '17:00' },
          wednesday: { enabled: true, start: '09:00', end: '17:00' },
          thursday: { enabled: true, start: '09:00', end: '17:00' },
          friday: { enabled: true, start: '09:00', end: '17:00' },
          saturday: { enabled: false, start: '09:00', end: '17:00' },
          sunday: { enabled: false, start: '09:00', end: '17:00' },
        },
        timezone: 'America/New_York',
        after_hours_behavior: 'voicemail',
        after_hours_message: 'Our office is currently closed. Please leave a message and we\'ll get back to you.',
        fallback_message: 'I apologize, but I\'m unable to help with that. Would you like me to connect you with a team member?',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(result[0]);
  });
}

// PUT - Update voice agent configuration (ADMIN ONLY)
export async function PUT(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin();

    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
    if (!connectionString) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = postgres(connectionString, { ssl: 'require' });
    const body = await request.json();

    if (body.id) {
      // Update existing config
      const result = await sql`
        UPDATE voice_agent_config SET
          name = ${body.name},
          is_active = ${body.is_active},
          system_prompt = ${body.system_prompt},
          greeting_message = ${body.greeting_message},
          voice = ${body.voice},
          max_response_length = ${body.max_response_length},
          response_style = ${body.response_style},
          language = ${body.language},
          business_hours = ${JSON.stringify(body.business_hours)},
          timezone = ${body.timezone},
          after_hours_behavior = ${body.after_hours_behavior},
          after_hours_message = ${body.after_hours_message},
          fallback_message = ${body.fallback_message},
          updated_at = NOW()
        WHERE id = ${body.id}
        RETURNING *
      `;

      if (result.length === 0) {
        return NextResponse.json({ error: 'Config not found' }, { status: 404 });
      }
      return NextResponse.json(result[0]);
    } else {
      // Create new config
      const result = await sql`
        INSERT INTO voice_agent_config (
          name, is_active, system_prompt, greeting_message, voice,
          max_response_length, response_style, language, business_hours,
          timezone, after_hours_behavior, after_hours_message, fallback_message
        ) VALUES (
          ${body.name || 'Default Agent'},
          true,
          ${body.system_prompt},
          ${body.greeting_message},
          ${body.voice || 'alloy'},
          ${body.max_response_length || 150},
          ${body.response_style || 'professional'},
          ${body.language || 'en'},
          ${JSON.stringify(body.business_hours)},
          ${body.timezone || 'America/New_York'},
          ${body.after_hours_behavior || 'voicemail'},
          ${body.after_hours_message},
          ${body.fallback_message}
        )
        RETURNING *
      `;

      return NextResponse.json(result[0], { status: 201 });
    }
  });
}

// POST - Create new voice agent configuration (ADMIN ONLY)
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    await requireAdmin();

    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
    if (!connectionString) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = postgres(connectionString, { ssl: 'require' });
    const body = await request.json();

    const result = await sql`
      INSERT INTO voice_agent_config (
        name, is_active, system_prompt, greeting_message, voice,
        max_response_length, response_style, language, business_hours,
        timezone, after_hours_behavior, after_hours_message, fallback_message
      ) VALUES (
        ${body.name || 'Default Agent'},
        true,
        ${body.system_prompt},
        ${body.greeting_message},
        ${body.voice || 'alloy'},
        ${body.max_response_length || 150},
        ${body.response_style || 'professional'},
        ${body.language || 'en'},
        ${JSON.stringify(body.business_hours)},
        ${body.timezone || 'America/New_York'},
        ${body.after_hours_behavior || 'voicemail'},
        ${body.after_hours_message},
        ${body.fallback_message}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  });
}
