import { NextRequest, NextResponse } from 'next/server';

// GET /api/constructors/[id] - Get constructor details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // TODO: Database - Get constructor by ID with full stats

    const constructor = {
      id,
      name: 'McLaren',
      code: 'MCL',
      engine: 'Mercedes',
      chassis: 'MCL39',
      nationality: 'British',
      base: 'Woking, United Kingdom',
      teamPrincipal: 'Andrea Stella',
      price: 15000000,
      stats: {
        races: 183,
        wins: 183,
        polePositions: 156,
        fastestLaps: 155,
        worldChampionships: 9,
        points: 5472,
      },
      drivers: [
        { id: 'driver-2', name: 'Lando Norris', code: 'NOR', number: 4 },
        { id: 'driver-4', name: 'Oscar Piastri', code: 'PIA', number: 81 },
      ],
    };

    return NextResponse.json({ constructor });
  } catch (error) {
    console.error('Get constructor error:', error);
    return NextResponse.json({ error: 'Failed to get constructor' }, { status: 500 });
  }
}
