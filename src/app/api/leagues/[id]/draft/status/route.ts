import { NextRequest, NextResponse } from 'next/server';

// GET /api/leagues/[id]/draft/status - View live draft status
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // TODO: Database - Get draft status for league
    // TODO: Calculate time remaining for current pick
    // TODO: Determine current turn based on order

    return NextResponse.json({
      league: {
        id,
        name: 'F1 Fanatics',
      },
      status: 'active',
      currentRound: 4,
      totalRounds: 12,
      currentTurn: {
        teamId: 'team-2',
        teamName: 'Speed Racing',
        order: 4,
        timeRemaining: 45,
        maxTime: 60,
      },
      picks: [
        { round: 1, pick: 1, teamId: 'team-1', driverId: 'driver-1', driverName: 'Max Verstappen', timestamp: '2026-02-15T08:30:00Z' },
        { round: 1, pick: 2, teamId: 'team-2', driverId: 'driver-3', driverName: 'Lando Norris', timestamp: '2026-02-15T08:31:00Z' },
        { round: 2, pick: 1, teamId: 'team-1', driverId: 'driver-2', driverName: 'Charles Leclerc', timestamp: '2026-02-15T08:35:00Z' },
      ],
      nextCloseCondition: 'FP1',
      scheduledCloseDate: '2026-02-20T06:00:00Z',
    });
  } catch (error) {
    console.error('Get draft status error:', error);
    return NextResponse.json({ error: 'Failed to get draft status' }, { status: 500 });
  }
}
