import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const joinSchema = z.object({
  code: z.string().length(6),
});

// POST /api/leagues/[id]/join - Join a league via code
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { code } = joinSchema.parse(body);

    // TODO: Database - Find league by code (case-insensitive)
    // TODO: Database - Check league exists and is joinable
    // TODO: Database - Check league hasn't reached max teams (2-10)
    // TODO: Database - Check user doesn't already have a team
    // TODO: Database - For private leagues, verify invitation exists
    // TODO: Database - Create fantasy team in league
    // TODO: Database - Create activity log entry

    return NextResponse.json({
      message: 'Successfully joined league',
      team: {
        id: `team-${Date.now()}`,
        name: 'My F1 Team',
        leagueId: id,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Join league error:', error);
    return NextResponse.json({ error: 'Failed to join league' }, { status: 500 });
  }
}
