import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

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
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('config_id');
    const supabase = createAdminClient();

    // Get call statistics using RPC or direct query
    let statsQuery = supabase.from('voice_calls').select('*');

    if (configId) {
      statsQuery = statsQuery.eq('agent_config_id', configId);
    }

    const { data: calls, error: callsError } = await statsQuery;

    if (callsError) throw callsError;

    // Calculate statistics from calls
    const allCalls = (calls || []) as VoiceCall[];
    const completedCalls = allCalls.filter(c => c.status === 'completed');
    const missedCalls = allCalls.filter(c => c.status === 'missed');
    const escalatedCalls = allCalls.filter(c => c.escalation_triggered);
    const totalDuration = allCalls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0);
    const avgDuration = allCalls.length > 0 ? Math.round(totalDuration / allCalls.length) : 0;

    // Get recent calls
    const { data: recentCalls, error: recentError } = await supabase
      .from('voice_calls')
      .select('id, room_name, caller_id, status, started_at, ended_at, duration_seconds, escalation_triggered, escalation_reason')
      .order('started_at', { ascending: false })
      .limit(10);

    if (recentError) throw recentError;

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
    const body = await request.json();
    const supabase = createAdminClient();

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

    const insertData: Partial<VoiceCall> = {
      room_name,
      caller_id,
      agent_id,
      status,
      started_at: started_at || new Date().toISOString(),
      ended_at,
      duration_seconds,
      transcript,
      recording_url,
      sentiment_scores,
      topics_detected,
      escalation_triggered,
      escalation_reason,
      agent_config_id,
      metadata
    };

    const { data, error } = await supabase
      .from('voice_calls')
      .insert(insertData as never)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error recording call:', error);
    return NextResponse.json(
      { error: 'Failed to record call' },
      { status: 500 }
    );
  }
}
