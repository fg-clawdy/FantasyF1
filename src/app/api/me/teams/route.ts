import { NextRequest, NextResponse } from 'next/server';

// GET /api/me/teams - Get current user's teams
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Database - Query teams by user ID

    const teams = [
      {
        id: 'team-1',
        name: 'My F1 Team',
        league: { id: 'league-1', name: 'F1 Fanatics' },
        drivers: [
          { id: 'driver-1', name: 'Max Verstappen', team: 'Red Bull Racing', price: 35000000 },
          { id: 'driver-3', name: 'Charles Leclerc', team: 'Ferrari', price: 30000000 },
          { id: 'driver-4', name: 'Lando Norris', team: 'McLaren', price: 25000000 },
        ],
        value: 95000000,
        totalPoints: 245,
        rank: 3,
      },
    ];

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Get my teams error:', error);
    return NextResponse.json({ error: 'Failed to get teams' }, { status: 500 });
  }
}
