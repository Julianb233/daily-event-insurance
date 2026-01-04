import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

// Type for voice call records
interface VoiceCall {
  id: string;
  room_name: string;
  caller_id: string;
  agent_id?: string;
  status: string;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
  transcript?: string;
  recording_url?: string;
  sentiment_scores?: Record<string, number>;
  topics_detected?: string[];
  escalation_triggered: boolean;
  escalation_reason?: string;
  agent_config_id?: string;
  metadata?: Record<string, unknown>;
}

// GET - Fetch voice agent analytics
export async function GET(request: NextRequest) {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
    if (!connectionString) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = postgres(connectionString, { ssl: 'require' });
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('config_id');

    // Get all calls (with optional config filter)
    let allCalls: VoiceCall[];
    if (configId) {
      allCalls = await sql`
        SELECT * FROM voice_calls
        WHERE agent_config_id = ${configId}
      ` as VoiceCall[];
    } else {
      allCalls = await sql`SELECT * FROM voice_calls` as VoiceCall[];
    }

    // Calculate statistics from calls
    const completedCalls = allCalls.filter(c => c.status === 'completed');
    const missedCalls = allCalls.filter(c => c.status === 'missed');
    const escalatedCalls = allCalls.filter(c => c.escalation_triggered);
    const totalDuration = allCalls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0);
    const avgDuration = allCalls.length > 0 ? Math.round(totalDuration / allCalls.length) : 0;

    // Get recent calls
    const recentCalls = await sql`
      SELECT id, room_name, caller_id, status, started_at, ended_at,
             duration_seconds, escalation_triggered, escalation_reason
      FROM voice_calls
      ORDER BY started_at DESC
      LIMIT 10
    `;

    // Calculate calls by hour (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const callsByHour: Record<number, number> = {};
    allCalls
      .filter(c => new Date(c.started_at) >= sevenDaysAgo)
      .forEach(c => {
        const hour = new Date(c.started_at).getHours();
        callsByHour[hour] = (callsByHour[hour] || 0) + 1;
      });

    // Calculate calls by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const callsByDayMap: Record<string, number> = {};
    allCalls
      .filter(c => new Date(c.started_at) >= thirtyDaysAgo)
      .forEach(c => {
        const date = new Date(c.started_at).toISOString().split('T')[0];
        callsByDayMap[date] = (callsByDayMap[date] || 0) + 1;
      });

    const callsByDay = Object.entries(callsByDayMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);

    // Get escalation reasons
    const escalationReasonsMap: Record<string, number> = {};
    escalatedCalls
      .filter(c => c.escalation_reason)
      .forEach(c => {
        const reason = c.escalation_reason!;
        escalationReasonsMap[reason] = (escalationReasonsMap[reason] || 0) + 1;
      });

    const escalationReasons = Object.entries(escalationReasonsMap)
      .map(([escalation_reason, count]) => ({ escalation_reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      summary: {
        total_calls: allCalls.length,
        completed_calls: completedCalls.length,
        missed_calls: missedCalls.length,
        escalated_calls: escalatedCalls.length,
        avg_duration: avgDuration,
        total_duration: totalDuration
      },
      recentCalls: recentCalls || [],
      callsByHour,
      callsByDay,
      escalationReasons
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// POST - Record call analytics (called by voice agent after call ends)
export async function POST(request: NextRequest) {
  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
    if (!connectionString) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = postgres(connectionString, { ssl: 'require' });
    const body = await request.json();

    const {
      room_name,
      caller_id,
      agent_id,
      status = 'completed',
      started_at,
      ended_at,
      duration_seconds,
      transcript,
      recording_url,
      sentiment_scores,
      topics_detected,
      escalation_triggered = false,
      escalation_reason,
      agent_config_id,
      metadata
    } = body;

    const result = await sql`
      INSERT INTO voice_calls (
        room_name, caller_id, agent_id, status, started_at, ended_at,
        duration_seconds, transcript, recording_url, sentiment_scores,
        topics_detected, escalation_triggered, escalation_reason,
        agent_config_id, metadata
      ) VALUES (
        ${room_name},
        ${caller_id},
        ${agent_id || null},
        ${status},
        ${started_at || new Date().toISOString()},
        ${ended_at || null},
        ${duration_seconds || null},
        ${transcript || null},
        ${recording_url || null},
        ${sentiment_scores ? JSON.stringify(sentiment_scores) : null},
        ${topics_detected || null},
        ${escalation_triggered},
        ${escalation_reason || null},
        ${agent_config_id || null},
        ${metadata ? JSON.stringify(metadata) : null}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error recording call:', error);
    return NextResponse.json(
      { error: 'Failed to record call' },
      { status: 500 }
    );
  }
}
