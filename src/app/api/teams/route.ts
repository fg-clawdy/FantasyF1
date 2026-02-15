import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const teamSchema = z.object({
  name: z.string().min(3).max(50),
  leagueId: z.string(),
  drivers: z.array(z.string()).min(3).max(5),
});

// POST /api/teams - Create a fantasy team
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = teamSchema.parse(body);

    // TODO: Database - Check user doesn't already have team in this league
    // TODO: Database - Validate drivers exist and are available
    // TODO: Database - Validate roster rules (max 5 drivers, 1 constructor, max 2 same nationality)
    // TODO: Database - Calculate team value based on drivers
    // TODO: Database - Create team record

    return NextResponse.json({
      message: 'Team created successfully',
      team: {
        id: `team-${Date.now()}`,
        name: validatedData.name,
        leagueId: validatedData.leagueId,
        drivers: validatedData.drivers,
        value: 95000000,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Create team error:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}

// GET /api/teams - List all teams (admin)
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leagueId = request.nextUrl.searchParams.get('leagueId');

    // TODO: Database - Query teams by league

    return NextResponse.json({
      teams: [],
    });
  } catch (error) {
    console.error('Get teams error:', error);
    return NextResponse.json({ error: 'Failed to get teams' }, { status: 500 });
  }
}
