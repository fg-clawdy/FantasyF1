import { NextRequest, NextResponse } from 'next/server';

// GET /api/drivers - List F1 drivers
export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const team = request.nextUrl.searchParams.get('team') || '';
    const search = request.nextUrl.searchParams.get('search') || '';
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'number';

    // TODO: Database - Query drivers with filters
    // TODO: Calculate stats: win rate, podium rate, retirement rate

    // Simulated data
    const drivers = [
      { id: '1', name: 'Max Verstappen', code: 'VER', number: 1, team: 'Red Bull Racing', country: 'Netherlands', price: 35000000, totalPoints: 575, wins: 19, podiums: 21, avgFinish: 1.8 },
      { id: '2', name: 'Lando Norris', code: 'NOR', number: 4, team: 'McLaren', country: 'UK', price: 25000000, totalPoints: 374, wins: 4, podiums: 15, avgFinish: 4.2 },
      { id: '3', name: 'Charles Leclerc', code: 'LEC', number: 16, team: 'Ferrari', country: 'Monaco', price: 30000000, totalPoints: 356, wins: 5, podiums: 12, avgFinish: 4.5 },
      { id: '4', name: 'Oscar Piastri', code: 'PIA', number: 81, team: 'McLaren', country: 'Australia', price: 18000000, totalPoints: 292, wins: 2, podiums: 9, avgFinish: 5.1 },
      { id: '5', name: 'George Russell', code: 'RUS', number: 63, team: 'Mercedes', country: 'UK', price: 28000000, totalPoints: 245, wins: 2, podiums: 7, avgFinish: 5.8 },
      { id: '6', name: 'Lewis Hamilton', code: 'HAM', number: 44, team: 'Ferrari', country: 'UK', price: 32000000, totalPoints: 223, wins: 2, podiums: 5, avgFinish: 6.2 },
      { id: '7', name: 'Carlos Sainz', code: 'SAI', number: 55, team: 'Williams', country: 'Spain', price: 22000000, totalPoints: 200, wins: 2, podiums: 5, avgFinish: 6.5 },
      { id: '8', name: 'Fernando Alonso', code: 'ALO', number: 14, team: 'Aston Martin', country: 'Spain', price: 20000000, totalPoints: 70, wins: 0, podiums: 2, avgFinish: 9.8 },
    ];

    let filtered = drivers;
    
    if (team) {
      filtered = filtered.filter((d) => d.team.toLowerCase().includes(team.toLowerCase()));
    }
    
    if (search) {
      filtered = filtered.filter((d) => 
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.code.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'points') {
      filtered.sort((a, b) => b.totalPoints - a.totalPoints);
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'wins') {
      filtered.sort((a, b) => b.wins - a.wins);
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return NextResponse.json({
      drivers: paginated,
      pagination: { total: filtered.length, hasMore: start + limit < filtered.length },
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    return NextResponse.json({ error: 'Failed to get drivers' }, { status: 500 });
  }
}
