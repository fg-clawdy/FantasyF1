import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

function generateLeagueCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const leagueSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
  privacy: z.enum(['public', 'private']),
  size: z.number(),
  scoringRules: z.record(z.string(), z.number()).optional(),
  draftMethod: z.enum(['manual', 'snake', 'random']),
  draftCloseCondition: z.enum(['FP1', 'FP2', 'FP3', 'qualifying', 'manual']),
  scheduledDraftDate: z.string().optional(),
  pickTimer: z.number().optional(),
});

// POST /api/leagues - Create a new league
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = leagueSchema.parse(body);
    const leagueCode = generateLeagueCode();

    // TODO: Database - Create league with validatedData, leagueCode, creatorId
    // TODO: Database - Ensure unique 6-character league code
    // TODO: Database - Validate scoring rules prevent scores over 100 per race

    return NextResponse.json({
      message: 'League created successfully',
      league: {
        id: `league-${Date.now()}`,
        name: validatedData.name,
        code: leagueCode,
        size: validatedData.size,
        privacy: validatedData.privacy,
        draftMethod: validatedData.draftMethod,
        draftCloseCondition: validatedData.draftCloseCondition,
        pickTimer: validatedData.pickTimer ?? 60,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Create league error:', error);
    return NextResponse.json({ error: 'Failed to create league' }, { status: 500 });
  }
}

// GET /api/leagues - List public leagues with search/filter
export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const search = request.nextUrl.searchParams.get('search') || '';
    const filter = request.nextUrl.searchParams.get('filter') || 'all';
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'recent';

    // TODO: Database - Query public leagues with pagination
    // TODO: Database - Fuzzy search by name (use fuzzywuzzy or similar)
    // TODO: Database - Filter by team count (show full/available)
    // TODO: Database - Sort by most recent/most members/name
    // TODO: Database - Private leagues only visible to members

    // Simulated data
    const leagues = [
      {
        id: 'league-1',
        name: 'F1 Fanatics',
        description: 'A league for true F1 enthusiasts',
        code: 'ABC123',
        memberCount: 6,
        maxMembers: 10,
        creator: { username: 'max_fan' },
        privacy: 'public',
        createdAt: '2026-02-01T10:00:00Z',
      },
      {
        id: 'league-2',
        name: 'Racing Legends',
        description: 'Legendary F1 league',
        code: 'XYZ789',
        memberCount: 8,
        maxMembers: 10,
        creator: { username: 'lewis_fan' },
        privacy: 'public',
        createdAt: '2026-02-05T14:30:00Z',
      },
    ];

    return NextResponse.json({
      leagues,
      pagination: { total: leagues.length, hasMore: false },
    });
  } catch (error) {
    console.error('Get leagues error:', error);
    return NextResponse.json({ error: 'Failed to get leagues' }, { status: 500 });
  }
}
