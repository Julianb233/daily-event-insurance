import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// GET - Fetch all escalation rules for a config
export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('config_id');

    let result;
    if (configId) {
      result = await sql`
        SELECT * FROM escalation_rules
        WHERE config_id = ${configId}
        ORDER BY priority DESC, created_at DESC
      `;
    } else {
      result = await sql`
        SELECT * FROM escalation_rules
        ORDER BY priority DESC, created_at DESC
      `;
    }

    return NextResponse.json(result || []);
  } catch (error) {
    console.error('Error fetching escalation rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch escalation rules' },
      { status: 500 }
    );
  }
}

// POST - Create new escalation rule
export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const body = await request.json();

    const {
      config_id,
      name,
      description,
      trigger_type,
      trigger_keywords,
      sentiment_threshold,
      time_limit_seconds,
      trigger_intents,
      custom_condition,
      action = 'offer_transfer',
      transfer_to,
      action_message,
      priority = 0
    } = body;

    if (!config_id || !name || !trigger_type) {
      return NextResponse.json(
        { error: 'config_id, name, and trigger_type are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO escalation_rules (
        config_id, name, description, trigger_type, trigger_keywords,
        sentiment_threshold, time_limit_seconds, trigger_intents,
        custom_condition, action, transfer_to, action_message, priority
      ) VALUES (
        ${config_id},
        ${name},
        ${description || null},
        ${trigger_type},
        ${trigger_keywords || null},
        ${sentiment_threshold || null},
        ${time_limit_seconds || null},
        ${trigger_intents || null},
        ${custom_condition || null},
        ${action},
        ${transfer_to || null},
        ${action_message || null},
        ${priority}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating escalation rule:', error);
    return NextResponse.json(
      { error: 'Failed to create escalation rule' },
      { status: 500 }
    );
  }
}

// PUT - Update escalation rule
export async function PUT(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Rule ID required' }, { status: 400 });
    }

    const result = await sql`
      UPDATE escalation_rules SET
        name = COALESCE(${body.name || null}, name),
        description = ${body.description || null},
        trigger_type = COALESCE(${body.trigger_type || null}, trigger_type),
        trigger_keywords = ${body.trigger_keywords || null},
        sentiment_threshold = ${body.sentiment_threshold || null},
        time_limit_seconds = ${body.time_limit_seconds || null},
        trigger_intents = ${body.trigger_intents || null},
        custom_condition = ${body.custom_condition || null},
        action = COALESCE(${body.action || null}, action),
        transfer_to = ${body.transfer_to || null},
        action_message = ${body.action_message || null},
        priority = COALESCE(${body.priority}, priority),
        is_active = COALESCE(${body.is_active}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating escalation rule:', error);
    return NextResponse.json(
      { error: 'Failed to update escalation rule' },
      { status: 500 }
    );
  }
}

// DELETE - Delete escalation rule
export async function DELETE(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Rule ID required' }, { status: 400 });
    }

    await sql`DELETE FROM escalation_rules WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting escalation rule:', error);
    return NextResponse.json(
      { error: 'Failed to delete escalation rule' },
      { status: 500 }
    );
  }
}
