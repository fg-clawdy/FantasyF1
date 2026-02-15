import { NextRequest, NextResponse } from 'next/server';

// GET /api/races/[id]/results - View race results
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // TODO: Database - Get race results from Jolpica-f1 API or cache
    // TODO: Calculate fantasy points for each driver

    const race = {
      id,
      name: 'Bahrain Grand Prix',
      date: '2026-03-15T15:00:00Z',
      circuit: 'Bahrain International Circuit',
      laps: 57,
    };

    const results = [
      { position: 1, driverId: 'driver-1', driverName: 'Max Verstappen', team: 'Red Bull Racing', time: '1:32:45.123', points: 25, fastestLap: true },
      { position: 2, driverId: 'driver-3', driverName: 'Lando Norris', team: 'McLaren', time: '1:33:12.456', points: 18, fastestLap: false },
      { position: 3, driverId: 'driver-4', driverName: 'Charles Leclerc', team: 'Ferrari', time: '1:33:18.789', points: 15, fastestLap: false },
      { position: 4, driverId: 'driver-2', driverName: 'Oscar Piastri', team: 'McLaren', time: '1:33:25.012', points: 12, fastestLap: false },
      { position: 5, driverId: 'driver-5', driverName: 'George Russell', team: 'Mercedes', time: '1:33:31.345', points: 10, fastestLap: false },
    ];

    return NextResponse.json({ race, results });
  } catch (error) {
    console.error('Get race results error:', error);
    return NextResponse.json({ error: 'Failed to get race results' }, { status: 500 });
  }
}
