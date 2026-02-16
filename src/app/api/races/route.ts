import { NextRequest, NextResponse } from 'next/server';

// GET /api/races - List race schedule
export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status');
    const year = request.nextUrl.searchParams.get('year') || '2026';

    // TODO: Database - Get races for the year with session times
    // TODO: Calculate race status based on current time

    const races = [
      { id: 'race-1', name: 'Bahrain Grand Prix', round: 1, country: 'Bahrain', circuit: 'Bahrain International Circuit', date: '2026-03-15T15:00:00Z', sessions: { fp1: '2026-03-13T12:00:00Z', fp2: '2026-03-13T16:00:00Z', fp3: '2026-03-14T12:00:00Z', qualifying: '2026-03-14T15:00:00Z', race: '2026-03-15T15:00:00Z' }, status: 'upcoming' },
      { id: 'race-2', name: 'Saudi Arabian Grand Prix', round: 2, country: 'Saudi Arabia', circuit: 'Jeddah Corniche Circuit', date: '2026-03-29T17:00:00Z', sessions: { fp1: '2026-03-27T12:00:00Z', fp2: '2026-03-27T16:00:00Z', fp3: '2026-03-28T12:00:00Z', qualifying: '2026-03-28T15:00:00Z', race: '2026-03-29T17:00:00Z' }, status: 'upcoming' },
      { id: 'race-3', name: 'Australian Grand Prix', round: 3, country: 'Australia', circuit: 'Albert Park Circuit', date: '2026-04-05T05:00:00Z', sessions: { fp1: '2026-04-03T02:00:00Z', fp2: '2026-04-03T06:00:00Z', fp3: '2026-04-04T02:00:00Z', qualifying: '2026-04-04T05:00:00Z', race: '2026-04-05T05:00:00Z' }, status: 'upcoming' },
      { id: 'race-4', name: 'Japanese Grand Prix', round: 4, country: 'Japan', circuit: 'Suzuka International Racing Course', date: '2026-04-12T05:00:00Z', sessions: { fp1: '2026-04-10T02:00:00Z', fp2: '2026-04-10T06:00:00Z', fp3: '2026-04-11T02:00:00Z', qualifying: '2026-04-11T05:00:00Z', race: '2026-04-12T05:00:00Z' }, status: 'upcoming' },
    ];

    const filtered = status ? races.filter((r) => r.status === status) : races;

    return NextResponse.json({ races: filtered, year });
  } catch (error) {
    console.error('Get races error:', error);
    return NextResponse.json({ error: 'Failed to get races' }, { status: 500 });
  }
}