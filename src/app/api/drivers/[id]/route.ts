import { NextRequest, NextResponse } from 'next/server';

// GET /api/drivers/[id] - Get driver details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // TODO: Database - Get driver by ID with full stats

    const driver = {
      id,
      name: 'Max Verstappen',
      code: 'VER',
      number: 1,
      team: { id: 'team-rbr', name: 'Red Bull Racing' },
      nationality: 'Netherlands',
      dateOfBirth: '1997-09-30',
      price: 35000000,
      stats: {
        races: 200,
        wins: 62,
        podiums: 102,
        polePositions: 40,
        fastestLaps: 26,
        worldChampionships: 3,
        avgFinish: 2.4,
        points: 2847,
      },
      recentForm: ['1', '2', '1', '3', '1'],
    };

    return NextResponse.json({ driver });
  } catch (error) {
    console.error('Get driver error:', error);
    return NextResponse.json({ error: 'Failed to get driver' }, { status: 500 });
  }
}
