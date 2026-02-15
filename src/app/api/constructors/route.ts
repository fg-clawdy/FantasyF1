import { NextRequest, NextResponse } from 'next/server';

// GET /api/constructors - List F1 constructors/teams
export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const nationality = request.nextUrl.searchParams.get('nationality') || '';
    const search = request.nextUrl.searchParams.get('search') || '';
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'name';

    // TODO: Database - Query constructors with filters

    // Simulated data
    const constructors = [
      { id: '1', name: 'McLaren', code: 'MCL', engine: 'Mercedes', chassis: 'MCL39', nationality: 'British', worldWins: 183, championships: 9, currentPoints: 666, price: 15000000 },
      { id: '2', name: 'Ferrari', code: 'FER', engine: 'Ferrari', chassis: 'SF-25', nationality: 'Italian', worldWins: 243, championships: 16, currentPoints: 579, price: 18000000 },
      { id: '3', name: 'Red Bull Racing', code: 'RBR', engine: 'Honda RBPT', chassis: 'RB21', nationality: 'Austrian', worldWins: 97, championships: 6, currentPoints: 650, price: 20000000 },
      { id: '4', name: 'Mercedes', code: 'MER', engine: 'Mercedes', chassis: 'F1 W16', nationality: 'German', worldWins: 125, championships: 8, currentPoints: 468, price: 16000000 },
      { id: '5', name: 'Aston Martin', code: 'AMR', engine: 'Mercedes', chassis: 'AMR25', nationality: 'British', worldWins: 0, championships: 0, currentPoints: 86, price: 8000000 },
      { id: '6', name: 'Williams', code: 'WILL', engine: 'Mercedes', chassis: 'FW47', nationality: 'British', worldWins: 114, championships: 9, currentPoints: 65, price: 7000000 },
      { id: '7', name: 'Alpine', code: 'ALP', engine: 'Renault', chassis: 'A525', nationality: 'French', worldWins: 8, championships: 2, currentPoints: 13, price: 6000000 },
      { id: '8', name: 'Kick Sauber', code: 'KICK', engine: 'Ferrari', chassis: 'C45', nationality: 'Swiss', worldWins: 0, championships: 0, currentPoints: 0, price: 5000000 },
      { id: '9', name: 'Haas', code: 'HAAS', engine: 'Ferrari', chassis: 'VF-25', nationality: 'American', worldWins: 0, championships: 0, currentPoints: 0, price: 4500000 },
      { id: '10', name: 'Racing Bulls', code: 'RB', engine: 'Honda RBPT', chassis: 'VC01', nationality: 'Italian', worldWins: 0, championships: 0, currentPoints: 34, price: 5000000 },
    ];

    let filtered = constructors;

    if (nationality) {
      filtered = filtered.filter((c) => c.nationality.toLowerCase().includes(nationality.toLowerCase()));
    }

    if (search) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === 'points') {
      filtered.sort((a, b) => b.currentPoints - a.currentPoints);
    } else if (sortBy === 'wins') {
      filtered.sort((a, b) => b.worldWins - a.worldWins);
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => b.price - a.price);
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return NextResponse.json({
      constructors: paginated,
      pagination: { total: filtered.length, hasMore: start + limit < filtered.length },
    });
  } catch (error) {
    console.error('Get constructors error:', error);
    return NextResponse.json({ error: 'Failed to get constructors' }, { status: 500 });
  }
}
